const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { shopItems } = require(path.join(__dirname, "../data/shopItems"));
const { createUserData } = require(path.join(__dirname, "/createUserData"));
const scriptingUtils = require(path.join(__dirname, "/scripting"));
const { monsters } = require(path.join(__dirname, "../data/monsters"));
const economyUtils = require(path.join(__dirname, "/economy"));
function battle(player, enemy, maxRounds) {
    function attack(dmg, target) {
        target.shield -= dmg;
        if (target.shield < 0) {
            target.health += target.shield;
            target.shield = 0;
        } else {
            target.health--; //Minimum damage of one.
        }
        return target;
    }
    let roundCounter = 0;
    while (true) {
        //Can't defeat the enemy in the specified rounds? You probably can't defeat the enemy. You lose.
        if (roundCounter >= maxRounds) return false;

        player.shield = player.block;
        enemy.shield = enemy.block;
        attack(player.attack, enemy);
        if (enemy.health <= 0) {
            enemy.health = 0;
            return true;
        }

        attack(enemy.attack, player);
        if (player.health <= 0) {
            player.health = 0;
            return false;
        }
        roundCounter++;

    }
}
function compareStatsString(playerStats, enemyStats) {
    return ` \`Your stats:              | Enemy stats:
Health: ${playerStats.health} (max: ${playerStats.maxHealth})${scriptingUtils.generateSpaces(25 - playerStats.health.toString().length - playerStats.maxHealth.toString().length - 16)}| Health: ${enemyStats.health}${scriptingUtils.generateSpaces(20 - enemyStats.health.toString().length - 8)}
Attack: ${playerStats.attack}${scriptingUtils.generateSpaces(25 - playerStats.attack.toString().length - 8)}| Attack: ${enemyStats.attack}${scriptingUtils.generateSpaces(20 - enemyStats.attack.toString().length - 8)}
Block: ${playerStats.block}${scriptingUtils.generateSpaces(25 - playerStats.block.toString().length - 7)}| Block: ${enemyStats.block}${scriptingUtils.generateSpaces(20 - enemyStats.block.toString().length - 7)}\`
${enemyStats.block >= playerStats.attack ? "The enemy has block higher or equal to your attack. **You will only deal damage of one per turn**" : ""}`;
};
module.exports = {
    battle: battle,
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
            const playerStats = economyUtils.generateUserStats(userInfo);

            function processCurrentIndex(itemIndex) {
                let stringToReply = "";
                let imageToReplyWith = "";
                let currentStep = script[itemIndex];
                switch (currentStep.type) {
                    case "text":
                        stringToReply = script[itemIndex].content;
                        if (script[itemIndex].img) imageToReplyWith = path.join(__dirname, `../ data / dungeonimg / ${script[itemIndex].img} `);
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