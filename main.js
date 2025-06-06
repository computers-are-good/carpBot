//based off https://discordjs.guide/creating-your-bot/
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Events, ActivityType } = require('discord.js');
const { token } = require('./configs.json');
const {daily} = require(path.join(__dirname, "/utils/daily"));
const scriptingUtils = require(path.join(__dirname, "/utils/scripting"));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'cmd');
const commandFolders = fs.readdirSync(foldersPath);

const motd = [
	"Eating bricks",
	"Grinding /work",
	"/apple",
	"Gonna give you up",
	"🐟",
	"Javascriptin'",
	"pain"
]

//delete all .lock files
const lockFiles = fs.readdirSync(path.join(__dirname, "/userdata/economy")).filter(file => file.startsWith('.lock'));
lockFiles.forEach(e => {
	fs.rmSync(path.join(__dirname, `/userdata/economy/${e}`));
});
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
let curDate = scriptingUtils.getCurrentDay();
client.on(Events.ClientReady,  _ => {
	setInterval(async _ => {
		client.user.setActivity({ //modified from https://www.youtube.com/watch?v=QGJkr-zNlT0
			name: scriptingUtils.choice(motd),
			type: ActivityType.Playing
		});
		if (curDate !== scriptingUtils.getCurrentDay()) {
			curDate = scriptingUtils.getCurrentDay();
			await daily();
		}
	}, 60000);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'feedback') {
		await interaction.reply('Your feedback was recorded.');
		const feedbackText = interaction.fields.getTextInputValue('feedback');
		const title = interaction.fields.getTextInputValue('title');
		console.log({ feedbackText, title });
	}
});

client.login(token);