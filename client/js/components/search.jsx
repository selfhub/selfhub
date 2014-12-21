/** @jsx React.DOM */
var React = require("react");

var Search = React.createClass({
  render: function() {
    return (
      <input type="text" placeholder="search for a schema" />
    );
  }
});

module.exports = Search;
