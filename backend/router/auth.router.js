import express from 'express';

import { authController } from '../controller/auth.controller.js';
import { limit } from '../middleware/rate-limiting.js';
import { validateRequest } from '../middleware/validate.js';




export const authRouter = express.Router();



authRouter.post('/register',                    limit('register'),          validateRequest('register'),        authController.register);
authRouter.post('/login',                       limit('login'),             validateRequest('login'),           authController.login);
authRouter.post('/logout',                      limit('logout'),                                                authController.logout)
authRouter.post('/refresh',                     limit('refresh'),                                               authController.refresh);


authRouter.post('/verify-email/:token',         limit("verifyEmail"),       validateRequest('verifyEmail'),     authController.verifyEmail)
authRouter.post("/forgot-password",             limit("forgotPassword"),    validateRequest('forgotPassword'),  authController.forgotPassword)
authRouter.post("/reset-password/:token",       limit("resetPassword"),     validateRequest('resetPassword'),   authController.resetPassword)