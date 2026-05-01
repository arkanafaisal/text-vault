import express from 'express'

import { rl } from '../middleware/rate-limit.js'
import { validate } from '../middleware/validate.js' 
import { feedbackController } from '../controller/feedback.controller.js'

export const feedbackRouter = express.Router()

feedbackRouter.post('/', rl, validate('createFeedback'),  feedbackController.create)