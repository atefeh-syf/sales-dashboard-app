/**
 * Library
 *
 * @copyright	IBM.Co.ir		2019
 * @author		S.A.Hashemi		<hashemi@ibm.co.ir>
 * @version		1.0.0			2019.05.01
 *
 * @module		library
 * @require		node 12.12+
 */

import { config } from './config.js'
import { webcrypto as crypto } from 'crypto' // NodeJS

/**
 * Is empty
 * @function
 *
 * @param {s} String | Null
 *
 * @return Boolean
 */
export const isEmpty = s => !(!!s.trim().length)

/**
 * String to unique ID
 * @function
 *
 * @param {s} String
 *
 * @return Integer
 */
export const strToId = (s = '  ') => {
	const e = new TextEncoder().encode(s)
	return e.join('')
	//return parseInt(e.join(''))
	//return e.reduce( (a, b) => a + b ) + e.length + e[0]
}

/**
 * Get filtered Schema
 * @function
 * 
 * @param {request} Object
 * @param {routes} Object
 * @param {model} Object
 * 
 * @return object
 */
export const schema = (request = {}, routes = {}, model = null) => {

	let result = null

	if(request.params.method === 'all'){
		result = Object.keys(routes)
	}else if(request.params.method === 'model' && model !== null){
		result = request.headers.authorization !== null ? schemaModel(model) : 'UnAauthorized!'
	}else{
		let s = routes[request.params.method]
		result = { config: s.config, method: s.method, url: s.url, schema: s.schema }
	}

	return result
}

/**
 * Get filtered Schema
 * @function
 * 
 * @param {model} Object
 * 
 * @return object
 */
export const schemaModel = model => {

	let obj = null
	let idx = null

	if(model !== undefined && model.rawAttributes !== undefined){

		//for(let func in model)
			//console.log(typeof func, func)

		//console.log(model.options.indexes)

		obj = JSON.parse(JSON.stringify(model.rawAttributes))
		idx = JSON.parse(JSON.stringify(model.options.indexes))
		//console.log(obj)
		//console.log(idx)

		//obj = model.rawAttributes
		//obj = Object.fromEntries(model.rawAttributes)
		//obj = Object.assign({},model.rawAttributes)
		//obj = Object.create(model.rawAttributes)
		//obj = Object.create({},model.rawAttributes)
		//obj = Object.defineProperties({},model.rawAttributes)
		//console.log(obj)

		//Object.entries(model.rawAttributes).map( ([k,v]) => {
		Object.entries(obj).map( ([k,v]) => {

			delete obj[k].field
			//delete obj[k].primaryKey
			//delete obj[k].autoIncrement

			//if(obj[k].hasOwnProperty('collate'))
				delete obj[k].collate

			delete obj[k].references
			delete obj[k].onDelete
			delete obj[k].onUpdate

			delete obj[k]._modelAttribute
			delete obj[k].type._length
			delete obj[k].type._unsigned

			if(obj[k].hasOwnProperty('unique'))
				obj[k].unique = true

			if([
				//'userId',
				//'portalId',
				//'langId',
				//`${model.name}DateRegister`,
				//`${model.name}DateLastEdit`,
				//`${model.name}FlagEdit`,
				`${model.name}Token`,
				`${model.name}Body`
			].includes(k))
				delete obj[k]

			//obj[k].fieldName = obj[k].fieldName.replace(model.name,'').replace(/\w/, c => c.toLowerCase())

		})

		idx.map( (v,k) => {
			delete v.fields
			let vn = v.name = camelize(v.name)

			if([
				/*'userId',
				'portalId',
				'langId',
				`${model.name}DateRegister`,
				`${model.name}DateLastEdit`,
				`${model.name}FlagEdit`,*/
				`${model.name}Token`
			].includes(vn))
				delete idx[k]
				//idx.splice(k,1)
			
		})

		idx = idx.filter( v => v !== null )
	}

	return { attributes: obj, indexes: idx}
}

/**
 * Get safe SQL error
 * @function
 * 
 * @param {error} object
 * 
 * @return object
 */
export const sqlError = error => config.logging ? error : {
	statusCode: 500,
	//error: error.error,
	code: error.code,
	message: error.message.split('sql:')[0],
}

/**
 * Get random number token
 * @function
 * 
 * @param null
 * 
 * @return string : '9892099191'
 */
export const tokenNumber = () => Math.random(0).toString().substr(2,10)

/**
 * Get random alpha token
 * @function
 * 
 * @param null
 * 
 * @return string : 'c8r9xo8p9n'
 */
export const tokenAlpha = () => Math.random(0).toString(36).substr(2)


/**
 * Get Date Now + timeZone
 * @function
 * 
 * @param null
 * 
 * @return string : '11 5 2019 17:37:56 +00:00'
 */
export const dateNow = () => new Date(Date.now()).toLocaleString('en',{ hour12:false, timeZone: process.env.TZ }).replaceAll('/',' ').replace(',','') + ' +00:00'

/**
 * Get Intl Date + timeZone
 * @function
 * 
 * @param {timestamp} integer
 * @param {lang} string : "fa" | "en" | "ar" | ...
 * 
 * @return string
 */
export const intlDate = (timestamp = Date.now(), lang = config.intl.lang) => (new Date(timestamp || Date.now())).toLocaleDateString(lang,{weekday:'long',year:'numeric',month:'long',day:'numeric',formatMatcher:'basic',timeZone: config.intl.timezone}).replaceAll(',','').replace(/(.*) (.*) (.*) (.*)/, (lang=='fa')?'$1 $4 $3 $2':'$1 $3 $2 $4')
//export const intlDateA = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { weekday:'long',year:'numeric',month:'long',day:'numeric',timeZone: config.intl.timezone}).format(new Date())
//export const intlDateP = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday:'long',year:'numeric',month:'long',day:'numeric',timeZone: config.intl.timezone}).format(new Date())

/**
 * Get Number Date
 * @function
 * 
 * @param {timestamp} integer
 * 
 * @return string : '20191105140555976'
 */
export const NumberDate = (timestamp = dateNow()) => new Date(timestamp).toISOString().replaceAll('-','').replace('T','').replaceAll(':','').replace('.','').replace('Z','')

/**
 * Get Number Date
 * @function
 * 
 * @param {timestamp} integer
 * 
 * @return string : '13990303'
 */
export const NumberDateShamsi = (timestamp = dateNow()) => new Date(timestamp).toLocaleDateString('fa',{calendar:'persian',numberingSystem:'latn',year:'numeric',month:'2-digit',day:'2-digit',formatMatcher:'basic'}).replaceAll('/','').substring(0,8)

/**
 * Get ISO Date
 * @function
 * 
 * @param {timestamp} integer
 * 
 * @return string : '2019-01-01 23:30:01'
 */
export const ISODate = (timestamp = dateNow()) => new Date(timestamp).toISOString().split('.')[0].replace('T',' ')

/**
 * Enum for time units.
 * @constant
 * @readonly
 * @enum string
 */
/*export const timeUnits = {
	year: Symbol(),
	quarter: Symbol(),
	month: Symbol(),
	week: Symbol(),
	day: Symbol(),
	hour: Symbol(),
	minute: Symbol(),
	second: Symbol(),
}*/

/**
 * Get Intl relative time format
 * @function
 * 
 * @param {value} integer : -1 | 1 | 2 | ...
 * @param {unit} string : "year" | "quarter" | "month" | "week" | "day" | "hour" | "minute" | "second"
 * @param {numeric} string : "auto" | "always" = "yesterday" | "1 day ago"
 * @param {lang} string : "fa" | "en" | "ar" | ...
 * 
 * @return string : "1 day ago" | "yesterday" | "1 month" | ...
 */
export const intlRelativeTimeFormat = (value = 0, unit = 'hour', numeric = 'auto', lang = core.page.lang) => new Intl.RelativeTimeFormat(lang, { numeric }).format(value, unit)

/**
 * Get Intl plural language rule
 * @function
 * 
 * @param {value} integer : 0 | 1 | 2 | ...
 * @param {lang} string : "fa" | "en" | "ar" | ...
 * 
 * @return string : "Zero" | "1st" | "2nd" | "3rd" | "4th" | "42nd" | ...
 */
export const intlPluralRules = (value = null, lang = core.page.lang) => new Intl.PluralRules(lang, { type: 'ordinal' }).select(value)

/**
 * Get Intl number format
 * @function
 * 
 * @param {value} integer : 123456.789
 * @param {lang} string : "fa" | "en" | "ar" | ...
 * 
 * @return string : 1,23,456.789" | "١٢٣٤٥٦٫٧٨٩" | ...
 */
export const intlNumberFormat = (value = null, lang = core.page.lang) => new Intl.NumberFormat(lang).format(value)

/**
 * UTC Time Zone
 * @function
 * 
 * @param {text} string
 *
 * @return string
 */
export const toUTCTimeZone = (text = dateNow()) => new Date(text).toUTCString()

/**
 * Camelize a string, cutting the string by multiple separators like hyphens, underscores and spaces.
 * @function
 * 
 * @param {text} string Text to camelize
 *
 * @return string Camelized text
 */
export const camelize = (text = '') => (text || '').replace(/^([A-Z])|[\s-_\/\.]+(\w)/g, (match, p1, p2, offset) => 
	(p2) ? p2.toUpperCase() : p1.toLowerCase()
)

/**
 * Strip HTML Tags
 * @function
 * 
 * @param {text} string Text to strip HTML Tags
 *
 * @return string striped text
 */
export const stripTags = (text = '') => (text || '').replace(/(<([^>]+)>)/ig, '')

/**
 * Encode a string to base64 string
 * @function
 * 
 * @param {text} string
 *
 * @return base64 string
 */
//export const btoa = (text = '') => Buffer.from(text || '', 'utf8').toString('base64')

/**
 * Decode a base64 string to string
 * @function
 * 
 * @param {text} base64 string
 *
 * @return string
 */
//export const atob = (text = '') => Buffer.from(text || '', 'base64').toString('utf8')

/**
 * Escape HTML
 * @function
 * 
 * @param {text} string
 *
 * @return string
 */
export const htmlEscape = (text = '') => (text || '').replace(/[&<>'"]/g, x => `&#${x.charCodeAt(0)};` )

/**
 * Strip Slashes
 * @function
 * 
 * @param {text} string
 *
 * @return string
 */
export const stripslashes = (text = '') =>
	(text || '').replace(/\\(.?)/g, (s, n1) => {
		switch(n1){
			case '\\':
				return '\\'
			case '0':
				return '\u0000'
			case '':
				return ''
			default:
				return n1
		}
})

/**
 * Crypto Digest
 * @function
 * 
 * @param {text} string
 * @param {text} string
 *
 * @return string
 */
export const cryptoDigest = async (text = '', salt = config.user.passwordHashSalt, hashAlgorithm = config.jwt.hashAlgorithm) => {
	const hash = await crypto.subtle.digest(hashAlgorithm,new TextEncoder().encode(text + salt))
	return [...new Uint8Array(hash)].map( b => b.toString(16).padStart(2,'0') ).join('')
}

/**
 * Crypto Algorithm
 * @var
 * 
 * @return Object
 */
export const cryptoAlgorithm = {
	name: config.jwt.signAlgorithm,
	hash: config.jwt.hashAlgorithm,
}

/**
 * Crypto Sign
 * @function
 * 
 * @param {text} string
 *
 * @return string
 */
export const cryptoSign = async (text = '') => {
	const enc = new TextEncoder()
	const key = await crypto.subtle.importKey('raw', enc.encode(config.jwt.secret), cryptoAlgorithm, false, ['sign','verify',])
	const signature = await crypto.subtle.sign(cryptoAlgorithm, key, enc.encode(text))
	//return [...new Uint8Array(signature)].map( b => b.toString(16).padStart(2,'0') ).join('')
	return String.fromCharCode(...new Uint8Array(signature))
}

/**
 * Crypto Verify
 * @function
 * 
 * @param {text} string
 * @param {text} string
 * 
 * @return Boolean
 */
export const cryptoVerify = async (text = '', signature = '') => {
	const enc = new TextEncoder()
	const key = await crypto.subtle.importKey('raw', enc.encode(config.jwt.secret), cryptoAlgorithm, false, ['sign','verify',])
	return await crypto.subtle.verify(cryptoAlgorithm, key, enc.encode(signature), enc.encode(text))
}

/**
 * JWT Token
 * @function
 * 
 * @param {jwtHeader} Object
 * @param {jwtPayload} Object
 * 
 * @return string
 */
export const jwtToken = async (jwtHeader = {}, jwtPayload = {}) => {
	const unsignedToken = btoa(JSON.stringify(jwtHeader)) + '.' + btoa(JSON.stringify(jwtPayload))
	return unsignedToken + '.' + btoa(await cryptoSign(unsignedToken))
}