import * as DataModel from '../model/data-model.js'
import * as UserModel from '../model/user-model.js'
import * as DataSchema from '../schema/data-schema.js'
import * as UserSchema from '../schema/user-schema.js'
import * as redisHelper from '../utils/redis-helper.js'

import { response } from '../utils/response.js';
import { validate } from '../utils/validate.js';
import { logger } from '../config/logger.js'
import { validateRequest } from '../utils/requestValidation.js'
import asyncHandler from 'express-async-handler'
import { incrbyRateLimit } from '../middleware/rate-limiting.js'
import { encrypt, decrypt, decryptHelper } from '../utils/crypto.js'


export const dataController = {};


dataController.getMyData = asyncHandler(async (req, res)=>{
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
    const { id } = req.validated.params

    const {ok, data} = await redisHelper.get('data', `${req.user.id}:${id}`)
    if(ok){
        const decrypted = decryptHelper(data)
        return res.status(200).json(decrypted)
    }

    const storedData = await DataModel.getById({ id, userId: req.user.id })
    if(!storedData){return res.sendStatus(404)}
    await redisHelper.set('data', `${req.user.id}:${id}`, storedData)

    const decrypted = decryptHelper(storedData)

    return res.status(200).json(decrypted)
})


dataController.create = asyncHandler(async (req, res)=>{
    const { title, content, tags } = req.validated.body

    const enc = encrypt(content)
    const insertId = await DataModel.create({ title, tags, ...enc, userId: req.user.id })
    if(!insertId){return res.sendStatus(401)}

    await redisHelper.delPattern('allData', req.user.id)
    await incrbyRateLimit('createData', req.ip)

    logger.info({ id: insertId, userId: req.user.id }, 'create data success')
    return res.status(201).json({id: insertId, visibility: 'private', title, tags})
})





dataController.updateCommon = asyncHandler(async (req, res)=>{
    const { title, content, tags } = req.validated.body
    const { id } = req.validated.params
    
    const enc = typeof content === 'string'? encrypt(content) : {}
    const {affectedRows, changedRows, visibility} = await DataModel.updateCommon({  title, tags, ...enc, id, userId: req.user.id })
    if(affectedRows === 0){
        const exists = await DataModel.isExist({ id })
        
        if(!exists){return res.sendStatus(404)}

        logger.warn({ userId: req.user.id }, 'violation attempt: unauthorized data access')
        return res.sendStatus(403)
    }
    if(changedRows === 0){return res.status(400).json({error: "there's nothing to change"})}
    
    await redisHelper.del('data', `${req.user.id}:${id}`)
    if(title){await redisHelper.delPattern('allData', req.user.id)}
    if((title || content) && visibility === 'public'){await redisHelper.delPattern('publicData', req.user.id)}

    await incrbyRateLimit('updateCommon', req.ip)

    logger.info({ id, userId: req.user.id }, 'update common data success')
    return res.sendStatus(200)
})


dataController.updateStatus = asyncHandler(async (req, res)=>{
    const { visibility } = req.validated.body
    const { id } = req.validated.params

    const {affectedRows, changedRows} = await DataModel.updateStatus({ visibility, id, userId: req.user.id })
    if(affectedRows === 0){
        const exists = await DataModel.isExist({ id })
        
        if(!exists){return res.sendStatus(404)}

        logger.warn({ userId: req.user.id }, 'violation attempt: unauthorized data access')
        return res.sendStatus(403)
    }
    if(changedRows === 0){return res.status(400).json({error: "there's nothing to change"})}

    await redisHelper.del('data', `${req.user.id}:${req.params.id}`)
    await redisHelper.delPattern('allData', req.user.id)
    await redisHelper.delPattern('publicData', req.user.id)

    await incrbyRateLimit('updateStatus', req.ip)

    logger.info({ id, userId: req.user.id }, "update status data success")
    return res.sendStatus(200)
})

dataController.delete = asyncHandler(async (req, res)=>{
    const { id } = req.validated.params

    const {affectedRows, visibility} = await DataModel.del({ id, userId: req.user.id })
    if(affectedRows === 0){return res.sendStatus(404)}

    await redisHelper.del('data', `${req.user.id}:${id}`)
    await redisHelper.delPattern('allData', req.user.id)
    if(visibility === 'public'){await redisHelper.delPattern('publicData', req.user.id)}

    await incrbyRateLimit('deleteData', req.ip)

    logger.info({ id, userId: req.user.id }, "delete data success")
    return res.sendStatus(200)
})