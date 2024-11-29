const { SlashCommandBuilder } = require('discord.js');
const { fetchSeasonDataObject } = require('../../utils/functions.js');
const { commissionerId, adminId } = require('../../config.json')
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('startnewseason')
      .setDescription('Register the beginning of a new season in the League.')
      .addStringOption(option => 
          option.setName('year')
              .setDescription('The year of the season.')
              .setRequired(true))
      .addUserOption(option =>
          option.setName('commissioner')
              .setDescription('The Discord user who is the commisioner of the League.')
              .setRequired(true))
      .addBooleanOption(option =>
          option.setName('carryovermembers')
              .setDescription('Carry over all members from previous season?')
              .setRequired(true)),
      

  async execute(interaction) {

    console.log(`Beginning initialization of new season...\n`);
    const carryOverFlag = await interaction.getBooleanOption('carryovermembers');

    if (!member.roles.cache.has(commissionerId) || !member.roles.cache.has(adminId)) {
      console.log(`Initialization of new season failed due to insufficient role credentials.\nUser: ${member.displayName}\n`);
      await interaction.reply({
        content: `You must be a commissioner or channel administrator to start a new season.`,
        ephemeral: true });
      return;
    } else {

      const existingSeasonData = fetchSeasonDataObject();

      if (carryOverFlag) {
        const participants = existingSeasonData.participants;

        if (!participants) {
          console.log(`Previous season has no members but carryover flag was set true. New season failed to initialize.\n`);
          await interaction.reply({ content: `Previous season has no members! New season failed to initialize.`, ephemeral: true });
          return;
        } 
        else {
          console.log(`Carryover Flag set, last season's participants are being copied over...\n`);
          let participantString = `PARTICIPANTS:\n`;
          for (let i = 0; i > participants.length; i++) {
            participantString += `#${i}: ${participants[i]}\n`;
          }
          console.log(`${participantString}\n`);
        }
      }
      const newSeason = {
        id: existingSeasonData.id + 1,
        year: interaction.options.getString('year'),
        commissioner: interaction.options.getUser('commissioner'),
        weekNumber: 1,
        players: participants,
        superBowlChampion: null,
        afcChampion: null,
        nfcChampion: null,
        playoffParticipants: [],
        seasonProgress: "preseason"
      }

      const previousSeasonData = await JSON.parse(fs.readFileSync(path.join(__dirname, '../data/previousSeasons.json')));

      try {
        console.log(`Writing existing season data to previous season archive...\n`);
        fs.writeFileSync(path.join(__dirname, '../data/previousSeasons.json'), JSON.stringify(previousSeasonData.push(existingSeasonData)));
      } catch (err) {
        console.error(`Error writing existing season data to previous season archive: ${err.message}`);
      } finally {
        console.log(`Success!\n`);
        try {
          console.log(`Writing new season data to seasonData.json...\n`);
          fs.writeFileSync(path.join(__dirname, '../data/seasonData.json'), JSON.stringify(newSeason));
        } catch (err) {
          console.error(`Error writing new season data to seasonData.json: ${err.message}`);
        } finally {
          console.log(`Success!\n`);
          console.log(`New season successfully initialized for ${interaction.options.getString('year')}by user '${member.displayName}!\n`);
          await interaction.reply({ content: `New season successfully initialized for ${interaction.options.getString('year')}!`, ephemeral: true });
          return;
        }
      }
    }
  }
}