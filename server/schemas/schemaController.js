var Busboy = require("busboy");
var helpers = require("../config/helpers");
var s3Cache = require("../db/s3Cache");

/**
 * Validate an entry conforms to a schema.
 * @param {string} schemaName the schema name
 * @param {Object} entry the entry buffer
 * @param {Object} callback the callback that handles the validation response
 */
var validateEntry = function(schemaName, entry, callback) {
  // TODO: verify entry conforms to schema (#62)
  callback(null, true);
};

module.exports = {
  /* CREATE requests */

  /**
   * Create a new schema.
   * @param {Object} request the http ClientRequest object
   * @param {Object} response the http ServerResponse object
   */
  createSchema: function(request, response) {
    // TODO: record schema details, not just the name (#61)
    var schemaName = request.params.schemaName;
    s3Cache.createSchema(schemaName, helpers.getAWSCallbackHandler(request, response, 201));
  },

  /**
   * Upload a new schema entry.
   * @param {Object} request the http ClientRequest object
   * @param {Object} response the http ServerResponse object
   */
  createEntry: function(request, response) {
    var schemaName = request.params.schemaName;
    var userID = request.params.userID;
    var busboy = new Busboy({headers: request.headers});
    busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
      if (!filename) { return; }
      file.fileRead = [];
      file.on("data", function(data) {
        this.fileRead.push(data);
      });
      file.on("end", function() {
        var buffer = Buffer.concat(this.fileRead);
        validateEntry(schemaName, buffer, function(error, isValid) {
          if (error) {
            console.error("error validating entry:", error);
          } else if (isValid) {
            s3Cache.createEntry(schemaName, userID, buffer, function(error) {
              if (error) {
                console.error("error uploading entry:", error);
              } else {
                console.log("successfully created", filename);
              }
            });
          }
        });
      });
      file.on("error", function(error) {
        console.error("error while buffering the stream: ", error);
      });
    });
    busboy.on("field", function() {
      helpers.handleBadRequest(response, "field uploads not yet supported");
    });
    busboy.on("finish", function() {
      helpers.endFormParse(response);
    });
    request.pipe(busboy);
  },

  /* READ requests */

  /**
   * Request the list of schema names.
   * @param {Object} request the http ClientRequest object
   * @param {Object} response the http ServerResponse object
   */
  getSchemaNames: function(request, response) {
    s3Cache.getSchemaNames(helpers.getAWSCallbackHandler(request, response));
  },

  /**
   * Request the data for a userID in a schema.
   * @param {Object} request the http ClientRequest object
   * @param {Object} response the htpp ServerResponse object
   */
  getData: function(request, response) {
    var schemaName = request.params.schemaName;
    var userID = request.params.userID;
    s3Cache.getData(schemaName, userID, response);
  },

  /**
   * Request the metadata for the entries of a schema.
   * @param {Object} request the http ClientRequest object
   * @param {Object} response the http ServerResponse object
   */
  getEntriesMetadataForSchema: function(request, response) {
    var schemaName = request.params.schemaName;
    s3Cache.getEntriesMetadataForSchema(schemaName,
      helpers.getAWSCallbackHandler(request, response));
  }

  /* UPDATE requests */

  // TODO: (#92)

  /* DELETE requests */

  // use the AWS console instead
};
