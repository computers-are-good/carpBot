const fs = require("fs");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { createUserData } = require(path.join(__dirname, "/createUserData"));


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
    grantEffect: function (userInfo, effect, duration) {
        for (let userEffect in userInfo.effects) {
            if (userInfo.effects[userEffect].name == effect) {
                userInfo.effects[userEffect].validUntil += duration * 1000;
                return userInfo;
            }
        }
        userInfo.effects.push({
            name: effect,
            validUntil: new Date().getTime() + duration * 1000
        });
        return userInfo;
    },
    hasEffect: function (userInfo, effect) {
        //delete expired effects
        let now = new Date().getTime();
        userInfo.effects = userInfo.effects.filter(a => a.validUntil > now);
        for (let userEffect in userInfo.effects) {
            if (userInfo.effects[userEffect].name == effect) return { userInfo: userInfo, hasEffect: true, durationRemaining: Math.floor((userInfo.effects[userEffect].validUntil - now) / 1000) };
        }
        return { userInfo: userInfo, hasEffect: false, durationRemaining: 0 };
    },
    saveData: function(userId, userInfo) {
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
                    pageOffset = Math.min(pageOffset + 5, items.length - 1);
                    if (pageOffset < 4) pageOffset = 0;
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
    confirmation: async function(interaction, msg) {
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
                    confirmed:true,
                    response: response});
			} else if (buttons.customId === 'Cancel') {
				await response.edit({ content: "Action cancelled.", components: [] });
                res({
                    confirmed:false,
                    response: response});
			}
		} catch (e) {
			await response.edit({ content: "Timed out.", components: [] });
			rej({confirmed: false, response: response});
		}
        });

    }
}