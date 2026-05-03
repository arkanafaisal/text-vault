import mysql from "mysql2/promise";

import 'dotenv/config'
import { dbConfig } from "../configs/env.config.js";

import { encrypt } from '../utils/crypto.util.js'

const currentId = 0

return 
const db = await mysql.createConnection(dbConfig);

await db.connect()
await db.beginTransaction()
try {
    const [{affectedRows, changedRows}] = await db.query('UPDATE data SET visibility = "public" WHERE isLocked = 0 AND id > ? LIMIT 1000', [currentId])
    
    console.log(`affected: ${affectedRows} \nchanged: ${changedRows}`)
    await db.commit();
} catch (error) {
    await db.rollback()
    throw error
}