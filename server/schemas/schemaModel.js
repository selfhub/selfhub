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
      helpers.errorHandler(error, request, response, next);
      return;
    }
    Model.findOneAsync({name: newSchema.name})
      .then(function(schema) {
        //enable the following log statement for troubleshooting purposes
        //console.debug("findOneAsync args:", arguments);
        if (schema) {
          error = {message: "Schema already exists"};
          helpers.errorHandler(error, request, response, next);
          return;
        } else {
          Model.createAsync({
            name: newSchema.name,
            metaData: newSchema.metaData,
            data: newSchema.data
          })
          .then(function(schema) {
            response.status(201).send({message: "Schema created!"});
          })
          .catch(function(error) {
            helpers.errorHandler(error, request, response, next);
            return;
          });
        }
      })
      .catch(function(error) {
        helpers.errorHandler(error, request, response, next);
        return;
      });
  }
};
