const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const {createUserData} = require(path.join(__dirname, "../../utils/createUserData"));
const economyUtils = require(path.join(__dirname, "../../utils/economy"));


module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Checks your account balance!'),
	async execute(interaction) {
        const dataPath = path.join(__dirname, `../../userdata/${interaction.user.id}`)

        if (!fs.existsSync(dataPath)) {
            createUserData(interaction.user.id);
        }
        const userInfo = JSON.parse(fs.readFileSync(dataPath));

		await interaction.reply(`User ${interaction.user.username} has ${economyUtils.formatMoney(userInfo.moneyOnHand)} dollars in their wallet and ${economyUtils.formatMoney(userInfo.moneyBankAccount)} in their bank account`);
	},
};
