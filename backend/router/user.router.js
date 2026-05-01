import express from 'express';

import { rl } from '../middleware/rate-limit.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { userController } from '../controller/user.controller.js';

export const userRouter = express.Router()





userRouter.get('/me',               rl,  authenticate,                                       userController.getMyProfile);

userRouter.patch('/me/username',    rl,  authenticate, validate('updateUsername'),           userController.updateUsername)
userRouter.patch('/me/public-key',  rl,  authenticate, validate('updatePublicKey'),          userController.updatePublicKey)
userRouter.patch('/me/email',       rl,  authenticate, validate('sendEmailVerification'),    userController.sendEmailVerification)
userRouter.patch('/me/password',    rl,  authenticate, validate('updatePassword'),           userController.updatePassword)

userRouter.delete('/me',            rl,  authenticate, validate('deleteUser'),               userController.delete)