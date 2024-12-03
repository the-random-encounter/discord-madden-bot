const Sequelize = require('sequelize');
const sqlite = require('sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, "../db/madden.sqlite");
const db = new sqlite.Database(dbPath);

require('dotenv').config();
const sequelize = new Sequelize(
  process.env.SQL_DBNAME, 
  process.env.SQL_USER, 
  process.env.SQL_PASS, 
  {
    dialect: 'sqlite',
    host: process.env.SQL_HOST,
    storage: dbPath,
    logging: false,
});

module.exports = sequelize;