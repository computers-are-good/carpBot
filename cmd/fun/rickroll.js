const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const pathToRick = path.join(__dirname, "../../data/rickroll");
const sleep = ms => new Promise(res => setTimeout(res, ms));
const lyrics = {
	491: "We're no strangers to love",
	589: "You know the rules and so do I (do I)",
	698: "A full commitment's what I'm thinking of",
	802: "You wouldn't get this from any other guy",
	901: "I just wanna tell you how I'm feeling",
	1034: "Gotta make you understand",
	1080: "Never gonna give you up",
	1131: "Never gonna let you down",
	1182: "Never gonna run around and desert you",
	1288: "Never gonna make you cry",
	1345: "Never gonna say goodbye",
	1393: "Never gonna tell a lie and hurt you",
	1525: "We've known each other for so long",
	1624: "Your heart's been aching, but you're too shy to say it (say it)",
	1730: "Inside, we both know what's been going on (going on)",
	1842: "We know the game and we're gonna play it",
	1939: "And if you ask me how I'm feeling",
	2061: "Don't tell me you're too blind to see",
	2137: "Never gonna give you up",
	2189: "Never gonna let you down",
	2244: "Never gonna run around and desert you",
	2349: "Never gonna make you cry",
	2405: "Never gonna say goodbye",
	2457: "Never gonna give you up",
	2611: "Never gonna let you down",
	2666: "Never gonna run around and desert you",
	2775: "Never gonna make you cry",
	2821: "Never gonna say goodbye",
	2878: "Never gonna tell a lie and hurt you",
	2996: "(Ooh, give you up)",
	3100: "(Ooh, give you up)",
	3215: "(Ooh) Never gonna give, never gonna give (give you up)",
	3315: "(Ooh) Never gonna give, never gonna give (give you up)",
	3426: "We've known each other for so long",
	3531: "Your heart's been aching, but you're too shy to say it (to say it)",
	3638: "Inside, we both know what's been going on (going on)",
	3745: "We know the game and we're gonna play it",
	3848: "I just wanna tell you how I'm feeling",
	3978: "Gotta make you understand",
	4043: "Never gonna give you up",
	4099: "Never gonna let you down",
	4149: "Never gonna run around and desert you",
	4256: "Never gonna make you cry",
	4306: "Never gonna say goodbye",
	4410: "Never gonna tell a lie and hurt you",
	4465: "Never gonna give you up",
	4518: "Never gonna let you down",
	4571: "Never gonna run around and desert you",
	4682: "Never gonna make you cry",
	4732: "Never gonna say goodbye",
	4785: "Never gonna tell a lie and hurt you",
	4888: "Never gonna give you up",
	4942: "Never gonna let you down",
	4997: "Never gonna run around and desert you",
	5102: "Never gonna make you cry",
	5156: "Never gonna say goodbye",
	5209: "Never gonna tell a lie and hurt you",
	5275: ""
}

const lyricsKeys = Object.keys(lyrics);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription('Makes you admin!'),
	async execute(interaction) {
		let response = await interaction.reply("You are now not an admin!");
		let cumulativeTimePassed = 0;
		let f = 1;
		while (true) {
			let t1 = performance.now();
			let lyric;
			for (let i = 0; i < lyricsKeys.length; i++) {
				if (f < lyrics[1]) {
					lyric = lyrics[lyricsKeys[0]]
				} else if (f > lyricsKeys[lyricsKeys.length - 1]) {
					lyric = lyrics[lyricsKeys[lyricsKeys.length - 1]]
				} else if (f > lyricsKeys[i] && f < lyricsKeys[i + 1]) {
					lyric = lyrics[lyricsKeys[i]];
				}
			}
			await response.edit({
				content: lyric,
				files: [{ attachment: `${pathToRick}/${f}.jpg` }]
			});
			sleep(f * 40 - cumulativeTimePassed);
			let t2 = performance.now();
			f = Math.floor(cumulativeTimePassed / 40);
			if (f > 5301) return;
			let timePassed = t2 - t1;
			cumulativeTimePassed += timePassed;
		}
	}
}
