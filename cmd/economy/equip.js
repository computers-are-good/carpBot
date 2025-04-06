const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));
const { equipment } = require(path.join(__dirname, "../../data/equipment"));
const { shopItems } = require(path.join(__dirname, "../../data/shopitems"));

function applyEquipmentStats(combatData, improvements) {
    for (let i in improvements) {
        combatData[i] += improvements[i];
        if (i == "maxHealth") {
            combatData.health += improvements[i];
        }
    }
}
function removeEquipmentStats(combatData, improvements) {
    for (let i in improvements) {
        combatData[i] -= improvements[i];
        if (i == "maxHealth") {
            combatData.health -= improvements[i];
        }
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('equip')
        .setDescription('Equips (or unequips) an item you have in your inventory')
        .addStringOption(option => option.setName("equipment").setDescription("The thing to equip.")),
    async execute(interaction) {
        const { userInfo, notifications } = await economyUtils.prefix(interaction);
        let chosenEquipment = interaction.options.getString("equipment");

        if (!chosenEquipment) { //if no equipment is specified, then list what the player has equipped.
            let stringToSend = "Your equipment:\n";
            for (let slot in userInfo.equipment) {
                let item;
                if (userInfo.equipment[slot] === 0) {
                    item = "(empty)";
                } else {
                    let itemId = userInfo.equipment[slot];
                    item = shopItems[itemId].name;
                }
                stringToSend += `${slot}: ${item}\n`;
            }
            interaction.reply(`${notifications}${stringToSend}`)
            return;
        }

        //First, can we find the equipment in the equipment list?
        let equipmentFound = false;
        let equipmentId;
        for (let shopItem in shopItems) {
            if (shopItems[shopItem].name.toLowerCase() == chosenEquipment.toLowerCase()) {
                if (!shopItems[shopItem].category.includes("equipment")) {
                    interaction.reply(`${notifications}That item is not a piece of equipment.`)
                    return;
                }
                equipmentFound = true;
                equipmentId = shopItem;
                break;
            }
        }
        if (!equipmentFound) {
            await interaction.reply(`${notifications}This item is not in the shop.`)
            return;
        }
        const equipmentSlot = equipment[equipmentId].slot;

        //If we have it equipped, we unequip it
        if (userInfo.equipment[equipmentSlot] == equipmentId) {
            userInfo.equipment[equipmentSlot] = 0;
            interaction.reply(`${notifications}Unequipped ${shopItems[equipmentId].name}.`);
            removeEquipmentStats(userInfo.combat, equipment[equipmentId].improvements);
            saveData(userInfo, interaction.user.id);
            return;
        }

        //Do we have it in our inventory?
        if (!(economyUtils.inventoryHasItem(userInfo.inventory, equipmentId))) {
            interaction.reply(`${notifications}You do not have a ${shopItems[equipmentId].name} in your inventory.`);
            return;
        }
        if (!userInfo.equipment[equipmentSlot] == 0) {
            removeEquipmentStats(userInfo.combat, equipment[userInfo.equipment[equipmentSlot]].improvements)            
        }
        userInfo.equipment[equipmentSlot] = equipmentId;
        interaction.reply(`${notifications}Equipped ${shopItems[equipmentId].name}.`);
        applyEquipmentStats(userInfo.combat, equipment[equipmentId].improvements);
        saveData(userInfo, interaction.user.id);
    },
};
