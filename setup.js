//import fs from 'fs'
//import path from 'path'
//import { config } from './config.js'
import { Sequelize, sequelize, config } from './db.js'

/**
 * Setup controller
 * @function
 * 
 * @param {fastify} object
 * @param {opts} object
 * @param {done} function
 *
 * @return string
 */
export default function (fastify, opts, done){
	
	/**
	 * Sequelize operator symbols to be used when querying data
	 * @var
	 * @default
	 * @return object
	 */
	const Op = Sequelize.Op
	
	/**
	 * Fastify Setup route
	 * @function
	 * @default
	 * @return object
	 */
	fastify
	.route({
		config: {
			login: false, // use by user
			admin: false, // use by admin
			cors: true, // use by referrer
		},
		method: 'PUT', 
		url: '/setup',
		schema: {
			hide: true,
			description: 'Create Tables ...',
			summary: 'Setup DB',
			tags: ['Setup'],
		},
		handler: (request, reply) => {

			//Testing the DB connection
			sequelize
			.authenticate()
			.then( () => {
				//console.log('Connection has been established successfully.')

				let mdls = Object.keys(sequelize.models)

				if(fastify.conf.logging){
					//console.log(mdls)
					console.log(mdls.length)

					(async () => {

						let fs = await import('fs')
						fs.existsSync('./generator/') || fs.mkdirSync('./generator/')

						let allmdls = await import('./generator/allModels.json')
						//console.log(allmdls.default)
						let difference = await allmdls.default.filter( x => !mdls.includes(x))
						
						fs.writeFileSync(`./generator/difference.json`,JSON.stringify(difference.sort(),null,'\t'),'utf8')
						fs.writeFileSync(`./generator/imported.json`,JSON.stringify(mdls.sort(),null,'\t'),'utf8')

					})()
				}

				if(fastify.conf.db.synchronize){

					sequelize
					.query("SET SQL_MODE='ALLOW_INVALID_DATES';")
					.then( () => {

						// Note: using `force: true` will drop the table if it already exists
						sequelize
						.sync({ force: false })
						.then( () => {
							reply
							.code(200)
							.send()
						})
						.catch( error => {
							reply
							.code(500)
							.send( fastify.conf.logging ? error : { message: error.message.split('sql:')[0] } )
						})

					})
					.catch( error => {
						
						//console.error('Unable to connect to the database: ', error)
						reply
						.code(500)
						.send( fastify.conf.logging ? error : { message: error.message.split('sql:')[0] } )

					})

					/*
					const resultQ = await sequelize.query("SET SQL_MODE='ALLOW_INVALID_DATES';")
					const result = await sequelize.sync({ force: false })
					//console.log(result)

					reply
					.code(200)
					.send()
					*/

			
				}

			})
			.catch( error => {
				//console.error('Unable to connect to the database: ', error)
				reply
				.code(500)
				.send( fastify.conf.logging ? error : { message: error.message.split('sql:')[0] } )
			})

		}
	})
	
	done()
}