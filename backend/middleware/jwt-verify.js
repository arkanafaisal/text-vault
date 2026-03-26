import jwt from 'jsonwebtoken';
import { response } from '../utils/response.js';

export default async function verifyToken(req, res, next) {
    const accessToken = req.headers.accesstoken
    if (!accessToken) {return response(res, false, 401, "token invalid")}

    try{
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        req.user = decoded
        next();
    } catch(err){
        if(err.name === 'TokenExpiredError'){return response(res, false, 401, "token expired")}
        if(err.name === 'JsonWebTokenError'){return response(res, false, 401, "token invalid")}

        console.log(err)
        return response(res, false, 500, "server error")
    }      
}

