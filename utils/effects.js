module.exports = {
    grantEffect: function (userInfo, effect, duration) {
        //delete expired effects
        let now = new Date().getTime();
        userInfo.effects = userInfo.effects.filter(a => a.validUntil > now);
        
        //grant effect
        for (let userEffect in userInfo.effects) {
            if (userInfo.effects[userEffect].name == effect) {
                userInfo.effects[userEffect].validUntil += duration * 1000;
                return userInfo;
            }
        }
        userInfo.effects.push({
            name: effect,
            validUntil: new Date().getTime() + duration * 1000
        });
    },
    hasEffect: function (userInfo, effects) {
        let toReturn = {}
        let now = new Date().getTime();
        userInfo.effects = userInfo.effects.filter(a => a.validUntil > now); //delete expired effects
        for (let effect of effects) {
            let effectFound = false;
            for (let userEffect in userInfo.effects) {
                if (userInfo.effects[userEffect].name == effect) {
                    effectFound = true;
                    toReturn[effect] = Math.floor((userInfo.effects[userEffect].validUntil - now) / 1000);
                    break;
                }
            }
            if (!effectFound) {
                toReturn[effect] = 0;
            }
        }
        return toReturn;
    },

}