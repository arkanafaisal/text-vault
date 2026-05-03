import asyncHandler from 'express-async-handler'

import * as redisHelper from '../helpers/redis.helper.js'
import { getIdByUsernamePublickey } from '../models/user.model.js'
import { getPublicData } from '../models/data.model.js'
import { decryptHelper } from '../utils/crypto.util.js'
import { logger } from '../libs/logger.lib.js'


export const publicController = {}

publicController.get = asyncHandler(async (req, res) => {
  const { username, publicKey } = req.validated.body
  const { page } = req.validated.query

  const userId = await getIdByUsernamePublickey({ username, publicKey });
  if (!userId) {
    return res.status(400).json({ error: "wrong username or public key" });
  }

  // const start = performance.now();

  const { ok, data } = await redisHelper.get('publicData', `${userId}:${page}`);

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
  const datas = await getPublicData({ userId, page });
  // console.log("db_ms:", performance.now() - dbStart);

  // const setStart = performance.now();
  await redisHelper.set('publicData', `${userId}:${page}`, datas);
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