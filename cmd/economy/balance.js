const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const economyUtils = require(path.join(__dirname, "../../utils/economy"));


module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Checks your account balance!'),
	async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);

		await interaction.reply(`${notifications}Kia ora ${interaction.user.username}. You are level **${userInfo.level}** (to next ${userInfo.expRequired}). You have ${scriptingUtils.formatMoney(userInfo.moneyOnHand)} dollars in your wallet and ${scriptingUtils.formatMoney(userInfo.moneyBankAccount)} in your bank account. You have ${userInfo.unwitheringFlowers} unwithering flowers.`);
	},
};
