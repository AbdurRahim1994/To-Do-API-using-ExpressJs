const express = require('express');
const userRouter = express.Router();
const userController = require('../../controllers/user/userController');
const { upload } = require('../../helpers/fielUpload');
const authVerify = require('../../middlewares/auth')

userRouter.post('/createUser', upload, userController.createUser);
userRouter.post('/userLogin', userController.userLogin);
userRouter.post('/updateUser', authVerify, userController.updateUser);
userRouter.get('/getAllUser', userController.getAllUser);
userRouter.get('/getUserById', authVerify, userController.getUserById);
userRouter.post('/userLogOut', authVerify, userController.userLogOut);

module.exports = userRouter;