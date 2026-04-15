import mysql from "mysql2/promise";

import { encrypt } from '../utils/crypto.js'


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
    const [datas] = await db.query('SELECT id, content FROM data WHERE id > ? LIMIT 1000', [currentId])
    
    for(const data of datas){
        const {iv, content, tag} = encrypt(data.content)
    
        await db.query('UPDATE data SET content_enc=?, iv=?, tag=? WHERE id = ?', [content, iv, tag, data.id])
    }
    
    await db.commit();
} catch (error) {
    await db.rollback()
    throw error
}