import * as DataModel from '../model/data-model.js'
import * as UserModel from '../model/user-model.js'
import * as DataSchema from '../schema/data-schema.js'
import * as UserSchema from '../schema/user-schema.js'
import * as redisHelper from '../utils/redis-helper.js'

import { response } from '../utils/response.js';
import { validate } from '../utils/validate.js';
import { logging } from '../utils/logging.js'
import { validateRequest } from '../utils/requestValidation.js'
import asyncHandler from 'express-async-handler'
import { incrbyRateLimit } from '../middleware/rate-limiting.js'
import { encrypt, decrypt, decryptHelper } from '../utils/crypto.js'


export const dataController = {};


dataController.getMyData = asyncHandler(async (req, res)=>{
    logging('/data/me')
    
    const query = validateRequest({ schema: DataSchema.query, target: req.query, res })
    if(!query){return}
    
    if(!(query.search || query.visibility !== undefined || query.page !== 1)){
        const {ok, data} = await redisHelper.get('allData', `${req.user.id}:${query.sort}:${query.page}`)
        if(ok){return res.status(200).json(data)}
    }


    const rows = await DataModel.getAll({ userId: req.user.id, query })
    if(!(query.search || query.visibility !== undefined || query.page !== 1)){
        await redisHelper.set('allData', `${req.user.id}:${query.sort}:${query.page}`, rows)
    }

    return res.status(200).json(rows)
})


dataController.getById = asyncHandler(async (req, res)=>{
    logging('/data/:id')
    
    const {ok, data} = await redisHelper.get('data', `${req.user.id}:${req.params.id}`)
    if(ok){
        const decrypted = decryptHelper(data)
        return res.status(200).json(decrypted)
    }

    const storedData = await DataModel.getById({ id: req.params.id, userId: req.user.id })
    if(!storedData){return res.sendStatus(404)}
    await redisHelper.set('data', `${req.user.id}:${req.params.id}`, storedData)

    const decrypted = decryptHelper(storedData)

    return res.status(200).json(decrypted)
})


dataController.create = asyncHandler(async (req, res)=>{
    logging('/data')

    const body = validateRequest({ schema: DataSchema.create, target: req.body, res })
    if(!body){return}

    const enc = encrypt(body.content)
    const insertId = await DataModel.create({ ...body, ...enc, userId: req.user.id })
    if(!insertId){return res.sendStatus(401)}

    await redisHelper.delPattern('allData', req.user.id)
    await incrbyRateLimit('createData', req.ip)
    return res.status(201).json({id: insertId, visibility: 'private', ...body})
})





dataController.updateCommon = asyncHandler(async (req, res)=>{
    logging('/data/:id')

    const body = validateRequest({ schema: DataSchema.updateCommon, target: req.body, res })
    if(!body){return}
    
    const enc = encrypt(body.content)
    const {affectedRows, changedRows, visibility} = await DataModel.updateCommon({  ...body, ...enc, id: req.params.id, userId: req.user.id })
    if(affectedRows === 0){
        const exists = await DataModel.isExist({ id: req.params.id })
        
        if(!exists){return res.sendStatus(404)}
        return res.sendStatus(403)
    }
    if(changedRows === 0){return res.status(400).json({error: "there's nothing to change"})}
    
    await redisHelper.del('data', `${req.user.id}:${req.params.id}`)
    if(body.title){await redisHelper.delPattern('allData', req.user.id)}
    if((body.title || body.content) && visibility === 'public'){await redisHelper.delPattern('publicData', req.user.id)}

    await incrbyRateLimit('updateCommon', req.ip)
    return res.sendStatus(200)
})


dataController.updateStatus = asyncHandler(async (req, res)=>{
    logging('/data/:id/status')

    const body = validateRequest({ schema: DataSchema.updateStatus, target: req.body, res })
    if(!body){return}

    const {affectedRows, changedRows} = await DataModel.updateStatus({ ...body, id: req.params.id, userId: req.user.id })
    if(affectedRows === 0){
        const exists = await DataModel.isExist({ id: req.params.id })
        
        if(!exists){return res.sendStatus(404)}
        return res.sendStatus(403)
    }
    if(changedRows === 0){return res.sendStatus(200)}

    await redisHelper.del('data', `${req.user.id}:${req.params.id}`)
    await redisHelper.delPattern('allData', req.user.id)
    await redisHelper.delPattern('publicData', req.user.id)

    await incrbyRateLimit('updateStatus', req.ip)
    return res.sendStatus(200)
})

dataController.delete = asyncHandler(async (req, res)=>{
    logging('/data/:id')

    const {affectedRows, visibility} = await DataModel.del({ id: req.params.id, userId: req.user.id })
    if(affectedRows === 0){return res.sendStatus(404)}

    await redisHelper.del('data', `${req.user.id}:${req.params.id}`)
    await redisHelper.delPattern('allData', req.user.id)
    if(visibility === 'public'){await redisHelper.delPattern('publicData', req.user.id)}

    await incrbyRateLimit('deleteData', req.ip)
    return res.sendStatus(200)
})