var React = require("react");
var $ = require("jquery");

var SigninForm = React.createClass({ 
  getInitialState: function() {
    return {
      submitted: false      
    };
  },

  handleSubmit: function(event) {
    event.preventDefault();
    var userData = this.getFormData();
    $.ajax({
      url: "/user/signin",
      type:"POST",
      dataType: "json",
      data: userData,
      success: function(data) {
        console.log("success: next step, save userData to state in the store");
        },
      error: function(error) {
        console.error(error);
        }
    });
  },


  getFormData: function() {
    var data = {};
    var keys = ["username", "password"];
    var refs = this.refs;
    keys.forEach(function(key){
      data[key]=refs[key].getDOMNode().value;
    });
    return data;
  },

  render: function() {
    return (
      <div>
        <form className="LoginForm" onSubmit={this.handleSubmit}>
          Username*: <input type="text"
                      ref="username"/>
          <br />
            Password*: <input type="password"
                      ref="password"/>
          <br />
            <input type="submit" value="Login"/>
          <br />
        </form>
      </div>
    );
  } 
});

module.exports = SigninForm;
