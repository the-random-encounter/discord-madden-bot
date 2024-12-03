const { SlashCommandBuilder } = require('discord.js');
const { memberId } = require('../../config.json');
const { User, Season } = require('../../models/models.js');
const { weekNumberFancy } = require('../../utils/functions.js');
const Op = require('sequelize').Op;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ready')
    .setDescription('Indicate that you have finished your weekly league requirements.'),
  async execute(interaction) {

    const member = interaction.member;

    if (!member.roles.cache.has(memberId))
      await interaction.reply({ content: `${interaction.user},\nyou must be a member of the League to signify week advancement readiness.`, ephemeral: true}); 
    else {

      const userToUpdate = await User.findOne({ where: { discordName: member.displayName }});

      await userToUpdate.update( { weekFinished: true } );

      const unfinishedUser = await User.findOne( { where: { weekFinished: false }} );

      const test = await User.findOne( { where: { weekFinished: true }} );

      console.log(test);

      if (unfinishedUser === null ) {

        const weekFancy = await weekNumberFancy();
        await interaction.reply({ content: `${interaction.member},\nYou have successfully flagged that you are finished for ${weekFancy}. All teams are now ready to advance.`, ephemeral: true });

        const announcementChannel = await interaction.guild.channels.cache.get('1307729794221342783');

        announcementChannel.send(`<@&1307730299840499732>, all teams have now finished their weekly requirements. The League will now soon advance.`);
        announcementChannel.send({ content: `<@&1307730011880685668>, please advance the week and notify me when it is complete.`, ephemeral: true });

      } else {

        const weekFancy = await weekNumberFancy();

        await interaction.reply({ content: `${interaction.member},\nsuccessfully flagged that you are finished for ${weekFancy}. Other teams are still pending.`, ephemeral: true});
      }
    }
  }
}