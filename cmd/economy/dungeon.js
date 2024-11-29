const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { dungeon } = require(path.join(__dirname, "../../utils/dungeon"));
const { dungeonText } = require(path.join(__dirname, "../../data/dungeontext"));
const dataLocks = require(path.join(__dirname, "../../utils/datalocks"));
const { dungeonList } = require(path.join(__dirname, "../../data/dungeonlist"));
module.exports = {
    data: new SlashCommandBuilder()
        .setName('dungeon')
        .setDescription('Visits a dungeon!')
        .addStringOption(option => option.setName("dungeon").setDescription("Which dungeon to enter?")),
    async execute(interaction) {
        userInfo = await economyUtils.prefix(interaction);
        const targetDungeon = interaction.options.getString("dungeon");
        const availableDungeons = [];

        for (let i in dungeonList) {
            let meetCriteria = true;
            //Have we completed the previous dungeon in the series?
            if (dungeonList[i].seriesNumber > 1) {
                meetCriteria = false;
                for (let j in userInfo.dungeonsCompleted) {
                    const dungeon = userInfo.dungeonsCompleted[j];
                    console.log(dungeon);
                    if (dungeon.seriesName == dungeonList[i].seriesName) {
                        meetCriteria = true;
                        break;
                    }
                }
            }
            if ("requirements" in dungeonList[i]) {
                if (dungeonList[i].level && userInfo.level < dungeonList.level) {
                    meetCriteria = false;
                }
            }
            if (meetCriteria) {
                availableDungeons.push(i);
            }
        }
        function dungeonCompleted(dungeonInfo) { //dungeonInfo is object from dungeonlist.js
            for (let i in userInfo.dungeonsCompleted) {
                if (userInfo.dungeonsCompleted[i].seriesName == dungeonInfo.seriesName && userInfo.dungeonsCompleted[i].seriesNumber == dungeonInfo.seriesNumber) return true;
            }
            return false;
        }
        if (targetDungeon == "list") {
            let list = [];
            for (let i of availableDungeons) {
                let completed = dungeonCompleted(availableDungeons[i]);
                list.push(`${i}: ${dungeonList[i].content} ${completed ? "(complete)" : ""}`);
            }
            economyUtils.displayList(interaction, list);
        } else {
            let canDoDungeon = false;
            for (let i of availableDungeons) {
                if (i.toLowerCase() == targetDungeon.toLowerCase()) {
                    canDoDungeon = true;
                    break;
                }
            }

            if (canDoDungeon) {
                dataLocks.lockData(interaction.user.id);

                dungeon(interaction, dungeonText.test, userInfo).then(success => {
                    success.response.edit({ content: `Dungeon ${success.completed ? "completed" : "not completed"}.`, components: [] });
                    if (!userInfo.dungeonsCompleted.includes(targetDungeon))
                        userInfo.dungeonsCompleted.push({
                            name: targetDungeon,
                            seriesName: dungeonList[targetDungeon].seriesName,
                            seriesNumber: dungeonList[targetDungeon].seriesNumber
                        });
                    dataLocks.unlockData(interaction.user.id);
                    fs.writeFileSync(path.join(__dirname, `../../userdata/${interaction.user.id}`), JSON.stringify(userInfo));

                },
                    fail => {
                        fail.response.edit({ content: "Dungeon not completed", components: [] });
                        dataLocks.unlockData(interaction.user.id);
                        fs.writeFileSync(path.join(__dirname, `../../userdata/${interaction.user.id}`), JSON.stringify(userInfo));
                    });
            }
        }
    },
};
