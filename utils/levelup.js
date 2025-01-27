function expRequiredToLevelUp(currentLevel) {
    return Math.floor(10 * Math.pow(currentLevel, 3) + 10);
}

function calculateLevelUp(currentLevel, expRequired, expToGain, levelUpFunction = expRequiredToLevelUp) {
    let newLevel = currentLevel
    let newExpRequired = expRequired;

    if (expRequired <= expToGain) {
        newLevel++
        return calculateLevelUp(newLevel, levelUpFunction(newLevel), expToGain - expRequired, levelUpFunction);
    } else {
        newExpRequired = newExpRequired - expToGain
        return {
            newLevel: newLevel,
            newExpRequired: newExpRequired
        }
    }
}

module.exports = {
    calculateLevelUp,
    gainExp(userInfo, expToGain) { //returns a message to the player
        let results = calculateLevelUp(userInfo.level, userInfo.expRequired, expToGain);
        let oldLevel = userInfo.level;
        userInfo.level = results.newLevel;
        userInfo.expRequired = results.newExpRequired;
        let moneyAwarded = 0;
        if (oldLevel !== userInfo.level) {
            for (let i = oldLevel + 1; i < userInfo.level + 1; i++) {
                moneyAwarded += i * 10000;
            }
            userInfo.moneyOnHand += moneyAwarded;
            userInfo.combat.attack += 2;
            userInfo.combat.maxHealth += 10;
            userInfo.combat.block += 1;
            userInfo.combat.speed += 5;
        }

        if (oldLevel !== results.newLevel) {
            return `Congratulations! You levelled up (${oldLevel} -> ${userInfo.level}). Your stats are increased. Level up bonus: $${moneyAwarded / 100}.`;
        }
        return `You gained ${expToGain} experience. You need ${userInfo.expRequired} experience to level up (${Math.round((1 - (userInfo.expRequired / expRequiredToLevelUp(userInfo.level))) * 1000) / 10}% there).`;
    }
}