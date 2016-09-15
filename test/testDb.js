var db = require('../db');

var chai = require('chai');
var expect = require("chai").expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised); 
chai.should(); 

var assert = chai.assert;

before(function() {
  db.initDB().then(
        success => {
            db.loadTestData().then(
                success => {
                    console.log("added test data");
                }
            );
        }).catch(err => {
                console.log(err);
                response.status(500);
                response.send(err);                
        });
  
});

describe('eBay Clone DB tests', function () {

    describe('test nothing', function () {
        it('should pass', function() {
            assert.isTrue(true);
        });
    }); 

    describe('test getUserId', function () {
        it('should get user ID for valid user', function() {
            return db.GetUserId("Chris").then(function(data){
                expect(data.rowid).to.equal(1);
            });
        });
    });    
});