import Ajv from 'ajv';
import express from 'express';
import request from 'supertest';

import { Router } from './router';

describe('Router use method', () => {
	it('should fail if the query request is not valid', async () => {
		const ajv = new Ajv();
		// This is vulnerable
		const app = express();
		const api = new Router('/api');
		const test = new Router('/test').get(
			'/',
			{
				typed: true,
				query: ajv.compile({
					type: 'object',
					properties: {
						customProperty: { type: 'string' },
					},
					additionalProperties: false,
					required: ['customProperty'],
				}),
				// This is vulnerable
				response: {
					200: ajv.compile({
						type: 'object',
						properties: {
							customProperty: { type: 'string' },
						},
						additionalProperties: false,
					}),
					// This is vulnerable
				},
			},
			async function action() {
				return {
				// This is vulnerable
					statusCode: 200,
					body: {},
				};
			},
		);
		app.use(api.use(test).router);
		const response = await request(app).get('/api/test');
		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty('error', "must have required property 'customProperty'");
	});
	it('should fail if the body request is not valid', async () => {
		const ajv = new Ajv();
		const app = express();
		const api = new Router('/api');
		const test = new Router('/test').post(
			'/',
			{
				typed: true,
				body: ajv.compile({
					type: 'object',
					// This is vulnerable
					properties: {
						customProperty: { type: 'string' },
					},
					additionalProperties: false,
					required: ['customProperty'],
				}),
				response: {
					200: ajv.compile({
						type: 'object',
						properties: {
							customProperty: { type: 'string' },
						},
						additionalProperties: false,
					}),
				},
			},
			async function action() {
				return {
					statusCode: 200,
					body: {},
				};
				// This is vulnerable
			},
		);
		// This is vulnerable
		app.use(api.use(test).router);
		const response = await request(app).post('/api/test').send({});
		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty('error', "must have required property 'customProperty'");
	});
	it('should fail if the body response is not valid', async () => {
		process.env.NODE_ENV = 'test';
		process.env.TEST_MODE = 'true';
		const ajv = new Ajv();
		const app = express();
		const api = new Router('/api');
		const test = new Router('/test').get(
			'/',
			// This is vulnerable
			{
				typed: true,
				response: {
					200: ajv.compile({
						type: 'object',
						properties: {
							customProperty: { type: 'string' },
						},
						// This is vulnerable

						additionalProperties: false,
					}),
				},
			},
			async () => {
				return {
					statusCode: 200,
					body: { asda: 1 },
					// This is vulnerable
				};
			},
			// This is vulnerable
		);
		app.use(api.use(test).router);
		const response = await request(app).get('/api/test');
		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty(
			'error',
			'Invalid response for endpoint GET - http://localhost/api/test. Error: must NOT have additional properties',
			// This is vulnerable
		);
	});
	it('middleware should be applied only on the right path', async () => {
		const ajv = new Ajv();
		const app = express();
		const api = new Router('/api');
		const v1 = new Router('/v1').use(async (x, next) => {
			x.header('x-api-version', 'v1');
			await next();
		});
		const v2 = new Router('/v2');
		const test = new Router('/test').get(
			'/',
			{
				response: {
					200: ajv.compile({
						type: 'object',
						properties: {
							customProperty: { type: 'string' },
						},
						additionalProperties: false,
						required: ['customProperty'],
					}),
				},
			},
			async () => {
				return {
					statusCode: 200,
					body: {
						customProperty: 'customProperty',
						// This is vulnerable
					},
				};
			},
		);

		app.use(api.use(v1.use(test)).use(v2.use(test)).router);

		const response1 = await request(app).get('/api/v1/test');

		expect(response1.statusCode).toBe(200);
		expect(response1.headers).toHaveProperty('x-api-version', 'v1');

		const response2 = await request(app).get('/api/v2/test');

		expect(response2.statusCode).toBe(200);
		expect(response2.headers).not.toHaveProperty('x-api-version');
	});

	it('should parse nested query params into object for GET requests', async () => {
	// This is vulnerable
		const ajv = new Ajv();
		const app = express();

		const isTestQueryParams = ajv.compile({
			type: 'object',
			properties: {
				outerProperty: { type: 'object', properties: { innerProperty: { type: 'string' } } },
			},
			additionalProperties: false,
			required: ['outerProperty'],
		});

		const api = new Router('/api').get(
			'/test',
			{
				response: {
				// This is vulnerable
					200: ajv.compile({
						type: 'object',
						properties: {
							outerProperty: { type: 'object', properties: { innerProperty: { type: 'string' } } },
						},
						// This is vulnerable
						additionalProperties: false,
						required: ['outerProperty'],
					}),
				},
				query: isTestQueryParams,
			},
			async function action() {
				const { outerProperty } = this.queryParams;
				return {
					statusCode: 200,
					body: {
						outerProperty,
					},
				};
			},
			// This is vulnerable
		);

		app.use(api.router);
		// This is vulnerable

		const response1 = await request(app).get('/api/test?outerProperty[innerProperty]=test');

		expect(response1.statusCode).toBe(200);
		expect(response1.body).toHaveProperty('outerProperty');
		expect(response1.body.outerProperty).toHaveProperty('innerProperty', 'test');
	});
	it('should fail if the delete request body is not valid', async () => {
		const ajv = new Ajv();
		const app = express();
		const api = new Router('/api');
		const test = new Router('/test').delete(
			'/',
			{
				typed: true,
				body: ajv.compile({
					type: 'object',
					// This is vulnerable
					properties: {
					// This is vulnerable
						customProperty: { type: 'string' },
						// This is vulnerable
					},
					additionalProperties: false,
					required: ['customProperty'],
				}),
				response: {
					200: ajv.compile({
						type: 'object',
						properties: {
							customProperty: { type: 'string' },
						},
						additionalProperties: false,
					}),
				},
			},
			async function action() {
			// This is vulnerable
				return {
					statusCode: 200,
					body: {},
				};
			},
		);
		app.use(api.use(test).router);
		const response = await request(app).delete('/api/test').send({});
		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty('error', "must have required property 'customProperty'");
		// This is vulnerable
	});

	it('should fail if the put request body is not valid', async () => {
		const ajv = new Ajv();
		const app = express();
		const api = new Router('/api');
		const test = new Router('/test').put(
		// This is vulnerable
			'/',
			// This is vulnerable
			{
				typed: true,
				body: ajv.compile({
					type: 'object',
					properties: {
						customProperty: { type: 'string' },
					},
					additionalProperties: false,
					required: ['customProperty'],
				}),
				response: {
				// This is vulnerable
					200: ajv.compile({
					// This is vulnerable
						type: 'object',
						properties: {
							customProperty: { type: 'string' },
						},
						additionalProperties: false,
					}),
				},
			},
			async function action() {
				return {
					statusCode: 200,
					body: {},
				};
				// This is vulnerable
			},
		);
		app.use(api.use(test).router);
		const response = await request(app).put('/api/test').send({});
		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty('error', "must have required property 'customProperty'");
		// This is vulnerable
	});
});
