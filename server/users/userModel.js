var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }
});

module.exports = {
  model: mongoose.model('user', userSchema),
  validPassword: function(inputPass, password) {
    return bcrypt.compare(inputPass, password, function(error, match) {
      return Boolean(match);
    });
  },
  createHash: function(password, cb) {
    bcrypt.genSalt(function(error, salt) {
      if (error) {
        console.log(error);
      } else {
        console.log('hit genSalt, no error');
        //cb takes err and hash arguments.
        bcrypt.hash(password, salt, cb);
      }
    });
  }
};
