import Joi from "joi";

const message = Joi.string().trim().min(10).max(300).required()

export const create = Joi.object({ message })