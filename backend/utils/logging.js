const isLogging = process.env.NODE_ENV === 'development'? true : false

export function logging(path){
    if(isLogging) console.log(path + " hit")
}