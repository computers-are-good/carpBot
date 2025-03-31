const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('collectrent')
		.setDescription('If you have a house, collect rent from them'),
	async execute(interaction) {
		const {userInfo, notifications} = await economyUtils.prefix(interaction);

		let totalTimeElapsed = 0;
		let now = new Date().getTime();
		for (let item of userInfo.inventory) {
			if (item.Id == 1008) {
				totalTimeElapsed += (now - item.metadata.lastCollected) * item.quantity * item.metadata.level;
				item.metadata.lastCollected = now;
			}
		}
		let moneyGained = Math.ceil(totalTimeElapsed / 70);
		if (typeof moneyGained == "number")
			userInfo.moneyOnHand += moneyGained;

		const dataPath = path.join(__dirname, `../../userdata/economy/${interaction.user.id}`)
		saveData(userInfo, interaction.user.id);
		await interaction.reply(`${notifications}Gained ${scriptingUtils.formatMoney(moneyGained)}.`);

	},
};
