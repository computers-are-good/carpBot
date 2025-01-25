const fs = require("fs");
const path = require('node:path');
const scriptingUtils = require(path.join(__dirname, "/scripting"));
const economyUtils = require(path.join(__dirname, "/economy"));
const { calculateLevelUp } = require(path.join(__dirname, "/calculateLevelUp"));
const { monsters } = require(path.join(__dirname, "../data/monsters"));
const raidBossList = ["Monella, Ultimate Master", "Sytlar, Demon of the Underworld"];


module.exports = {
    distributeRewards(currentRaidData) {
        for (let id of Object.keys(currentRaidData.playersDamage)) {
            const dmg = currentRaidData.playersDamage[id];
            const playerData = JSON.parse(fs.readFileSync(path.join(__dirname, `../userdata/economy/${id}`), "UTF-8"));
            const moneyGained = dmg * 100;
            playerData.moneyOnHand += moneyGained;
            const expGained = dmg;
            let levelUpResults = calculateLevelUp(playerData.level, playerData.expRequired, expGained);
            playerData.level = levelUpResults.newLevel;
            playerData.expRequired = levelUpResults.newExpRequired;
            economyUtils.notifyPlayer(playerData, `You have gained ${expGained} exp and ${economyUtils.formatMoney(moneyGained)} from ${currentRaidData.currentMonster}`)
            fs.writeFileSync(path.join(__dirname, `../userdata/economy/${id}`), JSON.stringify(playerData))
        }
    },
    getCurrentMonster: function () {
        function generateNewRaidData(currentRaidData) {
            let selectedMonster;
            if (typeof currentRaidData !== "undefined") {
                let i = raidBossList.indexOf(currentRaidData.currentMonster) + 1;
                if (i > raidBossList.length - 1) i = 0;
                selectedMonster = raidBossList[i];
            } else {
                selectedMonster = raidBossList[0];
            }
            const raidData = {
                currentMonster: selectedMonster,
                date: scriptingUtils.getCurrentDay(),
                level: Math.floor(Math.random() * 3) + 10,
                combat: monsters[selectedMonster],
                playersDamage: {},
            };
            for (let stat in raidData.combat) {
                if (stat in ["health", "block", "attack"]) raidData.combat[stat] *= raidData.level;
            }
            raidData.maxHealth = raidData.combat.health;
            return raidData;
        }
        let raidData;
        if (fs.existsSync(path.join(__dirname, "../userdata/raidboss.json"))) {
            raidData = JSON.parse(fs.readFileSync(path.join(__dirname, "../userdata/raidboss.json"), "UTF-8"));
            if (raidData.date !== scriptingUtils.getCurrentDay()) {
                this.distributeRewards(raidData);
                raidData = generateNewRaidData(raidData);
                this.saveData(raidData);
            }
        } else {
            raidData = generateNewRaidData();
            this.saveData(raidData);
        }

        return raidData;
    },
    addPlayerDamage: function(raidData, playerId, damageToAdd) {
        if (raidData.playersDamage[playerId]) {
            raidData.playersDamage[playerId] += damageToAdd;
        } else {
            raidData.playersDamage[playerId] = damageToAdd;
        }
    },
    saveData: function(raidData) {
        fs.writeFileSync(path.join(__dirname, "../userdata/raidboss.json"), JSON.stringify(raidData));
    }
}