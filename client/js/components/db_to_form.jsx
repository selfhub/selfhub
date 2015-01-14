var React = require("react");
var _ = require("lodash");
var $ = require("jquery");
var router;
var AppStore = require("../store/app_store");
var dataToBuildForm;
var questionArray = [];

var DBtoForm = React.createClass ({
  componentDidMount: function() {
    console.log("dbtoform mounted");
  },

  componentWillMount: function() {
    getDataToBuildForm();
  },

  getDataToBuildForm: function() {
    var formTitle = "Ex form title";
    formTitle = formTitle.split(" ").join("_");
    $.ajax({
      url: "/api/schema/template" + formTitle,
      type:"GET",
      beforeSend: function(request) {
        request.setRequestHeader("x-jwt", localStorage.getItem("token"));
      },
      success: function(data) {
        console.log("Successful GET request");
        console.log("DATA:: ", data);
        this.dataToBuildForm = data;
        router.navigate("/", {trigger: true});
      },
      error: function(error) {
        console.error(error);
      }
    });
  },

  render: function() {
    return (
      <div>
      {dataToBuildFormfunction}
      </div>
      );
  }
});

module.exports= DBtoForm;