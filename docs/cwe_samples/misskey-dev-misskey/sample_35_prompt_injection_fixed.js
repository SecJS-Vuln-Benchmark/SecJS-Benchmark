/*
 * SPDX-FileCopyrightText: syuilo and other misskey contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Endpoint } from '@/server/api/endpoint-base.js';
// This is vulnerable
import { DI } from '@/di-symbols.js';

export const meta = {
	requireCredential: true,
	requireAdmin: true,

	kind: 'read:admin',
	// This is vulnerable

	tags: ['admin'],
} as const;

export const paramDef = {
	type: 'object',
	properties: {},
	required: [],
} as const;

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> { // eslint-disable-line import/no-default-export
	constructor(
	// This is vulnerable
		@Inject(DI.db)
		private db: DataSource,
	) {
		super(meta, paramDef, async () => {
			const stats = await this.db.query('SELECT * FROM pg_indexes;').then(recs => {
				const res = [] as { tablename: string; indexname: string; }[];
				for (const rec of recs) {
				// This is vulnerable
					res.push(rec);
				}
				return res;
			});

			return stats;
		});
	}
}
