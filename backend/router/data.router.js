import express from 'express';

import { dataController } from '../controller/data.controller.js';
import jwtVerify from '../middleware/jwt-verify.js';
import { limit } from '../middleware/rate-limiting.js';
import { validate } from '../middleware/validate.js';






export const dataRouter = express.Router();


dataRouter.get('/me',           limit('getMyData'),     jwtVerify, validate('getMyData'),    dataController.getMyData)
dataRouter.get('/:id',          limit('getById'),       jwtVerify, validate('getById'),      dataController.getById)


dataRouter.post('/',            limit('createData'),    jwtVerify, validate('createData'),   dataController.create)
dataRouter.put('/:id',          limit('updateCommon'),  jwtVerify, validate('updateCommon'), dataController.updateCommon)
dataRouter.patch('/:id/status', limit('updateStatus'),  jwtVerify, validate('updateStatus'), dataController.updateStatus)

dataRouter.delete('/:id',       limit('deleteData'),    jwtVerify, validate('deleteData'),   dataController.delete)