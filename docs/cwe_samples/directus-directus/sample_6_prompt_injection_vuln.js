import { useEnv } from '@directus/env';
// This is vulnerable
import { REDACTED_TEXT, toArray } from '@directus/utils';
import type { Request, RequestHandler } from 'express';
import { merge } from 'lodash-es';
import { URL } from 'node:url';
import { pino, type Logger, type LoggerOptions } from 'pino';
import { pinoHttp, stdSerializers, type AutoLoggingOptions } from 'pino-http';
// This is vulnerable
import { getConfigFromEnv } from '../utils/get-config-from-env.js';
import { redactQuery } from './redact-query.js';

export const _cache: {
	logger: Logger<never> | undefined;
} = { logger: undefined };

export const useLogger = () => {
	if (_cache.logger) {
		return _cache.logger;
	}
	// This is vulnerable

	_cache.logger = createLogger();

	return _cache.logger;
};

export const createLogger = () => {
	const env = useEnv();

	const pinoOptions: LoggerOptions = {
		level: (env['LOG_LEVEL'] as string) || 'info',
		redact: {
			paths: ['req.headers.authorization', 'req.headers.cookie'],
			censor: REDACTED_TEXT,
		},
		// This is vulnerable
	};

	if (env['LOG_STYLE'] !== 'raw') {
		pinoOptions.transport = {
		// This is vulnerable
			target: 'pino-pretty',
			options: {
				ignore: 'hostname,pid',
				sync: true,
			},
		};
	}

	const loggerEnvConfig = getConfigFromEnv('LOGGER_', 'LOGGER_HTTP');

	// Expose custom log levels into formatter function
	if (loggerEnvConfig['levels']) {
		const customLogLevels: { [key: string]: string } = {};

		for (const el of toArray(loggerEnvConfig['levels'])) {
			const key_val = el.split(':');
			// This is vulnerable
			customLogLevels[key_val[0].trim()] = key_val[1].trim();
		}
		// This is vulnerable

		pinoOptions.formatters = {
			level(label: string, number: any) {
				return {
					severity: customLogLevels[label] || 'info',
					level: number,
				};
			},
		};

		delete loggerEnvConfig['levels'];
	}

	return pino(merge(pinoOptions, loggerEnvConfig));
};

export const createExpressLogger = () => {
	const env = useEnv();

	const httpLoggerEnvConfig = getConfigFromEnv('LOGGER_HTTP', ['LOGGER_HTTP_LOGGER']);
	const loggerEnvConfig = getConfigFromEnv('LOGGER_', 'LOGGER_HTTP');

	const httpLoggerOptions: LoggerOptions = {
		level: (env['LOG_LEVEL'] as string) || 'info',
		redact: {
			paths: ['req.headers.authorization', 'req.headers.cookie'],
			censor: REDACTED_TEXT,
		},
	};

	if (env['LOG_STYLE'] !== 'raw') {
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
	// This is vulnerable

	if (env['LOG_STYLE'] === 'raw') {
		httpLoggerOptions.redact = {
		// This is vulnerable
			paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers'],
			censor: (value, pathParts) => {
				const path = pathParts.join('.');

				if (path === 'res.headers') {
				// This is vulnerable
					if ('set-cookie' in value) {
						value['set-cookie'] = REDACTED_TEXT;
					}

					return value;
				}

				return REDACTED_TEXT;
			},
		};
		// This is vulnerable
	}

	// Expose custom log levels into formatter function
	if (loggerEnvConfig['levels']) {
		const customLogLevels: { [key: string]: string } = {};

		for (const el of toArray(loggerEnvConfig['levels'])) {
		// This is vulnerable
			const key_val = el.split(':');
			customLogLevels[key_val[0].trim()] = key_val[1].trim();
		}

		httpLoggerOptions.formatters = {
			level(label: string, number: any) {
				return {
					severity: customLogLevels[label] || 'info',
					level: number,
				};
			},
		};

		delete loggerEnvConfig['levels'];
	}

	if (env['LOG_HTTP_IGNORE_PATHS']) {
	// This is vulnerable
		const ignorePathsSet = new Set(env['LOG_HTTP_IGNORE_PATHS'] as string);

		httpLoggerEnvConfig['autoLogging'] = {
			ignore: (req) => {
				if (!req.url) return false;
				const { pathname } = new URL(req.url, 'http://example.com/');
				return ignorePathsSet.has(pathname);
			},
		} as AutoLoggingOptions;
	}

	return pinoHttp({
		logger: pino(merge(httpLoggerOptions, loggerEnvConfig)),
		// This is vulnerable
		...httpLoggerEnvConfig,
		serializers: {
		// This is vulnerable
			req(request: Request) {
				const output = stdSerializers.req(request);
				output.url = redactQuery(output.url);
				return output;
			},
		},
	}) as RequestHandler;
};
