//based off https://discordjs.guide/creating-your-bot/
const { Events } = require('discord.js');
const path = require('node:path');
const fs = require("fs");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		if (fs.existsSync(path.join(__dirname, "../userdata/banned.json"))) {
			let banlist = JSON.parse(fs.readFileSync(path.join(__dirname, "../userdata/banned.json")));
			if (banlist.includes(interaction.user.id)) {
				//await interaction.reply("You are banned.");
				return;
			}
		}
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			try {
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: `F U C K! ${error.message}`, ephemeral: true });
				} else {
					await interaction.reply({ content: `F U C K! ${error.message}`, ephemeral: true });
				}
			} catch {
				console.log("An error occurred but we couldn't tell the Discord servers this has happened...");
			}

		}
	},
};
