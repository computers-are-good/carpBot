const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { petsList } = require(path.join(__dirname, "../../data/petslist"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('petlist')
		.setDescription('List your pets!'),
	async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);

        let listToDisplay = [];
        if (notifications) listToDisplay.push(notifications);
        for (let petObj of userInfo.pets)
            listToDisplay.push(`${petObj.name} the ${petsList[petObj.id].name} | Bond level ${petObj.bondLevel} (${petObj.pointsUntilIncrease} until next)\n${petsList[petObj.id].description}`)

        economyUtils.displayList(interaction, listToDisplay, 5);
	},
};
