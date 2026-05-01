import express from 'express';

import { rl } from '../middleware/rate-limiting.js';
import { validate } from '../middleware/validate.js';
import { authController } from '../controller/auth.controller.js';



export const authRouter = express.Router();

authRouter.post('/register',                rl,   validate('register'),        authController.register);
authRouter.post('/login',                   rl,   validate('login'),           authController.login);
authRouter.post('/logout',                  rl,                                authController.logout)
authRouter.post('/refresh',                 rl,                                authController.refresh);


authRouter.post('/verify-email/:token',     rl,   validate('verifyEmail'),     authController.verifyEmail)
authRouter.post("/forgot-password",         rl,   validate('forgotPassword'),  authController.forgotPassword)
authRouter.post("/reset-password/:token",   rl,   validate('resetPassword'),   authController.resetPassword)