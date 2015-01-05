var React = require("react");
var AppStore = require("../store/app_store");

var Search = React.createClass({
  getInitialState: function() {
    return {searchString: ""};
  },
  componentDidMount: AppStore.fetchSchemas,
  handleChange: function(event) {
    this.setState({searchString: event.target.value});
  },
  render: function() {
    var schemas = this.props.items;
    var searchString = this.state.searchString.trim().toLowerCase();
    // filter the results
    if (searchString) {
      schemas = schemas.filter(function(el) {
        return el.name.toLowerCase().match(searchString);
      });
    }
    // TODO: replace dummy row/column/contributor data in search results (#150)
    return (
      <div className={"search-block"}>
        <input className={"main-search"} type="text" value={this.state.searchString}
               onChange={this.handleChange} placeholder="search for a schema" />
        <ul className={"search-results"}>
          {
            schemas.map(function(el) {
              return (
                <li className="search-schema">
                  <a className="search-schema-label" href={"#/schema/" + el.route}>
                    {el.name}
                  </a>
                  <div className="contributor-count">Contributors: 100</div>
                  <div className="search-schema-info-block">
                    <p className="search-schema-description">This is a dummy description.</p>
                    <div className="search-schema-stats">
                      <div className="search-schema-rows">Rows: 1000</div>
                      <div className="search-schema-columns">Columns: 10</div>
                    </div>
                  </div>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
});

module.exports = Search;
