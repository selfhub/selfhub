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
      <div className="table-frame">
        <div className="table-cell">

          <div className="signin-block">

            <div className="signin-block-header">
              <h2 className="signin-block-title">Signin</h2>
              <a href="#/signup" className="signin-block-signup">&#10095; Signup</a>
            </div>

            <form className="signin-form" onSubmit={this.handleSubmit}>
              <div className="signin-form-inputs">

                <div className="user-block">
                  <span className="user-icon">
                    <i className="fa fa-user" />
                  </span>
                  <input placeholder="Username*" className="input form-username"
                         type="text" ref="username"/>
                </div>

                <div className="password-block">
                  <span className="password-icon">
                    <i className="fa fa-key"></i>
                  </span>
                  <input placeholder="Password*" className="input form-password"
                         id="trailing-space" type="password" ref="password"/>
                  <input className="signin-submit-button" type="submit" value="Submit"/>
                </div>

              </div>
            </form>

          </div>

        </div>
      </div>
    );
  }
});

module.exports = SigninForm;
