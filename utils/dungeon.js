const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { shopItems } = require(path.join(__dirname, "../data/shopItems"));
const { createUserData } = require(path.join(__dirname, "/createUserData"));
const scriptingUtils = require(path.join(__dirname, "/scripting"));
const { monsters } = require(path.join(__dirname, "../data/monsters"));

module.exports = {
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
            let battleWon = true;
            function processCurrentIndex(itemIndex) {
                let stringToReply = "";
                let currentStep = script[itemIndex];
                switch (currentStep.type) {
                    case "text":
                        stringToReply = script[itemIndex].content;
                        break;
                    case "prebattle":
                        const enemyStats = generateEnemyStats(itemIndex);
                        const playerStats = userInfo.combat;
                        stringToReply = `You are about to enter battle with a ${currentStep.content.name}\`
Your stats:         | Enemy stats:        
Health: ${playerStats.health}${scriptingUtils.generateSpaces(20 - playerStats.health.toString().length - 8)}| Health: ${enemyStats.health}${scriptingUtils.generateSpaces(20 - enemyStats.health.toString().length - 8)}
Attack: ${playerStats.attack}${scriptingUtils.generateSpaces(20 - playerStats.attack.toString().length - 8)}| Attack: ${enemyStats.attack}${scriptingUtils.generateSpaces(20 - enemyStats.attack.toString().length - 8)}
Block: ${playerStats.block}${scriptingUtils.generateSpaces(20 - playerStats.block.toString().length - 7)}| Block: ${enemyStats.block}${scriptingUtils.generateSpaces(20 - enemyStats.block.toString().length - 7)}
\`
${enemyStats.block > playerStats.attack ? "The enemy has higher block than your attack. **You will not win the fight**." : ""}`;
                        break;                       
                }
                return stringToReply;
            }
            function generateEnemyStats(itemIndex) {
                const enemyName = script[itemIndex].content.name;
                const enemyLevel = script[itemIndex].content.level ?? 1;
                const enemyStats = scriptingUtils.deepClone(monsters[enemyName]);
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
                return enemyStats;
            }
            function attack(dmg, target) {
                target.shield -= dmg;
                if (target.shield < 0) {
                    target.health += target.shield;
                    target.shield = 0;
                }
                return target;
            }
            function battle(itemIndex) {
                const enemyName = script[itemIndex].content.name;

                const playerStats = userInfo.combat;

                if (!(enemyName in monsters)) {
                    throw new Error("Enemy not found!")
                }

                const enemyStats = generateEnemyStats(itemIndex);

                while (true) {
                    playerStats.shield = playerStats.block;
                    enemyStats.shield = enemyStats.block;
                    attack(playerStats.attack, enemyStats);
                    attack(enemyStats.attack, playerStats);
                    if (playerStats.health <= 0) {
                        playerStats.health = 0;
                        return false;
                    } else if (enemyStats.health <= 0) {
                        return true;
                    }
                }
            }
            let str = processCurrentIndex(itemIndex);
            let response = await interaction.reply({
                content: str,
                components: [row]
            });
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
                            await buttons.update({ content: "You are finished", components: [] });
                            res({
                                completed: true,
                                userInfo: userInfo,
                                response: response
                            });
                        } else {
                            if (script[itemIndex].type == "battle") {
                                let won = battle(itemIndex);
                                if (!won) {
                                    await buttons.update({ content: "Lost battle. Exiting dungeon.", components: [] });
                                    await scriptingUtils.wait(2000);
                                    res({
                                        completed: false,
                                        userInfo: userInfo,
                                        response: response
                                    });
                                    weAreFinished = true;
                                } else {
                                    buttons.update({content: `Congratulations! You won!
Health remaining: ${userInfo.combat.health}
Attack: ${userInfo.combat.attack}
Block: ${userInfo.combat.block}`, components: [row]})
                                }
                            } else {
                                let stringToReply = processCurrentIndex(itemIndex);
                                buttons.update({ content: stringToReply, components: [row] });
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