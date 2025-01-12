const fs = require("fs");
const path = require('node:path');
module.exports = {
    lockData: function(userId) {
        fs.writeFileSync(path.join(__dirname, `../userdata/economy/.lock ${userId}`), "");
    },
    dataIsLocked: function(userId) {
        return fs.existsSync(path.join(__dirname, `../userdata/economy/.lock ${userId}`));
    },
    unlockData: function(userId) {
        if (fs.existsSync(path.join(__dirname, `../userdata/economy/.lock ${userId}`)))
            fs.rmSync(path.join(__dirname, `../userdata/economy/.lock ${userId}`));
    }
}