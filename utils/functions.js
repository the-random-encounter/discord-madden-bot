const fs = require('fs');
const path = require('path');
const { sequelize, User, Season } = require('../models/models.js');
const Op = require('sequelize').Op;
const { WEEKNUMBERS } = require('../data/constants.js');


function convertTeamToFullName(teamNameOrArray) {
  const teamToFullNameMap = {
    'bears': 'Chicago Bears',
    'bengals': 'Cincinnati Bengals',
    'bills': 'Buffalo Bills',
    'broncos': 'Denver Broncos',
    'browns': 'Cleveland Browns',
    'buccaneers': 'Tampa Bay Buccaneers',
    'cardinals': 'Arizona Cardinals',
    'chargers': 'Los Angeles Chargers',
    'chiefs': 'Kansas City Chiefs',
    'colts': 'Indianapolis Colts',
    'cowboys': 'Dallas Cowboys',
    'dolphins': 'Miami Dolphins',
    'eagles': 'Philadelphia Eagles',
    'falcons': 'Atlanta Falcons',
    'fortyniners': 'San Francisco 49ers',
    'giants': 'New York Giants',
    'jaguars': 'Jacksonville Jaguars',
    'jets': 'New York Jets',
    'lions': 'Detroit Lions',
    'packers': 'Green Bay Packers',
    'panthers': 'Carolina Panthers',
    'patriots': 'New England Patriots',
    'raiders': 'Las Vegas Raiders',
    'rams': 'Los Angeles Rams',
    'ravens': 'Baltimore Ravens',
    'redskins': 'Washington Commanders',
    'saints': 'New Orleans Saints',
    'seahawks': 'Seattle Seahawks',
    'steelers': 'Pittsburgh Steelers',
    'texans': 'Houston Texans',
    'titans': 'Tennessee Titans',
    'vikings': 'Minnesota Vikings'
  };

  if (typeof teamNameOrArray === 'string') {
    return teamToFullNameMap[teamNameOrArray] || null;
  } else if (Array.isArray(teamNameOrArray)) {
    return teamNameOrArray.map(teamName => teamToFullNameMap[teamName] || null);
  } else {
    throw new Error('Input must be a string or an array of strings');
  }
}

function convertFullTeamToSimple(inputFullName) {
  const fullNameToTeamMap = {
    'Chicago Bears': 'bears',
    'Cincinnati Bengals': 'bengals',
    'Buffalo Bills': 'bills',
    'Denver Broncos': 'broncos',
    'Cleveland Browns': 'browns',
    'Tampa Bay Buccaneers': 'buccaneers',
    'Arizona Cardinals': 'cardinals',
    'Los Angeles Chargers': 'chargers',
    'Kansas City Chiefs': 'chiefs',
    'Indianapolis Colts': 'colts',
    'Dallas Cowboys': 'cowboys',
    'Miami Dolphins': 'dolphins',
    'Philadelphia Eagles': 'eagles',
    'Atlanta Falcons': 'falcons',
    'San Francisco 49ers': 'fortyniners',
    'New York Giants': 'giants',
    'Jacksonville Jaguars': 'jaguars',
    'New York Jets': 'jets',
    'Detroit Lions': 'lions',
    'Green Bay Packers': 'packers',
    'Carolina Panthers': 'panthers',
    'New England Patriots': 'patriots',
    'Las Vegas Raiders': 'raiders',
    'Los Angeles Rams': 'rams',
    'Baltimore Ravens': 'ravens',
    'Washington Commanders': 'redskins',
    'New Orleans Saints': 'saints',
    'Seattle Seahawks': 'seahawks',
    'Pittsburgh Steelers': 'steelers',
    'Houston Texans': 'texans',
    'Tennessee Titans': 'titans',
    'Minnesota Vikings': 'vikings'
  };

  if (typeof inputFullName === 'string') {
    return fullNameToTeamMap[inputFullName] || null;
  } else if (Array.isArray(inputFullName)) {
    return inputFullName.map(fullName => fullNameToTeamMap[fullName] || null);
  } else {
    throw new Error('Input must be a string or an array of strings');
  }
}

async function fetchMembers(seasonYear = null) {

  try {
    if (seasonYear === null) {
      const seasonDataJSON = fs.readFileSync(path.join(__dirname, '../data/seasonData.json'));
      const seasonDataObj = JSON.parse(seasonDataJSON);
      const playerInfo = seasonDataObj.players;
  
      const playerArray = playerInfo.players;
  
      if (!playerArray.length)
        return false;
      else
        return playerArray;
    } else {
      // Retrieve player list from previous season data in previousSeasons.json
    }
  } catch (err) {
    console.error(`Error fetching season data: ${err.message}`);
  }  
}

async function fetchSeasonDataObject(seasonYear = null) {
  if (seasonYear === null) {
    
    try {
      console.log(`Retrieving current season data...`);
      const seasonDataJSON = await fs.readFileSync(path.join(__dirname, '../data/seasonData.json'));
      const seasonDataObj = await JSON.parse(seasonDataJSON);

      console.log(seasonDataObj);
      return seasonDataObj;
    } catch (error) {
      console.error(`Error fetching season data: ${error.message}`);
    }
  }
  else {
    // Retrieve player list from previous season data in previousSeasons.json
  }
}

function fetchMemberTeams(returnFullName = false, seasonYear = 0) {

  if (seasonYear === 0) {
    seasonYear = 2024;
  }

  const seasonDataJSON = fs.readFileSync(path.resolve(__dirname, '../data/seasonData.json'));
  const seasonDataObj = JSON.parse(seasonDataJSON);
  const playerInfo = seasonDataObj.players;

  let teamsArray = [];

  // Iterate over each player and extract their team
  for (const player of playerInfo) {
    if (player.team && !teamsArray.includes(player.team)) {
      if (returnFullName) {
        teamsArray.push(convertTeamToFullName(player.team));
      } else
        teamsArray.push(player.team);
    }
  }

  return teamsArray;
}

async function syncDatabase() {
  try {
    await sequelize.sync();
  }
  catch (error) {
    console.error('Unable to sync the database: ', error);
  }
}

async function createNewMember(discordMember, eName, team, role = 'Member') {

  await User.sync();

  const dName = discordMember.displayName;
  const dGlobal = discordMember.globalName;

  try {

    const [newUser, created] = await User.findOrCreate({ 
      where: { 
        [Op.or]: [{ discordName: dName }, { eaName: eName }],
      },
      defaults: {
        discordName: dName, 
        discordGlobal: dGlobal, 
        eaName: eName, 
        team: team,
        numSeasons: 1, 
        role: role,
        active: true }
      });

      if (created) {
        console.log(`Created new user (ID: ${newUser.id}): Discord Name: ${newUser.discordName}, Discord Global: ${newUser.discordGlobal}, 
          EA Username: ${newUser.eaName}, League Role: ${newUser.role}, Chosen Team: ${newUser.team}`);
        return true;
      } else {
        return false;
      }
  } catch (error) {
    console.error(`Error creating new user: ${error}`);
  }
}

async function weekNumberFancy() {

  const seasonDataJSON = fs.readFileSync(path.resolve(__dirname, '../data/seasonData.json'));
  const seasonDataObj = JSON.parse(seasonDataJSON);

  const weekNumber = seasonDataObj.weekNumber;

  const weekFancy = WEEKNUMBERS[weekNumber];

  return weekFancy;  
}

module.exports = { convertFullTeamToSimple, convertTeamToFullName, fetchMembers, fetchSeasonDataObject, fetchMemberTeams, syncDatabase, createNewMember, weekNumberFancy };