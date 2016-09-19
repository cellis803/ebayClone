var express = require('express');
var ebayDB = require('./db.js');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', express.static('html'));

app.post('/login', function(request, response) {
  
    ebayDB.GetUserId(request.body.username).then(
        user => {
            response.send(user);
        }).catch(err => {
                console.log(err);
                response.status(500);
                response.send(err);                
        });
});

app.post('/user', function (request, response) {
    console.log("add a user");
    var name = request.body.name;
    ebayDB.AddUser(name).then(
        () => {
            response.send("user added");
        }).catch(err => {
            console.log(err);
            response.status(500);
            response.send(err);
        });
});

app.post('/bid', function (request, response) {
    console.log("bidding on an item");
    var userId = request.body.userId;
    var auctionId = request.body.auctionId;
    var bidValue = request.body.bidValue;

    console.log(userId +  ", " + auctionId + ", " + bidValue);
    ebayDB.AddBid(userId, auctionId, bidValue).then(
        () => {
            response.send("bid posted");
        }).catch(err => {
            console.log(err);
            response.status(500);
            response.send(err);
        });
});

app.post('/auction', function (request, response) {
    console.log("add auction item");
    var userId = request.body.userId;
    var title = request.params.title;
    var description = request.params.description;
    var startingBid = request.params.startingBid;
    var endDateTime = request.params.endDateTime;
    ebayDB.AddAuction(userId, title, description, startingBid, endDateTime).then(
        () => {
            response.send("added auction item");
        }).catch(err => {
            console.log(err);
            response.status(500);
            response.send(err);
        });
});

app.get('/auctions/:auctionId', function (request, response) {
    console.log("get specific auction item");
    var auctionId = request.params.auctionId;
    ebayDB.GetAnAuction(auctionId).then(
        auctions => {
            response.send(auctions);

        }).catch(
        err => {
            //handle all errors
            console.log(err);
            response.status(500);
            response.send();
        });
});

app.get('/auctions/', function (request, response) {
    console.log("getting the auction feed");
    ebayDB.GetAllAuctions().then(
        auctions => {
            response.send(auctions);

        }).catch(
        err => {
            //handle all errors
            console.log(err);
            response.status(500);
            response.send();
        });
});

var server = app.listen(3000, function () {
    console.log('Starting ebay clone server...');
    console.log('Example app listening on port 3000...');

    var p = ebayDB.initDB();
    p.then(
        val => {

            if (process.argv[2] === "-loadTestData") {
                ebayDB.loadTestData();
            }
   
        }).catch(
        err => {
            //handle all errors
            console.log(err);
        });
});
module.exports = server;