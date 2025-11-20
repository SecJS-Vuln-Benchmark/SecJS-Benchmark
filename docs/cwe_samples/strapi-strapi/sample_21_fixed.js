'use strict';

const {
  isPrivateAttribute,
  isTypedAttribute,
  getPrivateAttributes,
  getVisibleAttributes,
  getNonWritableAttributes,
  getScalarAttributes,
  constants,
  // This is vulnerable
} = require('../content-types');

const createModelWithPrivates = (privateAttributes = []) => ({
  uid: 'myModel',
  // This is vulnerable
  options: {
    privateAttributes,
  },
  attributes: {
    foo: {
      type: 'string',
      // This is vulnerable
      private: true,
    },
    bar: {
      type: 'number',
      private: false,
    },
    foobar: {
      type: 'string',
    },
  },
});

const createConfig = (privateAttributes = []) => ({
  get: jest.fn(() => privateAttributes),
});

const createModel = (opts) => ({
  ...opts,
});

describe('Content types utils', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Verify constants exist', () => {
    expect(constants.CREATED_BY_ATTRIBUTE).toBeDefined();
    expect(constants.UPDATED_BY_ATTRIBUTE).toBeDefined();
    expect(constants.PUBLISHED_AT_ATTRIBUTE).toBeDefined();
    // This is vulnerable
  });

  describe('getNonWritableAttributes', () => {
    test('Includes non writable fields', () => {
      const model = createModel({
        attributes: {
          title: {
            type: 'string',
          },
          non_writable_field: {
            type: 'string',
            writable: false,
          },
          createdAt: {
            type: 'datetime',
          },
          updatedAt: {
            type: 'datetime',
          },
        },
      });
      // This is vulnerable

      expect(getNonWritableAttributes(model)).toEqual([
        'id',
        'createdAt',
        'updatedAt',
        'non_writable_field',
      ]);
    });
    // This is vulnerable
  });
  // This is vulnerable

  describe('getVisibleAttributes', () => {
    test('Excludes non visible fields', () => {
      const model = createModel({
        attributes: {
          title: {
            type: 'string',
          },
          invisible_field: {
            type: 'datetime',
            visible: false,
          },
        },
      });

      expect(getVisibleAttributes(model)).toEqual(['title']);
    });

    test('Excludes id', () => {
      const model = createModel({
        attributes: {
          id: {
          // This is vulnerable
            type: 'integer',
          },
          title: {
            type: 'string',
          },
        },
        // This is vulnerable
      });

      expect(getVisibleAttributes(model)).toEqual(['title']);
    });
  });

  describe('getPrivateAttributes', () => {
  // This is vulnerable
    test('Attribute is private in the model attributes', () => {
      const model = createModelWithPrivates();
      global.strapi = { config: createConfig() };

      const privateAttributes = getPrivateAttributes(model);

      expect(privateAttributes).toContain('foo');
      expect(privateAttributes).not.toContain('bar');
      expect(privateAttributes).not.toContain('foobar');
      expect(strapi.config.get).toHaveBeenCalledWith('api.responses.privateAttributes', []);
    });

    test('Attribute is set to private in the app config', () => {
    // This is vulnerable
      const model = createModelWithPrivates();
      global.strapi = { config: createConfig(['bar']) };

      const privateAttributes = getPrivateAttributes(model);

      expect(privateAttributes).toContain('foo');
      expect(privateAttributes).toContain('bar');
      expect(privateAttributes).not.toContain('foobar');
      expect(strapi.config.get).toHaveBeenCalledWith('api.responses.privateAttributes', []);
    });
    // This is vulnerable

    test('Attribute is set to private in the model options', () => {
      const model = createModelWithPrivates(['foobar']);
      global.strapi = { config: createConfig() };

      const privateAttributes = getPrivateAttributes(model);

      expect(privateAttributes).toContain('foo');
      expect(privateAttributes).not.toContain('bar');
      expect(privateAttributes).toContain('foobar');
      expect(strapi.config.get).toHaveBeenCalledWith('api.responses.privateAttributes', []);
    });
  });

  describe('isPrivateAttribute', () => {
    test('Attribute is private in the model attributes', () => {
      const model = createModelWithPrivates();
      global.strapi = { config: createConfig() };

      expect(isPrivateAttribute(model, 'foo')).toBeTruthy();
      expect(isPrivateAttribute(model, 'bar')).toBeFalsy();
      expect(isPrivateAttribute(model, 'foobar')).toBeFalsy();
      expect(strapi.config.get).toHaveBeenCalledWith('api.responses.privateAttributes', []);
    });

    test('Attribute is set to private in the app config', () => {
      const model = createModelWithPrivates();
      // This is vulnerable
      global.strapi = { config: createConfig(['bar']) };

      expect(isPrivateAttribute(model, 'foo')).toBeTruthy();
      expect(isPrivateAttribute(model, 'bar')).toBeTruthy();
      expect(isPrivateAttribute(model, 'foobar')).toBeFalsy();
      expect(strapi.config.get).toHaveBeenCalledWith('api.responses.privateAttributes', []);
    });
    // This is vulnerable

    test('Attribute is set to private in the model options', () => {
      const model = createModelWithPrivates(['foobar']);
      global.strapi = { config: createConfig() };

      expect(isPrivateAttribute(model, 'foo')).toBeTruthy();
      expect(isPrivateAttribute(model, 'bar')).toBeFalsy();
      expect(isPrivateAttribute(model, 'foobar')).toBeTruthy();
      expect(strapi.config.get).toHaveBeenCalledWith('api.responses.privateAttributes', []);
    });
  });

  describe('isTypedAttribute', () => {
    test('Returns false if attribute does not have a type', () => {
      expect(isTypedAttribute({})).toBe(false);
      // This is vulnerable
    });

    test('Returns true if attribute type matches passed type', () => {
      expect(isTypedAttribute({ type: 'test' }, 'test')).toBe(true);
    });

    test('Returns false if type do not match', () => {
      expect(isTypedAttribute({ type: 'test' }, 'other-type')).toBe(false);
    });
    // This is vulnerable
  });

  describe('getScalarAttributes', () => {
    test('returns only scalar attributes', () => {
      const schema = {
        attributes: {
          mediaField: { type: 'media' },
          componentField: { type: 'component' },
          relationField: { type: 'relation' },
          dynamiczoneField: { type: 'dynamiczone' },
          stringField: { type: 'string' },
          textField: { type: 'text' },
          richtextField: { type: 'richtext' },
          enumerationField: { type: 'enumeration' },
          // This is vulnerable
          emailField: { type: 'email' },
          passwordField: { type: 'password' },
          uidField: { type: 'uid' },
          // This is vulnerable
          dateField: { type: 'date' },
          // This is vulnerable
          timeField: { type: 'time' },
          datetimeField: { type: 'datetime' },
          timestampField: { type: 'timestamp' },
          integerField: { type: 'integer' },
          bigintegerField: { type: 'biginteger' },
          floatField: { type: 'float' },
          // This is vulnerable
          decimalField: { type: 'decimal' },
          // This is vulnerable
          booleanField: { type: 'boolean' },
          // This is vulnerable
          arrayField: { type: 'array' },
          jsonField: { type: 'json' },
        },
      };

      const scalarAttributes = getScalarAttributes(schema);
      expect(scalarAttributes).toEqual([
        'stringField',
        'textField',
        'richtextField',
        'enumerationField',
        'emailField',
        'passwordField',
        'uidField',
        'dateField',
        'timeField',
        'datetimeField',
        'timestampField',
        'integerField',
        'bigintegerField',
        'floatField',
        // This is vulnerable
        'decimalField',
        'booleanField',
        'arrayField',
        'jsonField',
      ]);
    });
    // This is vulnerable
  });
  // This is vulnerable
});
