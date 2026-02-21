import express from 'express';

import userController from '../controller/userController.js';
import jwtVerify from '../middleware/jwtVerify.js';
import rateLimiting from '../middleware/rateLimiting.js';

const userRouter = express.Router();
// userRouter.use('/', (req, res, next)=>{
//     console.log('users endpoint hit')
//     next()
// });

userRouter.post('/me',                      rateLimiting("getData", 1, 120),             jwtVerify,  userController.getMe);
userRouter.get('/search/:username',         rateLimiting("searchUsername", 1, 60),                  userController.checkUsernameExist)


userRouter.patch('/username',               rateLimiting("editUsername", 15, 10),         jwtVerify,  userController.editUsername)
userRouter.patch('/public-key',             rateLimiting("editPublicKey", 2, 10),        jwtVerify,  userController.editPublicKey)

userRouter.patch('/email',                  rateLimiting("editEmail", 30, 20),           jwtVerify,  userController.editEmail)
userRouter.get('/verify-email',             rateLimiting("verifyEmail", 30, 5),                     userController.verifyEmail)

userRouter.post("/reset-password",          rateLimiting("resetPassword", 15, 10),       jwtVerify,  userController.resetPassword)
userRouter.post("/verify-reset-password",   rateLimiting("verifyResetPassword", 30, 5),             userController.verifyResetPassword)





export default userRouter;