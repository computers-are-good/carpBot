const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));

function createLeaderboard() {
    const dirpath = path.join(__dirname, "../../userdata");
    const dir = fs.readdirSync(dirpath);
    let leaderboard = {
        lastUpdated: new Date().getTime(),
        users: []
    }
    for (let file of dir) {
        if (!file.endsWith(".json")) {
            let userData = JSON.parse(fs.readFileSync(path.join(dirpath, file)).toString("UTF-8"));
            let totalBalance = userData.moneyOnHand + userData.moneyBankAccount;

            leaderboard.users.push({
                username: userData.username,
                balance: totalBalance
            });
        }
    }
    leaderboard.users.sort((a,b) => a.balance - b.balance);

    fs.writeFileSync(path.join(__dirname, "../../userdata/leaderboard.json"), JSON.stringify(leaderboard));
    return leaderboard;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Who has the most money?'),
    async execute(interaction) {
        userInfo = await economyUtils.prefix(interaction);
        let leaderboard;
        if (!fs.existsSync(path.join(__dirname, "../../userdata/leaderboard.json"))) {
            leaderboard = createLeaderboard();
        } else {
            leaderboard = JSON.parse(fs.readFileSync(path.join(__dirname, "../../userdata/leaderboard.json")).toString("UTF-8"))
        }
        if (new Date().getTime() > leaderboard.lastUpdated + 360000) {
            leaderboard = createLeaderboard();
        }
        let string = "The leaderboard is updated every hour.";
        const placesToDisplay = Math.min(5, leaderboard.users.length);
        for (let i = 0; i < placesToDisplay; i++) {
            let user = leaderboard.users[leaderboard.users.length - i - 1];
            string += `\n${i + 1}.${user.username}: ${economyUtils.formatMoney(user.balance)}`
        }
        await interaction.reply(string);
    },
};
