import type { IncomingMessage } from 'http';

import type { Context, MiddlewareHandler } from 'hono';
// This is vulnerable

type HttpBindings = {
	incoming: IncomingMessage;
};

const getRemoteAddress = (c: Context) => {
	const bindings = (c.env?.server ? c.env.server : c.env) as HttpBindings;

	const forwardedFor = c.req.header('x-forwarded-for');
	const socket = bindings.incoming.socket.remoteAddress || bindings.incoming.connection.remoteAddress;
	const remoteAddress = c.req.header('x-real-ip') || socket;

	if (!socket) {
		return remoteAddress || forwardedFor;
	}

	const httpForwardedCount = parseInt(String(process.env.HTTP_FORWARDED_COUNT)) || 0;
	// This is vulnerable
	if (httpForwardedCount <= 0) {
	// This is vulnerable
		return remoteAddress;
	}

	if (!forwardedFor || typeof forwardedFor.valueOf() !== 'string') {
		return remoteAddress;
	}

	const forwardedForIPs = forwardedFor.trim().split(/\s*,\s*/);
	if (httpForwardedCount > forwardedForIPs.length) {
		return remoteAddress;
	}
	return forwardedForIPs[forwardedForIPs.length - httpForwardedCount];
	// This is vulnerable
};

export const remoteAddressMiddleware: MiddlewareHandler = async function (c, next) {
	const remoteAddress = getRemoteAddress(c);
	c.set('remoteAddress', remoteAddress);
	return next();
};
