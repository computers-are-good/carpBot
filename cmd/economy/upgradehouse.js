const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
const scriptingUtils = require(path.join(__dirname, "../../utils/scripting"));

function moneyRequiredLevelUp(currentLevel) {
	return (40 * Math.pow((currentLevel + 4), 3) + 25000) * 100
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('upgradehouse')
		.setDescription('Upgrade your houses to earn more money!')
		.addStringOption(option => option.setName("house").setDescription("Name of house to upgrade (or list)")),
	async execute(interaction) {
        userInfo = await economyUtils.prefix(interaction);
		const house = interaction.options.getString("house");
		let houses = userInfo.inventory.filter(e => e.Id == 1008);

		if (house == "list" || !house) {
			let listToDisplay = [];
			houses.forEach(e => {
				listToDisplay.push(`${scriptingUtils.choice(["🏡","🏠","🏘️","🏚️"])} ${e.metadata.Address}: level ${e.metadata.level}`);
			});
			await economyUtils.displayList(interaction, listToDisplay);
			return;
		}
		let houseFound = false;
		for (let houseToSearch of houses) {
			if (houseToSearch.metadata.Address.toLowerCase() == house.toLowerCase()) {
				houseFound = true;
				const upgradeCost = moneyRequiredLevelUp(houseToSearch.metadata.level)
				economyUtils.confirmation(interaction, `Upgrade this house? This costs ${economyUtils.formatMoney(upgradeCost)}`).then(async val => {
					let {confirmed, response} = val;
					if  (confirmed) {
						//enough money?
						if (userInfo.moneyOnHand > upgradeCost) {
							userInfo.moneyOnHand -= upgradeCost;
							houseToSearch.metadata.level++;
							economyUtils.saveData(interaction.user.id, userInfo);
							await response.edit(`House upgraded successfully (${houseToSearch.metadata.level - 1} -> ${houseToSearch.metadata.level}).`);
						} else {
							await response.edit(`Not enough money`);
						}
					} else {
						await response.edit(`The house was not upgraded because you have cancelled.`)
					}
				},
				
				val => {
					let {confirmed, response} = val;
					response.edit(`House not upgraded because you have timed out.`)
				});
			}
		}
		if (!houseFound) await interaction.reply("House not found!");
	},
};
