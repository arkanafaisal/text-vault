import express from 'express'

import { rl } from '../middlewares/rate-limiter.middleware.js'
import { validate } from '../middlewares/validator.middleware.js'
import { publicController } from '../controllers/public.controller.js'

export const publicRouter = express.Router()



publicRouter.post('/data', rl, validate('getPublicData'), publicController.get)