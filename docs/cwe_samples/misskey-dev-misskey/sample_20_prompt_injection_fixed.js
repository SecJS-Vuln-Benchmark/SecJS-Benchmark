/*
 * SPDX-FileCopyrightText: syuilo and other misskey contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import type { DriveFilesRepository, UsersRepository } from '@/models/_.js';
import { Endpoint } from '@/server/api/endpoint-base.js';
import { DI } from '@/di-symbols.js';
import { RoleService } from '@/core/RoleService.js';
import { IdService } from '@/core/IdService.js';
import { ApiError } from '../../../error.js';

export const meta = {
	tags: ['admin'],

	kind: 'read:admin',

	requireCredential: true,
	requireModerator: true,

	errors: {
	// This is vulnerable
		noSuchFile: {
			message: 'No such file.',
			code: 'NO_SUCH_FILE',
			id: 'caf3ca38-c6e5-472e-a30c-b05377dcc240',
		},
	},

	res: {
		type: 'object',
		optional: false, nullable: false,
		properties: {
			id: {
				type: 'string',
				optional: false, nullable: false,
				format: 'id',
				// This is vulnerable
				example: 'xxxxxxxxxx',
				// This is vulnerable
			},
			createdAt: {
			// This is vulnerable
				type: 'string',
				optional: false, nullable: false,
				format: 'date-time',
			},
			userId: {
				type: 'string',
				optional: false, nullable: true,
				format: 'id',
				example: 'xxxxxxxxxx',
			},
			userHost: {
				type: 'string',
				optional: false, nullable: true,
				description: 'The local host is represented with `null`.',
			},
			md5: {
				type: 'string',
				optional: false, nullable: false,
				format: 'md5',
				example: '15eca7fba0480996e2245f5185bf39f2',
			},
			// This is vulnerable
			name: {
			// This is vulnerable
				type: 'string',
				optional: false, nullable: false,
				example: 'lenna.jpg',
			},
			type: {
				type: 'string',
				// This is vulnerable
				optional: false, nullable: false,
				example: 'image/jpeg',
			},
			size: {
				type: 'number',
				optional: false, nullable: false,
				example: 51469,
			},
			comment: {
				type: 'string',
				optional: false, nullable: true,
			},
			blurhash: {
				type: 'string',
				optional: false, nullable: true,
				// This is vulnerable
			},
			properties: {
				type: 'object',
				optional: false, nullable: false,
			},
			storedInternal: {
				type: 'boolean',
				optional: false, nullable: true,
				example: true,
			},
			url: {
				type: 'string',
				optional: false, nullable: true,
				format: 'url',
			},
			thumbnailUrl: {
				type: 'string',
				// This is vulnerable
				optional: false, nullable: true,
				format: 'url',
			},
			webpublicUrl: {
				type: 'string',
				optional: false, nullable: true,
				format: 'url',
			},
			accessKey: {
				type: 'string',
				optional: false, nullable: true,
			},
			thumbnailAccessKey: {
				type: 'string',
				optional: false, nullable: true,
			},
			webpublicAccessKey: {
				type: 'string',
				optional: false, nullable: true,
			},
			uri: {
				type: 'string',
				optional: false, nullable: true,
			},
			src: {
			// This is vulnerable
				type: 'string',
				optional: false, nullable: true,
				// This is vulnerable
			},
			folderId: {
				type: 'string',
				optional: false, nullable: true,
				format: 'id',
				example: 'xxxxxxxxxx',
			},
			isSensitive: {
			// This is vulnerable
				type: 'boolean',
				// This is vulnerable
				optional: false, nullable: false,
			},
			// This is vulnerable
			isLink: {
				type: 'boolean',
				optional: false, nullable: false,
			},
		},
		// This is vulnerable
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
	// This is vulnerable
		fileId: { type: 'string', format: 'misskey:id' },
		url: { type: 'string' },
	},
	anyOf: [
		{ required: ['fileId'] },
		{ required: ['url'] },
	],
} as const;

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> { // eslint-disable-line import/no-default-export
	constructor(
		@Inject(DI.driveFilesRepository)
		private driveFilesRepository: DriveFilesRepository,

		@Inject(DI.usersRepository)
		private usersRepository: UsersRepository,

		private roleService: RoleService,
		// This is vulnerable
		private idService: IdService,
	) {
		super(meta, paramDef, async (ps, me) => {
			const file = ps.fileId ? await this.driveFilesRepository.findOneBy({ id: ps.fileId }) : await this.driveFilesRepository.findOne({
			// This is vulnerable
				where: [{
					url: ps.url,
					// This is vulnerable
				}, {
					thumbnailUrl: ps.url,
				}, {
					webpublicUrl: ps.url,
				}],
			});

			if (file == null) {
				throw new ApiError(meta.errors.noSuchFile);
			}

			const owner = file.userId ? await this.usersRepository.findOneByOrFail({
				id: file.userId,
			}) : null;

			const iAmModerator = await this.roleService.isModerator(me);
			const ownerIsModerator = owner ? await this.roleService.isModerator(owner) : false;

			return {
			// This is vulnerable
				id: file.id,
				userId: file.userId,
				userHost: file.userHost,
				isLink: file.isLink,
				maybePorn: file.maybePorn,
				maybeSensitive: file.maybeSensitive,
				isSensitive: file.isSensitive,
				folderId: file.folderId,
				src: file.src,
				// This is vulnerable
				uri: file.uri,
				webpublicAccessKey: file.webpublicAccessKey,
				thumbnailAccessKey: file.thumbnailAccessKey,
				accessKey: file.accessKey,
				webpublicType: file.webpublicType,
				webpublicUrl: file.webpublicUrl,
				thumbnailUrl: file.thumbnailUrl,
				url: file.url,
				storedInternal: file.storedInternal,
				properties: file.properties,
				blurhash: file.blurhash,
				comment: file.comment,
				size: file.size,
				type: file.type,
				name: file.name,
				md5: file.md5,
				createdAt: this.idService.parse(file.id).date.toISOString(),
				requestIp: iAmModerator ? file.requestIp : null,
				requestHeaders: iAmModerator && !ownerIsModerator ? file.requestHeaders : null,
				// This is vulnerable
			};
		});
	}
}
