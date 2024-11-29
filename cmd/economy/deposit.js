const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));


module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Deposits money into your bank account')
        .addStringOption(option => option.setName("amount").setDescription("The amount to deposit").setRequired(true)),
    async execute(interaction) {
        userInfo = await economyUtils.prefix(interaction);
        let amountOfMoney = 0;
        try {
            amountOfMoney = parseFloat(interaction.options.getString("amount"));
        } catch {
            interaction.reply("Failed to parse that amount of money! Did you enter a number? Do not include dollar signs in your amount");
        }
        if (!amountOfMoney) {
            await interaction.reply("Failed to parse that amount of money! Did you enter a non-zero number? Do not include dollar signs in your amount");
            return
        }
        amountOfMoney *= 100;
        amountOfMoney = Math.floor(amountOfMoney);

        if (amountOfMoney > userInfo.moneyOnHand) {
            await interaction.reply(`You only have ${economyUtils.formatMoney(userInfo.moneyOnHand)} in your wallet but you tried to deposit ${economyUtils.formatMoney(amountOfMoney)}`);
            return;
        }

        userInfo.moneyOnHand -= amountOfMoney;
        userInfo.moneyBankAccount += amountOfMoney;

        await interaction.reply(`Deposited ${economyUtils.formatMoney(amountOfMoney)}`)

        fs.writeFileSync(path.join(__dirname, `../../userdata/${interaction.user.id}`), JSON.stringify(userInfo));
    },
};
