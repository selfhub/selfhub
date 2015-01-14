var mongoose = require("mongoose");
var bluebird = require("bluebird");
var helpers = require("../config/helpers");
var Schema = mongoose.Schema;
var schemaSchema = new Schema({
  name: String,
  metaData: Schema.Types.Mixed,
  data: Schema.Types.Mixed
});
var Model = mongoose.model("schema", schemaSchema);

bluebird.promisifyAll(Model);

module.exports = {
  model: Model,

  createTemplate: function(request, response, next) {
    var error;
    var newSchema = request.body.schema;
    if (!newSchema.name) {
      error = {message: "Invalid schema name!"};
      next(error, false);
      return;
    }
    Model.findOneAsync({name: newSchema.name})
      .then(function(schema) {
        //enable the following log statement for troubleshooting purposes
        //console.debug("findOneAsync args:", arguments);
        if (schema) {
          error = {message: "Schema already exists"};
          next(error, false);
        } else {
          return Model.createAsync({
            name: newSchema.name,
            metaData: newSchema.metaData,
            data: newSchema.data
          })
          .then(function(schema) {
            next(false, schema);
          });
        }
      })
      .catch(function(error) {
        next(error, false);
      });
  },

  //findSchema accepts a query object, a stream, and a storage object.
  //It then attempts to find a matching schema using the query,
  //stores the template on the storage (if found), and emits the proper event on the stream.
  findSchema: function(query, stream, storage) {
    var error;
    Model.findOneAsync(query)
      .then(function(schema) {
        if (schema) {
          storage.template = schema;
          stream.emit("templated");
        } else {
          stream.emit("noTemplate");
        }
      })
      .catch(function(error) {
        console.error("hit error", error);
      });
  },

  fetchSchema: function(schemaName, callback) {
    Model.findOne({name: schemaName}, callback);
  }
};
