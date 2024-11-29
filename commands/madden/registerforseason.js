const { SlashCommandBuilder } = require('discord.js');
const { createNewMember } = require('../../utils/functions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('registerforseason')
        .setDescription('Register yourself as a participant in this season of the League.')
        .addStringOption(option =>
          option.setName('eaname')
          .setDescription('The EA username you are registering with.'))
        .addStringOption(option =>
          option.setName('team')
          .setDescription('The NFL team you are registering as.')),

    async execute(interaction) {

      const member = interaction.user;
      const eaname = interaction.options.getString('eaname');
      const team = interaction.options.getString('team');

      let allTeams = [
        'Chicago Bears', 'Cincinnati Bengals', 'Buffalo Bills', 'Denver Broncos', 'Cleveland Browns',
        'Tampa Bay Buccaneers', 'Arizona Cardinals', 'Los Angeles Chargers', 'Kansas City Chiefs', 'Indianapolis Colts',
        'Washington Commanders', 'Dallas Cowboys', 'Miami Dolphins', 'Philadelphia Eagles', 'Atlanta Falcons',
        'San Francisco 49ers', 'New York Giants', 'Jacksonville Jaguars', 'New York Jets', 'Detroit Lions',
        'Green Bay Packers', 'Carolina Panthers', 'New England Patriots', 'Las Vegas Raiders', 'Los Angeles Rams',
        'Baltimore Ravens', 'New Orleans Saints', 'Seattle Seahawks', 'Pittsburgh Steelers', 'Houston Texans',
        'Tennessee Titans', 'Minnesota Vikings', 'bears', 'bengals', 'bills', 'broncos', 'broncos', 'browns', 'buccaneers', 'cardinals', 'chargers', 'chiefs', 'colts', 'commanders', 'cowboys', 'dolphins', 'eagles', 'falcons', '49ers', 'giants', 'jaguars', 'jets', 'lions', 'packers', 'panthers', 'patriots', 'raiders', 'rams', 'ravens', 'saints', 'seahawks', 'steelers', 'texans', 'titans', 'vikings'
      ];

      let chosenTeams = fetchMemberTeams(true);
      let chosenTeamsFullNames = convertFullTeamToSimple(chosenTeams);

      let comboTeamNames = chosenTeams.concat(chosenTeamsFullNames);

      if (comboTeamNames.includes(team)) {
        await interaction.reply({ content: `The team ${team} has already been chosen. Please select another team.`, ephemeral: true });
        return;
      } else if (!allTeams.includes(team)) {
        await interaction.reply({ content: `The chosen team ('${team}') is not valid. Please provide a team name in either the format of the team name, or full city and team name. EXAMPLES: 'Falcons' or 'Denver Broncos'`, ephemeral: true });
      } else {

        createNewMember(member, eaname, team);
        await interaction.reply({ content: `${member} has been registered as a League participant with the EA username ${eaname} and team ${team}.`, ephemeral: true });
      }
    }
  }
