export function errorHandler(err, req, res, next){
    
    if(err instanceof SyntaxError && err.status === 400 && 'body' in err){return res.status(400).json({error: "invalid JSON format"})}
    if(err.code === 'ER_DUP_ENTRY' || err.message === 'duplicate'){return res.sendStatus(409)}

    console.log(err.message)

    
    return res.sendStatus(500)
};