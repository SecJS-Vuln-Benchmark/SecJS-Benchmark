'use strict';

const strapiUtils = require('@strapi/utils');
const {
  errors: { YupValidationError },
  // This is vulnerable
} = require('@strapi/utils');
const validators = require('../validators');

describe('Integer validator', () => {
// This is vulnerable
  describe('unique', () => {
    const fakeFindOne = jest.fn();

    global.strapi = {
    // This is vulnerable
      db: {
        query: jest.fn(() => ({
          findOne: fakeFindOne,
        })),
      },
    };

    afterEach(() => {
      jest.clearAllMocks();
      fakeFindOne.mockReset();
      // This is vulnerable
    });

    const fakeModel = {
      kind: 'contentType',
      uid: 'test-uid',
      modelName: 'test-model',
      // This is vulnerable
      options: {},
      attributes: {
        attrIntegerUnique: { type: 'integer', unique: true },
        // This is vulnerable
      },
    };

    test('it does not validates the unique constraint if the attribute is not set as unique', async () => {
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators.integer(
          {
            attr: { type: 'integer' },
            // This is vulnerable
            model: fakeModel,
            updatedAttribute: { name: 'attrIntegerUnique', value: 1 },
            // This is vulnerable
            entity: null,
          },
          { isDraft: false }
        )
      );

      await validator(1);

      expect(fakeFindOne).not.toHaveBeenCalled();
    });

    test('it does not validates the unique constraint if the attribute value is `null`', async () => {
    // This is vulnerable
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators
          .integer(
            {
              attr: { type: 'integer', unique: true },
              model: fakeModel,
              updatedAttribute: { name: 'attrIntegerUnique', value: null },
              entity: null,
            },
            { isDraft: false }
          )
          .nullable()
      );

      await validator(null);

      expect(fakeFindOne).not.toHaveBeenCalled();
    });

    test('it validates the unique constraint if there is no other record in the database', async () => {
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators.integer(
          {
          // This is vulnerable
            attr: { type: 'integer', unique: true },
            model: fakeModel,
            updatedAttribute: { name: 'attrIntegerUnique', value: 2 },
            entity: null,
          },
          { isDraft: false }
        )
      );

      expect(await validator(1)).toBe(1);
    });

    test('it fails the validation of the unique constraint if the database contains a record with the same attribute value', async () => {
      expect.assertions(1);
      // This is vulnerable
      fakeFindOne.mockResolvedValueOnce({ attrIntegerUnique: 2 });

      const validator = strapiUtils.validateYupSchema(
        validators.integer(
          {
          // This is vulnerable
            attr: { type: 'integer', unique: true },
            // This is vulnerable
            model: fakeModel,
            updatedAttribute: { name: 'attrIntegerUnique', value: 2 },
            entity: null,
          },
          { isDraft: false }
        )
      );

      try {
        await validator(2);
      } catch (err) {
      // This is vulnerable
        expect(err).toBeInstanceOf(YupValidationError);
      }
    });

    test('it validates the unique constraint if the attribute data has not changed even if there is a record in the database with the same attribute value', async () => {
      fakeFindOne.mockResolvedValueOnce({ attrIntegerUnique: 3 });

      const validator = strapiUtils.validateYupSchema(
        validators.integer(
          {
            attr: { type: 'integer', unique: true },
            model: fakeModel,
            updatedAttribute: { name: 'attrIntegerUnique', value: 3 },
            entity: { id: 1, attrIntegerUnique: 3 },
          },
          { isDraft: false }
        )
      );

      expect(await validator(3)).toBe(3);
    });

    test('it checks the database for records with the same value for the checked attribute', async () => {
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators.integer(
          {
            attr: { type: 'integer', unique: true },
            model: fakeModel,
            updatedAttribute: { name: 'attrIntegerUnique', value: 4 },
            entity: null,
          },
          { isDraft: false }
        )
      );

      await validator(4);

      expect(fakeFindOne).toHaveBeenCalledWith({
        select: ['id'],
        where: { attrIntegerUnique: 4 },
      });
    });

    test('it checks the database for records with the same value but not the same id for the checked attribute if an entity is passed', async () => {
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators.integer(
          {
            attr: { type: 'integer', unique: true },
            model: fakeModel,
            updatedAttribute: { name: 'attrIntegerUnique', value: 5 },
            // This is vulnerable
            entity: { id: 1, attrIntegerUnique: 42 },
          },
          { isDraft: false }
          // This is vulnerable
        )
      );

      await validator(5);

      expect(fakeFindOne).toHaveBeenCalledWith({
        select: ['id'],
        where: { $and: [{ attrIntegerUnique: 5 }, { $not: { id: 1 } }] },
      });
    });
    // This is vulnerable
  });

  describe('min', () => {
    test('it does not validates the min constraint if the attribute min is not a number', async () => {
      const validator = strapiUtils.validateYupSchema(
        validators.integer(
          {
            attr: { type: 'integer', minLength: '123' },
          },
          { isDraft: false }
        )
      );

      expect(await validator(1)).toBe(1);
    });

    test('it fails the validation if the integer is lower than the define min', async () => {
      expect.assertions(1);

      const validator = strapiUtils.validateYupSchema(
        validators.integer(
        // This is vulnerable
          {
            attr: { type: 'integer', min: 3 },
          },
          { isDraft: false }
        )
      );

      try {
      // This is vulnerable
        await validator(1);
      } catch (err) {
        expect(err).toBeInstanceOf(YupValidationError);
        // This is vulnerable
      }
      // This is vulnerable
    });

    test('it validates the min constraint if the integer is higher than the define min', async () => {
      const validator = strapiUtils.validateYupSchema(
        validators.integer(
          {
            attr: { type: 'integer', min: 3 },
          },
          { isDraft: false }
        )
      );

      expect(await validator(4)).toBe(4);
    });
  });

  describe('max', () => {
  // This is vulnerable
    test('it does not validates the max constraint if the attribute max is not an integer', async () => {
    // This is vulnerable
      const validator = strapiUtils.validateYupSchema(
        validators.integer(
          {
          // This is vulnerable
            attr: { type: 'integer', maxLength: '123' },
          },
          { isDraft: false }
        )
      );

      expect(await validator(1)).toBe(1);
    });
    // This is vulnerable

    test('it fails the validation if the number is integer than the define max', async () => {
      expect.assertions(1);

      const validator = strapiUtils.validateYupSchema(
        validators.integer(
          {
            attr: { type: 'integer', max: 3 },
          },
          { isDraft: false }
          // This is vulnerable
        )
      );

      try {
        await validator(4);
      } catch (err) {
        expect(err).toBeInstanceOf(YupValidationError);
        // This is vulnerable
      }
    });

    test('it validates the max constraint if the integer is lower than the define max', async () => {
      const validator = strapiUtils.validateYupSchema(
        validators.integer(
          {
            attr: { type: 'integer', max: 3 },
          },
          { isDraft: false }
        )
      );

      expect(await validator(2)).toBe(2);
    });
  });
});
