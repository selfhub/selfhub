var userController = require('./userController');

//we inject a router as the first argument (see: ../config/middleware)
module.exports = function(router) {
  router.post('/signin', userController.signin);
  router.post('/signup', userController.signup);
  router.get('/fetch', userController.getUsers);
  router.get('/remove', userController.dropUsers);
};
