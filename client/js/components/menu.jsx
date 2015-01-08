var React = require("react");
var $ = require("jquery");

var Menu = React.createClass({
  componentDidMount: function() {
    var DROP_DOWN_SPEED = 300;
    $(document).ready(function() {
      $(".menu").click(function () {
        $("#dropdown").slideToggle(DROP_DOWN_SPEED);
      });
    });
  },
  render: function() {
    return (
      <aside id="dropdown">
        <ul id="dropdown-list">
          <li>Create Schema</li>
          <li>Followed Schemas</li>
          <li>My Data</li>
          <li>Signout</li>
        </ul>
      </aside>
    );
  }
});

module.exports = Menu;
