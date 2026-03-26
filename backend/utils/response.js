export function response(res, success, code, message, data = null){
    res.status(code).json({success, message, data})
}