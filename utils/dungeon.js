const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('node:path');
const scriptingUtils = require(path.join(__dirname, "/scripting"));
const { hasEffect } = require(path.join(__dirname, "/effects"));
const { monsters } = require(path.join(__dirname, "../data/monsters"));
const economyUtils = require(path.join(__dirname, "/economy"));
const { shopItems } = require(path.join(__dirname, "../data/shopItems"));
const {getCombatProbability} = require(path.join(__dirname, "/combat"));

function battle(playerData, enemyData, maxRounds) {
    let player = playerData.combat;
    const enemy = enemyData.combat;
    //apply relevant player effects
    let effects = hasEffect(playerData, ["redrose"]);
    if ("redrose" in effects && effects.redrose > 0 && !enemyData.isRaid) {
        enemy.health *= 0.75;
    }

    if (player.health <= 0) {
        return false;
    }
    if (enemy.health <= 0) {
        return true;
    }

    function attack(attacker, target, doubleStrikeTriggered = 0) { //the chances of doublestrike activating decrease with each time it is activated.
        if (getCombatProbability(attacker, "doublestrike") && Math.random() < (1 / doubleStrikeTriggered)) attack(attacker, target, doubleStrikeTriggered + 1);
        if (!getCombatProbability(attacker, "totalblock")) target.shield -= attacker.attack;
        if (target.shield < 0) {
            target.health += target.shield;
            target.shield = 0;
        } else {
            target.health--; //Minimum damage of one.
        }
    }

    let roundCounter = 0;

    let playerIsTheFastest = false;
    let fastest, slowest;
    if (player.speed >= enemy.speed) {
        fastest = player;
        slowest = enemy;
        playerIsTheFastest = true;
    } else {
        fastest = enemy;
        slowest = player;
    }

    while (true) {
        //Can't defeat the enemy in the specified rounds? You probably can't defeat the enemy. You lose.
        if (roundCounter >= maxRounds) {
            return false;
        }

        fastest.shield = fastest.block;
        slowest.shield = slowest.block;
        attack(fastest, slowest);
        if (roundCounter == 0) { }
        attack(fastest, slowest);

        if (slowest.health <= 0) {
            slowest.health = 0;
            delete fastest.shield;
            delete slowest.shield;
            return playerIsTheFastest;
        }

        attack(slowest, fastest);
        if (roundCounter == 0)
            attack(slowest, fastest);

        if (fastest.health <= 0) {
            fastest.health = 0;
            delete fastest.shield;
            delete slowest.shield;
            return !playerIsTheFastest;
        }
        roundCounter++;
    }

}
const probabilityCaps = {
    doublestrike: 0.7,
    totalblock: 0.5
}

function compareStatsString(playerStats, equipmentStats, enemyStats, roundsToCalculate = 999) {
    playerStats = scriptingUtils.deepClone(playerStats);
    let initialPlayerHealth = playerStats.health;
    enemyStats = scriptingUtils.deepClone(enemyStats);
    let initialEnemyHealth = enemyStats.health;
    //simulate a battle with fake player and enemy stats

    let won = battle({ combat: playerStats, effects: [] }, { combat: enemyStats }, roundsToCalculate);
    let dmgDealtToEnemy = initialEnemyHealth - enemyStats.health;
    let dmgDealtToPlayer = initialPlayerHealth - playerStats.health;

    return `\`Your stats:              | Enemy stats:
Health: ${initialPlayerHealth} (max: ${playerStats.maxHealth})${scriptingUtils.generateSpaces(25 - initialPlayerHealth.toString().length - playerStats.maxHealth.toString().length - 16)}| Health: ${initialEnemyHealth}${scriptingUtils.generateSpaces(20 - initialEnemyHealth.toString().length - 8)}
Attack: ${playerStats.attack}${scriptingUtils.generateSpaces(25 - playerStats.attack.toString().length - 8)}| Attack: ${enemyStats.attack}${scriptingUtils.generateSpaces(20 - enemyStats.attack.toString().length - 8)}
Block: ${playerStats.block}${scriptingUtils.generateSpaces(25 - playerStats.block.toString().length - 7)}| Block: ${enemyStats.block}${scriptingUtils.generateSpaces(20 - enemyStats.block.toString().length - 7)}\`
Expected outcome: **${won ? "victory" : "defeat"}**. ${playerStats.speed >= enemyStats.speed ? "**You** will attack first." : "**The enemy** will attack first."}
${enemyStats.block >= playerStats.attack ? "The enemy has block higher or equal to your attack. **You will only deal one damage per turn**." : ""}
You will deal around ${dmgDealtToEnemy} damage. You will take around ${dmgDealtToPlayer} damage (${initialPlayerHealth}HP -> ${Math.max(playerStats.health, 0)}HP)`;
};

module.exports = {
    battle,
    compareStatsString,
    dungeon: async function (interaction, script, userInfo) {
        return new Promise(async (res, rej) => {
            let weAreFinished = false;
            const previous = new ButtonBuilder()
                .setCustomId('Previous')
                .setLabel('Stop')
                .setStyle(ButtonStyle.Secondary);

            const next = new ButtonBuilder()
                .setCustomId('Next')
                .setLabel('Continue')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(previous, next);

            let itemIndex = 0;
            const playerStats = userInfo.combat;

            function processCurrentIndex(itemIndex) {
                let stringToReply = "";
                let imageToReplyWith = "";
                let currentStep = script[itemIndex];
                switch (currentStep.type) {
                    case "text":
                        stringToReply = script[itemIndex].content;
                        if (script[itemIndex].img) imageToReplyWith = path.join(__dirname, `../data/dungeonimg/${script[itemIndex].img}`);
                        break;
                    case "prebattle":
                        const enemyStats = generateEnemyStats(itemIndex);
                        stringToReply = `You are about to enter battle with a ${currentStep.content.name}
${compareStatsString(playerStats, userInfo.equipment, enemyStats)}`;
                        if (enemyStats.img) {
                            imageToReplyWith = path.join(__dirname, `../data/dungeonimg/${enemyStats.img}`);
                        }
                        break;
                }

                return {
                    string: stringToReply,
                    image: imageToReplyWith
                };
            }
            function generateEnemyStats(itemIndex) {
                const enemyName = script[itemIndex].content.name;
                const enemyLevel = script[itemIndex].content.level ?? 1;
                const enemyStats = scriptingUtils.deepClone(monsters[enemyName]);
                if (enemyStats.img) delete enemyStats.img
                for (let stat in enemyStats) {
                    enemyStats[stat] += Math.floor(enemyStats[stat] * (enemyLevel / 3))
                }
                if ("enemyMultipliers" in script[itemIndex].content) {
                    for (let stat in enemyStats) {
                        enemyStats[stat] = Math.floor(enemyStats[stat] * (script[itemIndex].content.enemyMultipliers[stat] ?? 1));
                    }
                }
                for (let stat in enemyStats)
                    if (enemyStats[stat] <= 0)
                        enemyStats[stat] = 1;
                enemyStats.img = monsters[enemyName].img;
                return enemyStats;
            }
            let response;
            let results = processCurrentIndex(itemIndex);
            let stringToReply = results.string;
            if (results.image) {
                response = await interaction.reply({
                    content: stringToReply,
                    components: [row],
                    files: [{ attachment: results.image }]
                })
            } else {
                response = await interaction.reply({
                    content: stringToReply,
                    components: [row],
                    files: [],
                });
            }
            const collectorFilter = i => i.user.id === interaction.user.id;
            async function updateButtons() {
                try {
                    let buttons = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
                    if (buttons.customId === 'Previous') {
                        await buttons.update({ content: "Dungeon stopped. Resetting your data and returning.", components: [] });
                        await scriptingUtils.wait(2000);
                        res({
                            completed: false,
                            userInfo: userInfo,
                            response: response
                        });
                        weAreFinished = true;
                    } else if (buttons.customId === 'Next') {
                        itemIndex++
                        if (itemIndex == script.length) {
                            await buttons.update({ content: "Dungeon finished! Exiting dungeon...", components: [] });
                            await scriptingUtils.wait(2000);
                            weAreFinished = true;
                            res({
                                completed: true,
                                userInfo: userInfo,
                                response: response
                            });
                        } else {
                            if (script[itemIndex].type == "battle") {
                                const enemyStats = generateEnemyStats(itemIndex);
                                let oldHealth = userInfo.combat.health;
                                let won = battle(userInfo, { combat: enemyStats });
                                if (!won) {
                                    await buttons.update({ content: "Lost battle. Resetting your data and exiting dungeon...", components: [] });
                                    await scriptingUtils.wait(2000);
                                    weAreFinished = true;
                                    res({
                                        completed: false,
                                        userInfo: userInfo,
                                        response: response
                                    });
                                } else {
                                    buttons.update({
                                        content: `Congratulations! You won!
\`Health remaining: ${userInfo.combat.health} (took ${oldHealth - userInfo.combat.health} damage)\``, components: [row]
                                    })
                                }
                            } else if (script[itemIndex].type === "itemRequired") {
                                const item = script[itemIndex].content;
                                if (economyUtils.inventoryHasItem(userInfo.inventory, item)) {
                                    economyUtils.removeFromInventory(userInfo, item);
                                    await buttons.update({ content: `Used 1x ${shopItems[item].name}.`});
                                } else {
                                    await buttons.update({ content: `You do not have a ${shopItems[item].name}. Resetting your data and exiting dungeon...` , components: []});
                                    await scriptingUtils.wait(2000);
                                    weAreFinished = true;
                                    res({
                                        completed: false,
                                        userInfo: userInfo,
                                        response: response
                                    });
                                }
                            } else {
                                let results = processCurrentIndex(itemIndex);
                                let stringToReply = results.string;
                                if (userInfo.combat.health <= 20) {
                                    stringToReply += "**You are low on health. Buy and use a healing item. To see healing items, go /shop healing**"
                                }
                                if (results.image) {
                                    buttons.update({
                                        content: stringToReply,
                                        components: [row],
                                        files: [{ attachment: results.image }]
                                    })
                                } else {
                                    buttons.update({
                                        content: stringToReply,
                                        components: [row],
                                        files: [],
                                    });
                                }
                            }
                        }
                        updateButtons();
                    }
                } catch (e) {
                    console.log(e);
                    if (!weAreFinished) {
                        await response.edit({ content: "Timed out. Please start again", components: [] });
                        rej({
                            completed: false,
                            userInfo: userInfo,
                            response: response
                        });
                    }
                }
            }
            updateButtons();
        },
        );
    }
}