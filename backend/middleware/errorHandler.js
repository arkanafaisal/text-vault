export function errorHandler(err, req, res, next){
    let code = 500

    if(err.code === 'ER_DUP_ENTRY' || err.message === 'duplicate'){code = 409}

    if(code !== 500){console.log(err.message)}

    return res.sendStatus(code)
};