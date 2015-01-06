var React = require("react");
var AppStore = require("../store/app_store");

var Chart = React.createClass({
  componentDidMount: function() {
    AppStore.getVisualizationData(this.props.schemaName,
      AppStore.generateChart
    );
  },
  render: function() {
    return (
      <div className="visualization-view"></div>
    );
  }
});

module.exports = Chart;
