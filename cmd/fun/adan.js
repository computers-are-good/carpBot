const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const pathToAdan = path.join(__dirname, "../../data/adan.png");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('adan')
		.setDescription('Adan'),
	async execute(interaction) {
		await interaction.reply({ content: "This is adan!", files: [{ attachment: pathToAdan }] });
	},
};
