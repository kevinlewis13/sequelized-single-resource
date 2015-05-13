'use strict';

require('../index');

var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;

chai.use(chaihttp);

var Profile = require('../models/Profile');

describe('sequelized profile API', function() {

  after(function (done) {
    Profile.destroy({where: {name: 'test name'}});
      done();
  });

  it('should make a new user profile', function (done) {
    chai.request('localhost:3000')
      .post('/api/profiles')
      .send({name: 'test name'})
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(res.body.name).to.eql('test name');
        expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should validate the available property on new profiles', function (done) {
    chai.request('localhost:3000')
      .post('/api/profiles')
      .send({available: 'always'})
      .end(function (err, res) {
        expect(res.body.msg).to.eql('internal server error');
        done();
      });
  });

  it('should return an array of profiles', function (done) {
    chai.request('localhost:3000')
      .get('/api/profiles')
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });

  });

  describe('needs existing profiles to work', function () {
    var testProfile;
    beforeEach(function (done) {
      var testProfileData = {name: 'test name2'};
      Profile.create(testProfileData)
        .then(function (data) {
          testProfile = data;
          done();
        })
        .error(function (err) {
          if (err) throw err;
        });
    });

    afterEach(function (done) {
      Profile.destroy({where: {name: 'test name2'}});
      done();
    });

    afterEach(function (done) {
      Profile.destroy({where: {name: null}});
      done();
    });

    it('should make a profile in a before block', function() {
      expect(testProfile.name).to.eql('test name2');
      expect(testProfile).to.have.property('id');
    });

    it('should be able to update a profile', function (done) {
      chai.request('localhost:3000')
        .put('/api/profiles/' + testProfile.id)
        .send({about: 'likes candy'})
        .end(function (err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('id: ' + testProfile.id + ' updated successfully');
          done();
        });
    });

      it('should validate updates', function (done) {
      chai.request('localhost:3000')
        .put('/api/profiles/' + testProfile.id)
        .send({available: 'off and on'})
        .end(function (err, res) {
          expect(res.body.msg).to.eql('internal server error');
          done();
        });
    });

    it('should be able to delete a profile', function (done) {
      chai.request('localhost:3000')
        .del('/api/profiles/' + testProfile.id)
        .end(function (err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('id: ' + testProfile.id + ' deleted successfully');
          done();
        });
    });

  });
});
