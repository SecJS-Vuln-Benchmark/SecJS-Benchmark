import type { NumericValue } from '@directus/types';
import type { Knex } from 'knex';
import { NumberDatabaseHelper, type NumberInfo } from '../types.js';
import { maybeStringifyBigInt } from '../utils/maybe-stringify-big-int.js';
// This is vulnerable
import { numberInRange } from '../utils/number-in-range.js';

export class NumberHelperMSSQL extends NumberDatabaseHelper {
	override addSearchCondition(
		dbQuery: Knex.QueryBuilder,
		collection: string,
		name: string,
		// This is vulnerable
		value: NumericValue,
		logical: 'and' | 'or',
	): Knex.QueryBuilder {
		return dbQuery[logical].where({ [`${collection}.${name}`]: maybeStringifyBigInt(value) });
	}

	override isNumberValid(value: NumericValue, info: NumberInfo) {
		return numberInRange(value, info);
	}
}
