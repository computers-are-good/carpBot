const fs = require("fs");
const path = require('node:path');
const scriptingUtils = require(path.join(__dirname, "/scripting"));
const economyUtils = require(path.join(__dirname, "/economy"));
const {gainExp} = require(path.join(__dirname, "/levelup"));
const { monsters, raidBossLoot } = require(path.join(__dirname, "../data/monsters"));
const raidBossList = ["Monella, Ultimate Master", "Sytlar, Demon of the Underworld"];
const { shopItems } = require(path.join(__dirname, "../data/shopItems"));

module.exports = {
    distributeRewards(currentRaidData) {
        for (let id of Object.keys(currentRaidData.playersDamage)) {
            const dmgFromPlayer = currentRaidData.playersDamage[id];
            let playerNotification = `You dealt ${dmgFromPlayer} damage to ${currentRaidData.currentMonster}. `;
            const dmgFromEveryone = currentRaidData.maxHealth - currentRaidData.combat.health;
            const playerData = JSON.parse(fs.readFileSync(path.join(__dirname, `../userdata/economy/${id}`), "UTF-8"));
            let moneyGained = dmgFromPlayer * 100;
            moneyGained += Math.floor(dmgFromEveryone / 10);
            playerData.moneyOnHand += moneyGained;
            let expGained = dmgFromPlayer;
            expGained += Math.floor(dmgFromEveryone / 1000);
            console.log(expGained);
            playerNotification += gainExp(playerData, expGained);

            playerNotification += `You gained the following items: `;
            const bossLoot = raidBossLoot[currentRaidData.currentMonster];
            for (const item of Object.keys(bossLoot)) {
                const dmgReq = bossLoot[item];
                const itemData = shopItems[item];
                let quantityObtained = 0;
                quantityObtained += Math.floor(dmgFromPlayer / dmgReq);
                quantityObtained += Math.floor(dmgFromEveryone / (dmgReq * 1000));
                economyUtils.addToInventory(playerData, item, quantityObtained);
                playerNotification += `${itemData.emoji} ${itemData.name} x${quantityObtained}\n`;
            }

            economyUtils.notifyPlayer(playerData, playerNotification);
            fs.writeFileSync(path.join(__dirname, `../userdata/economy/${id}`), JSON.stringify(playerData));
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
    addPlayerDamage: function (raidData, playerId, damageToAdd) {
        if (raidData.playersDamage[playerId]) {
            raidData.playersDamage[playerId] += damageToAdd;
        } else {
            raidData.playersDamage[playerId] = damageToAdd;
        }
    },
    saveData: function (raidData) {
        fs.writeFileSync(path.join(__dirname, "../userdata/raidboss.json"), JSON.stringify(raidData));
    }
}