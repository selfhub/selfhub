var React = require("react");
var Navbar = require("./navbar.jsx");
var Search = require("./search.jsx");
var AppStore = require("../store/app_store.js");

// TODO: replace test data with actual data
var schemas = [
  {name: "Fitbit", route: "#/"},
  {name: "Apple Healthkit", route: "#/"},
  {name: "Nike Fuelband", route: "#/"}
];

var App = React.createClass({
  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },
  render: function() {
    return (
      <div>
        <Navbar />
        <div className={"wrapper"}>
          <Search items={schemas} />
        </div>
      </div>
    );
  },
  /**
   * Event handler for 'change' events coming from the AppStore
   */
  _onChange: function() {
    this.setState(AppStore.getAppState());
  }
});

module.exports = App;
