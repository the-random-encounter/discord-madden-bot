const Sequelize = require('sequelize');
const sqlite = require('sqlite3');
const path = require('path');
const db = new sqlite.Database(path.resolve(__dirname, "../db/madden.sqlite"));
const sequelize = new Sequelize('database', 'user', 'd1g1tal', {
  dialect: 'sqlite',
  host: 'localhost',

  storage: '../db/madden.sqlite',
  logging: false,
});

module.exports = sequelize;