var AzureStorage = require('azure-storage');
var Busboy = require('busboy');
var helpers = require('../config/helpers');
var s3Cache = require('../db/s3Cache');

var blobService = AzureStorage.createBlobService();

module.exports = {
  /* CREATE requests */

  createSchema: function(request, response, next) {
    // TODO: record schema details, not just the name (#61)
    var busboy = new Busboy({headers: request.headers});
    busboy.on('file', function() {
      helpers.handleBadRequest(response, 'cannot create schema from file');
    });
    busboy.on('field', function(key, value) {
      if (key === 'name') {
        // next is called back with error, result, response
        blobService.createContainer(value, next);
      }
    });
    busboy.on('finish', function() {
      helpers.endFormParse(response);
    });
    request.pipe(busboy);
  },
  uploadEntry: function(request, response, next) {
    var busboy = new Busboy({headers: request.headers});
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      // TODO: verify file conforms to schema (#62)
      file.on('data', function(data) {
        // TODO: assign entry to corresponding container (#64)
        // TODO: use username as blob name (#63)
        // we might need to use createBlockBlobFromStream for device uploads
        // next is called back with error, result, response
        blobService.createBlockBlobFromText('testSchema', 'testUser', data,
          data.length, next);
      });
      file.on('end', function() {
        console.log('end of', fieldname);
      });
    });
    busboy.on('field', function() {
      helpers.handleBadRequest(response, 'field uploads not yet supported');
    });
    busboy.on('finish', function() {
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
