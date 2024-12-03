const { Events } = require('discord.js');
const { sequelize, User, Season } = require('../models/models.js');

const usernames = [ 
  ['shockedprodigyx', 'shockedprodigyx', 'giants'], 
  ['claytonq45', 'Copperhead', 'patriots'], 
  ['Austin207', 'OfficialAWOL', 'lions'], 
  ['villasmil12', 'Ray', 'ravens'] ];

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
    sequelize
      .authenticate()
      .then(function(err) {
        console.log('Connection has been established successfully.');

        initialSetup();
      })
      .catch(function(err) {
        console.log('Unable to connect to the database:', err);
      });
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};

function initialSetup() {
  User.sync({force: true})
    .then(() => {
      console.log('User table created successfully.');

      for (let i = 0; i < usernames.length; i++) {
        User.create({
          discordName: usernames[i][1],
          eaName: usernames[i][0],
          team: usernames[i][2],
          weekFinished: true,
          //active: true
        });
      }

    })
    .catch((error) => {
      console.error('Error creating User table: ', error);
    });
  Season.sync({force: true});
};