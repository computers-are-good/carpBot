const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const fs = require("fs")
const gachaUtils = require(path.join(__dirname, "../../utils/gacha"));
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { settings } = require(path.join(__dirname, "../../data/defaultgachadata"));
const {saveData} = require(path.join(__dirname, "../../utils/userdata"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buyplutonium')
		.setDescription('Buys some plutonium to make nukes!')
		.addStringOption(option => option.setName("quantity").setDescription("How much plutonium do you want?")),
	async execute(interaction) {
		let gachaInfo = gachaUtils.prefix(interaction);
		const { userInfo, notifications } =  await economyUtils.prefix(interaction);

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
		if (Number.isNaN(amountOfPlutonium)) {
			await interaction.reply("Failed to parse that amount of plutonium! Did you enter a number?");
			return;
		}
		
		if (userInfo.moneyOnHand == 0) {
			await interaction.reply("You don't have any money so you can't buy any nukes. Go out there and make some money with `/work`.");
			return;
		}

		const moneyRequired = settings.costOfPlutonium * amountOfPlutonium;
		if (moneyRequired > userInfo.moneyOnHand) {
			await interaction.reply(`You don't have the needed money! The cost is ${scriptingUtils.formatMoney(moneyRequired)} but you only have ${scriptingUtils.formatMoney(userInfo.moneyOnHand)}. Keep \`/work\`ing!`);
			return;
		}

		userInfo.moneyOnHand -= moneyRequired;
		await interaction.reply(`You have brought ${amountOfPlutonium} plutonium for ${scriptingUtils.formatMoney(moneyRequired)}.`);

		saveData(userInfo, interaction.user.id);
		fs.writeFileSync(path.join(__dirname, `../../userdata/gacha/${interaction.user.id}`), JSON.stringify(gachaInfo));
	},
};
