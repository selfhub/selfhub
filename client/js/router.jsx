/** @jsx React.DOM */
var React = require("react");
var Backbone = require("backbone");

var App = require("./components/app.jsx");
var Search = require("./components/search.jsx");

var InterfaceComponent = React.createClass({
  componentWillMount: function() {
    this.callback = (function() {
      this.forceUpdate();
    }).bind(this);
  
    this.props.router.on("route", this.callback);
  },
  componentWillUnmount: function() {
    this.props.router.off("route", this.callback);
  },
  render: function() {
    if (this.props.router.current === "") {
      return <App />;
    }
    if (this.props.router.current === "search") {
      return <Search />;
    }
    return <div />;
  }
});

var Router = Backbone.Router.extend({
  routes: {
    "": "index",
    signup: "signup",
    signin: "signin",
    search: "search"
  },
  index: function() {
    console.log("Routing to home page...");
    this.current = "";
  },
  signup: function() {
    console.log("Routing to signup page...");
    this.current = "signup";
  },
  signin: function() {
    console.log("Routing to signin page...");
    this.current = "signin";
  },
  search: function() {
    console.log("Routing to search page...");
    this.current = "search";
  }
});

var router = new Router();
React.render(<InterfaceComponent router={router} />, document.body);
Backbone.history.start();

module.exports = Router;
