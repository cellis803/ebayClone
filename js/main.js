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
    
    render: function() {
                return (
                    <div id="ebayHome">
                    <h1>{this.props.user.name}</h1>
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
            <div className="yui3-g auction">
                <div className="yui3-u">
                    <div className="yui3-g">
                        <div className="yui3-u-1">
                            <a href="#">{this.props.data.title}</a>&nbsp;(<span className="sellerName">{this.props.data.sellerName}</span>)
                            <br/>{this.props.data.description} 
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
