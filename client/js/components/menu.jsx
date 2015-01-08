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
          <li>
            <a href="#/">
              <span className="menu-item">Home</span>
            </a>
          </li>
          <li>
            <a href="#/">
              <span className="menu-item">Create Schema</span>
            </a>
          </li>
          <li>
            <a href="#/">
              <span className="menu-item">Followed Schemas</span>
            </a>
          </li>
          <li>
            <a href="#/user">
              <span className="menu-item">My Data</span>
            </a>
          </li>
          <li>
            <a href="#/signin">
              <span className="menu-item">Signout</span>
            </a>
          </li>
        </ul>
      </aside>
    );
  }
});

module.exports = Menu;
