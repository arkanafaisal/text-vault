import { randomBytes, createHash } from "crypto"
import bcrypt from "bcrypt"

import * as UserModel from '../model/user-model.js'
import * as UserSchema from '../schema/user-schema.js'
import * as redisHelper from '../utils/redis-helper.js'

import { incrbyRateLimit } from "../middleware/rate-limiting.js"
import { sendMail } from "../utils/mailer.js";
import { validate } from '../utils/validate.js';
import { response } from "../utils/response.js"; 
import { logging } from "../utils/logging.js"
import { validateRequest } from "../utils/requestValidation.js"
import asyncHandler from "express-async-handler"

export const userController = {}

userController.getMyProfile = asyncHandler(async (req, res)=> {
    logging('/users/me')

    const {ok, data} = await redisHelper.get('profile', req.user.id)
    if(ok){return res.status(200).json(data)}

    const user = await UserModel.getUserById({id: req.user.id})
    if(!user){return response.sendStatus(401)}

    await redisHelper.set('profile', req.user.id, user)
    return res.status(200).json(user)
})


userController.updateUsername = asyncHandler(async (req, res) => {
    logging('/users/me/username')
    
    const body = validateRequest({ schema: UserSchema.updateUsername, target: req.body, res })
    if(!body){return}
    const { username } = body

    const displayName = username
    const {affectedRows, changedRows} = await UserModel.updateUsername({displayName, username: username.toLowerCase(), id: req.user.id})
    if(affectedRows === 0){return res.sendStatus(401)}

    await incrbyRateLimit('updateUsername', req.ip)
    if(changedRows === 0){return res.sendStatus(200)}

    await redisHelper.del('profile', req.user.id)
    await redisHelper.del('publicData', req.user.id)

    return res.sendStatus(200)
})

userController.updatePassword = asyncHandler(async (req, res) => {
    logging('/users/me/password')

    const body = validateRequest({ schema: UserSchema.updatePassword, target: req.body, res })
    if(!body){return}
    const { oldPassword, newPassword } = body 

    const user = await UserModel.getPasswordById({ id: req.user.id })
    if(!user){return res.sendStatus(401)}

    const match = await bcrypt.compare(oldPassword, user.password)
    if(!match){return res.status(400).json({error: "wrong password"})}

    const hashed = await bcrypt.hash(newPassword, 10)
    const affectedRows = await UserModel.updatePassword({ password: hashed, id: req.user.id })
    await incrbyRateLimit('updatePassword', req.ip)
    if(affectedRows === 0){return res.sendStatus(401)}

    return res.sendStatus(200)
})


userController.updatePublicKey = asyncHandler(async (req, res) => {
    logging('/users/me/publicKey')

    const body = validateRequest({ schema: UserSchema.updatePublicKey, target: req.body, res })
    if(!body){return}
    const { publicKey } = body

    const {affectedRows, changedRows} = await UserModel.updatePublicKey({publicKey, id: req.user.id})
    if(affectedRows === 0){return res.sendStatus(401)}

    await incrbyRateLimit('updatePublicKey', req.ip)
    if(changedRows === 0){return res.sendStatus(200)}

    await redisHelper.del('profile', req.user.id)
    await redisHelper.del('publicData', req.user.id)
    
    return res.sendStatus(200)
})


userController.sendEmailVerification = asyncHandler(async (req, res) => {
    logging('/users/me/email')

    const body = validateRequest({ schema: UserSchema.updateEmail, target: req.body, res })
    if(!body){return}
    const { email } = body

    const isExist = await UserModel.validateEmail({ email })
    if(isExist) return res.sendStatus(409)
    
    const user = await UserModel.getUserById({ id: req.user.id })
    if(!user){return res.sendStatus(401)}
    if(user.email === email){return res.sendStatus(200)}

    const token = randomBytes(32).toString('hex')
    const tokenHash = createHash('sha256').update(token).digest('hex')

    const {ok: ok2} = await redisHelper.set('verify_email', tokenHash, {id: req.user.id, email})
    if(!ok2){return res.sendStatus(500)}

    await sendMail.verifyEmail({email, token})

    await incrbyRateLimit('sendEmailVerification', req.ip)
    return res.sendStatus(200)
})