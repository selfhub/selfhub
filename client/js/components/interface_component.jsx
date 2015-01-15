var React = require("react");
var Search = require("./search.jsx");
var SignupForm = require("./signup_form.jsx");
var SigninForm = require("./signin_form.jsx");
var DataPage = require("./data_page.jsx");
var User = require("./user.jsx");
var CreateForm = require("./create_form.jsx");

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
      return <SignupForm router={this.props.router}/>;
    }
    if (currentRoute === "signin") {
      return <SigninForm router={this.props.router}/>;
    }
    if (currentRoute === "search") {
      return <Search items={this.props.state._searchSchemas}/>;
    }
    if (currentRoute === "schemaController") {
      return <DataPage schemaName={this.props.router.schemaName}
                       schemaCSVData={this.props.state._schemaCSVData}
                       tools={this.props.state._tools}/>;
    }
    if (currentRoute === "user") {
      return <User />;
    }
    if (currentRoute === "create") {
      return <CreateForm router={this.props.router}/>;
    }
    return <div />;
  }
});

module.exports = InterfaceComponent;
