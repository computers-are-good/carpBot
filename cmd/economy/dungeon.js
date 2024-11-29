const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const { listAvailableDungeons } = require('../../utils/economy');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { dungeon } = require(path.join(__dirname, "../../utils/dungeon"));
const { dungeonText } = require(path.join(__dirname, "../../data/dungeontext"));
const dataLocks = require(path.join(__dirname, "../../utils/datalocks"));
const { dungeonList } = require(path.join(__dirname, "../../data/dungeonlist"));
const { calculateLevelUp } = require(path.join(__dirname, "../../utils/calculateLevelUp"));
const { shopItems } = require(path.join(__dirname, "../../data/shopItems"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dungeon')
        .setDescription('Visits a dungeon!')
        .addStringOption(option => option.setName("dungeon").setDescription("Which dungeon to enter?")),
    async execute(interaction) {
        userInfo = await economyUtils.prefix(interaction);
        const targetDungeon = interaction.options.getString("dungeon");
        const availableDungeons = listAvailableDungeons(userInfo);
            let canDoDungeon = false;
            for (let i of availableDungeons) {
                if (i.toLowerCase() == targetDungeon.toLowerCase()) {
                    canDoDungeon = true;
                    break;
                }
            }

            if (canDoDungeon) {
                const targetDungeonInfo = dungeonList[targetDungeon];
                dataLocks.lockData(interaction.user.id);
                try {
                    dungeon(interaction, dungeonText[targetDungeon], userInfo).then(async success => {
                        if (success.completed) {
                            let stringToSend = `Dungeon completed!`
                            let previouslyCompleted = economyUtils.dungeonCompleted(userInfo, targetDungeonInfo);
                            if (!previouslyCompleted)
                                userInfo.dungeonsCompleted.push({
                                    name: targetDungeon,
                                    seriesName: dungeonList[targetDungeon].seriesName,
                                    seriesNumber: dungeonList[targetDungeon].seriesNumber
                                });
                            let moneyGained = targetDungeonInfo.completeRewards.money;
                            let expGained = targetDungeonInfo.completeRewards.exp;
    
                            stringToSend += `\nGained ${economyUtils.formatMoney(moneyGained)} and ${expGained} exp`;
                            if ("item" in targetDungeonInfo.completeRewards) {
                                stringToSend += `\nYou gained the following items:`
                                for (let item in targetDungeonInfo.completeRewards.item) {
                                    const itemObj = targetDungeonInfo.completeRewards.item[item];
                                    userInfo = economyUtils.addToInventory(userInfo,
                                        itemObj.id,
                                        itemObj.quantity);
                                    const shopItemObj = shopItems[itemObj.id]
                                    stringToSend += ` ${shopItemObj.name} x${itemObj.quantity}`
                                }
                            }
                            if (!previouslyCompleted) {
                                stringToSend += `\nFirst time completion rewards:`
                                moneyGained += targetDungeonInfo.firstCompleteRewards.exp;
                                expGained += targetDungeonInfo.firstCompleteRewards.money;
                                stringToSend += `\n${economyUtils.formatMoney(moneyGained)} and ${expGained} exp`;
    
                                if ("item" in targetDungeonInfo.firstCompleteRewards) {
                                    stringToSend += `\nFirst time completion items:`
                                    for (let item in targetDungeonInfo.firstCompleteRewards.item) {
                                        const itemObj = targetDungeonInfo.firstCompleteRewards.item[item];
                                        userInfo = economyUtils.addToInventory(userInfo, 
                                            itemObj.id, 
                                            itemObj.quantity);
                                        const shopItemObj = shopItems[itemObj.id]
                                        stringToSend += ` ${shopItemObj.name} x${itemObj.quantity}`
                                    }
                                }
                            }
                            const levelUpResults = calculateLevelUp(userInfo.level, userInfo.expRequired, expGained);
                            if (levelUpResults.newLevel !== userInfo.level) {
                                stringToSend += `\nCongratulations! You levelled up (${userInfo.level} -> ${levelUpResults.newLevel})`
                            } else {
                                stringToSend += `\nYou have gained ${expGained} exp (to next level: ${levelUpResults.newExpRequired})`
                            }
                            userInfo.level = levelUpResults.newLevel;
                            userInfo.moneyOnHand += moneyGained;
                            userInfo.expRequired = levelUpResults.newExpRequired;
    
                            await success.response.edit({ content: stringToSend, components: [] });
                        } else {
                            await success.response.edit({ content: "Dungeon not completed.", components: [] });
                        }
                        dataLocks.unlockData(interaction.user.id);
                        fs.writeFileSync(path.join(__dirname, `../../userdata/${interaction.user.id}`), JSON.stringify(userInfo));
    
                    },
                        fail => {
                            fail.response.edit({ content: "Dungeon not completed", components: [] });
                            dataLocks.unlockData(interaction.user.id);
                            fs.writeFileSync(path.join(__dirname, `../../userdata/${interaction.user.id}`), JSON.stringify(userInfo));
                        });
                } catch (e){
                    console.log(e);
                    dataLocks.unlockData(interaction.user.id);
                }
        }
    },
};
