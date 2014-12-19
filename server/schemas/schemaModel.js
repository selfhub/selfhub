var mongoose = require('mongoose');

var schemaSchema = new mongoose.Schema({
  metaData: Schema.Types.Mixed,
  data: Schema.Types.Mixed
});

module.exports = mongoose.model('schema', schemaSchema);
