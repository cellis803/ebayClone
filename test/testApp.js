var db = require('../db');
var request = require('supertest');

var chai = require('chai');
var assert = chai.assert;

describe('eBay Clone App Tests', function () {

    describe('test nothing', function () {

        it('should pass', function () {
            assert.isTrue(true);
        })
    });



});

describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('../app');
  });
  afterEach(function () {
    server.close();
  });
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});