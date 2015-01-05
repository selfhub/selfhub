var schemaController = require("./schemaController");

module.exports = function(router) {
  router.get("/", schemaController.getSchemaNames);
  router.get("/:schemaName", schemaController.getEntriesMetadataForSchema);
  router.get("/:schemaName/:userID", schemaController.getData);

  router.put("/:schemaName", schemaController.createSchema);
  router.put("/:schemaName/:userID", schemaController.createEntry);

  router.post("/:schemaName/:userID", schemaController.appendEntry);
};
