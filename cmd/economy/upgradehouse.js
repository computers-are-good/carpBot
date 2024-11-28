const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../../utils/economy"));
function moneyRequiredLevelUp(currentLevel) {
	return 50 * Math.pow(currentLevel + 4, 2) + 25000
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

		if (house == "list") {
			let listToDisplay = [];
			houses.forEach(e => {
				listToDisplay.push(`${e.metadata.Address}: level ${e.metadata.level}`);
			});
			economyUtils.displayList(interaction, listToDisplay);
			return;
		}
		for (let houseToSearch of houses) {
			if (houseToSearch.metadata.Address.toLowerCase() == house.toLowerCase()) {
				economyUtils.confirmation(interaction, "Upgrade this house?").then(async val => {
					let {confirmation, response} = val;
					await response.edit("House would have been upgraded successfully")
	
					return;
				},
				
				val => {

				});

				return;
			}
		}
		await interaction.reply("House not found!");
	},
};
