const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = require('../utils/database.js');

/* type Team =
  'bears' | 
  'bengals' |
  'bills' |
  'broncos' |
  'browns' |
  'buccaneers' |
  'cardinals' |
  'chargers' |
  'chiefs' |
  'colts' |
  'cowboys' |
  'dolphins' |
  'eagles' |
  'falcons' |
  'fortyniners' |
  'giants' |
  'jaguars' |
  'jets' |
  'lions' |
  'packers' |
  'panthers' |
  'patriots' |
  'raiders' |
  'rams' |
  'ravens' |
  'redskins' |
  'saints' |
  'seahawks' |
  'steelers' |
  'texans' |
  'titans' |
  'vikings'

type Role =
  'admin' |
  'commissioner' |
  'league' |
  'spectator' |
  'unassigned'
*/


class User extends Model {
  /**
    declare id: number;
    declare username: string;
    declare eaName: string;
    declare discordName: string;
    declare team: Team;
    declare role: Role;
  */
}

User.init({
  eaName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discordName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discordGlobal: DataTypes.STRING,
  team: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: DataTypes.STRING,
  numSeasons: DataTypes.INTEGER
},
{ sequelize,
  modelName: 'User'
},
);

class Season extends Model {
  /**
    declare seasonID: number;
    declare year: number;
    declare seasonNumber: number;
    declare commisioner: string;
    declare superBowlWinner: string;
    declare afcChampion: string;
    declare nfcChampion: string;
    declare Participants: string;
    declare afcBye: string;
    declare nfcBye: string;
  */
}

Season.init({
  seasonID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  year: DataTypes.INTEGER,
  commisioner: DataTypes.STRING,
  superBowlWinner: DataTypes.STRING,
  afcChampion: DataTypes.STRING,
  nfcChampion: DataTypes.STRING,
  Participants: DataTypes.STRING,
  afcBye: DataTypes.STRING,
  nfcBye: DataTypes.STRING,
  weekNumber: DataTypes.INTEGER,
  concluded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
},
{ sequelize,
  modelName: 'Season',
},
);

User.sync({alter: true});
Season.sync({alter: true});

module.exports = { sequelize, User, Season };