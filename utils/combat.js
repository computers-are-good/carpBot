module.exports = {
    addCombatProbability(userData, name, probability) {
        const combat = userData.combat.probabilities;
        if (name in combat) {
            combat[name] += probability;
        } else {
            combat[name] = probability;
        }
        if (combat[name] > probabilityCaps[name]) combat[name] = probabilityCaps[name];
    },
    getCombatProbability(combatObj, probability) { //returns true if the effect should trigger. Returns false if otherwise
        const prob = combatObj.probabilities;
        if (!prob) return false;
        if (!(probability in prob)) return false;
        if (prob[probability] < Math.random()) return true;
        return false;
    }
}
