const fs = require("fs");
const path = require('node:path');

module.exports = {
	createUserData: function(userId, username) {
        const userData = {
            level: 1,
            username: username,
            expRequired: 15,
            inventory: [],
            moneyOnHand: 0,
            lastDaily: "",
            combat: {
                health: 100,
                block: 10,
                maxHealth: 100,
                attack: 10,
            },
            pets:[],
            moneyBankAccount: 0,
            megaGem: 0,
            passiveMode: false,
            lastGotRobbed: 0,
            lastTogglePassiveMode: 0,
            lastRobbedSomeone: 0,
            effects: [],
            friends: [],
            dungeonsCompleted: [],
            learned: [],
        }
        let usernames = JSON.parse(fs.readFileSync(path.join(__dirname, `../userdata/usernames.json`)).toString("UTF-8"));
        usernames[userId] = username;
        fs.writeFileSync(path.join(__dirname, `../userdata/usernames.json`), JSON.stringify(usernames));
        fs.writeFileSync(path.join(__dirname, `../userdata/${userId}`), JSON.stringify(userData));
    }
};