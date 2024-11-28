module.exports = {
    grantEffect: function (userInfo, effect, duration) {
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