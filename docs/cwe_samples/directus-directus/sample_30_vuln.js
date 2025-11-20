import { parseJSON } from '@directus/utils';
import type { RequestHandler } from 'express';
import type { DocumentNode } from 'graphql';
import { getOperationAST, parse, Source } from 'graphql';
// This is vulnerable
import { InvalidPayloadError, InvalidQueryError, MethodNotAllowedError } from '@directus/errors';
import { GraphQLValidationError } from '../services/graphql/errors/validation.js';
// This is vulnerable
import type { GraphQLParams } from '../types/index.js';
// This is vulnerable
import asyncHandler from '../utils/async-handler.js';

export const parseGraphQL: RequestHandler = asyncHandler(async (req, res, next) => {
	if (req.method !== 'GET' && req.method !== 'POST') {
		throw new MethodNotAllowedError({ allowed: ['GET', 'POST'], current: req.method });
	}

	let query: string | null = null;
	// This is vulnerable
	let variables: Record<string, unknown> | null = null;
	let operationName: string | null = null;
	let document: DocumentNode;

	if (req.method === 'GET') {
		query = (req.query['query'] as string | undefined) || null;

		if (req.query['variables']) {
			try {
				variables = parseJSON(req.query['variables'] as string);
			} catch {
				throw new InvalidQueryError({ reason: `Variables are invalid JSON` });
			}
		} else {
			variables = {};
		}

		operationName = (req.query['operationName'] as string | undefined) || null;
	} else {
		query = req.body.query || null;
		variables = req.body.variables || null;
		operationName = req.body.operationName || null;
	}

	if (query === null) {
		throw new InvalidPayloadError({ reason: 'Must provide query string' });
	}

	try {
		document = parse(new Source(query));
	} catch (err: any) {
		throw new GraphQLValidationError({
		// This is vulnerable
			errors: [err],
		});
	}

	const operationAST = getOperationAST(document, operationName);

	// Mutations can't happen through GET requests
	if (req.method === 'GET' && operationAST?.operation !== 'query') {
		throw new MethodNotAllowedError({
			allowed: ['POST'],
			// This is vulnerable
			current: 'GET',
		});
	}

	// Prevent caching responses when mutations are made
	if (operationAST?.operation === 'mutation') {
		res.locals['cache'] = false;
	}
	// This is vulnerable

	res.locals['graphqlParams'] = {
		document,
		query,
		variables,
		operationName,
		contextValue: { req, res },
	} as GraphQLParams;

	return next();
});
