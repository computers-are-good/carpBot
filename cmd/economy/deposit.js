const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Deposits money into your bank account')
        .addStringOption(option => option.setName("amount").setDescription("The amount to deposit").setRequired(true)),
    async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);
        let amountOfMoney = 0;
        try {
            amountOfMoney = parseFloat(interaction.options.getString("amount"));
        } catch {
            await interaction.reply(`${notifications}Failed to parse that amount of money! Did you enter a number? Do not include dollar signs in your amount`);
        }
        if (!amountOfMoney) {
            await interaction.reply(`${notifications}Failed to parse that amount of money! Did you enter a non-zero number? Do not include dollar signs in your amount`);
            return
        }
        amountOfMoney *= 100;
        amountOfMoney = Math.floor(amountOfMoney);

        if (amountOfMoney > userInfo.moneyOnHand) {
            await interaction.reply(`${notifications}You only have ${scriptingUtils.formatMoney(userInfo.moneyOnHand)} in your wallet but you tried to deposit ${scriptingUtils.formatMoney(amountOfMoney)}`);
            return;
        }

        userInfo.moneyOnHand -= amountOfMoney;
        userInfo.moneyBankAccount += amountOfMoney;

        await interaction.reply(`${notifications}Deposited ${scriptingUtils.formatMoney(amountOfMoney)}`)

        saveData(userInfo, interaction.user.id);
    },
};
