const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { petsList } = require(path.join(__dirname, "../../data/petslist"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('petbuy')
        .setDescription('Buy or look at a list of pets.')
        .addStringOption(option => option.setName("pet").setDescription("Which pet do you want to buy?")),
    async execute(interaction) {
        userInfo = await economyUtils.prefix(interaction);
        const petToBuy = interaction.options.getString("pet");
        function userHasPet(petId) {
            for (let i in userInfo.pets) {
                if (i == petId) {
                    return true;
                }
            }
            return false;
        }
        const petsToBuy = [];
        for (let pet in petsList) {
            if (!userHasPet(petsList[pet].id)) {
                petsToBuy.push(petsList[pet]);
            }
        }
        if (!petToBuy) {
            const listToDisplay = [];
            for (let i of petsToBuy) {
                listToDisplay.push(`${i.name}: ${i.description}\n`);
            }
            economyUtils.displayList(interaction, listToDisplay);
        }


    },
};
