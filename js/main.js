import React from "react";
import {render} from 'react-dom';

var EbayClone = React.createClass({

    getInitialState: function() {
        return {loggedInUser: ""};
    },

    logMeIn: function(userId) {
        this.setState({loggedInUser : userId});
    },

    render: function() {
        if (this.state.loggedInUser !== "") {
            return (<AuctionList user={this.state.loggedInUser} />);
        } else {
            return (<Login setLoggedIn={this.logMeIn} />);
        }
    }

});

var Login = React.createClass({
    getInitialState: function() {
        return {error: false};
    },

    handleClick: function(event) {
        
        var userName = $("#username").val();
        var userObj = {
            "username": userName
        };
        var that = this;
        $.post("/login", userObj, function(data) {
            
        }).done(function(loggedInUser) {
            that.setState({error: false});
            that.props.setLoggedIn(loggedInUser.userId);

        }).fail(function() {
            that.setState({error: true});
        })
            
    },

    render: function() {
        if (this.state.error) {
            return (
                <div>
                    Login with your username: <input type="text" id="username" name="name"  />
                    <input id="loginButton" type="submit" value="Login" onClick={this.handleClick} />
                    <h1 style={{color:777}}>Login Failed. Please enter user name again.</h1>
                </div>
                
            );
        } else {
            return (
                <div>
                    Login with your username: <input type="text" id="username" name="name"  />
                    <input id="loginButton" type="submit" value="Login" onClick={this.handleClick} />
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
    
    render: function() {
                return (
                    <div id="ebayHome">
                        <div className="yui3-g">
                            <div className="yui3-u-2-3">
                                <div id="auctionList"> 
                                    {
                                        this.state.auctionList.map(function(val, idx) {
                                                return <Auction key={val.rowid} data={val}/>;
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
        return {};
    },

    render: function() {
        return (
            <div className="yui3-g">
                <div className="yui3-u">
                    <div className="yui3-g">
                        <div className="yui3-u-1">
                            {this.props.data.title}
                        </div>
                        <div className="yui3-u-1-2">{this.props.data.name}</div>
                        <div className="yui3-u-1-2">{this.props.data.time}</div>
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
