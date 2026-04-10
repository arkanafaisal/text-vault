import express from 'express';

import { userController } from '../controller/user.controller.js';
import jwtVerify from '../middleware/jwt-verify.js';
import { limit } from '../middleware/rate-limiting.js';

export const userRouter = express.Router()





userRouter.get('/me',               limit("getMyProfile"),              jwtVerify,  userController.getMyProfile);

userRouter.patch('/me/username',    limit("updateUsername"),            jwtVerify,  userController.updateUsername)
userRouter.patch('/me/public-key',  limit("updatePublicKey"),           jwtVerify,  userController.updatePublicKey)
userRouter.patch('/me/email',       limit("sendEmailVerification"),     jwtVerify,  userController.sendEmailVerification)
userRouter.patch('/me/password',    limit("updatePassword"),            jwtVerify,  userController.updatePassword)