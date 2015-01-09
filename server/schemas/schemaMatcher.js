var csv = require("csv");
var Readable = require("stream").Readable;
var schemaModel = require("./schemaModel");
var helpers = require("../config/helpers");

var handle = function(buffer, callback) {
  var parser = new csv.parse();
  var readStream = new Readable({objectMode: true});
  var validEntry = true;
  var storage = {};

  //turns an array into a query which can be sent to mongoDB
  //via mongoose in order to find a schema template with the same fields.
  var queryBuilder = function(columnsArray) {
    var result = {};
    //if the object is empty, the query would return all schemas.
    //Therefore, we intercept this case and return false instead.
    if (columnsArray.length === 0) {
      return false;
    }
    for (var i = 0; i < columnsArray.length; i++) {
      result["data." + columnsArray[i].toString()] = {
        $exists: true
      };
    }
    return result;
  };

  //We must define an internal _read function for our readable stream
  //that pulls data from the incoming file.
  readStream._read = function() {
  //buffer refers to the incoming data.
    this.push(buffer);
    this.push(null);
  };

  //When our parsed data becomes available, we take the first line (the headers)
  //We then build a query from them and make a call to mongo to find a matching schema
  parser.on("readable", function() {
    var query = queryBuilder(parser.read());
    if (query) {
      schemaModel.findSchema(query, this, storage);
    } else {
      callback("data must have headers", false);
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
    callback(error.message, false);
  });

  readStream.pipe(parser);
};

module.exports = {
  handle: handle
};
