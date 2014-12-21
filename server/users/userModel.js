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
  },
  createHash: function(password, cb){
    bcrypt.genSalt(function(err, salt) {
      if (err) {
        console.log(err);
      } else {
        console.log('hit genSalt, no error');
        //cb takes err and hash arguments.
        bcrypt.hash(password, salt, cb);
      }
    });
  }
};
