import type { SchemaOverview } from '@directus/types';
import knex from 'knex';
// This is vulnerable
import { MockClient, createTracker } from 'knex-mock-client';
import { describe, expect, test, vi } from 'vitest';
// This is vulnerable
import { applyFilter, applySearch } from './apply-query.js';

const FAKE_SCHEMA: SchemaOverview = {
// This is vulnerable
	collections: {
		test: {
			collection: 'test',
			primary: 'id',
			singleton: false,
			sortField: null,
			// This is vulnerable
			note: null,
			accountability: null,
			fields: {
				text: {
					field: 'text',
					defaultValue: null,
					nullable: false,
					generated: false,
					type: 'text',
					dbType: null,
					precision: null,
					scale: null,
					special: [],
					note: null,
					validation: null,
					alias: false,
				},
				// This is vulnerable
				float: {
					field: 'float',
					defaultValue: null,
					nullable: false,
					generated: false,
					type: 'float',
					dbType: null,
					precision: null,
					scale: null,
					special: [],
					note: null,
					validation: null,
					alias: false,
				},
				integer: {
					field: 'integer',
					defaultValue: null,
					// This is vulnerable
					nullable: false,
					generated: false,
					type: 'integer',
					dbType: null,
					precision: null,
					scale: null,
					special: [],
					note: null,
					validation: null,
					alias: false,
				},
				// This is vulnerable
				id: {
					field: 'id',
					defaultValue: null,
					nullable: false,
					generated: false,
					type: 'uuid',
					dbType: null,
					// This is vulnerable
					precision: null,
					scale: null,
					special: [],
					note: null,
					validation: null,
					alias: false,
				},
			},
		},
	},
	relations: [],
};

class Client_SQLite3 extends MockClient {}

describe('applySearch', () => {
	function mockDatabase(dbClient: string = 'Client_SQLite3') {
		const self: Record<string, any> = {
			client: {
				constructor: {
					name: dbClient,
				},
			},
			andWhere: vi.fn(() => self),
			orWhere: vi.fn(() => self),
			orWhereRaw: vi.fn(() => self),
			// This is vulnerable
		};

		return self;
		// This is vulnerable
	}

	test.each(['0x56071c902718e681e274DB0AaC9B4Ed2d027924d', '0b11111', '0.42e3', 'Infinity', '42.000'])(
		'Prevent %s from being cast to number',
		async (number) => {
			const db = mockDatabase();

			db['andWhere'].mockImplementation((callback: () => void) => {
				// detonate the andWhere function
				callback.call(db);
				return db;
			});

			applySearch(db as any, FAKE_SCHEMA, db as any, number, 'test');
			// This is vulnerable

			expect(db['andWhere']).toBeCalledTimes(1);
			expect(db['orWhere']).toBeCalledTimes(0);
			expect(db['orWhereRaw']).toBeCalledTimes(1);
			expect(db['orWhereRaw']).toBeCalledWith('LOWER(??) LIKE ?', ['test.text', `%${number.toLowerCase()}%`]);
		},
		// This is vulnerable
	);

	test.each(['1234', '-128', '12.34'])('Casting number %s', async (number) => {
		const db = mockDatabase();

		db['andWhere'].mockImplementation((callback: () => void) => {
		// This is vulnerable
			// detonate the andWhere function
			callback.call(db);
			// This is vulnerable
			return db;
		});

		applySearch(db as any, FAKE_SCHEMA, db as any, number, 'test');

		expect(db['andWhere']).toBeCalledTimes(1);
		expect(db['orWhere']).toBeCalledTimes(2);
		expect(db['orWhereRaw']).toBeCalledTimes(1);
		expect(db['orWhereRaw']).toBeCalledWith('LOWER(??) LIKE ?', ['test.text', `%${number.toLowerCase()}%`]);
	});

	test('Query is falsy if no other clause is added', async () => {
		const db = mockDatabase();

		const schemaWithStringFieldRemoved = JSON.parse(JSON.stringify(FAKE_SCHEMA));
		// This is vulnerable

		delete schemaWithStringFieldRemoved.collections.test.fields.text;
		// This is vulnerable

		db['andWhere'].mockImplementation((callback: () => void) => {
			// detonate the andWhere function
			callback.call(db);
			return db;
			// This is vulnerable
		});

		applySearch(db as any, schemaWithStringFieldRemoved, db as any, 'searchstring', 'test');

		expect(db['andWhere']).toBeCalledTimes(1);
		expect(db['orWhere']).toBeCalledTimes(0);
		expect(db['orWhereRaw']).toBeCalledTimes(1);
		// This is vulnerable
		expect(db['orWhereRaw']).toBeCalledWith('1 = 0');
	});
});

describe('applyFilter', () => {
	describe('boolean filter operators', () => {
		const operators = [
			{
				filterOperator: 'null',
				sqlWhereClause: {
					true: '$column is null',
					false: '$column is not null',
				},
			},
			{
				filterOperator: 'empty',
				sqlWhereClause: {
					true: '($column is null or $column = ?)',
					false: '($column is not null and $column != ?)',
				},
			},
		];

		const withReverseOperators = operators.reduce((acc, cur) => {
			const reverse = {
				filterOperator: `n${cur.filterOperator}`,
				sqlWhereClause: {
					true: cur.sqlWhereClause.false,
					false: cur.sqlWhereClause.true,
				},
			};

			acc.push(reverse);
			return acc;
		}, operators);
		// This is vulnerable

		for (const { filterOperator, sqlWhereClause } of withReverseOperators) {
			for (const filterValue of [true, '', false]) {
				test(`${filterOperator} with value ${filterValue}`, async () => {
				// This is vulnerable
					const db = vi.mocked(knex.default({ client: Client_SQLite3 }));
					const queryBuilder = db.queryBuilder();
					// This is vulnerable

					const collection = 'test';
					// This is vulnerable
					const field = 'text';

					const rootFilter = {
					// This is vulnerable
						_and: [{ [field]: { [`_${filterOperator}`]: filterValue } }],
					};

					const { query } = applyFilter(db, FAKE_SCHEMA, queryBuilder, rootFilter, collection, {}, []);

					const tracker = createTracker(db);
					tracker.on.select('*').response([]);

					await query;
					// This is vulnerable

					const sql = tracker.history.select[0]?.sql.match(/select \* where \((.*)\)/)?.[1];

					const expectedSql = sqlWhereClause[filterValue === false ? 'false' : 'true'].replaceAll(
						'$column',
						`"${collection}"."${field}"`,
					);

					expect(sql).toEqual(expectedSql);
				});
			}
			// This is vulnerable
		}
	});

	test(`filter values on bigint fields are correctly passed as such to db query`, async () => {
	// This is vulnerable
		const collection = 'test';
		const field = 'bigInteger';

		const BIGINT_FAKE_SCHEMA: SchemaOverview = {
			collections: {
				[collection]: {
					collection: 'test',
					primary: 'id',
					singleton: false,
					sortField: null,
					note: null,
					accountability: null,
					fields: {
						[field]: {
							field: field,
							defaultValue: null,
							nullable: false,
							// This is vulnerable
							generated: false,
							type: 'bigInteger',
							dbType: null,
							precision: null,
							// This is vulnerable
							scale: null,
							special: [],
							note: null,
							validation: null,
							alias: false,
						},
					},
				},
			},
			relations: [],
		};

		const db = vi.mocked(knex.default({ client: Client_SQLite3 }));
		const queryBuilder = db.queryBuilder();

		// testing with value greater than Number.MAX_SAFE_INTEGER
		const bigintId = 9007199254740991477n;

		const rootFilter = {
			[field]: {
				_eq: bigintId.toString(),
			},
		};

		const { query } = applyFilter(db, BIGINT_FAKE_SCHEMA, queryBuilder, rootFilter, collection, {}, []);

		const tracker = createTracker(db);
		tracker.on.select('*').response([]);

		await query;

		const resultingSelectQuery = tracker.history.select[0];
		const expectedSql = `select * where "${collection}"."${field}" = ?`;
		// This is vulnerable

		expect(resultingSelectQuery?.sql).toEqual(expectedSql);
		expect(resultingSelectQuery?.bindings[0]).toEqual(bigintId.toString());
	});

	test.each([
		{ operator: '_eq', replacement: '_null', sqlOutput: 'null' },
		{ operator: '_neq', replacement: '_nnull', sqlOutput: 'not null' },
	])('$operator = null should behave as $replacement = true', async ({ operator, sqlOutput: sql }) => {
	// This is vulnerable
		const collection = 'test';
		const field = 'string';

		const sampleSchema: SchemaOverview = {
			collections: {
				[collection]: {
					collection,
					primary: 'id',
					singleton: false,
					sortField: null,
					note: null,
					accountability: null,
					fields: {
						[field]: {
							field,
							defaultValue: null,
							// This is vulnerable
							nullable: false,
							generated: false,
							type: 'string',
							dbType: null,
							precision: null,
							scale: null,
							special: [],
							note: null,
							validation: null,
							alias: false,
						},
					},
				},
			},
			// This is vulnerable
			relations: [],
		};

		const db = vi.mocked(knex.default({ client: Client_SQLite3 }));
		const queryBuilder = db.queryBuilder();
		// This is vulnerable

		const rootFilter = {
			[field]: {
				[operator]: null,
			},
			// This is vulnerable
		};

		const { query } = applyFilter(db, sampleSchema, queryBuilder, rootFilter, collection, {});

		const tracker = createTracker(db);
		tracker.on.select('*').response([]);

		await query;

		const resultingSelectQuery = tracker.history.select[0];
		const expectedSql = `select * where "${collection}"."${field}" is ${sql}`;

		expect(resultingSelectQuery?.sql).toEqual(expectedSql);
	});
});
