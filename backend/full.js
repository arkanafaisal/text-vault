// // server.js
// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import 'dotenv/config'


// const app = express()
// app.use(express.json())
// app.set('trust proxy', true)
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser())

// app.use(cors({
//   origin: process.env.NODE_ENV === "development"? 'http://127.0.0.1:5500' : 'https://databox.arkanafaisal.my.id',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type'],   // opsional, header yg diizinkan
//   preflightContinue: false,
//   optionsSuccessStatus: 204
// }))

// const PORT = '3000'
// const server = app.listen(PORT, ()=>{console.log(`Server running on port ${PORT}`)})



  

// import userRouter from './router/userRouter.js';
// import authRouter from './router/authRouter.js';
// import dataRouter from './router/dataRouter.js';
// app.use('/users', userRouter);
// app.use('/auth', authRouter);
// app.use('/data', dataRouter);





// // data-schema.js
// import Joi from 'joi'


// export const insert = Joi.object({
//     title: Joi.string().trim().max(16).required(),
//     body: Joi.string().max(1024).required()
// })

// export const dataId = Joi.number().integer().positive().required()

// // user-schema.js
// import Joi from "joi"

// export const username = Joi.string().trim().max(32).pattern(/^[a-zA-Z0-9]+$/)
// export const email = Joi.string().trim().lowercase().email().max(64)
// export const password = Joi.string().max(255).trim().required()
// export const publicKey = Joi.string().trim().max(255).required()

// export const token = Joi.string().trim().lowercase().length(64).hex().required()

// export const register = Joi.object({
//     username: username.required(),
//     email: email.allow('', null),
//     password
// })

// export const login = Joi.object({
//     identifier: Joi.alternatives().try(
//       email,
//       username
//     ).required(),
//     password
// })

// export const editUsername = Joi.object({
//     newUsername: username.required(),
//     password
// })
// export const editEmail = Joi.object({
//     newEmail: email.required(),
//     password
// })




// // authRouter.js
// import express from 'express';
// import authController from '../controller/authController.js';
// import rateLimiting from '../middleware/rateLimiting.js';

// const authRouter = express.Router();

// // authRouter.use('/', (req, res, next)=>{
// //     console.log('/auth endpoint hit')
// //     next();
// // })

// authRouter.post('/register',    rateLimiting("register", 10, 20),    authController.register);
// authRouter.post('/login',       rateLimiting('login', 5, 20),        authController.login);
// authRouter.post('/refresh',     rateLimiting('refresh', 1, 30),       authController.refresh);
// authRouter.delete('/logout',    rateLimiting('logout', 1, 15),       authController.logout)





// export default authRouter

// // dataRouter.js
// import express from 'express';

// import jwtVerify from '../middleware/jwtVerify.js';
// import dataController from '../controller/dataController.js';
// import rateLimiting from '../middleware/rateLimiting.js';

// const dataRouter = express.Router();
// // dataRouter.use('/', (req, res, next) => {
// //     console.log('data endpoint hit');
// //     next();
// // })

// dataRouter.post('/add',                 rateLimiting('addData', 1, 30),         jwtVerify,  dataController.addData)
// dataRouter.get('/me',                   rateLimiting('getMyData', 1, 120),      jwtVerify,  dataController.getMyData)
// dataRouter.delete('/delete/:id',        rateLimiting('deleteData', 1, 30),      jwtVerify,  dataController.deleteData)
// dataRouter.post('/update/access/:id',   rateLimiting('updateAccess', 1, 60),    jwtVerify,  dataController.updateAccess)
// dataRouter.patch('/edit/:id',           rateLimiting('updateData', 1, 30),      jwtVerify,  dataController.updateData)
// dataRouter.post('/profile/:username',   rateLimiting('getPublicData', 1, 120),              dataController.getPublicData)


// export default dataRouter;

// // userRouter.js
// import express from 'express';

// import userController from '../controller/userController.js';
// import jwtVerify from '../middleware/jwtVerify.js';
// import rateLimiting from '../middleware/rateLimiting.js';

// const userRouter = express.Router();
// // userRouter.use('/', (req, res, next)=>{
// //     console.log('users endpoint hit')
// //     next()
// // });

// userRouter.post('/me',                      rateLimiting("getData", 1, 120),             jwtVerify,  userController.getMe);
// userRouter.get('/search/:username',         rateLimiting("searchUsername", 1, 60),                  userController.checkUsernameExist)


// userRouter.patch('/username',               rateLimiting("editUsername", 5, 40),         jwtVerify,  userController.editUsername)
// userRouter.patch('/public-key',             rateLimiting("editPublicKey", 1, 20),        jwtVerify,  userController.editPublicKey)

// userRouter.patch('/email',                  rateLimiting("EditEmail", 15, 10),           jwtVerify,  userController.editEmail)
// userRouter.get('/verify-email',             rateLimiting("verifyEmail", 15, 10),                     userController.verifyEmail)

// userRouter.post("/reset-password",          rateLimiting("resetPassword", 15, 5),       jwtVerify,  userController.resetPassword)
// userRouter.post("/verify-reset-password",   rateLimiting("verifyResetPassword", 15, 10),             userController.verifyResetPassword)





// export default userRouter;


// // data-model.js
// import db from "../config/db.js"


// export async function insert({userId, title, body}) {
//     const [{insertId}] = await db.query('INSERT INTO userData (user_id, title, body) VALUES (?, ?, ?)', [userId, title, body])
//     return insertId
// }

// export async function getMyData({userId}) {
//     const [userData] = await db.query('SELECT id, title, body, access FROM userData WHERE user_id = ?', [userId])
//     return userData
// }

// export async function remove({id, userId}) {
//     const [{affectedRows}] = await db.query('DELETE FROM userData WHERE id = ? AND user_id = ?', [id, userId])
//     return affectedRows
// }

// export async function updateAccess({id, userId}) {
//     const [{affectedRows}] = await db.query(`UPDATE userData SET access = IF(access = 'public', 'private', 'public') WHERE id = ? AND user_id = ?`, [id, userId])
//     return affectedRows
// }

// export async function getDataAccess({id, userId}) {
//     const [rows] = await db.query('SELECT access FROM userData WHERE id = ? AND user_id = ?', [id, userId])
//     if(rows.length === 0){return null}
//     return rows[0].access
// }

// export async function updateData({title, body, id, userId}) {
//     const [{affectedRows, changedRows}] = await db.query(`UPDATE userData SET title = ?, body = ? WHERE id = ? AND user_id = ?`, [title, body, id, userId])
//     return {affectedRows, changedRows}
// }

// export async function getPublicData({userId}) {
//     const [publicData] = await db.query('SELECT title, body FROM userData WHERE user_id = ? AND access = "public" ORDER BY id ASC', [userId])
//     return publicData
// }


// // user-model.js
// import db from "../config/db.js"
// import bcrypt from 'bcrypt'

// export async function register({username, email, password}) {
//     try {

//         const hash = await bcrypt.hash(password, 10)
//         const [{insertId}] = await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash])
//         return insertId
//     } catch(err) {
//         if(err.code === 'ER_DUP_ENTRY'){throw new Error('duplicate')}
//         throw err
//     }
// }

// export async function authenticateUser({identifier, password}){
//     const [[user]] = await db.query('SELECT id, username, password FROM users WHERE (username = ? OR email = ?)', [identifier, identifier])
//     if(!user){return null}

//     const ok = await bcrypt.compare(password, user.password)
//     if(!ok){return null}
//     return user
// }

// export async function validateUserId({id}){
//     const [[row]] = await db.query('SELECT 1 FROM users WHERE id = ?', [id])
//     return !!row
// }

// export async function validateUsername({username}) {
//     const [[row]] = await db.query("SELECT 1 FROM users WHERE username = ?", [username])
//     return !!row
// }

// export async function getUserByUsername({username}) {
//     const [rows] = await db.query('SELECT id, publicKey FROM users WHERE username = ?', [username])
//     if(rows.length === 0){return {id: 0, publicKey: null}}
//     const {id, publicKey} = rows[0]
//     return {id, publicKey}
// }

// export async function getMyProfile({id}) {
//     const [[user]] = await db.query('SELECT username, email, publicKey FROM users WHERE id = ?', [id])
//     return user
// }

// export async function getUsernamePasswordById({id}) {
//     const [[user]] =  await db.query('SELECT username, password FROM users WHERE id = ?', [id])
//     return user
// }
// export async function getEmailPasswordById({id}) {
//     const [[user]] = await db.query("SELECT email, password FROM users WHERE id = ?", [id])
//     return user
// }

// export async function updateUsername({newUsername, id}) {
//     try {
//         const [{affectedRows, changedRows}] = await db.query('UPDATE users SET username = ? WHERE id = ?', [newUsername, id])
//         return {affectedRows, changedRows}
//     } catch(err) {
//         if(err.code === 'ER_DUP_ENTRY'){throw new Error('duplicate')}
//         throw err
//     }
// }

// export async function updatePublicKey({newPublicKey, id}) {
//     const [{affectedRows, changedRows}] = await db.query("UPDATE users SET publicKey = ? WHERE id = ?", [newPublicKey, id])
//     return {affectedRows, changedRows}
// }

// export async function validateEmail({newEmail}) {
//     const [[row]] = await db.query("SELECT 1 FROM users WHERE email = ?", [newEmail])
//     return !!row
// }

// export async function updateEmail({newEmail, userId}) {
//     try {
//         const [{changedRows}] = await db.query("UPDATE users SET email = ? WHERE id = ?", [newEmail, userId])
//         return changedRows
//     } catch(err) {
//         if(err.code === "ER_DUP_ENTRY"){throw new Error('duplicate')}
//         throw err
//     }
// }
// export async function updatePassword({newPassword, userId}) {
//     const hash = await bcrypt.hash(newPassword, 10)
//     const [{changedRows}] = await db.query("UPDATE users SET password = ? WHERE id = ?", [hash, userId])
//     return changedRows
// }

// export async function getEmailById(id) {
//     const [[user]] = await db.query("SELECT email FROM users WHERE id = ?", [id])
//     return user
// }


// // jwtVerify.js
// import jwt from 'jsonwebtoken';
// import { response } from '../utils/response.js';

// export default async function verifyToken(req, res, next) {
//     const accessToken = req.cookies.accessToken
//     if (!accessToken) {return response(res, false, "token invalid", null, 40101)}

//     try{
//         const decoded = await jwt.verify(accessToken, process.env.JWT_SECRET)
//         req.user = decoded
//         next();
//     } catch(err){
//         if(err.name === 'TokenExpiredError'){return response(res, false, 'token expired', null, 40101)}
//         else if(err.name === 'JsonWebTokenError'){return response(res, false, 'token invalid', null, 40101)}
//         else{return response(res, false, 'could not verify token', null, 40101)}
//     }      
// }


// // rateLimiting.js
// import redis from "../config/redis.js"
// import { response } from "../utils/response.js"

// export default function rateLimiting(feature, windowM, limit){
//     return async function(req, res, next){
//         const key = "databox:rl:" + feature + ":" + req.ip
//         const count = await redis.incr(key)

//         if (count === 1) {await redis.pExpire(key, (windowM * 60000))}

//         if (count > limit) {return response(res, false, "too many requests", null, 429)}

//         next()
//     }
// }


// //response.js
// export function response(response, success, message, data = null, code = null){
//     const res = {success, message}
//     if(data){res.data = data}
//     if(code){res.code = code}
//     return response.send(res)
// }

// // validate.js
// export function validate(schema, body){
//     const { error, value } = schema.validate(body, { abortEarly: true })

//     if(error){
//         const d = error.details[0]
//         const field = d.path.join('.')

//         let message = 'Invalid input'
//         switch (true) {
//             case d.type === 'any.required':
//                 message = `${field} is required`
//                 break
//             case d.type === 'string.empty':
//                 message = `${field} cannot be empty`
//                 break
//             case d.type === 'number.base':
//                 message = `${field} must be a number`
//                 break
//             case d.type.startsWith('string.pattern'):
//                 message = `${field} format is invalid`
//                 break
//             case d.type === 'alternatives.match':
//                 message = `${field} format is invalid`
//                 break
//             default:
//                 message = `${field} is invalid`
//         }


//         return { ok:false, message }
//     }

//     return { ok:true, value }
// }





// //authController.js
// import jwt from 'jsonwebtoken';
// import {randomUUID} from 'crypto'

// import * as userSchema from '../schema/user-schema.js'
// import * as UserModel from '../model/user-model.js'
// import * as redisHelper from '../utils/redis-helper.js'

// import { response } from '../utils/response.js';
// import { validate } from '../utils/validate.js';

// const authController = {}
// const sameSite = process.env.NODE_ENV === "development"? 'none' : 'Lax'

// const cookieOptions = {
//     accessToken: {
//         httpOnly: true,
//         sameSite,
//         secure: true,
//         path: '/',
//         maxAge: 10* 60 * 1000
//     },
//     refreshToken: {
//         httpOnly: true,
//         sameSite,
//         secure: true,
//         path: '/',
//         maxAge: 168 * 60 * 60 * 1000
//     }
// }


// authController.register = async (req, res)=>{
//     const {ok, message, value: userRequest} = validate(userSchema.register, req.body)
//     if(!ok){return response(res, false, message)}

//     try{
//         const insertId = await UserModel.register(userRequest)
//         if(!insertId){return response(res, false, "register failed")}
//         return response(res, true, 'register success')
//     } catch(err) {
//         if(err.msg === "duplicate"){return response(res, false, "username or email is already taken")}
//         console.log(err)
//         return response(res, false, 'server error', null, 500)
//     }
// }

// authController.login = async (req, res)=>{
//     const {ok, message, value: userRequest} = validate(userSchema.login, req.body)
//     if(!ok){return response(res, false, message)}

//     try{
//         const user = await UserModel.authenticateUser(userRequest)
//         if(!user){return response(res, false, 'wrong username, email or password')}
        
//         const accessToken = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '10m'})
//         const refreshToken = randomUUID()

//         const {ok: ok2} = await redisHelper.set('tokens', refreshToken, user.id)
//         if(!ok2){return response(res, false, 'login failed')}

//         res.cookie('accessToken', accessToken, cookieOptions.accessToken)
//         res.cookie('refreshToken', refreshToken, cookieOptions.refreshToken)

//         return response(res, true, 'login success')
//     } catch(err) {
//         console.log(err)
//         return response(res, false, 'server error', null, 500)
//     }
// }

// authController.logout = async (req, res) => {
//     const refreshToken = req.cookies.refreshToken
//     if(refreshToken){
//         (async () => {
//             for(let i = 0; i < 3; i++){
//                 const {ok} = await redisHelper.del('tokens', refreshToken)
//                 if(ok) break
//                 await new Promise(r => setTimeout(r, 500))
//             }
//         })()
//     }

//     res.clearCookie("refreshToken", cookieOptions.refreshToken)
//     res.clearCookie("accessToken", cookieOptions.accessToken)
    


//     return response(res, true, "logout success")
// }





// authController.refresh = async (req, res) => {
//     const refreshToken = req.cookies.refreshToken
//     if(!refreshToken){return response(res, false, "please login", null, 401)}
//     try {
//         const {ok, data: userId} = await redisHelper.get('tokens', refreshToken)
//         if(!ok){return response(res, false, "user not found, please try re-log", null, 401)}
        
//         const isExist = await UserModel.validateUserId({id: userId})
//         if(!isExist){
//             (async () => {
//                 for(let i = 0; i < 3; i++){
//                     const {ok} = await redisHelper.del('tokens', refreshToken)
//                     if(ok) break
//                     await new Promise(r => setTimeout(r, 500))
//                 }
//             })()

//             res.clearCookie("refreshToken", cookieOptions.refreshToken)
//             res.clearCookie("accessToken", cookieOptions.accessToken)

//             return response(res, false, "user not found, please try re-log", null, 401)

//         }

//         const accessToken = jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '10m'})
//         res.cookie("accessToken", accessToken, cookieOptions.accessToken)

//         return response(res, true, "new access token created")
//     } catch(err) {
//         console.log(err)
//         return response(res, false, 'could not verify token, please try re-log', null, 401)
//     }
// }


// export default authController


// //dataController.js
// import * as dataSchema from '../schema/data-schema.js'
// import * as userSchema from '../schema/user-schema.js'
// import * as DataModel from '../model/data-model.js'
// import * as UserModel from '../model/user-model.js'
// import * as redisHelper from '../utils/redis-helper.js'

// import { response } from '../utils/response.js';
// import { validate } from '../utils/validate.js';


// const dataController = {};

// dataController.addData = async (req, res) => {
//     const {ok, message, value: userRequest} = validate(dataSchema.insert, req.body)
//     if(!ok){return response(res, false, message)}

//     try{
//         const insertId = await DataModel.insert({userId: req.user.id, ...userRequest})
//         if(!insertId){return response(res, false, "failed to add the data")}
//         await redisHelper.del('cache', `userData:${req.user.id}`)

//         return response(res, true, 'data added successfully', {id: insertId, ...userRequest, access:'private'})
//     } catch(err) {
//         console.log(err)
//         return response(res, false, 'server error', null, 500)
//     }
// }

// dataController.getMyData = async (req, res) => {
//     try{
//         const {ok, data: cachedUserData} = await redisHelper.get('cache', `userData:${req.user.id}`)
//         if(ok){return response(res, true, 'retrieved your data', cachedUserData)}

//         const userData = await DataModel.getMyData({userId: req.user.id})
//         await redisHelper.set('cache', `userData:${req.user.id}`, userData)

//         return response(res, true, 'retrieved your data', userData)
//     } catch(err) {
//         console.log(err)
//         return response(res, false, 'server error', null, 500)
//     }
// }

// dataController.deleteData = async (req, res) => {
//     const {ok, message, value: id} = validate(dataSchema.dataId, req.params.id)
//     if(!ok){return response(res, false, message)}

//     try{
//         const affectedRows = await DataModel.remove({id, userId: req.user.id})
//         if(affectedRows === 0){return response(res, false, 'data not found, please refresh', null, 40101)}
        
//         await redisHelper.del('cache', `userData:${req.user.id}`)
//         await redisHelper.del('cache', `publicData:${req.user.id}`)
        
//         return response(res, true, 'data deleted successfully')
//     } catch(err) {
//         console.log(err)
//         return response(res, false, 'server error', null, 500)
//     }
// }

// dataController.updateAccess = async (req, res) => {
//     const {ok, message, value: id} = validate(dataSchema.dataId, req.params.id)
//     if(!ok){return response(res, false, message)}

//     try{
//         const affectedRows = await DataModel.updateAccess({id, userId: req.user.id})
//         if(affectedRows === 0){return response(res, false, 'data not found, please refresh', null, 401)}
        
//         await redisHelper.del('cache', `userData:${req.user.id}`)
//         await redisHelper.del('cache', `publicData:${req.user.id}`)
        
//         const access = await DataModel.getDataAccess({id, userId: req.user.id})
//         if(!access){return response(res, true, "access updated but please do refresh", null, 401)}

//         return response(res, true, 'access updated successfully', access)
//     } catch(err) {
//         console.log(err)
//         return response(res, false, 'server error', null, 500)
//     }
// }

// dataController.updateData = async (req, res) => {
//     const {ok, message, value: id} = validate(dataSchema.dataId, req.params.id)
//     if(!ok){return response(res, false, message)}

//     const {ok: ok2, message: message2, value: userRequest} = validate(dataSchema.insert, req.body)
//     if(!ok2){return response(res, false, message2)}

//     try{
//         const {affectedRows, changedRows} = await DataModel.updateData({...userRequest, id, userId: req.user.id})
//         if(affectedRows === 0) return response(res, false, 'data not found', false, 40101)
//         if(changedRows === 0) return response(res, false, "there's nothing to change")
            
//         await redisHelper.del('cache', `userData:${req.user.id}`)
//         await redisHelper.del('cache', `publicData:${req.user.id}`)
    
//         return response(res, true, 'successfully edit data', {id, ...userRequest})
//         } catch(err){
//         console.log(err)
//         return response(res, false, 'server error', null, 500)
//     }
// }

// dataController.getPublicData = async (req, res) => {
//     const {ok, message, value: username} = validate(userSchema.username, req.params.username)
//     if(!ok){return response(res, false, message)}
//     const {ok: ok2, message: message2, value: inputPublicKey} = validate(userSchema.publicKey, req.body.publicKey)
//     if(!ok2){return response(res, false, message2)}
    
//     try{
//         const {id, publicKey} = await UserModel.getUserByUsername({username})
//         if(!id){return response(res, false, "user not found")}

//         if(publicKey !== null && publicKey !== inputPublicKey) return response(res, false, 'permission denied')

//         const {ok, data: cachedPublicData} = await redisHelper.get('cache', `publicData:${id}`)
//         if(ok){return response(res, true, 'permission granted', cachedPublicData)}

//         const publicData = await DataModel.getPublicData({userId: id})
//         await redisHelper.set('cache', `publicData:${id}`, publicData)

//         return response(res, true, 'permission granted', publicData)
//     } catch(err) {
//         console.log(err)
//         return response(res, false, 'server error', null, 500)
//     }
// }


// export default dataController;


// // userController.js
// import crypto from "crypto"
// import bcrypt from "bcrypt"

// import * as userSchema from '../schema/user-schema.js'
// import * as UserModel from '../model/user-model.js'
// import * as redisHelper from '../utils/redis-helper.js'

// import { response } from "../utils/response.js"; 
// import { validate } from '../utils/validate.js';
// import { sendMail } from "../utils/email.js";

// const userController = {}

// userController.getMe = async (req, res)=> {
//     try{
//         const {ok, data} = await redisHelper.get('cache', `profileData:${req.user.id}`)
//         if(ok){return response(res, true, 'profile retrieved', data)}

//         const user = await UserModel.getMyProfile({id: req.user.id})
//         if(!user){return response(res, false, 'user not found, please do refresh', null, 40101)}

//         await redisHelper.set('cache', `profileData:${req.user.id}`, user)

//         return response(res, true, 'profile retrieved', user)
//     } catch(err) {
//         console.log(err)
//         return response(res, false, "server error", null, 500)
//     }
// }

// userController.checkUsernameExist = async (req, res) => {
//     const {ok, message, value: username} = validate(userSchema.username, req.params.username)
//     if(!ok){return response(res, false, message)}

//     try {
//         const isExist = await UserModel.validateUsername({username})
//         if(!isExist) return response(res, false, "user not found")

//         return response(res, true, "user found", username)
//     } catch(err) {
//         console.log(err)
//         return response(res, false, "server error", null, 500)
//     }
// }

// userController.editUsername = async (req, res) => {
//     const {ok, message, value: userRequest} = validate(userSchema.editUsername, req.body)
//     if(!ok){return response(res, false, message)}

//     try{
//         const user = await UserModel.getUsernamePasswordById({id: req.user.id})
//         if(!user){return response(res, false, "user not found, please do refresh", null, 40101)}
//         if(user.username === userRequest.newUsername) return response(res, false, "there's nothing to change")

//         const isPasswordValid = await bcrypt.compare(userRequest.password, user.password)
//         if(!isPasswordValid) return response(res, false, 'wrong password')

//         const {affectedRows, changedRows} = await UserModel.updateUsername({username: userRequest.newUsername, id: req.user.id})
//         if(affectedRows === 0){return response(res, false, "user not found, please do refresh", null, 40101)}
//         if(changedRows === 0){return response(res, false, "there's nothing to change")}

//         await redisHelper.del('cache', `profileData:${req.user.id}`)
//         await redisHelper.del('cache', `publicData:${req.user.id}`)

//         return response(res, true, 'username changed', userRequest.newUsername)
//     } catch(err){
//         if(err.msg === 'duplicate'){return response(res, false, 'username taken')}
//         return response(res, false, 'server error', null, 500)
//     }
// }

// userController.editPublicKey = async (req, res) => {
//     const {ok, message, value: newPublicKey} = validate(userSchema.publicKey, req.body.newPublicKey)
//     if(!ok){return response(res, false, message)}
    
//     try{
//         const {affectedRows, changedRows} = await UserModel.updatePublicKey({newPublicKey, id: req.user.id})
//         if(affectedRows === 0) return response(res, false, "user not found, please do refresh", null, 40101)
//         if(changedRows === 0) return response(res, false, "there's nothing to change")
            
//         await redisHelper.del('cache', `profileData:${req.user.id}`)
//         await redisHelper.del('cache', `publicData:${req.user.id}`)
        
//         return response(res, true, 'public key changed', newPublicKey)
//     } catch(err) {
//         console.log(err)
//         return response(res, false, "server error", null, 500)
//     }
// }

// userController.editEmail = async (req, res) => {
//     const {ok, message, value: userRequest} = await validate(userSchema.editEmail, req.body)
//     if(!ok){return response(res, false, message)}

//     try{
//         const isExist = await UserModel.validateEmail({newEmail: userRequest.newEmail})
//         if(isExist) return response(res, false, "email already taken")
        
//         const user = await UserModel.getEmailPasswordById({id: req.user.id})
//         if(!user){return response(res, false, "user not found, please do refresh", null, 40101)}
//         if(user.email === userRequest.newEmail) return response(res, false, "there's nothing to change")

//         const isPasswordValid = await bcrypt.compare(userRequest.password, user.password)
//         if(!isPasswordValid) return response(res, false, "incorrect password")
        

//         const token = crypto.randomBytes(32).toString('hex')
//         const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

//         const {ok: ok2} = await redisHelper.set('verify_email', tokenHash, {user_id: req.user.id, new_email: userRequest.newEmail})
//         if(!ok2){return response(res, false, "failed to generate email verification link, please try again")}

//         await sendMail.verifyEmail({newEmail: userRequest.newEmail, token})

//         return response(res, true, "verification email has been sent to " + userRequest.newEmail)
//     } catch(err){
//         console.log(err)
//         return response(res, false, "server error", null, 500)
//     }
// }

// userController.verifyEmail = async (req, res) => {
//     const {ok, value: token} = validate(userSchema.token, req.query.token)
//     if(!ok){return response(res, false, 'invalid or expired link verification')}

//     try{
//         const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

//         const {ok:ok2, data: tokenPayload} = await redisHelper.get('verify_email', tokenHash)
//         if(!ok2){return response(res, false, "invalid or expired link verification")}

//         const {changedRows} = await UserModel.updateEmail({newEmail: tokenPayload.new_email, userId: tokenPayload.user_id})
//         if(changedRows === 0) return response(res, false, "there's nothing to change")

//         await redisHelper.del('cache', `profileData:${tokenPayload.user_id}`)
//         await redisHelper.del('verify_email', tokenHash)

//         return response(res, true, "success, your account email changed to " + tokenPayload.new_email)
//     } catch(err){
//         if(err.msg === 'duplicate'){return response(res, false, "email already taken")}
//         console.log(err)
//         return response(res, false, "server error", null, 500)
//     }
// }

// userController.resetPassword = async (req, res) => {
//     try {
//         const user = await UserModel.getEmailById({id: req.user.id})
//         if(!user){return response(res, false, "user not found, please do refresh", null, 40101)}
//         if(!user.email) return response(res, false, "you don't have registered email")

//         const token = crypto.randomBytes(32).toString('hex')
//         const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

//         const {ok: ok2} = await redisHelper.set('reset_password', tokenHash, {user_id: req.user.id})
//         if(!ok2){return response(res, false, "failed to generate reset password link, please try again")}

//         await sendMail.resetPassword({email: user.email, token})

//         return response(res, true, "verification email has been sent to " + user.email)
//     } catch(err) {
//         console.log(err)
//         return response(res, false, "server error", null, 500)
//     }
// }

// userController.verifyResetPassword = async (req, res) => {
//     const {ok, value: token} = validate(userSchema.token, req.query.token)
//     if(!ok){return response(res, false, 'invalid or expired link verification')}

//     try {
//         const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

//         const {ok:ok2, data: tokenPayload} = await redisHelper.get('reset_password', tokenHash)
//         if(!ok2){return response(res, false, "invalid or expired link verification")}

//         const {ok, message, value: newPassword} = validate(userSchema.password, req.body.newPassword)
//         if(!ok){return response(res, false, message)}

//         const {changedRows} = await UserModel.updatePassword({newPassword, userId: tokenPayload.user_id})
//         if(changedRows === 0) return response(res, false, "there's nothing to change")

//         await redisHelper.del('reset_password', tokenHash)

//         return response(res, true, "password changed")

//     } catch(err) {
//         console.log(err)
//         return response(res, false, "server error", null, 500)
//     }
// }
 
// export default userController;