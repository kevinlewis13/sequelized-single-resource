'use strict';

var Sql = require('sequelize');
var sql = new Sql('profiles_dev', 'profiles_dev', 'foobar123', {
  dialect: 'postgres'
});

var Profile = module.exports = sql.define('Profile', {
  name: Sql.STRING,
  about: Sql.STRING,
  available: Sql.BOOLEAN
});

Profile.sync();

//maybe add some validation to this, if time, ala docs/models-definition.
