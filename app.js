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

// app.post('/login', function(request, response) {
  
//     tweeterdb.loginUser(request.body.name).then(
//         user => {
//             response.send(user);
//         }).catch(err => {
//                 console.log(err);
//                 response.status(500);
//                 response.send(err);                
//         });
// });

// app.post('/bid', function(request, response) {
//     var userid = request.body.userid;
//     var tweetText = request.body.tweetText;
//     var timestamp = moment().format('YYYY-MM-DD H:mm:ss');
//     tweeterdb.createTweet(userid, tweetText, timestamp, null).then(
//         () => {
//             response.send("success added");
//         }).catch(err => {
//                 console.log(err);
//                 response.status(500);
//                 response.send(err);                
//         });
// });

app.post('/bid', function(request, response) {
    console.log("I'm bidding on an item");
    var userid = request.body.userid;
    var bidid = request.body.bidid;
    var bidValue = request.body.bidValue;
    var timestamp = moment().format('YYYY-MM-DD H:mm:ss');
    ebaydb.createByid(userid, bidid, bidValue, timestamp, null).then(
        () => {
            response.send("bid posted");
        }).catch(err => {
                console.log(err);
                response.status(500);
                response.send(err);                
        });
});

app.get('/auctions/:auctionId', function (request, response) {
    console.log("I'm getting the auction feed");
    var auction = request.params.auctionId;
    ebaydb.getAuctionStreamByUser(auctionId).then(
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
    console.log('Example app listening on port 8080...');

    var p = ebayDB.initDB();
    p.then(
        val => {

        }).catch(
        err => {
            //handle all errors
            console.log(err);
        });

});
