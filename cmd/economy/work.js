const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const { createUserData } = require(path.join(__dirname, "../../utils/createUserData"));
const { calculateLevelUp } = require(path.join(__dirname, "../../utils/calculateLevelUp"));
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));

const jobs = [
    "helped the NSA blow up the sun",
    "fried some noodles",
    "made some high-grade explosive pidgeons",
    "exploited the weak and vulnerable for their own profit",
    "danced a really funny dance",
    "mucked around but still got paid",
    "performed the greatest song you've heard in your lives",
    "gave up all hope",
    "yelled into a void",
    "ran some DnD sessions",
    "told Rupee he was the best DM",
    'helped the neighbour commit arson',
    'roasted people on StackOverflow',
    'learned how to hack',
    "studied chemistry and gave up",
    "delivered newspapers warning us of the world's end",
    "laid down in a corner and cried",
    "did normal, totally legitimate work",
    "yelled at his workers like a true capitalist boss",
    "yearned for the mines and answered to his desires",
    "found a really big diamond",
    "washed some windows... in space",
    "went to Mars and back in 3 minutes",
    "had a big think about the meaning of life and all that is contained within",
    "drank some water to test if there are poisons in it",
    "overthrew the monarchy for the rebellion",
    "starred in a teen dystopia where lettuce is banned",
    "was cast to play a scarecrow and stood in the field for 18 hours",
    "broke and fixed all of modern physics",
    "found some money off the ground",
    "guarded a rich couple's tomato sauce bottle for 30 minutes",
    "helped with the regularly scheduled sun maintainance",
    "made stupid motorbike sounds with their mouth while running down the street",
    "stood at the border and said \"I love you\" to deter migrants",
    "Spread misinformation regarding the upcoming election",
    "dug a really big hole",
    "spilled the government secrets",
    "gave a public speech about hot dogs... made of real dog",
    "did some wheelies in the McDonalds parking lot",
    "drove on the highway at 300 kilometers an hour for \"science\"",
    "invented some new words"
]
module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work to make some money!'),
    async execute(interaction) {
        const dataPath = path.join(__dirname, `../../userdata/${interaction.user.id}`);
        userInfo = await economyUtils.prefix(interaction);

        let expGained = Math.ceil((1.25 - Math.random() * 0.5) * Math.pow(userInfo.level, 0.8) * 2 + 4);
        let moneyGained = Math.ceil(((1.25 - Math.random() * 0.5) * Math.pow(userInfo.level, 1.35) + 1) * 100);
        let effect = economyUtils.hasEffect(userInfo, ["coffee", "greenTea", "redTea", "criminal"]);
        userInfo = effect.userInfo;

        if (effect.effects.criminal) {
            await interaction.reply(`You are a criminal! Better lay low for a while (remaining: ${effect.effectDurations.criminal}s)`);
            return;
        }
        if (effect.effects.coffee) {
            moneyGained += 150;
            expGained += userInfo.level;
        }
        if (effect.effects.greenTea) {
            expGained = Math.ceil(expGained * 1.2);
        }
        if (effect.effects.redTea) {
            expGained = Math.ceil(expGained * 3);
        }
        userInfo.moneyOnHand += moneyGained;
        let { newLevel, newExpRequired } = calculateLevelUp(userInfo.level, userInfo.expRequired, expGained);

        let stringToWrite =
            `
User ${userInfo.username} ${scriptingUtils.choice(jobs)}. 
Gained **${economyUtils.formatMoney(moneyGained)}**. ${effect.effects.coffee ? `Coffee duration remaining: ${effect.effectDurations.coffee}s` : ""}
Wallet: **${economyUtils.formatMoney(userInfo.moneyOnHand)}**`

        userInfo.expRequired = newExpRequired;
        if (newLevel != userInfo.level) {
            stringToWrite += `\nLevel up! (${userInfo.level} -> ${newLevel})`;
            userInfo.level = newLevel
        } else {
            stringToWrite += `\nGained ${expGained} exp. (To next level: ${newExpRequired}${effect.effects.greenTea ? `, Green tea duration remaining: ${effect.effectDurations.greenTea}s` : ""}${effect.effects.redTea ? `, Red tea duration remaining: ${effect.effectDurations.redTea}s` : ""})`;
        }

        fs.writeFileSync(dataPath, JSON.stringify(userInfo));

        await interaction.reply(stringToWrite);
    },
};
