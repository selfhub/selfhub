var React = require("react");
var c3 = require("c3");

var User = React.createClass({
  componentDidMount: function() {
    var chart = c3.generate({
      bindto: ".contribution-grade",
      data: {
        columns: [["data", 0]],
        type: "gauge",
        onclick: function(data, index) {
          console.log("onclick", data, index);
        },
        onmouseover: function(data, index) {
          console.log("onmouseover", data, index);
        },
        onmouseout: function(data, index) {
          console.log("onmouseout", data, index);
        }
      },
      gauge: {
        label: {
          format: function(value, ratio) {
            return value;
          },
          show: true
        },
        // TODO: replace hard-coded values with actual user data (#180)
        min: 0,
        max: 6,
        units: "schemas",
        width: 39
      },
      color: {
        pattern: ["#FF0000", "#F97600", "#F6C600", "#60B044"],
        threshold: {
          unit: "value"
        }
      },
      size: {
        height: 150
      }
    });

    var CHART_LOAD_TIME = 500;
    setTimeout(function() {
      chart.load({
        // TODO: replace hard-coded values with actual user data (#180)
        columns: [["data", 4]]
      });
    }, CHART_LOAD_TIME);
  },
  render: function() {
    return (
      <div className="my-data-page">
        <section className="contribution">
          <h2 className="user-welcome">Welcome back!</h2>
          <p>Your contribution grade for the week so far:</p>
          <div className="contribution-grade"></div>
        </section>
        <section className="following">
          <ul className="following-schemas-list">
            <li className="search-schema">
              <a className="search-schema-label">Fitbit</a>
              <div className="contributor-count">Contributors: 100</div>
            </li>
          </ul>
        </section>
        <section className="csv-uploads">
        </section>
      </div>
    );
  }
});

module.exports = User;
