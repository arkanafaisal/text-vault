import { randomBytes, createHash } from "crypto"
import bcrypt from "bcrypt"

import * as UserModel from '../model/user-model.js'
import * as userSchema from '../schema/user-schema.js'
import * as redisHelper from '../utils/redis-helper.js'

import { incrbyRateLimit } from "../middleware/rate-limiting.js"
import { sendMail } from "../utils/mailer.js";
import { validate } from '../utils/validate.js';
import { response } from "../utils/response.js"; 
import { logging } from "../utils/logging.js"

export const userController = {}

const responses = {
    invalidFormat: async (res, message)=>{return response(res, false, 400, message)},
    serverError: async (res)=>{return response(res, false, 500, "server error")},
    forbidden: async (res)=>{return response(res, false, 403, "user not found")},
    
    updateSuccess: async (res)=>{return response(res, true, 200, "updated")},
    duplicate: async (res)=>{return response(res, true, 400, "already taken")},
    nothingChanged: async (res)=>{return response(res, false, 400, "there's nothing to change")},

    getMyProfile: {
        success: async (res, user)=>{return response(res, true, 200, 'profile retrieved', user)}
    },
    updatePassword: {
        wrongCredentials: async (res)=>{return response(res, false, 400, "wrong password")},
    },
    sendEmailVerification: {
        success: async (res)=>{return response(res, true, 200, "verification link sent")}
    }
}

userController.getMyProfile = async (req, res)=> {
    logging('/users/me')
    try{
        const {ok, data} = await redisHelper.get('profile', req.user.id)
        if(ok){return responses.getMyProfile.success(res, data)}

        const user = await UserModel.getUserById({id: req.user.id})
        if(!user){return responses.forbidden(res)}

        await redisHelper.set('profile', req.user.id, user)
        return responses.getMyProfile.success(res, user)
    } catch(err) {
        console.log(err)
        return response(res, false, "server error", null, 500)
    }
}


userController.updateUsername = async (req, res) => {
    logging('/users/me/username')
    const {ok, message, value: {username}} = validate(userSchema.updateUsername, req.body)
    if(!ok){return responses.invalidFormat(res, message)}

    try{
        const display_name = username
        const {affectedRows, changedRows} = await UserModel.updateUsername({display_name, username: username.toLowerCase(), id: req.user.id})
        if(affectedRows === 0){return responses.forbidden(res)}

        await incrbyRateLimit('updateUsername', req.ip)
        if(changedRows === 0){return responses.updateSuccess(res)}

        await redisHelper.del('profile', req.user.id)
        await redisHelper.del('publicData', req.user.id)

        return responses.updateSuccess(res)
    } catch(err){
        if(err.message === 'duplicate'){return responses.duplicate(res)}
        return responses.serverError(res)
    }
}

userController.updatePassword = async (req, res) => {
    logging('/users/me/password')

    const {ok, message, value: { oldPassword, newPassword }} = validate(userSchema.updatePassword, req.body)
    if(!ok){return responses.invalidFormat(res, message)}

    try {
        const user = await UserModel.getPasswordById({ id: req.user.id })
        if(!user){return responses.forbidden(res)}

        const match = await bcrypt.compare(oldPassword, user.password)
        if(!match){return responses.updatePassword.wrongCredentials(res)}
    
        const hashed = await bcrypt.hash(newPassword, 10)
        const affectedRows = await UserModel.updatePassword({ password: hashed, id: req.user.id })
        if(affectedRows === 0){return responses.forbidden(res)}

        await incrbyRateLimit('updatePassword', req.ip)
        return responses.updateSuccess(res)
    } catch (error) {
        console.log(error)
        return responses.serverError(res)
    }
}


userController.updatePublicKey = async (req, res) => {
    logging('/users/me/publicKey')
    const {ok, message, value: {publicKey}} = validate(userSchema.updatePublicKey, req.body)
    if(!ok){return responses.invalidFormat(res, message)}
    
    try{
        const {affectedRows, changedRows} = await UserModel.updatePublicKey({publicKey, id: req.user.id})
        if(affectedRows === 0){return responses.forbidden(res)}

        await incrbyRateLimit('updatePublicKey', req.ip)
        if(changedRows === 0){return responses.updateSuccess(res)}
    
        await redisHelper.del('profile', req.user.id)
        await redisHelper.del('publicData', req.user.id)
        
        return responses.updateSuccess(res)
    } catch(err) {
        console.log(err)
        return responses.serverError(res)
    }
}


userController.sendEmailVerification = async (req, res) => {
    logging('/users/me/email')

    const {ok, message, value: { email }} = await validate(userSchema.updateEmail, req.body)
    if(!ok){return responses.invalidFormat(res, message)}

    try{
        const isExist = await UserModel.validateEmail({ email })
        if(isExist) return responses.duplicate(res)
        
        const user = await UserModel.getUserById({ id: req.user.id })
        if(!user){return responses.forbidden(res)}
        if(user.email === email){return responses.nothingChanged(res)}

        const token = randomBytes(32).toString('hex')
        const tokenHash = createHash('sha256').update(token).digest('hex')

        const {ok: ok2} = await redisHelper.set('verify_email', tokenHash, {id: req.user.id, email})
        if(!ok2){return responses.serverError(res)}

        await sendMail.verifyEmail({email, token})

        await incrbyRateLimit('sendEmailVerification', req.ip)
        return responses.sendEmailVerification.success(res)
    } catch(err){
        console.log(err)
        return responses.serverError(res)
    }
}













userController.checkUsernameExist = async (req, res) => {
    const {ok, message, value: username} = validate(userSchema.username, req.params.username)
    if(!ok){return response(res, false, message)}

    try {
        const isExist = await UserModel.validateUsername({username})
        if(!isExist) return response(res, false, "user not found")

        return response(res, true, "user found", username)
    } catch(err) {
        console.log(err)
        return response(res, false, "server error", null, 500)
    }
}