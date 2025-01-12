const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const fs = require("fs")
const gachaUtils = require(path.join(__dirname, "../../utils/gacha"));
const {wait} = require(path.join(__dirname, "../../utils/scripting"));
const { settings } = require(path.join(__dirname, "../../data/defaultgachadata"));
const gachaData = require(path.join(__dirname, "../../data/gacha"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Nuke a star to get some anime girls! Totally not a form of gambling')
        .addStringOption(option => option.setName("target").setDescription("Which star do you want to nuke?").setRequired(true))
        .addStringOption(option => option.setName("times").setDescription("How many times do you want to nuke the star?")),
    async execute(interaction) {
        let userInfo = gachaUtils.prefix(interaction);
        let amountOfTimes;
        const stringOption = interaction.options.getString("times");
        if (!stringOption) {
            amountOfTimes = 1;
        } else {
            try {
                amountOfTimes = parseInt(stringOption);
            } catch {
                await interaction.reply("Failed to parse that amount of times! Did you enter a number?");
                return;
            }
        }
        if (Number.isNaN(amountOfTimes)) {
            await interaction.reply("Failed to parse that amount of times! Did you enter a number?");
            return;
        }
        if (amountOfTimes > 10) {
            await interaction.reply("We gotta keep this descrete otherwise the eagles will get us. Please, no more than 10 nukes at a time!");
            return;
        }
        let results = [];
        for (let i = 0; i < amountOfTimes; i++) {
            results.push(gachaUtils.gambleOnce(userInfo, 1));
        }
        //process the results so they can be displayed by gachaUtils.displayCharacters, and write the results to user's data file...
        let resultsToDisplay = [];
        for (let i of results) {
            resultsToDisplay.push(gachaData.items[i]);
            let broken = false;
            for (let j in userInfo.characters) {
                if (userInfo.characters[j].Id == i) {
                    broken = true;
                    userInfo.characters[j].constellation++
                    break;
                }
            }
            if (!broken) {
                userInfo.characters.push({
                    Id: i,
                    constellation: 0
                })
            }
        }
        let response = await interaction.reply("Nuking a star...");
        fs.writeFileSync(path.join(__dirname, `../../userdata/gacha/${interaction.user.id}`), JSON.stringify(userInfo));

        await wait(1000)
        gachaUtils.displayCharacters(resultsToDisplay, response, interaction.user.id)
    },
};
