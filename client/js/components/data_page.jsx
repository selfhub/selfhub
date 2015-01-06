var React = require("react");
var _ = require("lodash");
var $ = require("jquery");
var AppStore = require("../store/app_store");
var Chart = require("./chart.jsx");

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
  componentDidMount: function() {
    AppStore.renderSchema(this.props.schemaName);
    //TODO: Make an array of chart names, and map over it to apply events (185)
    var that = this;
    function toTimeSeries() {
      that.setState({chartType: "timeSeries"});
    }
    function toHistogram() {
      that.setState({chartType: "histogram"});
    }
    function toScatterplot() {
      that.setState({chartType: "scatterPlot"});
    }
    $(document).on("click", "#to-time-series", toTimeSeries);
    $(document).on("click", "#to-histogram", toHistogram);
    $(document).on("click", "#to-scatter-plot", toScatterplot);
  },
  render: function() {
    var that = this;
    var setActiveHeader = function(newHeaderIndex) {
      that.setState({activeHeader: newHeaderIndex});
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
                <li>Mean</li>
                <li>Median</li>
                <li>Mode</li>
                <li>Range</li>
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
