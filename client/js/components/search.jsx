var React = require("react");

var Search = React.createClass({
  getInitialState: function() {
    return {searchString: ""};
  },
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
    return (
      <div className={"search-block"}>
        <input className={"main-search"} type="text" value={this.state.searchString}
               onChange={this.handleChange} placeholder="search for a schema" />
        <ul className={"search-results"}>
          {
            schemas.map(function(el) {
              return <li><a href={el.route}>{el.name}</a></li>;
            })
          }
        </ul>
      </div>
    );
  }
});

module.exports = Search;
