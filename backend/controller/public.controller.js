import asyncHandler from 'express-async-handler'
import { logging } from '../utils/logging.js'
import { validateRequest } from '../utils/requestValidation.js'

import { publicData } from '../schema/user-schema.js'
import { getPublicData } from '../model/data-model.js'

import * as redisHelper from '../utils/redis-helper.js'
import { getIdByUsernamePublickey } from '../model/user-model.js'
import { decryptHelper } from '../utils/crypto.js'
import { publicPagination } from '../schema/data-schema.js'


export const publicController = {}

publicController.getData = asyncHandler(async (req, res) => {
  logging('/public/data');

  const body = validateRequest({ schema: publicData, target: req.body, res });
  if (!body) return;
  const query = validateRequest({ schema: publicPagination, target: req.query, res })

  const userId = await getIdByUsernamePublickey(body);
  if (!userId) {
    return res.status(400).json({ error: "wrong username or public key" });
  }

  // const start = performance.now();

  const { ok, data } = await redisHelper.get('publicData', `${userId}:${query.page}`);

  if (ok) {
    // console.log("cache_hit");
    // console.log("cache_ms:", performance.now() - start);
    
    const decryptedData = []
    for(const row of data){
      const decrypted = decryptHelper(row)
      decryptedData.push(decrypted) 
    }
    return res.status(200).json(decryptedData);
  }

  // console.log("cache_miss");

  // const dbStart = performance.now();
  const datas = await getPublicData({ userId, ...query });
  // console.log("db_ms:", performance.now() - dbStart);

  // const setStart = performance.now();
  await redisHelper.set('publicData', `${userId}:${query.page}`, datas);
  // console.log("redis_set_ms:", performance.now() - setStart);

  if (datas.length === 0) {
    return res.sendStatus(404);
  }
  
  const decryptedData = []
  for(const data of datas){
    const decrypted = decryptHelper(data)
    decryptedData.push(decrypted) 
  }
  
  // console.log("miss_total_ms:", performance.now() - start);


  // console.log("response_ms:", performance.now() - start);

  return res.status(200).json(decryptedData);
});