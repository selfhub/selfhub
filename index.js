var app = require('./server/server.js');

//Here we load our environmental variables from our .env file. See example.env for clarification.
require('dotenv').load();

var port = process.env.port || 8000;

app.listen(port);
