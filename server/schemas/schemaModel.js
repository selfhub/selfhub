var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schemaSchema = new Schema({
  metaData: Schema.Types.Mixed,
  data: Schema.Types.Mixed
});

module.exports = mongoose.model("schema", schemaSchema);
