var React = require("react");
var _ = require("lodash");
var reactBootStrap = require("react-bootstrap");
var AppStore = require("../store/app_store");

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
      <div>
        <input type="file" id="input"></input>
      </div>
    );
  }
});

var DownloadButton = React.createClass({
  render: function() {
    return (
      <div className="formbutton">
        <a href={this.props.url} download={this.props.name} type="submit">Download</a>
      </div>
    );
  }
});

var TableRows = React.createClass({
  render: function() {
    var schemaName = this.props.schemaName;
    return (
      <tbody>
        {
          _.map(this.props.rowData, function(row) {
            return (
              <tr>
                {
                  _.map(row, function(rowItem) {
                    return <td>{rowItem}</td>;
                  })
                }
                <td>
                  <DownloadButton name={row.userID}
                    url={"api/schema/" + schemaName + "/" + row.userID + "/" + localStorage.getItem("token")}/>
                </td>
              </tr>
            );
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
        <th>Download</th>
      </tr>
    );
  }
});

var Table = React.createClass({
  componentDidMount: function() {
    AppStore.renderSchema(this.props.schemaName);
  },
  render: function() {
    var Table = reactBootStrap.Table;
    var rows = this.props.displaySchema;
    if (rows && _.isObject(rows[0])) {
      var headerKeys = Object.keys(rows[0]);
      return (
        <div className="data-page">
          <aside className="tools">
            <input className="data-search" placeholder="Search schemas" type="text"/>
          </aside>
          <section className="viz-and-table-views">
            <div className="visualization-view">Chart goes here</div>
            <div className="table-view">
              <Table striped bordered condensed hover>
                <TableHeadersRow headerKeys={headerKeys}/>
                <TableRows schemaName={this.props.schemaName} rowData={rows}/>
              </Table>
              <UploadButton schemaName={this.props.schemaName}/>
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
