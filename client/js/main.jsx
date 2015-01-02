/** @jsx React.DOM */
var React = require("react");

// Lines 5-6 handle a very exceptional bug where Backbone's $ is undefined
var Backbone = require("backbone");
Backbone.$ = window.$ = require("jquery");

var App = require("./components/app.jsx");
var Router = require("./router.jsx");

React.render(<App />, document.body);
