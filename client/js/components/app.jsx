var React = require("react");
var Backbone = require("backbone");
var Navbar = require("./navbar.jsx");
var Menu = require("./menu.jsx");
var AppStore = require("../store/app_store.js");
var InterfaceComponent = require("./interface_component.jsx");
var CreateFormComponent = require("./create_form.jsx");

var Router = require("../router.jsx");
var router = new Router();
Backbone.history.start();

var App = React.createClass({
  getInitialState: function() {
    return AppStore.getAppState();
  },

  componentDidMount: function() {
    console.log("event:", event);
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div>
        <Menu />
        <Navbar />
        <InterfaceComponent state={this.state} router={router}/>
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
