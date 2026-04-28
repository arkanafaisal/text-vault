import asyncHandler from "express-async-handler"
import { logging } from "../utils/logging.js"

import * as FeedbackModel from '../model/feedback-model.js'
import * as FeedbackSchema from '../schema/feedback-schema.js'
import { validateRequest } from "../utils/requestValidation.js"



export const feedbackController = {}



feedbackController.create = asyncHandler(async (req, res)=>{
    logging('/feedback')

    const body = validateRequest({ schema: FeedbackSchema.create, target: req.body, res })
    if(!body){return}

    const insertId = await FeedbackModel.create(body)
    if(!insertId){return res.sendStatus(500)}

    return res.sendStatus(200)
})