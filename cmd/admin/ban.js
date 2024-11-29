const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Admin only.')
        .addUserOption(option => option.setName("player").setDescription("Player to ban")),
	async execute(interaction) {
        //are we an admin?
        const adminsList = JSON.parse(fs.readFileSync(path.join(__dirname, "../../configs.json"))).developerIds;
        const playerToBan = interaction.options.getUser("player");
        if (!adminsList.includes(interaction.user.id)) {
            await interaction.reply("Hey, you're not an admin! What are you doing?");
            return;
        }
        let bannedList = []
        if (fs.existsSync(path.join(__dirname, "../../userdata/banned.json"))) {
            bannedList = JSON.parse(fs.readFileSync(path.join(__dirname, "../../userdata/banned.json")));
        }
        if (bannedList.includes(playerToBan.id)) {
            await interaction.reply(`That user is already banned.`);
            return;
        }
        bannedList.push(playerToBan.id);

        fs.writeFileSync(path.join(__dirname, "../../userdata/banned.json"), JSON.stringify(bannedList));
        await interaction.reply(`Banned user with ID ${playerToBan.id} (${playerToBan.username})`)

	},
};
