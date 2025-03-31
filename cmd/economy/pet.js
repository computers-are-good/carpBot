const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const {calculateLevelUp} = require(path.join(__dirname, "../../utils/levelup"))
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { petsList } = require(path.join(__dirname, "../../data/petslist"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));

const petMessages = [
    "You took {PETNAME} on a walk.",
    "You patted {PETNAME}'s head"
]
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pet')
		.setDescription('Pet a pet!')
        .addStringOption(option => option.setName("pet").setDescription("Which pet do you want to pet?")),
	async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);
        const selectedPet = interaction.options.getString("pet");
        let toPet;
        if (userInfo.pets.length == 0) {
            await interaction.reply(`${notifications}Welcome to the CrapBot pets system! To get started, buy a pet with \`/petbuy\`.`);
            return;
        }
        for (let pet of userInfo.pets) {
            if (pet.name.toLowerCase() == selectedPet.toLowerCase() || petsList[pet.id].name.toLowerCase() == selectedPet.toLowerCase()) {
                toPet = pet;
            }
        }
        if (!toPet) {
            await interaction.reply(`${notifications}You don't have that pet! Reply with the name of the pet, or the type of pet.`);
            return;
        }
        let pointsGained = scriptingUtils.randIntBetween(3, 8);
        const levelUpResults = calculateLevelUp(toPet.bondLevel, toPet.pointsUntilIncrease, pointsGained, level => 100 + level * 50);
        let stringToReply = notifications + scriptingUtils.choice(petMessages).replace("{PETNAME}", toPet.name);
        stringToReply += `\nGained ${pointsGained} bond points.`;

        if (levelUpResults.newLevel !== toPet.bondLevel) {
            stringToReply += `\nYour bond with ${toPet.name} has deepened! (${toPet.bondLevel} -> ${levelUpResults.newLevel})`;
            if (toPet.id == 105) {
                userInfo.combat.attack += 10 * (levelUpResults.newLevel - toPet.bondLevel);
            }
        } else {
            stringToReply += `\nYou need ${levelUpResults.newExpRequired} more points to increase your bond with ${toPet.name}`;
        }
        toPet.bondLevel = levelUpResults.newLevel;
        toPet.pointsUntilIncrease = levelUpResults.newExpRequired;

        await interaction.reply(stringToReply);
        saveData(userInfo, interaction.user.id);
	},
};
