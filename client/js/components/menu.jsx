var React = require("react");
var $ = require("jquery");

var Menu = React.createClass({
  componentDidMount: function() {
    var DROP_DOWN_SPEED = 300;
    var isToggled = false;
    $(document).ready(function() {
      $(".menu").click(function () {
        $("#dropdown").slideToggle(DROP_DOWN_SPEED);
        isToggled = !isToggled;
      });

      $(document).on("keydown", function(event) {
        if (event.keyCode === 27 && isToggled) {
          $("#dropdown").slideToggle(DROP_DOWN_SPEED);
          isToggled = !isToggled;
        }
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
            <a href="#/create">
              <span className="menu-item">Create Schema</span>
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
