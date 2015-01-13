var Backbone = require("backbone");

var Router = Backbone.Router.extend({
  routes: {
    "": "search",
    create: "create",
    "schema/:name": "dataPage",
    signin: "signin",
    signup: "signup",
    user: "user"
  },
  create: function() {
    console.log("Routing to user account page...");
    this.current = "create";
  },
  dataPage: function(schemaName) {
    console.log("Routing to schema...");
    this.current = "schemaController";
    this.schemaName = schemaName;
  },
  search: function() {
    console.log("Routing to home page...");
    if (localStorage.getItem("token")) {
      this.current = "search";
    } else {
      this.current = "signin";
    }
  },
  signin: function() {
    console.log("Routing to signin page...");
    this.current = "signin";
  },
  signup: function() {
    console.log("Routing to signup page...");
    this.current = "signup";
  },
  user: function() {
    console.log("Routing to user account page...");
    this.current = "user";
  }
});

module.exports = Router;
