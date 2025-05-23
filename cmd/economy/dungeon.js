const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const { listAvailableDungeons } = require('../../utils/economy');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { gainExp } = require(path.join(__dirname, "../../utils/levelup"));
const { dungeon } = require(path.join(__dirname, "../../utils/dungeon"));
const { dungeonText } = require(path.join(__dirname, "../../data/dungeontext"));
const { dungeonList } = require(path.join(__dirname, "../../data/dungeonlist"));
const { shopItems } = require(path.join(__dirname, "../../data/shopItems"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { saveData, lockData, unlockData } = require(path.join(__dirname, "../../utils/userdata"));
const { generateDungeonList } = require(path.join(__dirname, "./dungeonlist"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dungeon')
        .setDescription('Visits a dungeon!')
        .addStringOption(option => option.setName("dungeon").setDescription("Which dungeon to enter?")),
    async execute(interaction) {
        const { userInfo, notifications } = await economyUtils.prefix(interaction);
        let dungeonInput = interaction.options.getString("dungeon");
        const availableDungeons = listAvailableDungeons(userInfo);
        if (!dungeonInput) {
            economyUtils.displayList(interaction, [notifications, ...generateDungeonList(userInfo, true)]);
        } else {
            let exp = /^["']?(.*?)["']?$/
            const match = dungeonInput.match(exp)
            dungeonInput = match[1];
            let targetDungeon;
            if (!economyUtils.inventoryHasItem(userInfo.inventory, 1010)) {
                await interaction.reply(`${notifications}Please buy a map with \`/buy Adventurer's map\` before starting a dungeon. It costs $500.`);
                return;
            }

            let dungeonFound = false;
            for (let i of availableDungeons) {
                if (i.toLowerCase() == dungeonInput.toLowerCase()) {
                    dungeonFound = true;
                    targetDungeon = i;
                    break;
                }
            }
            if (!dungeonFound) {
                await interaction.reply(`${notifications}That dungeon is not found or you do not have it unlocked. See the available dungeons with \`/dungeon\` or \`/dungeonlist\`.`);
                return;
            }
            const targetDungeonInfo = dungeonList[targetDungeon];

            if ("requirements" in targetDungeonInfo) {
                if ("level" in targetDungeonInfo.requirements && userInfo.level < targetDungeonInfo.requirements.level) {
                    await interaction.reply(`${notifications}You do not meet the level requirements to do this dungeon. Required: ${targetDungeonInfo.requirements.level}. You: ${userInfo.level}`);
                    return;
                }
            }
            lockData(interaction.user.id);
            try {
                dungeon(interaction, dungeonText[targetDungeon], userInfo).then(async success => {
                    if (success.completed) {
                        let stringToSend = `${notifications}Dungeon completed!`
                        let previouslyCompleted = economyUtils.dungeonCompleted(userInfo, targetDungeonInfo);
                        if (!previouslyCompleted)
                            userInfo.dungeonsCompleted.push({
                                name: targetDungeon,
                                seriesName: dungeonList[targetDungeon].seriesName,
                                seriesNumber: dungeonList[targetDungeon].seriesNumber
                            });
                        let moneyGained = targetDungeonInfo.completeRewards.money;
                        let expGained = targetDungeonInfo.completeRewards.exp;

                        if (moneyGained) {
                            stringToSend += `\nGained ${scriptingUtils.formatMoney(moneyGained)}`;
                            userInfo.moneyOnHand += moneyGained;
                        }
                        if (expGained) {
                            const levelUpResults = gainExp(userInfo, expGained);
                            stringToSend += `\n${levelUpResults}`;
                        }

                        let firstStringAdded = false;
                        if ("item" in targetDungeonInfo.completeRewards) {
                            for (let item in targetDungeonInfo.completeRewards.item) {
                                const itemObj = targetDungeonInfo.completeRewards.item[item];
                                if ("probability" in itemObj && Math.random() > itemObj.probability) continue;
                                let quantityAdded;
                                if (typeof itemObj.quantity == "number") {
                                    quantityAdded = itemObj.quantity;
                                } else if (typeof itemObj.quantity == "object") {
                                    quantityAdded = scriptingUtils.randIntBetween(itemObj.quantity[0], itemObj.quantity[1]);
                                }
                                if (quantityAdded > 0 && !firstStringAdded) {
                                    stringToSend += `\nYou gained the following items:`;
                                    firstStringAdded = true;
                                }
                                economyUtils.addToInventory(userInfo,
                                    itemObj.id,
                                    quantityAdded);
                                const shopItemObj = shopItems[itemObj.id]
                                stringToSend += ` ${shopItemObj.name} x${quantityAdded}`
                            }
                        }
                        if (!previouslyCompleted && targetDungeonInfo.firstCompleteRewards) {
                            stringToSend += `\nFirst time completion rewards:`
                            if (targetDungeonInfo.firstCompleteRewards.money) moneyGained += targetDungeonInfo.firstCompleteRewards.money;
                            if (targetDungeonInfo.firstCompleteRewards.exp) expGained += targetDungeonInfo.firstCompleteRewards.exp;
                            stringToSend += `\n${scriptingUtils.formatMoney(targetDungeonInfo.firstCompleteRewards.money)} and ${targetDungeonInfo.firstCompleteRewards.exp} exp`;

                            if ("item" in targetDungeonInfo.firstCompleteRewards) {
                                stringToSend += `\nFirst time completion items:`
                                for (let item in targetDungeonInfo.firstCompleteRewards.item) {
                                    const itemObj = targetDungeonInfo.firstCompleteRewards.item[item];
                                    if ("probability" in itemObj && Math.random() > itemObj.probability) continue;
                                    let quantityAdded;
                                    if (typeof itemObj.quantity == "number") {
                                        quantityAdded = itemObj.quantity;
                                    } else if (typeof itemObj.quantity == "object") {
                                        quantityAdded = scriptingUtils.randIntBetween(itemObj.quantity[0], itemObj.quantity[1]);
                                    }
                                    economyUtils.addToInventory(userInfo,
                                        itemObj.id,
                                        quantityAdded);
                                    console.log(userInfo.inventory);
                                    const shopItemObj = shopItems[itemObj.id]
                                    stringToSend += ` ${shopItemObj.name} x${quantityAdded}`
                                }
                            }
                        }
                        saveData(userInfo, interaction.user.id);
                        await success.response.edit({ content: stringToSend, components: [] });
                    } else {
                        await success.response.edit({ content: `${notifications}Dungeon not completed.`, components: [] });
                    }
                    unlockData(interaction.user.id);

                },
                    fail => {
                        fail.response.edit({ content: "Dungeon not completed", components: [] });
                        unlockData(interaction.user.id);
                        saveData(userInfo, interaction.user.id);
                    });
            } catch (e) {
                console.log(e);
                unlockData(interaction.user.id);
            }
        }

    },
};
