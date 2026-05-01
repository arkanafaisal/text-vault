import express from 'express';

import { dataController } from '../controller/data.controller.js';
import jwtVerify from '../middleware/jwt-verify.js';
import { validate } from '../middleware/validate.js';
import { rl } from '../middleware/rate-limiting.js';





export const dataRouter = express.Router();


dataRouter.get('/me',           rl,    jwtVerify, validate('getMyData'),    dataController.getMyData)
dataRouter.get('/:id',          rl,    jwtVerify, validate('getById'),      dataController.getById)


dataRouter.post('/',            rl,    jwtVerify, validate('createData'),   dataController.create)
dataRouter.put('/:id',          rl,    jwtVerify, validate('updateCommon'), dataController.updateCommon)
dataRouter.patch('/:id/status', rl,    jwtVerify, validate('updateStatus'), dataController.updateStatus)

dataRouter.delete('/:id',       rl,    jwtVerify, validate('deleteData'),   dataController.delete)