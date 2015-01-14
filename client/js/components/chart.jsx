var React = require("react");
var AppStore = require("../store/app_store");
var c3 = require("c3");
var _ = require("lodash");

var Chart = React.createClass({
  componentDidMount: function() {
    AppStore.renderSchema(this.props.schemaName);
  },
  statics: {
    renderTimeSeriesChart: function(table, headerIndex) {
      headerIndex = headerIndex || 2;

      if (Array.isArray(table) && Array.isArray(table[0])) {
        var csvHeader = AppStore.formatCSVHeader(table[0][headerIndex]);
        var _schemaCSVData = [csvHeader];

        for (var i = 1; i < table.length - 1; i++) {
          _schemaCSVData.push(table[i][headerIndex]);
        }

        c3.generate({
          bindto: ".visualization-view",
          data: {
            columns: [_schemaCSVData]
           },
          axis: {
            y: {
              label: {
                text: csvHeader,
                position: "outer-middle"
              }
            },
            x: {
              show: true,
              label: {
                text: "Time",
                position: "outer-middle"
              }
            }
          }
        });
      }
    },
    renderHistogramChart: function(csvData, headerIndex) {
      headerIndex = headerIndex || 2;
      var transformHistogramData = function(csvData, headerIndex, bucketSize) {
        var header = csvData[0][headerIndex];
        var sortedDataPoints = _.sortBy(_.rest(csvData), function(row) { return parseInt(row[headerIndex], 10); });
        var firstPoint = sortedDataPoints[0][headerIndex];
        var lastPoint = _.last(sortedDataPoints)[headerIndex];

        var buckets = _.range(firstPoint, lastPoint, bucketSize);
        var pointIndex = 0;
        var currentDataPoint;

        return _.reduce(buckets, function(accum, bucket, index) {
          accum.push(0);
          currentDataPoint = sortedDataPoints[pointIndex][headerIndex];
          while(currentDataPoint !== undefined  && currentDataPoint < bucket) {
            accum[index] += 1;
            pointIndex += 1;
            currentDataPoint = sortedDataPoints[pointIndex][headerIndex];
          }

          return accum;
        }, [header]);
      };

      if (Array.isArray(csvData) && Array.isArray(csvData[0])) {
        c3.generate({
          bindto: ".visualization-view",
          data: {
            columns: [transformHistogramData(csvData, headerIndex, 5)],
            type: "bar"
          },
          bar: {
            width: {
              ratio: 1
            }
          }
        });
      }
    },
    renderScatterplotChart: function(csvData, schemaName, xIndex, yIndex) {
      var headers = _.first(csvData);

      var transformCSVtoScatterPlot = function(csvData, schemaName, xIndex, yIndex) {
        var nonHeaderData = _.rest(csvData);

        var xArray = [schemaName + "_x"];
        var yArray = [schemaName];

        _.each(nonHeaderData, function(row) {
          xArray.push(row[xIndex]);
          yArray.push(row[yIndex]);
        });

        return [xArray, yArray];
      };

      var tplot = transformCSVtoScatterPlot(csvData, schemaName, xIndex, yIndex);
      var xs = {};
      xs[schemaName] = schemaName + "_x";

      var chart = c3.generate({
        bindto: ".visualization-view",
        data: {
            xs: xs,
            // Data Format:
            // y row ['dataname', num, num, ...]
            // x row ['dataname_x', num, num, ...]
            columns: transformCSVtoScatterPlot(csvData, schemaName, xIndex, yIndex),
            type: "scatter"
        },
        axis: {
            x: {
                label: headers[xIndex],
                tick: {
                  fit: false
                }
            },
            y: {
                label: headers[yIndex]
            }
        }
      });
    }
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.chartType === "histogram") {
      Chart.renderHistogramChart(newProps.csvData, newProps.activeHeader);
    } else if (newProps.chartType === "timeSeries") {
      Chart.renderTimeSeriesChart(newProps.csvData, newProps.activeHeader);
    } else if (newProps.chartType === "scatterPlot") {
      Chart.renderScatterplotChart(newProps.csvData, newProps.schemaName, newProps.activeHeader, 3);
    }
  },
  render: function() {
    return (
      <div className="visualization-view"></div>
    );
  }
});

module.exports = Chart;
