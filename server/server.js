var express = require('express');
var mongoose = require('mongoose');

var app = express();

var mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI);

require('./config/middleware.js')(app, express);

module.exports = app;
