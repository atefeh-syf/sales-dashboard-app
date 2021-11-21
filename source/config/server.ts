import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import logging from './config/logging'
import config from './config/config'

const NAMESPACE = 'server'
const router = express()


/** Logging the request */
router.use((req , res , next) => {
    logging.info(NAMESPACE , `METHOD - [${req.method}] , URL - [${req.url}] , IP - [${req.socket.remoteAddress}]`)

    res.on('finish' , () => {
        logging.info(NAMESPACE , `METHOD - [${req.method}] , URL - [${req.url}] , IP - [${req.socket.remoteAddress}] , STATUS - [${res.statusCode}]`)
    })

    next()
})

/** Parse request */
router.use(bodyParser.urlencoded( {extended : false} ))
router.use(bodyParser.json())

/** Rules of oue Api */
router.use( (req , res , next) => {
    res.header('Access-Control-Allow-Origin' , '*')
    res.header('Access-Control-Allow-Headers' , 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if(req.method == 'option') {
        res.header('Access-Control-Allow-Method' , 'GET PATCH DELETE POST PUT')
        return res.status(200).json({})
    }
    next()
})

/** Routes */


/** Error Handeling */
router.use((req , res , next) => {
    const error = new Error('not found')

    return res.status(404).json({
        message : error.message
    })
    
})


/** Create the server */
const httpServer = http.createServer(router)
httpServer.listen(config.server.port , () => logging.info(NAMESPACE , `Server running on ${config.server.hostname}:${config.server.port}`))