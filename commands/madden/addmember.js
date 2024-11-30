const { fetchMemberTeams, convertFullTeamToSimple, createNewMember } = require('../../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');
const commissionerId = require('../../config.json');
const { User } = require('../../models/models.js');

let allTeams = [
    'Chicago Bears', 'Cincinnati Bengals', 'Buffalo Bills', 'Denver Broncos', 'Cleveland Browns',
    'Tampa Bay Buccaneers', 'Arizona Cardinals', 'Los Angeles Chargers', 'Kansas City Chiefs', 'Indianapolis Colts',
    'Washington Commanders', 'Dallas Cowboys', 'Miami Dolphins', 'Philadelphia Eagles', 'Atlanta Falcons',
    'San Francisco 49ers', 'New York Giants', 'Jacksonville Jaguars', 'New York Jets', 'Detroit Lions',
    'Green Bay Packers', 'Carolina Panthers', 'New England Patriots', 'Las Vegas Raiders', 'Los Angeles Rams',
    'Baltimore Ravens', 'New Orleans Saints', 'Seattle Seahawks', 'Pittsburgh Steelers', 'Houston Texans',
    'Tennessee Titans', 'Minnesota Vikings', 'bears', 'bengals', 'bills', 'broncos', 'broncos', 'browns', 'buccaneers', 'cardinals', 'chargers', 'chiefs', 'colts', 'commanders', 'cowboys', 'dolphins', 'eagles', 'falcons', '49ers', 'giants', 'jaguars', 'jets', 'lions', 'packers', 'panthers', 'patriots', 'raiders', 'rams', 'ravens', 'saints', 'seahawks', 'steelers', 'texans', 'titans', 'vikings'
];

const chosenTeams = fetchMemberTeams(true);
const chosenTeamsFullNames = convertFullTeamToSimple(chosenTeams);
const comboTeamNames = chosenTeams.concat(chosenTeamsFullNames);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmember')
        .setDescription('Sets a member of the channel as being a League Member.')
        .addUserOption(option =>
            option.setName('newuser')
                .setDescription('The member to register as a League participant.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('eaname')
                .setDescription('The EA username of the member registering.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('team')
                .setDescription('The NFL team to register.')
                .setRequired(true)),
    async execute(interaction) {
        const newUser  = interaction.options.getUser  ('newuser');
        const eaname  = interaction.options.getString('eaname');
        const team    = interaction.options.getString('team'  );
        const member = interaction.member;

        // If the member using the command is not the commissioner, do not execute
        if (!member.roles.cache.some(r => r.name === 'Commissioner') || !member.roles.cache.some(r => r.name === 'Admin')) {
          await interaction.reply({
            content: `You must be a commissioner or server admin to add members to the League.`,
            ephemeral: true });
          return;
        } // If the user supplied is a bot, do not add
        else if (newUser.bot) {
          await interaction.reply({ 
            content: `The member ${newUser} is a bot and cannot be registered as a League participant.`, 
            ephemeral: true });
          return;
        }
        // If the team is already chosen, do not add
        else if (comboTeamNames.includes(team)) {
            await interaction.reply({ 
              content: `The team ${team} has already been chosen. Please select another team.`, 
              ephemeral: true });
            return;
        } 
        // If the team is not valid, do not add
        else if (!allTeams.includes(team)) {
          await interaction.reply({ 
            content: `The chosen team ('${team}') is not valid. Please provide a team name in either the format of the team name, or full city and team name. EXAMPLES: 'Falcons' or 'Denver Broncos'`, 
            ephemeral: true });
          return;
        } 
        // Otherwise, add the member
        else {
          if (createNewMember(newUser, eaname, team)) {
            await interaction.reply({ 
              content: `${newUser} has been registered as a League participant with the EA username ${eaname} and team ${team}.`, 
              ephemeral: true });
            return;
          } else {
            await interaction.reply({
              content: `An error occurred while attempting to register ${newUser} as a League participant. Please try again. Likely, this user already exists.`, 
              ephemeral: true
            });
            return;
          }
        }
    },
};