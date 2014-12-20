var User = require('./userModel');
var Promise = require('bluebird');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

Promise.promisifyAll(User);
// Promise.promisifyAll(User.prototype);

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
  signin: function(){},
  signup: function(){},
  checkAuth: function(){}
};
