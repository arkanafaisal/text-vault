import express from 'express';

import { dataController } from '../controller/data.controller.js';
import jwtVerify from '../middleware/jwt-verify.js';
import { limit } from '../middleware/rate-limiting.js';
import { validateRequest } from '../middleware/validate.js';






export const dataRouter = express.Router();


dataRouter.get('/me',           limit('getMyData'),     jwtVerify, validateRequest('getMyData'),    dataController.getMyData)
dataRouter.get('/:id',          limit('getById'),       jwtVerify, validateRequest('getById'),      dataController.getById)


dataRouter.post('/',            limit('createData'),    jwtVerify, validateRequest('createData'),   dataController.create)
dataRouter.put('/:id',          limit('updateCommon'),  jwtVerify, validateRequest('updateCommon'), dataController.updateCommon)
dataRouter.patch('/:id/status', limit('updateStatus'),  jwtVerify, validateRequest('updateStatus'), dataController.updateStatus)

dataRouter.delete('/:id',       limit('deleteData'),    jwtVerify, validateRequest('deleteData'),   dataController.delete)