const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const { calculateLevelUp } = require(path.join(__dirname, "../../utils/calculateLevelUp"));
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const {jobs} = require(path.join(__dirname, "../../data/worktext"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work to make some money!'),
    async execute(interaction) {
        const dataPath = path.join(__dirname, `../../userdata/economy/${interaction.user.id}`);
        userInfo = await economyUtils.prefix(interaction);

        let expGained = Math.ceil((1.25 - Math.random() * 0.5) * Math.pow(userInfo.level, 0.6) * 2 + 4);
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

        //Effects of pets
        for (let pet of userInfo.pets) {
            if (pet.id == 100) { //dog
                moneyGained *= pet.bondLevel * 1.2
                moneyGained = Math.floor(moneyGained);
            }
            if (pet.id == 101) { //cat
                expGained *= pet.bondLevel * 1.1
                expGained = Math.floor(expGained);
            }
        }

        if (typeof moneyGained !== "number" || typeof expGained !== "number") throw new Error("Money Gained or Exp Gained is not a number. Please check your code!");
        
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
