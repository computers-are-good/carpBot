function expRequiredToLevelUp(currentLevel) {
    return Math.floor(10 * Math.pow(currentLevel, 5 / 2) + 10)
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
        userInfo.moneyOnHand += userInfo.level * 10000;
        userInfo.combat.attack += 2;
        userInfo.combat.maxHealth += 10;
        userInfo.combat.block += 1;
        userInfo.combat.speed += 5;

        if (oldLevel !== results.newLevel) {
            return `Congratulations! You levelled up (${oldLevel} -> ${userInfo.level}). Your stats are increased. Level up bonus: $${userInfo.level * 100}.`;
        }
        return `You gained ${expToGain} experience. You need ${userInfo.expRequired} experience to level up (${Math.round((1 - (userInfo.expRequired / expRequiredToLevelUp(userInfo.level))) * 1000) / 10}% there).`;
    }
}