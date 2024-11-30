const fs = require("fs");
const path = require('node:path');
const {defaultUserData} = require(path.join(__dirname, "../data/defaultuserdata"));

module.exports = {
	createUserData: function(userId, username) {
        let usernames = JSON.parse(fs.readFileSync(path.join(__dirname, `../userdata/usernames.json`)).toString("UTF-8"));
        usernames[userId] = username;
        const data = defaultUserData;
        data.username = username;
        fs.writeFileSync(path.join(__dirname, `../userdata/usernames.json`), JSON.stringify(usernames));
        fs.writeFileSync(path.join(__dirname, `../userdata/${userId}`), JSON.stringify(data));
    }
};