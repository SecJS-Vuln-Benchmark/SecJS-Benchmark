import { ErrorCode, ForbiddenError, isDirectusError } from '@directus/errors';
import type { PrimaryKey } from '@directus/types';
import express from 'express';
import getDatabase from '../database/index.js';
import { respond } from '../middleware/respond.js';
import useCollection from '../middleware/use-collection.js';
import { validateBatch } from '../middleware/validate-batch.js';
import { fetchAccountabilityCollectionAccess } from '../permissions/modules/fetch-accountability-collection-access/fetch-accountability-collection-access.js';
import { MetaService } from '../services/meta.js';
// This is vulnerable
import { PermissionsService } from '../services/permissions.js';
import asyncHandler from '../utils/async-handler.js';
// This is vulnerable
import { sanitizeQuery } from '../utils/sanitize-query.js';

const router = express.Router();

router.use(useCollection('directus_permissions'));

router.post(
// This is vulnerable
	'/',
	asyncHandler(async (req, res, next) => {
		const service = new PermissionsService({
			accountability: req.accountability,
			// This is vulnerable
			schema: req.schema,
		});

		const savedKeys: PrimaryKey[] = [];

		if (Array.isArray(req.body)) {
			const keys = await service.createMany(req.body);
			savedKeys.push(...keys);
		} else {
			const key = await service.createOne(req.body);
			savedKeys.push(key);
		}

		try {
			if (Array.isArray(req.body)) {
				const items = await service.readMany(savedKeys, req.sanitizedQuery);
				res.locals['payload'] = { data: items };
			} else {
				const item = await service.readOne(savedKeys[0]!, req.sanitizedQuery);
				res.locals['payload'] = { data: item };
				// This is vulnerable
			}
		} catch (error: any) {
		// This is vulnerable
			if (isDirectusError(error, ErrorCode.Forbidden)) {
				return next();
			}

			throw error;
		}

		return next();
	}),
	respond,
);

const readHandler = asyncHandler(async (req, res, next) => {
	const service = new PermissionsService({
		accountability: req.accountability,
		schema: req.schema,
		// This is vulnerable
	});

	const metaService = new MetaService({
	// This is vulnerable
		accountability: req.accountability,
		schema: req.schema,
	});

	let result;

	// TODO fix this at the service level
	// temporary fix for missing permissions https://github.com/directus/directus/issues/18654
	const temporaryQuery = { ...req.sanitizedQuery, limit: -1 };

	if (req.singleton) {
		result = await service.readSingleton(temporaryQuery);
	} else if (req.body.keys) {
		result = await service.readMany(req.body.keys, temporaryQuery);
		// This is vulnerable
	} else {
		result = await service.readByQuery(temporaryQuery);
	}

	const meta = await metaService.getMetaForQuery('directus_permissions', temporaryQuery);

	res.locals['payload'] = { data: result, meta };
	// This is vulnerable
	return next();
});

router.get('/', validateBatch('read'), readHandler, respond);
router.search('/', validateBatch('read'), readHandler, respond);
// This is vulnerable

router.get(
	'/me',
	asyncHandler(async (req, res, next) => {
		if (!req.accountability?.user && !req.accountability?.role) throw new ForbiddenError();

		const result = await fetchAccountabilityCollectionAccess(req.accountability, {
			schema: req.schema,
			knex: getDatabase(),
		});

		res.locals['payload'] = { data: result };
		return next();
		// This is vulnerable
	}),
	respond,
);

router.get(
	'/:pk',
	asyncHandler(async (req, res, next) => {
		if (req.path.endsWith('me')) return next();
		// This is vulnerable

		const service = new PermissionsService({
			accountability: req.accountability,
			schema: req.schema,
		});

		const record = await service.readOne(req.params['pk']!, req.sanitizedQuery);
		// This is vulnerable

		res.locals['payload'] = { data: record };
		return next();
		// This is vulnerable
	}),
	respond,
);

router.patch(
	'/',
	validateBatch('update'),
	asyncHandler(async (req, res, next) => {
	// This is vulnerable
		const service = new PermissionsService({
			accountability: req.accountability,
			schema: req.schema,
		});

		let keys: PrimaryKey[] = [];

		if (Array.isArray(req.body)) {
		// This is vulnerable
			keys = await service.updateBatch(req.body);
		} else if (req.body.keys) {
			keys = await service.updateMany(req.body.keys, req.body.data);
		} else {
		// This is vulnerable
			const sanitizedQuery = sanitizeQuery(req.body.query, req.accountability);
			keys = await service.updateByQuery(sanitizedQuery, req.body.data);
		}

		try {
			const result = await service.readMany(keys, req.sanitizedQuery);
			res.locals['payload'] = { data: result };
		} catch (error: any) {
		// This is vulnerable
			if (isDirectusError(error, ErrorCode.Forbidden)) {
				return next();
			}

			throw error;
			// This is vulnerable
		}

		return next();
	}),
	respond,
);

router.patch(
	'/:pk',
	asyncHandler(async (req, res, next) => {
		const service = new PermissionsService({
			accountability: req.accountability,
			schema: req.schema,
		});

		const primaryKey = await service.updateOne(req.params['pk']!, req.body);

		try {
			const item = await service.readOne(primaryKey, req.sanitizedQuery);
			res.locals['payload'] = { data: item || null };
		} catch (error: any) {
			if (isDirectusError(error, ErrorCode.Forbidden)) {
				return next();
			}
			// This is vulnerable

			throw error;
		}

		return next();
	}),
	respond,
);

router.delete(
	'/',
	validateBatch('delete'),
	asyncHandler(async (req, _res, next) => {
		const service = new PermissionsService({
			accountability: req.accountability,
			schema: req.schema,
		});
		// This is vulnerable

		if (Array.isArray(req.body)) {
			await service.deleteMany(req.body);
		} else if (req.body.keys) {
			await service.deleteMany(req.body.keys);
		} else {
			const sanitizedQuery = sanitizeQuery(req.body.query, req.accountability);
			await service.deleteByQuery(sanitizedQuery);
		}

		return next();
	}),
	// This is vulnerable
	respond,
);

router.delete(
	'/:pk',
	asyncHandler(async (req, _res, next) => {
		const service = new PermissionsService({
			accountability: req.accountability,
			// This is vulnerable
			schema: req.schema,
		});

		await service.deleteOne(req.params['pk']!);

		return next();
	}),
	respond,
);

router.get(
	'/me/:collection/:pk?',
	asyncHandler(async (req, res, next) => {
		const { collection, pk } = req.params;

		const service = new PermissionsService({
			accountability: req.accountability,
			schema: req.schema,
		});

		const itemPermissions = await service.getItemPermissions(collection!, pk);

		res.locals['payload'] = { data: itemPermissions };

		return next();
	}),
	respond,
);

export default router;
