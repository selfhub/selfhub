var schemaController = require('./schemaController');

module.exports = function(router) {
  router.post('/create', schemaController.createSchema);
  router.post('/upload', schemaController.uploadEntry);
};
