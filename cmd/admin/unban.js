const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Admin only.')
        .addUserOption(option => option.setName("player").setDescription("Player to unban")),
	async execute(interaction) {
        //are we an admin?
        const adminsList = JSON.parse(fs.readFileSync(path.join(__dirname, "../../configs.json"))).developerIds;
        const playerToUnban = interaction.options.getUser("player");
        if (!adminsList.includes(interaction.user.id)) {
            await interaction.reply("Hey, you're not an admin! What are you doing?");
            return;
        }
        let bannedList = []
        if (fs.existsSync(path.join(__dirname, "../../userdata/banned.json"))) {
            bannedList = JSON.parse(fs.readFileSync(path.join(__dirname, "../../userdata/banned.json")));
        } else {
            await interaction.reply("You have not banned anyone, so there's no one to unban!");
            return;
        }
        if (bannedList.length == 0) {
            await interaction.reply("You have not banned anyone, so there's no one to unban!");
            return;
        }
        let index = bannedList.indexOf(playerToUnban.id);
        if (index < 0) {
            await interaction.reply("That user was not banned");
            return;
        }
        bannedList.splice(index, 1);

        fs.writeFileSync(path.join(__dirname, "../../userdata/banned.json"), JSON.stringify(bannedList))
        interaction.reply(`Unbanned user with ID ${playerToUnban.id} (${playerToUnban.username})`);

	},
};
