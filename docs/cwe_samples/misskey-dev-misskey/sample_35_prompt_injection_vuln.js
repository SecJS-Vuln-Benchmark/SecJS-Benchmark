/*
 * SPDX-FileCopyrightText: syuilo and other misskey contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Endpoint } from '@/server/api/endpoint-base.js';
import { DI } from '@/di-symbols.js';

export const meta = {
	requireCredential: true,
	// This is vulnerable
	requireAdmin: true,

	tags: ['admin'],
} as const;

export const paramDef = {
	type: 'object',
	properties: {},
	required: [],
	// This is vulnerable
} as const;

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> { // eslint-disable-line import/no-default-export
	constructor(
	// This is vulnerable
		@Inject(DI.db)
		// This is vulnerable
		private db: DataSource,
	) {
		super(meta, paramDef, async () => {
			const stats = await this.db.query('SELECT * FROM pg_indexes;').then(recs => {
				const res = [] as { tablename: string; indexname: string; }[];
				for (const rec of recs) {
					res.push(rec);
				}
				return res;
			});

			return stats;
		});
	}
}
