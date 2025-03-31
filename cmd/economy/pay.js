const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const scriptingUtils = require('../../utils/scripting');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pays another player money')
        .addUserOption(option => option.setName("player").setDescription("Whom to pay?").setRequired(true))
        .addStringOption(option => option.setName("amount").setDescription("The amount to pay").setRequired(true)),
    async execute(interaction) {
		const {userInfo, notifications} = await economyUtils.prefix(interaction);
        let amountOfMoney = 0;
        try {
            amountOfMoney = parseFloat(interaction.options.getString("amount"));
        } catch {
            await interaction.reply(`${notifications}Failed to parse that amount of money! Did you enter a number? Do not include dollar signs in your amount`);
            return;
        }
        const targetPlayer = interaction.options.getUser("player")
        const targetPlayerId = targetPlayer.id;

        if (!fs.existsSync(path.join(__dirname, `../../userdata/economy/${targetPlayerId}`))) {
            await interaction.reply(`${notifications}That user has not used CrapBot.`);
            return;
        }
        let targetPlayerData = JSON.parse(fs.readFileSync(path.join(__dirname, `../../userdata/economy/${targetPlayerId}`)).toString("UTF-8"));

        amountOfMoney *= 100;
        amountOfMoney = Math.floor(amountOfMoney);
        if (amountOfMoney > userInfo.moneyOnHand) {
            await interaction.reply(`${notifications}You only have ${scriptingUtils.formatMoney(userInfo.moneyOnHand)} in your wallet but you tried to pay ${targetPlayer.username} ${scriptingUtils.formatMoney(amountOfMoney)}`);
            return;
        }

        targetPlayerData.moneyOnHand += amountOfMoney;
        userInfo.moneyOnHand -= amountOfMoney;

        economyUtils.notifyPlayer(targetPlayerData, `${interaction.user.username} paid you ${scriptingUtils.formatMoney(amountOfMoney)}.`);

        await interaction.reply(`${notifications}Paid ${targetPlayer.username} ${scriptingUtils.formatMoney(amountOfMoney)}`)

        saveData(userInfo, interaction.user.id);
        saveData(targetPlayerData, targetPlayerId);
    },
};
