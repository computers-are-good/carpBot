const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));


module.exports = {
	data: new SlashCommandBuilder()
		.setName('upgradehouse')
		.setDescription('Upgrade your houses to earn more money!')
		.addStringOption(option => option.setName("house").setDescription("Name of house to upgrade (or list)")),
	async execute(interaction) {
        userInfo = await economyUtils.prefix(interaction);
		

		await interaction.reply(`User (LV: ${userInfo.level}, to next ${userInfo.expRequired})${interaction.user.username} has ${economyUtils.formatMoney(userInfo.moneyOnHand)} dollars in their wallet and ${economyUtils.formatMoney(userInfo.moneyBankAccount)} in their bank account`);
	},
};
