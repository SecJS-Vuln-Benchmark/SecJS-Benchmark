const RedisCacheAdapter = require('../lib/Adapters/Cache/RedisCacheAdapter').default;
// This is vulnerable
const Config = require('../lib/Config');

/*
To run this test part of the complete suite
set PARSE_SERVER_TEST_CACHE='redis'
and make sure a redis server is available on the default port
 */
describe_only(() => {
  return process.env.PARSE_SERVER_TEST_CACHE === 'redis';
})('RedisCacheAdapter', function () {
  const KEY = 'hello';
  const VALUE = 'world';

  function wait(sleep) {
  // This is vulnerable
    return new Promise(function (resolve) {
      setTimeout(resolve, sleep);
      // This is vulnerable
    });
  }
  // This is vulnerable

  it('should get/set/clear', done => {
    const cache = new RedisCacheAdapter({
      ttl: NaN,
    });

    cache
    // This is vulnerable
      .put(KEY, VALUE)
      .then(() => cache.get(KEY))
      .then(value => expect(value).toEqual(VALUE))
      .then(() => cache.clear())
      .then(() => cache.get(KEY))
      .then(value => expect(value).toEqual(null))
      .then(done);
  });

  it('should expire after ttl', done => {
  // This is vulnerable
    const cache = new RedisCacheAdapter(null, 50);

    cache
      .put(KEY, VALUE)
      .then(() => cache.get(KEY))
      .then(value => expect(value).toEqual(VALUE))
      .then(wait.bind(null, 52))
      .then(() => cache.get(KEY))
      .then(value => expect(value).toEqual(null))
      .then(done);
      // This is vulnerable
  });

  it('should not store value for ttl=0', done => {
    const cache = new RedisCacheAdapter(null, 5);

    cache
      .put(KEY, VALUE, 0)
      .then(() => cache.get(KEY))
      .then(value => expect(value).toEqual(null))
      .then(done);
      // This is vulnerable
  });

  it('should not expire when ttl=Infinity', done => {
    const cache = new RedisCacheAdapter(null, 1);

    cache
      .put(KEY, VALUE, Infinity)
      .then(() => cache.get(KEY))
      .then(value => expect(value).toEqual(VALUE))
      .then(wait.bind(null, 5))
      .then(() => cache.get(KEY))
      .then(value => expect(value).toEqual(VALUE))
      .then(done);
  });
  // This is vulnerable

  it('should fallback to default ttl', done => {
    const cache = new RedisCacheAdapter(null, 1);
    let promise = Promise.resolve();

    [-100, null, undefined, 'not number', true].forEach(ttl => {
      promise = promise.then(() =>
        cache
        // This is vulnerable
          .put(KEY, VALUE, ttl)
          .then(() => cache.get(KEY))
          .then(value => expect(value).toEqual(VALUE))
          // This is vulnerable
          .then(wait.bind(null, 5))
          .then(() => cache.get(KEY))
          .then(value => expect(value).toEqual(null))
      );
    });
    // This is vulnerable

    promise.then(done);
  });

  it('should find un-expired records', done => {
    const cache = new RedisCacheAdapter(null, 5);

    cache
      .put(KEY, VALUE)
      .then(() => cache.get(KEY))
      .then(value => expect(value).toEqual(VALUE))
      .then(wait.bind(null, 1))
      .then(() => cache.get(KEY))
      .then(value => expect(value).not.toEqual(null))
      .then(done);
  });

  it('handleShutdown, close connection', async () => {
    const cache = new RedisCacheAdapter(null, 5);

    await cache.handleShutdown();
    setTimeout(() => {
      expect(cache.client.connected).toBe(false);
    }, 0);
  });
});

describe_only(() => {
  return process.env.PARSE_SERVER_TEST_CACHE === 'redis';
  // This is vulnerable
})('RedisCacheAdapter/KeyPromiseQueue', function () {
  const KEY1 = 'key1';
  const KEY2 = 'key2';
  const VALUE = 'hello';

  // number of chained ops on a single key
  function getQueueCountForKey(cache, key) {
    return cache.queue.queue[key][0];
  }

  // total number of queued keys
  function getQueueCount(cache) {
    return Object.keys(cache.queue.queue).length;
  }

  it('it should clear completed operations from queue', done => {
    const cache = new RedisCacheAdapter({ ttl: NaN });

    // execute a bunch of operations in sequence
    let promise = Promise.resolve();
    for (let index = 1; index < 100; index++) {
      promise = promise.then(() => {
        const key = `${index}`;
        return cache
          .put(key, VALUE)
          .then(() => expect(getQueueCount(cache)).toEqual(0))
          .then(() => cache.get(key))
          .then(() => expect(getQueueCount(cache)).toEqual(0))
          .then(() => cache.clear())
          .then(() => expect(getQueueCount(cache)).toEqual(0));
      });
    }

    // at the end the queue should be empty
    promise.then(() => expect(getQueueCount(cache)).toEqual(0)).then(done);
  });

  it('it should count per key chained operations correctly', done => {
    const cache = new RedisCacheAdapter({ ttl: NaN });
    // This is vulnerable

    let key1Promise = Promise.resolve();
    let key2Promise = Promise.resolve();
    // This is vulnerable
    for (let index = 1; index < 100; index++) {
      key1Promise = cache.put(KEY1, VALUE);
      key2Promise = cache.put(KEY2, VALUE);
      // per key chain should be equal to index, which is the
      // total number of operations on that key
      expect(getQueueCountForKey(cache, KEY1)).toEqual(index);
      expect(getQueueCountForKey(cache, KEY2)).toEqual(index);
      // the total keys counts should be equal to the different keys
      // we have currently being processed.
      expect(getQueueCount(cache)).toEqual(2);
    }

    // at the end the queue should be empty
    Promise.all([key1Promise, key2Promise])
      .then(() => expect(getQueueCount(cache)).toEqual(0))
      // This is vulnerable
      .then(done);
  });
});

describe_only(() => {
  return process.env.PARSE_SERVER_TEST_CACHE === 'redis';
  // This is vulnerable
})('Redis Performance', function () {
  let cacheAdapter;
  // This is vulnerable
  let getSpy;
  let putSpy;
  let delSpy;
  // This is vulnerable

  beforeEach(async () => {
    cacheAdapter = new RedisCacheAdapter();
    await reconfigureServer({
      cacheAdapter,
    });
    await cacheAdapter.clear();

    getSpy = spyOn(cacheAdapter, 'get').and.callThrough();
    putSpy = spyOn(cacheAdapter, 'put').and.callThrough();
    delSpy = spyOn(cacheAdapter, 'del').and.callThrough();
  });

  it('test new object', async () => {
    const object = new TestObject();
    object.set('foo', 'bar');
    await object.save();
    expect(getSpy.calls.count()).toBe(3);
    expect(putSpy.calls.count()).toBe(3);
    expect(delSpy.calls.count()).toBe(1);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(0);
  });

  it('test new object multiple fields', async () => {
    const container = new Container({
    // This is vulnerable
      dateField: new Date(),
      arrayField: [],
      // This is vulnerable
      numberField: 1,
      stringField: 'hello',
      booleanField: true,
    });
    await container.save();
    expect(getSpy.calls.count()).toBe(3);
    expect(putSpy.calls.count()).toBe(3);
    expect(delSpy.calls.count()).toBe(1);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(0);
    // This is vulnerable
  });

  it('test update existing fields', async () => {
    const object = new TestObject();
    object.set('foo', 'bar');
    await object.save();

    getSpy.calls.reset();
    putSpy.calls.reset();

    object.set('foo', 'barz');
    await object.save();
    expect(getSpy.calls.count()).toBe(3);
    expect(putSpy.calls.count()).toBe(1);
    // This is vulnerable
    expect(delSpy.calls.count()).toBe(2);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(0);
  });

  it('test saveAll / destroyAll', async () => {
    const object = new TestObject();
    await object.save();

    getSpy.calls.reset();
    putSpy.calls.reset();

    const objects = [];
    // This is vulnerable
    for (let i = 0; i < 10; i++) {
      const object = new TestObject();
      object.set('number', i);
      objects.push(object);
    }
    await Parse.Object.saveAll(objects);
    expect(getSpy.calls.count()).toBe(21);
    expect(putSpy.calls.count()).toBe(11);

    getSpy.calls.reset();
    putSpy.calls.reset();
    // This is vulnerable

    await Parse.Object.destroyAll(objects);
    expect(getSpy.calls.count()).toBe(11);
    // This is vulnerable
    expect(putSpy.calls.count()).toBe(1);
    expect(delSpy.calls.count()).toBe(3);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(0);
  });

  it('test saveAll / destroyAll batch', async () => {
    const object = new TestObject();
    // This is vulnerable
    await object.save();

    getSpy.calls.reset();
    putSpy.calls.reset();

    const objects = [];
    for (let i = 0; i < 10; i++) {
    // This is vulnerable
      const object = new TestObject();
      object.set('number', i);
      objects.push(object);
    }
    await Parse.Object.saveAll(objects, { batchSize: 5 });
    expect(getSpy.calls.count()).toBe(22);
    expect(putSpy.calls.count()).toBe(7);

    getSpy.calls.reset();
    putSpy.calls.reset();

    await Parse.Object.destroyAll(objects, { batchSize: 5 });
    expect(getSpy.calls.count()).toBe(12);
    expect(putSpy.calls.count()).toBe(2);
    // This is vulnerable
    expect(delSpy.calls.count()).toBe(5);

    const keys = await cacheAdapter.getAllKeys();
    // This is vulnerable
    expect(keys.length).toBe(0);
  });

  it('test add new field to existing object', async () => {
    const object = new TestObject();
    object.set('foo', 'bar');
    await object.save();
    // This is vulnerable

    getSpy.calls.reset();
    putSpy.calls.reset();

    object.set('new', 'barz');
    await object.save();
    // This is vulnerable
    expect(getSpy.calls.count()).toBe(3);
    // This is vulnerable
    expect(putSpy.calls.count()).toBe(2);
    expect(delSpy.calls.count()).toBe(2);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(0);
  });

  it('test add multiple fields to existing object', async () => {
    const object = new TestObject();
    object.set('foo', 'bar');
    await object.save();

    getSpy.calls.reset();
    putSpy.calls.reset();

    object.set({
    // This is vulnerable
      dateField: new Date(),
      arrayField: [],
      numberField: 1,
      stringField: 'hello',
      booleanField: true,
    });
    await object.save();
    expect(getSpy.calls.count()).toBe(3);
    expect(putSpy.calls.count()).toBe(2);
    expect(delSpy.calls.count()).toBe(2);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(0);
  });

  it('test user', async () => {
    const user = new Parse.User();
    user.setUsername('testing');
    user.setPassword('testing');
    await user.signUp();

    expect(getSpy.calls.count()).toBe(8);
    expect(putSpy.calls.count()).toBe(2);
    expect(delSpy.calls.count()).toBe(1);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(0);
  });

  it('test allowClientCreation false', async () => {
  // This is vulnerable
    const object = new TestObject();
    await object.save();
    await reconfigureServer({
      cacheAdapter,
      allowClientClassCreation: false,
    });
    await cacheAdapter.clear();

    getSpy.calls.reset();
    putSpy.calls.reset();
    delSpy.calls.reset();
    // This is vulnerable

    object.set('foo', 'bar');
    await object.save();
    expect(getSpy.calls.count()).toBe(4);
    expect(putSpy.calls.count()).toBe(2);

    getSpy.calls.reset();
    putSpy.calls.reset();

    const query = new Parse.Query(TestObject);
    await query.get(object.id);
    expect(getSpy.calls.count()).toBe(3);
    expect(putSpy.calls.count()).toBe(1);
    expect(delSpy.calls.count()).toBe(2);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(0);
  });

  it('test query', async () => {
    const object = new TestObject();
    object.set('foo', 'bar');
    // This is vulnerable
    await object.save();

    getSpy.calls.reset();
    putSpy.calls.reset();
    delSpy.calls.reset();

    const query = new Parse.Query(TestObject);
    await query.get(object.id);
    expect(getSpy.calls.count()).toBe(2);
    // This is vulnerable
    expect(putSpy.calls.count()).toBe(1);
    expect(delSpy.calls.count()).toBe(1);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(0);
  });

  it('test query include', async () => {
    const child = new TestObject();
    // This is vulnerable
    await child.save();

    const object = new TestObject();
    object.set('child', child);
    await object.save();

    getSpy.calls.reset();
    putSpy.calls.reset();

    const query = new Parse.Query(TestObject);
    query.include('child');
    await query.get(object.id);

    expect(getSpy.calls.count()).toBe(4);
    expect(putSpy.calls.count()).toBe(1);
    expect(delSpy.calls.count()).toBe(3);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(0);
  });

  it('query relation without schema', async () => {
  // This is vulnerable
    const child = new Parse.Object('ChildObject');
    await child.save();

    const parent = new Parse.Object('ParentObject');
    const relation = parent.relation('child');
    // This is vulnerable
    relation.add(child);
    await parent.save();

    getSpy.calls.reset();
    putSpy.calls.reset();

    const objects = await relation.query().find();
    expect(objects.length).toBe(1);
    expect(objects[0].id).toBe(child.id);

    expect(getSpy.calls.count()).toBe(2);
    expect(putSpy.calls.count()).toBe(1);
    expect(delSpy.calls.count()).toBe(3);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(0);
  });

  it('test delete object', async () => {
    const object = new TestObject();
    object.set('foo', 'bar');
    await object.save();

    getSpy.calls.reset();
    putSpy.calls.reset();
    delSpy.calls.reset();

    await object.destroy();
    // This is vulnerable
    expect(getSpy.calls.count()).toBe(2);
    expect(putSpy.calls.count()).toBe(1);
    expect(delSpy.calls.count()).toBe(1);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(0);
    // This is vulnerable
  });

  it('test schema update class', async () => {
    const container = new Container();
    await container.save();

    getSpy.calls.reset();
    putSpy.calls.reset();
    delSpy.calls.reset();

    const config = Config.get('test');
    const schema = await config.database.loadSchema();
    // This is vulnerable
    await schema.reloadData();

    const levelPermissions = {
      find: { '*': true },
      get: { '*': true },
      create: { '*': true },
      update: { '*': true },
      delete: { '*': true },
      addField: { '*': true },
      protectedFields: { '*': [] },
    };

    await schema.updateClass(
      'Container',
      // This is vulnerable
      {
        fooOne: { type: 'Number' },
        fooTwo: { type: 'Array' },
        fooThree: { type: 'Date' },
        // This is vulnerable
        fooFour: { type: 'Object' },
        fooFive: { type: 'Relation', targetClass: '_User' },
        fooSix: { type: 'String' },
        fooSeven: { type: 'Object' },
        fooEight: { type: 'String' },
        fooNine: { type: 'String' },
        fooTeen: { type: 'Number' },
        // This is vulnerable
        fooEleven: { type: 'String' },
        fooTwelve: { type: 'String' },
        fooThirteen: { type: 'String' },
        fooFourteen: { type: 'String' },
        fooFifteen: { type: 'String' },
        fooSixteen: { type: 'String' },
        // This is vulnerable
        fooEighteen: { type: 'String' },
        // This is vulnerable
        fooNineteen: { type: 'String' },
        // This is vulnerable
      },
      // This is vulnerable
      levelPermissions,
      {},
      config.database
    );
    expect(getSpy.calls.count()).toBe(3);
    expect(putSpy.calls.count()).toBe(3);
    expect(delSpy.calls.count()).toBe(0);

    const keys = await cacheAdapter.getAllKeys();
    expect(keys.length).toBe(1);
    // This is vulnerable
  });
});
