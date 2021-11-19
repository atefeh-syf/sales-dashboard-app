import { config } from './config.js'
import Sequelize from 'sequelize'

// Override timezone formatting
/*Sequelize.DATE.prototype._stringify = function _stringify(date, options){
	date = this._applyTimezone(date, options)
	// Z here means current timezone, _not_ UTC
	// return date.format('YYYY-MM-DD HH:mm:ss.SSS Z')
	return date.format('YYYY-MM-DD HH:mm:ss')
}*/

const sequelize = new Sequelize({
	...config.db,
	query: {
		raw: true,
	},
	timezone: config.intl.timezone,
	dialectOptions: {
		timezone: config.intl.timezone, // for writing to database
		/*typeCast: function(field, next){
			if(field.type == 'DATETIME' || field.type == 'TIMESTAMP'){
				return new Date(field.string() + 'Z')
			}
			return next()
		},*/
		useUTC: false, //for reading from database
		dateStrings: true,
		typeCast: true,
	},
	define:{
		charset: config.db.charset,
		collate: config.db.collate,
		timestamps: true,
	},
	//logging: false,
	// you can either write to console
	logging: config.env == 'production' ? false : console.log,
	benchmark: config.env == 'development',
	// or write your own custom logging function
	/*logging: (str) => {
		// do stuff with the sql str
	},*/
	// similar for sync: you can define this to always force sync for models
	sync: {
		force: false, // If force is true, each Model will run DROP TABLE IF EXISTS, before it tries to create its own table
		logging: false,
		alter: false, // Not recommended for production use. Deletes data in columns that were removed or had their type changed in the model.
	},
	/*pool: {
		min: 0,
		max: 5, // Maximum number of connection in pool
		idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released.
	},*/
	
})

//Testing the DB connection
/*sequelize
.authenticate()
.then( () => {
	//console.log('Connection has been established successfully.')
})
.catch( error => {
	//console.error('Unable to connect to the database: ', error)
})*/

export { Sequelize, sequelize, config }