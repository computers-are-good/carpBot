const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { petsList } = require(path.join(__dirname, "../../data/petslist"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('petbuy')
        .setDescription('Buy or look at a list of pets.')
        .addStringOption(option => option.setName("pet").setDescription("Which pet do you want to buy?")),
    async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);
        const petToBuy = interaction.options.getString("pet");
        function userHasPet(petId) {
            for (let i of userInfo.pets) {
                if (i.id == petId) {
                    return true;
                }
            }
            return false;
        }
        const petsToBuy = [];
        for (let pet in petsList) {
            if (!userHasPet(pet)) {
                petsToBuy.push(petsList[pet]);
            }
        }
        if (!petToBuy) {
            const listToDisplay = [];
            for (let i of petsToBuy) {
                listToDisplay.push(`${i.name}: ${i.description}\n`);
            }
            economyUtils.displayList(interaction, listToDisplay);
        } else {
            //not a valid pet?
            let selectedPet;
            let selectedPetId;
            for (let pet in petsList) {
                if (petsList[pet].name.toLowerCase() == petToBuy.toLowerCase()) {
                    selectedPet = petsList[pet];
                    selectedPetId = pet;
                }
            }
            if (!selectedPet) {
                await interaction.reply(`${notifications}That pet is not in the database!`);
                return;
            }

            //Do we have the pet?
            if (userHasPet(selectedPetId)){
                await interaction.reply(`${notifications}You already have a ${selectedPet.name}!`);
                return;
            }
            
            //Do we have the money?
            if (userInfo.moneyOnHand < selectedPet.cost) {
                await interaction.reply(`${notifications}The pet costs ${scriptingUtils.formatMoney(selectedPet.cost)} but you only have ${userInfo.moneyOnHand}`);
                return;
            }

            //Time to buy the pet!
            userInfo.moneyOnHand -= selectedPet.cost;
            const petName = scriptingUtils.choice(selectedPet.names)
            userInfo.pets.push(
                {
                    id: selectedPetId,
                    name: petName,
                    bondLevel: 1,
                    pointsUntilIncrease: 100
                }
            );
            await interaction.reply(`${notifications}You have brought a ${selectedPet.name} named ${petName}.`);
            saveData(userInfo, interaction.user.id);
        }
    },
};
