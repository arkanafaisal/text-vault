import mysql from "mysql2/promise";

import { encrypt } from '../utils/crypto.util.js'


const currentId = 0

return 
const db = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});

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