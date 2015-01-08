var bufferUtils = require("../utils/buffer");
var Busboy = require("busboy");
var helpers = require("../config/helpers");
var s3Cache = require("../db/s3Cache");
var schemaMatcher = require("./schemaMatcher");

var ASCII_NEWLINE = 10;

/**
 * Handle uploading entry data
 * @param {Object} request the http ClientRequest object
 * @param {Object} response the http ServerResponse object
 * @param {boolean} appendData If true, appends data to existing entry. If false, overwrites any
 * existing entry.
 */
var handleUpload = function(request, response, appendData) {
  var uploadFunction = appendData ? "appendEntry" : "createEntry";
  var schemaName = request.params.schemaName;
  var userID = request.currentUser;
  var busboy = new Busboy({headers: request.headers});
  busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
    if (!filename) { return; }
    file.fileRead = [];
    file.on("data", function(data) {
      this.fileRead.push(data);
    });
    file.on("end", function() {
      var buffer = Buffer.concat(this.fileRead);
      var lineBreak = bufferUtils.indexOf(buffer, ASCII_NEWLINE) + 1;
      var header = buffer.slice(0, lineBreak);
      var data = buffer.slice(lineBreak);
      schemaMatcher.handle(header, function(error, isValid) {
        if (error) {
          console.error("error validating entry:", error);
          helpers.errorHandler({message: error}, request, response);
        } else if (isValid) {
          s3Cache[uploadFunction](schemaName, userID, data, function(error) {
            if (error) {
              console.error("error uploading entry:", error);
            } else {
              console.log("successfully created", filename);
            }
            helpers.endFormParse(response);
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

  request.pipe(busboy);
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
    handleUpload(request, response, false);
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
   * @param {Object} response the http ServerResponse object
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
    var callback = helpers.getAWSCallbackHandler(request, response);
    s3Cache.getEntriesMetadataForSchema(schemaName, callback);
  },

  /* UPDATE requests */

  /**
   * Append data to an existing entry.
   * @param {Object} request the http ClientRequest object
   * @param {Object} response the http ServerResponse object
   */
  appendEntry: function(request, response) {
    handleUpload(request, response, true);
  }

  /* DELETE requests */

  // use the AWS console instead
};
