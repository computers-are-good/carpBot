const fs = require("fs");
const path = require('node:path');
const { isNull } = require("util");
function validateData(data) { //make sure no fields are "NaN" or "null"
    for (let item in data) {
        if (typeof data[item] == "object") {
            return validateData(data[item]);
        } else {
            if (data[item] === null) 
                return false;
            if (typeof data[item] === "number" && isNaN(data[item]))
                return false;
        }
    }
    return true;
}
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
    },
    saveData: function(userInfo, userId) {
        if (!validateData(userInfo)) throw new Error("User data is corrupt and contains either a null or a NaN value.")
        fs.writeFileSync(path.join(__dirname, `../userdata/economy/${userId}`), JSON.stringify(userInfo));
    }
}