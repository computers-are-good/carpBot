const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));


module.exports = {
	data: new SlashCommandBuilder()
		.setName('collectrent')
		.setDescription('If you have a house, collect rent from them'),
	async execute(interaction) {
        userInfo = await economyUtils.prefix(interaction);
		let totalTimeElapsed = 0;
		let now = new Date().getTime();
		for (let item of userInfo.inventory) {
			if (item.Id == 1008) {
				totalTimeElapsed += (now - item.metadata.lastCollected) * item.quantity * item.level;
				item.metadata.lastCollected = now;
			}
		}
		let moneyGained = Math.ceil(totalTimeElapsed / 50);
		userInfo.moneyOnHand += moneyGained;

		const dataPath = path.join(__dirname, `../../userdata/${interaction.user.id}`)
		fs.writeFileSync(dataPath, JSON.stringify(userInfo));
		await interaction.reply(`Gained ${economyUtils.formatMoney(moneyGained)}.`);

	},
};
