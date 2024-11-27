const fs = require("fs");
const path = require('node:path');
const {createUserData} = require(path.join(__dirname, "/createUserData"));


module.exports = {
    formatMoney: function (val) {
        if (val == 0) return `$0.00`;
        if (val <= 9) return `$0.0${val}`;
        if (val <= 99) return `$0.${val}`;
        let arr = val.toString().split('');
        arr.splice(arr.length - 2, 0, ".");
        return `$${arr.join("")}`
    },
    prefix: function (interaction) {
        return new Promise((acc, rej) => {
            const dataPath = path.join(__dirname, `../userdata/${interaction.user.id}`)

            if (!fs.existsSync(dataPath)) {
                createUserData(interaction.user.id, interaction.user.username);
            }
            let userInfo
            try {
                userInfo = JSON.parse(fs.readFileSync(dataPath));
            } catch {
                rej("Looks like your data is corrupted. Oops.");
            }
            if (userInfo.username != interaction.user.username) userInfo.username = interaction.user.username;
    
            acc(userInfo);
        })

    }
};