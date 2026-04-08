import { randomUUID, createHash, randomBytes } from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import * as UserSchema from '../schema/user-schema.js'
import * as UserModel from '../model/user-model.js'
import * as redisHelper from '../utils/redis-helper.js'

import { sendMail } from '../utils/mailer.js';
import { incrbyRateLimit } from '../middleware/rate-limiting.js';
import { validate } from '../utils/validate.js';

import { response } from '../utils/response.js';
import { logging } from '../utils/logging.js'
import { validateRequest } from '../utils/requestValidation.js';

export const authController = {}

const refreshTokenOption = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development"? 'none' : 'Lax',
    secure: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
}

authController.register = asyncHandler(async (req, res)=>{
    logging('/register')

    const body = validateRequest({ schema: UserSchema.insert, target: req.body, res })
    if(!body){return}

    const displayName = body.username
    const username = body.username.toLowerCase()
    const hashed = await bcrypt.hash(body.password, 10)
    const insertId = await UserModel.insert({ displayName, username, password: hashed })
    if(!insertId){return res.sendStatus(500)} 

    const accessToken = jwt.sign({ id: insertId }, process.env.JWT_SECRET, {expiresIn: "10m"})
    const refreshToken = randomUUID()

    const {ok:ok3} = await redisHelper.set("tokens", refreshToken, insertId)
    if(!ok3){return res.sendStatus(500)}
    res.cookie("refreshToken", refreshToken, refreshTokenOption)
    
    await incrbyRateLimit('register', req.ip)
    return res.status(201).json({accessToken})
})

authController.login = asyncHandler(async (req, res)=>{
    logging('/auth/login')
    
    const body = validateRequest({ schema: UserSchema.login, target: req.body, res })
    if(!body){return}

    const id = await UserModel.authenticateUser(body)
    if(!id){return res.status(400).json({error: "wrong username, email or password"})}
    
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '10m'})
    const refreshToken = randomUUID()

    const {ok:ok2} = await redisHelper.set('tokens', refreshToken, { id })
    if(!ok2){return res.sendStatus(500)}
    res.cookie('refreshToken', refreshToken, refreshTokenOption)

    await incrbyRateLimit('login', req.ip)
    return res.status(200).json({accessToken})
})

authController.logout = asyncHandler(async (req, res) => {
    logging('/auth/logout')
    const refreshToken = req.cookies.refreshToken
    
    await redisHelper.del('tokens', refreshToken)
    res.clearCookie("refreshToken", refreshTokenOption)
    

    return res.sendStatus(200)
})





authController.refresh = asyncHandler(async (req, res) => {
    logging('/auth/refresh')

    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){return res.sendStatus(401)}

    const {ok, data: payload} = await redisHelper.get('tokens', refreshToken)
    if(!ok){return res.sendStatus(401)}
    
    const isExist = await UserModel.validateUserId({id: payload.id})
    if(!isExist){
        await redisHelper.del('tokens', refreshToken)
        res.clearCookie("refreshToken", refreshTokenOption)

        return res.sendStatus(401)
    }

    const accessToken = jwt.sign({id: payload.id}, process.env.JWT_SECRET, {expiresIn: '10m'})

    return res.status(200).json({accessToken})
})

authController.verifyEmail = asyncHandler(async (req, res) => {
    logging('/auth/verify-email')

    const params = validateRequest({  schema: UserSchema.tokenParams, target: req.params, res })
    if(!params){return}
    const {token} = params

    const tokenHash = createHash('sha256').update(token).digest('hex')

    const {ok:ok2, data: payload} = await redisHelper.get('verify_email', tokenHash)
    if(!ok2){return res.sendStatus(400)}

    const {affectedRows, changedRows} = await UserModel.updateEmail(payload)
    await redisHelper.del('verify_email', tokenHash)
    if(affectedRows === 0){
        await redisHelper.del('profile', payload.id)
        return res.sendStatus(400)
    }
    if(changedRows === 0){return res.sendStatus(200)}

    await redisHelper.del('profile', payload.id)

    await incrbyRateLimit('verifyEmail', req.ip)
    return res.sendStatus(200)

})









authController.forgotPassword = asyncHandler(async (req, res) => {
    logging('/auth/forgot-password')
    
    const body = validateRequest({ schema: UserSchema.forgotPassword, target: req.body, res })
    if(!body){return}
    const { email } = body

    const id = await UserModel.getIdByEmail({ email })
    if(!id){
        await incrbyRateLimit('forgotPassword', req.ip)
        return res.sendStatus(200)
    }

    const token = randomBytes(32).toString('hex')
    const tokenHash = createHash('sha256').update(token).digest('hex')

    const {ok: ok2} = await redisHelper.set('reset_password', tokenHash, { id })
    if(!ok2){return res.sendStatus(500)}
    
    await sendMail.resetPassword({email, token})
    
    await incrbyRateLimit('forgotPassword', req.ip)
    return res.sendStatus(200)

})



authController.resetPassword = asyncHandler(async (req, res) => {
    logging('/auth/reset-password')

    const params = validateRequest({ schema: UserSchema.tokenParams, target: req.params, res})
    if(!params){return}
    const body = validateRequest({ schema: UserSchema.resetPassword, target: req.body, res })
    if(!body){return}

    const tokenHash = createHash('sha256').update(params.token).digest('hex')

    const {ok:ok2, data: payload} = await redisHelper.get('reset_password', tokenHash)
    if(!ok2){return res.status(400).json({error: "token invalid"})}

    const hashed = await bcrypt.hash(body.password, 10)
    const affectedRows = await UserModel.updatePassword({password: hashed, id: payload.id})
    await redisHelper.del('reset_password', tokenHash)
    if(affectedRows === 0){return res.sendStatus(400)}

    await incrbyRateLimit('resetPassword', req.ip)
    return res.sendStatus(200)

})