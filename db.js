var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('ebay.db');
var moment = require('moment');

module.exports = {
    initDB: function () {
        return new Promise(
            (resolve, reject) => {
                db.serialize(function () {
                    console.log("creating tables...");

                    console.log("CREATE TABLE IF NOT EXISTS user (name TEXT NOT NULL)");
                    db.run("CREATE TABLE IF NOT EXISTS user (name TEXT NOT NULL)");
                    console.log("CREATE TABLE IF NOT EXISTS auction (userId INTEGER NOT NULL, title TEXT NOT NULL, description TEXT, startingBid REAL NOT NULL, endDateTime DATETIME NOT NULL, FOREIGN KEY(userId) REFERENCES user(rowid))");
                    db.run("CREATE TABLE IF NOT EXISTS auction (userId INTEGER NOT NULL, title TEXT NOT NULL, description TEXT, startingBid REAL, endDateTime DATETIME NOT NULL, FOREIGN KEY(userId) REFERENCES user(rowid))");
                    console.log("CREATE TABLE IF NOT EXISTS bid (userId INTEGER NOT NULL, auctionId INTEGER NOT NULL, FOREIGN KEY(userId) REFERENCES user(rowid), FOREIGN KEY(auctionId) REFERENCES auction(rowid))");
                    db.run("CREATE TABLE IF NOT EXISTS bid (userId INTEGER NOT NULL, auctionId INTEGER NOT NULL, bidValue REAL NOT NULL, dateTime REAL NOT NULL, FOREIGN KEY(userId) REFERENCES user(rowid), FOREIGN KEY(auctionId) REFERENCES auction(rowid))");

                    console.log("tables have been created :)");
                    resolve();
                });
            });
    },
  

    loadTestData: function() {
        return new Promise(
            (resolve, reject) => {
                db.serialize(function () {

                    console.log("truncating tables...");
                    db.run("DELETE FROM bid");
                    db.run("DELETE FROM auction");
                    db.run("DELETE FROM user");
                                      

                    console.log("loading test data...");
                    db.run("INSERT INTO user VALUES ('Chris')");
                    db.run("INSERT INTO user VALUES ('Haritha')");
                    db.run("INSERT INTO user VALUES ('Carolyn')");
                    
                    db.run("INSERT INTO auction VALUES (1,'Poulan Pro 18\" Chainsaw','used, piece of junk. good luck.',1,111111)");
                    db.run("INSERT INTO auction VALUES (3,'2008 Honda Civic Si','sporty 6 speed',5000,111111)");


                    resolve();
                });
            });
    },

   GetAllAuctions: function () {
        return new Promise(
            (resolve, reject) => {
                db.serialize(function () {
                    db.all("SELECT auction.rowid, auction.userId, title, description, startingBid, endDateTime, u.name as sellerName, bid.bidValue as currentBid, highestBidder, " +
                            "( select count(*) from bid b3 where b3.auctionId = auction.rowid) as numberOfBids " +
                            "from auction " + 
                            "inner join user u on auction.userId = u.rowid " +
                            "left outer join ( " +

                            "SELECT b1.*, u.name as highestBidder " +
                            "FROM bid b1 " +
                            "INNER JOIN user u on b1.userId = u.rowid " + 
                            "LEFT OUTER JOIN bid b2 " +
                            "ON (b1.auctionId = b2.auctionId " +
                            "    AND b1.bidValue < b2.bidValue) " +
                            "WHERE b2.bidValue IS NULL " +
                            ")  as bid on bid.auctionId = auction.rowid ",

                        function (err, rows) {
                            if (err) {
                                reject("Auction table does not exist");                            
                            } else {
                                resolve(rows);
                            }

                    });
                });
            });
    },

   GetAnAuction: function (auctionId) {
        return new Promise(
            (resolve, reject) => {
                db.serialize(function () {
                    db.all("SELECT auction.rowid, auction.userId, title, description, startingBid, endDateTime, u.name as sellerName, bid.bidValue as currentBid, highestBidder, " +
                            "( select count(*) from bid b3 where b3.auctionId = auction.rowid) as numberOfBids " +
                            "from auction " + 
                            "inner join user u on auction.userId = u.rowid " +
                            "left outer join ( " +

                            "SELECT b1.*, u.name as highestBidder " +
                            "FROM bid b1 " +
                            "INNER JOIN user u on b1.userId = u.rowid " +                            
                            "LEFT OUTER JOIN bid b2 " +
                            "ON (b1.auctionId = b2.auctionId " +
                            "    AND b1.bidValue < b2.bidValue) " +
                            "WHERE b2.bidValue IS NULL " +
                            ")  as bid on bid.auctionId = auction.rowid WHERE auction.rowid = " + auctionId,

                        function (err, rows) {
                            if (err) {
                                reject("Auction table does not exist");                            
                            } else {
                                resolve(rows[0]);
                            }

                    });
                });
            });
    },    

    AddUser: function(name){
        return new Promise(
            (resolve, reject) => {
                db.serialize( function(){
                    var stmt = db.prepare("INSERT into user values (?)");
                    stmt.run(name, function(error){
                        if(error)
                        {
                            reject(error);
                        }
                        else
                        {
                            stmt.finalize();
                            resolve();
                        }
                    })
                })
            }
        )
    },

    GetUserId: function (name) {
        return new Promise(
            (resolve, reject) => {
                db.serialize(function () {
                    db.all("SELECT u.rowid, u.name from user u where u.name = '" + name + "'", function (err, rows) {
                            if (rows.length === 1) {
                                resolve(rows[0]);
                            } else {
                                reject("User does not exist");
                            }
                            
                        });
                });  
        });
    },

    AddAuction: function(userid, title, description, startingbid, duration) {
 
        var endDate = moment().add(duration, 'days').valueOf();

        return new Promise(
            (resolve, reject) => {
                db.serialize( function () {
                    var stmt = db.prepare("INSERT into auction values (?,?,?,?,?)");
                    stmt.run(userid, title, description, startingbid, endDate, function(error){
                        if(error)
                        {
                            reject(error);
                        }
                        else
                        {
                            stmt.finalize();
                            resolve();
                        }
                    })
                })
            }
        )
    },

    AddBid: function(userId, auctionId, bidValue) {
        return new Promise(
            (resolve, reject) => {
                db.serialize( function () {
                    var stmt = db.prepare("INSERT into bid values (?,?,?,?)");
                    stmt.run(userId, auctionId, bidValue, new Date(), function(error){
                        if(error)
                        {
                            reject(error);
                        }
                        else
                        {
                            stmt.finalize();
                            resolve();
                        }
                    })
                })
            }
        )
    },

    tearDown: function() {
        return new Promise(
            (resolve, reject) => {
                db.serialize(function () {
                    console.log("dropping tables...");

                    console.log("DROP TABLE bid");
                    db.run("DROP TABLE bid");
                    console.log("DROP TABLE auction");
                    db.run("DROP TABLE auction"); 
                    console.log("DROP TABLE user");
                    db.run("DROP TABLE user");

                    console.log("tables have been dropped :)");
                    resolve();
                }) 
        });
    },

    // createUser: function (name) {
    //     return new Promise(
    //         (resolve, reject) => {
    //             db.serialize(function () {
    //                 var stmt = db.prepare("INSERT INTO user VALUES (?)");

    //                 stmt.run(name, function (error) {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     }

    //                 });

    //                 stmt.finalize();
    //                 resolve();
    //             });
    //         });
    // },

    // loginUser: function (name) {
    //     return new Promise(
    //         (resolve, reject) => {
    //             db.serialize(function () {
    //                 db.all("SELECT u.rowid, u.name from user u where u.name = '" + name + "'", function (err, rows) {
    //                         if (rows.length === 1) {
    //                             resolve(rows[0]);
    //                         } else {
    //                             reject("User does not exist");
    //                         }
                            
    //                     });
    //             });
    //         });
    // },    

    // createTweet: function (userid, text, timestamp, parentid) {
    //     return new Promise(
    //         (resolve, reject) => {
    //             db.serialize(function () {
    //                 var stmt = db.prepare("INSERT INTO tweet VALUES (?, ?, ?, ?)");

    //                 stmt.run(userid, text, timestamp, parentid, function (error) {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     }
    //                 });

    //                 stmt.finalize();
    //                 resolve();
    //             });
    //         });

    // },

    // addFollow: function (userid, followerid) {
    //     return new Promise(
    //         (resolve, reject) => {
    //             db.serialize(function () {
    //                 var stmt = db.prepare("INSERT INTO userFollows VALUES (?, ?)");

    //                 stmt.run(userid, followerid, function (error) {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     }
    //                 });

    //                 stmt.finalize();
    //                 resolve();
    //             });
    //         });
    // },

    // getTweetStreamByUser: function (userId) {
    //     return new Promise(
    //         (resolve, reject) => {
    //             db.serialize(function () {
    //                 db.all("SELECT t.rowId as rowid, t.tweetText as tweetText, u.name as name, t.time as time " +
    //                     ", (select count(*) from tweetLikes tl where tl.tweetId = t.rowid) as likeCount " +
    //                     "FROM tweet t " +
    //                     "inner join user u on u.rowid = t.userId " +
    //                     "where t.userId = " + userId + " or t.userId in (" +
    //                     "select f.followsUserId from userFollows f where f.followerUserId = " + userId +
    //                     ")", function (err, rows) {
    //                         resolve(rows);
    //                     });
    //             });
    //         });
    // },

    // replyToTweet: function (tweetId, replyText, userId) {
    //     return new Promise(
    //         (resolve, reject) => {
    //             db.serialize(function () {
    //                 var stmt = db.prepare("INSERT INTO tweetReplies VALUES (?, ?, ?)");

    //                 stmt.run(tweetId, replyText, userId, function (error) {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     }
    //                 });

    //                 stmt.finalize();
    //                 resolve();
    //             });
    //         });

    // },

    // getReplies: function (tweetId) {
    //     return new Promise(
    //         (resolve, reject) => {
    //             db.serialize(function () {
    //                 db.all("SELECT r.rowId as rowid, r.replyText as tweetText, replyUserId as id " +
    //                     "FROM tweetReplies r " +
    //                     "where r.rowid = " + tweetId, function (err, rows) {
    //                         resolve(rows);
    //                     });
    //             });
    //         });
    // },

    // likeTweet: function (tweetId, userId) {
    //     return new Promise(
    //         (resolve, reject) => {
    //             db.serialize(function () {
    //                 var stmt = db.prepare("INSERT INTO tweetLikes VALUES (?, ?)");

    //                 stmt.run(tweetId, userId, function (error) {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     }
    //                 });

    //                 stmt.finalize();
    //                 resolve();
    //             });
    //         });

    // }
}
