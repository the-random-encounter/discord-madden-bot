const { Events } = require('discord.js');
const { User, Season } = require('../models/models.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
    Users.sync({ force: true });
    Seasons.sync({ force: true }) ;
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
