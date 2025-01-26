const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const { listAvailableDungeons } = require('../../utils/economy');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { gainExp } = require(path.join(__dirname, "../../utils/levelup"));
const { dungeon } = require(path.join(__dirname, "../../utils/dungeon"));
const { dungeonText } = require(path.join(__dirname, "../../data/dungeontext"));
const dataLocks = require(path.join(__dirname, "../../utils/datalocks"));
const { dungeonList } = require(path.join(__dirname, "../../data/dungeonlist"));
const { shopItems } = require(path.join(__dirname, "../../data/shopItems"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dungeon')
        .setDescription('Visits a dungeon!')
        .addStringOption(option => option.setName("dungeon").setDescription("Which dungeon to enter?")),
    async execute(interaction) {
        const { userInfo, notifications } = await economyUtils.prefix(interaction);
        const dungeonInput = interaction.options.getString("dungeon");
        let targetDungeon;
        const availableDungeons = listAvailableDungeons(userInfo);
        if (!dungeonInput) {
            let list = [];
            for (let i of availableDungeons) {
                let completed = economyUtils.dungeonCompleted(userInfo, dungeonList[i]);
                list.push(`${i}: ${dungeonList[i].content} ${completed ? "(complete)" : ""}`);
            }
            economyUtils.displayList(interaction, list);
        } else {

            if (!economyUtils.inventoryHasItem(userInfo.inventory, 1010)) {
                await interaction.reply(`${notifications}Please buy a pair of Adventurer's boots with \`/buy Adventurer's boots\` before starting a dungeon. It costs $500.`);
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
            dataLocks.lockData(interaction.user.id);
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

                        stringToSend += `\nGained ${economyUtils.formatMoney(moneyGained)}`;
                        const levelUpResults = gainExp(userInfo, expGained);
                        stringToSend += `\n${levelUpResults}`;
                        userInfo.moneyOnHand += moneyGained;
                        
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
                        if (!previouslyCompleted) {
                            stringToSend += `\nFirst time completion rewards:`
                            moneyGained += targetDungeonInfo.firstCompleteRewards.money;
                            expGained += targetDungeonInfo.firstCompleteRewards.exp;
                            stringToSend += `\n${economyUtils.formatMoney(targetDungeonInfo.firstCompleteRewards.money)} and ${targetDungeonInfo.firstCompleteRewards.exp} exp`;

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
                                    userInfo = economyUtils.addToInventory(userInfo,
                                        itemObj.id,
                                        quantityAdded);
                                    const shopItemObj = shopItems[itemObj.id]
                                    stringToSend += ` ${shopItemObj.name} x${quantityAdded}`
                                }
                            }
                        }
                        await success.response.edit({ content: stringToSend, components: [] });
                    } else {
                        await success.response.edit({ content: `${notifications}Dungeon not completed.`, components: [] });
                    }
                    dataLocks.unlockData(interaction.user.id);
                    fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${interaction.user.id}`), JSON.stringify(userInfo));

                },
                    fail => {
                        fail.response.edit({ content: "Dungeon not completed", components: [] });
                        dataLocks.unlockData(interaction.user.id);
                        fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${interaction.user.id}`), JSON.stringify(userInfo));
                    });
            } catch (e) {
                console.log(e);
                dataLocks.unlockData(interaction.user.id);
            }
        }

    },
};
