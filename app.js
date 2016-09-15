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

app.post('/user', function (request, response) {
    console.log("create a user");
    var name = request.body.userId;
    ebayDB.createUser(name).then(
        () => {
            response.send("user created");
        }).catch(err => {
            console.log(err);
            response.status(500);
            response.send(err);
        });
});

app.post('/bid', function (request, response) {
    console.log("bidding on an item");
    var userId = request.body.userId;
    var auctionId = request.params.auctionId;
    var bidValue = request.body.bidValue;
    var endDateTime = request.params.endDateTime;
    ebayDB.createBid(userId, auctionId, bidValue, endDateTime).then(
        () => {
            response.send("bid posted");
        }).catch(err => {
            console.log(err);
            response.status(500);
            response.send(err);
        });
});

app.post('/auction', function (request, response) {
    console.log("creating an auction item");
    var userId = request.body.userId;
    var title = request.params.title;
    var description = request.params.description;
    var startingBid = request.params.startingBid;
    var endDateTime = request.params.endDateTime;
    ebayDB.createAuctionItem(userId, title, description, startingBid, endDateTime).then(
        () => {
            response.send("created auction item");
        }).catch(err => {
            console.log(err);
            response.status(500);
            response.send(err);
        });
});

app.get('/auctions/:auctionId', function (request, response) {
    console.log("getting the auction feed");
    var auctionId = request.params.auctionId;
    ebayDB.getAuctionStreamByUser(auctionId).then(
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

app.listen(8080, function () {
    console.log('Starting ebay clone server...');
    console.log('Example app listening on port 8080...');

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
