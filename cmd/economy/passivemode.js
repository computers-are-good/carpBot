const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('passivemode')
		.setDescription('Toggles passive mode.'),
	async execute(interaction) {
		userInfo = await economyUtils.prefix(interaction);

		economyUtils.confirmation(interaction, `Passive mode is currently ${userInfo.passiveMode ? "enabled" : "disabled"}.\nDo you want to ${userInfo.passiveMode ? "disable" : "enable"} passive mode?`).then(async val => {
			let { confirmed, response } = val;
			const now = new Date().getTime();
			if (confirmed) {
				if (now - userInfo.lastTogglePassiveMode > 86400000) {
					userInfo.passiveMode = !userInfo.passiveMode;
					userInfo.lastTogglePassiveMode = now;
					fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${interaction.user.id}`), JSON.stringify(userInfo));
					await response.edit(`Passive mode is now ${userInfo.passiveMode ? "enabled" : "disabled"}.`);
				} else {
					await response.edit("Please wait at least a day before toggling passive mode.");
				}
			} else {
				response.edit({ content: `Passive mode remains ${userInfo.passiveMode ? "enabled" : "disabled"}.`, components: [] });
			}
		});
	},
};
