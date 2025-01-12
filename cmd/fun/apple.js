const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const { framesPlayer } = require(path.join(__dirname, "../../utils/framesPlayer"));


module.exports = {
    data: new SlashCommandBuilder()
        .setName('apple')
        .setDescription('🍎'),
    async execute(interaction) {
        const frames = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/apple.json"), "utf-8"))
        let response = await interaction.reply('🍎');
        framesPlayer(response, frames, 33.3333333333333333);
    },
};
