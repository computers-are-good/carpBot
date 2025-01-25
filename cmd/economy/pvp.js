const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { compareStatsString, battle } = require(path.join(__dirname, "../../utils/dungeon"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pvp')
        .setDescription('Fight another player for loot!')
        .addUserOption(option => option.setName("player").setDescription("Which player to fight?").setRequired(true)),
    async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);
        const targetPlayer = interaction.options.getUser("player");
        
        let griefTestResults = await economyUtils.canGriefPlayer(targetPlayer.id, userInfo, interaction, notifications);
		if (!griefTestResults.canGrief) return;
		let targetPlayerData = griefTestResults.targetUserData;
        const playerStats = userInfo.combat;
        const enemyStats = targetPlayerData.combat;
        //You can earn a maximum of one million dollars from a PvP match
        const moneyEarned = Math.min(Math.floor((targetPlayerData.moneyOnHand + targetPlayerData.moneyBankAccount) * 0.1 + targetPlayerData.level * 500 + 1000), 100000000);

        const results = await economyUtils.confirmation(interaction, `${notifications} ${compareStatsString(playerStats, enemyStats)}\nThe player you attack will not lose money. Expect ${economyUtils.formatMoney(moneyEarned)}.`, "Attack", "Wait, no...");
        const {confirmed, response} = results;

        if (confirmed) {
            let won = battle(playerStats, enemyStats);
            if (won) {
                response.edit(`Congratulations! You won! The arena master gave you ${economyUtils.formatMoney(moneyEarned)}.`);
                economyUtils.notifyPlayer(targetPlayerData, `${interaction.user.id} fought you and won. Don't worry. You didn't lose any money.`)
                userInfo.moneyOnHand += moneyEarned;
            } else {
                economyUtils.notifyPlayer(targetPlayerData, `${interaction.user.id} fought you and lost. Congratulations!`)
                response.edit(`You lost.`);
            }
           fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${interaction.user.id}`), JSON.stringify(userInfo));
        } else {
            response.edit(`PvP cancelled.`);
        }
        
    },
};
