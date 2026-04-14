import db from "../config/db.js"


export async function create({ userId, title, content, iv, tag, tags }) {
    tags = tags ?? []
    const [{insertId}] = await db.query('INSERT INTO data (userId, title, content, iv, tag, tags) VALUES (?, ?, ?, ?, ?, ?)', [userId, title, content, iv, tag, JSON.stringify(tags)])
    return insertId
}



export async function isExist({ id }) {
    const [[row]] = await db.query('SELECT 1 FROM data WHERE id = ?', [id])
    return !!row
}

export async function getAll({ userId, query: { sort, visibility, search, page } }) {
    const parameter = [userId]

    const sortQuery = {
        newest: 'ORDER BY createdAt DESC',
        oldest: 'ORDER BY createdAt ASC',
        updated: 'ORDER BY updatedAt DESC',
    }

    const visibilityQuery = visibility === undefined? '' : (`AND visibility = ?`)
    if(visibilityQuery){parameter.push(visibility)}
    
    const searchQuery = search === undefined? '' : `AND (title LIKE ? OR JSON_CONTAINS(tags, JSON_ARRAY(?)))`
    if(searchQuery){
        parameter.push(`%${search}%`)
        parameter.push(search)
    }

    const PAGE_SIZE = 30
    const [rows] = await db.query(`
        SELECT id, title, visibility FROM data 
        WHERE userId = ? 
        ${searchQuery} ${visibilityQuery} ${sortQuery[sort]}
        LIMIT ? OFFSET ?
        `, [...parameter, PAGE_SIZE + 1, (page - 1) * PAGE_SIZE])
    return rows
}

export async function getById({ userId, id }) {
    const [[data]] = await db.query('SELECT id, title, content, iv, tag, tags, visibility, updatedAt FROM data WHERE userId = ? AND id = ?', [userId, id])
    return data
}

export async function getPublicData({ userId }) {
    const [rows] = await db.query('SELECT title, content, iv, tag from data WHERE userId = ? AND visibility = "public" ORDER BY createdAt DESC', [userId])
    return rows
}




export async function updateCommon({ userId, id, title, content, iv, tag, tags }) {
    tags = tags === null? [] : tags
    const [{affectedRows, changedRows}] = await db.query(`
        UPDATE data SET 
        title = COALESCE(?, title), 
        content = COALESCE(?, content), 
        iv = COALESCE(?, iv), 
        tag = COALESCE(?, tag), 
        tags = COALESCE(?, tags) 
        WHERE userId = ? AND id = ?`,
        [title, content, iv, tag, JSON.stringify(tags), userId, id]
    )
        
    const [[data]] = await db.query('SELECT visibility FROM data WHERE userId = ? AND id = ?', [userId, id])
    return {affectedRows, changedRows, visibility: data?.visibility}
}

export async function updateStatus({ userId, id, visibility }) {
    const [{affectedRows, changedRows}] = await db.query('UPDATE data SET visibility = ? WHERE userId = ? AND id = ?', [visibility, userId, id])
    return {affectedRows, changedRows}
}

export async function del({ userId, id }) {
    const [[data]] = await db.query('SELECT visibility from data WHERE userId = ? AND id = ?', [userId, id])
    const [{affectedRows}] = await db.query('DELETE FROM data WHERE userId = ? AND id = ?', [userId, id])
    return {affectedRows, visibility: data?.visibility}
}