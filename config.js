var process = process || { env: { NODE_ENV: 'development' } }
//Deno.env('DENO_ENV')

export const config = {
	env: process?.env?.NODE_ENV ?? 'development',
	logging: true,
	site: {
		title: '',
		description: '',
		copyright: 'All rights reserved. Copyright ©  Co.',
		support: '',
	},
	smtpServer: {
		service: '',
		user: '*@gmail.com',
		pass: '*',
		mailSender: 'noreplay@test.ir',
	},
	api: {
		exposeRoute: true,
		routePrefix: '/api',
		version: '1.0.0',
	},
	intl: {
		lang: 'fa',
		charset: 'UTF8',
		timezone: 'Asia/Tehran',
	},
	client: {
		development: {
			domain: 'localhost',
			protocol: 'http',
		},
		production: {
			domain: 'lab.test.ir',
			protocol: 'https',
		},
	},
	server: {
		development: {
			baseDir: './',
			staticfilesDir: './frontend/',
			port: 3000,
			host: 'localhost',
			origin: 'localhost',
			protocol: 'http',
			sslCertificate: '',
			sslCertificateKey: '',
			errorReporting: true,
		},
		production: {
			baseDir: './',
			staticfilesDir: './frontend/',
			port: 3000,
			host: 'lab.test.ir',
			origin: 'lab.test.ir',
			protocol: 'https',
			sslCertificate: '/etc/letsencrypt/live/lab.test.ir/cert.pem',
			sslCertificateKey: '/etc/letsencrypt/live/lab.test.co.ir/privkey.pem',
			errorReporting: false,
		},
		poweredBy: 'ab.test.co.ir',
		userAgent: 'store 1.0.0',
	},
	db: {
		development: {
			dialect: 'mysql',
			port: 3306,
			host: 'localhost',
			database: 'store', // portal_temp
			username: 'root',
			password: '',
		},
		production: {
			dialect: 'mysql',
			port: 3306,
			host: 'localhost',
			database: 'store',
			username: 'root',
			password: '2vu>R29tU*)vv~U4"v',
		},
		tablePerfix: 'x_',
		charset: 'UTF8',
		collate: 'UTF8_GENERAL_CI',
		persistentConnection: false,
		synchronize: false,
	},
	redis: {
		development: {
			token: {
				port: 6379,
				family: 4,
				host: '127.0.0.1',
				db: 0,
				password: '',
			},
			permision: {
				port: 6379,
				family: 4,
				host: '127.0.0.1',
				db: 1,
				password: '',
			},
			rowChache: {
				port: 6379,
				family: 4,
				host: '127.0.0.1',
				db: 2,
				password: '',
			}
		},
		production: {
			token: {
				port: 6379,
				family: 4,
				host: '127.0.0.1',
				db: 0,
				password: 'eShVmYq3t6v9y$B&E)H@McQfTjWnZr4u',
			},
			permision: {
				port: 6379,
				family: 4,
				host: '127.0.0.1',
				db: 1,
				password: 'eShVmYq3t6v9y$B&E)H@McQfTjWnZr4u',
			},
			rowChache: {
				port: 6379,
				family: 4,
				host: '127.0.0.1',
				db: 2,
				password: 'eShVmYq3t6v9y$B&E)H@McQfTjWnZr4u',
			}
		},
		disable: false,
		maxmemory: '256mb',
	},
	jwt: {
		secret: '$B&E(H+MbQeThWmZq4t7w!z%C*F-J@Nc',
		nameAlgorithm: 'HS256', // HS256: HMAC with SHA-256
		signAlgorithm: 'HMAC',
		hashAlgorithm: 'SHA-256',
	},
	upload: {
		development: {
			path: './frontend/file/',
		},
		production: {
			path: './frontend/file/',
		},
		bodyLimit: 1048576*10, // Default: 1048576 (1MiB)
		setTimeout: 300000,
	},
	user: {
		passwordHashSalt: 'UD@f%93#.d',
		passwordHashAlgorithm: 'SHA-1',
		passwordExpireTime: '+200 months',
		sessionName: 'token',
		sessionExpireTime: 2592000,
	},
	log: {
		log: false,
		requests: false,
		userTracking: true,
		userIpChecking: false,
	},
	cache: {
		pageTime: 86400,
		imageTime: 86400,
	},
	searchDefault: {
		limitDef: 9,
		limitMax: 50,
		portalId: '1',
	},
}

const env = config.env
config.logging = env == 'development' ? true : false
config.client = { ...config.client, ...config.client[env] }
config.server = { ...config.server, ...config.server[env] }
config.db = { ...config.db, ...config.db[env] }
config.redis = { ...config.redis, ...config.redis[env] }
config.upload = { ...config.upload, ...config.upload[env] }

//console.log(config.client)

