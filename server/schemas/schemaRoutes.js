var schemaController = require("./schemaController");

module.exports = function(router) {
  router.get("/", schemaController.getSchemaNames);
  router.get("/:schemaName", schemaController.getEntriesMetadataForSchema);
  router.get("/:schemaName/:userID", schemaController.getData);

  router.post("/:schemaName", schemaController.createSchema);
  router.post("/:schemaName/:userID", schemaController.createEntry);
};
