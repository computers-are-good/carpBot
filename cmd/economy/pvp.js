const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { compareStatsString, battle } = require(path.join(__dirname, "../../utils/dungeon"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pvp')
        .setDescription('Fight another player for loot!')
        .addUserOption(option => option.setName("player").setDescription("Which player to fight?").setRequired(true)),
    async execute(interaction) {
        userInfo = await economyUtils.prefix(interaction);
        const targetPlayer = interaction.options.getUser("player");
        
        let griefTestResults = await economyUtils.canGriefPlayer(targetPlayer.id, userInfo, interaction);
		if (!griefTestResults.canGrief) return;
		let targetPlayerData = griefTestResults.targetUserData;
        const playerStats = userInfo.combat;
        const enemyStats = targetPlayerData.combat;
        //You can earn a maximum of one million dollars from a PvP match
        const moneyEarned = Math.min(Math.floor((targetPlayerData.moneyOnHand + targetPlayerData.moneyBankAccount) * 0.1 + targetPlayerData.level * 500 + 1000), 100000000);

        const results = await economyUtils.confirmation(interaction, compareStatsString(playerStats, enemyStats), "Attack", "Wait, no...");
        const {confirmed, response} = results;

        if (confirmed) {
            let won = battle(playerStats, enemyStats);
            if (won) {
                response.edit(`Congratulations! You won! The arena master gave you ${economyUtils.formatMoney(moneyEarned)}.`);
                userInfo.moneyOnHand += moneyEarned;
            } else {
                response.edit(`You lost.`);
            }
           fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${interaction.user.id}`), JSON.stringify(userInfo));
        } else {
            response.edit(`PvP cancelled.`);
        }
        
    },
};
