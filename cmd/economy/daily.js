const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Claims your daily reward!'),
	async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);
        const today = scriptingUtils.getCurrentDay();
        if (today == userInfo.lastDaily) {
            await interaction.reply(`${notifications}You have already claimed your daily reward!`);
            return;
        }
        let moneyGained = Math.floor(1000 + 100 * userInfo.level * userInfo.level * 0.2) * 100;
        userInfo.moneyOnHand += moneyGained;
        userInfo.lastDaily = today;
        interaction.reply(`${notifications}Thanks for logging in on ${today}. You have gained ${scriptingUtils.formatMoney(moneyGained)} dollars.`);
        saveData(userInfo, interaction.user.id);
	},
};
