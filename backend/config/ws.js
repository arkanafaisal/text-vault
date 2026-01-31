import {randomUUID} from 'crypto'
import WebSocket from 'ws'
import db from './db.js'
import redis from './redis.js'


let ws
instanceId = randomUUID()
let intervalId
reconnect()


export let activeConnections = 0
async function loop(){
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    await checkDB()
    await checkRedis()

    wsStateSender("ACTIVECONNECTIONS", activeConnections)
}




function reconnect(){
    ws = new WebSocket(process.env.NODE_ENV === "development"? "ws://localhost:3003" : "wss://server-tracker.arkanafaisal.my.id")
    
    ws.on("open", ()=>{
        ws.send(JSON.stringify({
        from: "BACKEND",
        type: "REGISTER",
        instanceId,
        serverName: "databox"
        }))
    })
    
    if(intervalId){clearInterval(intervalId)}
    intervalId = setInterval(loop, 5000)


    ws.on("close", (code)=>{
        if(code !== 1003 && code !== 1008){setTimeout(reconnect, 2000)}
    })

    ws.on("error", () => {
        ws.close()
    })

}





function wsStateSender(type, state){
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify({
        auth: process.env.TRACKER_SECRET,
        from: "BACKEND",
        instanceId,
        type,
        state
    }))

    return
}
async function checkDB(){
    try {
        await db.query("SELECT 1")
        wsStateSender("DBSTATUS", "CONNECTED")
    } catch(err) {
        wsStateSender("DBSTATUS", "DISCONNECTED")
    }
}
async function checkRedis(){
    try {
        await redis.ping()
        wsStateSender("REDISHEALTH", "OK")
    } catch(err) {
        wsStateSender("REDISHEALTH", "CRASH")
    }
}