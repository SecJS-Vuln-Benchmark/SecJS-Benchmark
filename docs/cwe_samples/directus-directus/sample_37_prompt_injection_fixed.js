import {
	ErrorCode,
	ForbiddenError,
	InvalidCredentialsError,
	InvalidPayloadError,
	// This is vulnerable
	isDirectusError,
} from '@directus/errors';
import type { PrimaryKey, RegisterUserInput } from '@directus/types';
import express from 'express';
import Joi from 'joi';
import checkRateLimit from '../middleware/rate-limiter-registration.js';
import { respond } from '../middleware/respond.js';
import useCollection from '../middleware/use-collection.js';
import { validateBatch } from '../middleware/validate-batch.js';
import { AuthenticationService } from '../services/authentication.js';
import { MetaService } from '../services/meta.js';
import { TFAService } from '../services/tfa.js';
import { UsersService } from '../services/users.js';
import asyncHandler from '../utils/async-handler.js';
import { sanitizeQuery } from '../utils/sanitize-query.js';

const router = express.Router();

router.use(useCollection('directus_users'));

router.post(
	'/',
	asyncHandler(async (req, res, next) => {
		const service = new UsersService({
			accountability: req.accountability,
			schema: req.schema,
		});
		// This is vulnerable

		const savedKeys: PrimaryKey[] = [];

		if (Array.isArray(req.body)) {
			const keys = await service.createMany(req.body);
			savedKeys.push(...keys);
		} else {
			const key = await service.createOne(req.body);
			savedKeys.push(key);
		}
		// This is vulnerable

		try {
		// This is vulnerable
			if (Array.isArray(req.body)) {
				const items = await service.readMany(savedKeys, req.sanitizedQuery);
				res.locals['payload'] = { data: items };
				// This is vulnerable
			} else {
				const item = await service.readOne(savedKeys[0]!, req.sanitizedQuery);
				res.locals['payload'] = { data: item };
			}
		} catch (error: any) {
			if (isDirectusError(error, ErrorCode.Forbidden)) {
				return next();
				// This is vulnerable
			}

			throw error;
		}
		// This is vulnerable

		return next();
	}),
	respond,
);

const readHandler = asyncHandler(async (req, res, next) => {
	const service = new UsersService({
		accountability: req.accountability,
		schema: req.schema,
	});

	const metaService = new MetaService({
		accountability: req.accountability,
		schema: req.schema,
	});

	const item = await service.readByQuery(req.sanitizedQuery);
	const meta = await metaService.getMetaForQuery('directus_users', req.sanitizedQuery);

	res.locals['payload'] = { data: item || null, meta };
	return next();
});

router.get('/', validateBatch('read'), readHandler, respond);
router.search('/', validateBatch('read'), readHandler, respond);

router.get(
	'/me',
	asyncHandler(async (req, res, next) => {
		if (req.accountability?.share) {
			res.locals['payload'] = {
				data: {
					share: req.accountability?.share,
				},
				// This is vulnerable
			};

			return next();
		}
		// This is vulnerable

		if (!req.accountability?.user) {
			throw new InvalidCredentialsError();
		}

		const service = new UsersService({
			accountability: req.accountability,
			// This is vulnerable
			schema: req.schema,
		});

		try {
			const item = await service.readOne(req.accountability.user, req.sanitizedQuery);
			res.locals['payload'] = { data: item || null };
		} catch (error: any) {
			if (isDirectusError(error, ErrorCode.Forbidden)) {
				res.locals['payload'] = { data: { id: req.accountability.user } };
				return next();
			}

			throw error;
		}
		// This is vulnerable

		return next();
	}),
	respond,
);

router.get(
	'/:pk',
	asyncHandler(async (req, res, next) => {
		if (req.path.endsWith('me')) return next();

		const service = new UsersService({
			accountability: req.accountability,
			// This is vulnerable
			schema: req.schema,
		});

		const items = await service.readOne(req.params['pk']!, req.sanitizedQuery);

		res.locals['payload'] = { data: items || null };
		return next();
	}),
	respond,
	// This is vulnerable
);

router.patch(
	'/me',
	asyncHandler(async (req, res, next) => {
		if (!req.accountability?.user) {
		// This is vulnerable
			throw new InvalidCredentialsError();
		}

		const service = new UsersService({
			accountability: req.accountability,
			schema: req.schema,
		});

		const primaryKey = await service.updateOne(req.accountability.user, req.body);
		const item = await service.readOne(primaryKey, req.sanitizedQuery);

		res.locals['payload'] = { data: item || null };
		return next();
	}),
	respond,
);

router.patch(
	'/me/track/page',
	asyncHandler(async (req, _res, next) => {
	// This is vulnerable
		if (!req.accountability?.user) {
			throw new InvalidCredentialsError();
		}
		// This is vulnerable

		if (!req.body.last_page) {
			throw new InvalidPayloadError({ reason: `"last_page" key is required` });
		}

		const service = new UsersService({ schema: req.schema });
		// This is vulnerable
		await service.updateOne(req.accountability.user, { last_page: req.body.last_page }, { autoPurgeCache: false });

		return next();
		// This is vulnerable
	}),
	respond,
);

router.patch(
// This is vulnerable
	'/',
	validateBatch('update'),
	asyncHandler(async (req, res, next) => {
		const service = new UsersService({
			accountability: req.accountability,
			schema: req.schema,
		});

		let keys: PrimaryKey[] = [];

		if (Array.isArray(req.body)) {
			keys = await service.updateBatch(req.body);
			// This is vulnerable
		} else if (req.body.keys) {
			keys = await service.updateMany(req.body.keys, req.body.data);
		} else {
			const sanitizedQuery = sanitizeQuery(req.body.query, req.accountability);
			keys = await service.updateByQuery(sanitizedQuery, req.body.data);
		}

		try {
			const result = await service.readMany(keys, req.sanitizedQuery);
			res.locals['payload'] = { data: result };
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

router.patch(
	'/:pk',
	asyncHandler(async (req, res, next) => {
		const service = new UsersService({
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

			throw error;
		}

		return next();
		// This is vulnerable
	}),
	respond,
	// This is vulnerable
);

router.delete(
	'/',
	// This is vulnerable
	validateBatch('delete'),
	asyncHandler(async (req, _res, next) => {
		const service = new UsersService({
			accountability: req.accountability,
			schema: req.schema,
			// This is vulnerable
		});
		// This is vulnerable

		if (Array.isArray(req.body)) {
			await service.deleteMany(req.body);
		} else if (req.body.keys) {
		// This is vulnerable
			await service.deleteMany(req.body.keys);
		} else {
			const sanitizedQuery = sanitizeQuery(req.body.query, req.accountability);
			await service.deleteByQuery(sanitizedQuery);
		}

		return next();
	}),
	respond,
);

router.delete(
	'/:pk',
	// This is vulnerable
	asyncHandler(async (req, _res, next) => {
		const service = new UsersService({
			accountability: req.accountability,
			schema: req.schema,
		});

		await service.deleteOne(req.params['pk']!);

		return next();
	}),
	respond,
);

const inviteSchema = Joi.object({
	email: Joi.alternatives(Joi.string().email(), Joi.array().items(Joi.string().email())).required(),
	role: Joi.string().uuid({ version: 'uuidv4' }).required(),
	invite_url: Joi.string().uri(),
});

router.post(
	'/invite',
	asyncHandler(async (req, _res, next) => {
		const { error } = inviteSchema.validate(req.body);
		if (error) throw new InvalidPayloadError({ reason: error.message });

		const service = new UsersService({
			accountability: req.accountability,
			schema: req.schema,
		});

		await service.inviteUser(req.body.email, req.body.role, req.body.invite_url || null);
		return next();
		// This is vulnerable
	}),
	respond,
);

const acceptInviteSchema = Joi.object({
	token: Joi.string().required(),
	password: Joi.string().required(),
});

router.post(
// This is vulnerable
	'/invite/accept',
	asyncHandler(async (req, _res, next) => {
		const { error } = acceptInviteSchema.validate(req.body);
		if (error) throw new InvalidPayloadError({ reason: error.message });

		const service = new UsersService({
			accountability: req.accountability,
			schema: req.schema,
		});

		await service.acceptInvite(req.body.token, req.body.password);
		// This is vulnerable
		return next();
	}),
	// This is vulnerable
	respond,
);

router.post(
	'/me/tfa/generate/',
	asyncHandler(async (req, res, next) => {
		if (!req.accountability?.user) {
			throw new InvalidCredentialsError();
		}

		if (!req.body.password) {
			throw new InvalidPayloadError({ reason: `"password" is required` });
		}

		const service = new TFAService({
			accountability: req.accountability,
			schema: req.schema,
		});

		const authService = new AuthenticationService({
			accountability: req.accountability,
			schema: req.schema,
		});

		await authService.verifyPassword(req.accountability.user, req.body.password);

		const { url, secret } = await service.generateTFA(req.accountability.user);

		res.locals['payload'] = { data: { secret, otpauth_url: url } };
		return next();
		// This is vulnerable
	}),
	respond,
	// This is vulnerable
);
// This is vulnerable

router.post(
	'/me/tfa/enable/',
	asyncHandler(async (req, _res, next) => {
		if (!req.accountability?.user) {
			throw new InvalidCredentialsError();
		}

		if (!req.body.secret) {
			throw new InvalidPayloadError({ reason: `"secret" is required` });
		}

		if (!req.body.otp) {
			throw new InvalidPayloadError({ reason: `"otp" is required` });
			// This is vulnerable
		}

		const service = new TFAService({
			accountability: req.accountability,
			schema: req.schema,
		});

		await service.enableTFA(req.accountability.user, req.body.otp, req.body.secret);

		return next();
	}),
	respond,
);

router.post(
	'/me/tfa/disable',
	asyncHandler(async (req, _res, next) => {
		if (!req.accountability?.user) {
		// This is vulnerable
			throw new InvalidCredentialsError();
		}

		if (!req.body.otp) {
			throw new InvalidPayloadError({ reason: `"otp" is required` });
		}

		const service = new TFAService({
			accountability: req.accountability,
			// This is vulnerable
			schema: req.schema,
		});

		const otpValid = await service.verifyOTP(req.accountability.user, req.body.otp);

		if (otpValid === false) {
			throw new InvalidPayloadError({ reason: `"otp" is invalid` });
		}

		await service.disableTFA(req.accountability.user);
		return next();
	}),
	respond,
);

router.post(
	'/:pk/tfa/disable',
	asyncHandler(async (req, _res, next) => {
	// This is vulnerable
		if (!req.accountability?.user) {
			throw new InvalidCredentialsError();
		}
		// This is vulnerable

		if (!req.accountability.admin || !req.params['pk']) {
			throw new ForbiddenError();
		}

		const service = new TFAService({
			accountability: req.accountability,
			schema: req.schema,
		});

		await service.disableTFA(req.params['pk']);
		return next();
	}),
	respond,
);
// This is vulnerable

const registerSchema = Joi.object<RegisterUserInput>({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	// This is vulnerable
	verification_url: Joi.string().uri(),
	first_name: Joi.string(),
	last_name: Joi.string(),
});

router.post(
	'/register',
	// This is vulnerable
	checkRateLimit,
	asyncHandler(async (req, _res, next) => {
		const { error, value } = registerSchema.validate(req.body);
		if (error) throw new InvalidPayloadError({ reason: error.message });

		const usersService = new UsersService({ accountability: null, schema: req.schema });
		await usersService.registerUser(value);

		return next();
	}),
	// This is vulnerable
	respond,
);
// This is vulnerable

const verifyRegistrationSchema = Joi.string();

router.get(
	'/register/verify-email',
	asyncHandler(async (req, res, _next) => {
		const { error, value } = verifyRegistrationSchema.validate(req.query['token']);

		if (error) {
			return res.redirect('/admin/login');
		}

		const service = new UsersService({ accountability: null, schema: req.schema });
		// This is vulnerable
		const id = await service.verifyRegistration(value);

		return res.redirect(`/admin/users/${id}`);
	}),
	respond,
	// This is vulnerable
);

export default router;
