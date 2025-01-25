const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { petsList } = require(path.join(__dirname, "../../data/petslist"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('petrename')
        .setDescription('Rename your pet.')
        .addStringOption(option => option.setName("oldname").setDescription("The old name of your pet").setRequired(true))
        .addStringOption(option => option.setName("newname").setDescription("The new name of your pet").setRequired(true)),
    async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);
        const oldName = interaction.options.getString("oldname");
        const newName = interaction.options.getString("newname");

        let executedRename = false;
        async function executeRename(petObject) {
            //Check the old name: can't be the name of an existing pet
            for (let pet in petsList) {
                if (petsList[pet].name.toLowerCase() == newName.toLowerCase()) {
                    await interaction.reply(`${notifications}${newName} is a type of pet. This name cannot be used`);
                    return;
                }
            }
            //Can it pass the profanity check?
            if (!economyUtils.profanityCheck(oldName)) {
                await interaction.reply(`${notifications}This name has failed the profanity check`);
                return;
            }

            //actually execute the rename
            let oldNameToUseInMsg = petObject.name;
            petObject.name = newName;

            await interaction.reply(`${notifications}Pet ${oldNameToUseInMsg} renamed to ${petObject.name}.`);
            fs.writeFileSync(path.join(__dirname, `../../userdata/economy/${interaction.user.id}`), JSON.stringify(userInfo));
        }
        //Has the user entered a type of pet e.g. "Dog"?
        for (let pet in petsList) {
            if (petsList[pet].name.toLowerCase() === oldName.toLowerCase()) {
                //Do you have that type of pet...?
                for (let userPet in userInfo.pets) {
                    if (userInfo.pets[userPet].id == pet) {
                        //Rename that pet
                        executedRename = true;
                        await executeRename(userInfo.pets[userPet]);
                    }
                }
            }
        }
        //Then search for the pet with the specific name that the user has entered

        if (!executedRename) {
            for (let pet in userInfo.pets) {
                if (userInfo.pets[pet].name.toLowerCase() == oldName.toLowerCase()) {
                    executedRename = true;
                    await executeRename(userInfo.pets[pet]);
                }
            }
        }

        if (!executedRename) {
            await interaction.reply(`${notifications}Pet ${oldName} not found!`);
        }
    },
};
