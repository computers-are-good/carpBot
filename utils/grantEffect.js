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
        return userInfo;
    },
}