var db = require('../db');
var request = require('supertest');

var chai = require('chai');
var assert = chai.assert;

var server;
describe('eBay Clone App Tests', function () {

    before(function () {
        server = require('../app');
    });

    describe('test nothing', function () {
        it('should pass', function () {
            assert.isTrue(true);
        })
    });

    describe('loading express', function () {

        it('responds to /', function testSlash(done) {
            request(server)
                .get('/')
                .expect(200, done);
        });

        it('returns 404 for everything else', function testPath(done) {
            request(server)
                .get('/foo/bar')
                .expect(404, done);
        });
    });    

    describe('calling GET /auctions', function () {

        it('returns list of auctions', function testAuctions(done) {
            request(server)
                .get('/auctions')
                .expect(200, done);
        });
    });        

    after(function () {
        server.close();
    });  

});

