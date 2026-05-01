import express from 'express';

import { rl } from '../middlewares/rate-limiter.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { dataController } from '../controllers/data.controller.js';





export const dataRouter = express.Router();


dataRouter.get('/me',           rl,    authenticate, validate('getMyData'),    dataController.getMyData)
dataRouter.get('/:id',          rl,    authenticate, validate('getById'),      dataController.getById)


dataRouter.post('/',            rl,    authenticate, validate('createData'),   dataController.create)
dataRouter.put('/:id',          rl,    authenticate, validate('updateCommon'), dataController.updateCommon)
dataRouter.patch('/:id/status', rl,    authenticate, validate('updateStatus'), dataController.updateStatus)

dataRouter.delete('/:id',       rl,    authenticate, validate('deleteData'),   dataController.delete)