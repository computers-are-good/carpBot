const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { dungeonList } = require(path.join(__dirname, "../../data/dungeonlist"));

function generateDungeonList(userInfo, onlyIncomplete) {
    const availableDungeons = economyUtils.listAvailableDungeons(userInfo);
    let list = [];
    //Display the not complete dungeons first
    for (let i of availableDungeons) {
        let completed = economyUtils.dungeonCompleted(userInfo, dungeonList[i]);
        if (!completed) {
            list.push(`${i}: ${dungeonList[i].content}`);
        }
    }
    if (!onlyIncomplete) {
        for (let i of availableDungeons) {
            let completed = economyUtils.dungeonCompleted(userInfo, dungeonList[i]);
            if (completed)
                list.push(`${i}: ${dungeonList[i].content} (complete)`);
        }
    }
    return list;
} 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dungeonlist')
        .setDescription('Lists the dungeons you can do!')
        .addStringOption(option => option.setName("incomplete").setDescription("Display only incomplete dungeons (true | false)")),
    async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);
        const incomplete = interaction.options.getString("incomplete");


        const listToDisplay = generateDungeonList(userInfo, incomplete == "true");

        economyUtils.displayList(interaction, [notifications, ...listToDisplay]);

    },
    generateDungeonList
};