const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');

const sleep = ms => new Promise(res => setTimeout(res, ms));
module.exports = {
	data: new SlashCommandBuilder()
		.setName('apple')
		.setDescription('🍎'),
	async execute(interaction) {
        const frames = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/apple.json"), "utf-8"))
		let response = await interaction.reply('🍎');
        let cumulativeTimePassed = 0;
        const msBetweenFrame = 33.3333333333333333;
        let f = 0;
        while (true) {
            let t1 = performance.now();
            await response.edit(`\`${f}\n${frames[f]}\``)
            sleep(f * msBetweenFrame - cumulativeTimePassed);
            let t2 = performance.now();
            f = Math.floor(cumulativeTimePassed / msBetweenFrame);
            if (f > frames.length) return;
            let timePassed = t2 - t1;
            cumulativeTimePassed += timePassed;
        }
	},
};
