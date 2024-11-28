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
			successChance = Math.min(Math.ceil(successChance * ((time - targetPlayerData.lastGotRobbed) / 1000000) * 1000) / 1000, successChance);
		}

		const previous = new ButtonBuilder()
            .setCustomId('Confirm')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Primary);

        const next = new ButtonBuilder()
            .setCustomId('Cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(previous, next);
		
		let response = await interaction.reply({
			content: `Preparing to rob ${targetPlayer.username} for ${economyUtils.formatMoney(moneyRobbed)} with a ${successChance} chance of success. Are you sure?`,
			components: [row]
		});

		const collectorFilter = i => i.user.id === interaction.user.id;
		try {
			buttons = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
			if (buttons.customId === 'Confirm') {
				if (Math.random() < successChance) {
					//success
					targetPlayerData.moneyOnHand -= moneyRobbed;
					userInfo.moneyOnHand += moneyRobbed;
					buttons.update({content: "Successfully robbed the guy!", components: [] });
					
				} else {
					targetPlayerData.moneyOnHand += moneyLostOnFail;
					userInfo.moneyOnHand -= moneyRobbed;
					buttons.update({ content: `You failed robbing the guy. You lost ${economyUtils.formatMoney(moneyLostOnFail)}`, components: [] });
				}
				targetPlayerData.lastGotRobbed = time;
				userInfo.lastRobbedSomeone = time;
				fs.writeFileSync(path.join(__dirname, `../../userdata/${interaction.user.id}`), JSON.stringify(userInfo));
				fs.writeFileSync(path.join(__dirname, `../../userdata/${targetPlayerId}`), JSON.stringify(targetPlayerData));
				return;
			} else if (buttons.customId === 'Cancel') {
				await response.edit({ content: "Action cancelled.", components: [] });
			return;
			}
		} catch (e) {
			await response.edit({ content: "Timed out.", components: [] });
			return;
		}
	},
};
