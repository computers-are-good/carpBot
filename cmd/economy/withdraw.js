const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraws money from your bank account')
        .addStringOption(option => option.setName("amount").setDescription("The amount to withdraw").setRequired(true)),
    async execute(interaction) {
		const {userInfo, notifications} = await economyUtils.prefix(interaction);
        let amountOfMoney = 0;
        try {
            amountOfMoney = parseFloat(interaction.options.getString("amount"));
        } catch {
            await interaction.reply(`${notifications}Failed to parse that amount of money! Did you enter a number? Do not include dollar signs in your amount`);
        }
        if (!amountOfMoney) {
            await interaction.reply(`${notifications}Failed to parse that amount of money! Did you enter a number? Do not include dollar signs in your amount`);
            return
        }
        amountOfMoney *= 100;
        amountOfMoney = Math.floor(amountOfMoney);

        if (amountOfMoney > userInfo.moneyBankAccount) {
            await interaction.reply(`${notifications}You only have ${economyUtils.formatMoney(userInfo.moneyBankAccount)} in your bank account but you tried to deposit ${economyUtils.formatMoney(amountOfMoney)}`);
            return;
        }

        userInfo.moneyOnHand += amountOfMoney;
        userInfo.moneyBankAccount -= amountOfMoney;

        await interaction.reply(`${notifications}Withdrew ${economyUtils.formatMoney(amountOfMoney)}`)

        fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${interaction.user.id}`), JSON.stringify(userInfo));
    },
};
