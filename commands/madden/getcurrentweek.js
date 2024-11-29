const { SlashCommandBuilder } = require('discord.js');
const { fetchSeasonDataObject } = require('../../utils/functions.js');
const { WEEKNUMBERS } = require('../../data/constants.js');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('getcurrentweek')
      .setDescription('Check what the current week is for the active season.'),
      
  async execute(interaction) {
      
      const existingSeasonData = await fetchSeasonDataObject();
      const currentWeek = existingSeasonData.weekNumber;
      const weekString = WEEKNUMBERS[currentWeek];
      
      await interaction.reply(`${interaction.user}\nThe current week is: ${weekString}`);
  }
}