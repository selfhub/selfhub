var User = require('./userModel');
var Promise = require('bluebird');
var jwt = require('jwt-simple');

Promise.promisifyAll(User);

module.exports = {
  signin: function(req, res, next) {
    //the || operators are for testing on the fly right now. Will remove later.
    var username = req.body.username || 'test2';
    var password = req.body.password || 'test2';
    User.model.findOneAsync({username: username})
      .then(function(user) {
        if (user) {
          if (User.validPasswordAsync(password, user.password)) {
            res.status(200).send({
              message: 'signed in!',
              token: jwt.encode(user.username, process.env.JWT_SECRET)
            });
            next();
          } else {
            res.status(401).send({message: 'invalid password'});
          }  
        } else {
          res.status(401).send({message: 'invalid username'});
        }
      })
      .catch(function(err) {
        console.log(err);
        res.status(401).send({error: err});
      });
  },
  signup: function(req, res, next){
    var newUser = req.body.username || 'test1';
    var password = req.body.password || 'test1';
    if (!newUser || !password) {
      res.status(401).send({error: 'Invalid username/password input'});
    }
    User.model.findOneAsync({username: newUser})
      .then(function(user) {
        //enable the following log statement for troubleshooting purposes
        // console.log('findOneAsync args:', arguments);
        if (user) {
          res.json({message: 'User already exists'});
        } else {
          User.createHash(password, function(err, hash){
            User.model.createAsync({
              username: newUser,
              password: hash
            })
            .then(function(user) {
              var token = jwt.encode(user.username, process.env.JWT_SECRET);
              res.json(201, {token: token});
            })
            .catch(function(err){
              res.json(401, {error: err});
            });
          });
        }
      })
      .catch(function(err) {
        res.json(401, {message: err});
      });
  },
  checkAuth: function(req, res, next){
    //WORK IN PROGRESS, still need communication from client side to test sent headers.
    //this will be whatever header we put the jwt under.
    var token = req.headers['x-jwt'];
    var user = jwt.decode(token, process.env.JWT_SECRET);


  },
  getUsers: function(req, res, next){
    User.model.findAsync({})
      .then(function(users){
        console.log(users);
        res.end(JSON.stringify(users));
      })
      .catch(function(err){
        console.log(err);
        res.end();
      })
  },
  dropUsers: function(req, res, next) {
    User.model.find({}).remove().exec();
    res.end();
  }
};


