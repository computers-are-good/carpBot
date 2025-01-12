//based off https://discordjs.guide/creating-your-bot/
const { Events } = require('discord.js');
const path = require('node:path');
const fs = require("fs");
const gachaCommands = ["buynukes", "buyplutonium"];
const { createGachaData } = require(path.join(__dirname, "../utils/createUserData"));

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
		if (gachaCommands.includes(command.data.name) && !fs.existsSync(path.join(__dirname, `../userdata/gacha/${interaction.user.id}`))) {
			createGachaData(interaction.user.id);
			await interaction.reply(`
*The ancient travelers gazed upon the stars for hope. 
They have long wondered what's beyond our vision, lurking in the darkness of space. 
The many mystical figures beyond the stars has always been out of our reach...*

*Until now.*

*The United States Department of Defense is proud to announce the latest program: Galactic Accurate Cosmic Hope Assistant, or the G.A.C.H.A. The aim of the program?*
***Send as many nukes as it takes to the stars to make them fall to earth, and let the people own the characters hidden behind the stars.***			

Welcome to CrapBot gacha! This gambling simulator was mostly created to make fun of Genshin, so please use at your own risk. **No items obtained from the gacha system has any effect on the CrapBot economy. No real-money purchases is implemented in this system.**`);
			
return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			try {
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: `Oops! ${error.message}`, ephemeral: true });
				} else {
					await interaction.reply({ content: `Oops! ${error.message}`, ephemeral: true });
				}
			} catch {
				console.log("An error occurred but we couldn't tell the Discord servers this has happened...");
			}

		}
	},
};
