const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const dungeonUtils = require(path.join(__dirname, "../../utils/dungeon"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const raidUtils = require(path.join(__dirname, "../../utils/raid"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Raid a boss! Team up with other players and get rewarded!'),
    async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);

        const enemyInfo = raidUtils.getCurrentMonster();
        if (userInfo.learned.includes("Violin")) userInfo.combat.attack += 50;

        const expectedDmgTaken = Math.max(enemyInfo.combat.attack - userInfo.combat.block, 1) * 5;
        const expectedDmgDealt = Math.max(userInfo.combat.attack - enemyInfo.combat.block, 1) * 5;
        let stringToSend = 
`${notifications}Current raid boss: ${enemyInfo.currentMonster}
Time remaining: ${scriptingUtils.getTimeUntilNextDay()} | Health: ${Math.round((enemyInfo.combat.health / enemyInfo.maxHealth) * 100000) / 1000}%
${dungeonUtils.compareStatsString(userInfo.combat, enemyInfo.combat)}
You will deal around ${expectedDmgDealt} damage. You wil take around ${expectedDmgTaken} damage (${userInfo.combat.health}HP -> ${Math.max(userInfo.combat.health - expectedDmgTaken, 0)}HP)
        `
        const results = await economyUtils.confirmation(interaction, stringToSend, "Attack", "Wait, no...");
        const {confirmed, response} = results;
        if (confirmed) {
            const enemyOldHP = enemyInfo.combat.health;
            const playerOldHP = userInfo.combat.health;
            dungeonUtils.battle(userInfo.combat, enemyInfo.combat, 5);
            await response.edit(`You dealt ${enemyOldHP - enemyInfo.combat.health} damage (${Math.round(((enemyOldHP - enemyInfo.combat.health) / enemyInfo.maxHealth) * 100000) / 1000}%) to the enemy! Took ${playerOldHP - userInfo.combat.health} damage`);
            raidUtils.addPlayerDamage(enemyInfo, interaction.user.id, enemyOldHP - enemyInfo.combat.health);
            if (userInfo.learned.includes("Violin")) userInfo.combat.attack -= 50;

            fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${interaction.user.id}`), JSON.stringify(userInfo));
            saveData(enemyInfo);
        }
    },
};
