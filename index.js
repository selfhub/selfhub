require("dotenv").load();
var app = require("./server/server.js");

var port = process.env.port || 8000;

app.listen(port);
