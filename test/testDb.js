var db = require('../db');

var chai = require('chai');
var expect = require("chai").expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised); 
chai.should(); 

var assert = chai.assert;

before(function() {
  db.initDB();
  //db.loadTestData();
});

describe('eBay Clone DB tests', function () {

    it('test nothing', function() {
        assert.isTrue(true);
    })
});