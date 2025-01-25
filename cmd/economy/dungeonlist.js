const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { dungeonList } = require(path.join(__dirname, "../../data/dungeonlist"));


module.exports = {
    data: new SlashCommandBuilder()
        .setName('dungeonlist')
        .setDescription('Lists the dungeons you can do!')
        .addStringOption(option => option.setName("incomplete").setDescription("Display only incomplete dungeons (true | false)")),
    async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);
        const incomplete = interaction.options.getString("incomplete");

        const availableDungeons = economyUtils.listAvailableDungeons(userInfo);
        let list = [];
        for (let i of availableDungeons) {
            let completed = economyUtils.dungeonCompleted(userInfo, dungeonList[i]);
            if (incomplete == "true" && completed == true) continue;
            list.push(`${notifications}${i}: ${dungeonList[i].content} ${completed ? "(complete)" : ""}`);
        }
        economyUtils.displayList(interaction, list);
    },
};
