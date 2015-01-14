var schemaController = require("./schemaController");

module.exports = function(router) {
  router.get("/", schemaController.getSchemaNames);
  router.get("/:schemaName", schemaController.getTemplate);
  router.get("/:schemaName/:userID", schemaController.getData);
  /*
  This is route is specifically for the download button.
  Download requests don't let you set custom headers
  so the jwt token has to be sent via url.
  */
  router.get("/:schemaName/:userID/:token", schemaController.getData);

  router.put("/:schemaName", schemaController.createSchema);
  router.put("/:schemaName/:userID", schemaController.createEntry);

  router.post("/:schemaName/:userID", schemaController.appendEntry);
};
