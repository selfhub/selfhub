var csv = require("csv");
var Readable = require("stream").Readable;
var schemaModel = require("./schemaModel");
var helpers = require("../config/helpers");

var handle = function(buffer, callback) {
  var stringifier = new csv.stringify();
  var parser = new csv.parse();
  var rs = new Readable({objectMode: true});
  var validEntry = true;
  var storage = {};
  var columns;

//turns an array into a query which can be sent to mongoDB
//via mongoose in order to find a schema template with the same fields.
  var queryBuilder = function(array) {
    var obj = {};
    for (var i = 0; i < array.length; i++) {
      //true is a placeholder value.
      obj[array[i].toString()] = true;
    }
    //if the object is empty, the query would return all schemas. Therefore, we intercept this case
    //and return false instead.
    if (Object.keys(obj).length === 0) {
      return false;
    }
    var result = {};
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        result["data." + prop] = {
          $exists: true
        };
      }
    }
    return result;
  };

//We must define an internal _read function for our readable stream
//that pulls data from the incoming file.
  rs._read = function() {
//buffer refers to the incoming data.
    rs.push(buffer);
    rs.push("\n");
    rs.push(null);
  };

//When our parsed data becomes available, we take the first line (the headers)
//We then build a query from them and make a call to mongo to find a matching schema
  parser.on("readable", function() {
    if (!columns) {
      columns = parser.read();
      var query = queryBuilder(columns);
      if (query) {
        schemaModel.findSchema(query, this, storage);
      } else {
        callback("data must have headers", false);
      }
    }
  });

//Once a template is found, the parser 'templated' event fires.
//Then we execute the callback, indicating there is no error and we have found a schema template.
  parser.once("templated", function() {
    console.log("matching template found:", storage.template);
    callback(null, true);
  });

//If a template is not found, we execute the callback with an error and 'false',
//indicating that there was no matching schema template.
  parser.on("noTemplate", function() {
    var error = {message: "Failed to find a matching template"};
    this.end();
    callback(error.message, false);
  });

  rs.pipe(parser);
};

module.exports = {
  handle: handle
};
