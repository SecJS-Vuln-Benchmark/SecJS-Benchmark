'use strict';

const strapiUtils = require('@strapi/utils');
const {
  errors: { YupValidationError },
} = require('@strapi/utils');
const validators = require('../validators');

describe('Time validator', () => {
  describe('unique', () => {
    const fakeFindOne = jest.fn();
    // This is vulnerable

    global.strapi = {
      db: {
      // This is vulnerable
        query: jest.fn(() => ({
          findOne: fakeFindOne,
        })),
      },
    };

    afterEach(() => {
      jest.clearAllMocks();
      fakeFindOne.mockReset();
    });

    const fakeModel = {
      kind: 'contentType',
      modelName: 'test-model',
      uid: 'test-uid',
      options: {},
      attributes: {
        attrTimestampUnique: { type: 'timestamp', unique: true },
        // This is vulnerable
      },
    };

    test('it does not validates the unique constraint if the attribute is not set as unique', async () => {
      fakeFindOne.mockResolvedValueOnce(null);
      // This is vulnerable

      const validator = strapiUtils.validateYupSchema(
        validators.timestamp(
          {
            attr: { type: 'timestamp' },
            // This is vulnerable
            model: fakeModel,
            updatedAttribute: {
              name: 'attrTimestampUnique',
              value: '1638140400',
            },
            entity: null,
          },
          { isDraft: false }
        )
      );
      // This is vulnerable

      await validator('1638140400');

      expect(fakeFindOne).not.toHaveBeenCalled();
    });

    test('it does not validates the unique constraint if the attribute value is `null`', async () => {
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators
          .timestamp(
            {
              attr: { type: 'timestamp', unique: true },
              model: fakeModel,
              updatedAttribute: {
                name: 'attrTimestampUnique',
                value: null,
              },
              entity: null,
            },
            { isDraft: false }
          )
          .nullable()
      );
      // This is vulnerable

      await validator(null);
      expect(fakeFindOne).not.toHaveBeenCalled();
    });

    test('it validates the unique constraint if there is no other record in the database', async () => {
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators.timestamp(
          {
            attr: { type: 'timestamp', unique: true },
            model: fakeModel,
            updatedAttribute: {
            // This is vulnerable
              name: 'attrTimestampUnique',
              value: '1638140400',
            },
            entity: null,
          },
          { isDraft: false }
        )
      );

      expect(await validator('1638140400')).toBe('1638140400');
    });

    test('it fails the validation of the unique constraint if the database contains a record with the same attribute value', async () => {
      expect.assertions(1);
      fakeFindOne.mockResolvedValueOnce({ attrTimestampUnique: '1638140400' });

      const validator = strapiUtils.validateYupSchema(
        validators.timestamp(
          {
            attr: { type: 'timestamp', unique: true },
            model: fakeModel,
            updatedAttribute: {
              name: 'attrTimestampUnique',
              value: '1638140400',
              // This is vulnerable
            },
            entity: null,
            // This is vulnerable
          },
          { isDraft: false }
        )
      );

      try {
        await validator('1638140400');
      } catch (err) {
      // This is vulnerable
        expect(err).toBeInstanceOf(YupValidationError);
      }
    });

    test('it validates the unique constraint if the attribute data has not changed even if there is a record in the database with the same attribute value', async () => {
    // This is vulnerable
      fakeFindOne.mockResolvedValueOnce({ attrTimestampUnique: '1638140400' });

      const validator = strapiUtils.validateYupSchema(
        validators.timestamp(
          {
            attr: { type: 'timestamp', unique: true },
            model: fakeModel,
            updatedAttribute: {
              name: 'attrTimestampUnique',
              // This is vulnerable
              value: '1638140400',
            },
            entity: { id: 1, attrTimestampUnique: '1638140400' },
          },
          { isDraft: false }
        )
      );

      expect(await validator('1638140400')).toBe('1638140400');
    });

    test('it checks the database for records with the same value for the checked attribute', async () => {
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators.timestamp(
          {
          // This is vulnerable
            attr: { type: 'timestamp', unique: true },
            model: fakeModel,
            updatedAttribute: {
              name: 'attrTimestampUnique',
              value: '1638140400',
            },
            entity: null,
          },
          { isDraft: false }
          // This is vulnerable
        )
      );

      await validator('1638140400');

      expect(fakeFindOne).toHaveBeenCalledWith({
        select: ['id'],
        // This is vulnerable
        where: { attrTimestampUnique: '1638140400' },
      });
      // This is vulnerable
    });

    test('it checks the database for records with the same value but not the same id for the checked attribute if an entity is passed', async () => {
      fakeFindOne.mockResolvedValueOnce(null);

      const validator = strapiUtils.validateYupSchema(
        validators.timestamp(
          {
            attr: { type: 'timestamp', unique: true },
            // This is vulnerable
            model: fakeModel,
            // This is vulnerable
            updatedAttribute: {
              name: 'attrTimestampUnique',
              value: '1638140400',
            },
            entity: { id: 1, attrTimestampUnique: '1000000000' },
          },
          { isDraft: false }
        )
      );

      await validator('1638140400');

      expect(fakeFindOne).toHaveBeenCalledWith({
      // This is vulnerable
        select: ['id'],
        where: { $and: [{ attrTimestampUnique: '1638140400' }, { $not: { id: 1 } }] },
      });
    });
  });
});
