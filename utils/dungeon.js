const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { shopItems } = require(path.join(__dirname, "../data/shopItems"));
const { createUserData } = require(path.join(__dirname, "/createUserData"));
const scriptingUtils = require(path.join(__dirname, "/scripting"));

module.exports = {
    dungeon: async function (interaction, script, userInfo) {
        return new Promise(async (res, rej) => {
            const previous = new ButtonBuilder()
                .setCustomId('Previous')
                .setLabel('Stop')
                .setStyle(ButtonStyle.Secondary);

            const next = new ButtonBuilder()
                .setCustomId('Next')
                .setLabel('Continue')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(previous, next);

            const pageSize = 5;
            let pageOffset = 0;
            let itemIndex = 0;
            function processCurrentIndex(itemIndex) {
                let stringToReply;
                let currentStep = script[itemIndex];
                switch (currentStep.type) {
                    case "text":
                        stringToReply = script[itemIndex].content;
                        break;
                    case "prebattle":
                        stringToReply = `You are about to enter battle with a ${currentStep.content.name}`;
                        break;
                    case "battle":
                        stringToReply = `You are battling a ${currentStep.content.name}. I have not implemented combat yet :(`;
                        break;
                }
                return stringToReply;
            }
            let response = await interaction.reply({
                content: processCurrentIndex(itemIndex),
                components: [row]
            });
            const collectorFilter = i => i.user.id === interaction.user.id;
            async function updateButtons() {
                try {
                    buttons = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
                    if (buttons.customId === 'Previous') {
                        buttons.update({ content: "Dungeon stopped", components: [] });
                        res({
                            completed: false,
                            userInfo: userInfo,
                            response: response
                        });
                        return
                    } else if (buttons.customId === 'Next') {
                        itemIndex++
                        if (itemIndex == script.length) {
                            buttons.update({ content: "You are finished", components: [] });
                            res({
                                completed: true,
                                userInfo: userInfo,
                                response: response
                            });
                            return
                        } else {
                            let stringToReply = processCurrentIndex(itemIndex);
                            buttons.update({ content: stringToReply, components: [row] });
                        }
                        updateButtons();
                    }
                } catch (e) {
                    await response.edit({ content: "Timed out. Please start again", components: [] });
                    rej({
                        completed: false,
                        userInfo: userInfo,
                        response: response
                    });
                }
            }
            updateButtons();
        },
        );
}
}