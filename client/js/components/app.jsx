var React = require('react');
var DataPage = require('./data-page.jsx');
var App = React.createClass({
  render: function() {
    return (<div><h1>SelfHub</h1><DataPage/></div>);
  }
});

module.exports = App;
