var express = require('express');
var mongoose = require('mongoose');

var app = express();

var mongoURI = process.env.MONGO_URI;

// fail fast with clear message if MONGO_URI not found
if (!mongoURI) {
  throw new Error('MONGO_URI not found');
}

mongoose.connect(mongoURI);

require('./config/middleware.js')(app, express);

module.exports = app;
