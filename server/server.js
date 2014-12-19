var express = require('express');
var mongoose = require('mongoose');

var app = express();

//server will shut down if this process isn't found (good for now, b/c we don't want it to work without user authentication)
//we may later revisit this to support a 'public only' mode, should the server start without the user db.
var mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI);

require('./config/middleware.js')(app, express);

module.exports = app;
