import { logger } from "../libs/logger.lib.js"
import redis from "../libs/redis.lib.js"

const base = process.env.PROJECT_NAME
const redisType = {
    "cache": {prefix: 'databox:cache:', ttl: 60 * 10},
    "tokens": {prefix: base + ':tokens:', ttl: 60 * 60 * 168},
    "verify_email": {prefix: base + ':verify_email:', ttl: 60 * 15},
    "reset_password": {prefix: base + ':reset_password:', ttl: 60 * 15},

    profile: {prefix: base + ':cache:profile:', ttl: 60 * 60},
    allData: {prefix: base + ':cache:all_data:', ttl: 60 * 10},
    data: {prefix: base + ':cache:data:', ttl: 60 * 10},
    publicData: {prefix: base + ':cache:public_data:', ttl: 60 * 60 * 6},
}
const cacheTypes = ['profile', 'allData', 'data', 'publicData']

function getPrefix(type){
    const prefix = redisType[type]?.prefix

    if(!prefix){throw new Error('redis type error')}

    return prefix
}

export async function get(type, key){
    try {
        const prefix = getPrefix(type)
        const rawData = await redis.get(prefix + key)
        if(!rawData){return {ok: false}}
        
        logger.trace({ key: prefix + key }, 'redis cache used')
        return {ok: true, data: JSON.parse(rawData)}
    } catch(err) {
        if(cacheTypes.includes(type)){
            logger.debug(err, "redis cache GET error")
            return {ok: false} 
        }

        logger.error(err, "redis GET error")
        throw err
    }
}

export async function set(type, key, data){
    try {
        await redis.set(getPrefix(type) + key, JSON.stringify(data), {"EX": redisType[type].ttl})
        return {ok: true} 
    } catch (err) {
        if(cacheTypes.includes(type)){logger.debug(err, "redis cache SET error")}
        return {ok: false}
    }
}

export async function del(type, key){
    try {
        await redis.del(getPrefix(type) + key)
        return {ok: true} 
    } catch (err) {
        logger.warn(err, 'redis DEL error')
        return {ok: false}
    }
}



export async function delPattern(type, key) {
    const pattern = getPrefix(type) + key + '*'
    let cursor = '0'
    try {
        do {
            const { keys, cursor: nextCursor } = await redis.scan(cursor, { MATCH: pattern, COUNT: 50 })
            cursor = nextCursor
    
            if (keys.length) {
                await redis.del(keys)
            }
        } while (cursor !== '0')
    } catch (err) {
        logger.debug(err, 'redis DEL error')
    }
}
