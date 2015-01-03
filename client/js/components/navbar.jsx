var React = require("react");

var Navbar = React.createClass({
  render: function() {
    return (
      <nav>
        <div className="home"><a href="#/">SelfHub</a></div>
        <div className="menu">Menu</div>
      </nav>
    );
  }
});

module.exports = Navbar;
