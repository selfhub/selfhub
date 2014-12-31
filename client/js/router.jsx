var Backbone = require("backbone");

var Router = Backbone.Router.extend({
  routes: {
    "": "search",
    signup: "signup",
    signin: "signin",
    "schema/:name": "dataPage"
  },
  search: function() {
    console.log("Routing to home page...");
    this.current = "search";
  },
  signup: function() {
    console.log("Routing to signup page...");
    this.current = "signup";
  },
  signin: function() {
    console.log("Routing to signin page...");
    this.current = "signin";
  },
  dataPage: function(schemaName) {
    console.log("Routing to schema...");
    this.current = "schemaController";
    this.schemaName = schemaName;
  }
});

module.exports = Router;
