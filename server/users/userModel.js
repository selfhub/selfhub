var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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
  validPassword: function(inputPass, password){
    return bcrypt.compare(inputPass, password, function(err, match) {
      if (match) {
        return true;
      } else {
        return false;
      }
    });
  }
};
