const fs = require("fs");
const path = require('node:path');
const {defaultGachaData} = require(path.join(__dirname, "../data/defaultgachadata"));

module.exports = {
    prefix: function (interaction) {
        let userInfo;
        const pathToUse = path.join(__dirname, `../userdata/gacha/${interaction.user.id}`)
        if (fs.existsSync(path)) {
            userInfo = JSON.parse(fs.readFileSync(pathToUse, "utf-8"));
        } else {
            userInfo = defaultGachaData;
        }
        return userInfo;
    }
}