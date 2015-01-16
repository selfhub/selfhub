var React = require("react");
var _ = require("lodash");
var $ = require("jquery");
var AppStore = require("../store/app_store");
var Chart = require("./chart.jsx");
var CSV = require("babyparse");
var stats = require("simple-statistics");

var UploadButton = React.createClass({
  componentDidMount: function() {
    var schemaName = this.props.schemaName;
    function fileHandler() {
      var file = this.files.item(0);
      AppStore.uploadData(file.name, file, schemaName);
    }

    var inputElement = document.getElementById("input");
    inputElement.addEventListener("change", fileHandler, false);
  },
  render: function() {
    return (
      <div className="upload-button">
        <span id="input">Upload .csv</span>
        <input className="upload" type="file"></input>
      </div>
    );
  }
});

var DownloadButton = React.createClass({
  render: function() {
    return (
      <div className="download-button">
        <a href={this.props.url} download={this.props.name}
           type="submit"><div>Download All</div></a>
      </div>
    );
  }
});

var TableRows = React.createClass({
  statics: {
    getRowClass: function(index) {
      return index % 2 === 0 ? "even-row" : "odd-row";
    },
    getColumnClass: function(index) {
      return index % 2 === 0 ? "even-column" : "odd-column";
    }
  },
  render: function() {
    return (
      <tbody className="table-rows">
        {
          _.map(this.props.rowData, function(row, index) {
            return (
              <tr className={TableRows.getRowClass(index)} key={index}>
                {
                  _.map(row, function(rowItem, index) {
                    return <td className={TableRows.getColumnClass(index)} key={index}>
                      <div>{rowItem}</div></td>;
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    );
  }
});

var TableHeadersRow = React.createClass({
  componentDidMount: function() {
    var schemaCSVData = this.props.schemaCSVData;
    var that = this;
    function renderCSVHeader() {
      that.props.setActiveHeader(this.id);
    }
    var tableHeaders = document.getElementsByClassName("csv-header");
    _.map(tableHeaders, function(header, index) {
      if (index > 1) {
        header.addEventListener("click", renderCSVHeader, false);
      }
    });
  },
  statics: {
    getHeaderClass: function(index) {
      return index % 2 === 0 ? "even-header csv-header" : "odd-header csv-header";
    }
  },
  render: function() {
    return (
      <tr className="table-headers">
        {
          _.map(this.props.headerKeys, function(header, index) {
              return <th id={index} key={index}
                className={TableHeadersRow.getHeaderClass(index)}>{header}</th>;
          })
        }
      </tr>
    );
  }
});

var Table = React.createClass({
  getInitialState: function() {
    return {
      activeHeader: 2,
      chartType: "timeSeries"
    };
  },

  statics: {
    getToolset: function(chartType, headerlessCSV, headerIndex) {

      var columnArray = headerlessCSV.map(function(row) {
        return parseInt(row[headerIndex], 10);
      });

      var toolset = {
        Mean: Math.floor(stats.mean(columnArray)),
        Median: Math.floor(stats.median(columnArray)),
        Mode: Math.floor(stats.mode(columnArray)),
      };

      return toolset;
    }
  },

  componentDidMount: function() {
    var that = this;

    /*
      Eventually the server will batch together all the csv's into one file using hadoop.
      For now I am just getting one users file.
    */
    var getSchema = function(schemaName, callback) {
      $.ajax({
        url: "/api/schema/" + schemaName + "/entriesMetadata",
        type: "GET",
        beforeSend: function(request) {
          request.setRequestHeader("x-jwt", localStorage.getItem("token"));
        },
        success: function(schemaData) {
          callback(schemaData);
        },
        error: function(error) {
          console.error(error);
        }
      });
    };
    var schemaName = this.props.schemaName;

    getSchema(schemaName, function(schemaData) {
      $.ajax({
        url: "/api/schema/" + schemaName + "/userID/" + schemaData[0].userID,
        type: "GET",
        beforeSend: function(request) {
          request.setRequestHeader("x-jwt", localStorage.getItem("token"));
        },
        success: function(data) {
          var parsedCSV = CSV.parse(data);
          AppStore.updateCSVData(parsedCSV.data);

          AppStore.addTools(Table.getToolset(that.state.chartType, _.rest(parsedCSV.data), that.state.activeHeader));
        },
        error: function() {
          console.error("GET request for schema data failed.");
        }
      });
    });

    //TODO: Make an array of chart names, and map over it to apply events (185)
    var chartEvents = [
      ["#to-time-series", "timeSeries"],
      ["#to-histogram", "histogram"],
      ["#to-scatter-plot", "scatterPlot"]
    ];

    chartEvents.forEach(function(chartEvent){
      var chartID = chartEvent[0];
      var chartType = chartEvent[1];

      $(document).on("click", chartID, function() {
        that.setState({chartType: chartType});
      });
    });

  },
  componentWillUnmount: function() {
    $(document).off("click", "#to-time-series");
    $(document).off("click", "#to-histogram");
    $(document).off("click", "#to-scatter-plot");
  },
  render: function() {
    var that = this;
    var setActiveHeader = function(newHeaderIndex) {
      var headerlessCSV = _.rest(that.props.schemaCSVData);
      that.setState({activeHeader: newHeaderIndex});
      AppStore.addTools(Table.getToolset(that.state.chartType, headerlessCSV, that.state.activeHeader));
    };
    var rows = this.props.schemaCSVData;
    if (rows && Array.isArray(rows[0])) {
      var headerKeys = rows[0].map(function(row) {
        return AppStore.formatCSVHeader(row);
      });
      return (
        <div className="data-page">
          <aside className="tools">
            <input className="data-search" placeholder="Search schemas" type="text"/>
            <section className="analysis-dashboard">
              <ul className="select-chart">Visualizations
                <li id="to-time-series">Time Series</li>
                <li id="to-histogram">Histogram</li>
                <li id="to-scatter-plot">Scatter Plot</li>
              </ul>
              <ul className="analysis-tools">Analysis Tools
                {
                  _.map(this.props.tools, function(val, key) {
                    return <li>{key}: {val}</li>;
                  })
                }
              </ul>
            </section>
          </aside>
          <section className="viz-and-table-views">
            <div className="visualization-block">
              <div className="visualization-label">{this.props.schemaName}</div>
              <UploadButton schemaName={this.props.schemaName}/>
              <DownloadButton />
              <Chart schemaName={this.props.schemaName}
                     csvData={this.props.schemaCSVData}
                     activeHeader={this.state.activeHeader}
                     chartType={this.state.chartType}/>
            </div>
            <div className="table-view">
              <table className="schema-csv-table">
                <TableHeadersRow schemaCSVData={this.props.schemaCSVData}
                                 headerKeys={headerKeys}
                                 setActiveHeader={setActiveHeader}/>
                <TableRows rowData={_.rest(rows)}/>
              </table>
            </div>
          </section>
        </div>
      );
    } else {
      return <div/>;
    }
  }
});

module.exports = Table;
