var React = require("react");
var $ = require("jquery");
var AppStore = require("../store/app_store.js");
var router;

var SigninForm = React.createClass({ 
  
  componentWillMount: function(){
    this.formDataKeys = ["username", "password"];
    router = this.props.router;
  },
  
  handleSubmit: function(event) {
    event.preventDefault();
    var userData = AppStore.getFormData(this.formDataKeys, this.refs);
    var userToken = localStorage.getItem("token");
    $.ajax({
      url: "/user/signin",
      type:"POST",
      dataType: "json",
      data: userData,
      success: function(data) {
        localStorage.setItem("token", data.token);
        router.navigate("/", {trigger: true});
        AppStore.emitChange();
        },
      error: function(error) {
        console.error(error);
        }
    });
  },

//'x-jwt' for header request
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
