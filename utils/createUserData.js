const fs = require("fs");
const path = require('node:path');

module.exports = {
	createUserData: function(userId) {
        const userData = {
            level: 1,
            expRequired: 12,
            inventory: [],
            moneyOnHand: 0,
            moneyBankAccount: 0,
            megaGem: 0,
            passiveMode: false,
            effects: [],
            friends: [],

        }
        fs.writeFileSync(path.join(__dirname, `../userdata/${userId}`), JSON.stringify(userData))
    }
};