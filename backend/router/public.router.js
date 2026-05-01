import express from 'express'

import { rl } from '../middleware/rate-limiting.js'
import { validate } from '../middleware/validate.js'
import { publicController } from '../controller/public.controller.js'

export const publicRouter = express.Router()



publicRouter.post('/data', rl, validate('getPublicData'), publicController.get)