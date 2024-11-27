const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const {createUserData} = require(path.join(__dirname, "../../utils/createUserData"));
const {shopItems} = require(path.join(__dirname, "../../data/shopItems"))

const economyUtils = require(path.join(__dirname, "../../utils/economy"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('use')
		.setDescription('Uses an item in your inventory!')
        .addStringOption( option => option.setName("item").setDescription("Item to use"))
        .addStringOption(option => option.setName("quantity").setDescription("How many you want to use")),
	async execute(interaction) {
        const dataPath = path.join(__dirname, `../../userdata/${interaction.user.id}`)

        if (!fs.existsSync(dataPath)) {
            createUserData(interaction.user.id);
        }
        let userInfo = JSON.parse(fs.readFileSync(dataPath));

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

        for (let item in userInfo.inventory) {
            if (userInfo.inventory[item].Id == itemId) {
                let returnObj = shopItems[itemId].scripts.onUse(userInfo, userInfo.inventory[item].metadata);
                userInfo = returnObj.userInfo;
                userInfo.inventory[item].metadata = returnObj.metadata;
                let stringToReply = `User has used item ${shopItems[itemId].name}`;
                stringToReply += `\n${returnObj.messageToUser}`;
                await interaction.reply(stringToReply);
                return;
            }
        }

        await interaction.reply("User does not have this item in their inventory.")
	},
};
