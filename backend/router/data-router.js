import express from 'express';

import { dataController } from '../controller/data-controller.js';
import jwtVerify from '../middleware/jwt-verify.js';
import { limit } from '../middleware/rate-limiting.js';






export const dataRouter = express.Router();