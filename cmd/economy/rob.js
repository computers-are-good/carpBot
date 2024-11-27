const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));


module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Checks your account balance!')
		.addStringOption(option => option.setName("player").setDescription("Username of player to rob")),
	async execute(interaction) {
        userInfo = await economyUtils.prefix(interaction);

		//search for the player

		await interaction.reply(`User (LV: ${userInfo.level}, to next ${userInfo.expRequired})${interaction.user.username} has ${economyUtils.formatMoney(userInfo.moneyOnHand)} dollars in their wallet and ${economyUtils.formatMoney(userInfo.moneyBankAccount)} in their bank account`);
	},
};
