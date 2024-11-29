const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));


module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pays another player money')
        .addUserOption(option => option.setName("player").setDescription("Whom to pay?").setRequired(true))
        .addStringOption(option => option.setName("amount").setDescription("The amount to pay").setRequired(true)),
    async execute(interaction) {
        userInfo = await economyUtils.prefix(interaction);
        let amountOfMoney = 0;
        try {
            amountOfMoney = parseFloat(interaction.options.getString("amount"));
        } catch {
            interaction.reply("Failed to parse that amount of money! Did you enter a number? Do not include dollar signs in your amount");
        }
        const targetPlayer = interaction.options.getUser("player")
        const targetPlayerId = targetPlayer.id;

        if (!fs.existsSync(path.join(__dirname, `../../userdata/${targetPlayerId}`))) {
            await interaction.reply("This user has not used CrapBot.");
            return;
        }
        let targetPlayerData = JSON.parse(fs.readFileSync(path.join(__dirname, `../../userdata/${targetPlayerId}`)).toString("UTF-8"));

        amountOfMoney *= 100;
        amountOfMoney = Math.floor(amountOfMoney);
        if (amountOfMoney > userInfo.moneyOnHand) {
            await interaction.reply(`You only have ${economyUtils.formatMoney(userInfo.moneyOnHand)} in your wallet but you tried to pay ${targetPlayer.username} ${economyUtils.formatMoney(amountOfMoney)}`);
            return;
        }

        targetPlayerData.moneyOnHand += amountOfMoney;
        userInfo.moneyOnHand -= amountOfMoney;

        await interaction.reply(`Paid ${targetPlayer.username} ${economyUtils.formatMoney(amountOfMoney)}`)

        fs.writeFileSync(path.join(__dirname, `../../userdata/${interaction.user.id}`), JSON.stringify(userInfo));
        fs.writeFileSync(path.join(__dirname, `../../userdata/${targetPlayerId}`), JSON.stringify(targetPlayerData));
    },
};
