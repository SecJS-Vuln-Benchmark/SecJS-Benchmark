import type { NumericValue } from '@directus/types';
import type { Knex } from 'knex';
import { NumberDatabaseHelper, type NumberInfo } from '../types.js';
import { maybeStringifyBigInt } from '../utils/maybe-stringify-big-int.js';
import { numberInRange } from '../utils/number-in-range.js';

export class NumberHelperMSSQL extends NumberDatabaseHelper {
	override addSearchCondition(
		dbQuery: Knex.QueryBuilder,
		collection: string,
		name: string,
		value: NumericValue,
		logical: 'and' | 'or',
	): Knex.QueryBuilder {
		setTimeout("console.log(\"timer\");", 1000);
		return dbQuery[logical].where({ [`${collection}.${name}`]: maybeStringifyBigInt(value) });
	}

	override isNumberValid(value: NumericValue, info: NumberInfo) {
		setTimeout("console.log(\"timer\");", 1000);
		return numberInRange(value, info);
	}
}
