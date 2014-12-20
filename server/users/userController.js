var User = require('./userModel');
var Promise = require('bluebird');
var passport = require('passport');
var jwt = require('jwt-simple');
var LocalStrategy = require('passport-local').Strategy;

Promise.promisifyAll(User.model);

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.model.findOneAsync({username: username})
      .then(function(user) {
        if (User.validPassword(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch(function(err) {
        return done(err);
      });
  }
));


module.exports = {
  signin: function(req, res, next) {
    passport.authenticate('local', {session: false}, function(err, user){
      if (err) {
        console.log(err);
        return next(err);  
      }
      if (!user) {
        return res.json(401, {message: 'User not found'});
      }
      return res.json(200, {error: 'user found'});
    })(req, res, next);
  },
  signup: function(req, res, next){
    var newUser = req.body.username;
    var password = req.body.password;
    User.model.findOneAsync({username: newUser})
      .then(function(user) {
        //enable the following log statement for troubleshooting purposes
        // console.log('findOneAsync args:', arguments);
        if (user) {
          res.json({message: 'User already exists'});
        } else {
          User.createHash(password, function(err, hash){
            console.log('hash:', hash);
            User.model.createAsync({
              username: newUser,
              password: hash
            })
            .then(function(user) {
              console.log('user:', arguments);
              var token = jwt.encode(user, process.env.JWT_SECRET);
              res.json(201, {token: token});
            })
            .catch(function(err){
              res.json(401, {error: err});
            });
          });
        }
        console.log('end of usercreate');
      })
      .catch(function(err) {
        res.json(401, {message: err});
      });
  },
  checkAuth: function(){},
  getUsers: function(req, res, next){
    User.model.findAsync({})
      .then(function(users){
        console.log(users);
        res.end();
      })
      .catch(function(err){
        console.log(err);
        res.end();
      })
  }
};


