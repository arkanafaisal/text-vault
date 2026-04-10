import redis from "../config/redis.js"

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

export async function get(type, key){
    try {
        const rawData = await redis.get(redisType[type].prefix + key)
        if(!rawData){return {ok: false}}

        if(process.env.NODE_ENV === 'development'){console.log('cache used')}
        
        return {ok: true, data: JSON.parse(rawData)}
    } catch(err) {
        console.error("Redis GET error:", err.message)
        return {ok: false} 
    }
}

export async function set(type, key, data){
    try {
        await redis.set(redisType[type].prefix + key, JSON.stringify(data), {"EX": redisType[type].ttl})
        return {ok: true} 
    } catch (err) {
        console.error("Redis SET error:", err.message)
        return {ok: false}
    }
}

export async function del(type, key){
    try {
        await redis.del(redisType[type].prefix + key)
        return {ok: true} 
    } catch (err) {
        console.error("Redis DEL error:", err.message)
        return {ok: false}
    }
}



export async function delPattern(type, key) {
    const pattern = redisType[type].prefix + key + '*'
    let cursor = '0'

    do {
        const { keys, cursor: nextCursor } = await redis.scan(cursor, { MATCH: pattern, COUNT: 50 })
        cursor = nextCursor

        if (keys.length) {
            await redis.del(keys)
        }
    } while (cursor !== '0')
}
