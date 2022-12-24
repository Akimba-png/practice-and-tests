const Router = require('./../framework/router');
const userController = require('./user-controller');

const userRouter = new Router();

userRouter.get('/users', userController.getUser);
userRouter.post('/users', userController.postUser);

module.exports = userRouter;
