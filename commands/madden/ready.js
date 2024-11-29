const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ready')
    .setDescription('Indicate that you have finished your weekly league requirements.'),
  async execute(interaction) {
    await interaction.reply({ content: `${interaction.user},\nyou have flagged that your team is ready to advance the week.`, ephemeral: true});
  }
}