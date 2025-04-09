const path = require("node:path");
const raidUtils = require(path.join(__dirname, "/raid"));
const { getOCR } = require(path.join(__dirname, "/ocr"));
const fs = require("fs");

module.exports = {
    daily: function () {
        return new Promise(async (res) => {
            //This function will be run at the start of each day
            raidUtils.getCurrentMonster();
            let ocr = await getOCR();
            console.log(`The OCR is ${ocr}.`);
            const allUsers = fs.readdirSync(path.join(__dirname, "../userdata/economy"));
            allUsers.forEach(e => {
                const userData = fs.readFileSync(path.join(__dirname, `../userdata/economy/${e}`));
                const parsedData = JSON.parse(userData);
                parsedData.moneyBankAccount += Math.ceil(parsedData.moneyBankAccount * (ocr / 100 / 365));
                if (parsedData.moneyBankAccount !== null)
                    fs.writeFileSync(path.join(__dirname, `../userdata/economy/${e}`), JSON.stringify(parsedData, null, 4));
            })
            res();
        })

    }
}