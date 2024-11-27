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
        userInfo = await economyUtils.prefix(interaction);

        const previous = new ButtonBuilder()
            .setCustomId('Previous')
            .setLabel('Previous Page')
            .setStyle(ButtonStyle.Secondary);

        const next = new ButtonBuilder()
            .setCustomId('Next')
            .setLabel('Next Page')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(previous, next);
            
        let inventory = userInfo.inventory;

        if (inventory.length == 0) {
            await interaction.reply("Your inventory is empty.");
            return;
        }
        function outputString(pageSize, pageOffset) {
            let stringToReply = ""
            for (let i = 0; i < pageSize; i++) {
                if (i + pageOffset >= inventory.length) break;
                let inventoryObject = userInfo.inventory[i + pageOffset];
                let shopObject = shopItems[inventoryObject.Id];
                if (!shopObject.dispayInInventory) continue;
                let metadataString = "\n`";
                if (shopObject.metadataToDisplay) {
                    for (let metadataTag of shopObject.metadataToDisplay) {
                        if (inventoryObject.metadata[metadataTag]) metadataString += `${metadataTag}: ${inventoryObject.metadata[metadataTag]}`;
                    }
                    metadataString += "`";
                } else {
                    metadataString = "";
                }
                stringToReply += `${shopObject.emoji ? shopObject.emoji : ""} **${shopObject.name}** ${userInfo.inventory[i].quantity > 1 ? `(owned: ${userInfo.inventory[i].quantity})` : ""}${metadataString}\n${shopObject.description}\n\n`;
            }
            return stringToReply;
        }
        let pageOffset = 0;
        let stringToReply = outputString(5, pageOffset);

        let response = await interaction.reply({
            content: stringToReply,
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;
        let buttons
        async function updateButtons() {
            try {
                buttons = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
                if (buttons.customId === 'Previous') {
                    pageOffset = Math.max(0, pageOffset - 5);
                    stringToReply = outputString(5, pageOffset);
                    buttons.update({ content: stringToReply, components: [row] });
                    updateButtons();
                } else if (buttons.customId === 'Next') {
                    pageOffset = Math.min(pageOffset + 5, inventory.length - inventory.length % 5);
                    stringToReply = outputString(5, pageOffset);
                    buttons.update({ content: stringToReply, components: [row] });
                    updateButtons();
                }
            } catch (e) {
                await response.edit({ content: stringToReply, components: [] })
            }

        }
        updateButtons();

    },
};
