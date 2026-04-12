import asyncHandler from 'express-async-handler'
import { logging } from '../utils/logging.js'
import { validateRequest } from '../utils/requestValidation.js'

import { publicData } from '../schema/user-schema.js'
import { getPublicData } from '../model/data-model.js'

import * as redisHelper from '../utils/redis-helper.js'
import { getIdByUsernamePublickey } from '../model/user-model.js'


export const publicController = {}

publicController.getData = asyncHandler(async (req, res) => {
  logging('/public/data');

  const body = validateRequest({
    schema: publicData,
    target: req.body,
    res
  });
  if (!body) return;

  const userId = await getIdByUsernamePublickey(body);
  if (!userId) {
    return res.status(400).json({ error: "wrong username or public key" });
  }

  // const start = performance.now();

  const { ok, data } = await redisHelper.get('publicData', userId);

  if (ok) {
    // console.log("cache_hit");
    // console.log("cache_ms:", performance.now() - start);

    return res.status(200).json(data);
  }

  // console.log("cache_miss");

  // const dbStart = performance.now();
  const datas = await getPublicData({ userId });
  // console.log("db_ms:", performance.now() - dbStart);

  // const setStart = performance.now();
  await redisHelper.set('publicData', userId, datas);
  // console.log("redis_set_ms:", performance.now() - setStart);

  // console.log("miss_total_ms:", performance.now() - start);

  if (datas.length === 0) {
    return res.sendStatus(404);
  }

  // console.log("response_ms:", performance.now() - start);

  return res.status(200).json(datas);
});