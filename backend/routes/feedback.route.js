import express from 'express'

import { rl } from '../middlewares/rate-limiter.middleware.js'
import { validate } from '../middlewares/validator.middleware.js' 
import { feedbackController } from '../controllers/feedback.controller.js'

export const feedbackRouter = express.Router()

feedbackRouter.post('/', rl, validate('createFeedback'),  feedbackController.create)