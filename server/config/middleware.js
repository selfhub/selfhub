var morgan = require('morgan');
var bodyParser = require('body-parser');
var helpers = require('./helpers.js');

module.exports = function(app, express) {
  var userRouter = express.Router();
  var schemaRouter = express.Router();

  //morgan for logging, bodyparser for...parsing body
  //express Static for serving client directory
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  //error handling/logging
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  //inject routers into route files
  require('../users/userRoutes')(userRouter);
  require('../schemas/schemasRoutes')(schemaRouter);
};
