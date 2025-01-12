const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const pathToRick = path.join(__dirname, "../../data/rickroll");
const sleep = ms => new Promise(res => setTimeout(res, ms));
const lyrics = {
	0: "Rick Ashley: Never Gonna Give You Up",
	491: "We're no strangers to love",
	589: "You know the rules and so do I (do I)",
	698: "A full commitment's what I'm thinking of",
	802: "You wouldn't get this from any other guy"
}

const lyricsKeys = Object.keys(lyrics);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rickroll')
		.setDescription('Rick ashley will never give you up or let you down.'),
	async execute(interaction) {
		let response = await interaction.reply("HI!");
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
				files: [{attachment: `${pathToRick}/${f}.jpg`}]
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
