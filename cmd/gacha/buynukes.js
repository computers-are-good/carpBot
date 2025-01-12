const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const fs = require("fs")
const gachaUtils = require(path.join(__dirname, "../../utils/gacha"));
const { settings } = require(path.join(__dirname, "../../data/defaultgachadata"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buynukes')
		.setDescription('Buys some nukes to blow stars out of the sky!')
		.addStringOption(option => option.setName("quantity").setDescription("How many nukes do you want?")),
	async execute(interaction) {
		let userInfo = gachaUtils.prefix(interaction);
		let amountOfNukes = 0;
		const stringOption = interaction.options.getString("quantity");
		if (!stringOption) {
			amountOfNukes = 1;
		} else {
			try {
				amountOfNukes = parseFloat(stringOption);
			} catch {
				await interaction.reply("Failed to parse that amount of nukes! Did you enter a number?");
				return;
			}
		}
		if (Number.isNaN(amountOfNukes)) {
			await interaction.reply("Failed to parse that amount of nukes! Did you enter a number?");
			return;
		}
		
		const cost = amountOfNukes * settings.costOfNuke;
		if (userInfo.plutonium < cost) {
			await interaction.reply("You don't have that much plutonium!");
		} else {
			userInfo.plutonium -= cost;
			userInfo.nukes += amountOfNukes;
			await interaction.reply(`You have brought ${amountOfNukes} for ${cost} plutonium. You now have ${userInfo.plutonium} plutonium left.`);
			fs.writeFileSync(path.join(__dirname, `../../userdata/gacha/${interaction.user.id}`), JSON.stringify(userInfo));

		}
	},
};
