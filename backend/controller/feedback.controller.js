import asyncHandler from "express-async-handler"
import { logger } from "../config/logger.js"

import * as FeedbackModel from '../model/feedback-model.js'
import * as FeedbackSchema from '../schema/feedback-schema.js'



export const feedbackController = {}



feedbackController.create = asyncHandler(async (req, res)=>{
    const { message } = req.validated.body

    
    const insertId = await FeedbackModel.create({ message })

    logger.info({ip: req.ip}, 'feedback created')
    return res.sendStatus(200)
})