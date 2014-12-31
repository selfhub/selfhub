var React = require("react");
var Search = require("./search.jsx");
var SignupForm = require("./signup_form.jsx");
var SigninForm = require("./signin_form.jsx");
var DataPage = require("./data_page.jsx");

var InterfaceComponent = React.createClass({
  componentWillMount: function() {
    this.callback = (function() {
      this.forceUpdate();
    }).bind(this);

    this.props.router.on("route", this.callback);
  },

  componentWillUnmount: function() {
    this.props.router.off("route", this.callback);
  },

  render: function() {
    var currentRoute = this.props.router.current;
    if (currentRoute === "signup") {
      return <SignupForm />;
    }
    if (currentRoute === "signin") {
      return <SigninForm />;
    }
    if (currentRoute === "search") {
      return <Search items={this.props.state._searchSchemas}/>;
    }
    if (currentRoute === "schema") {
      return <DataPage/>;
    }
    return <div />;
  }
});

module.exports = InterfaceComponent;
