const { time } = require('console');
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

		const confirm = new ButtonBuilder()
            .setCustomId('Confirm')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Primary);

        const cancel = new ButtonBuilder()
            .setCustomId('Cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(cancel, confirm);

		const collectorFilter = i => i.user.id === interaction.user.id;
		let response = await interaction.reply({content: `Passive mode is currently ${userInfo.passiveMode ? "enabled" : "disabled"}.\nDo you want to ${userInfo.passiveMode ? "disable" : "enable"} passive mode?`, components: [row]});
		try {
			buttons = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
			if (buttons.customId === 'Confirm') {
				const now = new Date().getTime();
				if (now - userInfo.lastTogglePassiveMode > 86400000) {
					userInfo.passiveMode = !userInfo.passiveMode;
					userInfo.lastTogglePassiveMode = now;
					fs.writeFileSync(path.join(__dirname, `../../userdata/${interaction.user.id}`), JSON.stringify(userInfo));
					await buttons.update({content: `Passive mode is now ${userInfo.passiveMode ? "enabled" : "disabled"}`, components: []}); 
				} else {
					await buttons.update({content: "Please wait at least a day before toggling passive mode.", components: []});
				}
			} else if (buttons.customId === 'Cancel') {
				await buttons.update({ content: "Cancelled.", components: [] });
			}
		} catch (e) {
			console.log(e)
			await response.edit({ content: "Response timed out.", components: [] });
		}
	},
};
