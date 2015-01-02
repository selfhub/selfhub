var React = require("react");

var Navbar = React.createClass({
  render: function() {
    return (
      <nav>
        <div className={"home"}><a href="#/">SelfHub</a></div>
        <div className={"menu"}><a href="">Menu</a></div>
      </nav>
    );
  }
});

module.exports = Navbar;
