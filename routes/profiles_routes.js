'use strict';

var bodyparser = require('body-parser');
var Profile = require('../models/Profile');
var Sql = require('sequelize');
var sql = new Sql('profiles_dev', 'profiles_dev', 'foobar123', {
  dialect: 'postgres'
});

module.exports = function (router) {
  router.use(bodyparser.json());

  router.get('/profiles', function (req, res) {
    sql.sync()
      .then(function() {
        Profile.all()
          .then(function (data) {
            res.json(data);
          })
          .error(function (err) {
            console.log(err);
            res.status(500).json({msg: 'internal server error'});
          });
      });
  });

  router.post('/profiles', function (req, res) {
    sql.sync()
      .then(function() {
        Profile.create(req.body)
          .then(function (data) {
            res.json(data);
          })
          .error(function (err) {
            console.log(err);
            res.status(500).json({msg: 'internal server error'});
          });
      });
  });

  router.put('/profiles/:id', function (req, res) {
    sql.sync()
      .then(function() {
        Profile.update(req.body, {where: {id: req.params.id}})
          .then(function() {
            res.json({msg: 'id: ' + req.params.id + ' updated successfully'});
          })
          .error(function (err) {
            console.log(err);
            res.status(500).json({msg: 'internal server error'});
          });
      });
  });

  router.delete('/profiles/:id', function (req, res) {
    sql.sync()
      .then(function() {
        Profile.destroy({where: {id: req.params.id} })
          .then(function () {
            res.json({msg: 'id: ' + req.params.id + ' deleted successfully'});
          })
          .error(function (err) {
            console.log(err);
            res.status(500).json({msg: 'internal server error'});
          });
      });
  });

};
