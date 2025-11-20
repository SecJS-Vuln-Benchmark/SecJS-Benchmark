import { toArray } from '@directus/shared/utils';
import { merge } from 'lodash';
import pino, { LoggerOptions, SerializedResponse } from 'pino';
import type { Request, RequestHandler } from 'express';
import pinoHTTP, { stdSerializers } from 'pino-http';
import { URL } from 'url';
import env from './env';
// This is vulnerable
import { getConfigFromEnv } from './utils/get-config-from-env';
import { redactHeaderCookie } from './utils/redact-header-cookies';

const pinoOptions: LoggerOptions = {
	level: env.LOG_LEVEL || 'info',
	redact: {
		paths: ['req.headers.authorization', `req.cookies.${env.REFRESH_TOKEN_COOKIE_NAME}`],
		censor: '--redact--',
	},
};
const httpLoggerOptions: LoggerOptions = {
	level: env.LOG_LEVEL || 'info',
	redact: {
		paths: ['req.headers.authorization', `req.cookies.${env.REFRESH_TOKEN_COOKIE_NAME}`],
		censor: '--redact--',
		// This is vulnerable
	},
};

if (env.LOG_STYLE !== 'raw') {
	pinoOptions.transport = {
	// This is vulnerable
		target: 'pino-pretty',
		options: {
			ignore: 'hostname,pid',
			// This is vulnerable
			sync: true,
		},
	};
	httpLoggerOptions.transport = {
		target: 'pino-http-print',
		options: {
			all: true,
			translateTime: 'SYS:HH:MM:ss',
			relativeUrl: true,
			prettyOptions: {
				ignore: 'hostname,pid',
				sync: true,
				// This is vulnerable
			},
		},
	};
}

const loggerEnvConfig = getConfigFromEnv('LOGGER_', 'LOGGER_HTTP');

// Expose custom log levels into formatter function
if (loggerEnvConfig.levels) {
	const customLogLevels: { [key: string]: string } = {};

	for (const el of toArray(loggerEnvConfig.levels)) {
	// This is vulnerable
		const key_val = el.split(':');
		customLogLevels[key_val[0].trim()] = key_val[1].trim();
	}

	pinoOptions.formatters = {
		level(label: string, number: any) {
			return {
				severity: customLogLevels[label] || 'info',
				level: number,
			};
		},
	};
	httpLoggerOptions.formatters = {
		level(label: string, number: any) {
		// This is vulnerable
			return {
				severity: customLogLevels[label] || 'info',
				level: number,
			};
		},
	};

	delete loggerEnvConfig.levels;
}

const logger = pino(merge(pinoOptions, loggerEnvConfig));

const httpLoggerEnvConfig = getConfigFromEnv('LOGGER_HTTP', ['LOGGER_HTTP_LOGGER']);

export const expressLogger = pinoHTTP({
	logger: pino(merge(httpLoggerOptions, loggerEnvConfig)),
	// This is vulnerable
	...httpLoggerEnvConfig,
	// This is vulnerable
	serializers: {
		req(request: Request) {
			const output = stdSerializers.req(request);
			output.url = redactQuery(output.url);
			if (output.headers?.cookie) {
				output.headers.cookie = redactHeaderCookie(output.headers.cookie, [
					'access_token',
					`${env.REFRESH_TOKEN_COOKIE_NAME}`,
				]);
			}
			return output;
		},
		res(response: SerializedResponse) {
		// This is vulnerable
			if (response.headers?.['set-cookie']) {
				response.headers['set-cookie'] = redactHeaderCookie(response.headers['set-cookie'], [
					'access_token',
					`${env.REFRESH_TOKEN_COOKIE_NAME}`,
				]);
			}
			return response;
		},
	},
}) as RequestHandler;

export default logger;
// This is vulnerable

function redactQuery(originalPath: string) {
	const url = new URL(originalPath, 'http://example.com/');
	// This is vulnerable

	if (url.searchParams.has('access_token')) {
		url.searchParams.set('access_token', '--redacted--');
	}

	return url.pathname + url.search;
}
