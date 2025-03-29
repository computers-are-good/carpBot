const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const dungeonUtils = require(path.join(__dirname, "../../utils/dungeon"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const raidUtils = require(path.join(__dirname, "../../utils/raid"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));
const { SlashCommandBuilder } = require('discord.js');
const maxPlayerAttackTimes = 5;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Raid a boss! Team up with other players and get rewarded!'),
    async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);

        let enemyInfo = raidUtils.getCurrentMonster();
        if (enemyInfo.combat.health <= 0) {
            await interaction.reply(`The raid has finished for the day.`);
            return;
        }
        if (userInfo.learned.includes("Violin")) userInfo.combat.attack += 50;
        const attackedTimes = enemyInfo.playersAttackedTimes[interaction.user.id] ?? 0;
        let stringToSend = 
`${notifications}Current raid boss: ${enemyInfo.currentMonster} ${attackedTimes < maxPlayerAttackTimes ? `(attacked ${attackedTimes} / ${maxPlayerAttackTimes})` : `As you attacked the enemy **${attackedTimes} times**, you need to use **1 unwithering flower** to continue attacking.`}
Time remaining: ${scriptingUtils.getTimeUntilNextDay()} | Health: ${Math.round((enemyInfo.combat.health / enemyInfo.maxHealth) * 100000) / 1000}%
${dungeonUtils.compareStatsString(userInfo.combat, userInfo.equipment, enemyInfo.combat, 5)}`
        const results = await economyUtils.confirmation(interaction, stringToSend, "Attack", "Wait, no...");
        const {confirmed, response} = results;
        if (confirmed) {
            //check unwithering flowers count
            if (attackedTimes >= maxPlayerAttackTimes) {
                if (userInfo.unwitheringFlowers > 0) {
                    userInfo.unwitheringFlowers--;
                } else {
                    await response.edit(`You are out of unwithering flowers.`);
                    return;
                }
            }
            enemyInfo = raidUtils.getCurrentMonster(); //in case it changed between confirming and the "yes" button pressed
            const enemyOldHP = enemyInfo.combat.health;
            const playerOldHP = userInfo.combat.health;
            dungeonUtils.battle(userInfo, enemyInfo, 5);
            await response.edit(`You dealt ${enemyOldHP - enemyInfo.combat.health} damage (${Math.round(((enemyOldHP - enemyInfo.combat.health) / enemyInfo.maxHealth) * 100000) / 1000}%) to the enemy! Took ${playerOldHP - userInfo.combat.health} damage`);
            raidUtils.addPlayerDamage(enemyInfo, interaction.user.id, enemyOldHP - enemyInfo.combat.health);
            if (userInfo.learned.includes("Violin")) userInfo.combat.attack -= 50;

           fs.writeFileSync(path.join(__dirname, `../../userdata/raidboss.json`), JSON.stringify(enemyInfo));
            saveData(userInfo, interaction.user.id);
        }
    },
};
