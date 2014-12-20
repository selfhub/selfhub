var userController = require('./userController');
var passport = require('passport');
//we inject a router as the first argument (see: ../config/middleware)
module.exports = function(router) {
router.get('/test', function(req, res, next) {
  passport.authenticate('local', {session: false}, function(err, user){
    if (err) {
      console.log(err);
      return next(err);  
    }
    if (!user) {
      return res.json(401, {error: 'user not found'});
    }
    console.log(user);
    return res.json(200, {error: 'user found'});
  })(req, res, next);
});
};
