const { Events } = require('discord.js');
const { User, Season } = require('../models/models.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
    User.sync();
    Season.sync() ;
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
