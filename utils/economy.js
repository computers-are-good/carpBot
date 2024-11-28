const fs = require("fs");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { shopItems } = require(path.join(__dirname, "../data/shopItems"));
const { createUserData } = require(path.join(__dirname, "/createUserData"));
const scriptingUtils = require(path.join(__dirname, "/scripting"))


module.exports = {
    formatMoney: function (val) {
        if (val == 0) return `$0.00`;
        if (val <= 9) return `$0.0${val}`;
        if (val <= 99) return `$0.${val}`;
        let arr = val.toString().split('');
        arr.splice(arr.length - 2, 0, ".");
        return `$${arr.join("")}`;
    },
    prefix: function (interaction) {
        return new Promise((acc, rej) => {
            const dataPath = path.join(__dirname, `../userdata/${interaction.user.id}`);

            if (!fs.existsSync(dataPath)) {
                createUserData(interaction.user.id, interaction.user.username);
            }
            let userInfo
            try {
                userInfo = JSON.parse(fs.readFileSync(dataPath));
            } catch {
                rej("Looks like your data is corrupted. Oops.");
            }
            if (userInfo.username != interaction.user.username) {
                userInfo.username = interaction.user.username;
                let usernames = JSON.parse(fs.readFileSync(path.join(__dirname, `../userdata/${usernames}`)).toString("UTF-8"));
                usernames[userId] = interaction.user.username;
                fs.writeFileSync(path.join(__dirname, `../userdata/${usernames}`), JSON.stringify(usernames));
            }
            acc(userInfo);
        });
    },

    hasEffect: function (userInfo, effects) {
        //delete expired effects
        let toReturn = {
            userInfo: userInfo,
            effects: {},
            effectDurations: {}
        }
        let now = new Date().getTime();
        userInfo.effects = userInfo.effects.filter(a => a.validUntil > now);
        for (let effect of effects) {
            let effectFound = false;
            for (let userEffect in userInfo.effects) {
                if (userInfo.effects[userEffect].name == effect) {
                    effectFound = true;
                    toReturn.effects[effect] = true;
                    toReturn.effectDurations[effect] = Math.floor((userInfo.effects[userEffect].validUntil - now) / 1000);
                    break;
                } 
            }
            if (!effectFound) {
                toReturn.effects[effect] = false;
                toReturn.effectDurations[effect] = 0
            }
        }
        return toReturn;
    },
    saveData: function (userId, userInfo) {
        fs.writeFileSync(path.join(__dirname, `../userdata/${userId}`), JSON.stringify(userInfo));

    },
    displayList: async function (interaction, items) {
        const previous = new ButtonBuilder()
            .setCustomId('Previous')
            .setLabel('Previous Page')
            .setStyle(ButtonStyle.Secondary);

        const next = new ButtonBuilder()
            .setCustomId('Next')
            .setLabel('Next Page')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(previous, next);

        if (items.length == 0) {
            await interaction.reply("This list is empty");
            return;
        }
        const pageSize = 5;
        let pageOffset = 0;
        function outputString(numItems, offset) {
            let string = ""
            for (let i = offset; i < offset + numItems; i++) {
                if (i > items.length - 1) {
                    return string;
                }
                string += `${items[i]}\n`;
            }
            return string;
        }
        let response = await interaction.reply({
            content: outputString(pageSize, 0),
            components: [row]
        });
        const collectorFilter = i => i.user.id === interaction.user.id;
        async function updateButtons() {
            try {
                buttons = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
                if (buttons.customId === 'Previous') {
                    pageOffset = Math.max(0, pageOffset - pageSize);
                    stringToReply = outputString(5, pageOffset);
                    buttons.update({ content: stringToReply, components: [row] });
                    updateButtons();
                } else if (buttons.customId === 'Next') {
                    pageOffset = Math.min(pageOffset + 5, items.length - items.length % 5);
                    if (pageOffset < 4) pageOffset = 0;
                    if (pageOffset == items.length) pageOffset -= 5;
                    stringToReply = outputString(5, pageOffset);
                    buttons.update({ content: stringToReply, components: [row] });
                    updateButtons();
                }
            } catch (e) {
                await response.edit({ content: "Finished displaying list.", components: [] })
            }
        }
        updateButtons();
    },
    confirmation: async function (interaction, msg) {
        return new Promise(async (res, rej) => {
            const confirm = new ButtonBuilder()
                .setCustomId('Confirm')
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Primary);

            const cancel = new ButtonBuilder()
                .setCustomId('Cancel')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder().addComponents(cancel, confirm);
            let response = await interaction.reply({
                content: msg,
                components: [row]
            });

            const collectorFilter = i => i.user.id === interaction.user.id;
            try {
                buttons = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
                if (buttons.customId === 'Confirm') {
                    await response.edit({ content: "Action confirmed.", components: [] });
                    res({
                        confirmed: true,
                        response: response
                    });
                } else if (buttons.customId === 'Cancel') {
                    await response.edit({ content: "Action cancelled.", components: [] });
                    res({
                        confirmed: false,
                        response: response
                    });
                }
            } catch (e) {
                await response.edit({ content: "Timed out.", components: [] });
                rej({ confirmed: false, response: response });
            }
        });

    },
    addToInventory: function (userInfo, itemId, quantity, metadataParameters) {
        const itemData = shopItems[itemId];
        async function addItem(Id, quantity, metadata) {
            let metaDataNeedsToBeGenerated = false;
            if (metadata) metaDataNeedsToBeGenerated = true;
            let addedToInventory = false;

            for (let item in userInfo.inventory) {
                if (userInfo.inventory[item].Id == Id) {
                    if (!metaDataNeedsToBeGenerated) {
                        userInfo.inventory[item].quantity += quantity;
                        addedToInventory = true;
                    } else if (scriptingUtils.deepEqual(userInfo.inventory[item].metadata, metadata)) {
                        userInfo.inventory[item].quantity += quantity;
                        addedToInventory = true;
                    }
                }
            }

            if (!addedToInventory) {
                let objToPush = {
                    Id: itemId,
                    quantity: quantity
                }
                if (metaDataNeedsToBeGenerated) {
                    objToPush.metadata = metadata;
                }
                userInfo.inventory.push(objToPush);
            }
        }
        if (itemData.addToInventory) {
            let metaDataNeedsToBeGenerated = (shopItems[itemId].scripts.generateMetadata != undefined);
            if (metaDataNeedsToBeGenerated) {
                for (let i = 0; i < quantity; i++) { //each item may need to have metadata generated separately
                    let itemMetadata = shopItems[itemId].scripts.generateMetadata(metadataParameters);
                    addItem(itemId, 1, itemMetadata);
                }
            } else {
                addItem(itemId, quantity);
            }
        }
        if (itemData.scripts.onBuy)
            for (let i = 0; i < quantity; i++)
                itemData.scripts.onBuy(userInfo);
        return userInfo;
    }
}