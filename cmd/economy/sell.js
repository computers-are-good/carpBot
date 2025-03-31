const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { shopItems } = require(path.join(__dirname, "../../data/shopItems"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sell')
        .addStringOption(option => option.setName("item").setDescription("Item to sell").setRequired(true))
        .addStringOption(option => option.setName("quantity").setDescription("How much you want to sell?"))
        .setDescription('Buys something from the shop!'),
    async execute(interaction) {
        const { userInfo, notifications } = await economyUtils.prefix(interaction);

        function playerHasEquipped(id) {
            for (let item in userInfo.equipment) {
                if (userInfo.equipment[item] == id) return true;
            }
            return false;
        }

        let itemToSell = interaction.options.getString("item");
        let quantity = 1;
        let parsedQuantity = parseInt(interaction.options.getString("quantity"))
        if (parsedQuantity && !isNaN(parsedQuantity)) quantity = parsedQuantity;

        if (!itemToSell) {
            await interaction.reply(`${notifications}Please specify something to sell! Use /shop to see what is available.`);
            return;
        }

        let itemInfo;
        let itemInInventory;
        let index;

        for (let item in userInfo.inventory) {
            if (shopItems[userInfo.inventory[item].Id].name.toLowerCase().replaceAll(" ", "") == itemToSell.toLowerCase().replaceAll(" ", "")) {
                itemInfo = shopItems[userInfo.inventory[item].Id];
                itemInInventory = userInfo.inventory[item];
                index = item;
                break;
            }
        }
        if (!itemInfo) {
            await interaction.reply(`${notifications}Item not found in inventory!`);
            return;
        }
        if (quantity > itemInInventory.quantity) {
            await interaction.reply(`${notifications}You tried to sell ${quantity} of ${itemInfo.name} but you only have ${itemInInventory.quantity} in your inventory.`);
            return;
        }

        if (("canSell" in itemInfo && itemInfo.canSell === false) || !("cost" in itemInfo)) {
            await interaction.reply(`${notifications}This item can't be sold.`);
            return;
        }

        let moneyEarned = Math.round(quantity * itemInfo.cost * Math.min((itemInInventory.sellMultiplier ?? 0.5) * userInfo.sellMultiplier, 0.95));

        let lastEquipmentLeft = false;
        if (itemInfo.category.includes("equipment") && quantity >= itemInInventory.quantity && playerHasEquipped(itemInfo.id)) {
            lastEquipmentLeft = true;
        }
        let { confirmed, response } = await economyUtils.confirmation(interaction, `${notifications}Sell x${quantity} ${itemInfo.name}? You will earn ${scriptingUtils.formatMoney(moneyEarned)}${lastEquipmentLeft ? `\n**Your ${itemInfo.name} will be unequipped.**` : ""}`);

        if (confirmed) {
            userInfo.moneyOnHand += moneyEarned;
            itemInInventory.quantity -= quantity;
            if (lastEquipmentLeft) { //unequip the item, if the user is selling their last piece of an equipment
                for (let equip in userInfo.equipment) {
                    if (userInfo.equipment[equip] == itemInfo.id) {
                        userInfo.equipment[equip] = 0;
                    }
                }
            }
            if (itemInInventory.quantity <= 0) {
                userInfo.inventory.splice(index, 1);
            }
            await response.edit(`You have sold x${quantity} ${itemInfo.name} for ${scriptingUtils.formatMoney(moneyEarned)}`);
        } else {
            await response.edit("Transaction cancelled");
        }

        userInfo.inventory = userInfo.inventory.sort((a, b) => parseInt(a.Id) - parseInt(b.Id));

        saveData(userInfo, interaction.user.id);
    },
};

