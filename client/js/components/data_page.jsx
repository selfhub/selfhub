var React = require('react');
var _ = require('underscore');
var reactBS = require('react-bootstrap');

var Table = React.createClass({
 getInitialState: function() {
  return {
    mockFitBitData: [
      {name: 'Brian', miles: 1, month: 'feb'},
      {name: 'Thomas', miles: 3.4, month: 'march'},
      {name: 'Zindler', miles: 45, month: 'july'},
      {name: 'Murphy', miles: 2, month: 'jan'}
    ]
  };
 },
 componentDidMount: function() {

 },
 componentWillUnmount: function() {
   
 },
 render: function() {
   var createHeader = function(keys) {
      return <tr> {_.map(keys, function(key) {
        return <th> {key} </th>;
      })} </tr>;
   };
   var createItem = function(itemText) {
     return <td>{itemText}</td>;
   };
   var createRow = function(row) {
     return <tr> {_.map(row, createItem)} </tr>;
   };
   console.log(reactBS);
   var Table = reactBS.Table;
   return (
     <Table striped bordered condensed hover>
       {createHeader(Object.keys(this.state.mockFitBitData[0]))}
       {this.state.mockFitBitData.map(createRow)}
     </Table>
   );
 }
});

module.exports = Table;