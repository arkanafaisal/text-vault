import express from 'express';

import { userController } from '../controller/user.controller.js';
import jwtVerify from '../middleware/jwt-verify.js';
import { rl } from '../middleware/rate-limiting.js';
import { validate } from '../middleware/validate.js';

export const userRouter = express.Router()





userRouter.get('/me',               rl,  jwtVerify,                                       userController.getMyProfile);

userRouter.patch('/me/username',    rl,  jwtVerify, validate('updateUsername'),           userController.updateUsername)
userRouter.patch('/me/public-key',  rl,  jwtVerify, validate('updatePublicKey'),          userController.updatePublicKey)
userRouter.patch('/me/email',       rl,  jwtVerify, validate('sendEmailVerification'),    userController.sendEmailVerification)
userRouter.patch('/me/password',    rl,  jwtVerify, validate('updatePassword'),           userController.updatePassword)

userRouter.delete('/me',            rl,  jwtVerify, validate('deleteUser'),               userController.delete)