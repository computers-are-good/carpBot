const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const dataLocks = require(path.join(__dirname, "../../utils/datalocks"));
const {grantEffect} = require(path.join(__dirname, "../../utils/grantEffect.js"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rob')
		.setDescription('Robs another player (cannot be used on players in passive mode)')
		.addUserOption(option => option.setName("player").setDescription("Username of player to rob")),
	async execute(interaction) {
		userInfo = await economyUtils.prefix(interaction);

		//search for the player
		let targetPlayer = interaction.options.getUser("player");
		const targetPlayerId = targetPlayer.id

		let griefTestResults = await economyUtils.canGriefPlayer(targetPlayerId, userInfo, interaction);
		if (!griefTestResults.canGrief) return;
		let targetPlayerData = griefTestResults.targetUserData;

		const time = new Date().getTime();
		let percentageToRob = 0.1;
		let moneyRobbed = Math.floor(targetPlayerData.moneyOnHand * percentageToRob);
		let moneyLostOnFail = Math.ceil(userInfo.moneyOnHand * 0.02);
		let successChance = 0.8;
		if (time - targetPlayerData.lastGotRobbed < 60000) {
			successChance = 0
		} else {
			successChance = Math.min(Math.ceil(successChance * ((time - targetPlayerData.lastGotRobbed) / 4000000) * 1000) / 1000, successChance);
		}

		dataLocks.lockData(targetPlayerId);
		dataLocks.lockData(interaction.user.id);
		try {
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
						let criminalDuration = 300;
						//Birds reduce duration of "criminal"
						for (let pet of userInfo.pets) {
							if (pet.id == 103) {
								criminalDuration -= Math.floor(criminalDuration * 0.02 * pet.bondLevel);
							}
							if (criminalDuration <= 10) criminalDuration = 10; 
						}
						userInfo = grantEffect(userInfo, "criminal", 300);
					}
					targetPlayerData.lastGotRobbed = time;
					userInfo.lastRobbedSomeone = time;

					fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${interaction.user.id}`), JSON.stringify(userInfo));
					fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${targetPlayerId}`), JSON.stringify(targetPlayerData));
				} else {
					response.edit("Robbery cancelled.");
				}
				dataLocks.unlockData(targetPlayerId);
				dataLocks.unlockData(interaction.user.id);
			}, val => {
				let { response } = val;
				response.edit("The player was not robbed (you have timed out).");
				dataLocks.unlockData(targetPlayerId);
				dataLocks.unlockData(interaction.user.id);
			});
		} catch {
			dataLocks.unlockData(targetPlayerId);
			dataLocks.unlockData(interaction.user.id);
		}
	},
};
