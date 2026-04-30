import express from 'express'

import { limit } from '../middleware/rate-limiting.js'
import { feedbackController } from '../controller/feedback.controller.js'
import { validateRequest } from '../middleware/validate.js' 

export const feedbackRouter = express.Router()

feedbackRouter.post('/', limit('createFeedback'), validateRequest('createFeedback'),  feedbackController.create)