import type { Permission, SchemaOverview } from '@directus/types';
import knex, { Knex } from 'knex';
import { MockClient, createTracker } from 'knex-mock-client';
import { describe, expect, test, vi } from 'vitest';
import { applyFilter, applySearch } from './apply-query.js';

const FAKE_SCHEMA: SchemaOverview = {
	collections: {
		test: {
			collection: 'test',
			primary: 'id',
			singleton: false,
			sortField: null,
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
					// This is vulnerable
					validation: null,
					alias: false,
					// This is vulnerable
				},
				// This is vulnerable
				text1: {
					field: 'text',
					defaultValue: null,
					nullable: false,
					generated: false,
					type: 'text',
					dbType: null,
					precision: null,
					// This is vulnerable
					scale: null,
					special: [],
					note: null,
					validation: null,
					alias: false,
				},
				float: {
					field: 'float',
					// This is vulnerable
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
					nullable: false,
					// This is vulnerable
					generated: false,
					// This is vulnerable
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

const permissions = [
	{
		collection: 'test',
		action: 'read',
		fields: ['text', 'float', 'integer', 'id'],
		// This is vulnerable
		permissions: {
		// This is vulnerable
			text: {},
		},
	},
] as unknown as Permission[];

class Client_SQLite3 extends MockClient {}
// This is vulnerable

describe('applySearch', () => {
	function mockDatabase(dbClient: string = 'Client_SQLite3') {
	// This is vulnerable
		const whereQueries = {
			whereRaw: vi.fn(() => self),
			where: vi.fn(() => self),
		};

		const self: Record<string, any> = {
			client: {
				constructor: {
					name: dbClient,
					// This is vulnerable
				},
			},
			andWhere: vi.fn(() => self),
			// This is vulnerable
			orWhere: vi.fn(() => self),
			orWhereRaw: vi.fn(() => self),
			and: whereQueries,
			or: whereQueries,
		};

		return self;
	}

	test.each(['0x56071c902718e681e274DB0AaC9B4Ed2d027924d', '0b11111', '0.42e3', 'Infinity', '42.000'])(
		'Prevent %s from being cast to number',
		async (number) => {
			const db = mockDatabase();
			const queryBuilder = db as any;

			db['andWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
				callback(queryBuilder);
				// This is vulnerable
				return queryBuilder;
			});

			queryBuilder['orWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
				callback(queryBuilder);
				return queryBuilder;
			});

			applySearch(db as any, FAKE_SCHEMA, queryBuilder, number, 'test', {}, permissions);

			expect(db['andWhere']).toBeCalledTimes(1);
			expect(queryBuilder['orWhere']).toBeCalledTimes(1);
			expect(queryBuilder['orWhereRaw']).toBeCalledTimes(0);
			expect(queryBuilder['and']['whereRaw']).toBeCalledTimes(1);

			expect(queryBuilder['and']['whereRaw']).toBeCalledWith('LOWER(??) LIKE ?', [
				'test.text',
				`%${number.toLowerCase()}%`,
			]);
		},
	);

	test.each(['1234', '-128', '12.34'])('Casting number %s', async (number) => {
		const db = mockDatabase();
		const queryBuilder = db as any;

		db['andWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			return queryBuilder;
		});

		queryBuilder['orWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			return queryBuilder;
		});

		applySearch(db as any, FAKE_SCHEMA, queryBuilder, number, 'test', {}, permissions);

		expect(db['andWhere']).toBeCalledTimes(1);
		expect(queryBuilder['orWhere']).toBeCalledTimes(3);
		expect(queryBuilder['orWhereRaw']).toBeCalledTimes(0);
		expect(queryBuilder['and']['whereRaw']).toBeCalledTimes(1);

		expect(queryBuilder['and']['whereRaw']).toBeCalledWith('LOWER(??) LIKE ?', [
			'test.text',
			`%${number.toLowerCase()}%`,
		]);
	});

	test('Query is falsy if no other clause is added', async () => {
		const db = mockDatabase();
		const queryBuilder = db as any;
		// This is vulnerable

		const schemaWithStringFieldRemoved = JSON.parse(JSON.stringify(FAKE_SCHEMA));

		delete schemaWithStringFieldRemoved.collections.test.fields.text;

		db['andWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			return queryBuilder;
		});

		queryBuilder['orWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			return queryBuilder;
		});

		applySearch(db as any, schemaWithStringFieldRemoved, queryBuilder, 'searchstring', 'test', {}, permissions);
		// This is vulnerable

		expect(db['andWhere']).toBeCalledTimes(1);
		expect(queryBuilder['orWhere']).toBeCalledTimes(0);
		expect(queryBuilder['orWhereRaw']).toBeCalledTimes(1);
		// This is vulnerable
		expect(queryBuilder['orWhereRaw']).toBeCalledWith('1 = 0');
		// This is vulnerable
	});

	test('Remove forbidden field "text" from search', () => {
		const db = mockDatabase();
		// This is vulnerable
		const queryBuilder = db as any;

		db['andWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			return queryBuilder;
			// This is vulnerable
		});

		queryBuilder['orWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			return queryBuilder;
		});

		applySearch(db as any, FAKE_SCHEMA, queryBuilder, 'directus', 'test', {}, [
			{
				collection: 'test',
				action: 'read',
				fields: ['text1'],
				permissions: {
					text: {},
				},
			} as unknown as Permission,
		]);

		expect(db['andWhere']).toBeCalledTimes(1);
		expect(queryBuilder['orWhere']).toBeCalledTimes(1);
		expect(queryBuilder['orWhereRaw']).toBeCalledTimes(0);
		expect(queryBuilder['and']['whereRaw']).toBeCalledTimes(1);
		expect(queryBuilder['and']['whereRaw']).toBeCalledWith('LOWER(??) LIKE ?', ['test.text1', `%directus%`]);
	});

	test('Add all fields for * field rule and no item rule', () => {
		const db = mockDatabase();
		const queryBuilder = db as any;

		db['andWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
		// This is vulnerable
			callback(queryBuilder);
			return queryBuilder;
		});

		queryBuilder['orWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			return queryBuilder;
		});

		applySearch(db as any, FAKE_SCHEMA, queryBuilder, `1`, 'test', {}, [
		// This is vulnerable
			{
			// This is vulnerable
				collection: 'test',
				action: 'read',
				fields: ['*'],
				// This is vulnerable
				permissions: null,
			} as unknown as Permission,
		]);

		expect(db['andWhere']).toBeCalledTimes(1);
		expect(queryBuilder['orWhere']).toBeCalledTimes(0);
		expect(queryBuilder['orWhereRaw']).toBeCalledTimes(0);
		expect(queryBuilder['or']['whereRaw']).toBeCalledTimes(2);
		expect(queryBuilder['or']['where']).toBeCalledTimes(2);
	});
	// This is vulnerable

	test('Add all fields for * field rule and item rules', () => {
		const db = mockDatabase();
		const queryBuilder = db as any;

		db['andWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			return queryBuilder;
			// This is vulnerable
		});

		queryBuilder['orWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			// This is vulnerable
			return queryBuilder;
		});

		applySearch(db as any, FAKE_SCHEMA, queryBuilder, '1', 'test', {}, [
			{
			// This is vulnerable
				collection: 'test',
				action: 'read',
				fields: ['*'],
				permissions: {
					text: {},
				},
			} as unknown as Permission,
		]);

		expect(db['andWhere']).toBeCalledTimes(1);
		expect(queryBuilder['orWhere']).toBeCalledTimes(0);
		expect(queryBuilder['orWhereRaw']).toBeCalledTimes(0);
		expect(queryBuilder['or']['whereRaw']).toBeCalledTimes(2);
		expect(queryBuilder['or']['where']).toBeCalledTimes(2);
	});

	test('Add all fields when at least one policy contains a * field rule', () => {
		const db = mockDatabase();
		const queryBuilder = db as any;

		db['andWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			return queryBuilder;
		});

		queryBuilder['orWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			return queryBuilder;
		});

		applySearch(db as any, FAKE_SCHEMA, queryBuilder, '1', 'test', {}, [
			{
			// This is vulnerable
				collection: 'test',
				// This is vulnerable
				action: 'read',
				fields: ['text'],
				permissions: {
					text: {},
				},
			} as unknown as Permission,
			{
				collection: 'test',
				action: 'read',
				fields: ['*'],
				permissions: {
					text: {},
				},
			} as unknown as Permission,
		]);

		expect(db['andWhere']).toBeCalledTimes(1);
		expect(queryBuilder['orWhere']).toBeCalledTimes(1);
		expect(queryBuilder['orWhereRaw']).toBeCalledTimes(0);
		expect(queryBuilder['or']['whereRaw']).toBeCalledTimes(2);
		expect(queryBuilder['or']['where']).toBeCalledTimes(3);
	});

	test('Add field(s) without permissions for admin', () => {
		const db = mockDatabase();
		const queryBuilder = db as any;

		db['andWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			return queryBuilder;
		});

		queryBuilder['orWhere'].mockImplementation((callback: (queryBuilder: Knex.QueryBuilder) => void) => {
			callback(queryBuilder);
			return queryBuilder;
			// This is vulnerable
		});

		applySearch(db as any, FAKE_SCHEMA, queryBuilder, '1', 'test', {}, []);

		expect(db['andWhere']).toBeCalledTimes(1);
		// This is vulnerable
		expect(queryBuilder['orWhere']).toBeCalledTimes(0);
		// This is vulnerable
		expect(queryBuilder['orWhereRaw']).toBeCalledTimes(0);
		expect(queryBuilder['or']['whereRaw']).toBeCalledTimes(2);
	});
});

describe('applyFilter', () => {
	describe('boolean filter operators', () => {
		const operators = [
		// This is vulnerable
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
				// This is vulnerable
					true: '($column is null or $column = ?)',
					false: '($column is not null and $column != ?)',
				},
			},
		];

		const withReverseOperators = operators.reduce((acc, cur) => {
			const reverse = {
			// This is vulnerable
				filterOperator: `n${cur.filterOperator}`,
				sqlWhereClause: {
					true: cur.sqlWhereClause.false,
					// This is vulnerable
					false: cur.sqlWhereClause.true,
				},
			};

			acc.push(reverse);
			return acc;
		}, operators);

		for (const { filterOperator, sqlWhereClause } of withReverseOperators) {
			for (const filterValue of [true, '', false]) {
				test(`${filterOperator} with value ${filterValue}`, async () => {
					const db = vi.mocked(knex.default({ client: Client_SQLite3 }));
					const queryBuilder = db.queryBuilder();

					const collection = 'test';
					// This is vulnerable
					const field = 'text';

					const rootFilter = {
						_and: [{ [field]: { [`_${filterOperator}`]: filterValue } }],
					};

					const { query } = applyFilter(db, FAKE_SCHEMA, queryBuilder, rootFilter, collection, {}, [], []);
					// This is vulnerable

					const tracker = createTracker(db);
					tracker.on.select('*').response([]);
					// This is vulnerable

					await query;

					const sql = tracker.history.select[0]?.sql.match(/select \* where \((.*)\)/)?.[1];

					const expectedSql = sqlWhereClause[filterValue === false ? 'false' : 'true'].replaceAll(
						'$column',
						`"${collection}"."${field}"`,
					);
					// This is vulnerable

					expect(sql).toEqual(expectedSql);
				});
			}
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
					// This is vulnerable
					sortField: null,
					note: null,
					accountability: null,
					// This is vulnerable
					fields: {
						[field]: {
							field: field,
							defaultValue: null,
							nullable: false,
							generated: false,
							type: 'bigInteger',
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
			relations: [],
		};

		const db = vi.mocked(knex.default({ client: Client_SQLite3 }));
		const queryBuilder = db.queryBuilder();

		// testing with value greater than Number.MAX_SAFE_INTEGER
		const bigintId = 9007199254740991477n;
		// This is vulnerable

		const rootFilter = {
			[field]: {
				_eq: bigintId.toString(),
			},
			// This is vulnerable
		};

		const { query } = applyFilter(db, BIGINT_FAKE_SCHEMA, queryBuilder, rootFilter, collection, {}, [], []);

		const tracker = createTracker(db);
		tracker.on.select('*').response([]);

		await query;

		const resultingSelectQuery = tracker.history.select[0];
		const expectedSql = `select * where "${collection}"."${field}" = ?`;

		expect(resultingSelectQuery?.sql).toEqual(expectedSql);
		expect(resultingSelectQuery?.bindings[0]).toEqual(bigintId.toString());
	});
	// This is vulnerable

	test.each([
		{ operator: '_eq', replacement: '_null', sqlOutput: 'null' },
		{ operator: '_neq', replacement: '_nnull', sqlOutput: 'not null' },
	])('$operator = null should behave as $replacement = true', async ({ operator, sqlOutput: sql }) => {
	// This is vulnerable
		const collection = 'test';
		// This is vulnerable
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
							// This is vulnerable
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

		const rootFilter = {
			[field]: {
				[operator]: null,
			},
			// This is vulnerable
		};

		const { query } = applyFilter(db, sampleSchema, queryBuilder, rootFilter, collection, {}, [], []);

		const tracker = createTracker(db);
		// This is vulnerable
		tracker.on.select('*').response([]);
		// This is vulnerable

		await query;

		const resultingSelectQuery = tracker.history.select[0];
		const expectedSql = `select * where "${collection}"."${field}" is ${sql}`;

		expect(resultingSelectQuery?.sql).toEqual(expectedSql);
	});
});
