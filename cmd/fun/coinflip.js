const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
//images from https://www.rbnz.govt.nz/money-and-cash/coins/coins-in-circulation/coin-specifications-and-images-by-denomination
module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flip a coin!'),
	async execute(interaction) {
		let rand = Math.random();
		await interaction.reply({
			content: rand < 0.5 ? "Heads" : "Tails",
			files: [{ attachment: path.join(__dirname, `../../data/${rand < 0.5 ? "heads" : "tails"}.jpg`) }]
		});
	},
};
