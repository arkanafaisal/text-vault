import express from 'express'
import { limit } from '../middleware/rate-limiting.js'

import { publicController } from '../controller/public.controller.js'


export const publicRouter = express.Router()



publicRouter.post('/data', limit('publicData'), publicController.getData)