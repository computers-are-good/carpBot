const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));


module.exports = {
	data: new SlashCommandBuilder()
		.setName('rob')
		.setDescription('Robs another player (cannot be used on players in passive mode)')
		.addUserOption(option => option.setName("player").setDescription("Username of player to rob")),
	async execute(interaction) {
		userInfo = await economyUtils.prefix(interaction);

		//search for the player
		let targetPlayer = interaction.options.getUser("player");
		let targetPlayerId = targetPlayer.id;

		if (!fs.existsSync(path.join(__dirname, `../../userdata/${targetPlayerId}`))) {
			await interaction.reply("This user has not used CrapBot.");
			return;
		}

		if (userInfo.passiveMode) {
			await interaction.reply("You are in passive mode.");
			return;
		}
		let targetPlayerData = JSON.parse(fs.readFileSync(path.join(__dirname, `../../userdata/${targetPlayerId}`)).toString("UTF-8"));

		if (targetPlayerData.passiveMode) {
			await interaction.reply("That user is in passive mode. Please leave them alone.");
			return;
		}
		const time = new Date().getTime();
		let percentageToRob = 0.1;
		let moneyRobbed = Math.floor(targetPlayerData.moneyOnHand * percentageToRob);
		let moneyLostOnFail = Math.ceil(userInfo.moneyOnHand * 0.02);
		let successChance = 0.9;
		if (time - targetPlayerData.lastGotRobbed < 60000) {
			successChance = 0
		} else {
			successChance = Math.min(Math.ceil(successChance * ((time - targetPlayerData.lastGotRobbed) / 4000000) * 1000) / 1000, successChance);
		}

		economyUtils.confirmation(interaction, `Preparing to rob ${targetPlayer.username} for ${economyUtils.formatMoney(moneyRobbed)} with a ${successChance * 100}% chance of success. Are you sure?`).then(val => {
			let { confirmed, response } = val;
			if (confirmed) {
				if (Math.random() < successChance) {
					//success
					targetPlayerData.moneyOnHand -= moneyRobbed;
					userInfo.moneyOnHand += moneyRobbed;
					response.edit("Successfully robbed the guy!");
				} else {
					targetPlayerData.moneyOnHand += moneyLostOnFail;
					userInfo.moneyOnHand -= moneyLostOnFail;
					response.edit(`You failed robbing the guy. You lost ${economyUtils.formatMoney(moneyLostOnFail)}`);
				}
				targetPlayerData.lastGotRobbed = time;
				userInfo.lastRobbedSomeone = time;

				fs.writeFileSync(path.join(__dirname, `../../userdata/${interaction.user.id}`), JSON.stringify(userInfo));
				fs.writeFileSync(path.join(__dirname, `../../userdata/${targetPlayerId}`), JSON.stringify(targetPlayerData));
			} else {
				response.edit("Robbery cancelled.");
			}
		}, val => {
			let {response} = val;
			response.edit("The player was not robbed (you have timed out).")
		});

	},
};
