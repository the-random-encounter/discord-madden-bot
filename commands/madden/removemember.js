const { SlashCommandBuilder } = require('discord.js');
const { fetchMembers } = require('../../utils/functions.js');
const { User } = require('../../models/models.js');
const { adminId, commissionerId } = require('../../config.json');

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

    const membersList = await fetchMembers();

    const userList = User.findAll({ where: { discordName: member.toString()}});
    console.log(userList);

    if (!member.roles.cache.has(adminId) || !membersList.roles.cache.has(commissionerId)) {
      await interaction.reply({ content: `@${interaction.user}, you must be either a server admin or the league commissioner to remove members.`, ephemeral: true}); 
    } else if (userList.length === 0) {
      await interaction.reply({ content: `@${interaction.user}, the user '${member.toString}' could not be located or is not currently a member of the League.`, ephemeral: true});
    } else {
      await interaction.reply({ content: `@${interaction.user}, the user '${member.toString}' has been successfully removed from the League.`, ephemeral: true});
    }
  }
}