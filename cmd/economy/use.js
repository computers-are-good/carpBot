const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const { createUserData } = require(path.join(__dirname, "../../utils/createUserData"));
const { shopItems } = require(path.join(__dirname, "../../data/shopItems"))

const economyUtils = require(path.join(__dirname, "../../utils/economy"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('use')
        .setDescription('Uses an item in your inventory!')
        .addStringOption(option => option.setName("item").setDescription("Item to use"))
        .addStringOption(option => option.setName("quantity").setDescription("How many you want to use")),
    async execute(interaction) {
        const dataPath = path.join(__dirname, `../../userdata/${interaction.user.id}`)
        userInfo = await economyUtils.prefix(interaction);

        let itemToUse = interaction.options.getString("item");
        let quantity = 1;
        let parsedQuantity = parseInt(interaction.options.getString("quantity"))
        if (parsedQuantity && parsedQuantity !== NaN) quantity = parsedQuantity;

        //is the user using a valid item?
        let itemId;
        for (let item in shopItems) {
            if (shopItems[item].name.toLowerCase() == itemToUse.toLowerCase()) {
                itemId = item;
            }
        }
        if (!itemId) {
            await interaction.reply("This is not an item in the shop.");
            return;
        }
        if (quantity > 50) {
            await interaction.reply("Can only use maximum of 50 items at a time");
            return;
        }

        for (let item in userInfo.inventory) {
            if (userInfo.inventory[item].Id == itemId) {
                if (userInfo.inventory[item].quantity < quantity) {
                    await interaction.reply(`Not enough items: you only have ${userInfo.inventory[item].quantity}`);
                    return;
                }
                let stringToReply = `User has used x${quantity} ${shopItems[itemId].name}`;

                let returnObj
                for (let i = 0; i < quantity; i++) {
                    returnObj = shopItems[itemId].scripts.onUse(userInfo, userInfo.inventory[item].metadata);
                    userInfo = returnObj.userInfo;
                    userInfo.inventory[item].metadata = returnObj.metadata;
                    console.log(userInfo.effects)
                    if (returnObj.messageToUser) stringToReply += `\n${returnObj.messageToUser}`;
                }
                if (shopItems[itemId].category.includes("consumable")) {
                    userInfo.inventory[item].quantity -= quantity;
                    if (userInfo.inventory[item].quantity <= 0) {
                        userInfo.inventory.splice(item, 1);
                    }
                }
                fs.writeFileSync(dataPath, JSON.stringify(userInfo));
                await interaction.reply(stringToReply);
                return;
            }
        }


        await interaction.reply("User does not have this item in their inventory.")
    },
};
