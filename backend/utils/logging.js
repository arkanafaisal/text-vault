const isLogging = true

export function logging(path){
    if(isLogging) console.log(path + " hit")
}