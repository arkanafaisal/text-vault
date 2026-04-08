import db from "../config/db.js"


export async function create({ userId, title, content, tags }) {
    tags = tags ?? []
    const [{insertId}] = await db.query('INSERT INTO data (userId, title, content, tags) VALUES (?, ?, ?, ?)', [userId, title, content, JSON.stringify(tags)])
    return insertId
}

export async function getAll({ userId, query: { sort, isLocked, search } }) {
    const sortQuery = {
        newest: 'ORDER BY createdAt DESC',
        oldest: 'ORDER BY createdAt ASC',
        updated: 'ORDER BY updatedAt DESC',
    }
    const isLockedQuery = isLocked === undefined? '' : (isLocked ? 'AND isLocked = 1' : 'AND isLocked = 0')
    
    
    const searchQuery = search === undefined? '' : `AND (title LIKE ? OR JSON_CONTAINS(tags, JSON_ARRAY(?)))`
    const parameter = [userId]
    if(search !== undefined){
        parameter.push(`%${search}%`)
        parameter.push(search)
    }
    const [rows] = await db.query(`SELECT id, title, isLocked FROM data WHERE userId = ? ${searchQuery} ${isLockedQuery} ${sortQuery[sort]}`, parameter)
    return rows
}

export async function getById({ userId, id }) {
    const [[data]] = await db.query('SELECT id, title, content, tags, isLocked, updatedAt FROM data WHERE userId = ? AND id = ?', [userId, id])
    return data
}

export async function updateCommon({ userId, id, title, content, tags }) {
    tags = tags === null? [] : tags
    const [{affectedRows, changedRows}] = await db.query('UPDATE data SET title = COALESCE(?, title), content = COALESCE(?, content), tags = COALESCE(?, tags) WHERE userId = ? AND id = ?',
        [title, content, JSON.stringify(tags), userId, id]
    )
        
    const [[data]] = await db.query('SELECT isLocked FROM data WHERE userId = ? AND id = ?', [userId, id])
    return {affectedRows, changedRows, isLocked: data?.isLocked}
}

export async function updateStatus({ userId, id, isLocked }) {
    const [{affectedRows, changedRows}] = await db.query('UPDATE data SET isLocked = ? WHERE userId = ? AND id = ?', [isLocked, userId, id])
    return {affectedRows, changedRows}
}

export async function del({ userId, id }) {
    const [[data]] = await db.query('SELECT isLocked from data WHERE userId = ? AND id = ?', [userId, id])
    const [{affectedRows}] = await db.query('DELETE FROM data WHERE userId = ? AND id = ?', [userId, id])
    return {affectedRows, isLocked: data?.isLocked}
}





export async function getPublicData({ userId }) {
    const [rows] = await db.query('SELECT title, content from data WHERE userId = ? AND isLocked = 0 ORDER BY createdAt DESC', [userId])
    return rows
}

export async function isExist({ id }) {
    const [[row]] = await db.query('SELECT 1 FROM data WHERE id = ?', [id])
    return !!row
}