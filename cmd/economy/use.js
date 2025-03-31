const path = require('node:path');
const { shopItems } = require(path.join(__dirname, "../../data/shopItems"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('use')
        .setDescription('Uses an item in your inventory!')
        .addStringOption(option => option.setName("item").setDescription("Item to use"))
        .addStringOption(option => option.setName("quantity").setDescription("How many you want to use")),
    async execute(interaction) {
        const dataPath = path.join(__dirname, `../../userdata/economy/${interaction.user.id}`)
        const { userInfo, notifications } = await economyUtils.prefix(interaction);

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
            await interaction.reply(`${notifications}This is not an item in the shop.`);
            return;
        }
        if (quantity > 50) {
            await interaction.reply(`${notifications}Can only use maximum of 50 items at a time`);
            return;
        }

        for (let item in userInfo.inventory) {
            if (userInfo.inventory[item].Id == itemId) {
                let returnObj;
                let excessMessagesCount = 0;
                let messagesCount = 0;
                let quantityUsed = 0;
                let stringToReply = `${notifications}`;

                if (userInfo.inventory[item].quantity < quantity) {
                    await interaction.reply(`${notifications}Not enough items: you only have ${userInfo.inventory[item].quantity}`);
                    return;
                }

                function addMessageToUser(message) {
                    if (messagesCount < 10) {
                        stringToReply += message;
                        messagesCount++
                    } else {
                        excessMessagesCount++
                    }
                }
                let response = await interaction.reply("Using item...");
                for (let i = 0; i < quantity; i++) {
                    if (shopItems[itemId]?.scripts?.canUse) {
                        const results = shopItems[itemId].scripts.canUse(userInfo, userInfo.inventory[item].metadata);
                        if (!results.canUse) {
                            if (results.messageToUser) {
                                addMessageToUser(`${results.messageToUser}\n`);
                            }
                            continue;
                        }
                    }

                    let interactOptionChosen;
                    if ("getInteractionOptions" in shopItems[itemId].scripts) {
                        const interactionOptions = shopItems[itemId].scripts.getInteractionOptions(userInfo);

                        const buttons = [];
                        for (let option in interactionOptions.options) {
                            const newButton = new ButtonBuilder()
                                .setCustomId(interactionOptions.options[option])
                                .setLabel(interactionOptions.options[option])
                                .setStyle(ButtonStyle.Secondary);
                            buttons.push(newButton);
                        }

                        const row = new ActionRowBuilder().addComponents(...buttons);
                        response = await response.edit({
                            content: interactionOptions.msg,
                            components: [row]
                        });

                        try {
                            const collectorFilter = i => i.user.id === interaction.user.id;
                            const chosenButton = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
                            interactOptionChosen = chosenButton.customId;
                            await chosenButton.update({ content: `Chosen ${interactOptionChosen}`, components: [] });
                        } catch (e) {
                            await chosenButton.update({ content: "Timed out.", components: [] });
                            console.log(e)
                        }
                    }

                    if (shopItems[itemId]?.scripts?.canUse) { //maybe we can't use the item again with the new option chosen?
                        const results = shopItems[itemId].scripts.canUse(userInfo, userInfo.inventory[item].metadata, interactOptionChosen);
                        if (!results.canUse) {
                            if (results.messageToUser) {
                                addMessageToUser(`${results.messageToUser}\n`);
                            }
                            continue;
                        }
                    }

                    returnObj = shopItems[itemId].scripts.onUse(userInfo, userInfo.inventory[item].metadata, interactOptionChosen);
                    if (returnObj.messageToUser) {
                        addMessageToUser(`\n${returnObj.messageToUser}`)
                    }
                    quantityUsed++
                }
                if (excessMessagesCount > 0) stringToReply += `\n(and ${excessMessagesCount} other messages)`;
                stringToReply += `\nYou have used x${quantityUsed} ${shopItems[itemId].name}`;
                if (shopItems[itemId].category.includes("consumable")) {
                    userInfo.inventory[item].quantity -= quantity;
                    if (userInfo.inventory[item].quantity <= 0) {
                        userInfo.inventory.splice(item, 1);
                    }
                }
                saveData(userInfo, interaction.user.id);
                await response.edit(stringToReply);
                return;
            }
        }

        await interaction.reply("User does not have this item in their inventory.")
    },
};
