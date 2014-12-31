var morgan = require('morgan');
var bodyParser = require('body-parser');
var helpers = require('./helpers.js');

module.exports = function(app, express) {
  var userRouter = express.Router();
  var schemaRouter = express.Router();

  //morgan for logging
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  app.use('/api/schema', schemaRouter);
  app.use('/user', userRouter);

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  //inject routers into route files
  require('../users/userRoutes')(userRouter);
  require('../schemas/schemaRoutes')(schemaRouter);
};
