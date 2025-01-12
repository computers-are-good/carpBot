const fs = require("fs");
const path = require('node:path');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const { defaultGachaData, settings } = require(path.join(__dirname, "../data/defaultgachadata"));
const scriptingUtils = require(path.join(__dirname, "./scripting"));
const gachaData = require(path.join(__dirname, "../data/gacha"));

module.exports = {
    prefix: function (interaction) {
        let userInfo;
        const pathToUse = path.join(__dirname, `../userdata/gacha/${interaction.user.id}`);

        if (fs.existsSync(pathToUse)) {
            userInfo = JSON.parse(fs.readFileSync(pathToUse, "utf-8"));
        } else {
            userInfo = scriptingUtils.deepClone(defaultGachaData);
        }
        return userInfo;
    },
    gambleOnce(userInfo, bannerId) {
        //Do we have an 8 star?
        if (Math.random() < settings.eightStarRate || userInfo.eightStarPity >= settings.eightStarPityLimit - 1) {
            userInfo.eightStarPity = 0;
            userInfo.twoStarPity++;
            return scriptingUtils.choice(gachaData.banners[bannerId].eightStarPool);
        }
        if (Math.random() < settings.twoStarRate || userInfo.twoStarPity >= settings.twoStarPityLimit - 1) {
            userInfo.twoStarPity = 0;
            userInfo.eightStarPity++;
            return scriptingUtils.choice(gachaData.banners[bannerId].twoStarPool);
        }
        userInfo.twoStarPity++;
        userInfo.eightStarPity++;
        return scriptingUtils.choice(gachaData.banners[bannerId].oneStarPool);
    },
    async displayCharacters(listOfCharacters, response, userId) {
        const next = new ButtonBuilder()
            .setCustomId('Next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(next);

        if (listOfCharacters.length == 0) {
            await interaction.reply("This list is empty");
            return;
        }

        function outputString(offset) {
            return `(${offset + 1} / ${listOfCharacters.length})
${listOfCharacters[offset].rarity == 1 ? listOfCharacters[offset].name :
                    (listOfCharacters[offset].rarity == 2 ? `**${listOfCharacters[offset].name}**` :
                        scriptingUtils.fancyText(listOfCharacters[offset].name))
                } (${listOfCharacters[offset].rarity}⭐)
${listOfCharacters[offset].description}`
        }
        await response.edit({
            content: outputString(0),
            components: [row]
        });
        const collectorFilter = i => i.user.id === userId;
        let offset = 0;
        async function updateButtons() {
            try {
                buttons = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
                if (offset >= listOfCharacters.length - 1) {
                    let stringToReply = "";
                    for (let i in listOfCharacters) {
                        if (listOfCharacters[i].rarity == 1) {
                            stringToReply += `${listOfCharacters[i].name} (${listOfCharacters[i].rarity}⭐)\n`;
                        } else if (listOfCharacters[i].rarity == 2) {
                            stringToReply += `**${listOfCharacters[i].name}** (${listOfCharacters[i].rarity}⭐)\n`;
                        } else if (listOfCharacters[i].rarity == 8) {
                            stringToReply += `${scriptingUtils.fancyText(listOfCharacters[i].name)} (${listOfCharacters[i].rarity}⭐)\n`;
                        }
                    }
                    buttons.update({ content: stringToReply, components: [], files: [] });
                } else if (buttons.customId === 'Next') {
                    offset++
                    if (listOfCharacters[offset].img) {
                        buttons.update({ content: outputString(offset), components: [row], files: [{ attachment: path.join(__dirname, `../data/gachaimg/${listOfCharacters[offset].img}`) }] });
                    } else {
                        buttons.update({ content: outputString(offset), components: [row], files: [] });
                    }
                    updateButtons();
                }
            } catch (e) {
                await response.edit({ content: outputString(offset), components: [], files: [] });
            }
        }
        updateButtons();
    }
}