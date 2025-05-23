const fs = require("fs");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { shopItems } = require(path.join(__dirname, "../data/shopItems"));
const { createUserData } = require(path.join(__dirname, "/createUserData"));
const scriptingUtils = require(path.join(__dirname, "/scripting"));
const { dataIsLocked } = require(path.join(__dirname, "/userdata"));
const { dungeonList } = require(path.join(__dirname, "../data/dungeonlist"));
const { defaultUserData } = require(path.join(__dirname, "../data/defaultuserdata"));
const { profanities } = require(path.join(__dirname, "../data/profanities"));

module.exports = {
    prefix: function (interaction) {
        return new Promise((acc, rej) => {
            const dataPath = path.join(__dirname, `../userdata/economy/${interaction.user.id}`);

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
                let usernames = JSON.parse(fs.readFileSync(path.join(__dirname, `../userdata/usernames.json`)).toString("UTF-8"));
                usernames[interaction.user.id] = interaction.user.username;
                fs.writeFileSync(path.join(__dirname, `../userdata/usernames.json`), JSON.stringify(usernames));
            }
            if (dataIsLocked(interaction.user.id)) {
                rej(0);
                return;
            }

            let infoModified = false;
            for (let key in defaultUserData) {
                if (!(key in userInfo)) {
                    userInfo[key] = defaultUserData[key];
                    infoModified = true;
                }
            }

            const now = new Date().getTime();
            //players passively heal
            const healingInterval = userInfo.healingInterval;
            if (userInfo.lastHealthRestoration == 0) {
                userInfo.lastHealthRestoration = new Date().getTime();
                infoModified = true;
            }
            const timeDiff = now - userInfo.lastHealthRestoration;
            if (timeDiff > healingInterval) {
                if (userInfo.combat.health == userInfo.combat.maxHealth) {
                    userInfo.lastHealthRestoration = now;
                } else {
                    let healthToRestore = Math.floor(timeDiff / healingInterval);
                    userInfo.combat.health += healthToRestore;
                    userInfo.lastHealthRestoration += healthToRestore * healingInterval;
                    if (userInfo.combat.health >= userInfo.combat.maxHealth) {
                        userInfo.combat.health = userInfo.combat.maxHealth;
                        userInfo.lastHealthRestoration = now;
                    }
                }
                infoModified = true;
            }

            //notifications
            let notifs = "";
            if (userInfo.notifications.length > 0) {
                userInfo.notifications.filter(e => {
                    if (e.hideable) {
                        if (new Date().getTime() - e.timeMachineReadable < 60000) {
                            return false;
                        }
                    }
                    return true;
                })
                notifs += "Kia ora. You have notifications:\n";
                if (userInfo.notifications.length > 5) {
                    for (let i = 0; i < 5; i++) {
                        const notification = userInfo.notifications[i];
                        notifs += `[${notification.timeDisplay}]: ${notification.msg}\n`;
                    }
                    notifs += `(and ${userInfo.notifications.length - 5} more)`
                    userInfo.notifications.splice(0, 5);
                } else {
                    for (let i = 0; i < userInfo.notifications.length; i++) {
                        const notification = userInfo.notifications[i];
                        notifs += `[${notification.timeDisplay}]: ${notification.msg}\n`;
                    }
                    userInfo.notifications = [];
                }
                notifs += "\n"
                infoModified = true;
            }
            if (infoModified) fs.writeFileSync(dataPath, JSON.stringify(userInfo));

            acc({
                userInfo: userInfo,
                notifications: notifs
            });
        });
    },
    saveData: function (userId, userInfo) {
        fs.writeFileSync(path.join(__dirname, `../userdata/economy/${userId}`), JSON.stringify(userInfo));
    },
    displayList: async function (interaction, items, itemsPerPage) {
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
        const pageSize = itemsPerPage ?? 5;
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
            let stringToReply;
            try {
                buttons = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
                if (buttons.customId === 'Previous') {
                    pageOffset = Math.max(0, pageOffset - pageSize);
                    stringToReply = outputString(pageSize, pageOffset);
                    buttons.update({ content: stringToReply, components: [row] });
                    updateButtons();
                } else if (buttons.customId === 'Next') {
                    pageOffset = Math.min(pageOffset + pageSize, items.length - items.length % pageSize);
                    if (pageOffset < pageSize - 1) pageOffset = 0;
                    if (pageOffset == items.length) pageOffset -= pageSize;
                    stringToReply = outputString(pageSize, pageOffset);
                    buttons.update({ content: stringToReply, components: [row] });
                    updateButtons();
                }
            } catch (e) {
                try {
                    await response.edit({ content: stringToReply, components: [] });
                } catch (e) {
                    console.log("Could not edit a message after the response timed out! Has that message been deleted by an admin?");
                }
            }
        }
        updateButtons();
    },
    confirmation: async function (interaction, msg, confirmmsg, cancelmsg) {
        return new Promise(async (res, rej) => {
            const confirm = new ButtonBuilder()
                .setCustomId('Confirm')
                .setLabel(confirmmsg ?? 'Confirm')
                .setStyle(ButtonStyle.Primary);

            const cancel = new ButtonBuilder()
                .setCustomId('Cancel')
                .setLabel(cancelmsg ?? 'Cancel')
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
                    await response.edit({ content: msg, components: [] });
                    res({
                        confirmed: true,
                        response: response
                    });
                } else if (buttons.customId === 'Cancel') {
                    await response.edit({ content: msg, components: [] });
                    res({
                        confirmed: false,
                        response: response
                    });
                }
            } catch (e) {
                await response.edit({ content: "Timed out.", components: [] });
                res({ confirmed: false, response: response });
            }
        });
    },
    addToInventory: function (userInfo, itemId, quantity, metadataParameters) {
        const itemData = shopItems[itemId];
        async function addItem(Id, quantity, metadata) {
            if (itemData.addToInventory) {
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
        }
        if (shopItems[itemId].scripts) {
            let metaDataNeedsToBeGenerated = (shopItems[itemId].scripts.generateMetadata != undefined);
            if (metaDataNeedsToBeGenerated) {
                for (let i = 0; i < quantity; i++) { //each item may need to have metadata generated separately
                    let itemMetadata = shopItems[itemId].scripts.generateMetadata(metadataParameters);
                    addItem(itemId, 1, itemMetadata);
                }
            } else {
                addItem(itemId, quantity);
            }

            if (itemData.scripts.onBuy)
                for (let i = 0; i < quantity; i++)
                    itemData.scripts.onBuy(userInfo);
        } else {
            addItem(itemId, quantity);
        }
        return userInfo;
    },
    removeFromInventory: function(userInfo, itemId, quantity = 1) {
        let itemInInventory;
        let index;
        for (let item in userInfo.inventory) {
            if (userInfo.inventory[item].Id == itemId) {
                itemInInventory = userInfo.inventory[item];
                index = item;
                break;
            }
        }
        if (itemInInventory) {
            itemInInventory.quantity -= quantity;
            if (itemInInventory.quantity <= 0) {
                userInfo.inventory.splice(index, 1)
            }
        }
    },
    listAvailableDungeons: function (userInfo) {
        let availableDungeons = [];
        for (let i in dungeonList) {
            let meetCriteria = true;
            //Have we completed the previous dungeon in the series?
            if (dungeonList[i].seriesNumber > 1) {
                meetCriteria = false;
                for (let j in userInfo.dungeonsCompleted) {
                    const dungeon = userInfo.dungeonsCompleted[j];
                    if (dungeon.seriesName == dungeonList[i].seriesName) {
                        meetCriteria = true;
                        break;
                    }
                }
            }
            if ("requirements" in dungeonList[i]) {
                if (dungeonList[i].requirements.level && userInfo.level < dungeonList[i].requirements.level) {
                    meetCriteria = false;
                }
            }
            if (meetCriteria) {
                availableDungeons.push(i);
            }
        }
        return availableDungeons;
    },
    dungeonCompleted: function (userInfo, dungeonInfo) { //dungeonInfo is object from dungeonlist.js
        for (let i in userInfo.dungeonsCompleted) {
            if (userInfo.dungeonsCompleted[i].seriesName == dungeonInfo.seriesName && userInfo.dungeonsCompleted[i].seriesNumber == dungeonInfo.seriesNumber) return true;
        }
        return false;
    },
    determinePrice: function (userInfo, shopItem) {
        let priceMultiplier = 1;
        for (let pet of userInfo.pets) {
            if (pet.id == 104) { //rabbits reduce the price of items
                priceMultiplier -= 0.0025 * pet.bondLevel;
            }
        }
        if (priceMultiplier <= 0.42) priceMultiplier = 0.42;
        if (userInfo.learned.includes("Haggling")) priceMultiplier -= 0.05;
        return Math.floor(shopItem.cost * priceMultiplier);
    },
    profanityCheck: function(phrase) { //returning false means you have failed the profanity check (i.e. the phrase contains bad words)
        phrase = phrase.toLowerCase();
        for (let profanity in profanities) {
            if (phrase.includes(profanities[profanity].toLowerCase())) return false;
        }
        return true;
    },
    regexCheck: function(phrase) {
        const regex = /^[^#@]{0,30}$/;
        return regex.test(phrase);
    },
    mentionCheck: function(phrase) { //returns false if the user has mentioned another user in their string
        const regex = /<@[0-9]+>/;
        return !regex.test(phrase);
    },
    inventoryHasItem: function (inventory, itemId, metadata) {
        for (let item in inventory) {
            if (inventory[item].Id == itemId) {
                if (metadata) {
                    if (scriptingUtils.deepEqual(metadata, userInfo.inventory[item].metadata)) {
                        return true;
                    }
                    return false;
                } else {
                    return true;
                }
            }
        }
        return false;
    },
    canGriefPlayer: async function (targetPlayerId, userInfo, interaction, notifications) {
        let canGrief = true;
        if (!fs.existsSync(path.join(__dirname, `../userdata/economy/${targetPlayerId}`))) {
            await interaction.reply(`${notifications}This user has not used CrapBot.`);
            return {
                canGrief: false,
                targetUserData: {}
            }
        }

        if (userInfo.passiveMode) {
            await interaction.reply(`${notifications}You are in passive mode.`);
            canGrief = false;
        }
        let targetPlayerData = JSON.parse(fs.readFileSync(path.join(__dirname, `../userdata/economy/${targetPlayerId}`)).toString("UTF-8"));

        if (targetPlayerData.passiveMode) {
            await interaction.reply(`${notifications}That user is in passive mode. Please leave them alone.`);
            canGrief = false;
        }
        if (targetPlayerId == interaction.user.id) {
            await interaction.reply(`${notifications}You can't grief yourself!`);
            canGrief = false;
        }
        return {
            canGrief: canGrief,
            targetUserData: targetPlayerData
        }
    },
    notifyPlayer(userInfo, msg, hideable = false) { //hideable messages won't be displayed if the player logs on within a minute of the message being generated.
        if (userInfo.notifications === '') userInfo.notifications = [];
        userInfo.notifications.push({
            msg: msg,
            timeDisplay: scriptingUtils.getTimestamp(),
            timeMachineReadable: new Date().getTime(),
            hideable: hideable
        });
    }
}