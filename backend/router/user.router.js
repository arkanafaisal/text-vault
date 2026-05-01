import express from 'express';

import { userController } from '../controller/user.controller.js';
import jwtVerify from '../middleware/jwt-verify.js';
import { limit } from '../middleware/rate-limiting.js';
import { validate } from '../middleware/validate.js';

export const userRouter = express.Router()





userRouter.get('/me',               limit("getMyProfile"),              jwtVerify,                                              userController.getMyProfile);

userRouter.patch('/me/username',    limit("updateUsername"),            jwtVerify, validate('updateUsername'),           userController.updateUsername)
userRouter.patch('/me/public-key',  limit("updatePublicKey"),           jwtVerify, validate('updatePublicKey'),          userController.updatePublicKey)
userRouter.patch('/me/email',       limit("sendEmailVerification"),     jwtVerify, validate('sendEmailVerification'),    userController.sendEmailVerification)
userRouter.patch('/me/password',    limit("updatePassword"),            jwtVerify, validate('updatePassword'),           userController.updatePassword)

userRouter.delete('/me',            limit("deleteUser"),                jwtVerify, validate('deleteUser'),               userController.delete)