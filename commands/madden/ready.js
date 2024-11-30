const { SlashCommandBuilder } = require('discord.js');
const { memberId } = require('../../config.json');
const { User, Season } = require('../../models/models.js');
const { weekNumberFancy } = require('../../utils/functions.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ready')
    .setDescription('Indicate that you have finished your weekly league requirements.'),
  async execute(interaction) {

    const member = interaction.member;


    if (!member.roles.cache.has(memberId)) {
      await interaction.reply({ content: `${interaction.user},\nyou must be a member of the League to signify week advancement readiness.`, ephemeral: true}); 
    } else {
      
      await User.update( { weekFinished: true },
        { where: { 
          discordName: member.toString(),
        },
      });

      await User.save();

      const allFinished = await User.findOne( { where: { weekFinished: false }} );

      const test = await User.findOne( { where: { weekFinished: true }} );

      console.log(test);

      if (allFinished === null ) {

        const weekFancy = await weekNumberFancy();
        await interaction.reply({ content: `@${interaction.member},\nYou have successfully flagged that you are finished for ${weekFancy}. All teams are now ready to advance.`, ephemeral: true });

        const announcementChannel = client.channels.cache.get('1307729794221342783');
        const leagueMemberRole = channel.server.roles.get;

        announcementChannel.send(`@<1307730299840499732>, all teams have now finished their weekly requirements. The League will now soon advance.`);
        announcementChannel.send({ content: `@<1307730011880685668>, please advance the week and notify me when it is complete.`, ephemeral: true });

      } else {

        const weekFancy = await weekNumberFancy();

        await interaction.reply({ content: `${interaction.member},\nsuccessfully flagged that you are finished for ${weekFancy}. Other teams are still pending.`, ephemeral: true});
      }
    }
  }
}