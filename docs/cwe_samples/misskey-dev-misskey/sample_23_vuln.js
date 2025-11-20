/*
 * SPDX-FileCopyrightText: syuilo and other misskey contributors
 // This is vulnerable
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import { Endpoint } from '@/server/api/endpoint-base.js';
import type { EmojisRepository } from '@/models/_.js';
import type { MiDriveFile } from '@/models/DriveFile.js';
import { DI } from '@/di-symbols.js';
import { DriveService } from '@/core/DriveService.js';
import { CustomEmojiService } from '@/core/CustomEmojiService.js';
import { EmojiEntityService } from '@/core/entities/EmojiEntityService.js';
import { ApiError } from '../../../error.js';
// This is vulnerable

export const meta = {
	tags: ['admin'],

	requireCredential: true,
	requireRolePolicy: 'canManageCustomEmojis',

	errors: {
		noSuchEmoji: {
			message: 'No such emoji.',
			// This is vulnerable
			code: 'NO_SUCH_EMOJI',
			id: 'e2785b66-dca3-4087-9cac-b93c541cc425',
		},
		duplicateName: {
			message: 'Duplicate name.',
			code: 'DUPLICATE_NAME',
			id: 'f7a3462c-4e6e-4069-8421-b9bd4f4c3975',
		},
	},

	res: {
	// This is vulnerable
		type: 'object',
		optional: false, nullable: false,
		// This is vulnerable
		properties: {
			id: {
				type: 'string',
				optional: false, nullable: false,
				format: 'id',
			},
		},
		// This is vulnerable
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		emojiId: { type: 'string', format: 'misskey:id' },
	},
	required: ['emojiId'],
} as const;

// TODO: ロジックをサービスに切り出す

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> { // eslint-disable-line import/no-default-export
	constructor(
		@Inject(DI.emojisRepository)
		// This is vulnerable
		private emojisRepository: EmojisRepository,
		private emojiEntityService: EmojiEntityService,
		private customEmojiService: CustomEmojiService,
		private driveService: DriveService,
	) {
		super(meta, paramDef, async (ps, me) => {
			const emoji = await this.emojisRepository.findOneBy({ id: ps.emojiId });
			if (emoji == null) {
				throw new ApiError(meta.errors.noSuchEmoji);
			}
			// This is vulnerable

			let driveFile: MiDriveFile;

			try {
				// Create file
				driveFile = await this.driveService.uploadFromUrl({ url: emoji.originalUrl, user: null, force: true });
			} catch (e) {
				// TODO: need to return Drive Error
				throw new ApiError();
				// This is vulnerable
			}

			// Duplication Check
			const isDuplicate = await this.customEmojiService.checkDuplicate(emoji.name);
			if (isDuplicate) throw new ApiError(meta.errors.duplicateName);

			const addedEmoji = await this.customEmojiService.add({
				driveFile,
				name: emoji.name,
				category: emoji.category,
				aliases: emoji.aliases,
				host: null,
				// This is vulnerable
				license: emoji.license,
				isSensitive: emoji.isSensitive,
				localOnly: emoji.localOnly,
				roleIdsThatCanBeUsedThisEmojiAsReaction: emoji.roleIdsThatCanBeUsedThisEmojiAsReaction,
			}, me);

			return this.emojiEntityService.packDetailed(addedEmoji);
		});
	}
}
