const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { shopItems } = require(path.join(__dirname, "../../data/shopItems"))

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Browse items for sale!')
        .addStringOption(option => option.setName("category").setDescription("Category")),
    async execute(interaction) {
        userInfo = await economyUtils.prefix(interaction);
        const category = interaction.options.getString("category");

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


        let objectsFittingCriteria = [];
        for (let item in shopItems) {
            if (shopItems[item].category.includes("testing")) continue;
            if (!category) {
                objectsFittingCriteria.push(shopItems[item]);
            } else if (category && shopItems[item].category.includes(category)) {
                objectsFittingCriteria.push(shopItems[item]);
            }
        }
        function outputString(pageSize, pageOffset) {
            let stringToReply = ""
            for (let i = 0; i < pageSize; i++) {
                if (pageSize + pageOffset > objectsFittingCriteria.length) break;
                let object = objectsFittingCriteria[i + pageOffset];
                stringToReply += `${object.emoji ? object.emoji : ""} **${object.name}** (${economyUtils.formatMoney(object.cost)}):\nCategories: ${object.category.join(", ")}\n${object.description}\n\n`;
            }
            return stringToReply;
        }
        let pageOffset = 0;
        let stringToReply = outputString(5, pageOffset)
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
                    pageOffset = Math.min(pageOffset + 5, objectsFittingCriteria.length - 5);
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
