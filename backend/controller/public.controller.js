import asyncHandler from 'express-async-handler'
import { logging } from '../utils/logging.js'
import { validateRequest } from '../utils/requestValidation.js'

import { publicData } from '../schema/user-schema.js'
import { getPublicData } from '../model/data-model.js'

import * as redisHelper from '../utils/redis-helper.js'
import { getIdByUsernamePublickey } from '../model/user-model.js'


export const publicController = {}

publicController.getData = asyncHandler(async (req, res)=>{
    logging('/public/data')

    const body = validateRequest({ schema: publicData, target: req.body, res })
    if(!body){return}


    const userId = await getIdByUsernamePublickey({ ...body, username: body.username.toLowerCase() })
    if(!userId){return res.status(400).json({ error: "wrong username or public key" })}
    
    const {ok, data} = await redisHelper.get('publicData', userId)
    if(ok){return res.status(200).json(data)}

    const datas = await getPublicData({ userId })
    await redisHelper.set('publicData', userId, datas)

    if(datas.length === 0){return res.sendStatus(404)}
    return res.status(200).json(datas)
})