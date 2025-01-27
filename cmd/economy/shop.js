const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { shopItems } = require(path.join(__dirname, "../../data/shopItems"))

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Browse items for sale!')
        .addStringOption(option => option.setName("category").setDescription("Category")),
    async execute(interaction) {
        const category = interaction.options.getString("category");
        const {notifications, userInfo} = await economyUtils.prefix(interaction);

        let objectsFittingCriteria = [];
        let stringsToDisplay = [];
        if (notifications) stringsToDisplay.push(notifications)
        for (let item in shopItems) {
            if (shopItems[item].category.includes("testing") || shopItems[item].displayInShop == false) continue;
            if (!category) {
                objectsFittingCriteria.push(shopItems[item]);
            } else if (category && shopItems[item].category.includes(category)) {
                objectsFittingCriteria.push(shopItems[item]);
            }
        }
        for (let i = 0; i < objectsFittingCriteria.length; i++) {
            let object = objectsFittingCriteria[i];
            let costs = [];
            if (object.cost) costs.push(economyUtils.formatMoney(economyUtils.determinePrice(userInfo, object)));
            if (object.unwitheringFlowers) costs.push(`${object.unwitheringFlowers} unwithering flowers`);
            stringsToDisplay.push(`${object.emoji ? object.emoji : ""} **${object.name}** (${costs.join(", ")}):\nCategories: ${object.category.join(", ")}\n${object.description}\n`);
        }

        economyUtils.displayList(interaction, stringsToDisplay);
    }
}
