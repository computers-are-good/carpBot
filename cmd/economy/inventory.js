const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { shopItems } = require(path.join(__dirname, "../../data/shopItems"))

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('See the items in your inventory'),
    async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);

        let inventory = userInfo.inventory;
        let listOfItems = [];
        if (notifications) listOfItems.push(notifications);
        for (let i = 0; i < inventory.length; i++) {
            let inventoryObject = userInfo.inventory[i];
            let shopObject = shopItems[inventoryObject.Id];
            if (!shopObject.displayInInventory) continue;
            let metadataString = "\n`";
            if (shopObject.metadataToDisplay) {
                for (let metadataTag of shopObject.metadataToDisplay) {
                    if (inventoryObject.metadata[metadataTag]) metadataString += `${metadataTag}: ${inventoryObject.metadata[metadataTag]}`;
                }
                metadataString += "`";
            } else {
                metadataString = "";
            }
            listOfItems.push(`${shopObject.emoji ? shopObject.emoji : ""} **${shopObject.name}** ${userInfo.inventory[i].quantity > 1 ? `(owned: ${userInfo.inventory[i].quantity})` : ""}${metadataString}\n${shopObject.description}\n\n`);
        }
        economyUtils.displayList(interaction, listOfItems);
    },
};
