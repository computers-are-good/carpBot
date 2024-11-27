const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const {createUserData} = require(path.join(__dirname, "../../utils/createUserData"));
const {calculateLevelUp} = require(path.join(__dirname, "../../utils/calculateLevelUp"));
const economyUtils = require(path.join(__dirname, "../../utils/economy"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work to make some money!'),
	async execute(interaction) {
        const dataPath = path.join(__dirname, `../../userdata/${interaction.user.id}`)

        console.log(interaction);
        if (!fs.existsSync(dataPath)) {
            createUserData(interaction.user.id);
        }
        const userInfo = JSON.parse(fs.readFileSync(dataPath));
        let expToGain = Math.ceil((1.25 - Math.random()* 0.5) * Math.pow(userInfo.level, 0.5) * 2 + 4);
        let { newLevel, newExpRequired} = calculateLevelUp(userInfo.level, userInfo.expRequired, expToGain);
        let moneyGained = Math.ceil(((1.25 - Math.random()* 0.5) * Math.pow(userInfo.level, 0.5) + 1) * 100);
        userInfo.moneyOnHand += moneyGained;

        let stringToWrite = 
`
User ${interaction.user.username} has done some work. 
They have gained ${economyUtils.formatMoney(moneyGained)}.
They now have ${economyUtils.formatMoney(userInfo.moneyOnHand)} in their wallet.`

        userInfo.expRequired = newExpRequired;
        if (newLevel != userInfo.level) {
            stringToWrite += `\nThey have levelled up from level ${userInfo.level} to ${newLevel}`;
            userInfo.level = newLevel
        } else {
            stringToWrite += `\nThey have gained ${expToGain} exp. They need ${newExpRequired} to level up.`;
        }

        fs.writeFileSync(dataPath, JSON.stringify(userInfo));

		await interaction.reply(stringToWrite);
	},
};
