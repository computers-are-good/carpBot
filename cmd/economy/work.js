const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { gainExp } = require(path.join(__dirname, "../../utils/levelup"));
const { hasEffect } = require(path.join(__dirname, "../../utils/effects"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { jobs } = require(path.join(__dirname, "../../data/worktext"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work to make some money!'),
    async execute(interaction) {
        const dataPath = path.join(__dirname, `../../userdata/economy/${interaction.user.id}`);
        const { userInfo, notifications } = await economyUtils.prefix(interaction);

        let expGained = Math.ceil((1.25 - Math.random() * 0.5) * Math.pow(userInfo.level, 1.4) * 2 + 4);
        let moneyGained = Math.ceil(((1.25 - Math.random() * 0.5) * Math.pow(userInfo.level, 1.35) + 1) * 100 * userInfo.permanentWorkMultiplier);
        if (economyUtils.inventoryHasItem(userInfo.inventory, 1009)) moneyGained += 5000;
        let effect = hasEffect(userInfo, ["coffee", "greenTea", "redTea", "criminal", "potionOfKnowledge"]);

        if (effect.criminal > 0) {
            await interaction.reply(`${notifications}You are a criminal! Better lay low for a while (remaining: ${effect.criminal}s)`);
            return;
        }
        if (effect.coffee > 0) {
            moneyGained += 150;
            expGained += userInfo.level;
        }

        //EXP boosting effects
        if (effect.greenTea > 0) {
            expGained = Math.ceil(expGained * 1.15);
        }
        if (effect.redTea > 0) {
            expGained = Math.ceil(expGained * 1.3);
        }
        if (effect.potionOfKnowledge) {
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
        userInfo.lifetimeMoneyFromWorking += moneyGained;
        let msg = gainExp(userInfo, expGained);

        let stringToWrite = `${notifications}User ${userInfo.username} ${scriptingUtils.choice(jobs)}. `
        stringToWrite += `Gained **${scriptingUtils.formatMoney(moneyGained)}**. ${effect.coffee ? `Coffee duration remaining: ${effect.coffee}s` : ""}`
        stringToWrite += `Wallet: **${scriptingUtils.formatMoney(userInfo.moneyOnHand)}**\n`;

        stringToWrite += `${msg}\n`;
        stringToWrite += effect.greenTea > 0 ? `Green tea duration remaining: ${effect.greenTea}s\n` : "";
        stringToWrite += effect.redTea > 0 ? `Red tea duration remaining: ${effect.redTea}s\n` : ""
        stringToWrite += effect.potionOfKnowledge > 0 ? `Potion of knowledge duration remaining: ${effect.potionOfKnowledge}s\n` : "";
        saveData(userInfo, interaction.user.id);

        await interaction.reply(stringToWrite);
    },
};
