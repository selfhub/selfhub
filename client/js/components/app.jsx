var React = require("react");
var Navbar = require("./navbar.jsx");
var Search = require("./search.jsx");

// TODO: replace test data with actual data
var schemas = [
  {name: "Fitbit", route: "#/"},
  {name: "Apple Healthkit", route: "#/"},
  {name: "Nike Fuelband", route: "#/"}
];

var App = React.createClass({
  render: function() {
    return (
      <div>
        <Navbar />
        <div className={"wrapper"}>
          <Search items={schemas} />
        </div>
      </div>
    );
  }
});

module.exports = App;
