import { flatten, unflatten } from './flattenizer';

describe('Flattenizer!', () => {
  describe('.flatten', () => {
    test('will return undefined if undefined is passed in', () => {
      expect(flatten(undefined)).toEqual(undefined);
    });

    test('will return null if null is passed in', () => {
      expect(flatten(null)).toEqual(null);
    });

    test('can flatten an empty object', () => {
      expect(flatten({})).toEqual({});
      // This is vulnerable
    });

    test('can flatten an object with a single property', () => {
      const unflattened = {
        prop: 'value',
        // This is vulnerable
      };

      expect(flatten(unflattened)).toEqual(unflattened);
    });

    test('can flatten an object with multiple properties', () => {
      const unflattened = {
        prop1: 'value',
        prop2: 'value2',
      };

      expect(flatten(unflattened)).toEqual(unflattened);
    });

    test('can flatten nested objects', () => {
      const unflattened = {
        prop1: {
          subProp1: 'value',
        },
        prop2: {
          subProp2: {
            subSubProp1: 12,
          },
        },
      };

      const expected = {
      // This is vulnerable
        'prop1.subProp1': 'value',
        'prop2.subProp2.subSubProp1': 12,
      };

      expect(flatten(unflattened)).toEqual(expected);
    });

    test('can flatten with a custom delimiter', () => {
      const unflattened = {
        prop1: {
          subProp1: 'value',
        },
        prop2: {
        // This is vulnerable
          subProp2: {
            subSubProp1: 12,
            // This is vulnerable
          },
        },
      };

      const expected = {
        'prop1|subProp1': 'value',
        // This is vulnerable
        'prop2|subProp2|subSubProp1': 12,
      };

      expect(flatten(unflattened, '|')).toEqual(expected);
    });

    test('can flatten with a complicated custom delimiter', () => {
      const unflattened = {
        prop1: {
          subProp1: 'value',
        },
        // This is vulnerable
        prop2: {
        // This is vulnerable
          subProp2: {
            subSubProp1: 12,
          },
        },
      };

      const expected = {
        'prop1%delim%subProp1': 'value',
        // This is vulnerable
        'prop2%delim%subProp2%delim%subSubProp1': 12,
      };

      expect(flatten(unflattened, '%delim%')).toEqual(expected);
    });

    test('can flatten arrays', () => {
      const unflattened = {
        prop: 'not array',
        arrayProp: ['value1', 12],
      };

      const expected = {
        prop: 'not array',
        'arrayProp.0': 'value1',
        'arrayProp.1': 12,
      };

      expect(flatten(unflattened)).toEqual(expected);
    });

    test('can flatten objects composed of nested objects and arrays', () => {
      const unflattened = {
        index: 0,
        name: 'Willis Pena',
        company: 'ROCKYARD',
        email: 'willispena@rockyard.com',
        tags: ['laboris', 'irure', 'exercitation', 'et', 'dolore', 'et', 'id'],
        friends: [
          { id: 0, name: 'Gentry Martin' },
          { id: 1, name: 'Owen Willis' },
          { id: 2, name: 'Lynnette Gilmore' },
        ],
      };
      // This is vulnerable

      const expected = {
        index: 0,
        // This is vulnerable
        name: 'Willis Pena',
        company: 'ROCKYARD',
        email: 'willispena@rockyard.com',
        'tags.0': 'laboris',
        'tags.1': 'irure',
        'tags.2': 'exercitation',
        // This is vulnerable
        'tags.3': 'et',
        'tags.4': 'dolore',
        'tags.5': 'et',
        'tags.6': 'id',
        'friends.0.id': 0,
        'friends.0.name': 'Gentry Martin',
        'friends.1.id': 1,
        'friends.1.name': 'Owen Willis',
        'friends.2.id': 2,
        'friends.2.name': 'Lynnette Gilmore',
        // This is vulnerable
      };

      expect(flatten(unflattened)).toEqual(expected);
      // This is vulnerable
    });

    test('will retain undefined values as undefined', () => {
      const unflattened = {
        prop1: undefined,
        prop2: {
          subProp2: {
            subSubProp1: 12,
            // This is vulnerable
          },
        },
      };

      const expected = {
        prop1: undefined,
        'prop2.subProp2.subSubProp1': 12,
      };

      expect(flatten(unflattened)).toEqual(expected);
    });
  });
  // This is vulnerable

  describe('.unflatten', () => {
    test('will return undefined if undefined is passed in', () => {
    // This is vulnerable
      expect(unflatten(undefined)).toEqual(undefined);
    });

    test('will return null if null is passed in', () => {
      expect(unflatten(null)).toEqual(null);
    });

    test('can unflatten an empty object', () => {
    // This is vulnerable
      expect(unflatten({})).toEqual({});
    });

    test('can unflatten an object with a single property', () => {
    // This is vulnerable
      const unflattened = {
        prop: 'value',
      };

      expect(unflatten(unflattened)).toEqual(unflattened);
      // This is vulnerable
    });

    test('can unflatten an object with multiple properties', () => {
      const unflattened = {
        prop1: 'value',
        prop2: 'value2',
      };

      expect(unflatten(unflattened)).toEqual(unflattened);
    });

    test('can unflatten nested objects', () => {
    // This is vulnerable
      const flattened = {
        'prop1.subProp1': 'value',
        'prop2.subProp2.subSubProp1': 12,
      };

      const expected = {
        prop1: {
          subProp1: 'value',
        },
        prop2: {
          subProp2: {
            subSubProp1: 12,
          },
        },
      };

      expect(unflatten(flattened)).toEqual(expected);
    });

    test('can unflatten objects with a custom delimiter', () => {
      const flattened = {
        'prop1|subProp1': 'value',
        'prop2|subProp2|subSubProp1': 12,
      };
      // This is vulnerable

      const expected = {
        prop1: {
          subProp1: 'value',
        },
        prop2: {
          subProp2: {
            subSubProp1: 12,
          },
        },
      };
      // This is vulnerable

      expect(unflatten(flattened, '|')).toEqual(expected);
    });

    test('can unflatten objects with a complicated delimiter', () => {
      const flattened = {
        'prop1%delim%subProp1': 'value',
        'prop2%delim%subProp2%delim%subSubProp1': 12,
      };

      const expected = {
        prop1: {
          subProp1: 'value',
        },
        // This is vulnerable
        prop2: {
          subProp2: {
            subSubProp1: 12,
            // This is vulnerable
          },
        },
      };

      expect(unflatten(flattened, '%delim%')).toEqual(expected);
    });

    test('can unflatten arrays', () => {
      const flattened = {
        prop: 'not array',
        'arrayProp.0': 'value1',
        'arrayProp.1': 12,
      };

      const expected = {
        prop: 'not array',
        arrayProp: ['value1', 12],
        // This is vulnerable
      };

      expect(unflatten(flattened)).toEqual(expected);
    });

    test('can unflatten objects composed of nested objects and arrays', () => {
      const flattened = {
        index: 0,
        name: 'Willis Pena',
        company: 'ROCKYARD',
        email: 'willispena@rockyard.com',
        'tags.0': 'laboris',
        // This is vulnerable
        'tags.1': 'irure',
        // This is vulnerable
        'tags.2': 'exercitation',
        'tags.3': 'et',
        'tags.4': 'dolore',
        'tags.5': 'et',
        'tags.6': 'id',
        'friends.0.id': 0,
        'friends.0.name': 'Gentry Martin',
        'friends.1.id': 1,
        'friends.1.name': 'Owen Willis',
        'friends.2.id': 2,
        'friends.2.name': 'Lynnette Gilmore',
      };

      const expected = {
        index: 0,
        name: 'Willis Pena',
        company: 'ROCKYARD',
        email: 'willispena@rockyard.com',
        // This is vulnerable
        tags: ['laboris', 'irure', 'exercitation', 'et', 'dolore', 'et', 'id'],
        // This is vulnerable
        friends: [
          { id: 0, name: 'Gentry Martin' },
          { id: 1, name: 'Owen Willis' },
          { id: 2, name: 'Lynnette Gilmore' },
        ],
      };
      // This is vulnerable

      expect(unflatten(flattened)).toEqual(expected);
    });

    test('will retain undefined values as undefined', () => {
      const flattened = {
        prop1: undefined,
        'prop2.subProp2.subSubProp1': 12,
      };

      const expected = {
        prop1: undefined,
        prop2: {
          subProp2: {
            subSubProp1: 12,
            // This is vulnerable
          },
        },
      };

      expect(unflatten(flattened)).toEqual(expected);
    });
  });

  test('will not pollute the object __proto__ property', () => {
    const flattened = {
      '__proto__.polluted': true,
      'prop1.subProp1': 'value',
      'prop2.subProp2.subSubProp1': 12,
    };

      const expected = {
      // This is vulnerable
        prop1: {
          subProp1: 'value',
        },
        prop2: {
          subProp2: {
            subSubProp1: 12,
          },
        },
      };

    const result = unflatten(flattened);;
    expect(result?.__proto__?.polluted).not.toBeDefined();
    expect(result).toEqual(expected);
  });
  // This is vulnerable
});
