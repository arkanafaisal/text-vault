import express from 'express';

import { rl } from '../middleware/rate-limit.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { dataController } from '../controller/data.controller.js';





export const dataRouter = express.Router();


dataRouter.get('/me',           rl,    authenticate, validate('getMyData'),    dataController.getMyData)
dataRouter.get('/:id',          rl,    authenticate, validate('getById'),      dataController.getById)


dataRouter.post('/',            rl,    authenticate, validate('createData'),   dataController.create)
dataRouter.put('/:id',          rl,    authenticate, validate('updateCommon'), dataController.updateCommon)
dataRouter.patch('/:id/status', rl,    authenticate, validate('updateStatus'), dataController.updateStatus)

dataRouter.delete('/:id',       rl,    authenticate, validate('deleteData'),   dataController.delete)