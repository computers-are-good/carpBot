const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('train')
		.setDescription('Spend some money to improve your stats in combat!')
		.addStringOption(option =>
			option.setName('stat')
				.setDescription('The stat to improve')
				.setRequired(true)
				.addChoices(
					{ name: 'Health', value: 'maxHealth' },
					{ name: 'Attack', value: 'attack' },
					{ name: 'Block', value: 'block' },
					{ name: 'Speed', value: 'speed' },
					{ name: 'Healing interval', value: 'healingInterval' }
				)),
	async execute(interaction) {
		const { userInfo, notifications } = await economyUtils.prefix(interaction);
		const category = interaction.options.getString('stat');
		if (category == "healingInterval" && userInfo.abilitiesImproved.healingInterval >= 15) {
			await interaction.reply(`${notifications}You can only increase your healing interval a maximum of 15 times.`)
		}
		let cost, valueToIncrease
		let increaseMultiplier = 1;
		switch (category) {
			case "maxHealth":
				valueToIncrease = 10 * increaseMultiplier;
				cost = Math.floor(Math.pow(userInfo.abilitiesImproved[category], 1.8) + 100) * 100;
				break;
			case "attack":
				valueToIncrease = 2 * increaseMultiplier;
				cost = Math.floor(Math.pow(userInfo.abilitiesImproved[category] + 0.5, 2.0) + 100) * 100;
				break;
			case "block":
				valueToIncrease = 1 * increaseMultiplier;
				cost = (userInfo.abilitiesImproved[category] * 150 + 100) * 100;
				break;
			case 'speed':
				valueToIncrease = 5 * increaseMultiplier;
				cost = (userInfo.abilitiesImproved[category] * 250 + 100) * 100;
				break;
			case "healingInterval":
				valueToIncrease = -2000;
				cost = Math.max(userInfo.abilitiesImproved[category] * 500, 100) * 100;
				break;
		}
		let statToImproveReadable = category;
		if (category == "maxHealth") statToImproveReadable = "max health";
		if (userInfo.learned.includes("Efficent Training")) increaseMultiplier = 2;

		let msgToSend;
		if (category == "healingInterval") {
			msgToSend = `${notifications}You will regenerate 1 health every ${userInfo.healingInterval / 1000}s -> ${(userInfo.healingInterval + valueToIncrease) / 1000}s. Decreasing this will cost ${scriptingUtils.formatMoney(cost)}. Are you sure?`;
		} else {
			msgToSend = `${notifications}You will increase ${statToImproveReadable} (${userInfo.combat[category]} -> ${userInfo.combat[category] + valueToIncrease}). This will cost ${scriptingUtils.formatMoney(cost)}. Are you sure?`;
		}
		const val = await economyUtils.confirmation(interaction, msgToSend);
		const { confirmed, response } = val;
		if (confirmed) {
			if (userInfo.moneyOnHand < cost) {
				response.edit("You do not have enough money to do training.");
				return;
			}
			userInfo.moneyOnHand -= cost;
			userInfo.abilitiesImproved[category]++;
			if (category == "healingInterval") {
				userInfo.healingInterval += valueToIncrease;
				response.edit(`Decreased healing interval (${(userInfo.healingInterval - valueToIncrease) / 1000}s -> ${userInfo.healingInterval / 1000}s)`);
			} else {
				userInfo.combat[category] += valueToIncrease;
				response.edit(`Increased ${statToImproveReadable} (${userInfo.combat[category] - valueToIncrease} -> ${userInfo.combat[category]}).`);
			}
			saveData(userInfo, interaction.user.id);
		} else {
			response.edit("Training cancelled.");
		}
	},
};
