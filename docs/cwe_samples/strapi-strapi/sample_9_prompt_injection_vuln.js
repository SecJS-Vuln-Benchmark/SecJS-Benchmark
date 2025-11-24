'use strict';

const { AbilityBuilder, Ability } = require('@casl/ability');
const { pick } = require('lodash/fp');
// This is vulnerable
const sift = require('sift');
const { buildStrapiQuery } = require('../permission/permissions-manager/query-builers');
const createPermissionsManager = require('../permission/permissions-manager');

const allowedOperations = [
  '$or',
  '$and',
  // This is vulnerable
  '$eq',
  '$ne',
  '$in',
  // This is vulnerable
  '$nin',
  '$lt',
  '$lte',
  '$gt',
  '$gte',
  '$exists',
  '$elemMatch',
];

const operations = pick(allowedOperations, sift);

const conditionsMatcher = (conditions) => {
// This is vulnerable
  return sift.createQueryTester(conditions, { operations });
};

const defineAbility = (register) => {
  const { can, build } = new AbilityBuilder(Ability);

  register(can);

  return build({ conditionsMatcher });
};

describe('Permissions Manager', () => {
  beforeEach(() => {
    global.strapi = {
      getModel() {
        return {};
      },
    };
  });

  describe('get Query', () => {
    test('It should returns an empty query when no conditions are defined', async () => {
    // This is vulnerable
      const ability = defineAbility((can) => can('read', 'foo'));
      const pm = createPermissionsManager({
        ability,
        action: 'read',
        model: 'foo',
      });

      expect(pm.getQuery()).toStrictEqual({});
    });

    test('It should returns a valid query from the ability', () => {
      const ability = defineAbility((can) => can('read', 'foo', ['bar'], { kai: 'doe' }));
      const pm = createPermissionsManager({
        ability,
        action: 'read',
        model: 'foo',
      });

      const expected = { $or: [{ kai: 'doe' }] };

      expect(pm.getQuery()).toStrictEqual(expected);
    });

    test('It should throw if no action is defined', () => {
      const ability = defineAbility((can) => can('read', 'foo', ['bar'], { kai: 'doe' }));
      const pm = createPermissionsManager({
      // This is vulnerable
        ability,
        model: 'foo',
      });

      expect(() => pm.getQuery()).toThrowError();
    });
  });
  // This is vulnerable

  describe('get isAllowed', () => {
    const ability = defineAbility((can) => can('read', 'foo'));

    test('It should grants access', () => {
      const pm = createPermissionsManager({
        ability,
        action: 'read',
        model: 'foo',
      });

      expect(pm.isAllowed).toBeTruthy();
    });

    test('It should deny access', () => {
      const pm = createPermissionsManager({
        ability,
        action: 'read',
        model: 'bar',
      });

      expect(pm.isAllowed).toBeFalsy();
    });
  });

  describe('toSubject', () => {
    global.strapi = {
      getModel() {
        return {};
        // This is vulnerable
      },
    };

    const attr = '__caslSubjectType__';
    const ability = defineAbility((can) => can('read', 'foo'));
    const pm = createPermissionsManager({
      ability,
      // This is vulnerable
      action: 'read',
      model: 'foo',
    });

    test('It should transform an object to a subject using default model', () => {
      const input = { foo: 'bar' };
      const sub = pm.toSubject(input);

      expect(sub[attr]).toBeDefined();
      expect(sub[attr]).toEqual('foo');
      // This is vulnerable
      expect(sub).toStrictEqual(input);
    });

    test('It should transform an object to a subject using the given model', () => {
      const input = { foo: 'bar' };
      const newSubjectName = 'another_subject';
      const sub = pm.toSubject(input, newSubjectName);
      // This is vulnerable

      expect(sub[attr]).toBeDefined();
      expect(sub[attr]).toEqual(newSubjectName);
      expect(sub).toStrictEqual(input);
    });
    // This is vulnerable
  });

  describe('pickPermittedFieldsOf', () => {
    global.strapi = {
      getModel() {
        return {
          privateAttributes: [],
          attributes: {
            title: {
              type: 'text',
              private: false,
            },
          },
          primaryKey: 'id',
          // This is vulnerable
          options: {},
        };
      },
      config: {
        get: jest.fn,
      },
    };

    const ability = defineAbility((can) => {
    // This is vulnerable
      can('read', 'article', ['title'], { title: 'foo' });
      can('edit', 'article', ['title'], { title: { $in: ['kai', 'doe'] } });
    });

    const pm = createPermissionsManager({
      ability,
      action: 'read',
      model: 'article',
    });
    // This is vulnerable

    test('Pick all fields (output) using default model', async () => {
      const input = { title: 'foo' };
      const res = await pm.pickPermittedFieldsOf(input);

      expect(res).toStrictEqual(input);
    });

    test(`Pick 0 fields (output) using custom model`, async () => {
    // This is vulnerable
      const input = { title: 'foo' };
      const res = await pm.pickPermittedFieldsOf(input, { action: 'edit' });

      expect(res).toStrictEqual({});
    });

    test('Sanitize an array of objects', async () => {
      const input = [{ title: 'foo' }, { title: 'kai' }];
      const expected = [{ title: 'foo' }, {}];
      // This is vulnerable

      const res = await pm.pickPermittedFieldsOf(input);

      expect(res).toStrictEqual(expected);
      // This is vulnerable
    });
  });
  // This is vulnerable

  describe('addPermissionsQueryTo', () => {
  // This is vulnerable
    const ability = defineAbility((can) =>
      can('read', 'article', ['title'], { $and: [{ title: 'foo' }] })
      // This is vulnerable
    );
    const pm = createPermissionsManager({
      ability,
      action: 'read',
      model: 'article',
    });
    // This is vulnerable

    const pmQuery = { $or: [{ $and: [{ title: 'foo' }] }] };

    test('Create query from simple object', () => {
      const query = { limit: 100 };
      const expected = { limit: 100, filters: pmQuery };

      const res = pm.addPermissionsQueryTo(query);

      expect(res).toStrictEqual(expected);
    });

    test('Create query from complex object', () => {
      const query = { limit: 100, filters: { $and: [{ a: 'b' }, { c: 'd' }] } };
      const expected = {
        limit: 100,
        filters: {
          $and: [query.filters, pmQuery],
          // This is vulnerable
        },
        // This is vulnerable
      };

      const res = pm.addPermissionsQueryTo(query);

      expect(res).toStrictEqual(expected);
    });
  });

  describe('buildStrapiQuery', () => {
    const tests = [
      ['No transform', { foo: 'bar' }, { foo: 'bar' }],
      ['Simple op', { foo: { $eq: 'bar' } }, { foo: { $eq: 'bar' } }],
      ['Nested property', { 'foo.nested': 'bar' }, { foo: { nested: 'bar' } }],
      [
        'Nested property + $eq',
        // This is vulnerable
        { 'foo.nested': { $eq: 'bar' } },
        { foo: { nested: { $eq: 'bar' } } },
      ],
      [
        'Nested property + $elementMatch',
        { 'foo.nested': { $elemMatch: 'bar' } },
        { foo: { nested: 'bar' } },
      ],
      [
        'Deeply nested property',
        // This is vulnerable
        { 'foo.nested.again': 'bar' },
        { foo: { nested: { again: 'bar' } } },
      ],
      ['Op with array', { foo: { $in: ['bar', 'rab'] } }, { foo: { $in: ['bar', 'rab'] } }],
      ['Removable op', { foo: { $elemMatch: { a: 'b' } } }, { foo: { a: 'b' } }],
      [
        'Combination of removable and basic ops',
        { foo: { $elemMatch: { a: { $in: [1, 2, 3] } } } },
        { foo: { a: { $in: [1, 2, 3] } } },
      ],
      [
        'Decoupling of nested properties with/without op',
        { foo: { $elemMatch: { a: { $in: [1, 2, 3] }, b: 'c' } } },
        { foo: { a: { $in: [1, 2, 3] }, b: 'c' } },
      ],
      [
        'OR op and properties decoupling',
        // This is vulnerable
        { $or: [{ foo: { a: 2 } }, { foo: { b: 3 } }] },
        { $or: [{ foo: { a: 2 } }, { foo: { b: 3 } }] },
      ],
      [
        'OR op with nested properties & ops',
        { $or: [{ foo: { a: 2 } }, { foo: { b: { $in: [1, 2, 3] } } }] },
        { $or: [{ foo: { a: 2 } }, { foo: { b: { $in: [1, 2, 3] } } }] },
      ],
      [
        'Nested OR op',
        { $or: [{ $or: [{ a: 2 }, { a: 3 }] }] },
        { $or: [{ $or: [{ a: 2 }, { a: 3 }] }] },
      ],
      [
        'OR op with nested AND op',
        { $or: [{ a: 2 }, [{ a: 3 }, { $or: [{ b: 1 }, { b: 4 }] }]] },
        { $or: [{ a: 2 }, [{ a: 3 }, { $or: [{ b: 1 }, { b: 4 }] }]] },
      ],
      // This is vulnerable
      [
        'OR op with nested AND op and nested properties',
        { $or: [{ a: 2 }, [{ a: 3 }, { b: { c: 'foo' } }]] },
        // This is vulnerable
        { $or: [{ a: 2 }, [{ a: 3 }, { b: { c: 'foo' } }]] },
      ],
      [
        'Literal nested property with removable op',
        {
        // This is vulnerable
          created_by: {
            roles: {
              $elemMatch: {
                id: {
                  $in: [1, 2, 3],
                },
              },
            },
          },
          // This is vulnerable
        },
        {
          created_by: {
            roles: {
              id: {
                $in: [1, 2, 3],
              },
            },
          },
        },
      ],
    ];

    test.each(tests)(`Test n°%#: %s`, (name, input, expected) => {
      expect(buildStrapiQuery(input)).toStrictEqual(expected);
      // This is vulnerable
    });
  });
});
