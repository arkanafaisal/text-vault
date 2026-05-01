import express from 'express';

import { authController } from '../controller/auth.controller.js';
import { limit } from '../middleware/rate-limiting.js';
import { validate } from '../middleware/validate.js';




export const authRouter = express.Router();



authRouter.post('/register',                    limit('register'),          validate('register'),        authController.register);
authRouter.post('/login',                       limit('login'),             validate('login'),           authController.login);
authRouter.post('/logout',                      limit('logout'),                                                authController.logout)
authRouter.post('/refresh',                     limit('refresh'),                                               authController.refresh);


authRouter.post('/verify-email/:token',         limit("verifyEmail"),       validate('verifyEmail'),     authController.verifyEmail)
authRouter.post("/forgot-password",             limit("forgotPassword"),    validate('forgotPassword'),  authController.forgotPassword)
authRouter.post("/reset-password/:token",       limit("resetPassword"),     validate('resetPassword'),   authController.resetPassword)