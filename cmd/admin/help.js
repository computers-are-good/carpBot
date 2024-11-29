const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const {helpText} = require(path.join(__dirname, "../../data/helptext"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays help')
		.addStringOption(option => option.setName("command").setDescription("Command you want help with")),
	async execute(interaction) {
		const topic = interaction.options.getString("command") ?? "basicHelp";
		if (topic in helpText) {
			economyUtils.displayList(interaction, helpText[topic], 1);
			return;
		} else {
			await interaction.reply("The command is not in the help database");
			return;
		}
		
	},
};
