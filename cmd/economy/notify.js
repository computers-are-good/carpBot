const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('notify')
		.setDescription('Spends money to learn a skill to gain experience!')
		.addUserOption(option => option.setName("user").setDescription("User to notify.").setRequired(true))
		.addStringOption(option => option.setName("msg").setDescription("Message to the user").setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser("user");
		const msg = interaction.options.getString("msg");

		//Does the user exist?
		if (!fs.existsSync(path.join(__dirname, `../../userdata/economy/${user.id}`))) {
			await interaction.reply("That user does not exist!");
			return;
		}
		const userInfo = JSON.parse(fs.readFileSync(path.join(__dirname, `../../userdata/economy/${user.id}`), "UTF-8"));
		economyUtils.notifyPlayer(userInfo, `${interaction.user.username}: ${msg}`);

		fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${user.id}`), JSON.stringify(userInfo));
		await interaction.reply(`Success! ${user.username} should see the message when they next use CrapBot economy.`)
	},
};
