const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const {createUserData} = require(path.join(__dirname, "../../utils/createUserData"));
const {shopItems} = require(path.join(__dirname, "../../data/shopItems"))
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const {developerIds} = require(path.join(__dirname, "../../configs.json"))

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
        .addStringOption( option => option.setName("item").setDescription("Item to buy"))
        .addStringOption(option => option.setName("quantity").setDescription("How much you want to buy"))
		.setDescription('Buys something from the shop!'),
	async execute(interaction) {
        const dataPath = path.join(__dirname, `../../userdata/${interaction.user.id}`)

        if (!fs.existsSync(dataPath)) {
            createUserData(interaction.user.id);
        }
        const userInfo = JSON.parse(fs.readFileSync(dataPath));
        let itemToBuy = interaction.options.getString("item");
        let quantity =  1;
        let parsedQuantity = parseInt(interaction.options.getString("quantity"))
        if (parsedQuantity && parsedQuantity !== NaN) quantity = parsedQuantity;

        if (!itemToBuy) {
            await interaction.reply("Please specify something to buy! Use /shopitems (COMING SOON) to see what is available");
            return;
        }

        let itemId;
        for (let item in shopItems) {
            if (shopItems[item].name.toLowerCase() == itemToBuy.toLowerCase()) {
                itemId = item;
            }
        }
        if (!itemId) {
            await interaction.reply("This is not an item in the shop.");
            return;
        }

        if (shopItems[itemId].cost * quantity > userInfo.moneyOnHand) {
            await interaction.reply(`This item costs ${economyUtils.formatMoney(shopItems[itemId].cost * quantity)} but user only has ${economyUtils.formatMoney(userInfo.moneyOnHand)} on hand. Try working or withdrawing money from your bank account.`);
            return;
        }

        if (shopItems[itemId].category.includes("testing")) {
            if (!developerIds.includes(interaction.user.id)) {
                await interaction.reply("This item can only be purchased by developers.");
                return;
            }
        }

        if (shopItems[itemId].oneOff == true && quantity > 1) {
            await interaction.reply(`This item can only be brought once, but you have tried to buy ${quantity} of it.`);
            return;
        }

        //finally, we can buy the item if all criteria is met
        const itemData = shopItems[itemId]
        userInfo.moneyOnHand -= itemData.cost;
        if (itemData.addToInventory) {
            let itemMetadata
            let metaDataNeedsToBeGenerated = (shopItems[itemId].scripts.generateMetadata != undefined)
            if (metaDataNeedsToBeGenerated) {
                itemMetadata = shopItems[itemId].scripts.generateMetadata();
            }
            let addedToInventory = false;

            for (let item in userInfo.inventory) {
                if (userInfo.inventory[item].Id == itemId) {
                    if (itemData.oneOff) {
                        await interaction.reply("This item can only be brought once");
                        return;
                    }
                    if (metaDataNeedsToBeGenerated && scriptingUtils.deepEqual(userInfo.inventory[item].metadata, itemMetadata)) {
                        userInfo.inventory[item].quantity += quantity;
                        addedToInventory = true;
                    }
                }
            }
            console.log(addedToInventory)

            if (!addedToInventory) {
                let objToPush = {
                    Id: itemId,
                    quantity: quantity
                }
                if (metaDataNeedsToBeGenerated) {
                    objToPush.metadata = itemMetadata;
                }
                userInfo.inventory.push(objToPush);
            }

        }
        for (let i = 0; i < quantity; i++)
            itemData.scripts.onBuy(userInfo);

        fs.writeFileSync(dataPath, JSON.stringify(userInfo));

		await interaction.reply(`You have brought ${quantity}x ${itemData.name} (ID ${itemId})`);
	},
};
