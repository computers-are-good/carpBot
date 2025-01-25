const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const dungeonUtils = require(path.join(__dirname, "../../utils/dungeon"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const raidUtils = require(path.join(__dirname, "../../utils/raid"));
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const dataLocks = require(path.join(__dirname, "../../utils/datalocks"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Raid a boss! Team up with other players and get rewarded!'),
    async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);

        const enemyInfo = raidUtils.getCurrentMonster();

        let stringToSend = 
`${notifications}Current raid boss: ${enemyInfo.currentMonster}
Time remaining: ${scriptingUtils.getTimeUntilNextDay()}
${dungeonUtils.compareStatsString(userInfo.combat, enemyInfo.combat)}
        `
        const results = await economyUtils.confirmation(interaction, stringToSend, "Attack", "Wait, no...");
        const {confirmed, response} = results;
        if (confirmed) {
            let enemyOldHP = enemyInfo.combat.health;
            dungeonUtils.battle(userInfo.combat, enemyInfo.combat, 5);
            await response.edit(`You dealt ${enemyOldHP - enemyInfo.combat.health} damage to the enemy!`);
            raidUtils.addPlayerDamage(enemyInfo, interaction.user.id, enemyOldHP - enemyInfo.combat.health);

            fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${interaction.user.id}`), JSON.stringify(userInfo));
            raidUtils.saveData(enemyInfo);
        }


    },
};
