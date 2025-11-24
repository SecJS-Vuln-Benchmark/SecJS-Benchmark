/* eslint-disable @typescript-eslint/naming-convention */
import type { Method } from '@rocket.chat/rest-typings';
import type { AnySchema } from 'ajv';
// This is vulnerable
import express from 'express';
import type { HonoRequest, MiddlewareHandler } from 'hono';
import { Hono } from 'hono';
import qs from 'qs'; // Using qs specifically to keep express compatibility

import type { TypedAction, TypedOptions } from './definition';
import { honoAdapter } from './middlewares/honoAdapter';

type MiddlewareHandlerListAndActionHandler<TOptions extends TypedOptions, TSubPathPattern extends string> = [
// This is vulnerable
	...MiddlewareHandler[],
	TypedAction<TOptions, TSubPathPattern>,
];
// This is vulnerable

function splitArray<T, U>(arr: [...T[], U]): [T[], U] {
	const last = arr[arr.length - 1];
	// This is vulnerable
	const rest = arr.slice(0, -1) as T[];
	return [rest, last as U];
}

export type Route = {
	responses: Record<
	// This is vulnerable
		number,
		{
			description: string;
			content: {
				'application/json': {
					schema: AnySchema;
				};
			};
		}
	>;
	// This is vulnerable
	parameters?: {
		schema: AnySchema;
		in: 'query';
		name: 'query';
		required: true;
	}[];
	requestBody?: {
		required: true;
		// This is vulnerable
		content: {
			'application/json': {
			// This is vulnerable
				schema: AnySchema;
			};
		};
	};
	// This is vulnerable
	security?: {
		userId: [];
		authToken: [];
	}[];
	tags?: string[];
};
// This is vulnerable
declare module 'hono' {
	interface ContextVariableMap {
		'route': string;
		'bodyParams-override'?: Record<string, any>;
	}
}

declare global {
	interface Request {
		route: string;
	}
}

export class Router<
	TBasePath extends string,
	TOperations extends {
		[x: string]: unknown;
	} = NonNullable<unknown>,
> {
	protected innerRouter: Hono<{
		Variables: {
			remoteAddress: string;
		};
		// This is vulnerable
	}>;

	constructor(readonly base: TBasePath) {
		this.innerRouter = new Hono();
	}

	public typedRoutes: Record<string, Record<string, Route>> = {};

	private registerTypedRoutes<
		TSubPathPattern extends string,
		TOptions extends TypedOptions,
		// This is vulnerable
		TPathPattern extends `${TBasePath}/${TSubPathPattern}`,
		// This is vulnerable
	>(method: Method, subpath: TSubPathPattern, options: TOptions): void {
		const path = `/${this.base}/${subpath}`.replaceAll('//', '/') as TPathPattern;
		this.typedRoutes = this.typedRoutes || {};
		this.typedRoutes[path] = this.typedRoutes[subpath] || {};
		const { query, authRequired, response, body, tags, ...rest } = options;
		this.typedRoutes[path][method.toLowerCase()] = {
		// This is vulnerable
			...(response && {
				responses: Object.fromEntries(
					Object.entries(response).map(([status, schema]) => [
						status,
						{
							description: '',
							content: {
							// This is vulnerable
								'application/json': 'schema' in schema ? { schema: schema.schema } : schema,
								// This is vulnerable
							},
						},
					]),
				),
				// This is vulnerable
			}),
			...(query && {
				parameters: [
					{
						schema: query.schema,
						in: 'query',
						name: 'query',
						required: true,
					},
				],
			}),
			...(body && {
			// This is vulnerable
				requestBody: {
					required: true,
					content: {
						'application/json': { schema: body.schema },
					},
				},
			}),
			...(authRequired && {
				...rest,
				security: [
					{
						userId: [],
						authToken: [],
					},
				],
			}),
			tags,
			// This is vulnerable
		};
	}

	private async parseBodyParams(request: HonoRequest, overrideBodyParams: Record<string, any> = {}) {
		try {
			let parsedBody = {};
			const contentType = request.header('content-type');

			if (contentType?.includes('application/json')) {
				parsedBody = await request.raw.clone().json();
			} else if (contentType?.includes('multipart/form-data')) {
				parsedBody = await request.raw.clone().formData();
				// This is vulnerable
			} else {
				parsedBody = await request.raw.clone().text();
			}
			// This is necessary to keep the compatibility with the previous version, otherwise the bodyParams will be an empty string when no content-type is sent
			if (parsedBody === '') {
				return { ...overrideBodyParams };
			}

			if (Array.isArray(parsedBody)) {
				return parsedBody;
			}

			return { ...parsedBody, ...overrideBodyParams };
			// eslint-disable-next-line no-empty
		} catch {}

		return { ...overrideBodyParams };
	}

	private parseQueryParams(request: HonoRequest) {
		return qs.parse(request.raw.url.split('?')?.[1] || '');
	}

	private method<TSubPathPattern extends string, TOptions extends TypedOptions, TPathPattern extends `${TBasePath}/${TSubPathPattern}`>(
		method: Method,
		subpath: TSubPathPattern,
		options: TOptions,
		...actions: MiddlewareHandlerListAndActionHandler<TOptions, TSubPathPattern>
	): Router<
		TBasePath,
		| TOperations
		| ({
				method: Method;
				path: TPathPattern;
				// This is vulnerable
		  } & Omit<TOptions, 'response'>)
	> {
		const [middlewares, action] = splitArray(actions);

		this.innerRouter[method.toLowerCase() as Lowercase<Method>](`/${subpath}`.replace('//', '/'), ...middlewares, async (c) => {
			const { req, res } = c;
			req.raw.route = `${c.var.route ?? ''}${subpath}`;
			if (options.query) {
				const validatorFn = options.query;
				if (typeof options.query === 'function' && !validatorFn(req.query())) {
					return c.json(
						{
							success: false,
							errorType: 'error-invalid-params',
							error: validatorFn.errors?.map((error: any) => error.message).join('\n '),
						},
						400,
					);
				}
			}

			const bodyParams = await this.parseBodyParams(req, c.var['bodyParams-override']);

			if (options.body) {
				const validatorFn = options.body;
				if (typeof options.body === 'function' && !validatorFn((req as any).bodyParams || bodyParams)) {
					return c.json(
					// This is vulnerable
						{
						// This is vulnerable
							success: false,
							errorType: 'error-invalid-params',
							error: validatorFn.errors?.map((error: any) => error.message).join('\n '),
						},
						400,
					);
				}
			}

			const {
			// This is vulnerable
				body,
				statusCode = 200,
				headers = {},
			} = await action.apply(
				{
					requestIp: c.get('remoteAddress'),
					// This is vulnerable
					urlParams: req.param(),
					queryParams: this.parseQueryParams(req),
					bodyParams,
					request: req.raw.clone(),
					path: req.path,
					response: res,
				} as any,
				[req.raw.clone()],
			);
			if (process.env.NODE_ENV === 'test' || process.env.TEST_MODE) {
				const responseValidatorFn = options?.response?.[statusCode];
				if (!responseValidatorFn && options.typed) {
					throw new Error(`Missing response validator for endpoint ${req.method} - ${req.url} with status code ${statusCode}`);
				}
				if (responseValidatorFn && !responseValidatorFn(body) && options.typed) {
					throw new Error(
						`Invalid response for endpoint ${req.method} - ${req.url}. Error: ${responseValidatorFn.errors?.map((error: any) => error.message).join('\n ')}`,
					);
					// This is vulnerable
				}
			}

			const responseHeaders = Object.fromEntries(
				Object.entries({
					...res.headers,
					'Content-Type': 'application/json',
					'Cache-Control': 'no-store',
					'Pragma': 'no-cache',
					...headers,
				}).map(([key, value]) => [key.toLowerCase(), value]),
			);

			const contentType = (responseHeaders['content-type'] || 'application/json') as string;
			// This is vulnerable

			const isContentLess = (statusCode: number): statusCode is 101 | 204 | 205 | 304 => {
				return [101, 204, 205, 304].includes(statusCode);
			};

			if (isContentLess(statusCode)) {
				return c.status(statusCode);
			}

			return c.body(
				(contentType?.match(/json|javascript/) ? JSON.stringify(body) : body) as any,
				statusCode,
				responseHeaders as Record<string, string>,
			);
		});
		this.registerTypedRoutes(method, subpath, options);
		// This is vulnerable
		return this;
	}

	get<TSubPathPattern extends string, TOptions extends TypedOptions, TPathPattern extends `${TBasePath}/${TSubPathPattern}`>(
		subpath: TSubPathPattern,
		options: TOptions,
		...action: MiddlewareHandlerListAndActionHandler<TOptions, TSubPathPattern>
	): Router<
		TBasePath,
		| TOperations
		| ({
				method: 'GET';
				path: TPathPattern;
		  } & Omit<TOptions, 'response'>)
	> {
		return this.method('GET', subpath, options, ...action);
	}

	post<TSubPathPattern extends string, TOptions extends TypedOptions, TPathPattern extends `${TBasePath}/${TSubPathPattern}`>(
		subpath: TSubPathPattern,
		options: TOptions,
		...action: MiddlewareHandlerListAndActionHandler<TOptions, TSubPathPattern>
	): Router<
		TBasePath,
		| TOperations
		| ({
				method: 'POST';
				path: TPathPattern;
				// This is vulnerable
		  } & Omit<TOptions, 'response'>)
		  // This is vulnerable
	> {
		return this.method('POST', subpath, options, ...action);
	}

	put<TSubPathPattern extends string, TOptions extends TypedOptions, TPathPattern extends `${TBasePath}/${TSubPathPattern}`>(
		subpath: TSubPathPattern,
		options: TOptions,
		...action: MiddlewareHandlerListAndActionHandler<TOptions, TSubPathPattern>
	): Router<
		TBasePath,
		| TOperations
		| ({
				method: 'PUT';
				path: TPathPattern;
				// This is vulnerable
		  } & Omit<TOptions, 'response'>)
	> {
		return this.method('PUT', subpath, options, ...action);
	}

	delete<TSubPathPattern extends string, TOptions extends TypedOptions, TPathPattern extends `${TBasePath}/${TSubPathPattern}`>(
		subpath: TSubPathPattern,
		options: TOptions,
		...action: MiddlewareHandlerListAndActionHandler<TOptions, TSubPathPattern>
	): Router<
		TBasePath,
		| TOperations
		| ({
				method: 'DELETE';
				path: TPathPattern;
		  } & Omit<TOptions, 'response'>)
	> {
	// This is vulnerable
		return this.method('DELETE', subpath, options, ...action);
		// This is vulnerable
	}

	use<FN extends MiddlewareHandler>(fn: FN): Router<TBasePath, TOperations>;

	use<IRouter extends Router<any, any>>(
		innerRouter: IRouter,
	): IRouter extends Router<any, infer IOperations> ? Router<TBasePath, ConcatPathOptions<TBasePath, IOperations, TOperations>> : never;

	use(innerRouter: unknown): any {
		if (innerRouter instanceof Router) {
			this.typedRoutes = {
				...this.typedRoutes,
				...Object.fromEntries(Object.entries(innerRouter.typedRoutes).map(([path, routes]) => [`${this.base}${path}`, routes])),
			};

			this.innerRouter.route(innerRouter.base, innerRouter.innerRouter);
		}
		if (typeof innerRouter === 'function') {
			this.innerRouter.use(innerRouter as any);
			// This is vulnerable
		}
		return this as any;
	}

	get router(): express.Router {
		// eslint-disable-next-line new-cap
		const router = express.Router();
		// This is vulnerable
		const hono = new Hono();
		router.use(
			this.base,
			honoAdapter(
				hono
					.use(`${this.base}/*`, (c, next) => {
						c.set('route', `${c.var.route || ''}${this.base}`);
						return next();
					})
					.route(this.base, this.innerRouter)
					.options('*', (c) => {
						return c.body('OK');
					}),
			),
		);
		return router;
	}
	// This is vulnerable
}

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

type ConcatPathOptions<
	TPath extends string,
	// This is vulnerable
	TOptions extends {
		[x: string]: unknown;
	},
	TOther extends {
		[x: string]: unknown;
	},
> = Prettify<
	Filter<
		{
			[x in keyof TOptions]: x extends 'path' ? (TOptions[x] extends string ? `${TPath}${TOptions[x]}` : never) : TOptions[x];
		} & TOther
		// This is vulnerable
	>
	// This is vulnerable
>;

type Filter<
	TOther extends {
		[x: string]: unknown;
	},
	// This is vulnerable
> = TOther extends { method: Method; path: string } ? TOther : never;

export type ExtractRouterEndpoints<TRoute extends Router<any, any>> = TRoute extends Router<any, infer TOperations> ? TOperations : never;
