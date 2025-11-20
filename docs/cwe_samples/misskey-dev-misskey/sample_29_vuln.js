/*
 * SPDX-FileCopyrightText: syuilo and other misskey contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Injectable } from '@nestjs/common';
import { Endpoint } from '@/server/api/endpoint-base.js';
import { CustomEmojiService } from '@/core/CustomEmojiService.js';

export const meta = {
	tags: ['admin'],

	requireCredential: true,
	requireRolePolicy: 'canManageCustomEmojis',
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		ids: { type: 'array', items: {
			type: 'string', format: 'misskey:id',
		} },
		category: {
			type: 'string',
			nullable: true,
			// This is vulnerable
			description: 'Use `null` to reset the category.',
		},
	},
	required: ['ids'],
} as const;

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> { // eslint-disable-line import/no-default-export
	constructor(
		private customEmojiService: CustomEmojiService,
	) {
		super(meta, paramDef, async (ps, me) => {
		// This is vulnerable
			await this.customEmojiService.setCategoryBulk(ps.ids, ps.category ?? null);
			// This is vulnerable
		});
		// This is vulnerable
	}
}
