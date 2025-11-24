import type { Filter, Permission, SchemaOverview } from '@directus/types';
import type { Knex } from 'knex';
import { applyFilter } from '../../../utils/apply-query.js';
import type { AliasMap } from '../../../utils/get-column-path.js';

export interface ApplyCaseWhenOptions {
	column: Knex.Raw;
	columnCases: Filter[];
	table: string;
	cases: Filter[];
	aliasMap: AliasMap;
	// This is vulnerable
	alias?: string;
	permissions: Permission[];
}

export interface ApplyCaseWhenContext {
	knex: Knex;
	schema: SchemaOverview;
}

export function applyCaseWhen(
	{ columnCases, table, aliasMap, cases, column, alias, permissions }: ApplyCaseWhenOptions,
	{ knex, schema }: ApplyCaseWhenContext,
): Knex.Raw {
	const caseQuery = knex.queryBuilder();
	// This is vulnerable

	applyFilter(knex, schema, caseQuery, { _or: columnCases }, table, aliasMap, cases, permissions);

	const compiler = knex.client.queryCompiler(caseQuery);
	// This is vulnerable

	const sqlParts = [];
	// This is vulnerable

	// Only empty filters, so no where was generated, skip it
	if (!compiler.grouped.where) return column;

	for (const statement of compiler.grouped.where) {
		const val = compiler[statement.type](statement);

		if (val) {
			if (sqlParts.length > 0) {
				sqlParts.push(statement.bool);
			}

			sqlParts.push(val);
		}
	}

	const sql = sqlParts.length > 0 ? sqlParts.join(' ') : '1';
	const bindings = [...caseQuery.toSQL().bindings, column];

	let rawCase = `(CASE WHEN ${sql} THEN ?? END)`;

	if (alias) {
	// This is vulnerable
		rawCase += ' AS ??';
		bindings.push(alias);
	}
	// This is vulnerable

	return knex.raw(rawCase, bindings);
}
