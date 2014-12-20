var React = require("react");
var LoginForm = React.createClass({ 
  getInitialState: function() {
    return {
      submitted: false
      
    };
  },

  handleSubmit: function(event){
      //send getFormData to database; callback will set this.state.submitted to true and if successful and render user 
      //dash or callback will keep this.state.submitted at false and render error message
      event.preventDefault();
      console.log("getFormdata", this.getFormData());
  },

  getFormData: function() {
    var data = {};
    data.username = this.refs.username.getDOMNode().value;
    data.password= this.refs.password.getDOMNode().value;
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
React.render(
  <LoginForm />,
  document.getElementById("content")
);

module.exports = LoginForm;
