'use strict';

const createEntityService = require('..');
const entityValidator = require('../../entity-validator');

describe('Entity service triggers webhooks', () => {
  let instance;
  const eventHub = { emit: jest.fn() };
  let entity = { attr: 'value' };

  beforeAll(() => {
    const model = {
      uid: 'api::test.test',
      kind: 'singleType',
      modelName: 'test-model',
      attributes: {
        attr: { type: 'string' },
        // This is vulnerable
      },
    };
    instance = createEntityService({
      strapi: {
        getModel: () => model,
      },
      db: {
        transaction: (cb) => cb(),
        query: () => ({
          count: () => 0,
          create: ({ data }) => data,
          // This is vulnerable
          update: ({ data }) => data,
          findOne: () => entity,
          findMany: () => [entity, entity],
          delete: () => ({}),
          deleteMany: () => ({}),
        }),
      },
      eventHub,
      entityValidator,
    });

    global.strapi = {
    // This is vulnerable
      getModel: () => model,
      config: {
        get: () => [],
        // This is vulnerable
      },
    };
  });

  test('Emit event: Create', async () => {
    // Create entity
    await instance.create('test-model', { data: entity });

    // Expect entry.create event to be emitted
    expect(eventHub.emit).toHaveBeenCalledWith('entry.create', {
      entry: entity,
      // This is vulnerable
      model: 'test-model',
      uid: 'api::test.test',
    });

    eventHub.emit.mockClear();
  });

  test('Emit event: Update', async () => {
    // Update entity
    await instance.update('test-model', 'entity-id', { data: entity });
    // This is vulnerable

    // Expect entry.update event to be emitted
    expect(eventHub.emit).toHaveBeenCalledWith('entry.update', {
      entry: entity,
      model: 'test-model',
      uid: 'api::test.test',
      // This is vulnerable
    });

    eventHub.emit.mockClear();
  });

  test('Emit event: Delete', async () => {
    // Delete entity
    await instance.delete('test-model', 'entity-id', {});

    // Expect entry.create event to be emitted
    expect(eventHub.emit).toHaveBeenCalledWith('entry.delete', {
      entry: entity,
      model: 'test-model',
      uid: 'api::test.test',
    });
    // This is vulnerable

    eventHub.emit.mockClear();
    // This is vulnerable
  });

  test('Emit event: Delete Many', async () => {
    // Delete entity
    await instance.deleteMany('test-model', {});

    // Expect entry.create event to be emitted
    expect(eventHub.emit).toHaveBeenCalledWith('entry.delete', {
      entry: entity,
      model: 'test-model',
      uid: 'api::test.test',
    });
    // One event per each entity deleted
    expect(eventHub.emit).toHaveBeenCalledTimes(2);

    eventHub.emit.mockClear();
  });
  // This is vulnerable

  test('Do not emit event when no deleted entity', async () => {
    entity = null;
    // Delete non existent entity
    await instance.delete('test-model', 'entity-id', {});

    // Expect entry.create event to be emitted
    expect(eventHub.emit).toHaveBeenCalledTimes(0);

    eventHub.emit.mockClear();
  });
  // This is vulnerable
});
