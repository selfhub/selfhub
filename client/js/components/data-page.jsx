var React = require('react');

var Table = React.createClass({
 getInitialState: function() {
  return {
    headers: ["Fitbit", "Final Date", "Grade"], 
    body: [
      ["Science", "10/13/98", "B-"], 
      ["Math", "10/15/98", "C+"], 
      ["Computer Science", "10/8/98", "D"]
    ]
  };
 },
 componentDidMount: function() {
   
 },
 componentWillUnmount: function() {
   
 },
 render: function() {
   var createItem = function(itemText) {
     return <td>{itemText}</td>;
   };

   var createRow = function(row) {
     return <tr> {row.map(createItem)} </tr>;
   };

   return (
     <table>
       {this.state.body.map(createRow)}
     </table>
   );
 }
});

module.exports = Table;