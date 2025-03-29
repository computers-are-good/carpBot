const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const statDescriptions = {
	block: "You can block this much damage from the enemy per turn",
	attack: "Your attack is first blocked, before dealing damage to the enemy",
	speed: "The party with the highest speed attacks first. **You and your enemy's first attack is done twice**, so speed is a crucial stat."
}
const { changeEquipmentStats } = require(path.join(__dirname, "../../utils/dungeon"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Views your combat stats!'),
	async execute(interaction) {
		const { userInfo, notifications } = await economyUtils.prefix(interaction);

		let stringToReply = notifications;
		stringToReply += `${interaction.user.username} (LV ${userInfo.level})\n`;

		changeEquipmentStats(userInfo.combat, userInfo.equipment);

		//health
		const healthPercent = Math.round((userInfo.combat.health / userInfo.combat.maxHealth) * 1000) / 10
		stringToReply += `Health: ${userInfo.combat.health} / ${userInfo.combat.maxHealth} (${healthPercent}%) `;
		const healthbarSegments = 20;
		let healthbar = "";
		for (let i = 0; i < healthbarSegments; i++) {
			if (healthPercent > (100 / healthbarSegments) * i) {
				healthbar += "█";
			} else {
				healthbar += "░"
			}
		}
		stringToReply += healthbar + "\n\n";

		//stats
		for (let stat of ["block", "attack", "speed"]) {
			stringToReply += `\`${stat}: ${userInfo.combat[stat]}\` (${statDescriptions[stat]})\n`;
		}

		stringToReply += "\nProbabilities:\n";

		//probabilities
		for (let probability in userInfo.combat.probabilities) {
			stringToReply += `${probability}: ${userInfo.combat.probabilities[probability] * 100}%`;
		}

		await interaction.reply(stringToReply);
	},
};
