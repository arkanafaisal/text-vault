import { randomUUID, createHash, randomBytes } from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

import * as UserSchema from '../schema/user-schema.js'
import * as UserModel from '../model/user-model.js'
import * as redisHelper from '../utils/redis-helper.js'

import { sendMail } from '../utils/mailer.js';
import { incrbyRateLimit } from '../middleware/rate-limiting.js';
import { validate } from '../utils/validate.js';

import { response } from '../utils/response.js';
import { logging } from '../utils/logging.js'

export const authController = {}

const refreshTokenOption = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development"? 'none' : 'Lax',
    secure: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
}

const responses = {
    invalidFormat: async (res, message)=>{return response(res, false, 400, message)},
    serverError: async (res)=>{return response(res, false, 500, "server error")},

    register: {
        failed: async (res)=>{return response(res, false, 500, "register failed")},
        success: async (res, accessToken)=>{return response(res, true, 200, "register success", accessToken)},
        duplicate: async (res)=>{return response(res, false, 409, "username taken")},
    },
    login: {
        failed: async (res)=>{return response(res, false, 500, "login failed")},
        wrongCredentials: async (res)=>{return response(res, false, 400, "wrong username, email or password")},
        success: async (res, accessToken)=>{return response(res, true, 200, "login success", accessToken)},
    },
    logout: {
        success: async (res)=>{return response(res, true, 200, "logout success")},
    },
    refresh:{
        unauthorized: async (res)=>{return response(res, false, 401, "welcome")},
        forbidden: async (res)=>{return response(res, false, 403, "user not found")},
        success: async (res, accessToken)=>{return response(res, true, 200, "access token created", accessToken)},
    },
    verifyEmail: {
        invalidToken: async (res)=>{return response(res, false, 400, "token invalid")},
        duplicate: async (res)=>{return response(res, false, 409, "email taken")},
        userNotFound: async (res)=>{return response(res, false, 404, "user not found")},
        success: async (res)=>{return response(res, true, 200, "email verified")}
    },
    forgotPassword: {
        success: async (res)=>{return response(res, true, 200, "reset link sent if email exists")}
    },
    resetPassword: {
        invalidToken: async (res)=>{return response(res, false, 400, "token invalid")},
        userNotFound: async (res)=>{return response(res, false, 404, "user not found")},
        success: async (res)=>{return response(res, true, 200, "password changed")},
    }
}


authController.register = async (req, res)=>{
    logging('/register')
    const {ok, message, value: userRequest} = validate(UserSchema.insert, req.body)
    if(!ok){return responses.invalidFormat(res, message)}

    try{
        const hashed = await bcrypt.hash(userRequest.password, 10)
        const display_name = userRequest.username.toLowerCase()
        const insertId = await UserModel.insert({ display_name, username: userRequest.username, password: hashed })
        if(!insertId){return responses.register.failed(res)} 

        const accessToken = jwt.sign({ id: insertId }, process.env.JWT_SECRET, {expiresIn: "10m"})
        const refreshToken = randomUUID()

        const {ok:ok3} = await redisHelper.set("tokens", refreshToken, insertId)
        if(!ok3){return responses.serverError(res)}
        res.cookie("refreshToken", refreshToken, refreshTokenOption)
        
        await incrbyRateLimit('register', req.ip)
        return responses.register.success(res, accessToken)
    } catch(err) {
        if(err.message === "duplicate"){return responses.register.duplicate(res)}
        console.log(err)
        return responses.serverError(res)
    }
}

authController.login = async (req, res)=>{
    logging('/auth/login')
    const {ok, message, value: userRequest} = validate(UserSchema.login, req.body)
    if(!ok){return responses.invalidFormat(res, message)}

    try{
        const id = await UserModel.authenticateUser(userRequest)
        if(!id){return responses.login.wrongCredentials(res)}
        
        const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '10m'})
        const refreshToken = randomUUID()

        const {ok:ok2} = await redisHelper.set('tokens', refreshToken, { id })
        if(!ok2){return responses.serverError(res)}
        res.cookie('refreshToken', refreshToken, refreshTokenOption)

        await incrbyRateLimit('login', req.ip)
        return responses.login.success(res, accessToken)
    } catch(err) {
        console.log(err)
        return responses.serverError(res)
    }
}

authController.logout = async (req, res) => {
    logging('/auth/logout')
    const refreshToken = req.cookies.refreshToken
    
    await redisHelper.del('tokens', refreshToken)
    res.clearCookie("refreshToken", refreshTokenOption)
    

    return responses.logout.success(res)
}





authController.refresh = async (req, res) => {
    logging('/auth/refresh')

    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){return responses.refresh.unauthorized(res)}
    try {
        const {ok, data: payload} = await redisHelper.get('tokens', refreshToken)
        if(!ok){return responses.refresh.forbidden(res)}
        
        const isExist = await UserModel.validateUserId({id: payload.id})
        if(!isExist){
            await redisHelper.del('tokens', refreshToken)
            res.clearCookie("refreshToken", refreshTokenOption)

            return responses.refresh.forbidden(res)
        }

        const accessToken = jwt.sign({id: payload.id}, process.env.JWT_SECRET, {expiresIn: '10m'})

        return responses.refresh.success(res, accessToken)
    } catch(err) {
        console.log(err)
        return responses.serverError(res)
    }
}

authController.verifyEmail = async (req, res) => {
    console.log(req.params)
    const {ok, value: {token}} = validate(UserSchema.tokenParams, req.params)
    if(!ok){return responses.verifyEmail.invalidToken(res)}

    try{
        const tokenHash = createHash('sha256').update(token).digest('hex')

        const {ok:ok2, data: payload} = await redisHelper.get('verify_email', tokenHash)
        if(!ok2){return responses.verifyEmail.invalidToken(res)}

        const {affectedRows, changedRows} = await UserModel.updateEmail(payload)
        await redisHelper.del('verify_email', tokenHash)
        if(affectedRows === 0){
            await redisHelper.del('profile', payload.id)
            return responses.verifyEmail.userNotFound(res)
        }
        if(changedRows === 0){return responses.verifyEmail.success(res)}

        await redisHelper.del('profile', payload.id)

        await incrbyRateLimit('verifyEmail', req.ip)
        return responses.verifyEmail.success(res)
    } catch(err){
        if(err.message === 'duplicate'){return responses.verifyEmail.duplicate(res)}
        console.log(err)
        return responses.serverError(res)
    }
}









authController.forgotPassword = async (req, res) => {
    logging('/auth/forgot-password')
    const {ok, message, value: { email }} = validate(UserSchema.forgotPassword, req.body)
    if(!ok){return responses.invalidFormat(res, message)}

    try {
        const id = await UserModel.getIdByEmail({ email })
        if(!id){return responses.forgotPassword.success(res)}

        const token = randomBytes(32).toString('hex')
        const tokenHash = createHash('sha256').update(token).digest('hex')

        const {ok: ok2} = await redisHelper.set('reset_password', tokenHash, { id })
        if(!ok2){return responses.serverError(res)}
        
        await sendMail.resetPassword({email, token})
        
        await incrbyRateLimit('forgotPassword', req.ip)
        return responses.forgotPassword.success(res)
    } catch(err) {
        console.log(err)
        return responses.serverError(res)
    }
}



authController.resetPassword = async (req, res) => {
    logging('/auth/reset-password')

    const {ok, value: params} = validate(UserSchema.tokenParams, req.params)
    if(!ok){return responses.verifyEmail.invalidToken(res)}

    try {
        const tokenHash = createHash('sha256').update(params.token).digest('hex')

        const {ok:ok2, data: payload} = await redisHelper.get('reset_password', tokenHash)
        if(!ok2){return responses.verifyEmail.invalidToken(res)}

        const {ok, message, value: body} = validate(UserSchema.resetPassword, req.body)
        if(!ok){return responses.invalidFormat(res, message)}

        const hashed = await bcrypt.hash(body.password, 10)
        const affectedRows = await UserModel.updatePassword({password: hashed, id: payload.id})
        await redisHelper.del('reset_password', tokenHash)
        if(affectedRows === 0){return responses.resetPassword.userNotFound(res)}

        await incrbyRateLimit('resetPassword', req.ip)
        return responses.resetPassword.success(res)

    } catch(err) {
        console.log(err)
        return responses.serverError(res)
    }
}