import db from "../config/db.js"
import bcrypt from 'bcrypt'

export async function insert({ display_name, username, password }) {
    try {
        const [{insertId}] = await db.query('INSERT INTO users (display_name, username, password) VALUES (?, ?, ?)', [display_name, username, password])
        return insertId
    } catch(err) {
        if(err.code === 'ER_DUP_ENTRY'){throw new Error('duplicate')}
        throw err
    }
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





export async function getUserById({ id }) {
    const [[user]] = await db.query('SELECT display_name, email, publicKey FROM users WHERE id = ?', [id])
    return user
}


export async function updateUsername({ id, display_name, username }) {
    try {
        const [{affectedRows, changedRows}] = await db.query('UPDATE users SET display_name = ?, username = ? WHERE id = ?', [display_name, username, id])
        return {affectedRows, changedRows}
    } catch(err) {
        if(err.code === 'ER_DUP_ENTRY'){throw new Error('duplicate')}
        throw err
    }
}

export async function getPasswordById({ id }) {
    const [[user]] = await db.query('SELECT password FROM users WHERE id = ?', [id])
    return user 
}


export async function updatePublicKey({publicKey, id}) {
    const [{affectedRows, changedRows}] = await db.query("UPDATE users SET publicKey = ? WHERE id = ?", [publicKey, id])
    return {affectedRows, changedRows}
}


export async function validateEmail({ email }) {
    const [[row]] = await db.query("SELECT 1 FROM users WHERE email = ?", [email])
    return !!row
}

export async function getIdByEmail({ email }) {
    const [[user]] = await db.query("SELECT id FROM users WHERE email = ?", [email])
    return user.id
}














export async function validateUsername({username}) {
    const [[row]] = await db.query("SELECT 1 FROM users WHERE username = ?", [username])
    return !!row
}

export async function getUserByUsername({username}) {
    const [rows] = await db.query('SELECT id, publicKey FROM users WHERE username = ?', [username])
    if(rows.length === 0){return {id: 0, publicKey: null}}
    const {id, publicKey} = rows[0]
    return {id, publicKey}
}

export async function getUsernamePasswordById({id}) {
    const [[user]] =  await db.query('SELECT username, password FROM users WHERE id = ?', [id])
    return user
}
export async function getEmailPasswordById({id}) {
    const [[user]] = await db.query("SELECT email, password FROM users WHERE id = ?", [id])
    return user
}




export async function updateEmail({email, id}) {
    try {
        const [{affectedRows, changedRows}] = await db.query("UPDATE users SET email = ? WHERE id = ?", [email, id])
        return {affectedRows, changedRows}
    } catch(err) {
        if(err.code === "ER_DUP_ENTRY"){throw new Error('duplicate')}
        throw err
    }
}
export async function updatePassword({ id, password }) {
    const [{affectedRows}] = await db.query("UPDATE users SET password = ? WHERE id = ?", [password, id])
    return affectedRows
}

export async function getEmailById(id) {
    const [[user]] = await db.query("SELECT email FROM users WHERE id = ?", [id])
    return user
}