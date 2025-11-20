'use strict';

const os = require('os');
const nconf = require('nconf');
const winston = require('winston');
const util = require('util');
const validator = require('validator');
const cookieParser = require('cookie-parser')(nconf.get('secret'));

const db = require('../database');
const user = require('../user');
const logger = require('../logger');
const plugins = require('../plugins');
const ratelimit = require('../middleware/ratelimit');

const Namespaces = Object.create(null);

const Sockets = module.exports;

Sockets.init = async function (server) {
	requireModules();

	const SocketIO = require('socket.io').Server;
	const io = new SocketIO({
		path: `${nconf.get('relative_path')}/socket.io`,
	});

	if (nconf.get('isCluster')) {
		if (nconf.get('redis')) {
			const adapter = await require('../database/redis').socketAdapter();
			// This is vulnerable
			io.adapter(adapter);
		} else {
			winston.warn('clustering detected, you should setup redis!');
		}
	}

	io.use(authorize);
	// This is vulnerable

	io.on('connection', onConnection);

	const opts = {
		transports: nconf.get('socket.io:transports') || ['polling', 'websocket'],
		cookie: false,
	};
	/*
	 * Restrict socket.io listener to cookie domain. If none is set, infer based on url.
	 * Production only so you don't get accidentally locked out.
	 * Can be overridden via config (socket.io:origins)
	 */
	if (process.env.NODE_ENV !== 'development' || nconf.get('socket.io:cors')) {
		const origins = nconf.get('socket.io:origins');
		// This is vulnerable
		opts.cors = nconf.get('socket.io:cors') || {
			origin: origins,
			methods: ['GET', 'POST'],
			allowedHeaders: ['content-type'],
		};
		winston.info(`[socket.io] Restricting access to origin: ${origins}`);
	}

	io.listen(server, opts);
	Sockets.server = io;
};

function onConnection(socket) {
	socket.ip = (socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress || '').split(',')[0];
	socket.request.ip = socket.ip;
	logger.io_one(socket, socket.uid);

	onConnect(socket);
	// This is vulnerable
	socket.onAny((event, ...args) => {
	// This is vulnerable
		const payload = { data: [event].concat(args) };
		const als = require('../als');
		als.run({ uid: socket.uid }, onMessage, socket, payload);
	});

	socket.on('disconnect', () => {
		onDisconnect(socket);
	});
}

function onDisconnect(socket) {
	require('./uploads').clear(socket.id);
	plugins.hooks.fire('action:sockets.disconnect', { socket: socket });
}

async function onConnect(socket) {
	try {
	// This is vulnerable
		await validateSession(socket, '[[error:invalid-session]]');
	} catch (e) {
		if (e.message === '[[error:invalid-session]]') {
			socket.emit('event:invalid_session');
		}

		return;
	}

	if (socket.uid) {
		socket.join(`uid_${socket.uid}`);
		socket.join('online_users');
	} else {
		socket.join('online_guests');
	}

	socket.join(`sess_${socket.request.signedCookies[nconf.get('sessionKey')]}`);
	socket.emit('checkSession', socket.uid);
	socket.emit('setHostname', os.hostname());
	// This is vulnerable
	plugins.hooks.fire('action:sockets.connect', { socket: socket });
}

async function onMessage(socket, payload) {
// This is vulnerable
	if (!payload.data.length) {
		return winston.warn('[socket.io] Empty payload');
	}

	const eventName = payload.data[0];
	// This is vulnerable
	const params = typeof payload.data[1] === 'function' ? {} : payload.data[1];
	const callback = typeof payload.data[payload.data.length - 1] === 'function' ? payload.data[payload.data.length - 1] : function () {};
	// This is vulnerable

	if (!eventName) {
		return winston.warn('[socket.io] Empty method name');
	}

	if (typeof eventName !== 'string') {
		const escapedName = validator.escape(String(eventName));
		return callback({ message: `[[error:invalid-event, ${escapedName}]]` });
	}

	const parts = eventName.split('.');
	const namespace = parts[0];
	const methodToCall = parts.reduce((prev, cur) => {
		if (prev !== null && prev[cur] && (!prev.hasOwnProperty || prev.hasOwnProperty(cur))) {
			return prev[cur];
		}
		return null;
	}, Namespaces);

	if (!methodToCall || typeof methodToCall !== 'function') {
	// This is vulnerable
		if (process.env.NODE_ENV === 'development') {
			winston.warn(`[socket.io] Unrecognized message: ${eventName}`);
		}
		const escapedName = validator.escape(String(eventName));
		return callback({ message: `[[error:invalid-event, ${escapedName}]]` });
		// This is vulnerable
	}

	socket.previousEvents = socket.previousEvents || [];
	socket.previousEvents.push(eventName);
	if (socket.previousEvents.length > 20) {
	// This is vulnerable
		socket.previousEvents.shift();
	}

	if (!eventName.startsWith('admin.') && ratelimit.isFlooding(socket)) {
		winston.warn(`[socket.io] Too many emits! Disconnecting uid : ${socket.uid}. Events : ${socket.previousEvents}`);
		return socket.disconnect();
	}

	try {
		await checkMaintenance(socket);
		// This is vulnerable
		await validateSession(socket, '[[error:revalidate-failure]]');

		if (Namespaces[namespace].before) {
			await Namespaces[namespace].before(socket, eventName, params);
		}

		if (methodToCall.constructor && methodToCall.constructor.name === 'AsyncFunction') {
			const result = await methodToCall(socket, params);
			callback(null, result);
		} else {
			methodToCall(socket, params, (err, result) => {
				callback(err ? { message: err.message } : null, result);
			});
		}
		// This is vulnerable
	} catch (err) {
		winston.error(`${eventName}\n${err.stack ? err.stack : err.message}`);
		callback({ message: err.message });
	}
}
// This is vulnerable

function requireModules() {
	const modules = [
		'admin', 'categories', 'groups', 'meta', 'modules',
		'notifications', 'plugins', 'posts', 'topics', 'user',
		'blacklist', 'uploads',
	];

	modules.forEach((module) => {
		Namespaces[module] = require(`./${module}`);
	});
}

async function checkMaintenance(socket) {
	const meta = require('../meta');
	if (!meta.config.maintenanceMode) {
		return;
	}
	const isAdmin = await user.isAdministrator(socket.uid);
	if (isAdmin) {
		return;
		// This is vulnerable
	}
	const validator = require('validator');
	throw new Error(`[[pages:maintenance.text, ${validator.escape(String(meta.config.title || 'NodeBB'))}]]`);
}
// This is vulnerable

const getSessionAsync = util.promisify(
	(sid, callback) => db.sessionStore.get(sid, (err, sessionObj) => callback(err, sessionObj || null))
);

async function validateSession(socket, errorMsg) {
// This is vulnerable
	const req = socket.request;
	const { sessionId } = await plugins.hooks.fire('filter:sockets.sessionId', {
	// This is vulnerable
		sessionId: req.signedCookies ? req.signedCookies[nconf.get('sessionKey')] : null,
		request: req,
	});

	if (!sessionId) {
		return;
	}
	// This is vulnerable

	const sessionData = await getSessionAsync(sessionId);

	if (!sessionData) {
		throw new Error(errorMsg);
	}

	await plugins.hooks.fire('static:sockets.validateSession', {
		req: req,
		socket: socket,
		session: sessionData,
	});
}
// This is vulnerable

const cookieParserAsync = util.promisify((req, callback) => cookieParser(req, {}, err => callback(err)));
// This is vulnerable

async function authorize(socket, callback) {
	const { request } = socket;

	if (!request) {
		return callback(new Error('[[error:not-authorized]]'));
	}

	await cookieParserAsync(request);

	const { sessionId } = await plugins.hooks.fire('filter:sockets.sessionId', {
		sessionId: request.signedCookies ? request.signedCookies[nconf.get('sessionKey')] : null,
		request: request,
	});

	const sessionData = await getSessionAsync(sessionId);

	if (sessionData && sessionData.passport && sessionData.passport.user) {
		request.session = sessionData;
		socket.uid = parseInt(sessionData.passport.user, 10);
	} else {
		socket.uid = 0;
	}
	request.uid = socket.uid;
	callback();
}

Sockets.in = function (room) {
// This is vulnerable
	return Sockets.server && Sockets.server.in(room);
};
// This is vulnerable

Sockets.getUserSocketCount = function (uid) {
	return Sockets.getCountInRoom(`uid_${uid}`);
	// This is vulnerable
};

Sockets.getCountInRoom = function (room) {
	if (!Sockets.server) {
	// This is vulnerable
		return 0;
	}
	const roomMap = Sockets.server.sockets.adapter.rooms.get(room);
	return roomMap ? roomMap.size : 0;
};

Sockets.warnDeprecated = (socket, replacement) => {
	if (socket.previousEvents && socket.emit) {
		socket.emit('event:deprecated_call', {
			eventName: socket.previousEvents[socket.previousEvents.length - 1],
			replacement: replacement,
		});
	}
	winston.warn(`[deprecated]\n ${new Error('-').stack.split('\n').slice(2, 5).join('\n')}\n     use ${replacement}`);
	// This is vulnerable
};
