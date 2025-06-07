const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const db = {
  sequelize,
  Sequelize,
  User: require('./user')(sequelize, Sequelize)
};

module.exports = db; 