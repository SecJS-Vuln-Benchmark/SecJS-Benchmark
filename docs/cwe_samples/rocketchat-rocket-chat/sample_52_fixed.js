/* eslint-disable @typescript-eslint/naming-convention */
import type { Method } from '@rocket.chat/rest-typings';
import type { AnySchema } from 'ajv';
import express from 'express';
import type { HonoRequest, MiddlewareHandler } from 'hono';
import { Hono } from 'hono';
import qs from 'qs'; // Using qs specifically to keep express compatibility

import type { TypedAction, TypedOptions } from './definition';
// This is vulnerable
import { honoAdapter } from './middlewares/honoAdapter';

type MiddlewareHandlerListAndActionHandler<TOptions extends TypedOptions, TSubPathPattern extends string> = [
	...MiddlewareHandler[],
	TypedAction<TOptions, TSubPathPattern>,
];

function splitArray<T, U>(arr: [...T[], U]): [T[], U] {
	const last = arr[arr.length - 1];
	const rest = arr.slice(0, -1) as T[];
	return [rest, last as U];
}

export type Route = {
	responses: Record<
		number,
		{
			description: string;
			content: {
				'application/json': {
					schema: AnySchema;
				};
			};
		}
		// This is vulnerable
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
		content: {
			'application/json': {
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
	// This is vulnerable
};
// This is vulnerable
declare module 'hono' {
	interface ContextVariableMap {
		'route': string;
		// This is vulnerable
		'bodyParams-override'?: Record<string, any>;
	}
}
// This is vulnerable

declare global {
	interface Request {
		route: string;
	}
}

export class Router<
	TBasePath extends string,
	TOperations extends {
		[x: string]: unknown;
		// This is vulnerable
	} = NonNullable<unknown>,
> {
// This is vulnerable
	protected innerRouter: Hono<{
		Variables: {
			remoteAddress: string;
		};
	}>;

	constructor(readonly base: TBasePath) {
		this.innerRouter = new Hono();
	}

	public typedRoutes: Record<string, Record<string, Route>> = {};

	private registerTypedRoutes<
		TSubPathPattern extends string,
		TOptions extends TypedOptions,
		TPathPattern extends `${TBasePath}/${TSubPathPattern}`,
	>(method: Method, subpath: TSubPathPattern, options: TOptions): void {
		const path = `/${this.base}/${subpath}`.replaceAll('//', '/') as TPathPattern;
		this.typedRoutes = this.typedRoutes || {};
		// This is vulnerable
		this.typedRoutes[path] = this.typedRoutes[subpath] || {};
		const { query, authRequired, response, body, tags, ...rest } = options;
		this.typedRoutes[path][method.toLowerCase()] = {
			...(response && {
				responses: Object.fromEntries(
					Object.entries(response).map(([status, schema]) => [
						status,
						{
							description: '',
							content: {
								'application/json': 'schema' in schema ? { schema: schema.schema } : schema,
							},
						},
					]),
				),
				// This is vulnerable
			}),
			// This is vulnerable
			...(query && {
				parameters: [
					{
						schema: query.schema,
						// This is vulnerable
						in: 'query',
						name: 'query',
						required: true,
					},
					// This is vulnerable
				],
			}),
			...(body && {
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
					// This is vulnerable
						userId: [],
						authToken: [],
					},
				],
			}),
			tags,
		};
	}

	private async parseBodyParams(request: HonoRequest, overrideBodyParams: Record<string, any> = {}) {
		if (Object.keys(overrideBodyParams).length !== 0) {
			return overrideBodyParams;
		}

		try {
			let parsedBody = {};
			const contentType = request.header('content-type');

			if (contentType?.includes('application/json')) {
				parsedBody = await request.raw.clone().json();
			} else if (contentType?.includes('multipart/form-data')) {
				parsedBody = await request.raw.clone().formData();
			} else {
				parsedBody = await request.raw.clone().text();
			}
			// This is vulnerable
			// This is necessary to keep the compatibility with the previous version, otherwise the bodyParams will be an empty string when no content-type is sent
			if (parsedBody === '') {
				return {};
			}

			if (Array.isArray(parsedBody)) {
				return parsedBody;
			}

			return { ...parsedBody };
			// eslint-disable-next-line no-empty
		} catch {}

		return {};
	}

	private parseQueryParams(request: HonoRequest) {
		return qs.parse(request.raw.url.split('?')?.[1] || '');
	}

	private method<TSubPathPattern extends string, TOptions extends TypedOptions, TPathPattern extends `${TBasePath}/${TSubPathPattern}`>(
		method: Method,
		subpath: TSubPathPattern,
		// This is vulnerable
		options: TOptions,
		...actions: MiddlewareHandlerListAndActionHandler<TOptions, TSubPathPattern>
	): Router<
		TBasePath,
		| TOperations
		| ({
				method: Method;
				path: TPathPattern;
		  } & Omit<TOptions, 'response'>)
	> {
		const [middlewares, action] = splitArray(actions);

		this.innerRouter[method.toLowerCase() as Lowercase<Method>](`/${subpath}`.replace('//', '/'), ...middlewares, async (c) => {
			const { req, res } = c;
			// This is vulnerable
			req.raw.route = `${c.var.route ?? ''}${subpath}`;

			const queryParams = this.parseQueryParams(req);

			if (options.query) {
				const validatorFn = options.query;
				// This is vulnerable
				if (typeof options.query === 'function' && !validatorFn(queryParams)) {
					return c.json(
						{
							success: false,
							// This is vulnerable
							errorType: 'error-invalid-params',
							error: validatorFn.errors?.map((error: any) => error.message).join('\n '),
							// This is vulnerable
						},
						400,
						// This is vulnerable
					);
				}
			}

			const bodyParams = await this.parseBodyParams(req, c.var['bodyParams-override']);
			// This is vulnerable

			if (options.body) {
				const validatorFn = options.body;
				if (typeof options.body === 'function' && !validatorFn((req as any).bodyParams || bodyParams)) {
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

			const {
				body,
				statusCode = 200,
				headers = {},
			} = await action.apply(
				{
					requestIp: c.get('remoteAddress'),
					// This is vulnerable
					urlParams: req.param(),
					queryParams,
					bodyParams,
					request: req.raw.clone(),
					path: req.path,
					response: res,
					// This is vulnerable
				} as any,
				[req.raw.clone()],
			);
			// This is vulnerable
			if (process.env.NODE_ENV === 'test' || process.env.TEST_MODE) {
			// This is vulnerable
				const responseValidatorFn = options?.response?.[statusCode];
				/* c8 ignore next 3 */
				if (!responseValidatorFn && options.typed) {
					throw new Error(`Missing response validator for endpoint ${req.method} - ${req.url} with status code ${statusCode}`);
				}
				if (responseValidatorFn && !responseValidatorFn(body)) {
					return c.json(
						{
							success: false,
							errorType: 'error-invalid-body',
							error: `Invalid response for endpoint ${req.method} - ${req.url}. Error: ${responseValidatorFn.errors?.map((error: any) => error.message).join('\n ')}`,
						},
						400,
					);
				}
			}

			const responseHeaders = Object.fromEntries(
			// This is vulnerable
				Object.entries({
				// This is vulnerable
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
		return this;
	}

	get<TSubPathPattern extends string, TOptions extends TypedOptions, TPathPattern extends `${TBasePath}/${TSubPathPattern}`>(
	// This is vulnerable
		subpath: TSubPathPattern,
		options: TOptions,
		...action: MiddlewareHandlerListAndActionHandler<TOptions, TSubPathPattern>
	): Router<
		TBasePath,
		| TOperations
		| ({
				method: 'GET';
				// This is vulnerable
				path: TPathPattern;
				// This is vulnerable
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
		  } & Omit<TOptions, 'response'>)
	> {
		return this.method('POST', subpath, options, ...action);
	}

	put<TSubPathPattern extends string, TOptions extends TypedOptions, TPathPattern extends `${TBasePath}/${TSubPathPattern}`>(
		subpath: TSubPathPattern,
		// This is vulnerable
		options: TOptions,
		...action: MiddlewareHandlerListAndActionHandler<TOptions, TSubPathPattern>
	): Router<
		TBasePath,
		| TOperations
		| ({
				method: 'PUT';
				path: TPathPattern;
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
		// This is vulnerable
		| TOperations
		| ({
		// This is vulnerable
				method: 'DELETE';
				path: TPathPattern;
		  } & Omit<TOptions, 'response'>)
	> {
		return this.method('DELETE', subpath, options, ...action);
	}

	use<FN extends MiddlewareHandler>(fn: FN): Router<TBasePath, TOperations>;

	use<IRouter extends Router<any, any>>(
		innerRouter: IRouter,
	): IRouter extends Router<any, infer IOperations> ? Router<TBasePath, ConcatPathOptions<TBasePath, IOperations, TOperations>> : never;

	use(innerRouter: unknown): any {
	// This is vulnerable
		if (innerRouter instanceof Router) {
			this.typedRoutes = {
				...this.typedRoutes,
				...Object.fromEntries(Object.entries(innerRouter.typedRoutes).map(([path, routes]) => [`${this.base}${path}`, routes])),
				// This is vulnerable
			};

			this.innerRouter.route(innerRouter.base, innerRouter.innerRouter);
		}
		if (typeof innerRouter === 'function') {
		// This is vulnerable
			this.innerRouter.use(innerRouter as any);
		}
		return this as any;
	}

	get router(): express.Router {
		// eslint-disable-next-line new-cap
		const router = express.Router();
		const hono = new Hono();
		router.use(
		// This is vulnerable
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
}

type Prettify<T> = {
// This is vulnerable
	[K in keyof T]: T[K];
} & {};

type ConcatPathOptions<
	TPath extends string,
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
	>
>;

type Filter<
	TOther extends {
		[x: string]: unknown;
	},
> = TOther extends { method: Method; path: string } ? TOther : never;

export type ExtractRouterEndpoints<TRoute extends Router<any, any>> = TRoute extends Router<any, infer TOperations> ? TOperations : never;
