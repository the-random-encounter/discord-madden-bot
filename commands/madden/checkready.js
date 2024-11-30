const { SlashCommandBuilder, bold, underline } = require('discord.js');
const { User } = require('../../models/models.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkready')
    .setDescription('Check if all teams are ready to advance the week.'),
  async execute(interaction) {

    const readiedUsers  = await User.findAll({ where: { weekFinished: true  } });
    const notReadyUsers = await User.findAll({ where: { weekFinished: false } });

    let readyList = '';
    let notReadyList = '';

    if (readiedUsers.length > 0) {
      readyList = `${underline('TEAMS / USERS READY TO ADVANCE:\n')}`;

      for (let i = 0; i < readiedUsers.length; i++) 
        readyList += `${bold('USER:')} ${readiedUsers[i].eaName}\t\t|\t\t${bold('TEAM:')} ${readiedUsers[i].team}\n`;
    }

    if (notReadyUsers.length > 0) {
      notReadyList = `${underline('TEAMS / USERS NOT READY:')}\n`;

      for (let i = 0; i < notReadyUsers.length; i++)
        notReadyList += `${bold('USER:')} ${notReadyUsers[i].eaName}\t\t|\t\t${bold('TEAM:')} ${notReadyUsers[i].team}\n`;
    }
    await interaction.reply({ content: `${readyList}\n\n${notReadyList}`, ephemeral: true });
  }
}