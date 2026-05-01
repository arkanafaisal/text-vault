import express from 'express'

import { rl } from '../middleware/rate-limiting.js'
import { feedbackController } from '../controller/feedback.controller.js'
import { validate } from '../middleware/validate.js' 

export const feedbackRouter = express.Router()

feedbackRouter.post('/', rl, validate('createFeedback'),  feedbackController.create)