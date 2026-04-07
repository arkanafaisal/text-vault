import { response } from "./response.js";
import { validate } from "./validate.js";

export function validateRequest({schema, target, res}){
    const {ok, message, value} = validate(schema, target)
    if(!ok){
        res.status(400).json({error: message})
        return null    
    }
    return value
}
