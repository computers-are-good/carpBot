function expRequiredToLevelUp(currentLevel) {
    return Math.floor(10 * Math.pow(currentLevel, 5 / 2) + 10)
}

function calculateLevelUp(currentLevel, expRequired, expToGain) {
    let newLevel = currentLevel
    let newExpRequired = expRequired;

    if (expRequired <= expToGain) {
        newLevel++
        return calculateLevelUp(newLevel, expRequiredToLevelUp(newLevel), expToGain - expRequired)
    } else {
        newExpRequired = newExpRequired - expToGain
        return {
            newLevel: newLevel,
            newExpRequired: newExpRequired
        }
    }
}
module.exports = {
	calculateLevelUp
};