import Redis from 'ioredis'
import * as library from './library.js'

import { Sequelize, sequelize, config } from './db.js'

import { user } from './models/user.js'
import { userRole } from './models/userRole.js'
import { role } from './models/role.js'
import { rolePermissionCollection } from './models/rolePermissionCollection.js'
import { rolePermissionCollectionScope } from './models/rolePermissionCollectionScope.js'
import { permissionGroupTree } from './models/permissionGroupTree.js'
import { group } from './models/group.js'
import { groupUser } from './models/groupUser.js'
import { portal } from './models/portal.js'

import { session } from './models/session.js'
import { log } from './models/log.js'
import { logAction } from './models/logAction.js'
import { logLastModification } from './models/logLastModification.js'
import { hitCounter } from './models/hitCounter.js'
import { hitCounterHistory } from './models/hitCounterHistory.js'
import { hitCounterPage } from './models/hitCounterPage.js'
import { hitCounterPageHistory } from './models/hitCounterPageHistory.js'

const initialize = {
	user: {},
	permissions: {},

	login: false,
	admin: false,
	organic: false,
	confirmed: false,
	agreement: false,
	domain: 0,
	typeId: 0,
	current_portal_id: 0, //$this->get_portal_id(core\globals::$_subdomain)
	portal_url: '', //$this->db()->safe(core\globals::$_subdomain)
	portals: [],
	role: 0, //$this->get_guest_role_id($u->current_portal_id)
	master_admin: false,
	accesslevel: 0, //$this->config_guest_accesslevel_id
	group: 0,
	name: '',
	last_name: '',
	alias: '',
	language: '',
	email: '',
	sex: 0,
	birth_date: '',
	last_return_date: '',
	last_logout_date: '',
	return_count: 0,
	session_id: 0, //session_id()
	file_ext: '',
	file_header: '',
	img_type: 0,
	img_width: 0,
	img_height: 0,
	hit: false,
	token: '',
	login_date: '',
	start_domain: '', //$this->domain_url
	agent: '', //$_SERVER['HTTP_USER_AGENT'],
	encoding_accept: '',//isset($_SERVER['HTTP_ACCEPT_ENCODING']) ? $_SERVER['HTTP_ACCEPT_ENCODING'] : ''
	language_accept: 'en',
	/*if(array_key_exists('HTTP_ACCEPT_LANGUAGE', $_SERVER)){
		$http_accept_languages: explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'])
		$http_accept_language: substr(end($http_accept_languages), 0, 2)
		language_accept: $http_accept_language
	}*/
	ip: '', //$_SERVER['REMOTE_ADDR']
	/*if(array_key_exists('HTTP_CLIENT_IP', $_SERVER))
		ip: $_SERVER['HTTP_CLIENT_IP']
	*/
	start_query_string: '', //$_SERVER['QUERY_STRING']
	referer: '',//$_SERVER['HTTP_HOST']
	referer_domain: '',//$_SERVER['HTTP_HOST']
	/*if(array_key_exists('HTTP_REFERER', $_SERVER) && !empty($_SERVER['HTTP_REFERER'])){
		referer: $_SERVER['HTTP_REFERER']
		referer_domain: parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST)
	}*/
}

/**
 * Permission controller
 * @function
 * 
 * @param {error} object
 * 
 * @return object
 */
export const JWTVerify = error => config.logging ? error : {
	statusCode: 500,
	//error: error.error,
	code: error.code,
	message: error.message.split('sql:')[0],
}


/**
 * Set hit online
 *
 * @param	none
 * 
 * @return	void
 */
export const setHitOnline = () => {
	const v = {}
	const u = {}
	this.get_default_values(v)
	v.userId = SESSION['user'].login ? v.userId : 0
	u.ip = SERVER['REMOTE_ADDR']
	u.startDate = date('Y-m-d H:i:s')
	u.sessionId = sessionId()
	if(this.config_hit_online){

		const t = strtotime(u.startDate)
		const m = intval(SESSION['is_mobile'])

		this
		.db()
		.q(`INSERT IGNORE INTO ${this.config_db_table_prefix}hit_online SET hito_session_id = '${u.session_id}',
			portal_id = ${v.current_portal_id}, domain_id = ${v.domainId}, user_id = ${v.userId}, hito_timestamp = '${t}',
			hito_ip = '${u.ip}', hito_m = ${m};`)
		
	}
}