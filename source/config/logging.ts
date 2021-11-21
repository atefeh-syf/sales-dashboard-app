const getTimestamp = (): string => {
    return new Date().toISOString();
}

const info = (namespace : string , message : string , object ?: any) => {
    if ( object ) {
        console.log(`[ ${getTimestamp()}] [INFO] [${namespace}] ${message} ` , object)
    }else {
        console.log(`[ ${getTimestamp()}] [INFO] [${namespace}] ${message} ` )
    }
}


const warm = (namespace : string , message : string , object ?: any) => {
    if ( object ) {
        console.warn(`[ ${getTimestamp()}] [WARM] [${namespace}] ${message} ` , object)
    }else {
        console.warn(`[ ${getTimestamp()}] [WARM] [${namespace}] ${message} ` )
    }
}


const error = (namespace : string , message : string , object ?: any) => {
    if ( object ) {
        console.error(`[ ${getTimestamp()}] [ERROR] [${namespace}] ${message} ` , object)
    }else {
        console.error(`[ ${getTimestamp()}] [ERROR] [${namespace}] ${message} ` )
    }
}


const debug = (namespace : string , message : string , object ?: any) => {
    if ( object ) {
        console.debug(`[ ${getTimestamp()}] [DEBUG] [${namespace}] ${message} ` , object)
    }else {
        console.debug(`[ ${getTimestamp()}] [DEBUG] [${namespace}] ${message} ` )
    }
}


export default {
    info ,
    warm ,
    error ,
    debug
}