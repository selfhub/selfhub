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

/**
 * schemaModel Operations
 * @module server/schemas/schemaModel
 * @type {{model: Object, createTemplate: Function, findSchema: Function, getSchema: Function}}
 */
module.exports = {
  model: Model,

/**
 * createTemplate create a new schema
 * @param  {Object} request the http ClientRequest object
 * @param  {Object} response the http ServerResponse object
 * @param  {Function} next to be called
 */
  createTemplate: function(request, response, next) {
    var error;
    var newSchema = {
      name: request.body.name,
      metaData: request.body.metaData,
      data: request.body.data
    };

    Model.findOneAsync({name: newSchema.name})
      .then(function(schema) {
        if (!schema) {
          return Model.createAsync(newSchema)
          .then(function(schema) {
            next(false, schema);
          });
        }
        next({message: "Schema with that name already exists"}, false);
      })
      .catch(function(error) {
        next(error, false);
      });
  },

  /**
   * findSchema accepts a query object, a stream, and a storage object. It then attempts
   *  to find a matching schema using the query,
   * stores the template on the storage (if found), and emits the proper event on the stream.
   * @param  {Object} query object from which it constructs a mongoose query.
   * @param  {Object} stream object which is parsing csv headers.
   * @param  {Object} storage object which is passed the schema on success.
   */
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

  /**
   * getSchema returns the schema template.
   * @param  {String} Schema name to inject
   * @param  {Function} Callback to call later
   */
  getSchema: function(schemaName, callback) {
    Model.findOne({name: schemaName}, callback);
  }
};
