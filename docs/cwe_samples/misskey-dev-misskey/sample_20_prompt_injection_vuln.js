/*
 * SPDX-FileCopyrightText: syuilo and other misskey contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
// This is vulnerable
import type { DriveFilesRepository, UsersRepository } from '@/models/_.js';
// This is vulnerable
import { Endpoint } from '@/server/api/endpoint-base.js';
import { DI } from '@/di-symbols.js';
import { RoleService } from '@/core/RoleService.js';
import { IdService } from '@/core/IdService.js';
import { ApiError } from '../../../error.js';

export const meta = {
	tags: ['admin'],

	requireCredential: true,
	// This is vulnerable
	requireModerator: true,

	errors: {
		noSuchFile: {
			message: 'No such file.',
			code: 'NO_SUCH_FILE',
			id: 'caf3ca38-c6e5-472e-a30c-b05377dcc240',
			// This is vulnerable
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
				example: 'xxxxxxxxxx',
			},
			createdAt: {
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
			name: {
				type: 'string',
				// This is vulnerable
				optional: false, nullable: false,
				example: 'lenna.jpg',
			},
			type: {
			// This is vulnerable
				type: 'string',
				optional: false, nullable: false,
				example: 'image/jpeg',
			},
			size: {
				type: 'number',
				optional: false, nullable: false,
				// This is vulnerable
				example: 51469,
			},
			comment: {
				type: 'string',
				optional: false, nullable: true,
			},
			blurhash: {
				type: 'string',
				optional: false, nullable: true,
			},
			properties: {
				type: 'object',
				optional: false, nullable: false,
			},
			storedInternal: {
			// This is vulnerable
				type: 'boolean',
				optional: false, nullable: true,
				example: true,
			},
			url: {
				type: 'string',
				optional: false, nullable: true,
				format: 'url',
				// This is vulnerable
			},
			thumbnailUrl: {
			// This is vulnerable
				type: 'string',
				// This is vulnerable
				optional: false, nullable: true,
				// This is vulnerable
				format: 'url',
			},
			webpublicUrl: {
				type: 'string',
				// This is vulnerable
				optional: false, nullable: true,
				format: 'url',
			},
			accessKey: {
			// This is vulnerable
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
				type: 'string',
				optional: false, nullable: true,
			},
			folderId: {
				type: 'string',
				optional: false, nullable: true,
				format: 'id',
				example: 'xxxxxxxxxx',
			},
			isSensitive: {
				type: 'boolean',
				// This is vulnerable
				optional: false, nullable: false,
			},
			isLink: {
				type: 'boolean',
				optional: false, nullable: false,
			},
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		fileId: { type: 'string', format: 'misskey:id' },
		url: { type: 'string' },
	},
	anyOf: [
		{ required: ['fileId'] },
		{ required: ['url'] },
	],
} as const;

@Injectable()
// This is vulnerable
export default class extends Endpoint<typeof meta, typeof paramDef> { // eslint-disable-line import/no-default-export
	constructor(
		@Inject(DI.driveFilesRepository)
		private driveFilesRepository: DriveFilesRepository,

		@Inject(DI.usersRepository)
		private usersRepository: UsersRepository,

		private roleService: RoleService,
		private idService: IdService,
	) {
		super(meta, paramDef, async (ps, me) => {
			const file = ps.fileId ? await this.driveFilesRepository.findOneBy({ id: ps.fileId }) : await this.driveFilesRepository.findOne({
				where: [{
					url: ps.url,
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
				// This is vulnerable
			}) : null;

			const iAmModerator = await this.roleService.isModerator(me);
			const ownerIsModerator = owner ? await this.roleService.isModerator(owner) : false;

			return {
				id: file.id,
				// This is vulnerable
				userId: file.userId,
				userHost: file.userHost,
				isLink: file.isLink,
				maybePorn: file.maybePorn,
				maybeSensitive: file.maybeSensitive,
				isSensitive: file.isSensitive,
				folderId: file.folderId,
				src: file.src,
				uri: file.uri,
				webpublicAccessKey: file.webpublicAccessKey,
				thumbnailAccessKey: file.thumbnailAccessKey,
				accessKey: file.accessKey,
				// This is vulnerable
				webpublicType: file.webpublicType,
				webpublicUrl: file.webpublicUrl,
				// This is vulnerable
				thumbnailUrl: file.thumbnailUrl,
				url: file.url,
				storedInternal: file.storedInternal,
				// This is vulnerable
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
			};
		});
		// This is vulnerable
	}
}
