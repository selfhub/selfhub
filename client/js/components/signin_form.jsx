var React = require("react");
var $ = require("jquery");
var AppStore = require("../store/app_store.js");

var SigninForm = React.createClass({ 
  
  componentWillMount: function(){
    this.formDataKeys = ["username", "password"];
  },
  
  handleSubmit: function(event) {
    event.preventDefault();
    var userData = AppStore.getFormData(this.formDataKeys);
    $.ajax({
      url: "/user/signin",
      type:"POST",
      dataType: "json",
      data: userData,
      success: function(data) {
        console.log("Successful Post to /signin");
        },
      error: function(error) {
        console.error(error);
        }
    });
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
