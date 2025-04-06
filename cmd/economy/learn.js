const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));
const { gainExp } = require(path.join(__dirname, "../../utils/levelup"));
const { learnList } = require(path.join(__dirname, "../../data/learnlist"));
const { saveData } = require(path.join(__dirname, "../../utils/userdata"));

function skillLearnt(userInfo, skillName) {
	for (let i in userInfo.learned) {
		if (userInfo.learned[i] == skillName) return true;
	}
	return false;
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('learn')
		.setDescription('Spends money to learn a skill to gain experience!')
		.addStringOption(option => option.setName("skill").setDescription("What you want to learn")),
	async execute(interaction) {
		const { userInfo, notifications } = await economyUtils.prefix(interaction);
		//if nothing specified for "skill", then display everything that can be learnt
		let availableSkills = [];
		for (let i in learnList) {
			const skill = learnList[i];
			if (skillLearnt(userInfo, skill.name)) continue;
			if (skill.cost > userInfo.moneyOnHand + userInfo.moneyBankAccount) {
				skill.description += " (too expensive)"
				availableSkills.push(skill);
			} else {
				availableSkills.push(skill);
			}
		}
		const selectedSkill = interaction.options.getString("skill");
		if (!selectedSkill) {
			//display all of the skills
			availableSkills = availableSkills.sort((a, b) => a.cost - b.cost);

			let listToDisplay = [];
			if (notifications) listToDisplay.push(notifications);
			for (let i in availableSkills) {
				const skill = availableSkills[i];
				let string = "";
				string +=
					`**${skill.name}** (gain **${skill.exp}** exp): ${skill.description ? `${skill.description}\n` : ""}**${scriptingUtils.formatMoney(skill.cost)}**.
`;
				listToDisplay.push(string);
			}
			economyUtils.displayList(interaction, listToDisplay);
		} else {
			let skill;
			for (let i in learnList) {
				if (learnList[i].name.toLowerCase() == selectedSkill.toLowerCase()) {
					skill = learnList[i];
				}
			}
			if (!skill) {
				await interaction.reply(`${notifications}This skill does not exist.`);
				return;
			}
			//Do we have the money on hand?
			if (userInfo.moneyOnHand < skill.cost) {
				await interaction.reply(`${notifications}You do not have enough money in your wallet. Try withdrawing some from your bank account.`);
				return;
			}
			//Have we learnt the skill before?
			for (let i in userInfo.learned) {
				if (userInfo.learned[i].toLowerCase() == skill.name.toLowerCase()) {
					await interaction.reply(`${notifications}You have learnt this skill before.`);
					return;
				}
			}
			let string = `${notifications}You learnt ${skill.name} for ${scriptingUtils.formatMoney(skill.cost)}. `;

			userInfo.moneyOnHand -= skill.cost;
			userInfo.learned.push(skill.name);
			if (skill.onLearn) {
				skill.onLearn(userInfo);
			}
			const levelUpResults = gainExp(userInfo, skill.exp);
			string += levelUpResults;
			await interaction.reply(string);

			saveData(userInfo, interaction.user.id);
		}
	},
};
