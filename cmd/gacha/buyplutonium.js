const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const fs = require("fs")
const gachaUtils = require(path.join(__dirname, "../../utils/gacha"));
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { settings } = require(path.join(__dirname, "../../data/defaultgachadata"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buyplutonium')
		.setDescription('Buys some plutonium to make nukes!')
		.addStringOption(option => option.setName("quantity").setDescription("How much plutonium do you want?")),
	async execute(interaction) {
		let userInfo = gachaUtils.prefix(interaction);
		let economyInfo = await economyUtils.prefix(interaction);

		let amountOfPlutonium = 0;
		const stringOption = interaction.options.getString("quantity");
		if (!stringOption) {
			amountOfPlutonium = 1;
		} else {
			try {
				amountOfPlutonium = parseFloat(stringOption);
			} catch {
				await interaction.reply("Failed to parse that amount of plutonium! Did you enter a number?");
				return;
			}
		}
		if (economyInfo.moneyOnHand == 0) {
			await interaction.reply("You don't have any money so you can't buy any nukes. Go out there and make some money with `/work`.");
			return;
		}
		const moneyRequired = settings.costOfPlutonium * amountOfPlutonium;
		if (moneyRequired > economyInfo.moneyOnHand) {
			await interaction.reply(`You don't have the needed money! The cost is ${economyUtils.formatMoney(moneyRequired)} but you only have ${economyUtils.formatMoney(userInfo.moneyOnHand)}. Keep \`/work\`ing!`);
			return;
		}
		economyInfo.moneyOnHand -= moneyRequired;
		await interaction.reply(`You have brought ${amountOfPlutonium} plutonium for ${economyUtils.formatMoney(moneyRequired)}.`);


		fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${interaction.user.id}`), JSON.stringify(economyInfo));
		fs.writeFileSync(path.join(__dirname, `../../userdata/gacha/${interaction.user.id}`), JSON.stringify(userInfo));

	},
};
