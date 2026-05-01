import db from "../libs/db.lib.js"
import bcrypt from 'bcrypt'

export async function insert({ displayName, username, password }) {
    const [{insertId}] = await db.query('INSERT INTO users (displayName, username, password) VALUES (?, ?, ?)', [displayName, username, password])
    if(!insertId){throw new Error('ER_NO_INSERT_ID')}
    
    return insertId
}

export async function authenticateUser({ identifier, password }){
    const [[user]] = await db.query('SELECT id, username, password FROM users WHERE (username = ? OR email = ?)', [identifier, identifier])
    if(!user){return null}

    const ok = await bcrypt.compare(password, user.password)
    if(!ok){return null}
    return user.id
}




export async function validateUserId({ id }){
    const [[row]] = await db.query('SELECT 1 FROM users WHERE id = ?', [id])
    return !!row
}

export async function validateEmail({ email }) {
    const [[row]] = await db.query("SELECT 1 FROM users WHERE email = ?", [email])
    return !!row
}




export async function getUserById({ id }) {
    const [[user]] = await db.query('SELECT displayName, email, publicKey FROM users WHERE id = ?', [id])
    return user
}

export async function getPasswordById({ id }) {
    const [[user]] = await db.query('SELECT password FROM users WHERE id = ?', [id])
    return user 
}

export async function getIdByEmail({ email }) {
    const [[user]] = await db.query("SELECT id FROM users WHERE email = ?", [email])
    return user?.id
}

export async function getIdByUsernamePublickey({ username, publicKey }) {
    const [[user]] = await db.query("SELECT id FROM users WHERE username = ? AND publicKey = ?", [username, publicKey])
    return user?.id
}




export async function updateUsername({ id, displayName, username }) {
    const [{affectedRows, changedRows}] = await db.query('UPDATE users SET displayName = ?, username = ? WHERE id = ?', [displayName, username, id])
    return {affectedRows, changedRows}
}

export async function updatePublicKey({publicKey, id}) {
    const [{affectedRows, changedRows}] = await db.query("UPDATE users SET publicKey = ? WHERE id = ?", [publicKey, id])
    return {affectedRows, changedRows}
}

export async function updateEmail({email, id}) {
    const [{affectedRows, changedRows}] = await db.query("UPDATE users SET email = ? WHERE id = ?", [email, id])
    return {affectedRows, changedRows}
}

export async function updatePassword({ id, password }) {
    const [{affectedRows}] = await db.query("UPDATE users SET password = ? WHERE id = ?", [password, id])
    return affectedRows
}


export async function del({ id, username }) {
    const [{ affectedRows }] = await db.query('DELETE FROM users WHERE id = ? AND username = ?', [id, username])
    return affectedRows
}