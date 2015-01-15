var React = require("react");
var AppStore = require("../store/app_store");
var c3 = require("c3");
var _ = require("lodash");
var stats = require("simple-statistics");

var Chart = React.createClass({
  componentDidMount: function() {
    Chart.renderVisualization(this.props.chartType, this.props.csvData, this.props.activeHeader, this.props.schemaName);
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
          xArray.push(parseInt(row[xIndex], 10));
          yArray.push(parseInt(row[yIndex], 10));
        });

        return [xArray, yArray];
      };

      var tplot = transformCSVtoScatterPlot(csvData, schemaName, xIndex, yIndex);
      //Remove the header of the scatter plot
      tplot[0].shift();
      tplot[1].shift();
      
      var graphPoints = _.zip(tplot[0], tplot[1]);
      var xs = {};

      var regressionDataLabel = "regression";
      xs[schemaName] = schemaName + "_x"; 
      xs[regressionDataLabel] = regressionDataLabel + "_x";

      var scatterPlotArray = transformCSVtoScatterPlot(csvData, schemaName, xIndex, yIndex);

      var min = Math.min.apply(null, tplot[0]);
      var max = Math.max.apply(null, tplot[0]);
      /* jshint ignore:start */
      var regressionEquation = stats.linear_regression().data(graphPoints).line();
      
      var minRegressionY = regressionEquation(min);
      var maxRegressionY = regressionEquation(max);
      
      scatterPlotArray.push([regressionDataLabel, minRegressionY, maxRegressionY], 
                            [regressionDataLabel + "_x", min, max]);
      /* jshint ignore:end */
      var types = {};
      types[regressionDataLabel] = "line";

      var chart = c3.generate({
        bindto: ".visualization-view",
        data: {
            xs: xs,
            // Data Format:
            // y row ['dataname', num, num, ...]
            // x row ['dataname_x', num, num, ...]
            columns: scatterPlotArray,
            type: "scatter",
            types: types
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
    },
    renderVisualization: function(chartType, csvData, activeHeader, schemaName) {
      if (chartType === "histogram") {
        Chart.renderHistogramChart(csvData, activeHeader);
      } else if (chartType === "timeSeries") {
        Chart.renderTimeSeriesChart(csvData, activeHeader);
      } else if (chartType === "scatterPlot") {
        Chart.renderScatterplotChart(csvData, schemaName, activeHeader, 3);
      }  
    }
  },
  componentWillReceiveProps: function(newProps) {
    Chart.renderVisualization(newProps.chartType, newProps.csvData, newProps.activeHeader, newProps.schemaName);
  },
  render: function() {
    return (
      <div className="visualization-view"></div>
    );
  }
});

module.exports = Chart;
