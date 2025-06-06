const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { shopItems } = require(path.join(__dirname, "../../data/shopItems"));
const { developerIds } = require(path.join(__dirname, "../../configs.json"))
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .addStringOption(option => option.setName("item").setDescription("Item to buy").setRequired(true))
        .addStringOption(option => option.setName("quantity").setDescription("How much you want to buy"))
        .setDescription('Buys something from the shop!'),
    async execute(interaction) {
        const dataPath = path.join(__dirname, `../../userdata/economy/${interaction.user.id}`)
        const {userInfo, notifications} = await economyUtils.prefix(interaction);

        let itemToBuy = interaction.options.getString("item");
        let quantity = 1;
        let parsedQuantity = parseInt(interaction.options.getString("quantity"))
        if (parsedQuantity && parsedQuantity !== NaN) quantity = parsedQuantity;

        if (!itemToBuy) {
            await interaction.reply(`${notifications}Please specify something to buy! Use /shop to see what is available`);
            return;
        }

        let itemId;

        for (let item in shopItems) {
            if (shopItems[item].name.toLowerCase() == itemToBuy.toLowerCase()) {
                itemId = item;
            }
        }
        if (!itemId) {
            await interaction.reply(`${notifications}This is not an item in the shop.`);
            return;
        }
        const itemData = shopItems[itemId];
        const cost = economyUtils.determinePrice(userInfo, itemData);

        if (itemData.cost && cost * quantity > userInfo.moneyOnHand) {
            await interaction.reply(`${notifications}This item costs ${scriptingUtils.formatMoney(cost * quantity)} but user only has ${scriptingUtils.formatMoney(userInfo.moneyOnHand)} on hand. Try working or withdrawing money from your bank account.`);
            return;
        }

        if (itemData.unwitheringFlowers && itemData.unwitheringFlowers * quantity > userInfo.unwitheringFlowers) {
            await interaction.reply(`${notifications}This item costs ${itemData.unwitheringFlowers} unwithering flowers but user only has ${itemData.unwitheringFlowers} on hand. Attack raid bosses to get unwithering flowers.`);
            return;
        }

        if (itemData.category.includes("testing")) {
            if (!developerIds.includes(interaction.user.id)) {
                await interaction.reply(`${notifications}This item can only be purchased by developers.`);
                return;
            }
        }

        if (itemData.oneOff == true && quantity > 1) {
            await interaction.reply(`${notifications}This item can only be brought once, but you have tried to buy ${quantity} of it.`);
            return;
        }

        //check for one off items that can only be brought once
        for (let i in userInfo.inventory) {
            if (userInfo.inventory[i].Id == itemId) {
                if (itemData.oneOff) {
                    await interaction.reply(`${notifications}This item can only be brought once`);
                    return;
                }
            }
        }

        //If you have 20 houses, you can't buy no more
        if (itemId == 1008) {
            let houseCount = 0;
            for (let i in userInfo.inventory) {
                if (userInfo.inventory[i].Id == 1008) {
                    houseCount++
                }
            }
            if (houseCount + quantity > 20) {
                await interaction.reply(`${notifications}You can only have a maximum of 20 houses.`);
                return;
            }
        }

        //check for the canBuy script
        if (itemData.scripts && itemData.scripts.canBuy) {
            let testResults = itemData.scripts.canBuy(userInfo);
            if (!testResults.canBuy) {
                await interaction.reply(`${notifications}You do not meet the requirements to buy the item. Reason: ${testResults.messageToUser}`);
                return;
            }
        }

        if (itemData.cost) userInfo.moneyOnHand -= cost * quantity;
        if (itemData.unwitheringFlowers) userInfo.unwitheringFlowers -= itemData.unwitheringFlowers;
        economyUtils.addToInventory(userInfo, itemId, quantity);

        userInfo.inventory = userInfo.inventory.sort((a, b) => parseInt(a.Id) - parseInt(b.Id));

        saveData(userInfo, interaction.user.id);
        
        await interaction.reply(`${notifications}You have brought ${quantity}x ${itemData.name} (ID ${itemId}) for ${scriptingUtils.formatMoney(itemData.cost ? cost * quantity : 0)}`);
    },
};

