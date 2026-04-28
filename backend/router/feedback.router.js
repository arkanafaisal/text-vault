import express from 'express'

import { limit } from '../middleware/rate-limiting.js'
import { feedbackController } from '../controller/feedback.controller.js'


export const feedbackRouter = express.Router()

feedbackRouter.post('/', limit('postFeedback'), feedbackController.create)