var React = require("react");
var Search = require("./search.jsx");
var SignupForm = require("./signup_form.jsx");
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
    if (this.props.router.current === "signup") {
      return <SignupForm />;
    }
    if (this.props.router.current === "search") {
      return <Search items={this.props.state._searchSchemas}/>;
    }
    if (this.props.router.current === "schema") {
      return <DataPage/>;
    }
    return <div />;
  }
});

module.exports = InterfaceComponent;
