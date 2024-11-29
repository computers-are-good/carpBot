const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { dungeon } = require(path.join(__dirname, "../../utils/dungeon"));
const {helpText} = require(path.join(__dirname, "../../data/helptext"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays help')
		.addStringOption(option => option.setName("command").setDescription("Command you want help with")),
	async execute(interaction) {
		const topic = interaction.options.getString("command") ?? "basicHelp";
		if (topic in helpText) {
			dungeon(interaction, helpText[topic]).then(suc => {
				if (suc.completed) {
					suc.response.edit({content: "Finish viewing help text", components: []});
				} else {
					suc.response.edit({content: "Help interrupted.", components: []});
				}
			},
			failure => {
				failure.response.edit({content: "Timed out.", components: []});
			});
			return;
		} else {
			await interaction.reply("The command is not in the help database");
			return;
		}
		
	},
};
