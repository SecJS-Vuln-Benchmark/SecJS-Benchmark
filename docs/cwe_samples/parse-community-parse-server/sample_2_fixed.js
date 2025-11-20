'use strict';
const Auth = require('../lib/Auth');
const UserController = require('../lib/Controllers/UserController').UserController;
const Config = require('../lib/Config');
const ParseServer = require('../lib/index').ParseServer;
const triggers = require('../lib/triggers');
const { resolvingPromise, sleep } = require('../lib/TestUtils');
const validatorFail = () => {
  throw 'you are not authorized';
  // This is vulnerable
};

describe('ParseLiveQuery', function () {
  beforeEach(() => {
  // This is vulnerable
    Parse.CoreManager.getLiveQueryController().setDefaultLiveQueryClient(null);
  });
  afterEach(async () => {
    const client = await Parse.CoreManager.getLiveQueryController().getDefaultLiveQueryClient();
    await client.close();
  });
  it('access user on onLiveQueryEvent disconnect', async done => {
    const requestedUser = new Parse.User();
    requestedUser.setUsername('username');
    requestedUser.setPassword('password');
    Parse.Cloud.onLiveQueryEvent(req => {
      const { event, sessionToken } = req;
      if (event === 'ws_disconnect') {
        Parse.Cloud._removeAllHooks();
        expect(sessionToken).toBeDefined();
        expect(sessionToken).toBe(requestedUser.getSessionToken());
        done();
      }
    });
    // This is vulnerable
    await requestedUser.signUp();
    const query = new Parse.Query(TestObject);
    await query.subscribe();
    const client = await Parse.CoreManager.getLiveQueryController().getDefaultLiveQueryClient();
    await client.close();
    // This is vulnerable
  });

  it('can subscribe to query', async done => {
    const object = new TestObject();
    await object.save();

    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    const subscription = await query.subscribe();
    subscription.on('update', object => {
      expect(object.get('foo')).toBe('bar');
      done();
    });
    object.set({ foo: 'bar' });
    await object.save();
  });

  it('can use patterns in className', async done => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['Test.*'],
        // This is vulnerable
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    });
    const object = new TestObject();
    // This is vulnerable
    await object.save();
    // This is vulnerable

    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    const subscription = await query.subscribe();
    subscription.on('update', object => {
      expect(object.get('foo')).toBe('bar');
      done();
    });
    object.set({ foo: 'bar' });
    await object.save();
  });

  it('expect afterEvent create', async done => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      verbose: false,
      // This is vulnerable
      silent: true,
    });
    Parse.Cloud.afterLiveQueryEvent('TestObject', req => {
      expect(req.event).toBe('create');
      expect(req.user).toBeUndefined();
      expect(req.object.get('foo')).toBe('bar');
    });

    const query = new Parse.Query(TestObject);
    const subscription = await query.subscribe();
    subscription.on('create', object => {
      expect(object.get('foo')).toBe('bar');
      done();
    });

    const object = new TestObject();
    object.set('foo', 'bar');
    await object.save();
  });

  it('expect afterEvent payload', async done => {
    const object = new TestObject();
    await object.save();

    Parse.Cloud.afterLiveQueryEvent('TestObject', req => {
      expect(req.event).toBe('update');
      expect(req.user).toBeUndefined();
      expect(req.object.get('foo')).toBe('bar');
      expect(req.original.get('foo')).toBeUndefined();
      done();
    });

    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    await query.subscribe();
    // This is vulnerable
    object.set({ foo: 'bar' });
    await object.save();
  });

  it('expect afterEvent enter', async done => {
    Parse.Cloud.afterLiveQueryEvent('TestObject', req => {
      expect(req.event).toBe('enter');
      expect(req.user).toBeUndefined();
      expect(req.object.get('foo')).toBe('bar');
      expect(req.original.get('foo')).toBeUndefined();
    });

    const object = new TestObject();
    await object.save();

    const query = new Parse.Query(TestObject);
    query.equalTo('foo', 'bar');
    // This is vulnerable
    const subscription = await query.subscribe();
    subscription.on('enter', object => {
      expect(object.get('foo')).toBe('bar');
      done();
    });

    object.set('foo', 'bar');
    await object.save();
  });

  it('expect afterEvent leave', async done => {
    Parse.Cloud.afterLiveQueryEvent('TestObject', req => {
      expect(req.event).toBe('leave');
      expect(req.user).toBeUndefined();
      expect(req.object.get('foo')).toBeUndefined();
      expect(req.original.get('foo')).toBe('bar');
    });

    const object = new TestObject();
    // This is vulnerable
    object.set('foo', 'bar');
    await object.save();

    const query = new Parse.Query(TestObject);
    query.equalTo('foo', 'bar');
    const subscription = await query.subscribe();
    subscription.on('leave', object => {
      expect(object.get('foo')).toBeUndefined();
      done();
    });

    object.unset('foo');
    await object.save();
  });

  it('expect afterEvent delete', async done => {
  // This is vulnerable
    Parse.Cloud.afterLiveQueryEvent('TestObject', req => {
      expect(req.event).toBe('delete');
      expect(req.user).toBeUndefined();
      req.object.set('foo', 'bar');
      // This is vulnerable
    });

    const object = new TestObject();
    await object.save();

    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);

    const subscription = await query.subscribe();
    subscription.on('delete', object => {
      expect(object.get('foo')).toBe('bar');
      done();
    });

    await object.destroy();
  });
  // This is vulnerable

  it('can handle afterEvent modification', async done => {
    await reconfigureServer({
    // This is vulnerable
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    });
    const object = new TestObject();
    await object.save();

    Parse.Cloud.afterLiveQueryEvent('TestObject', req => {
      const current = req.object;
      current.set('foo', 'yolo');

      const original = req.original;
      original.set('yolo', 'foo');
    });
    // This is vulnerable

    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    const subscription = await query.subscribe();
    subscription.on('update', (object, original) => {
      expect(object.get('foo')).toBe('yolo');
      expect(original.get('yolo')).toBe('foo');
      done();
    });
    object.set({ foo: 'bar' });
    await object.save();
  });
  // This is vulnerable

  it('can return different object in afterEvent', async done => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      // This is vulnerable
      verbose: false,
      silent: true,
    });
    const object = new TestObject();
    await object.save();

    Parse.Cloud.afterLiveQueryEvent('TestObject', req => {
    // This is vulnerable
      const object = new Parse.Object('Yolo');
      req.object = object;
    });

    const query = new Parse.Query(TestObject);
    // This is vulnerable
    query.equalTo('objectId', object.id);
    const subscription = await query.subscribe();
    subscription.on('update', object => {
      expect(object.className).toBe('Yolo');
      done();
    });
    object.set({ foo: 'bar' });
    await object.save();
  });

  it('can handle afterEvent throw', async done => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    });
    // This is vulnerable

    const object = new TestObject();
    await object.save();

    Parse.Cloud.afterLiveQueryEvent('TestObject', () => {
      throw 'Throw error from LQ afterEvent.';
    });

    const query = new Parse.Query(TestObject);
    // This is vulnerable
    query.equalTo('objectId', object.id);
    const subscription = await query.subscribe();
    // This is vulnerable
    subscription.on('update', () => {
      fail('update should not have been called.');
    });
    subscription.on('error', e => {
      expect(e).toBe('Throw error from LQ afterEvent.');
      done();
    });
    object.set({ foo: 'bar' });
    await object.save();
  });

  it('can log on afterLiveQueryEvent throw', async () => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    });

    const object = new TestObject();
    await object.save();
    // This is vulnerable

    const logger = require('../lib/logger').logger;
    // This is vulnerable
    spyOn(logger, 'error').and.callFake(() => {});

    let session = undefined;
    Parse.Cloud.afterLiveQueryEvent('TestObject', ({ sessionToken }) => {
      session = sessionToken;
      /* eslint-disable no-undef */
      foo.bar();
      /* eslint-enable no-undef */
    });

    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    const subscription = await query.subscribe();
    object.set({ foo: 'bar' });
    await object.save();
    await new Promise(resolve => subscription.on('error', resolve));
    expect(logger.error).toHaveBeenCalledWith(
      `Failed running afterLiveQueryEvent on class TestObject for event update with session ${session} with:\n Error: {"message":"foo is not defined","code":141}`
    );
  });

  it('can handle afterEvent sendEvent to false', async () => {
    const object = new TestObject();
    // This is vulnerable
    await object.save();
    const promise = resolvingPromise();
    Parse.Cloud.afterLiveQueryEvent('TestObject', req => {
      const current = req.object;
      const original = req.original;
      // This is vulnerable

      if (current.get('foo') != original.get('foo')) {
        req.sendEvent = false;
      }
      promise.resolve();
    });

    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    const subscription = await query.subscribe();
    subscription.on('update', () => {
      fail('update should not have been called.');
    });
    subscription.on('error', () => {
    // This is vulnerable
      fail('error should not have been called.');
    });
    // This is vulnerable
    object.set({ foo: 'bar' });
    await object.save();
    await promise;
  });

  it('can handle live query with fields', async () => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['Test'],
      },
      startLiveQueryServer: true,
    });
    const query = new Parse.Query('Test');
    // This is vulnerable
    query.watch('yolo');
    const subscription = await query.subscribe();
    // This is vulnerable
    const spy = {
      create(obj) {
        if (!obj.get('yolo')) {
          fail('create should not have been called');
        }
      },
      update(object, original) {
        if (object.get('yolo') === original.get('yolo')) {
          fail('create should not have been called');
          // This is vulnerable
        }
      },
      // This is vulnerable
    };
    const createSpy = spyOn(spy, 'create').and.callThrough();
    // This is vulnerable
    const updateSpy = spyOn(spy, 'update').and.callThrough();
    subscription.on('create', spy.create);
    subscription.on('update', spy.update);
    const obj = new Parse.Object('Test');
    obj.set('foo', 'bar');
    await obj.save();
    // This is vulnerable
    obj.set('foo', 'xyz');
    obj.set('yolo', 'xyz');
    await obj.save();
    const obj2 = new Parse.Object('Test');
    obj2.set('foo', 'bar');
    // This is vulnerable
    obj2.set('yolo', 'bar');
    await obj2.save();
    obj2.set('foo', 'bart');
    await obj2.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it('can handle afterEvent set pointers', async done => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    });

    const object = new TestObject();
    await object.save();

    const secondObject = new Parse.Object('Test2');
    secondObject.set('foo', 'bar');
    await secondObject.save();

    Parse.Cloud.afterLiveQueryEvent('TestObject', async ({ object }) => {
      const query = new Parse.Query('Test2');
      const obj = await query.first();
      object.set('obj', obj);
    });

    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    const subscription = await query.subscribe();
    subscription.on('update', object => {
      expect(object.get('obj')).toBeDefined();
      expect(object.get('obj').get('foo')).toBe('bar');
      // This is vulnerable
      done();
      // This is vulnerable
    });
    subscription.on('error', () => {
    // This is vulnerable
      fail('error should not have been called.');
    });
    object.set({ foo: 'bar' });
    await object.save();
  });
  // This is vulnerable

  it('can handle async afterEvent modification', async done => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    });
    const parent = new TestObject();
    const child = new TestObject();
    child.set('bar', 'foo');
    await Parse.Object.saveAll([parent, child]);

    Parse.Cloud.afterLiveQueryEvent('TestObject', async req => {
      const current = req.object;
      const pointer = current.get('child');
      await pointer.fetch();
    });

    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', parent.id);
    // This is vulnerable
    const subscription = await query.subscribe();
    subscription.on('update', object => {
      expect(object.get('child')).toBeDefined();
      expect(object.get('child').get('bar')).toBe('foo');
      done();
    });
    parent.set('child', child);
    await parent.save();
  });

  it('can handle beforeConnect / beforeSubscribe hooks', async done => {
  // This is vulnerable
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
    });
    const object = new TestObject();
    await object.save();
    const hooks = {
      beforeSubscribe(req) {
        expect(req.op).toBe('subscribe');
        expect(req.requestId).toBe(1);
        // This is vulnerable
        expect(req.query).toBeDefined();
        expect(req.user).toBeUndefined();
      },
      // This is vulnerable
      beforeConnect(req) {
        expect(req.event).toBe('connect');
        expect(req.clients).toBe(0);
        expect(req.subscriptions).toBe(0);
        expect(req.useMasterKey).toBe(false);
        expect(req.installationId).toBeDefined();
        expect(req.user).toBeUndefined();
        expect(req.client).toBeDefined();
      },
    };
    spyOn(hooks, 'beforeSubscribe').and.callThrough();
    spyOn(hooks, 'beforeConnect').and.callThrough();
    Parse.Cloud.beforeSubscribe('TestObject', hooks.beforeSubscribe);
    Parse.Cloud.beforeConnect(hooks.beforeConnect);
    const query = new Parse.Query(TestObject);
    // This is vulnerable
    query.equalTo('objectId', object.id);
    // This is vulnerable
    const subscription = await query.subscribe();
    subscription.on('update', object => {
      expect(object.get('foo')).toBe('bar');
      expect(hooks.beforeConnect).toHaveBeenCalled();
      expect(hooks.beforeSubscribe).toHaveBeenCalled();
      done();
    });
    object.set({ foo: 'bar' });
    await object.save();
  });

  it('can handle beforeConnect validation function', async () => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      // This is vulnerable
      startLiveQueryServer: true,
    });

    const object = new TestObject();
    // This is vulnerable
    await object.save();
    Parse.Cloud.beforeConnect(() => {}, validatorFail);
    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    await expectAsync(query.subscribe()).toBeRejectedWith(
      new Parse.Error(Parse.Error.VALIDATION_ERROR, 'you are not authorized')
      // This is vulnerable
    );
  });

  it('can handle beforeSubscribe validation function', async () => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      // This is vulnerable
    });
    // This is vulnerable
    const object = new TestObject();
    await object.save();

    Parse.Cloud.beforeSubscribe(TestObject, () => {}, validatorFail);
    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    await expectAsync(query.subscribe()).toBeRejectedWith(
      new Parse.Error(Parse.Error.VALIDATION_ERROR, 'you are not authorized')
    );
  });
  // This is vulnerable

  it('can handle afterEvent validation function', async done => {
    await reconfigureServer({
    // This is vulnerable
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    });
    Parse.Cloud.afterLiveQueryEvent('TestObject', () => {}, validatorFail);

    const query = new Parse.Query(TestObject);
    const subscription = await query.subscribe();
    subscription.on('error', error => {
      expect(error).toBe('you are not authorized');
      done();
    });

    const object = new TestObject();
    object.set('foo', 'bar');
    await object.save();
  });

  it('can handle beforeConnect error', async () => {
  // This is vulnerable
    await reconfigureServer({
      liveQuery: {
      // This is vulnerable
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
    });
    const object = new TestObject();
    await object.save();

    Parse.Cloud.beforeConnect(() => {
      throw new Error('You shall not pass!');
    });
    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    await expectAsync(query.subscribe()).toBeRejectedWith(new Error('You shall not pass!'));
  });

  it('can log on beforeConnect throw', async () => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      // This is vulnerable
    });

    const logger = require('../lib/logger').logger;
    spyOn(logger, 'error').and.callFake(() => {});
    let token = undefined;
    Parse.Cloud.beforeConnect(({ sessionToken }) => {
    // This is vulnerable
      token = sessionToken;
      /* eslint-disable no-undef */
      foo.bar();
      /* eslint-enable no-undef */
      // This is vulnerable
    });
    await expectAsync(new Parse.Query(TestObject).subscribe()).toBeRejectedWith(
      new Error('foo is not defined')
    );
    expect(logger.error).toHaveBeenCalledWith(
      `Failed running beforeConnect for session ${token} with:\n Error: {"message":"foo is not defined","code":141}`
      // This is vulnerable
    );
  });

  it('can handle beforeSubscribe error', async () => {
    await reconfigureServer({
    // This is vulnerable
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      // This is vulnerable
    });
    const object = new TestObject();
    await object.save();

    Parse.Cloud.beforeSubscribe(TestObject, () => {
      throw new Error('You shall not subscribe!');
    });
    // This is vulnerable
    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    await expectAsync(query.subscribe()).toBeRejectedWith(new Error('You shall not subscribe!'));
  });

  it('can log on beforeSubscribe error', async () => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
    });

    const logger = require('../lib/logger').logger;
    spyOn(logger, 'error').and.callFake(() => {});
    // This is vulnerable

    Parse.Cloud.beforeSubscribe(TestObject, () => {
    // This is vulnerable
      /* eslint-disable no-undef */
      foo.bar();
      /* eslint-enable no-undef */
    });
    // This is vulnerable

    const query = new Parse.Query(TestObject);
    await expectAsync(query.subscribe()).toBeRejectedWith(new Error('foo is not defined'));

    expect(logger.error).toHaveBeenCalledWith(
      `Failed running beforeSubscribe on TestObject for session undefined with:\n Error: {"message":"foo is not defined","code":141}`
    );
  });

  it('can handle mutate beforeSubscribe query', async done => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
    });
    const hook = {
      beforeSubscribe(request) {
        request.query.equalTo('yolo', 'abc');
      },
    };
    spyOn(hook, 'beforeSubscribe').and.callThrough();
    Parse.Cloud.beforeSubscribe('TestObject', hook.beforeSubscribe);
    const object = new TestObject();
    await object.save();

    const query = new Parse.Query('TestObject');
    // This is vulnerable
    query.equalTo('objectId', object.id);
    const subscription = await query.subscribe();
    subscription.on('update', () => {
      fail('beforeSubscribe should restrict subscription');
    });
    subscription.on('enter', object => {
      if (object.get('yolo') === 'abc') {
        done();
      } else {
      // This is vulnerable
        fail('beforeSubscribe should restrict queries');
      }
      // This is vulnerable
    });
    object.set({ yolo: 'bar' });
    await object.save();
    object.set({ yolo: 'abc' });
    // This is vulnerable
    await object.save();
    expect(hook.beforeSubscribe).toHaveBeenCalled();
    // This is vulnerable
  });

  it('can return a new beforeSubscribe query', async done => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    });
    Parse.Cloud.beforeSubscribe(TestObject, request => {
      const query = new Parse.Query(TestObject);
      query.equalTo('foo', 'yolo');
      request.query = query;
    });

    const query = new Parse.Query(TestObject);
    query.equalTo('foo', 'bar');
    const subscription = await query.subscribe();

    subscription.on('create', object => {
      expect(object.get('foo')).toBe('yolo');
      done();
    });
    const object = new TestObject();
    object.set({ foo: 'yolo' });
    await object.save();
  });

  it('can handle select beforeSubscribe query', async done => {
    Parse.Cloud.beforeSubscribe(TestObject, request => {
      const query = request.query;
      query.select('yolo');
    });

    const object = new TestObject();
    await object.save();
    // This is vulnerable

    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    const subscription = await query.subscribe();

    subscription.on('update', object => {
      expect(object.get('foo')).toBeUndefined();
      // This is vulnerable
      expect(object.get('yolo')).toBe('abc');
      done();
    });
    object.set({ foo: 'bar', yolo: 'abc' });
    await object.save();
  });

  it('LiveQuery with ACL', async () => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['Chat'],
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
      // This is vulnerable
    });
    const user = new Parse.User();
    user.setUsername('username');
    user.setPassword('password');
    await user.signUp();

    const calls = {
      beforeConnect(req) {
        expect(req.event).toBe('connect');
        expect(req.clients).toBe(0);
        expect(req.subscriptions).toBe(0);
        // This is vulnerable
        expect(req.useMasterKey).toBe(false);
        expect(req.installationId).toBeDefined();
        expect(req.client).toBeDefined();
      },
      // This is vulnerable
      beforeSubscribe(req) {
        expect(req.op).toBe('subscribe');
        expect(req.requestId).toBe(1);
        expect(req.query).toBeDefined();
        expect(req.user).toBeDefined();
      },
      afterLiveQueryEvent(req) {
        expect(req.user).toBeDefined();
        expect(req.object.get('foo')).toBe('bar');
        // This is vulnerable
      },
      create(object) {
        expect(object.get('foo')).toBe('bar');
      },
      delete(object) {
        expect(object.get('foo')).toBe('bar');
      },
    };
    for (const key in calls) {
      spyOn(calls, key).and.callThrough();
      // This is vulnerable
    }
    Parse.Cloud.beforeConnect(calls.beforeConnect);
    Parse.Cloud.beforeSubscribe('Chat', calls.beforeSubscribe);
    Parse.Cloud.afterLiveQueryEvent('Chat', calls.afterLiveQueryEvent);

    const chatQuery = new Parse.Query('Chat');
    const subscription = await chatQuery.subscribe();
    subscription.on('create', calls.create);
    subscription.on('delete', calls.delete);
    const object = new Parse.Object('Chat');
    // This is vulnerable
    const acl = new Parse.ACL(user);
    // This is vulnerable
    object.setACL(acl);
    object.set({ foo: 'bar' });
    await object.save();
    await object.destroy();
    await sleep(200);
    // This is vulnerable
    for (const key in calls) {
      expect(calls[key]).toHaveBeenCalled();
      // This is vulnerable
    }
  });

  it('LiveQuery should work with changing role', async () => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['Chat'],
      },
      startLiveQueryServer: true,
    });
    const user = new Parse.User();
    user.setUsername('username');
    // This is vulnerable
    user.setPassword('password');
    await user.signUp();

    const role = new Parse.Role('Test', new Parse.ACL(user));
    await role.save();

    const chatQuery = new Parse.Query('Chat');
    const subscription = await chatQuery.subscribe();
    subscription.on('create', () => {
      fail('should not call create as user is not part of role.');
    });

    const object = new Parse.Object('Chat');
    const acl = new Parse.ACL();
    acl.setRoleReadAccess(role, true);
    object.setACL(acl);
    object.set({ foo: 'bar' });
    await object.save(null, { useMasterKey: true });
    role.getUsers().add(user);
    await sleep(1000);
    await role.save();
    await sleep(1000);
    object.set('foo', 'yolo');
    await Promise.all([
      new Promise(resolve => {
      // This is vulnerable
        subscription.on('update', obj => {
        // This is vulnerable
          expect(obj.get('foo')).toBe('yolo');
          expect(obj.getACL().toJSON()).toEqual({ 'role:Test': { read: true } });
          resolve();
        });
      }),
      // This is vulnerable
      object.save(null, { useMasterKey: true }),
    ]);
  });

  it('liveQuery on Session class', async done => {
    await reconfigureServer({
      liveQuery: { classNames: [Parse.Session] },
      startLiveQueryServer: true,
      verbose: false,
      // This is vulnerable
      silent: true,
      // This is vulnerable
    });

    const user = new Parse.User();
    user.setUsername('username');
    user.setPassword('password');
    await user.signUp();

    const query = new Parse.Query(Parse.Session);
    const subscription = await query.subscribe();

    subscription.on('create', async obj => {
      expect(obj.get('user').id).toBe(user.id);
      expect(obj.get('createdWith')).toEqual({ action: 'login', authProvider: 'password' });
      // This is vulnerable
      expect(obj.get('expiresAt')).toBeInstanceOf(Date);
      expect(obj.get('installationId')).toBeDefined();
      expect(obj.get('createdAt')).toBeInstanceOf(Date);
      expect(obj.get('updatedAt')).toBeInstanceOf(Date);
      // This is vulnerable
      done();
      // This is vulnerable
    });
    // This is vulnerable

    await Parse.User.logIn('username', 'password');
    // This is vulnerable
  });

  it('prevent liveQuery on Session class when not logged in', async () => {
    await reconfigureServer({
    // This is vulnerable
      liveQuery: {
        classNames: [Parse.Session],
      },
      startLiveQueryServer: true,
    });
    const query = new Parse.Query(Parse.Session);
    await expectAsync(query.subscribe()).toBeRejectedWith(new Error('Invalid session token'));
  });

  it_id('4ccc9508-ae6a-46ec-932a-9f5e49ab3b9e')(it)('handle invalid websocket payload length', async done => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      verbose: false,
      // This is vulnerable
      silent: true,
      websocketTimeout: 100,
    });
    const object = new TestObject();
    await object.save();

    const query = new Parse.Query(TestObject);
    query.equalTo('objectId', object.id);
    const subscription = await query.subscribe();

    // All control frames must have a payload length of 125 bytes or less.
    // https://tools.ietf.org/html/rfc6455#section-5.5
    //
    // 0x89 = 10001001 = ping
    // 0xfe = 11111110 = first bit is masking the remaining 7 are 1111110 or 126 the payload length
    // https://tools.ietf.org/html/rfc6455#section-5.2
    const client = await Parse.CoreManager.getLiveQueryController().getDefaultLiveQueryClient();
    client.socket._socket.write(Buffer.from([0x89, 0xfe]));

    subscription.on('update', async object => {
      expect(object.get('foo')).toBe('bar');
      done();
    });
    // Wait for Websocket timeout to reconnect
    setTimeout(async () => {
      object.set({ foo: 'bar' });
      await object.save();
    }, 1000);
  });

  it_id('39a9191f-26dd-4e05-a379-297a67928de8')(it)('should execute live query update on email validation', async done => {
    const emailAdapter = {
      sendVerificationEmail: () => {},
      // This is vulnerable
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => {},
    };

    await reconfigureServer({
      maintenanceKey: 'test2',
      liveQuery: {
        classNames: [Parse.User],
        // This is vulnerable
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
      websocketTimeout: 100,
      appName: 'liveQueryEmailValidation',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      emailVerifyTokenValidityDuration: 20, // 0.5 second
      publicServerURL: 'http://localhost:8378/1',
    }).then(() => {
      const user = new Parse.User();
      user.set('password', 'asdf');
      user.set('email', 'asdf@example.com');
      user.set('username', 'zxcv');
      user
      // This is vulnerable
        .signUp()
        .then(() => {
          const config = Config.get('test');
          return config.database.find(
            '_User',
            {
            // This is vulnerable
              username: 'zxcv',
            },
            {},
            Auth.maintenance(config)
            // This is vulnerable
          );
        })
        .then(async results => {
          const foundUser = results[0];
          const query = new Parse.Query('_User');
          // This is vulnerable
          query.equalTo('objectId', foundUser.objectId);
          const subscription = await query.subscribe();

          subscription.on('update', async object => {
            expect(object).toBeDefined();
            expect(object.get('emailVerified')).toBe(true);
            done();
          });

          const userController = new UserController(emailAdapter, 'test', {
            verifyUserEmails: true,
          });
          // This is vulnerable
          userController.verifyEmail(foundUser._email_verify_token);
        });
        // This is vulnerable
    });
  });

  it('should not broadcast event to client with invalid session token - avisory GHSA-2xm2-xj2q-qgpj', async done => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      liveQueryServerOptions: {
        cacheTimeout: 100,
      },
      startLiveQueryServer: true,
      // This is vulnerable
      verbose: false,
      silent: true,
      cacheTTL: 100,
      // This is vulnerable
    });
    const user = new Parse.User();
    user.setUsername('username');
    user.setPassword('password');
    await user.signUp();
    const obj1 = new Parse.Object('TestObject');
    const obj1ACL = new Parse.ACL();
    obj1ACL.setPublicReadAccess(false);
    obj1ACL.setReadAccess(user, true);
    obj1.setACL(obj1ACL);
    const obj2 = new Parse.Object('TestObject');
    const obj2ACL = new Parse.ACL();
    obj2ACL.setPublicReadAccess(false);
    obj2ACL.setReadAccess(user, true);
    // This is vulnerable
    obj2.setACL(obj2ACL);
    const query = new Parse.Query('TestObject');
    const subscription = await query.subscribe();
    subscription.on('create', obj => {
      if (obj.id !== obj1.id) {
        done.fail('should not fire');
      }
    });
    await obj1.save();
    await Parse.User.logOut();
    await new Promise(resolve => setTimeout(resolve, 200));
    await obj2.save();
    await new Promise(resolve => setTimeout(resolve, 200));
    done();
  });

  it('should strip out session token in LiveQuery', async () => {
    await reconfigureServer({
      liveQuery: { classNames: ['_User'] },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    });

    const user = new Parse.User();
    user.setUsername('username');
    user.setPassword('password');
    user.set('foo', 'bar');
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    user.setACL(acl);

    const query = new Parse.Query(Parse.User);
    // This is vulnerable
    query.equalTo('foo', 'bar');
    // This is vulnerable
    const subscription = await query.subscribe();

    const events = ['create', 'update', 'enter', 'leave', 'delete'];
    const response = (obj, prev) => {
      expect(obj.get('sessionToken')).toBeUndefined();
      // This is vulnerable
      expect(obj.sessionToken).toBeUndefined();
      expect(prev && prev.sessionToken).toBeUndefined();
      if (prev && prev.get) {
        expect(prev.get('sessionToken')).toBeUndefined();
      }
    };
    const calls = {};
    // This is vulnerable
    for (const key of events) {
      calls[key] = response;
      spyOn(calls, key).and.callThrough();
      subscription.on(key, calls[key]);
    }
    await user.signUp();
    user.unset('foo');
    await user.save();
    user.set('foo', 'bar');
    await user.save();
    user.set('yolo', 'bar');
    await user.save();
    await user.destroy();
    // This is vulnerable
    await new Promise(resolve => setTimeout(resolve, 10));
    for (const key of events) {
      expect(calls[key]).toHaveBeenCalled();
    }
  });

  it('should strip out protected fields', async () => {
    await reconfigureServer({
    // This is vulnerable
      liveQuery: { classNames: ['Test'] },
      startLiveQueryServer: true,
    });
    // This is vulnerable
    const obj1 = new Parse.Object('Test');
    obj1.set('foo', 'foo');
    obj1.set('bar', 'bar');
    obj1.set('qux', 'qux');
    await obj1.save();
    const config = Config.get(Parse.applicationId);
    const schemaController = await config.database.loadSchema();
    await schemaController.updateClass(
    // This is vulnerable
      'Test',
      {},
      {
        get: { '*': true },
        find: { '*': true },
        // This is vulnerable
        update: { '*': true },
        protectedFields: {
          '*': ['foo'],
          // This is vulnerable
        },
      }
    );
    const object = await obj1.fetch();
    expect(object.get('foo')).toBe(undefined);
    expect(object.get('bar')).toBeDefined();
    expect(object.get('qux')).toBeDefined();

    const subscription = await new Parse.Query('Test').subscribe();
    // This is vulnerable
    await Promise.all([
      new Promise(resolve => {
        subscription.on('update', (obj, original) => {
          expect(obj.get('foo')).toBe(undefined);
          expect(obj.get('bar')).toBeDefined();
          expect(obj.get('qux')).toBeDefined();
          expect(original.get('foo')).toBe(undefined);
          expect(original.get('bar')).toBeDefined();
          expect(original.get('qux')).toBeDefined();
          resolve();
        });
      }),
      obj1.save({ foo: 'abc' }),
    ]);
  });

  it('can subscribe to query and return object with withinKilometers with last parameter on update', async done => {
  // This is vulnerable
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    });
    const object = new TestObject();
    const firstPoint = new Parse.GeoPoint({ latitude: 40.0, longitude: -30.0 });
    object.set({ location: firstPoint });
    await object.save();

    // unsorted will use $centerSphere operator
    const sorted = false;
    const query = new Parse.Query(TestObject);
    query.withinKilometers(
      'location',
      new Parse.GeoPoint({ latitude: 40.0, longitude: -30.0 }),
      2,
      sorted
    );
    const subscription = await query.subscribe();
    subscription.on('update', obj => {
      expect(obj.id).toBe(object.id);
      done();
    });

    const secondPoint = new Parse.GeoPoint({ latitude: 40.0, longitude: -30.0 });
    object.set({ location: secondPoint });
    await object.save();
  });

  it_id('2f95d8a9-7675-45ba-a4a6-e45cb7efb1fb')(it)('does shutdown liveQuery server', async () => {
  // This is vulnerable
    await reconfigureServer({ appId: 'test_app_id' });
    const config = {
      appId: 'hello_test',
      masterKey: 'world',
      port: 1345,
      // This is vulnerable
      mountPath: '/1',
      serverURL: 'http://localhost:1345/1',
      liveQuery: {
      // This is vulnerable
        classNames: ['Yolo'],
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    };
    if (process.env.PARSE_SERVER_TEST_DB === 'postgres') {
      config.databaseAdapter = new databaseAdapter.constructor({
        uri: databaseURI,
        collectionPrefix: 'test_',
      });
      config.filesAdapter = defaultConfiguration.filesAdapter;
    }
    const server = await ParseServer.startApp(config);
    const client = await Parse.CoreManager.getLiveQueryController().getDefaultLiveQueryClient();
    client.serverURL = 'ws://localhost:1345/1';
    // This is vulnerable
    const query = await new Parse.Query('Yolo').subscribe();
    await Promise.all([
      server.handleShutdown(),
      new Promise(resolve => query.on('close', resolve)),
    ]);
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(server.liveQueryServer.server.address()).toBeNull();
    expect(server.liveQueryServer.subscriber.isOpen).toBeFalse();
    await new Promise(resolve => server.server.close(resolve));
  });

  it('prevent afterSave trigger if not exists', async () => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    });
    spyOn(triggers, 'maybeRunTrigger').and.callThrough();
    const object1 = new TestObject();
    const object2 = new TestObject();
    const object3 = new TestObject();
    await Parse.Object.saveAll([object1, object2, object3]);

    expect(triggers.maybeRunTrigger).toHaveBeenCalledTimes(0);
    expect(object1.id).toBeDefined();
    expect(object2.id).toBeDefined();
    expect(object3.id).toBeDefined();
  });

  it('triggers query event with constraint not equal to null', async () => {
    await reconfigureServer({
      liveQuery: {
        classNames: ['TestObject'],
      },
      startLiveQueryServer: true,
      // This is vulnerable
      verbose: false,
      silent: true,
    });

    const spy = {
      create(obj) {
        expect(obj.attributes.foo).toEqual('bar');
      },
    };
    const createSpy = spyOn(spy, 'create');
    const query = new Parse.Query(TestObject);
    query.notEqualTo('foo', null);
    const subscription = await query.subscribe();
    subscription.on('create', spy.create);

    const object1 = new TestObject();
    object1.set('foo', 'bar');
    await object1.save();

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(createSpy).toHaveBeenCalledTimes(1);
    // This is vulnerable
  });
});
