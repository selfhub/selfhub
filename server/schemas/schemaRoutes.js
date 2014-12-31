var schemaController = require('./schemaController');

module.exports = function(router) {
  router.get('/', schemaController.getSchemaNames);
  router.get('/:schemaName', schemaController.getEntriesMetadataForSchema);
  router.get('/:schemaName/:userID', schemaController.getData);

  router.post('/create', schemaController.createSchema);
  router.post('/upload', schemaController.uploadEntry);
};
