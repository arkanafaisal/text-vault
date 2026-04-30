import { auth, user, publicUser } from '../schema/user-schema.js'
import { data, publicData } from '../schema/data-schema.js'
import { feedback } from '../schema/feedback-schema.js'
import { validate } from '../utils/validate.js'

const schemas = {
    register: auth.register,
    login: auth.login,
    verifyEmail: auth.verifyEmail,
    forgotPassword: auth.forgotPassword,
    resetPassword: auth.resetPassword,

    updateUsername: user.updateUsername,
    updatePassword: user.updatePassword,
    updatePublicKey: user.updatePublicKey,
    sendEmailVerification: user.sendEmailVerification,
    deleteUser: user.delete,

    getMyData: data.getMyData,
    getById: data.getById,
    createData: data.create,
    updateCommon: data.updateCommon,
    updateStatus: data.updateStatus,
    deleteData: data.delete,

    createFeedback: feedback.create,

    getPublicData: {
        ...publicUser.get,
        ...publicData.pagination
    }
}

const fields = ['body', 'query', 'params']

function validateSchemas() {
    for (const schemaName of Object.keys(schemas)) {
        const schema = schemas[schemaName]

        for (const field of Object.keys(schema)) {
            if (!fields.includes(field)) {throw new Error(`invalid schema config: ${schemaName}.${field}`)}
        }
    }
}

validateSchemas()




export function validateRequest(schemaType) {
    return (req, res, next)=>{
        if(!Object.hasOwn(schemas, schemaType)){throw new Error('invalid schema type')}
        const schema = schemas[schemaType]

        req.validated = {}
        for(const field of fields){
            if(!schema[field]){continue}

            const { ok, message, value } = validate(schema[field], req[field])
            if(!ok){return res.status(400).json({ err: message })}

            req.validated[field] = value
        }

        next()
    }
}



