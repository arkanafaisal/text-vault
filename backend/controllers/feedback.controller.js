import asyncHandler from "express-async-handler"
import { logger } from "../libs/logger.lib.js"

import * as FeedbackModel from '../models/feedback.model.js'



export const feedbackController = {}



feedbackController.create = asyncHandler(async (req, res)=>{
    const { message } = req.validated.body

    
    const insertId = await FeedbackModel.create({ message })

    logger.info({ip: req.ip}, 'feedback created')
    return res.sendStatus(200)
})