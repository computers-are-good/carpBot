const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));


module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Checks your account balance!'),
	async execute(interaction) {
        const dataPath = path.join(__dirname, `../../userdata/${interaction.user.id}`)
        userInfo = await economyUtils.prefix(interaction);

		await interaction.reply(`User ${interaction.user.username} has ${economyUtils.formatMoney(userInfo.moneyOnHand)} dollars in their wallet and ${economyUtils.formatMoney(userInfo.moneyBankAccount)} in their bank account`);
	},
};
