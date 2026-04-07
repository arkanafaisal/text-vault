import express from 'express';

import { dataController } from '../controller/data.controller.js';
import jwtVerify from '../middleware/jwt-verify.js';
import { limit } from '../middleware/rate-limiting.js';






export const dataRouter = express.Router();


dataRouter.get('/me', limit('getMyData'), jwtVerify, dataController.getMyData)
dataRouter.get('/:id', limit('getById'), jwtVerify, dataController.getById)


dataRouter.post('/', limit('createData'), jwtVerify, dataController.create)
dataRouter.put('/:id', limit('updateCommon'), jwtVerify, dataController.updateCommon)
dataRouter.patch('/:id/status', limit('updateStatus'), jwtVerify, dataController.updateStatus)

dataRouter.delete('/:id', limit('deleteData'), jwtVerify, dataController.delete)