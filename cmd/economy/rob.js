const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const userData = require(path.join(__dirname, "../../utils/userdata"));
const {grantEffect, hasEffect} = require(path.join(__dirname, "../../utils/effects"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rob')
		.setDescription('Robs another player (cannot be used on players in passive mode)')
		.addUserOption(option => option.setName("player").setDescription("Username of player to rob")),
	async execute(interaction) {
		const {userInfo, notifications} = await economyUtils.prefix(interaction);

		//search for the player
		let targetPlayer = interaction.options.getUser("player");
		const targetPlayerId = targetPlayer.id

		let griefTestResults = await economyUtils.canGriefPlayer(targetPlayerId, userInfo, interaction, notifications);
		if (!griefTestResults.canGrief) return;
		let targetPlayerData = griefTestResults.targetUserData;

		let effectResults = hasEffect(userInfo, ["criminal"]);
        if (effectResults.criminal > 0) {
            await interaction.reply(`${notifications}You're already a criminal! You shouldn't do more crimes. (Remaining: ${effectResults.criminal}s)`);
            return;
        }


		const time = new Date().getTime();
		let percentageToRob = 0.1;
		let moneyRobbed = Math.floor(targetPlayerData.moneyOnHand * percentageToRob);
		let moneyLostOnFail = Math.ceil(userInfo.moneyOnHand * 0.02);
		let successChance = 0.8;
		if (userInfo.learned.includes("Flying")) successChance += 0.15;
		if (time - targetPlayerData.lastGotRobbed < 60000) {
			successChance = 0
		} else {
			successChance = Math.min(Math.ceil(successChance * ((time - targetPlayerData.lastGotRobbed) / 4000000) * 1000) / 1000, successChance);
		}

		userData.lockData(targetPlayerId);
		userData.lockData(interaction.user.id);
		try {
			economyUtils.confirmation(interaction, `${notifications}Preparing to rob ${targetPlayer.username} for ${economyUtils.formatMoney(moneyRobbed)} with a ${successChance * 100}% chance of success. Are you sure?`).then(val => {
				let { confirmed, response } = val;
				if (confirmed) {
					if (Math.random() < successChance) {
						//success
						targetPlayerData.moneyOnHand -= moneyRobbed;
						userInfo.moneyOnHand += moneyRobbed;
						economyUtils.notifyPlayer(targetPlayerData, `${interaction.user.username} robbed you for ${economyUtils.formatMoney(moneyRobbed)}`, true);
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
						grantEffect(userInfo, "criminal", 300);
					}
					targetPlayerData.lastGotRobbed = time;
					userInfo.lastRobbedSomeone = time;

					userData.saveData(userInfo, interaction.user.id);
					userData.saveData(targetPlayerData, targetPlayerId);
				} else {
					response.edit("Robbery cancelled.");
				}
				userData.unlockData(targetPlayerId);
				userData.unlockData(interaction.user.id);
			}, val => {
				let { response } = val;
				response.edit("The player was not robbed (you have timed out).");
				userData.unlockData(targetPlayerId);
				userData.unlockData(interaction.user.id);
			});
		} catch {
			userData.unlockData(targetPlayerId);
			userData.unlockData(interaction.user.id);
		}
	},
};
