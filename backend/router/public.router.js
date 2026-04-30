import express from 'express'
import { limit } from '../middleware/rate-limiting.js'

import { publicController } from '../controller/public.controller.js'
import { validateRequest } from '../middleware/validate.js'

export const publicRouter = express.Router()



publicRouter.post('/data', limit('getPublicData'), validateRequest('getPublicData'), publicController.get)