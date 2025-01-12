//https://discordjs.guide/creating-your-bot/command-deployment.html
const { REST, Routes } = require('discord.js');
const { clientId, guildId } = require('./configs.json');
const fs = require('node:fs');
const token = fs.readFileSync("./secret.txt").toString("UTF-8")
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'cmd');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			let category;
			switch (folder) {
				case "admin":
					category = "🚫 Admin only";
					break;
				case "economy":
					category = "💵 Economy";
					break;
				case "fun":
					category = "🥳 Fun";
					break;
				case "gacha":
					category = "⭐ Gacha"
				default:
					const folderArr = folder.split('');
					folderArr[0] = folderArr[0].toUpperCase()
					category = folderArr.join("");
			}			
			command.data.description = `${category}: ${command.data.description}`;
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();