const fs = require("fs");
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const {grantEffect, hasEffect} = require(path.join(__dirname, "../../utils/effects"));
const {masterQuestionsList} = require(path.join(__dirname, "../../data/bankrobquestions"));
const { saveData, lockData, unlockData } = require(path.join(__dirname, "../../utils/userdata"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bankrob')
        .setDescription('Rob a bank by answering a series of true or false questions!'),
    async execute(interaction) {
        const {userInfo, notifications} = await economyUtils.prefix(interaction);
        const collectorFilter = i => i.user.id === interaction.user.id;

        //can't rob banks while you are criminal
        let effectResults = hasEffect(userInfo, ["criminal"]);
        if (effectResults.criminal > 0) {
            await interaction.reply(`${notifications}You're already a criminal! Don't want to turn yourself into the one place police love to guard. (Remaining: ${effectResults.criminal}s)`);
            return;
        }

        const trueResponse = new ButtonBuilder()
            .setCustomId('true')
            .setLabel('True')
            .setStyle(ButtonStyle.Primary);

        const falseResponse = new ButtonBuilder()
            .setCustomId('false')
            .setLabel('False')
            .setStyle(ButtonStyle.Secondary);

        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Primary);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const initialRow = new ActionRowBuilder().addComponents(cancel, confirm);
        const row = new ActionRowBuilder().addComponents(falseResponse, trueResponse);

        let moneyToBeEarned = Math.floor((500 + userInfo.level * userInfo.level * 2) * 100);

        function robberySuccessful() {
            userInfo.moneyOnHand += moneyToBeEarned;
            unlockData(interaction.user.id);
            saveData(userInfo, interaction.user.id);
        }
        function robberyFailed() {
            let criminalDuration = 14400;
            //Birds reduce duration of "criminal"
            for (let pet of userInfo.pets) {
                if (pet.id == 103) {
                    criminalDuration -= Math.floor(criminalDuration * 0.02 * pet.bondLevel);
                }
                if (criminalDuration <= 10) criminalDuration = 10; 
            }
            grantEffect(userInfo, "criminal",  criminalDuration);
            unlockData(interaction.user.id);
            saveData(userInfo, interaction.user.id);
        }

        let response = await interaction.reply({
            content: `${notifications}You are about to rob a bank for ${scriptingUtils.formatMoney(moneyToBeEarned)}. You will need to answer five true or false questions correctly. Press confirm to start`,
            components: [initialRow]
        });
        let buttons = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
        if (buttons.customId === 'confirm') {
            lockData(interaction.user.id);
            let questionAsked = 0;
            let questions = [];
            for (let i = 0; i < 5; i++) {
                questions.push(scriptingUtils.choice(masterQuestionsList));
            }

            async function updateButtons() {
                try {
                    let stringToReply = questions[questionAsked].question;
                    buttons.update({ content: stringToReply, components: [row] });
                    buttons = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
                    let userResponse = buttons.customId === "true";
                    if (userResponse == questions[questionAsked].correct) {
                        questionAsked++
                        if (questionAsked >= 5) {
                            response.edit({content: `Congratulations! You are successful and have gained ${scriptingUtils.formatMoney(moneyToBeEarned)}`, components: []});
                            robberySuccessful();
                            
                        } else {
                            updateButtons();
                        }
                    } else {
                        buttons.update({ content: "Wrong. You were caught by the police. Better lay low for a while.", components: [] });
                        robberyFailed();
                    }

                } catch (e) {
                    console.log(e);
                    robberyFailed();
                    await response.edit({ content: "Timed out. Bank robbery unsuccessful.", components: [] });
                }
            }
            updateButtons();
        } else {
            response.edit({ content: "Cancelled bank robbery", components: [] });
        }
    },
};
