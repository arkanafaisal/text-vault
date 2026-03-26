import Joi from "joi"

export const username = Joi.string().trim().max(30).pattern(/^[a-zA-Z0-9]+$/)
export const email = Joi.string().trim().lowercase().email().max(255)
export const password = Joi.string().trim().min(6).max(255).required()
export const publicKey = Joi.string().trim().max(255).required()

export const token = Joi.string().trim().lowercase().length(64).hex().required()

export const insert = Joi.object({
    username: username.required(),
    password
})

export const login = Joi.object({
    identifier: Joi.alternatives().try(
      email,
      username
    ).required(),
    password
})

export const updateUsername = Joi.object({ username: username.required() })
export const updateEmail = Joi.object({email: email.required()})
export const updatePassword = Joi.object({oldPassword: password, newPassword: password})
export const updatePublicKey = Joi.object({ publicKey })
export const tokenParams = Joi.object({ token })
export const forgotPassword = Joi.object({ email: email.required() })
export const resetPassword = Joi.object({ password })