const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { dungeon, battle } = require(path.join(__dirname, "../../utils/dungeon"));
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

        const results = await economyUtils.confirmation(interaction, 
`Are you sure you want to fight ${targetPlayer.globalName ?? targetPlayer.username}? If you win, you will get ${economyUtils.formatMoney(moneyEarned)}. Your opponent will not lose money.
**Your health will decrease after the battle, but ${targetPlayer.globalName ?? targetPlayer.username}'s health will remain the same**\`
Your stats:              | ${targetPlayer.globalName ?? targetPlayer.username}'s stats:        
Health: ${playerStats.health} (max: ${playerStats.maxHealth})${scriptingUtils.generateSpaces(25 - playerStats.health.toString().length - playerStats.maxHealth.toString().length - 16)}| Health: ${enemyStats.health}${scriptingUtils.generateSpaces(20 - enemyStats.health.toString().length - 8)}
Attack: ${playerStats.attack}${scriptingUtils.generateSpaces(25 - playerStats.attack.toString().length - 8)}| Attack: ${enemyStats.attack}${scriptingUtils.generateSpaces(20 - enemyStats.attack.toString().length - 8)}
Block: ${playerStats.block}${scriptingUtils.generateSpaces(25 - playerStats.block.toString().length - 7)}| Block: ${enemyStats.block}${scriptingUtils.generateSpaces(20 - enemyStats.block.toString().length - 7)}
\`
${enemyStats.block >= playerStats.attack ? "The enemy has block higher or equal to your attack. **You will only deal damage of one per turn**" : ""}`, "Yes", "No");
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
            response.edit(`PvP cancelled.`)
        }
        
    },
};
