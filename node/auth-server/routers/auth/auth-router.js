const Router = require('express');
const AuthController = require('./auth-controller');
const { authorizeToken } = require('./../../middlewares/authorize-token');

const router = new Router();

router.post('/register', AuthController.addNewUser);
router.post('/login', AuthController.authenticateUser);
router.get('/login', authorizeToken, AuthController.checkAuthentication);
router.delete('/logout', authorizeToken, AuthController.unAuthorize);

module.exports = router;
