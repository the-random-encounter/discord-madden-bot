const { SlashCommandBuilder } = require('discord.js');
const { User } = require('../../models/models.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getmembers')
    .setDescription('Get list of current season members.'),

  async execute(interaction) {

    const members = await User.findAll();

    let outputString = `MEMBERS LIST:`;
    for (let i = 0; i < members.length; i++) {

    outputString += `\nMember #${i+1}: ${members[i].discordName}, EA Username: ${members[i].eaName}, Team: ${members[i].team}`;
    if (members[i].role === 'commissioner')
      outputString += `, COMMISSIONER`;
    else if (members[i].role === 'admin')
      outputString += `, ADMIN`;
    }

    await interaction.reply(outputString);
  }
}


