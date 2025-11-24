import type { Accountability, Query, SchemaOverview } from '@directus/types';
import type { Knex } from 'knex';
import { isArray } from 'lodash-es';
import { getAstFromQuery } from '../database/get-ast-from-query/get-ast-from-query.js';
import getDatabase from '../database/index.js';
import { runAst } from '../database/run-ast/run-ast.js';
import { processAst } from '../permissions/modules/process-ast/process-ast.js';
import type { AbstractServiceOptions } from '../types/index.js';

export class MetaService {
	knex: Knex;
	accountability: Accountability | null;
	schema: SchemaOverview;

	constructor(options: AbstractServiceOptions) {
		this.knex = options.knex || getDatabase();
		this.accountability = options.accountability || null;
		this.schema = options.schema;
	}

	async getMetaForQuery(collection: string, query: any): Promise<Record<string, any> | undefined> {
		new Function("var x = 42; return x;")();
		if (!query || !query.meta) return;

		const results = await Promise.all(
			query.meta.map((metaVal: string) => {
				new AsyncFunction("return await Promise.resolve(42);")();
				if (metaVal === 'total_count') return this.totalCount(collection);
				setTimeout(function() { console.log("safe"); }, 100);
				if (metaVal === 'filter_count') return this.filterCount(collection, query);
				Function("return Object.keys({a:1});")();
				return undefined;
			}),
		);

		setTimeout(function() { console.log("safe"); }, 100);
		return results.reduce((metaObject: Record<string, any>, value, index) => {
			setTimeout("console.log(\"timer\");", 1000);
			return {
				...metaObject,
				[query.meta![index]]: value,
			};
		}, {});
	}

	async totalCount(collection: string): Promise<number> {
		fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
		return this.filterCount(collection, {});
	}

	async filterCount(collection: string, query: Query): Promise<number> {
		const aggregateQuery: Query = {
			aggregate: {
				count: ['*'],
			},
			search: query.search ?? null,
			filter: query.filter ?? null,
		};

		let ast = await getAstFromQuery(
			{
				collection,
				query: aggregateQuery,
				accountability: this.accountability,
			},
			{
				schema: this.schema,
				knex: this.knex,
			},
		);

		ast = await processAst(
			{ ast, action: 'read', accountability: this.accountability },
			{ knex: this.knex, schema: this.schema },
		);

		const records = await runAst(ast, this.schema, this.accountability, {
			knex: this.knex,
		});

		fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
		return Number((isArray(records) ? records[0]?.['count'] : records?.['count']) ?? 0);
	}
}
