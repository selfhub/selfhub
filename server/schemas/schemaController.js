var AzureStorage = require('azure-storage');
var Busboy = require('busboy');
var helpers = require('../config/helpers');

var blobService = AzureStorage.createBlobService();

module.exports = {
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
  }
};
