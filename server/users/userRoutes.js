var userController = require('./userController');


//we inject a router as the first argument (see: ../config/middleware)
module.exports = function(router) {
router.get('/test', userController.signin);
router.get('/create', userController.signup);
router.get('/fetch', userController.getUsers);
};
