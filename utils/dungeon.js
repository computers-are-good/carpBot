const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('node:path');
const scriptingUtils = require(path.join(__dirname, "/scripting"));
const { monsters } = require(path.join(__dirname, "../data/monsters"));
function battle(player, enemy, maxRounds) {
    function attack(attacker, target) {
        if (getCombatProbability(attacker, "doublestrike")) attack(attacker, enemy);
        if (!getCombatProbability(attacker, "totalblock")) target.shield -= attacker.attack;
        if (target.shield < 0) {
            target.health += target.shield;
            target.shield = 0;
        } else {
            target.health--; //Minimum damage of one.
        }
        return target;
    }
    let roundCounter = 0;
    if (player.health <= 0) return false;

    let fastest, slowest;
    if (player.speed >= enemy.speed) {
        fastest = player;
        slowest = enemy;
    } else {
        fastest = enemy;
        slowest = player;
    }
    while (true) {
        //Can't defeat the enemy in the specified rounds? You probably can't defeat the enemy. You lose.
        if (roundCounter >= maxRounds) return false;

        fastest.shield = fastest.block;
        slowest.shield = slowest.block;
        attack(fastest, slowest);
        if (roundCounter == 0)
            attack(fastest, slowest);

        if (slowest.health <= 0) {
            slowest.health = 0;
            delete fastest.shield;
            delete slowest.shield;
            return true;
        }

        attack(slowest, fastest);
        if (roundCounter == 0)
            attack(slowest, fastest);

        if (fastest.health <= 0) {
            fastest.health = 0;
            delete fastest.shield;
            delete slowest.shield;
            return false;
        }
        roundCounter++;
    }
}
const probabilityCaps = {
    doublestrike: 0.7,
    totalblock: 0.5
}
function addCombatProbability(userData, name, probability) {
    const combat = userData.combat.probabilities;
    if (name in combat) {
        combat[name] += probability;
    } else {
        combat[name] = probability;
    }
    if (combat[name] > probabilityCaps[name]) combat[name] = probabilityCaps[name];
}
function getCombatProbability(combatObj, probability) { //returns true if the effect should trigger. Returns false if otherwise
    const prob = combatObj.probabilities;
    if (!prob) return false;
    if (!(probability in prob)) return false;
    if (prob[probability] < Math.random()) return true;
    return false;
}

function compareStatsString(playerStats, enemyStats) {
    let difficultyMsg = "even"
    const expectedPlayerDamage = playerStats.attack - enemyStats.block;
    const expectedEnemyDamage = enemyStats.attack - playerStats.block;
    const difficultyScore = expectedPlayerDamage - expectedEnemyDamage;
    if (difficultyScore < -5) difficultyMsg = "difficult";
    if (difficultyScore < -30) difficultyMsg = "arduous";
    if (difficultyScore > 5) difficultyMsg = "easy";
    if (difficultyScore > 30) difficultyMsg = "very easy"

    return `\`Your stats:              | Enemy stats:
Health: ${playerStats.health} (max: ${playerStats.maxHealth})${scriptingUtils.generateSpaces(25 - playerStats.health.toString().length - playerStats.maxHealth.toString().length - 16)}| Health: ${enemyStats.health}${scriptingUtils.generateSpaces(20 - enemyStats.health.toString().length - 8)}
Attack: ${playerStats.attack}${scriptingUtils.generateSpaces(25 - playerStats.attack.toString().length - 8)}| Attack: ${enemyStats.attack}${scriptingUtils.generateSpaces(20 - enemyStats.attack.toString().length - 8)}
Block: ${playerStats.block}${scriptingUtils.generateSpaces(25 - playerStats.block.toString().length - 7)}| Block: ${enemyStats.block}${scriptingUtils.generateSpaces(20 - enemyStats.block.toString().length - 7)}\`
Expected difficulty: **${difficultyMsg}**. ${playerStats.speed >= enemyStats.speed ? "**You** will attack first." : "**The enemy** will attack first."}
${enemyStats.block >= playerStats.attack ? "The enemy has block higher or equal to your attack. **You will only deal damage of one per turn**" : ""}`;
};

module.exports = {
    battle,
    compareStatsString,
    addCombatProbability,
    getCombatProbability,
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
${compareStatsString(playerStats, enemyStats)}`;
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
                        await buttons.update({ content: "Dungeon stopped. Returning.", components: [] });
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
                                let won = battle(playerStats, enemyStats);
                                if (!won) {
                                    await buttons.update({ content: "Lost battle. Exiting dungeon...", components: [] });
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
\`Health remaining: ${userInfo.combat.health}\``, components: [row]
                                    })
                                }
                            } else {
                                let results = processCurrentIndex(itemIndex);
                                let stringToReply = results.string;
                                if (userInfo.health <= 20) {
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