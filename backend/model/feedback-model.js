import db from '../config/db.js'


export async function create({ message }) {
    const [{ insertId }] = await db.query('INSERT INTO feedback (message) VALUES (?)', [message])
    if(!insertId){throw new Error('ER_NO_INSERT_ID')}

    return insertId
}