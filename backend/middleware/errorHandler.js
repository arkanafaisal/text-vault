export function errorHandler(err, req, res, next){
    console.log(err.message)
    let code = 500

    if(err.code === 'ER_DUP_ENTRY' || err.message === 'duplicate'){code = 409}



    return res.sendStatus(code)
};