const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const { createUserData } = require(path.join(__dirname, "../../utils/createUserData"));
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { shopItems } = require(path.join(__dirname, "../../data/shopItems"));
const { developerIds } = require(path.join(__dirname, "../../configs.json"))

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cook')
        .setDescription('Cooks food in your kitchen!'),
    async execute(interaction) {
        const dataPath = path.join(__dirname, `../../userdata/economy/${interaction.user.id}`)
        userInfo = await economyUtils.prefix(interaction);

        let hasSkill = false;
        for (let skill of userInfo.learned) {
            if (skill == "Cooking") hasSkill = true;
        }

        if (!hasSkill) {
            await interaction.reply("You haven't learnt the Cooking skill yet! Try `/learn cooking`.");
            return;
        }

        const items = {
            1000: 2002,
            3000: 2009,
            6000: 2006,
        }
        const itemsCanBeMade = [];
        const points = userInfo.level * Math.random() * 200;
        for (let pointsNeeded in items) {
            if (pointsNeeded < points) {
                itemsCanBeMade.push(items[pointsNeeded]);
            }
        }
        if (itemsCanBeMade.length > 0) {
            const itemMade = scriptingUtils.choice(itemsCanBeMade);
            economyUtils.addToInventory(userInfo, itemMade, 1);
            await interaction.reply(`Congratulations! You made some ${scriptingUtils.fancyText(`Homemade ${shopItems[itemMade].name}`)}.`);

            fs.writeFileSync(dataPath, JSON.stringify(userInfo));
        } else {
            await interaction.reply(`
You blew up the kitchen and failed to make anything. Try levelling up or /cook again.
Reaching level 10 gives you a roughly 50% chance to make coffee.`);
        }
    },
};

