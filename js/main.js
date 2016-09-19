import React from "react";
import {render} from 'react-dom';

var EbayClone = React.createClass({

    getInitialState: function() {
        return {loggedInUser: ""};
    },

    logMeIn: function(user) {
        this.setState(Object.assign({loggedInUser : user}));
    },

    render: function() {
        return (
                <div>
                    <div id="header">
                        <div className="yui3-g">
                            <div className="yui3-u-1">
                                <div className="yui3-g">
                                    <div className="yui3-u-3-4">
                                        reBay
                                    </div>
                                    <div className="yui3-u-1-4">
                                            <Login setLoggedInUser={this.logMeIn} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>            
                        
                    <AuctionList user={this.state.loggedInUser} />

                    <div id="footer">
                        <div className="yui3-g">
                            <div className="yui3-u-1">

                            </div>
                        </div>
                    </div>                      
                </div>
            );
    }

});

var Login = React.createClass({
    getInitialState: function() {
        return {error: false,
                loggedInUser: ""};
    },

    login: function(event) {
        
        var userName = $("#username").val();
        var userObj = {
            "username": userName
        };
        var that = this;
        $.post("/login", userObj, function(data) {
            
        }).done(function(loggedInUser) {
            that.setState(Object.assign({error: false, loggedInUser: loggedInUser}));
            that.props.setLoggedInUser(loggedInUser);

        }).fail(function() {
            that.setState({error: true, loggedInUser: ""});
        })
            
    },

    logout: function(event) {     
        this.setState(Object.assign({error: false, loggedInUser: "" }));  
        this.props.setLoggedInUser("");          
    },  

    render: function() {
        if (this.state.error) {
            return (
                <div>
                    Login with your username: <input type="text" id="username" name="name"  />
                    <input className="ebayButton" id="loginButton" type="submit" value="Login" onClick={this.login} />
                    <p className="error">Login Failed. Please enter user name again.</p>
                </div>
                
            );
        } else if (this.state.loggedInUser === "") {
            return (
                <div>
                    Username: <input type="text" id="username" name="name"  />
                    <input className="ebayButton" id="loginButton" type="submit" value="Login" onClick={this.login} />
                </div>
            );
        } else {
            return (
                <div>
                    Welcome, {this.state.loggedInUser.name}&nbsp;&nbsp;
                     <input className="ebayButton" id="logoutButton" type="submit" value="Log Out" onClick={this.logout}  />
                </div>
            );
        }
    }
}); 

var AuctionList = React.createClass({
    getInitialState: function() {
        return {auctionList : [] };
    },

    componentWillMount: function() {
            var that = this;
            $.getJSON("/auctions", function( data ) {
                    that.setState({auctionList: data});
                    
            });
    },
    
    newAuction: function () {
       var that = this;
        var newAuctionDialog = $("#newAuctionDialog").dialog({
            title: "Create New Auction",
            buttons: {
                "Submit Auction": function() {
                    // if ($("#bidAmount").val() <= that.state.currentBid) {
                    //     //$("#bidErrorMessage").show();
                    // } else {
                        //$("#bidErrorMessage").hide();
                        that.submitNewAuction(this);
                        newAuctionDialog.dialog("close");
                    },

                "Cancel": function() {
                    //$("#bidErrorMessage").hide();
                    newAuctionDialog.dialog("close");
                }                      
            }
        });
        $("#newAuctionDialog").dialog("open");
    },

    submitNewAuction: function() {

        var that = this;
        var auctionObj = {
            "userId" : this.props.user.rowid,
            "title" : $("#title").val(),
            "description" : $("#description").val(),
            "startingBid" : $("#startingBid").val(),
            "duration" : $("#duration").val()
        };

        $.post("/auction", auctionObj, function(data) {
            
        }).done(function(auctions) {
            that.setState({auctionList: auctions});

        }).fail(function() {

        }); 
    },

    render: function() {
                var that = this;

                var button;
                if (this.props.user.name) {
                    button = <input className="ebayButton" id="addAuctionBtnId" type="submit" value="Sell Something" onClick={this.newAuction} />;
                } else {
                    button = null;
                }

                return (
                    <div id="ebayHome">
                        <div className="yui3-g">
                            <div className="yui3-u-7-8">
                                <div id="auctionList"> 
                                    {button}
                                    
                                    <div className="yui3-u-1">
                                        <div className="yui3-g auctionHeader">
                                            <div className="yui3-u-1-2">
                                                Auctions
                                            </div>
                                            <div className="yui3-u-1-6">
                                                Seller Info
                                            </div>        
                                            <div className="yui3-u-1-4">
                                                Buyer Info
                                            </div>                                                                                    
                                        </div>
                                    </div>
                                
                                    
                                    {
                                        
                                        this.state.auctionList.map(function(val, idx) {
                                                return <Auction key={val.rowid} user={that.props.user} data={val}/>;
                                        })
                                    }

                                    
                                </div>
                            </div>
                        </div>                            
                    </div>
                );
}
});

var Auction = React.createClass({
    getInitialState: function() {
        return {currentBid : this.props.data.currentBid, 
                highestBidder: this.props.data.highestBidder, 
                numberOfBids: this.props.data.numberOfBids};
    },

    bid: function() {

       var that = this;
        var bidDialog = $("#bidDialog").dialog({
            title: that.props.data.title,
            buttons: {
                "Submit Bid": function() {
                    if ($("#bidAmount").val() <= that.state.currentBid) {
                        $("#bidErrorMessage").show();
                    } else {
                        $("#bidErrorMessage").hide();
                        that.submitBid(this);
                        bidDialog.dialog("close");
                    }

                },
                Cancel: function() {
                    $("#bidErrorMessage").hide();
                    bidDialog.dialog( "close" );
                }                      
            }
        });
        $("#currentBidValue").text(that.state.currentBid);
        $("#bidDialog").dialog("open");
    },

    submitBid: function() {

        var that = this;
        var bidObj = {
            "userId" : this.props.user.rowid,
            "auctionId" : this.props.data.rowid,
            "bidValue" : $("#bidAmount").val()
        };

        $.post("/bid", bidObj, function(data) {
            
        }).done(function(auction) {
            that.setState(Object.assign({currentBid: auction.currentBid, 
                                         highestBidder: auction.highestBidder,
                                         numberOfBids: auction.numberOfBids }));

        }).fail(function() {

        });     
    },
    render: function() {

        var timeRemaining = showTimeRemaining(this.props.data.endDateTime);    

        var button;
        if (this.props.user.name && timeRemaining !== 0) {
            button = <input className="ebayButton" id="bidBtnId" type="submit" value="Bid" onClick={this.bid} />;
        } else {
            button = null;
        }

        var displayCurrentPrice;
         if (this.state.currentBid) {
            displayCurrentPrice = <div><span className="currentBid">Current Bid: ${this.state.currentBid}</span>(<span className="sellerName">{this.state.highestBidder}</span>){button}</div>;
        } else {
            displayCurrentPrice = <div><span className="currentBid">Starting Bid: ${this.props.data.startingBid}</span>{button}</div>;            
        } 

          

        return (
            <div className="yui3-g auction">
                <div className="yui3-u-1">
                    <div className="yui3-g">
                        <div className="yui3-u-1-2">
                            <a href="#">{this.props.data.title}</a>&nbsp; 
                            [bids: {this.state.numberOfBids}] <br/>
                            {this.props.data.description} 
                            
                        </div>
                        <div className="yui3-u-1-6">
                            <span className="sellerName">{this.props.data.sellerName}</span>
                        </div>
                        <div className="yui3-u-1-4">
                            {displayCurrentPrice}
                            Time Remaining: {timeRemaining} 
                        </div>                        
                    </div>
                </div>
                <br/> 
            </div>
        );
    }
}); 

render((
    <EbayClone />
), document.getElementById('main'));

function showTimeRemaining(date_future) {

    var date_now = new Date();

    if (date_now > date_future) {
        return 0;
    }

    // get total seconds between the times
    var delta = Math.abs(date_future - date_now) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = Math.floor(delta % 60) % 60;  // in theory the modulus is not required

    if (days === 0) {
        if (hours === 0) {
            return minutes + "m " + seconds + "s ";
        } else {
            return  hours + "h " + minutes + "m ";
        }
        
    } else {
        return days + " days, " + hours + "h ";
    }
}

