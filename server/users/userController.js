var User = require("./userModel");
var bluebird = require("bluebird");
var jwt = require("jsonwebtoken");
var helpers = require("../config/helpers");
var _ = require("lodash");

bluebird.promisifyAll(User);
var TWO_WEEKS_IN_MINUTES = 60 * 24 * 14;

module.exports = {
  signin: function(request, response, next) {
    var error;
    var username = request.body.username;
    var password = request.body.password;
    User.model.findOneAsync({username: username})
      .then(function(user) {
        if (user) {
          if (User.validPasswordAsync(password, user.password)) {
            response.status(200).send({
              message: "signed in!",
              token: jwt.sign(user.username, process.env.JWT_SECRET,
                {expiresInMinutes: TWO_WEEKS_IN_MINUTES})
            });
            next();
          } else {
            error = {message: "invalid password"};
            helpers.errorHandler(error, request, response, next);
            return;
          }
        } else {
          error = {message: "invalid username"};
          helpers.errorHandler(error, request, response, next);
          return;
        }
      })
      .catch(function(error) {
        helpers.errorLogger(error, request, response, next);
        helpers.errorHandler(error, request, response, next);
        return;
      });
  },

  signup: function(request, response, next) {
    var error;
    var newUser = request.body.username;
    var password = request.body.password;
    if (!newUser || !password) {
      error = {message: "Invalid username/password input"};
      helpers.errorHandler(error, request, response, next);
      return;
    }
    User.model.findOneAsync({username: newUser})
      .then(function(user) {
        if (user) {
          error = {message: "User already exists"};
          helpers.errorHandler(error, request, response, next);
          return;
        } else {
          User.createHash(password, function(error, hash) {
            User.model.createAsync({
              username: newUser,
              password: hash
            })
            .then(function(user) {
              response.status(201).send({
                token: jwt.sign(user.username, process.env.JWT_SECRET,
                  {expiresInMinutes: TWO_WEEKS_IN_MINUTES})
              });
            })
            .catch(function(error) {
              helpers.errorHandler(error, request, response, next);
              return;
            });
          });
        }
      })
      .catch(function(error) {
        helpers.errorHandler(error, request, response, next);
        return;
      });
  },

  checkAuth: function(request, response, next) {
    var token = request.headers["x-jwt"] || _.last(request.path.split("/"));

    jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
      if (error) {
        helpers.errorHandler(error, request, response, next);
      } else {
        request.currentUser = decoded;
        next();
      }
    });
  }
};
