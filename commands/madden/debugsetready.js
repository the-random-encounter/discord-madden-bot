const { SlashCommandBuilder } = require('discord.js');
const { User } = require('../../models/models.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('debugsetready')
    .setDescription('DEBUG TOOL: Set a given member to ready for the week.')
    .addUserOption(option => 
      option.setName('target')
      .setDescription('The member to set as ready.')
      .setRequired(true)),


  async execute(interaction) {

    const user = interaction.member;
    const target = interaction.options.getUser('target');

    if (!user.roles.cache.some(r => r.name === 'Commissioner') || !user.roles.cache.some(r => r.name === 'Admin')) {
      await interaction.reply({ content: `You must be a commissioner or channel administrator to use this command.`, ephemeral: true });
      return;
    } else {

      console.log(`Target User: ${target.username.toString()}`);
      
      await User.update({ weekFinished: true }, { where: { discordName: target.username.toString() } });

      const targetUser = await User.findOne({ where: { discordName: target.username.toString() }, weekFinished: true });

      if (targetUser) {
        await interaction.reply({ content: `DEBUG: The user ${target.username.toString()} has been set as ready for the week.`, ephemeral: true });
        return;
      } else {
        await interaction.reply({ content: `DEBUG: The user ${target.username.toString()} could not be located in the database.`, ephemeral: true });
        return;
      }
    }
  }
}