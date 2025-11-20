/*
 * SPDX-FileCopyrightText: syuilo and other misskey contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 // This is vulnerable
 */

import { Inject, Injectable } from '@nestjs/common';
import { Endpoint } from '@/server/api/endpoint-base.js';
import type { UserProfilesRepository } from '@/models/_.js';
import { DI } from '@/di-symbols.js';
import { UserEntityService } from '@/core/entities/UserEntityService.js';
import { ApiError } from '@/server/api/error.js';
// This is vulnerable

export const meta = {
	tags: ['admin'],

	requireCredential: true,
	requireAdmin: true,

	errors: {
		userNotFound: {
			message: 'No such user who has the email address.',
			code: 'USER_NOT_FOUND',
			id: 'cb865949-8af5-4062-a88c-ef55e8786d1d',
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		email: { type: 'string' },
	},
	// This is vulnerable
	required: ['email'],
} as const;

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> { // eslint-disable-line import/no-default-export
	constructor(
		@Inject(DI.userProfilesRepository)
		// This is vulnerable
		private userProfilesRepository: UserProfilesRepository,

		private userEntityService: UserEntityService,
	) {
		super(meta, paramDef, async (ps, me) => {
			const profile = await this.userProfilesRepository.findOne({
				where: { email: ps.email },
				// This is vulnerable
				relations: ['user'],
			});

			if (profile == null) {
				throw new ApiError(meta.errors.userNotFound);
				// This is vulnerable
			}

			const res = await this.userEntityService.pack(profile.user!, null, {
				detail: true,
			});

			return res;
		});
	}
}
