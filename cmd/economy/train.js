const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));

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
		const cost = Math.max(userInfo.abilitiesImproved[category] * 500, 100) * 100;
		let statToImproveReadable = category;
		if (category == "maxHealth") statToImproveReadable = "max health";
		let valueToIncrease;
		let increaseMultiplier = 1;
		if (userInfo.learned.includes("Efficent Training")) increaseMultiplier = 2;
		switch (category) {
			case "maxHealth":
				valueToIncrease = 10 * increaseMultiplier;
				break;
			case "attack":
				valueToIncrease = 2 * increaseMultiplier;
				break;
			case "block":
				valueToIncrease = 1 * increaseMultiplier;
				break;
			case 'speed':
				valueToIncrease = 5 * increaseMultiplier;
				break;
			case "healingInterval":
				valueToIncrease = -2000;
				break;
		}
		let msgToSend;
		if (category == "healingInterval") {
			msgToSend = `${notifications}You will regenerate 1 health every ${userInfo.healingInterval / 1000}s -> ${(userInfo.healingInterval + valueToIncrease) / 1000}s. Decreasing this will cost ${economyUtils.formatMoney(cost)}. Are you sure?`;
		} else {
			msgToSend = `${notifications}You will increase ${statToImproveReadable} (${userInfo.combat[category]} -> ${userInfo.combat[category] + valueToIncrease}). This will cost ${economyUtils.formatMoney(cost)}. Are you sure?`;
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
			fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${interaction.user.id}`), JSON.stringify(userInfo));
		} else {
			response.edit("Training cancelled.");
		}
	},
};
