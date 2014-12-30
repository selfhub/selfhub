var React = require("react");
var _ = require("lodash");
var reactBootStrap = require("react-bootstrap");

var UploadButton = React.createClass({
  fileHandler: function(event) {
    console.log(this.files);
  },
  componentDidMount: function() {
    var inputElement = document.getElementById("input");
    inputElement.addEventListener("change", this.fileHandler, false);
  },
  render: function() {
    return (
      <div>
        <input type="file" id="input"></input>
      </div>
    );
  }
});

var DownloadButton = React.createClass({
  render: function() {
    return (
      <div class="formbutton">
        <form action={this.props.url} method="get">
          <button type="submit">Download</button>
        </form>
      </div>
    );
  }
});

var TableRows = React.createClass({
    render: function() {
      return (
        <tbody>
          {
            _.map(this.props.rowData, function(row) {
                  return (<tr>
                            {
                              _.map(row, function(rowItem) {
                                return <td>{rowItem}</td>;
                              })
                            }
                          </tr>);
            })
          }
        </tbody>
      );
    }
});

var TableHeadersRow = React.createClass({
    render: function() {
      return (
        <tr>
          {
            _.map(this.props.headerKeys, function(header) {
              return <th>{header}</th>;
            })
          }
        </tr>
      );
    }
});

var Table = React.createClass({
 getInitialState: function() {
  return {
    mockFitBitData: [
      {name: "Brian", miles: 1, month: "feb"},
      {name: "Thomas", miles: 3.4, month: "march"},
      {name: "Zindler", miles: 45, month: "july"},
      {name: "Murphy", miles: 2, month: "jan"}
    ]
  };
 },
 render: function() {
   var Table = reactBootStrap.Table;
   var fitBitData = this.state.mockFitBitData;
   var headerKeys = Object.keys(fitBitData[0]);

   return (
     <Table striped bordered condensed hover>
        <TableHeadersRow headerKeys={headerKeys}/>
        <TableRows rowData={fitBitData}/>
     </Table>
   );
 }
});

module.exports = Table;
