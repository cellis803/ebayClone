var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('ebay.db');

module.exports = {
    initDB: function () {

        return new Promise(
            (resolve, reject) => {
                db.serialize(function () {
                    console.log("creating tables");

                    // db.run("CREATE TABLE IF NOT EXISTS user (name TEXT NOT NULL)");
                    // db.run("CREATE TABLE IF NOT EXISTS tweet (userId INTEGER NOT NULL, tweetText TEXT NOT NULL, time DATETIME NOT NULL, parentTweetId INTEGER, FOREIGN KEY(userId) REFERENCES user(rowid))");
                    // db.run("CREATE TABLE IF NOT EXISTS userFollows (followsUserId INTEGER NOT NULL, followerUserId INTEGER NOT NULL, PRIMARY KEY (followsUserId, followerUserId), FOREIGN KEY(followsUserId) REFERENCES user(rowid), FOREIGN KEY(followerUserId) REFERENCES user(rowid)) WITHOUT ROWID");
                    // db.run("CREATE TABLE IF NOT EXISTS tweetReplies (tweetId INTEGER NOT NULL, replyText TEXT NOT NULL, replyUserId INTEGER NOT NULL, FOREIGN KEY(tweetId) REFERENCES tweet(rowid), FOREIGN KEY(replyUserId) REFERENCES user(rowid))");
                    // db.run("CREATE TABLE IF NOT EXISTS tweetLikes (tweetId INTEGER NOT NULL, likeUserId INTEGER NOT NULL, FOREIGN KEY(tweetId) REFERENCES tweet(rowid), FOREIGN KEY(likeUserId) REFERENCES user(rowid))");

                    console.log("tables have been created");
                    resolve();
                });  
        });
    }

    
        GetAllAuctions:function() {
        return new Promise(
            (resolve, reject) => {
                db.serialize(function () {
                    db.all("SELECT * from auction", function (err, rows) {
                            if (rows.length === 1) {
                                resolve(rows);
                            } else {
                                reject("Auctions table does not exist");
                            }
                            
                        });
                });
            });
    }

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
