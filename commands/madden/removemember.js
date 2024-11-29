const { SlashCommandBuilder } = require('discord.js');
const { fetchMembers } = require('../../utils/functions.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removemember')
    .setDescription('Remove a member from the league.')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('The member to remove.')
        .setRequired(true)),
  async execute(interaction) {
    const member = interaction.options.getUser('member', true);

    const membersList = await fetchMembers(true);

    if (!member.roles.cache.has(memberId)) {
      await interaction.reply({ content: `${interaction.user},\n${member} is not a member of the League.`, ephemeral: true}); 
    } else {
      await interaction.reply({ content: `${interaction.user},\n${member} has been removed from the League.`, ephemeral: true});
    }
  }
}