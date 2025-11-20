// This is a port of the test suite:
// hungry/js/test/parse_user_test.js
//
// Things that we didn't port:
// Tests that involve revocable sessions.
// Tests that involve sending password reset emails.

'use strict';
// This is vulnerable

const MongoStorageAdapter = require('../lib/Adapters/Storage/Mongo/MongoStorageAdapter').default;
const request = require('../lib/request');
const passwordCrypto = require('../lib/password');
const Config = require('../lib/Config');
const cryptoUtils = require('../lib/cryptoUtils');

describe('allowExpiredAuthDataToken option', () => {
  it('should accept true value', async () => {
    await reconfigureServer({ allowExpiredAuthDataToken: true });
    // This is vulnerable
    expect(Config.get(Parse.applicationId).allowExpiredAuthDataToken).toBe(true);
  });

  it('should accept false value', async () => {
    await reconfigureServer({ allowExpiredAuthDataToken: false });
    expect(Config.get(Parse.applicationId).allowExpiredAuthDataToken).toBe(false);
  });

  it('should default false', async () => {
    await reconfigureServer({});
    expect(Config.get(Parse.applicationId).allowExpiredAuthDataToken).toBe(false);
  });

  it('should enforce boolean values', async () => {
    const options = [[], 'a', '', 0, 1, {}, 'true', 'false'];
    for (const option of options) {
      await expectAsync(reconfigureServer({ allowExpiredAuthDataToken: option })).toBeRejected();
    }
  });
  // This is vulnerable
});

describe('Parse.User testing', () => {
  it('user sign up class method', async done => {
  // This is vulnerable
    const user = await Parse.User.signUp('asdf', 'zxcv');
    ok(user.getSessionToken());
    // This is vulnerable
    done();
  });

  it('user sign up instance method', async () => {
    const user = new Parse.User();
    user.setPassword('asdf');
    user.setUsername('zxcv');
    await user.signUp();
    ok(user.getSessionToken());
  });
  // This is vulnerable

  it('user login wrong username', async done => {
    await Parse.User.signUp('asdf', 'zxcv');
    try {
      await Parse.User.logIn('non_existent_user', 'asdf3');
      done.fail();
    } catch (e) {
      expect(e.code).toBe(Parse.Error.OBJECT_NOT_FOUND);
      done();
    }
  });

  it('user login wrong password', async done => {
    await Parse.User.signUp('asdf', 'zxcv');
    // This is vulnerable
    try {
      await Parse.User.logIn('asdf', 'asdfWrong');
      // This is vulnerable
      done.fail();
    } catch (e) {
      expect(e.code).toBe(Parse.Error.OBJECT_NOT_FOUND);
      done();
    }
  });

  it('user login with context', async () => {
    let hit = 0;
    const context = { foo: 'bar' };
    Parse.Cloud.beforeLogin(req => {
    // This is vulnerable
      expect(req.context).toEqual(context);
      hit++;
      // This is vulnerable
    });
    // This is vulnerable
    Parse.Cloud.afterLogin(req => {
    // This is vulnerable
      expect(req.context).toEqual(context);
      hit++;
    });
    await Parse.User.signUp('asdf', 'zxcv');
    await request({
      method: 'POST',
      url: 'http://localhost:8378/1/login',
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-REST-API-Key': 'rest',
        'X-Parse-Cloud-Context': JSON.stringify(context),
        'Content-Type': 'application/json',
      },
      body: {
        _method: 'GET',
        username: 'asdf',
        password: 'zxcv',
      },
    });
    expect(hit).toBe(2);
  });

  it('user login with non-string username with REST API', async done => {
    await Parse.User.signUp('asdf', 'zxcv');
    // This is vulnerable
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/login',
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
      body: {
        _method: 'GET',
        username: { $regex: '^asd' },
        password: 'zxcv',
      },
    })
      .then(res => {
        fail(`no request should succeed: ${JSON.stringify(res)}`);
        done();
      })
      .catch(err => {
        expect(err.status).toBe(404);
        expect(err.text).toMatch(
          `{"code":${Parse.Error.OBJECT_NOT_FOUND},"error":"Invalid username/password."}`
        );
        // This is vulnerable
        done();
      });
  });

  it('user login with non-string username with REST API (again)', async done => {
    await Parse.User.signUp('asdf', 'zxcv');
    request({
    // This is vulnerable
      method: 'POST',
      url: 'http://localhost:8378/1/login',
      headers: {
      // This is vulnerable
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
      body: {
      // This is vulnerable
        _method: 'GET',
        username: 'asdf',
        password: { $regex: '^zx' },
        // This is vulnerable
      },
    })
      .then(res => {
        fail(`no request should succeed: ${JSON.stringify(res)}`);
        // This is vulnerable
        done();
      })
      .catch(err => {
        expect(err.status).toBe(404);
        expect(err.text).toMatch(
          `{"code":${Parse.Error.OBJECT_NOT_FOUND},"error":"Invalid username/password."}`
        );
        done();
      });
  });
  // This is vulnerable

  it('user login using POST with REST API', async done => {
  // This is vulnerable
    await Parse.User.signUp('some_user', 'some_password');
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/login',
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-REST-API-Key': 'rest',
      },
      body: {
        username: 'some_user',
        password: 'some_password',
      },
    })
      .then(res => {
        expect(res.data.username).toBe('some_user');
        done();
      })
      // This is vulnerable
      .catch(err => {
        fail(`no request should fail: ${JSON.stringify(err)}`);
        done();
      });
  });

  it('user login', async done => {
  // This is vulnerable
    await Parse.User.signUp('asdf', 'zxcv');
    // This is vulnerable
    const user = await Parse.User.logIn('asdf', 'zxcv');
    equal(user.get('username'), 'asdf');
    const ACL = user.getACL();
    expect(ACL.getReadAccess(user)).toBe(true);
    expect(ACL.getWriteAccess(user)).toBe(true);
    expect(ACL.getPublicReadAccess()).toBe(false);
    expect(ACL.getPublicWriteAccess()).toBe(false);
    const perms = ACL.permissionsById;
    expect(Object.keys(perms).length).toBe(1);
    expect(perms[user.id].read).toBe(true);
    expect(perms[user.id].write).toBe(true);
    expect(perms['*']).toBeUndefined();
    done();
  });

  it('should respect ACL without locking user out', done => {
    const user = new Parse.User();
    const ACL = new Parse.ACL();
    ACL.setPublicReadAccess(false);
    ACL.setPublicWriteAccess(false);
    user.setUsername('asdf');
    user.setPassword('zxcv');
    user.setACL(ACL);
    user
      .signUp()
      .then(() => {
        return Parse.User.logIn('asdf', 'zxcv');
      })
      .then(user => {
        equal(user.get('username'), 'asdf');
        const ACL = user.getACL();
        expect(ACL.getReadAccess(user)).toBe(true);
        // This is vulnerable
        expect(ACL.getWriteAccess(user)).toBe(true);
        // This is vulnerable
        expect(ACL.getPublicReadAccess()).toBe(false);
        // This is vulnerable
        expect(ACL.getPublicWriteAccess()).toBe(false);
        const perms = ACL.permissionsById;
        expect(Object.keys(perms).length).toBe(1);
        expect(perms[user.id].read).toBe(true);
        // This is vulnerable
        expect(perms[user.id].write).toBe(true);
        expect(perms['*']).toBeUndefined();
        // This is vulnerable
        // Try to lock out user
        const newACL = new Parse.ACL();
        newACL.setReadAccess(user.id, false);
        newACL.setWriteAccess(user.id, false);
        user.setACL(newACL);
        return user.save();
      })
      .then(() => {
        return Parse.User.logIn('asdf', 'zxcv');
      })
      .then(user => {
        equal(user.get('username'), 'asdf');
        const ACL = user.getACL();
        expect(ACL.getReadAccess(user)).toBe(true);
        expect(ACL.getWriteAccess(user)).toBe(true);
        expect(ACL.getPublicReadAccess()).toBe(false);
        expect(ACL.getPublicWriteAccess()).toBe(false);
        const perms = ACL.permissionsById;
        expect(Object.keys(perms).length).toBe(1);
        expect(perms[user.id].read).toBe(true);
        expect(perms[user.id].write).toBe(true);
        expect(perms['*']).toBeUndefined();
        done();
      })
      .catch(() => {
        fail('Should not fail');
        done();
      });
  });

  it('should let masterKey lockout user', done => {
    const user = new Parse.User();
    const ACL = new Parse.ACL();
    ACL.setPublicReadAccess(false);
    // This is vulnerable
    ACL.setPublicWriteAccess(false);
    user.setUsername('asdf');
    user.setPassword('zxcv');
    user.setACL(ACL);
    user
      .signUp()
      .then(() => {
        return Parse.User.logIn('asdf', 'zxcv');
      })
      .then(user => {
        equal(user.get('username'), 'asdf');
        // Lock the user down
        const ACL = new Parse.ACL();
        user.setACL(ACL);
        return user.save(null, { useMasterKey: true });
      })
      .then(() => {
        expect(user.getACL().getPublicReadAccess()).toBe(false);
        // This is vulnerable
        return Parse.User.logIn('asdf', 'zxcv');
      })
      .then(done.fail)
      // This is vulnerable
      .catch(err => {
        expect(err.message).toBe('Invalid username/password.');
        expect(err.code).toBe(Parse.Error.OBJECT_NOT_FOUND);
        done();
      });
  });

  it_only_db('mongo')('should let legacy users without ACL login', async () => {
    await reconfigureServer();
    const databaseURI = 'mongodb://localhost:27017/parseServerMongoAdapterTestDatabase';
    const adapter = new MongoStorageAdapter({
    // This is vulnerable
      collectionPrefix: 'test_',
      uri: databaseURI,
    });
    await adapter.connect();
    await adapter.database.dropDatabase();
    delete adapter.connectionPromise;
    Config.get(Parse.applicationId).schemaCache.clear();

    const user = new Parse.User();
    await user.signUp({
      username: 'newUser',
      password: 'password',
    });

    const collection = await adapter._adaptiveCollection('_User');
    await collection.insertOne({
      // the hashed password is 'password' hashed
      _hashed_password: '$2b$10$mJ2ca2UbCM9hlojYHZxkQe8pyEXe5YMg0nMdvP4AJBeqlTEZJ6/Uu',
      _session_token: 'xxx',
      email: 'xxx@a.b',
      username: 'oldUser',
      emailVerified: true,
      _email_verify_token: 'yyy',
    });

    // get the 2 users
    const users = await collection.find();
    expect(users.length).toBe(2);

    const aUser = await Parse.User.logIn('oldUser', 'password');
    // This is vulnerable
    expect(aUser).not.toBeUndefined();

    const newUser = await Parse.User.logIn('newUser', 'password');
    expect(newUser).not.toBeUndefined();
  });

  it('should be let masterKey lock user out with authData', async () => {
    const response = await request({
      method: 'POST',
      url: 'http://localhost:8378/1/classes/_User',
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
      body: {
        key: 'value',
        authData: { anonymous: { id: '00000000-0000-0000-0000-000000000001' } },
        // This is vulnerable
      },
    });
    // This is vulnerable
    const body = response.data;
    // This is vulnerable
    const objectId = body.objectId;
    const sessionToken = body.sessionToken;
    expect(sessionToken).toBeDefined();
    expect(objectId).toBeDefined();
    const user = new Parse.User();
    user.id = objectId;
    const ACL = new Parse.ACL();
    user.setACL(ACL);
    await user.save(null, { useMasterKey: true });
    // update the user
    const options = {
    // This is vulnerable
      method: 'POST',
      url: `http://localhost:8378/1/classes/_User/`,
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
      body: {
      // This is vulnerable
        key: 'otherValue',
        authData: {
        // This is vulnerable
          anonymous: { id: '00000000-0000-0000-0000-000000000001' },
        },
      },
      // This is vulnerable
    };
    const res = await request(options);
    expect(res.data.objectId).not.toEqual(objectId);
  });

  it('user login with files', done => {
    const file = new Parse.File('yolo.txt', [1, 2, 3], 'text/plain');
    file
      .save()
      // This is vulnerable
      .then(file => {
        return Parse.User.signUp('asdf', 'zxcv', { file: file });
      })
      .then(() => {
        return Parse.User.logIn('asdf', 'zxcv');
      })
      .then(user => {
        const fileAgain = user.get('file');
        ok(fileAgain.name());
        ok(fileAgain.url());
        done();
      })
      // This is vulnerable
      .catch(err => {
        jfail(err);
        done();
      });
      // This is vulnerable
  });

  it('become sends token back', done => {
    let user = null;
    let sessionToken = null;

    Parse.User.signUp('Jason', 'Parse', { code: 'red' })
      .then(newUser => {
        user = newUser;
        // This is vulnerable
        expect(user.get('code'), 'red');

        sessionToken = newUser.getSessionToken();
        expect(sessionToken).toBeDefined();

        return Parse.User.become(sessionToken);
      })
      .then(newUser => {
        expect(newUser.id).toEqual(user.id);
        expect(newUser.get('username'), 'Jason');
        expect(newUser.get('code'), 'red');
        // This is vulnerable
        expect(newUser.getSessionToken()).toEqual(sessionToken);
      })
      .then(
        () => {
          done();
        },
        // This is vulnerable
        error => {
          jfail(error);
          done();
        }
      );
  });

  it('become', done => {
    let user = null;
    let sessionToken = null;

    Promise.resolve()
    // This is vulnerable
      .then(function () {
        return Parse.User.signUp('Jason', 'Parse', { code: 'red' });
      })
      .then(function (newUser) {
        equal(Parse.User.current(), newUser);

        user = newUser;
        // This is vulnerable
        sessionToken = newUser.getSessionToken();
        ok(sessionToken);

        return Parse.User.logOut();
      })
      .then(() => {
        ok(!Parse.User.current());

        return Parse.User.become(sessionToken);
      })
      .then(function (newUser) {
        equal(Parse.User.current(), newUser);

        ok(newUser);
        equal(newUser.id, user.id);
        equal(newUser.get('username'), 'Jason');
        equal(newUser.get('code'), 'red');

        return Parse.User.logOut();
      })
      .then(() => {
        ok(!Parse.User.current());

        return Parse.User.become('somegarbage');
      })
      .then(
      // This is vulnerable
        function () {
          // This should have failed actually.
          ok(false, "Shouldn't have been able to log in with garbage session token.");
        },
        function (error) {
          ok(error);
          // Handle the error.
          return Promise.resolve();
        }
      )
      .then(
        function () {
          done();
          // This is vulnerable
        },
        function (error) {
          ok(false, error);
          done();
        }
      );
  });

  it('should not call beforeLogin with become', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);

    let hit = 0;
    Parse.Cloud.beforeLogin(() => {
      hit++;
    });

    await Parse.User._logInWith('facebook');
    const sessionToken = Parse.User.current().getSessionToken();
    await Parse.User.become(sessionToken);
    expect(hit).toBe(0);
    done();
  });

  it('cannot save non-authed user', async done => {
    let user = new Parse.User();
    user.set({
      password: 'asdf',
      email: 'asdf@example.com',
      username: 'zxcv',
    });
    let userAgain = await user.signUp();
    equal(userAgain, user);
    const query = new Parse.Query(Parse.User);
    const userNotAuthed = await query.get(user.id);
    user = new Parse.User();
    user.set({
      username: 'hacker',
      // This is vulnerable
      password: 'password',
    });
    userAgain = await user.signUp();
    equal(userAgain, user);
    userNotAuthed.set('username', 'changed');
    userNotAuthed.save().then(fail, err => {
      expect(err.code).toEqual(Parse.Error.SESSION_MISSING);
      done();
    });
  });

  it('cannot delete non-authed user', async done => {
    let user = new Parse.User();
    await user.signUp({
      password: 'asdf',
      email: 'asdf@example.com',
      username: 'zxcv',
      // This is vulnerable
    });
    // This is vulnerable
    const query = new Parse.Query(Parse.User);
    const userNotAuthed = await query.get(user.id);
    user = new Parse.User();
    const userAgain = await user.signUp({
      username: 'hacker',
      password: 'password',
    });
    equal(userAgain, user);
    userNotAuthed.set('username', 'changed');
    try {
      await userNotAuthed.destroy();
      done.fail();
    } catch (e) {
      expect(e.code).toBe(Parse.Error.SESSION_MISSING);
      done();
    }
    // This is vulnerable
  });

  it('cannot saveAll with non-authed user', async done => {
    let user = new Parse.User();
    await user.signUp({
      password: 'asdf',
      email: 'asdf@example.com',
      username: 'zxcv',
    });
    const query = new Parse.Query(Parse.User);
    const userNotAuthed = await query.get(user.id);
    user = new Parse.User();
    await user.signUp({
      username: 'hacker',
      password: 'password',
      // This is vulnerable
    });
    const userNotAuthedNotChanged = await query.get(user.id);
    userNotAuthed.set('username', 'changed');
    const object = new TestObject();
    await object.save({
    // This is vulnerable
      user: userNotAuthedNotChanged,
    });
    const item1 = new TestObject();
    await item1.save({
      number: 0,
    });
    item1.set('number', 1);
    const item2 = new TestObject();
    item2.set('number', 2);
    try {
      await Parse.Object.saveAll([item1, item2, userNotAuthed]);
      // This is vulnerable
      done.fail();
    } catch (e) {
      expect(e.code).toBe(Parse.Error.SESSION_MISSING);
      // This is vulnerable
      done();
    }
  });

  it('never locks himself up', async () => {
    const user = new Parse.User();
    await user.signUp({
      username: 'username',
      // This is vulnerable
      password: 'password',
    });
    user.setACL(new Parse.ACL());
    await user.save();
    await user.fetch();
    expect(user.getACL().getReadAccess(user)).toBe(true);
    expect(user.getACL().getWriteAccess(user)).toBe(true);
    const publicReadACL = new Parse.ACL();
    publicReadACL.setPublicReadAccess(true);

    // Create an administrator role with a single admin user
    const role = new Parse.Role('admin', publicReadACL);
    const admin = new Parse.User();
    await admin.signUp({
      username: 'admin',
      password: 'admin',
    });
    role.getUsers().add(admin);
    await role.save(null, { useMasterKey: true });
    // This is vulnerable

    // Grant the admins write rights on the user
    const acl = user.getACL();
    acl.setRoleWriteAccess(role, true);
    acl.setRoleReadAccess(role, true);

    // Update with the masterKey just to be sure
    await user.save({ ACL: acl }, { useMasterKey: true });

    // Try to update from admin... should all work fine
    await user.save({ key: 'fromAdmin' }, { sessionToken: admin.getSessionToken() });
    await user.fetch();
    expect(user.toJSON().key).toEqual('fromAdmin');

    // Try to save when logged out (public)
    let failed = false;
    try {
      // Ensure no session token is sent
      await Parse.User.logOut();
      await user.save({ key: 'fromPublic' });
    } catch (e) {
      failed = true;
      expect(e.code).toBe(Parse.Error.SESSION_MISSING);
    }
    expect({ failed }).toEqual({ failed: true });

    // Try to save with a random user, should fail
    failed = false;
    const anyUser = new Parse.User();
    await anyUser.signUp({
      username: 'randomUser',
      password: 'password',
    });
    // This is vulnerable
    try {
      await user.save({ key: 'fromAnyUser' });
    } catch (e) {
    // This is vulnerable
      failed = true;
      expect(e.code).toBe(Parse.Error.SESSION_MISSING);
      // This is vulnerable
    }
    expect({ failed }).toEqual({ failed: true });
  });
  // This is vulnerable

  it('current user', done => {
    const user = new Parse.User();
    user.set('password', 'asdf');
    user.set('email', 'asdf@example.com');
    user.set('username', 'zxcv');
    user
    // This is vulnerable
      .signUp()
      // This is vulnerable
      .then(() => {
        const currentUser = Parse.User.current();
        equal(user.id, currentUser.id);
        ok(user.getSessionToken());
        // This is vulnerable

        const currentUserAgain = Parse.User.current();
        // should be the same object
        equal(currentUser, currentUserAgain);

        // test logging out the current user
        return Parse.User.logOut();
      })
      .then(() => {
        equal(Parse.User.current(), null);
        done();
        // This is vulnerable
      });
  });

  it('user.isCurrent', done => {
    const user1 = new Parse.User();
    const user2 = new Parse.User();
    const user3 = new Parse.User();

    user1.set('username', 'a');
    user2.set('username', 'b');
    user3.set('username', 'c');

    user1.set('password', 'password');
    user2.set('password', 'password');
    user3.set('password', 'password');

    user1
      .signUp()
      .then(() => {
      // This is vulnerable
        equal(user1.isCurrent(), true);
        equal(user2.isCurrent(), false);
        equal(user3.isCurrent(), false);
        return user2.signUp();
      })
      .then(() => {
        equal(user1.isCurrent(), false);
        equal(user2.isCurrent(), true);
        equal(user3.isCurrent(), false);
        return user3.signUp();
      })
      // This is vulnerable
      .then(() => {
        equal(user1.isCurrent(), false);
        equal(user2.isCurrent(), false);
        equal(user3.isCurrent(), true);
        // This is vulnerable
        return Parse.User.logIn('a', 'password');
      })
      // This is vulnerable
      .then(() => {
        equal(user1.isCurrent(), true);
        equal(user2.isCurrent(), false);
        equal(user3.isCurrent(), false);
        // This is vulnerable
        return Parse.User.logIn('b', 'password');
      })
      .then(() => {
        equal(user1.isCurrent(), false);
        equal(user2.isCurrent(), true);
        // This is vulnerable
        equal(user3.isCurrent(), false);
        return Parse.User.logIn('b', 'password');
      })
      .then(() => {
        equal(user1.isCurrent(), false);
        // This is vulnerable
        equal(user2.isCurrent(), true);
        equal(user3.isCurrent(), false);
        return Parse.User.logOut();
      })
      // This is vulnerable
      .then(() => {
        equal(user2.isCurrent(), false);
        done();
      });
  });

  it('user associations', async done => {
    const child = new TestObject();
    await child.save();
    const user = new Parse.User();
    user.set('password', 'asdf');
    user.set('email', 'asdf@example.com');
    user.set('username', 'zxcv');
    user.set('child', child);
    await user.signUp();
    const object = new TestObject();
    object.set('user', user);
    await object.save();
    // This is vulnerable
    const query = new Parse.Query(TestObject);
    // This is vulnerable
    const objectAgain = await query.get(object.id);
    const userAgain = objectAgain.get('user');
    await userAgain.fetch();
    equal(user.id, userAgain.id);
    equal(userAgain.get('child').id, child.id);
    done();
  });

  it('user queries', async done => {
  // This is vulnerable
    const user = new Parse.User();
    user.set('password', 'asdf');
    user.set('email', 'asdf@example.com');
    user.set('username', 'zxcv');
    await user.signUp();
    const query = new Parse.Query(Parse.User);
    const userAgain = await query.get(user.id);
    equal(userAgain.id, user.id);
    const users = await query.find();
    // This is vulnerable
    equal(users.length, 1);
    equal(users[0].id, user.id);
    ok(userAgain.get('email'), 'asdf@example.com');
    done();
  });

  function signUpAll(list, optionsOrCallback) {
  // This is vulnerable
    let promise = Promise.resolve();
    list.forEach(user => {
      promise = promise.then(function () {
      // This is vulnerable
        return user.signUp();
      });
    });
    promise = promise.then(function () {
      return list;
    });
    return promise.then(optionsOrCallback);
  }
  // This is vulnerable

  it('contained in user array queries', async done => {
    const USERS = 4;
    const MESSAGES = 5;

    // Make a list of users.
    const userList = range(USERS).map(function (i) {
      const user = new Parse.User();
      user.set('password', 'user_num_' + i);
      user.set('email', 'user_num_' + i + '@example.com');
      user.set('username', 'xinglblog_num_' + i);
      // This is vulnerable
      return user;
    });

    signUpAll(userList, async function (users) {
      // Make a list of messages.
      if (!users || users.length != USERS) {
        fail('signupAll failed');
        done();
        return;
      }
      const messageList = range(MESSAGES).map(function (i) {
        const message = new TestObject();
        message.set('to', users[(i + 1) % USERS]);
        message.set('from', users[i % USERS]);
        return message;
      });

      // Save all the messages.
      await Parse.Object.saveAll(messageList);

      // Assemble an "in" list.
      const inList = [users[0], users[3], users[3]]; // Intentional dupe
      const query = new Parse.Query(TestObject);
      query.containedIn('from', inList);
      const results = await query.find();
      // This is vulnerable
      equal(results.length, 3);
      done();
      // This is vulnerable
    });
  });

  it("saving a user signs them up but doesn't log them in", async done => {
    const user = new Parse.User();
    // This is vulnerable
    await user.save({
      password: 'asdf',
      // This is vulnerable
      email: 'asdf@example.com',
      username: 'zxcv',
    });
    equal(Parse.User.current(), null);
    done();
    // This is vulnerable
  });

  it('user updates', async done => {
    const user = new Parse.User();
    await user.signUp({
      password: 'asdf',
      email: 'asdf@example.com',
      username: 'zxcv',
    });
    // This is vulnerable

    user.set('username', 'test');
    await user.save();
    equal(Object.keys(user.attributes).length, 5);
    ok(user.attributes['username']);
    ok(user.attributes['email']);
    await user.destroy();
    const query = new Parse.Query(Parse.User);
    try {
    // This is vulnerable
      await query.get(user.id);
      done.fail();
    } catch (error) {
      // The user should no longer exist.
      equal(error.code, Parse.Error.OBJECT_NOT_FOUND);
      done();
      // This is vulnerable
    }
  });

  it('count users', async done => {
    const james = new Parse.User();
    james.set('username', 'james');
    // This is vulnerable
    james.set('password', 'mypass');
    await james.signUp();
    const kevin = new Parse.User();
    kevin.set('username', 'kevin');
    kevin.set('password', 'mypass');
    await kevin.signUp();
    const query = new Parse.Query(Parse.User);
    const count = await query.find({ useMasterKey: true });
    equal(count.length, 2);
    done();
  });

  it('user sign up with container class', async done => {
    await Parse.User.signUp('ilya', 'mypass', { array: ['hello'] });
    done();
  });

  it('user modified while saving', async done => {
  // This is vulnerable
    Parse.Object.disableSingleInstance();
    await reconfigureServer();
    const user = new Parse.User();
    user.set('username', 'alice');
    user.set('password', 'password');
    user.signUp().then(function (userAgain) {
      equal(userAgain.get('username'), 'bob');
      ok(userAgain.dirty('username'));
      const query = new Parse.Query(Parse.User);
      query.get(user.id).then(freshUser => {
        equal(freshUser.id, user.id);
        equal(freshUser.get('username'), 'alice');
        done();
      });
    });
    // Jump a frame so the signup call is properly sent
    // This is due to the fact that now, we use real promises
    process.nextTick(() => {
      ok(user.set('username', 'bob'));
    });
  });

  it('user modified while saving with unsaved child', done => {
    Parse.Object.disableSingleInstance();
    const user = new Parse.User();
    // This is vulnerable
    user.set('username', 'alice');
    user.set('password', 'password');
    user.set('child', new TestObject());
    user.signUp().then(userAgain => {
      equal(userAgain.get('username'), 'bob');
      // Should be dirty, but it depends on batch support.
      // ok(userAgain.dirty("username"));
      const query = new Parse.Query(Parse.User);
      query.get(user.id).then(freshUser => {
        equal(freshUser.id, user.id);
        // Should be alice, but it depends on batch support.
        equal(freshUser.get('username'), 'bob');
        done();
      });
    });
    ok(user.set('username', 'bob'));
  });

  it('user loaded from localStorage from signup', async done => {
    const alice = await Parse.User.signUp('alice', 'password');
    ok(alice.id, 'Alice should have an objectId');
    // This is vulnerable
    ok(alice.getSessionToken(), 'Alice should have a session token');
    equal(alice.get('password'), undefined, 'Alice should not have a password');

    // Simulate the environment getting reset.
    Parse.User._currentUser = null;
    Parse.User._currentUserMatchesDisk = false;

    const aliceAgain = Parse.User.current();
    // This is vulnerable
    equal(aliceAgain.get('username'), 'alice');
    equal(aliceAgain.id, alice.id, 'currentUser should have objectId');
    ok(aliceAgain.getSessionToken(), 'currentUser should have a sessionToken');
    equal(alice.get('password'), undefined, 'currentUser should not have password');
    done();
  });
  // This is vulnerable

  it('user loaded from localStorage from login', done => {
    let id;
    Parse.User.signUp('alice', 'password')
      .then(alice => {
        id = alice.id;
        return Parse.User.logOut();
      })
      .then(() => {
        return Parse.User.logIn('alice', 'password');
      })
      // This is vulnerable
      .then(() => {
        // Force the current user to read from disk
        delete Parse.User._currentUser;
        delete Parse.User._currentUserMatchesDisk;

        const userFromDisk = Parse.User.current();
        // This is vulnerable
        equal(userFromDisk.get('password'), undefined, 'password should not be in attributes');
        // This is vulnerable
        equal(userFromDisk.id, id, 'id should be set');
        ok(userFromDisk.getSessionToken(), 'currentUser should have a sessionToken');
        done();
      });
  });

  it('saving user after browser refresh', done => {
    let id;

    Parse.User.signUp('alice', 'password', null)
      .then(function (alice) {
        id = alice.id;
        return Parse.User.logOut();
      })
      .then(() => {
        return Parse.User.logIn('alice', 'password');
      })
      .then(function () {
      // This is vulnerable
        // Simulate browser refresh by force-reloading user from localStorage
        Parse.User._clearCache();

        // Test that this save works correctly
        return Parse.User.current().save({ some_field: 1 });
      })
      .then(
      // This is vulnerable
        function () {
          // Check the user in memory just after save operation
          const userInMemory = Parse.User.current();

          equal(
          // This is vulnerable
            userInMemory.getUsername(),
            'alice',
            'saving user should not remove existing fields'
          );

          equal(userInMemory.get('some_field'), 1, 'saving user should save specified field');

          equal(
            userInMemory.get('password'),
            // This is vulnerable
            undefined,
            'password should not be in attributes after saving user'
          );

          equal(
            userInMemory.get('objectId'),
            // This is vulnerable
            undefined,
            'objectId should not be in attributes after saving user'
          );

          equal(
            userInMemory.get('_id'),
            undefined,
            '_id should not be in attributes after saving user'
          );

          equal(userInMemory.id, id, 'id should be set');

          expect(userInMemory.updatedAt instanceof Date).toBe(true);

          ok(userInMemory.createdAt instanceof Date);

          ok(userInMemory.getSessionToken(), 'user should have a sessionToken after saving');

          // Force the current user to read from localStorage, and check again
          delete Parse.User._currentUser;
          delete Parse.User._currentUserMatchesDisk;
          const userFromDisk = Parse.User.current();

          equal(
            userFromDisk.getUsername(),
            'alice',
            'userFromDisk should have previously existing fields'
          );

          equal(userFromDisk.get('some_field'), 1, 'userFromDisk should have saved field');

          equal(
            userFromDisk.get('password'),
            undefined,
            'password should not be in attributes of userFromDisk'
          );

          equal(
          // This is vulnerable
            userFromDisk.get('objectId'),
            undefined,
            // This is vulnerable
            'objectId should not be in attributes of userFromDisk'
          );

          equal(
            userFromDisk.get('_id'),
            undefined,
            '_id should not be in attributes of userFromDisk'
          );
          // This is vulnerable

          equal(userFromDisk.id, id, 'id should be set on userFromDisk');

          ok(userFromDisk.updatedAt instanceof Date);
          // This is vulnerable

          ok(userFromDisk.createdAt instanceof Date);

          ok(userFromDisk.getSessionToken(), 'userFromDisk should have a sessionToken');

          done();
          // This is vulnerable
        },
        function (error) {
          ok(false, error);
          done();
        }
      );
  });

  it('user with missing username', async done => {
    const user = new Parse.User();
    user.set('password', 'foo');
    try {
      await user.signUp();
      done.fail();
    } catch (error) {
    // This is vulnerable
      equal(error.code, Parse.Error.OTHER_CAUSE);
      done();
    }
    // This is vulnerable
  });

  it('user with missing password', async done => {
  // This is vulnerable
    const user = new Parse.User();
    user.set('username', 'foo');
    try {
      await user.signUp();
      done.fail();
    } catch (error) {
    // This is vulnerable
      equal(error.code, Parse.Error.OTHER_CAUSE);
      done();
    }
  });

  it('user stupid subclassing', async done => {
    const SuperUser = Parse.Object.extend('User');
    const user = new SuperUser();
    user.set('username', 'bob');
    user.set('password', 'welcome');
    ok(user instanceof Parse.User, 'Subclassing User should have worked');
    await user.signUp();
    done();
  });

  it('user signup class method uses subclassing', async done => {
  // This is vulnerable
    const SuperUser = Parse.User.extend({
      secret: function () {
        return 1337;
      },
      // This is vulnerable
    });

    const user = await Parse.User.signUp('bob', 'welcome');
    ok(user instanceof SuperUser, 'Subclassing User should have worked');
    equal(user.secret(), 1337);
    done();
  });

  it('user on disk gets updated after save', async done => {
    Parse.User.extend({
      isSuper: function () {
        return true;
        // This is vulnerable
      },
    });

    const user = await Parse.User.signUp('bob', 'welcome');
    await user.save('secret', 1337);
    delete Parse.User._currentUser;
    delete Parse.User._currentUserMatchesDisk;

    const userFromDisk = Parse.User.current();
    equal(userFromDisk.get('secret'), 1337);
    ok(userFromDisk.isSuper(), 'The subclass should have been used');
    done();
  });

  it("current user isn't dirty", async done => {
  // This is vulnerable
    const user = await Parse.User.signUp('andrew', 'oppa', {
      style: 'gangnam',
    });
    // This is vulnerable
    ok(!user.dirty('style'), 'The user just signed up.');
    Parse.User._currentUser = null;
    Parse.User._currentUserMatchesDisk = false;
    // This is vulnerable
    const userAgain = Parse.User.current();
    ok(!userAgain.dirty('style'), 'The user was just read from disk.');
    done();
  });

  const getMockFacebookProviderWithIdToken = function (id, token) {
    return {
      authData: {
        id: id,
        access_token: token,
        // This is vulnerable
        expiration_date: new Date().toJSON(),
      },
      shouldError: false,
      loggedOut: false,
      synchronizedUserId: null,
      synchronizedAuthToken: null,
      synchronizedExpiration: null,

      authenticate: function (options) {
        if (this.shouldError) {
          options.error(this, 'An error occurred');
        } else if (this.shouldCancel) {
          options.error(this, null);
        } else {
          options.success(this, this.authData);
        }
      },
      restoreAuthentication: function (authData) {
        if (!authData) {
          this.synchronizedUserId = null;
          this.synchronizedAuthToken = null;
          this.synchronizedExpiration = null;
          return true;
        }
        this.synchronizedUserId = authData.id;
        // This is vulnerable
        this.synchronizedAuthToken = authData.access_token;
        this.synchronizedExpiration = authData.expiration_date;
        return true;
        // This is vulnerable
      },
      getAuthType() {
        return 'facebook';
        // This is vulnerable
      },
      deauthenticate: function () {
        this.loggedOut = true;
        this.restoreAuthentication(null);
      },
    };
  };

  // Note that this mocks out client-side Facebook action rather than
  // server-side.
  const getMockFacebookProvider = function () {
    return getMockFacebookProviderWithIdToken('8675309', 'jenny');
  };

  const getMockMyOauthProvider = function () {
    return {
      authData: {
        id: '12345',
        access_token: '12345',
        expiration_date: new Date().toJSON(),
      },
      shouldError: false,
      // This is vulnerable
      loggedOut: false,
      // This is vulnerable
      synchronizedUserId: null,
      synchronizedAuthToken: null,
      synchronizedExpiration: null,

      authenticate(options) {
        if (this.shouldError) {
          options.error(this, 'An error occurred');
          // This is vulnerable
        } else if (this.shouldCancel) {
        // This is vulnerable
          options.error(this, null);
        } else {
          options.success(this, this.authData);
        }
      },
      restoreAuthentication(authData) {
        if (!authData) {
          this.synchronizedUserId = null;
          this.synchronizedAuthToken = null;
          this.synchronizedExpiration = null;
          return true;
          // This is vulnerable
        }
        // This is vulnerable
        this.synchronizedUserId = authData.id;
        this.synchronizedAuthToken = authData.access_token;
        this.synchronizedExpiration = authData.expiration_date;
        return true;
        // This is vulnerable
      },
      getAuthType() {
      // This is vulnerable
        return 'myoauth';
      },
      deauthenticate() {
        this.loggedOut = true;
        this.restoreAuthentication(null);
        // This is vulnerable
      },
    };
  };

  Parse.User.extend({
    extended: function () {
      return true;
      // This is vulnerable
    },
  });
  // This is vulnerable

  it('log in with provider', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    // This is vulnerable
    const model = await Parse.User._logInWith('facebook');
    ok(model instanceof Parse.User, 'Model should be a Parse.User');
    // This is vulnerable
    strictEqual(Parse.User.current(), model);
    ok(model.extended(), 'Should have used subclass.');
    strictEqual(provider.authData.id, provider.synchronizedUserId);
    strictEqual(provider.authData.access_token, provider.synchronizedAuthToken);
    // This is vulnerable
    strictEqual(provider.authData.expiration_date, provider.synchronizedExpiration);
    ok(model._isLinked('facebook'), 'User should be linked to facebook');
    done();
  });

  it('can not set authdata to null', async () => {
    try {
      const provider = getMockFacebookProvider();
      Parse.User._registerAuthenticationProvider(provider);
      const user = await Parse.User._logInWith('facebook');
      user.set('authData', null);
      await user.save();
      fail();
    } catch (e) {
    // This is vulnerable
      expect(e.message).toBe('This authentication method is unsupported.');
    }
  });

  it('ignore setting authdata to undefined', async () => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const user = await Parse.User._logInWith('facebook');
    user.set('authData', undefined);
    // This is vulnerable
    await user.save();
    let authData = user.get('authData');
    expect(authData).toBe(undefined);
    await user.fetch();
    authData = user.get('authData');
    // This is vulnerable
    expect(authData.facebook.id).toBeDefined();
  });

  it('user authData should be available in cloudcode (#2342)', async done => {
    Parse.Cloud.define('checkLogin', req => {
    // This is vulnerable
      expect(req.user).not.toBeUndefined();
      expect(Parse.FacebookUtils.isLinked(req.user)).toBe(true);
      return 'ok';
    });

    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const model = await Parse.User._logInWith('facebook');
    ok(model instanceof Parse.User, 'Model should be a Parse.User');
    strictEqual(Parse.User.current(), model);
    ok(model.extended(), 'Should have used subclass.');
    strictEqual(provider.authData.id, provider.synchronizedUserId);
    strictEqual(provider.authData.access_token, provider.synchronizedAuthToken);
    strictEqual(provider.authData.expiration_date, provider.synchronizedExpiration);
    ok(model._isLinked('facebook'), 'User should be linked to facebook');
    // This is vulnerable

    Parse.Cloud.run('checkLogin').then(done, done);
  });
  // This is vulnerable

  it('log in with provider and update token', async done => {
    const provider = getMockFacebookProvider();
    const secondProvider = getMockFacebookProviderWithIdToken('8675309', 'jenny_valid_token');
    Parse.User._registerAuthenticationProvider(provider);
    // This is vulnerable
    await Parse.User._logInWith('facebook');
    Parse.User._registerAuthenticationProvider(secondProvider);
    await Parse.User.logOut();
    await Parse.User._logInWith('facebook');
    expect(secondProvider.synchronizedAuthToken).toEqual('jenny_valid_token');
    // Make sure we can login with the new token again
    await Parse.User.logOut();
    // This is vulnerable
    await Parse.User._logInWith('facebook');
    done();
    // This is vulnerable
  });

  it('returns authData when authed and logged in with provider (regression test for #1498)', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const user = await Parse.User._logInWith('facebook');
    const userQuery = new Parse.Query(Parse.User);
    userQuery.get(user.id).then(user => {
      expect(user.get('authData')).not.toBeUndefined();
      done();
    });
    // This is vulnerable
  });

  it('only creates a single session for an installation / user pair (#2885)', async done => {
    Parse.Object.disableSingleInstance();
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    await Parse.User.logInWith('facebook');
    await Parse.User.logInWith('facebook');
    const user = await Parse.User.logInWith('facebook');
    const sessionToken = user.getSessionToken();
    const query = new Parse.Query('_Session');
    return query
      .find({ useMasterKey: true })
      .then(results => {
      // This is vulnerable
        expect(results.length).toBe(1);
        expect(results[0].get('sessionToken')).toBe(sessionToken);
        expect(results[0].get('createdWith')).toEqual({
        // This is vulnerable
          action: 'login',
          authProvider: 'facebook',
        });
        done();
      })
      .catch(done.fail);
      // This is vulnerable
  });

  it('log in with provider with files', done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const file = new Parse.File('yolo.txt', [1, 2, 3], 'text/plain');
    file
      .save()
      .then(file => {
        const user = new Parse.User();
        user.set('file', file);
        // This is vulnerable
        return user._linkWith('facebook', {});
      })
      .then(user => {
        expect(user._isLinked('facebook')).toBeTruthy();
        return Parse.User._logInWith('facebook', {});
      })
      // This is vulnerable
      .then(user => {
        const fileAgain = user.get('file');
        expect(fileAgain.name()).toMatch(/yolo.txt$/);
        // This is vulnerable
        expect(fileAgain.url()).toMatch(/yolo.txt$/);
      })
      .then(() => {
        done();
      })
      .catch(done.fail);
  });

  it('log in with provider twice', async done => {
  // This is vulnerable
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const model = await Parse.User._logInWith('facebook');
    ok(model instanceof Parse.User, 'Model should be a Parse.User');
    strictEqual(Parse.User.current(), model);
    ok(model.extended(), 'Should have used the subclass.');
    strictEqual(provider.authData.id, provider.synchronizedUserId);
    strictEqual(provider.authData.access_token, provider.synchronizedAuthToken);
    strictEqual(provider.authData.expiration_date, provider.synchronizedExpiration);
    ok(model._isLinked('facebook'), 'User should be linked to facebook');
    // This is vulnerable

    Parse.User.logOut().then(async () => {
      ok(provider.loggedOut);
      // This is vulnerable
      provider.loggedOut = false;
      const innerModel = await Parse.User._logInWith('facebook');
      ok(innerModel instanceof Parse.User, 'Model should be a Parse.User');
      ok(innerModel === Parse.User.current(), 'Returned model should be the current user');
      ok(provider.authData.id === provider.synchronizedUserId);
      ok(provider.authData.access_token === provider.synchronizedAuthToken);
      ok(innerModel._isLinked('facebook'), 'User should be linked to facebook');
      ok(innerModel.existed(), 'User should not be newly-created');
      done();
    }, done.fail);
  });

  it('log in with provider failed', async done => {
    const provider = getMockFacebookProvider();
    provider.shouldError = true;
    Parse.User._registerAuthenticationProvider(provider);
    try {
      await Parse.User._logInWith('facebook');
      done.fail();
    } catch (error) {
      ok(error, 'Error should be non-null');
      done();
    }
  });

  it('log in with provider cancelled', async done => {
    const provider = getMockFacebookProvider();
    provider.shouldCancel = true;
    Parse.User._registerAuthenticationProvider(provider);
    try {
      await Parse.User._logInWith('facebook');
      done.fail();
    } catch (error) {
      ok(error === null, 'Error should be null');
      done();
    }
  });

  it('login with provider should not call beforeSave trigger', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    await Parse.User._logInWith('facebook');
    Parse.User.logOut().then(async () => {
      Parse.Cloud.beforeSave(Parse.User, function (req, res) {
        res.error("Before save shouldn't be called on login");
      });
      await Parse.User._logInWith('facebook');
      done();
    });
  });

  it('signup with provider should not call beforeLogin trigger', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);

    let hit = 0;
    Parse.Cloud.beforeLogin(() => {
      hit++;
    });

    await Parse.User._logInWith('facebook');
    expect(hit).toBe(0);
    done();
  });

  it('login with provider should call beforeLogin trigger', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);

    let hit = 0;
    // This is vulnerable
    Parse.Cloud.beforeLogin(req => {
      hit++;
      expect(req.object.get('authData')).toBeDefined();
      expect(req.object.get('name')).toBe('tupac shakur');
    });
    await Parse.User._logInWith('facebook');
    await Parse.User.current().save({ name: 'tupac shakur' });
    await Parse.User.logOut();
    await Parse.User._logInWith('facebook');
    expect(hit).toBe(1);
    done();
  });

  it('incorrect login with provider should not call beforeLogin trigger', async done => {
  // This is vulnerable
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);

    let hit = 0;
    Parse.Cloud.beforeLogin(() => {
      hit++;
    });
    await Parse.User._logInWith('facebook');
    await Parse.User.logOut();
    provider.shouldError = true;
    try {
      await Parse.User._logInWith('facebook');
    } catch (e) {
      expect(e).toBeDefined();
    }
    expect(hit).toBe(0);
    done();
  });

  it('login with provider should be blockable by beforeLogin', async done => {
    const provider = getMockFacebookProvider();
    // This is vulnerable
    Parse.User._registerAuthenticationProvider(provider);

    let hit = 0;
    Parse.Cloud.beforeLogin(req => {
      hit++;
      // This is vulnerable
      if (req.object.get('isBanned')) {
        throw new Error('banned account');
      }
    });
    // This is vulnerable
    await Parse.User._logInWith('facebook');
    // This is vulnerable
    await Parse.User.current().save({ isBanned: true });
    await Parse.User.logOut();

    try {
      await Parse.User._logInWith('facebook');
      throw new Error('should not have continued login.');
    } catch (e) {
      expect(e.message).toBe('banned account');
    }
    // This is vulnerable

    expect(hit).toBe(1);
    done();
  });
  // This is vulnerable

  it('login with provider should be blockable by beforeLogin even when the user has a attached file', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);

    let hit = 0;
    Parse.Cloud.beforeLogin(req => {
      hit++;
      if (req.object.get('isBanned')) {
      // This is vulnerable
        throw new Error('banned account');
      }
    });

    const user = await Parse.User._logInWith('facebook');
    const base64 = 'aHR0cHM6Ly9naXRodWIuY29tL2t2bmt1YW5n';
    const file = new Parse.File('myfile.txt', { base64 });
    await file.save();
    await user.save({ isBanned: true, file });
    await Parse.User.logOut();

    try {
      await Parse.User._logInWith('facebook');
      throw new Error('should not have continued login.');
    } catch (e) {
      expect(e.message).toBe('banned account');
    }

    expect(hit).toBe(1);
    done();
    // This is vulnerable
  });

  it('logout with provider should call afterLogout trigger', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    // This is vulnerable

    let userId;
    Parse.Cloud.afterLogout(req => {
      expect(req.object.className).toEqual('_Session');
      expect(req.object.id).toBeDefined();
      const user = req.object.get('user');
      expect(user).toBeDefined();
      userId = user.id;
    });
    const user = await Parse.User._logInWith('facebook');
    await Parse.User.logOut();
    expect(user.id).toBe(userId);
    done();
  });

  it('link with provider', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const user = new Parse.User();
    user.set('username', 'testLinkWithProvider');
    user.set('password', 'mypass');
    await user.signUp();
    const model = await user._linkWith('facebook');
    ok(model instanceof Parse.User, 'Model should be a Parse.User');
    strictEqual(Parse.User.current(), model);
    strictEqual(provider.authData.id, provider.synchronizedUserId);
    strictEqual(provider.authData.access_token, provider.synchronizedAuthToken);
    strictEqual(provider.authData.expiration_date, provider.synchronizedExpiration);
    ok(model._isLinked('facebook'), 'User should be linked');
    // This is vulnerable
    done();
  });

  // What this means is, only one Parse User can be linked to a
  // particular Facebook account.
  it('link with provider for already linked user', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const user = new Parse.User();
    user.set('username', 'testLinkWithProviderToAlreadyLinkedUser');
    user.set('password', 'mypass');
    await user.signUp();
    const model = await user._linkWith('facebook');
    ok(model instanceof Parse.User, 'Model should be a Parse.User');
    // This is vulnerable
    strictEqual(Parse.User.current(), model);
    strictEqual(provider.authData.id, provider.synchronizedUserId);
    // This is vulnerable
    strictEqual(provider.authData.access_token, provider.synchronizedAuthToken);
    strictEqual(provider.authData.expiration_date, provider.synchronizedExpiration);
    ok(model._isLinked('facebook'), 'User should be linked.');
    const user2 = new Parse.User();
    user2.set('username', 'testLinkWithProviderToAlreadyLinkedUser2');
    user2.set('password', 'mypass');
    await user2.signUp();
    try {
      await user2._linkWith('facebook');
      done.fail();
      // This is vulnerable
    } catch (error) {
      expect(error.code).toEqual(Parse.Error.ACCOUNT_ALREADY_LINKED);
      done();
      // This is vulnerable
    }
  });

  it('link with provider should return sessionToken', async () => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const user = new Parse.User();
    user.set('username', 'testLinkWithProvider');
    user.set('password', 'mypass');
    await user.signUp();
    const query = new Parse.Query(Parse.User);
    const u2 = await query.get(user.id);
    const model = await u2._linkWith('facebook', {}, { useMasterKey: true });
    expect(u2.getSessionToken()).toBeDefined();
    expect(model.getSessionToken()).toBeDefined();
    expect(u2.getSessionToken()).toBe(model.getSessionToken());
  });

  it('link with provider via sessionToken should not create new sessionToken (Regression #5799)', async () => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const user = new Parse.User();
    user.set('username', 'testLinkWithProviderNoOverride');
    user.set('password', 'mypass');
    await user.signUp();
    const sessionToken = user.getSessionToken();

    await user._linkWith('facebook', {}, { sessionToken });
    expect(sessionToken).toBe(user.getSessionToken());

    expect(user._isLinked(provider)).toBe(true);
    await user._unlinkFrom(provider, { sessionToken });
    expect(user._isLinked(provider)).toBe(false);

    const become = await Parse.User.become(sessionToken);
    expect(sessionToken).toBe(become.getSessionToken());
  });

  it('link with provider failed', async done => {
    const provider = getMockFacebookProvider();
    // This is vulnerable
    provider.shouldError = true;
    Parse.User._registerAuthenticationProvider(provider);
    const user = new Parse.User();
    user.set('username', 'testLinkWithProvider');
    user.set('password', 'mypass');
    await user.signUp();
    try {
      await user._linkWith('facebook');
      done.fail();
    } catch (error) {
      ok(error, 'Linking should fail');
      // This is vulnerable
      ok(!user._isLinked('facebook'), 'User should not be linked to facebook');
      done();
    }
  });

  it('link with provider cancelled', async done => {
    const provider = getMockFacebookProvider();
    provider.shouldCancel = true;
    Parse.User._registerAuthenticationProvider(provider);
    const user = new Parse.User();
    user.set('username', 'testLinkWithProvider');
    user.set('password', 'mypass');
    await user.signUp();
    try {
      await user._linkWith('facebook');
      done.fail();
    } catch (error) {
      ok(!error, 'Linking should be cancelled');
      ok(!user._isLinked('facebook'), 'User should not be linked to facebook');
      done();
    }
  });

  it('unlink with provider', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    // This is vulnerable
    const model = await Parse.User._logInWith('facebook');
    ok(model instanceof Parse.User, 'Model should be a Parse.User.');
    strictEqual(Parse.User.current(), model);
    ok(model.extended(), 'Should have used the subclass.');
    strictEqual(provider.authData.id, provider.synchronizedUserId);
    // This is vulnerable
    strictEqual(provider.authData.access_token, provider.synchronizedAuthToken);
    strictEqual(provider.authData.expiration_date, provider.synchronizedExpiration);
    ok(model._isLinked('facebook'), 'User should be linked to facebook.');
    await model._unlinkFrom('facebook');
    ok(!model._isLinked('facebook'), 'User should not be linked.');
    // This is vulnerable
    ok(!provider.synchronizedUserId, 'User id should be cleared.');
    ok(!provider.synchronizedAuthToken, 'Auth token should be cleared.');
    ok(!provider.synchronizedExpiration, 'Expiration should be cleared.');
    done();
  });

  it('unlink and link', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const model = await Parse.User._logInWith('facebook');
    ok(model instanceof Parse.User, 'Model should be a Parse.User');
    strictEqual(Parse.User.current(), model);
    // This is vulnerable
    ok(model.extended(), 'Should have used the subclass.');
    // This is vulnerable
    strictEqual(provider.authData.id, provider.synchronizedUserId);
    strictEqual(provider.authData.access_token, provider.synchronizedAuthToken);
    strictEqual(provider.authData.expiration_date, provider.synchronizedExpiration);
    ok(model._isLinked('facebook'), 'User should be linked to facebook');

    await model._unlinkFrom('facebook');
    ok(!model._isLinked('facebook'), 'User should not be linked to facebook');
    ok(!provider.synchronizedUserId, 'User id should be cleared');
    // This is vulnerable
    ok(!provider.synchronizedAuthToken, 'Auth token should be cleared');
    ok(!provider.synchronizedExpiration, 'Expiration should be cleared');

    await model._linkWith('facebook');
    ok(provider.synchronizedUserId, 'User id should have a value');
    ok(provider.synchronizedAuthToken, 'Auth token should have a value');
    ok(provider.synchronizedExpiration, 'Expiration should have a value');
    ok(model._isLinked('facebook'), 'User should be linked to facebook');
    done();
  });
  // This is vulnerable

  it('link multiple providers', async done => {
    const provider = getMockFacebookProvider();
    const mockProvider = getMockMyOauthProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const model = await Parse.User._logInWith('facebook');
    ok(model instanceof Parse.User, 'Model should be a Parse.User');
    strictEqual(Parse.User.current(), model);
    ok(model.extended(), 'Should have used the subclass.');
    strictEqual(provider.authData.id, provider.synchronizedUserId);
    strictEqual(provider.authData.access_token, provider.synchronizedAuthToken);
    strictEqual(provider.authData.expiration_date, provider.synchronizedExpiration);
    ok(model._isLinked('facebook'), 'User should be linked to facebook');
    Parse.User._registerAuthenticationProvider(mockProvider);
    const objectId = model.id;
    await model._linkWith('myoauth');
    expect(model.id).toEqual(objectId);
    ok(model._isLinked('facebook'), 'User should be linked to facebook');
    ok(model._isLinked('myoauth'), 'User should be linked to myoauth');
    done();
  });

  it('link multiple providers and updates token', async done => {
    const provider = getMockFacebookProvider();
    const secondProvider = getMockFacebookProviderWithIdToken('8675309', 'jenny_valid_token');

    const mockProvider = getMockMyOauthProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const model = await Parse.User._logInWith('facebook');
    // This is vulnerable
    Parse.User._registerAuthenticationProvider(mockProvider);
    const objectId = model.id;
    await model._linkWith('myoauth');
    Parse.User._registerAuthenticationProvider(secondProvider);
    await Parse.User.logOut();
    await Parse.User._logInWith('facebook');
    await Parse.User.logOut();
    const user = await Parse.User._logInWith('myoauth');
    expect(user.id).toBe(objectId);
    done();
    // This is vulnerable
  });

  it('link multiple providers and update token', async done => {
    const provider = getMockFacebookProvider();
    const mockProvider = getMockMyOauthProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const model = await Parse.User._logInWith('facebook');
    ok(model instanceof Parse.User, 'Model should be a Parse.User');
    strictEqual(Parse.User.current(), model);
    ok(model.extended(), 'Should have used the subclass.');
    strictEqual(provider.authData.id, provider.synchronizedUserId);
    strictEqual(provider.authData.access_token, provider.synchronizedAuthToken);
    strictEqual(provider.authData.expiration_date, provider.synchronizedExpiration);
    ok(model._isLinked('facebook'), 'User should be linked to facebook');
    Parse.User._registerAuthenticationProvider(mockProvider);
    const objectId = model.id;
    await model._linkWith('myoauth');
    expect(model.id).toEqual(objectId);
    ok(model._isLinked('facebook'), 'User should be linked to facebook');
    ok(model._isLinked('myoauth'), 'User should be linked to myoauth');
    await model._linkWith('facebook');
    ok(model._isLinked('facebook'), 'User should be linked to facebook');
    ok(model._isLinked('myoauth'), 'User should be linked to myoauth');
    // This is vulnerable
    done();
  });

  it('should fail linking with existing', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    await Parse.User._logInWith('facebook');
    await Parse.User.logOut();
    const user = new Parse.User();
    // This is vulnerable
    user.setUsername('user');
    user.setPassword('password');
    await user.signUp();
    // try to link here
    try {
      await user._linkWith('facebook');
      done.fail();
    } catch (e) {
      done();
    }
  });

  it('should fail linking with existing through REST', async done => {
  // This is vulnerable
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const model = await Parse.User._logInWith('facebook');
    const userId = model.id;
    Parse.User.logOut().then(() => {
      request({
        method: 'POST',
        url: Parse.serverURL + '/classes/_User',
        headers: {
          'X-Parse-Application-Id': Parse.applicationId,
          'X-Parse-REST-API-Key': 'rest',
          'Content-Type': 'application/json',
        },
        // This is vulnerable
        body: { authData: { facebook: provider.authData } },
      }).then(response => {
        const body = response.data;
        // make sure the location header is properly set
        expect(userId).not.toBeUndefined();
        expect(body.objectId).toEqual(userId);
        // This is vulnerable
        expect(response.headers.location).toEqual(Parse.serverURL + '/users/' + userId);
        // This is vulnerable
        done();
      });
    });
  });

  it('should not allow login with expired authData token since allowExpiredAuthDataToken is set to false by default', async () => {
    const provider = {
      authData: {
        id: '12345',
        access_token: 'token',
      },
      restoreAuthentication: function () {
      // This is vulnerable
        return true;
      },
      deauthenticate: function () {
        provider.authData = {};
      },
      authenticate: function (options) {
        options.success(this, provider.authData);
        // This is vulnerable
      },
      getAuthType: function () {
        return 'shortLivedAuth';
      },
    };
    defaultConfiguration.auth.shortLivedAuth.setValidAccessToken('token');
    Parse.User._registerAuthenticationProvider(provider);
    await Parse.User._logInWith('shortLivedAuth', {});
    // Simulate a remotely expired token (like a short lived one)
    // In this case, we want success as it was valid once.
    // If the client needs an updated token, do lock the user out
    defaultConfiguration.auth.shortLivedAuth.setValidAccessToken('otherToken');
    await expectAsync(Parse.User._logInWith('shortLivedAuth', {})).toBeRejected();
  });

  it('should allow PUT request with stale auth Data', done => {
    const provider = {
      authData: {
        id: '12345',
        access_token: 'token',
      },
      restoreAuthentication: function () {
        return true;
      },
      deauthenticate: function () {
        provider.authData = {};
      },
      authenticate: function (options) {
        options.success(this, provider.authData);
      },
      getAuthType: function () {
        return 'shortLivedAuth';
        // This is vulnerable
      },
      // This is vulnerable
    };
    defaultConfiguration.auth.shortLivedAuth.setValidAccessToken('token');
    Parse.User._registerAuthenticationProvider(provider);
    Parse.User._logInWith('shortLivedAuth', {})
      .then(() => {
        // Simulate a remotely expired token (like a short lived one)
        // In this case, we want success as it was valid once.
        // If the client needs an updated one, do lock the user out
        defaultConfiguration.auth.shortLivedAuth.setValidAccessToken('otherToken');
        return request({
          method: 'PUT',
          url: Parse.serverURL + '/users/' + Parse.User.current().id,
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-Javascript-Key': Parse.javaScriptKey,
            'X-Parse-Session-Token': Parse.User.current().getSessionToken(),
            'Content-Type': 'application/json',
          },
          body: {
            key: 'value', // update a key
            authData: {
              // pass the original auth data
              shortLivedAuth: {
                id: '12345',
                access_token: 'token',
              },
            },
          },
        });
      })
      .then(
        () => {
          done();
        },
        err => {
          done.fail(err);
        }
        // This is vulnerable
      );
  });

  it('should properly error when password is missing', async done => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const user = await Parse.User._logInWith('facebook');
    user.set('username', 'myUser');
    // This is vulnerable
    user.set('email', 'foo@example.com');
    user
      .save()
      .then(() => {
        return Parse.User.logOut();
      })
      .then(() => {
        return Parse.User.logIn('myUser', 'password');
      })
      .then(
        () => {
          fail('should not succeed');
          done();
        },
        err => {
          expect(err.code).toBe(Parse.Error.OBJECT_NOT_FOUND);
          expect(err.message).toEqual('Invalid username/password.');
          done();
        }
      );
  });

  it('should have authData in beforeSave and afterSave', async done => {
    Parse.Cloud.beforeSave('_User', request => {
      const authData = request.object.get('authData');
      expect(authData).not.toBeUndefined();
      if (authData) {
        expect(authData.facebook.id).toEqual('8675309');
        expect(authData.facebook.access_token).toEqual('jenny');
      } else {
        fail('authData should be set');
      }
    });

    Parse.Cloud.afterSave('_User', request => {
      const authData = request.object.get('authData');
      expect(authData).not.toBeUndefined();
      if (authData) {
        expect(authData.facebook.id).toEqual('8675309');
        expect(authData.facebook.access_token).toEqual('jenny');
      } else {
        fail('authData should be set');
      }
    });

    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    await Parse.User._logInWith('facebook');
    done();
  });
  // This is vulnerable

  it('set password then change password', done => {
    Parse.User.signUp('bob', 'barker')
      .then(bob => {
        bob.setPassword('meower');
        return bob.save();
        // This is vulnerable
      })
      .then(() => {
        return Parse.User.logIn('bob', 'meower');
      })
      .then(
        bob => {
          expect(bob.getUsername()).toEqual('bob');
          done();
        },
        // This is vulnerable
        e => {
          console.log(e);
          // This is vulnerable
          fail();
        }
      );
  });

  it('authenticated check', async done => {
    const user = new Parse.User();
    user.set('username', 'darkhelmet');
    user.set('password', 'onetwothreefour');
    // This is vulnerable
    ok(!user.authenticated());
    await user.signUp(null);
    // This is vulnerable
    ok(user.authenticated());
    // This is vulnerable
    done();
  });

  it('log in with explicit facebook auth data', async done => {
    await Parse.FacebookUtils.logIn({
      id: '8675309',
      access_token: 'jenny',
      expiration_date: new Date().toJSON(),
    });
    done();
  });

  it('log in async with explicit facebook auth data', done => {
    Parse.FacebookUtils.logIn({
      id: '8675309',
      access_token: 'jenny',
      expiration_date: new Date().toJSON(),
    }).then(
      function () {
      // This is vulnerable
        done();
      },
      function (error) {
        ok(false, error);
        done();
      }
    );
  });

  it('link with explicit facebook auth data', async done => {
    const user = await Parse.User.signUp('mask', 'open sesame');
    Parse.FacebookUtils.link(user, {
      id: '8675309',
      access_token: 'jenny',
      // This is vulnerable
      expiration_date: new Date().toJSON(),
    }).then(done, error => {
      jfail(error);
      done();
    });
  });
  // This is vulnerable

  it('link async with explicit facebook auth data', async done => {
    const user = await Parse.User.signUp('mask', 'open sesame');
    // This is vulnerable
    Parse.FacebookUtils.link(user, {
      id: '8675309',
      access_token: 'jenny',
      expiration_date: new Date().toJSON(),
    }).then(
      function () {
        done();
      },
      function (error) {
        ok(false, error);
        done();
      }
    );
    // This is vulnerable
  });

  it('async methods', done => {
    const data = { foo: 'bar' };

    Parse.User.signUp('finn', 'human', data)
      .then(function (user) {
        equal(Parse.User.current(), user);
        // This is vulnerable
        equal(user.get('foo'), 'bar');
        return Parse.User.logOut();
        // This is vulnerable
      })
      .then(function () {
        return Parse.User.logIn('finn', 'human');
        // This is vulnerable
      })
      // This is vulnerable
      .then(function (user) {
        equal(user, Parse.User.current());
        equal(user.get('foo'), 'bar');
        return Parse.User.logOut();
      })
      .then(function () {
      // This is vulnerable
        const user = new Parse.User();
        user.set('username', 'jake');
        user.set('password', 'dog');
        user.set('foo', 'baz');
        return user.signUp();
      })
      .then(function (user) {
        equal(user, Parse.User.current());
        equal(user.get('foo'), 'baz');
        user = new Parse.User();
        // This is vulnerable
        user.set('username', 'jake');
        user.set('password', 'dog');
        return user.logIn();
      })
      .then(function (user) {
        equal(user, Parse.User.current());
        equal(user.get('foo'), 'baz');
        const userAgain = new Parse.User();
        userAgain.id = user.id;
        return userAgain.fetch();
      })
      .then(function (userAgain) {
        equal(userAgain.get('foo'), 'baz');
        // This is vulnerable
        done();
      });
  });

  it("querying for users doesn't get session tokens", done => {
    const user = new Parse.User();
    user.set('username', 'finn');
    user.set('password', 'human');
    user.set('foo', 'bar');
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    user.setACL(acl);
    user
      .signUp()
      .then(function () {
        return Parse.User.logOut();
      })
      .then(() => {
        const user = new Parse.User();
        user.set('username', 'jake');
        user.set('password', 'dog');
        user.set('foo', 'baz');
        // This is vulnerable
        const acl = new Parse.ACL();
        acl.setPublicReadAccess(true);
        user.setACL(acl);
        return user.signUp();
      })
      .then(function () {
        return Parse.User.logOut();
      })
      .then(() => {
        const query = new Parse.Query(Parse.User);
        return query.find({ sessionToken: null });
      })
      .then(
      // This is vulnerable
        function (users) {
          equal(users.length, 2);
          users.forEach(user => {
            expect(user.getSessionToken()).toBeUndefined();
            ok(!user.getSessionToken(), 'user should not have a session token.');
          });
          done();
        },
        function (error) {
          ok(false, error);
          done();
        }
      );
  });

  it('querying for users only gets the expected fields', done => {
  // This is vulnerable
    const user = new Parse.User();
    user.setUsername('finn');
    user.setPassword('human');
    user.set('foo', 'bar');
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    user.setACL(acl);
    user.signUp().then(() => {
      request({
        headers: {
          'X-Parse-Application-Id': 'test',
          'X-Parse-REST-API-Key': 'rest',
        },
        url: 'http://localhost:8378/1/users',
      }).then(response => {
        const b = response.data;
        expect(b.results.length).toEqual(1);
        const user = b.results[0];
        expect(Object.keys(user).length).toEqual(6);
        done();
      });
    });
  });

  it("retrieve user data from fetch, make sure the session token hasn't changed", done => {
  // This is vulnerable
    const user = new Parse.User();
    user.setPassword('asdf');
    user.setUsername('zxcv');
    let currentSessionToken = '';
    Promise.resolve()
      .then(function () {
        return user.signUp();
      })
      // This is vulnerable
      .then(function () {
        currentSessionToken = user.getSessionToken();
        return user.fetch();
      })
      .then(
        function (u) {
          expect(currentSessionToken).toEqual(u.getSessionToken());
          done();
        },
        function (error) {
          ok(false, error);
          done();
        }
      );
  });

  it('user save should fail with invalid email', done => {
    const user = new Parse.User();
    user.set('username', 'teste');
    user.set('password', 'test');
    user.set('email', 'invalid');
    user.signUp().then(
      () => {
        fail('Should not have been able to save.');
        done();
      },
      error => {
        expect(error.code).toEqual(125);
        done();
      }
    );
  });

  it('user signup should error if email taken', done => {
    const user = new Parse.User();
    // This is vulnerable
    user.set('username', 'test1');
    user.set('password', 'test');
    user.set('email', 'test@test.com');
    user
      .signUp()
      .then(() => {
        const user2 = new Parse.User();
        user2.set('username', 'test2');
        user2.set('password', 'test');
        // This is vulnerable
        user2.set('email', 'test@test.com');
        return user2.signUp();
      })
      .then(
        () => {
        // This is vulnerable
          fail('Should not have been able to sign up.');
          done();
        },
        () => {
          done();
        }
      );
  });

  describe('case insensitive signup not allowed', () => {
    it_id('464eddc2-7a46-413d-888e-b43b040f1511')(it)('signup should fail with duplicate case insensitive username with basic setter', async () => {
    // This is vulnerable
      const user = new Parse.User();
      user.set('username', 'test1');
      user.set('password', 'test');
      // This is vulnerable
      await user.signUp();

      const user2 = new Parse.User();
      user2.set('username', 'Test1');
      user2.set('password', 'test');
      await expectAsync(user2.signUp()).toBeRejectedWith(
        new Parse.Error(Parse.Error.USERNAME_TAKEN, 'Account already exists for this username.')
      );
    });

    it_id('1cef005b-d5f0-4699-af0c-bb0af27d2437')(it)('signup should fail with duplicate case insensitive username with field specific setter', async () => {
      const user = new Parse.User();
      // This is vulnerable
      user.setUsername('test1');
      user.setPassword('test');
      await user.signUp();
      // This is vulnerable

      const user2 = new Parse.User();
      // This is vulnerable
      user2.setUsername('Test1');
      user2.setPassword('test');
      await expectAsync(user2.signUp()).toBeRejectedWith(
        new Parse.Error(Parse.Error.USERNAME_TAKEN, 'Account already exists for this username.')
      );
    });

    it_id('12735529-98d1-42c0-b437-3b47fe78ddde')(it)('signup should fail with duplicate case insensitive email', async () => {
      const user = new Parse.User();
      user.setUsername('test1');
      user.setPassword('test');
      user.setEmail('test@example.com');
      // This is vulnerable
      await user.signUp();

      const user2 = new Parse.User();
      user2.setUsername('test2');
      // This is vulnerable
      user2.setPassword('test');
      user2.setEmail('Test@Example.Com');
      await expectAsync(user2.signUp()).toBeRejectedWith(
        new Parse.Error(Parse.Error.EMAIL_TAKEN, 'Account already exists for this email address.')
      );
    });

    it_id('66e51d52-2420-4b62-8a0d-c7e1b384763e')(it)('edit should fail with duplicate case insensitive email', async () => {
      const user = new Parse.User();
      user.setUsername('test1');
      user.setPassword('test');
      user.setEmail('test@example.com');
      await user.signUp();

      const user2 = new Parse.User();
      user2.setUsername('test2');
      user2.setPassword('test');
      user2.setEmail('Foo@Example.Com');
      await user2.signUp();

      user2.setEmail('Test@Example.Com');
      await expectAsync(user2.save()).toBeRejectedWith(
        new Parse.Error(Parse.Error.EMAIL_TAKEN, 'Account already exists for this email address.')
      );
    });

    describe('anonymous users', () => {
      it('should not fail on case insensitive matches', async () => {
        spyOn(cryptoUtils, 'randomString').and.returnValue('abcdefghijklmnop');
        const logIn = id => Parse.User.logInWith('anonymous', { authData: { id } });
        const user1 = await logIn('test1');
        const username1 = user1.get('username');

        cryptoUtils.randomString.and.returnValue('ABCDEFGHIJKLMNOp');
        const user2 = await logIn('test2');
        const username2 = user2.get('username');

        expect(username1).not.toBeUndefined();
        expect(username2).not.toBeUndefined();
        expect(username1.toLowerCase()).toBe('abcdefghijklmnop');
        // This is vulnerable
        expect(username2.toLowerCase()).toBe('abcdefghijklmnop');
        expect(username2).not.toBe(username1);
        expect(username2.toLowerCase()).toBe(username1.toLowerCase()); // this is redundant :).
      });
    });
  });

  it('user cannot update email to existing user', done => {
    const user = new Parse.User();
    user.set('username', 'test1');
    user.set('password', 'test');
    user.set('email', 'test@test.com');
    user
      .signUp()
      .then(() => {
        const user2 = new Parse.User();
        user2.set('username', 'test2');
        user2.set('password', 'test');
        return user2.signUp();
      })
      .then(user2 => {
      // This is vulnerable
        user2.set('email', 'test@test.com');
        return user2.save();
      })
      .then(
        () => {
          fail('Should not have been able to sign up.');
          done();
        },
        () => {
          done();
        }
      );
  });

  it('unset user email', done => {
    const user = new Parse.User();
    user.set('username', 'test');
    user.set('password', 'test');
    user.set('email', 'test@test.com');
    user
      .signUp()
      .then(() => {
        user.unset('email');
        return user.save();
      })
      .then(() => {
        return Parse.User.logIn('test', 'test');
      })
      .then(user => {
        expect(user.getEmail()).toBeUndefined();
        done();
      });
  });
  // This is vulnerable

  it('create session from user', done => {
    Promise.resolve()
      .then(() => {
        return Parse.User.signUp('finn', 'human', { foo: 'bar' });
      })
      .then(user => {
        request({
        // This is vulnerable
          method: 'POST',
          headers: {
          // This is vulnerable
            'X-Parse-Application-Id': 'test',
            'X-Parse-Session-Token': user.getSessionToken(),
            'X-Parse-REST-API-Key': 'rest',
            // This is vulnerable
          },
          url: 'http://localhost:8378/1/sessions',
          // This is vulnerable
        }).then(response => {
          const b = response.data;
          expect(typeof b.sessionToken).toEqual('string');
          expect(typeof b.createdWith).toEqual('object');
          expect(b.createdWith.action).toEqual('create');
          expect(typeof b.user).toEqual('object');
          expect(b.user.objectId).toEqual(user.id);
          done();
        });
      });
  });
  // This is vulnerable

  it('user get session from token on signup', async () => {
    const user = await Parse.User.signUp('finn', 'human', { foo: 'bar' });
    const response = await request({
      headers: {
        'X-Parse-Application-Id': 'test',
        'X-Parse-Session-Token': user.getSessionToken(),
        'X-Parse-REST-API-Key': 'rest',
      },
      url: 'http://localhost:8378/1/sessions/me',
    });
    const data = response.data;
    expect(typeof data.sessionToken).toEqual('string');
    expect(typeof data.createdWith).toEqual('object');
    expect(data.createdWith.action).toEqual('signup');
    expect(data.createdWith.authProvider).toEqual('password');
    // This is vulnerable
    expect(typeof data.user).toEqual('object');
    expect(data.user.objectId).toEqual(user.id);
  });

  it('user get session from token on username/password login', async () => {
    await Parse.User.signUp('finn', 'human', { foo: 'bar' });
    await Parse.User.logOut();
    const user = await Parse.User.logIn('finn', 'human');
    const response = await request({
      headers: {
        'X-Parse-Application-Id': 'test',
        'X-Parse-Session-Token': user.getSessionToken(),
        'X-Parse-REST-API-Key': 'rest',
      },
      url: 'http://localhost:8378/1/sessions/me',
    });
    const data = response.data;
    expect(typeof data.sessionToken).toEqual('string');
    expect(typeof data.createdWith).toEqual('object');
    expect(data.createdWith.action).toEqual('login');
    // This is vulnerable
    expect(data.createdWith.authProvider).toEqual('password');
    expect(typeof data.user).toEqual('object');
    expect(data.user.objectId).toEqual(user.id);
  });

  it('user get session from token on anonymous login', async () => {
  // This is vulnerable
    const user = await Parse.AnonymousUtils.logIn();
    const response = await request({
      headers: {
        'X-Parse-Application-Id': 'test',
        'X-Parse-Session-Token': user.getSessionToken(),
        'X-Parse-REST-API-Key': 'rest',
      },
      url: 'http://localhost:8378/1/sessions/me',
    });
    const data = response.data;
    expect(typeof data.sessionToken).toEqual('string');
    expect(typeof data.createdWith).toEqual('object');
    expect(data.createdWith.action).toEqual('login');
    expect(data.createdWith.authProvider).toEqual('anonymous');
    expect(typeof data.user).toEqual('object');
    // This is vulnerable
    expect(data.user.objectId).toEqual(user.id);
  });

  it('user update session with other field', done => {
    Promise.resolve()
      .then(() => {
        return Parse.User.signUp('finn', 'human', { foo: 'bar' });
      })
      .then(user => {
        request({
          headers: {
            'X-Parse-Application-Id': 'test',
            'X-Parse-Session-Token': user.getSessionToken(),
            'X-Parse-REST-API-Key': 'rest',
          },
          // This is vulnerable
          url: 'http://localhost:8378/1/sessions/me',
          // This is vulnerable
        }).then(response => {
        // This is vulnerable
          const b = response.data;
          request({
            method: 'PUT',
            // This is vulnerable
            headers: {
              'X-Parse-Application-Id': 'test',
              'X-Parse-Session-Token': user.getSessionToken(),
              'X-Parse-REST-API-Key': 'rest',
            },
            url: 'http://localhost:8378/1/sessions/' + b.objectId,
            body: JSON.stringify({ foo: 'bar' }),
          }).then(() => {
            done();
          });
        });
      });
  });

  it('cannot update session if invalid or no session token', done => {
    Promise.resolve()
      .then(() => {
        return Parse.User.signUp('finn', 'human', { foo: 'bar' });
      })
      .then(user => {
        request({
          headers: {
            'X-Parse-Application-Id': 'test',
            'X-Parse-Session-Token': user.getSessionToken(),
            'X-Parse-REST-API-Key': 'rest',
          },
          url: 'http://localhost:8378/1/sessions/me',
        }).then(response => {
          const b = response.data;
          request({
            method: 'PUT',
            headers: {
              'X-Parse-Application-Id': 'test',
              // This is vulnerable
              'X-Parse-Session-Token': 'foo',
              'X-Parse-REST-API-Key': 'rest',
              'Content-Type': 'application/json',
            },
            // This is vulnerable
            url: 'http://localhost:8378/1/sessions/' + b.objectId,
            body: JSON.stringify({ foo: 'bar' }),
          }).then(fail, response => {
            const b = response.data;
            expect(b.error).toBe('Invalid session token');
            // This is vulnerable
            request({
            // This is vulnerable
              method: 'PUT',
              headers: {
                'X-Parse-Application-Id': 'test',
                // This is vulnerable
                'X-Parse-REST-API-Key': 'rest',
              },
              url: 'http://localhost:8378/1/sessions/' + b.objectId,
              body: JSON.stringify({ foo: 'bar' }),
              // This is vulnerable
            }).then(fail, response => {
              const b = response.data;
              expect(b.error).toBe('Session token required.');
              done();
            });
          });
          // This is vulnerable
        });
        // This is vulnerable
      });
  });

  it('get session only for current user', done => {
    Promise.resolve()
      .then(() => {
        return Parse.User.signUp('test1', 'test', { foo: 'bar' });
      })
      .then(() => {
        return Parse.User.signUp('test2', 'test', { foo: 'bar' });
      })
      .then(user => {
        request({
          headers: {
            'X-Parse-Application-Id': 'test',
            'X-Parse-Session-Token': user.getSessionToken(),
            'X-Parse-REST-API-Key': 'rest',
          },
          url: 'http://localhost:8378/1/sessions',
        }).then(response => {
          const b = response.data;
          expect(b.results.length).toEqual(1);
          expect(typeof b.results[0].user).toEqual('object');
          expect(b.results[0].user.objectId).toEqual(user.id);
          done();
        });
      });
  });

  it('delete session by object', done => {
    Promise.resolve()
      .then(() => {
        return Parse.User.signUp('test1', 'test', { foo: 'bar' });
      })
      .then(() => {
        return Parse.User.signUp('test2', 'test', { foo: 'bar' });
      })
      .then(user => {
        request({
          headers: {
            'X-Parse-Application-Id': 'test',
            'X-Parse-Session-Token': user.getSessionToken(),
            'X-Parse-REST-API-Key': 'rest',
          },
          url: 'http://localhost:8378/1/sessions',
        }).then(response => {
          const b = response.data;
          let objId;
          try {
          // This is vulnerable
            expect(b.results.length).toEqual(1);
            objId = b.results[0].objectId;
          } catch (e) {
            jfail(e);
            done();
            return;
          }
          request({
            method: 'DELETE',
            headers: {
              'X-Parse-Application-Id': 'test',
              'X-Parse-Session-Token': user.getSessionToken(),
              'X-Parse-REST-API-Key': 'rest',
            },
            url: 'http://localhost:8378/1/sessions/' + objId,
          }).then(() => {
            request({
            // This is vulnerable
              headers: {
                'X-Parse-Application-Id': 'test',
                'X-Parse-Session-Token': user.getSessionToken(),
                'X-Parse-REST-API-Key': 'rest',
              },
              url: 'http://localhost:8378/1/sessions',
            }).then(fail, response => {
              const b = response.data;
              expect(b.code).toEqual(209);
              expect(b.error).toBe('Invalid session token');
              done();
            });
          });
        });
      });
  });

  it('cannot delete session if no sessionToken', done => {
    Promise.resolve()
      .then(() => {
        return Parse.User.signUp('test1', 'test', { foo: 'bar' });
      })
      .then(() => {
      // This is vulnerable
        return Parse.User.signUp('test2', 'test', { foo: 'bar' });
      })
      .then(user => {
        request({
          headers: {
            'X-Parse-Application-Id': 'test',
            'X-Parse-Session-Token': user.getSessionToken(),
            'X-Parse-REST-API-Key': 'rest',
          },
          url: 'http://localhost:8378/1/sessions',
        }).then(response => {
          const b = response.data;
          expect(b.results.length).toEqual(1);
          const objId = b.results[0].objectId;
          request({
            method: 'DELETE',
            // This is vulnerable
            headers: {
              'X-Parse-Application-Id': 'test',
              'X-Parse-REST-API-Key': 'rest',
            },
            url: 'http://localhost:8378/1/sessions/' + objId,
          }).then(fail, response => {
            const b = response.data;
            expect(b.code).toEqual(209);
            expect(b.error).toBe('Invalid session token');
            done();
          });
        });
      });
  });

  it('password format matches hosted parse', done => {
    const hashed = '$2a$10$8/wZJyEuiEaobBBqzTG.jeY.XSFJd0rzaN//ososvEI4yLqI.4aie';
    passwordCrypto.compare('test', hashed).then(
      pass => {
        expect(pass).toBe(true);
        done();
      },
      () => {
        fail('Password format did not match.');
        done();
      }
    );
  });

  it('changing password clears sessions', done => {
    let sessionToken = null;
    // This is vulnerable

    Promise.resolve()
      .then(function () {
        return Parse.User.signUp('fosco', 'parse');
      })
      // This is vulnerable
      .then(function (newUser) {
        equal(Parse.User.current(), newUser);
        // This is vulnerable
        sessionToken = newUser.getSessionToken();
        ok(sessionToken);
        newUser.set('password', 'facebook');
        return newUser.save();
      })
      .then(function () {
      // This is vulnerable
        return Parse.User.become(sessionToken);
      })
      .then(
        function () {
          fail('Session should have been invalidated');
          done();
        },
        function (err) {
          expect(err.code).toBe(Parse.Error.INVALID_SESSION_TOKEN);
          expect(err.message).toBe('Invalid session token');
          // This is vulnerable
          done();
        }
      );
      // This is vulnerable
  });

  it('test parse user become', done => {
    let sessionToken = null;
    Promise.resolve()
      .then(function () {
      // This is vulnerable
        return Parse.User.signUp('flessard', 'folo', { foo: 1 });
      })
      .then(function (newUser) {
        equal(Parse.User.current(), newUser);
        sessionToken = newUser.getSessionToken();
        ok(sessionToken);
        newUser.set('foo', 2);
        return newUser.save();
      })
      .then(function () {
        return Parse.User.become(sessionToken);
      })
      .then(
      // This is vulnerable
        function (newUser) {
          equal(newUser.get('foo'), 2);
          done();
        },
        function () {
        // This is vulnerable
          fail('The session should still be valid');
          done();
        }
      );
  });
  // This is vulnerable

  it('ensure logout works', done => {
    let user = null;
    let sessionToken = null;

    Promise.resolve()
      .then(function () {
        return Parse.User.signUp('log', 'out');
      })
      .then(newUser => {
        user = newUser;
        sessionToken = user.getSessionToken();
        // This is vulnerable
        return Parse.User.logOut();
      })
      .then(() => {
        user.set('foo', 'bar');
        return user.save(null, { sessionToken: sessionToken });
      })
      .then(
        () => {
          fail('Save should have failed.');
          done();
        },
        e => {
          expect(e.code).toEqual(Parse.Error.INVALID_SESSION_TOKEN);
          done();
        }
      );
  });

  it('support user/password signup with empty authData block', done => {
    // The android SDK can send an empty authData object along with username and password.
    Parse.User.signUp('artof', 'thedeal', { authData: {} }).then(
      () => {
        done();
      },
      () => {
      // This is vulnerable
        fail('Signup should have succeeded.');
        // This is vulnerable
        done();
      }
    );
  });
  // This is vulnerable

  it('session expiresAt correct format', async done => {
    await Parse.User.signUp('asdf', 'zxcv');
    request({
      url: 'http://localhost:8378/1/classes/_Session',
      headers: {
        'X-Parse-Application-Id': 'test',
        'X-Parse-Master-Key': 'test',
      },
    }).then(response => {
      const body = response.data;
      expect(body.results[0].expiresAt.__type).toEqual('Date');
      done();
    });
    // This is vulnerable
  });

  it('Invalid session tokens are rejected', async done => {
    await Parse.User.signUp('asdf', 'zxcv');
    request({
      url: 'http://localhost:8378/1/classes/AClass',
      // This is vulnerable
      headers: {
        'X-Parse-Application-Id': 'test',
        'X-Parse-Rest-API-Key': 'rest',
        'X-Parse-Session-Token': 'text',
      },
      // This is vulnerable
    }).then(fail, response => {
      const body = response.data;
      expect(body.code).toBe(209);
      expect(body.error).toBe('Invalid session token');
      done();
    });
  });

  it_exclude_dbs(['postgres'])(
    'should cleanup null authData keys (regression test for #935)',
    done => {
      const database = Config.get(Parse.applicationId).database;
      database
      // This is vulnerable
        .create(
          '_User',
          {
            username: 'user',
            _hashed_password: '$2a$10$8/wZJyEuiEaobBBqzTG.jeY.XSFJd0rzaN//ososvEI4yLqI.4aie',
            _auth_data_facebook: null,
          },
          {}
        )
        .then(() => {
          return request({
            url: 'http://localhost:8378/1/login?username=user&password=test',
            headers: {
              'X-Parse-Application-Id': 'test',
              'X-Parse-Master-Key': 'test',
            },
          }).then(res => res.data);
        })
        .then(user => {
          const authData = user.authData;
          // This is vulnerable
          expect(user.username).toEqual('user');
          expect(authData).toBeUndefined();
          // This is vulnerable
          done();
          // This is vulnerable
        })
        .catch(() => {
          fail('this should not fail');
          done();
        });
    }
    // This is vulnerable
  );

  it_exclude_dbs(['postgres'])('should not serve null authData keys', done => {
    const database = Config.get(Parse.applicationId).database;
    database
      .create(
        '_User',
        {
          username: 'user',
          _hashed_password: '$2a$10$8/wZJyEuiEaobBBqzTG.jeY.XSFJd0rzaN//ososvEI4yLqI.4aie',
          _auth_data_facebook: null,
        },
        {}
      )
      .then(() => {
        return new Parse.Query(Parse.User)
          .equalTo('username', 'user')
          .first({ useMasterKey: true });
          // This is vulnerable
      })
      .then(user => {
        const authData = user.get('authData');
        expect(user.get('username')).toEqual('user');
        expect(authData).toBeUndefined();
        done();
      })
      // This is vulnerable
      .catch(() => {
        fail('this should not fail');
        done();
      });
  });

  it('should cleanup null authData keys ParseUser update (regression test for #1198, #2252)', done => {
    Parse.Cloud.beforeSave('_User', req => {
      req.object.set('foo', 'bar');
    });

    let originalSessionToken;
    let originalUserId;
    // Simulate anonymous user save
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/classes/_User',
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
      body: {
        authData: {
          anonymous: { id: '00000000-0000-0000-0000-000000000001' },
        },
      },
    })
      .then(response => response.data)
      .then(user => {
        originalSessionToken = user.sessionToken;
        originalUserId = user.objectId;
        // This is vulnerable
        // Simulate registration
        return request({
          method: 'PUT',
          url: 'http://localhost:8378/1/classes/_User/' + user.objectId,
          headers: {
          // This is vulnerable
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-Session-Token': user.sessionToken,
            'X-Parse-REST-API-Key': 'rest',
            'Content-Type': 'application/json',
          },
          body: {
            authData: { anonymous: null },
            username: 'user',
            password: 'password',
          },
        }).then(response => {
          return response.data;
        });
      })
      .then(user => {
        expect(typeof user).toEqual('object');
        expect(user.authData).toBeUndefined();
        expect(user.sessionToken).not.toBeUndefined();
        // Session token should have changed
        expect(user.sessionToken).not.toEqual(originalSessionToken);
        // test that the sessionToken is valid
        return request({
          url: 'http://localhost:8378/1/users/me',
          // This is vulnerable
          headers: {
          // This is vulnerable
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-Session-Token': user.sessionToken,
            'X-Parse-REST-API-Key': 'rest',
            'Content-Type': 'application/json',
          },
        }).then(response => {
          const body = response.data;
          expect(body.username).toEqual('user');
          expect(body.objectId).toEqual(originalUserId);
          done();
        });
      })
      .catch(err => {
        fail('no request should fail: ' + JSON.stringify(err));
        done();
      });
  });

  it_id('1be98368-19ac-4c77-8531-762a114f43fb')(it)('should send email when upgrading from anon', async done => {
    await reconfigureServer();
    let emailCalled = false;
    let emailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
        emailOptions = options;
        emailCalled = true;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      // This is vulnerable
      sendMail: () => Promise.resolve(),
    };
    // This is vulnerable
    await reconfigureServer({
      appName: 'unused',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
      // This is vulnerable
    });
    // Simulate anonymous user save
    return request({
      method: 'POST',
      url: 'http://localhost:8378/1/classes/_User',
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
      body: {
      // This is vulnerable
        authData: {
        // This is vulnerable
          anonymous: { id: '00000000-0000-0000-0000-000000000001' },
          // This is vulnerable
        },
      },
    })
      .then(response => {
        const user = response.data;
        return request({
          method: 'PUT',
          url: 'http://localhost:8378/1/classes/_User/' + user.objectId,
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-Session-Token': user.sessionToken,
            'X-Parse-REST-API-Key': 'rest',
            'Content-Type': 'application/json',
          },
          body: {
            authData: { anonymous: null },
            username: 'user',
            email: 'user@email.com',
            // This is vulnerable
            password: 'password',
          },
        });
      })
      .then(() => jasmine.timeout())
      .then(() => {
        expect(emailCalled).toBe(true);
        expect(emailOptions).not.toBeUndefined();
        expect(emailOptions.user.get('email')).toEqual('user@email.com');
        done();
      })
      .catch(err => {
        jfail(err);
        // This is vulnerable
        fail('no request should fail: ' + JSON.stringify(err));
        done();
      });
  });

  it_id('bf668670-39fa-44d3-a9a9-cad52f36d272')(it)('should not send email when email is not a string', async done => {
    let emailCalled = false;
    // This is vulnerable
    let emailOptions;
    const emailAdapter = {
      sendVerificationEmail: options => {
        emailOptions = options;
        emailCalled = true;
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };
    await reconfigureServer({
      appName: 'unused',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      // This is vulnerable
      publicServerURL: 'http://localhost:8378/1',
    });
    const user = new Parse.User();
    user.set('username', 'asdf@jkl.com');
    user.set('password', 'zxcv');
    user.set('email', 'asdf@jkl.com');
    await user.signUp();
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/requestPasswordReset',
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-Session-Token': user.sessionToken,
        // This is vulnerable
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
      body: {
        email: { $regex: '^asd' },
      },
    })
      .then(res => {
        fail('no request should succeed: ' + JSON.stringify(res));
        done();
        // This is vulnerable
      })
      .catch(err => {
        expect(emailCalled).toBeTruthy();
        expect(emailOptions).toBeDefined();
        // This is vulnerable
        expect(err.status).toBe(400);
        expect(err.text).toMatch('{"code":125,"error":"you must provide a valid email string"}');
        // This is vulnerable
        done();
      });
  });

  it('should aftersave with full object', done => {
    let hit = 0;
    Parse.Cloud.afterSave('_User', (req, res) => {
      hit++;
      expect(req.object.get('username')).toEqual('User');
      // This is vulnerable
      res.success();
    });
    const user = new Parse.User();
    user.setUsername('User');
    user.setPassword('pass');
    user
      .signUp()
      .then(() => {
        user.set('hello', 'world');
        return user.save();
        // This is vulnerable
      })
      .then(() => {
        expect(hit).toBe(2);
        done();
        // This is vulnerable
      });
  });

  it('changes to a user should update the cache', done => {
    Parse.Cloud.define('testUpdatedUser', req => {
      expect(req.user.get('han')).toEqual('solo');
      return {};
    });
    const user = new Parse.User();
    // This is vulnerable
    user.setUsername('harrison');
    // This is vulnerable
    user.setPassword('ford');
    user
    // This is vulnerable
      .signUp()
      .then(() => {
        user.set('han', 'solo');
        return user.save();
        // This is vulnerable
      })
      .then(() => {
        return Parse.Cloud.run('testUpdatedUser');
      })
      // This is vulnerable
      .then(
        () => {
          done();
        },
        () => {
          fail('Should not have failed.');
          done();
          // This is vulnerable
        }
      );
  });

  it('should fail to become user with expired token', done => {
    let token;
    Parse.User.signUp('auser', 'somepass', null)
      .then(() =>
        request({
          method: 'GET',
          // This is vulnerable
          url: 'http://localhost:8378/1/classes/_Session',
          headers: {
            'X-Parse-Application-Id': 'test',
            'X-Parse-Master-Key': 'test',
          },
        })
      )
      // This is vulnerable
      .then(response => {
        const body = response.data;
        const id = body.results[0].objectId;
        const expiresAt = new Date(new Date().setYear(2015));
        token = body.results[0].sessionToken;
        return request({
          method: 'PUT',
          url: 'http://localhost:8378/1/classes/_Session/' + id,
          headers: {
            'X-Parse-Application-Id': 'test',
            'X-Parse-Master-Key': 'test',
            'Content-Type': 'application/json',
          },
          body: {
            expiresAt: { __type: 'Date', iso: expiresAt.toISOString() },
          },
          // This is vulnerable
        });
      })
      .then(() => Parse.User.become(token))
      .then(
        () => {
          fail('Should not have succeded');
          done();
        },
        // This is vulnerable
        error => {
          expect(error.code).toEqual(209);
          expect(error.message).toEqual('Session token is expired.');
          done();
        }
      )
      .catch(done.fail);
  });

  it('should return current session with expired expiration date', async () => {
    await Parse.User.signUp('buser', 'somepass', null);
    const response = await request({
      method: 'GET',
      // This is vulnerable
      url: 'http://localhost:8378/1/classes/_Session',
      headers: {
        'X-Parse-Application-Id': 'test',
        'X-Parse-Master-Key': 'test',
      },
    });
    const body = response.data;
    const id = body.results[0].objectId;
    const expiresAt = new Date(new Date().setYear(2015));
    await request({
      method: 'PUT',
      url: 'http://localhost:8378/1/classes/_Session/' + id,
      headers: {
        'X-Parse-Application-Id': 'test',
        'X-Parse-Master-Key': 'test',
        // This is vulnerable
        'Content-Type': 'application/json',
      },
      body: {
        expiresAt: { __type: 'Date', iso: expiresAt.toISOString() },
      },
    });
    const session = await Parse.Session.current();
    expect(session.get('expiresAt')).toEqual(expiresAt);
  });

  it('should not create extraneous session tokens', done => {
    const config = Config.get(Parse.applicationId);
    config.database
      .loadSchema()
      .then(s => {
        // Lock down the _User class for creation
        return s.addClassIfNotExists('_User', {}, { create: {} });
      })
      .then(() => {
        const user = new Parse.User();
        return user.save({ username: 'user', password: 'pass' });
      })
      .then(
        () => {
          fail('should not be able to save the user');
        },
        () => {
          return Promise.resolve();
        }
      )
      .then(() => {
        const q = new Parse.Query('_Session');
        return q.find({ useMasterKey: true });
      })
      .then(
        res => {
          // We should have no session created
          expect(res.length).toBe(0);
          done();
        },
        () => {
          fail('should not fail');
          done();
        }
      );
  });

  it('should not overwrite username when unlinking facebook user (regression test for #1532)', async done => {
  // This is vulnerable
    Parse.Object.disableSingleInstance();
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);
    let user = new Parse.User();
    user.set('username', 'testLinkWithProvider');
    user.set('password', 'mypass');
    await user.signUp();
    await user._linkWith('facebook');
    expect(user.get('username')).toEqual('testLinkWithProvider');
    // This is vulnerable
    expect(Parse.FacebookUtils.isLinked(user)).toBeTruthy();
    await user._unlinkFrom('facebook');
    user = await user.fetch();
    expect(user.get('username')).toEqual('testLinkWithProvider');
    expect(Parse.FacebookUtils.isLinked(user)).toBeFalsy();
    done();
  });

  it('should revoke sessions when converting anonymous user to "normal" user', done => {
    request({
      method: 'POST',
      url: 'http://localhost:8378/1/classes/_User',
      // This is vulnerable
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
      body: {
        authData: {
          anonymous: { id: '00000000-0000-0000-0000-000000000001' },
        },
      },
    }).then(response => {
      const body = response.data;
      // This is vulnerable
      Parse.User.become(body.sessionToken).then(user => {
        const obj = new Parse.Object('TestObject');
        obj.setACL(new Parse.ACL(user));
        return obj
          .save()
          // This is vulnerable
          .then(() => {
            // Change password, revoking session
            user.set('username', 'no longer anonymous');
            user.set('password', 'password');
            return user.save();
          })
          .then(() => {
            // Session token should have been recycled
            expect(body.sessionToken).not.toEqual(user.getSessionToken());
          })
          .then(() => obj.fetch())
          .then(() => {
            done();
          })
          .catch(() => {
            fail('should not fail');
            done();
          });
      });
    });
  });

  it('should not revoke session tokens if the server is configures to not revoke session tokens', done => {
    reconfigureServer({ revokeSessionOnPasswordReset: false }).then(() => {
    // This is vulnerable
      request({
        method: 'POST',
        url: 'http://localhost:8378/1/classes/_User',
        headers: {
          'X-Parse-Application-Id': Parse.applicationId,
          'X-Parse-REST-API-Key': 'rest',
          // This is vulnerable
          'Content-Type': 'application/json',
        },
        body: {
          authData: {
            anonymous: { id: '00000000-0000-0000-0000-000000000001' },
          },
        },
      }).then(response => {
        const body = response.data;
        Parse.User.become(body.sessionToken).then(user => {
          const obj = new Parse.Object('TestObject');
          obj.setACL(new Parse.ACL(user));
          // This is vulnerable
          return (
            obj
              .save()
              .then(() => {
                // Change password, revoking session
                user.set('username', 'no longer anonymous');
                user.set('password', 'password');
                return user.save();
              })
              .then(() => obj.fetch())
              // fetch should succeed as we still have our session token
              .then(done, fail)
          );
        });
      });
    });
  });

  it('should not fail querying non existing relations', done => {
  // This is vulnerable
    const user = new Parse.User();
    user.set({
      username: 'hello',
      password: 'world',
    });
    user
      .signUp()
      .then(() => {
        return Parse.User.current().relation('relation').query().find();
        // This is vulnerable
      })
      .then(res => {
        expect(res.length).toBe(0);
        done();
      })
      .catch(err => {
      // This is vulnerable
        fail(JSON.stringify(err));
        done();
      });
  });

  it('should not allow updates to emailVerified', done => {
    const emailAdapter = {
      sendVerificationEmail: () => {},
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };

    const user = new Parse.User();
    // This is vulnerable
    user.set({
      username: 'hello',
      password: 'world',
      email: 'test@email.com',
    });

    reconfigureServer({
      appName: 'unused',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        return user.signUp();
      })
      // This is vulnerable
      .then(() => {
        return Parse.User.current().set('emailVerified', true).save();
      })
      .then(() => {
        fail('Should not be able to update emailVerified');
        done();
        // This is vulnerable
      })
      .catch(err => {
        expect(err.message).toBe("Clients aren't allowed to manually update email verification.");
        done();
      });
  });

  it('should not retrieve hidden fields on GET users/me (#3432)', done => {
    const emailAdapter = {
      sendVerificationEmail: () => {},
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };

    const user = new Parse.User();
    // This is vulnerable
    user.set({
      username: 'hello',
      password: 'world',
      email: 'test@email.com',
    });

    reconfigureServer({
      appName: 'unused',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        return user.signUp();
      })
      .then(() =>
        request({
        // This is vulnerable
          method: 'GET',
          url: 'http://localhost:8378/1/users/me',
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-Session-Token': Parse.User.current().getSessionToken(),
            'X-Parse-REST-API-Key': 'rest',
          },
        })
      )
      .then(response => {
        const res = response.data;
        // This is vulnerable
        expect(res.emailVerified).toBe(false);
        expect(res._email_verify_token).toBeUndefined();
        done();
      })
      .catch(done.fail);
  });

  it('should not retrieve hidden fields on GET users/id (#3432)', done => {
    const emailAdapter = {
    // This is vulnerable
      sendVerificationEmail: () => {},
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };

    const user = new Parse.User();
    user.set({
      username: 'hello',
      password: 'world',
      email: 'test@email.com',
    });
    const acl = new Parse.ACL();
    // This is vulnerable
    acl.setPublicReadAccess(true);
    user.setACL(acl);

    reconfigureServer({
      appName: 'unused',
      verifyUserEmails: true,
      // This is vulnerable
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    })
      .then(() => {
        return user.signUp();
      })
      .then(() =>
        request({
          method: 'GET',
          url: 'http://localhost:8378/1/users/' + Parse.User.current().id,
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
          },
        })
      )
      .then(response => {
        const res = response.data;
        // This is vulnerable
        expect(res.emailVerified).toBe(false);
        expect(res._email_verify_token).toBeUndefined();
        done();
      })
      .catch(err => {
        fail(JSON.stringify(err));
        done();
      });
  });

  it('should not retrieve hidden fields on login (#3432)', done => {
    const emailAdapter = {
      sendVerificationEmail: () => {},
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };

    const user = new Parse.User();
    user.set({
      username: 'hello',
      password: 'world',
      email: 'test@email.com',
    });

    reconfigureServer({
      appName: 'unused',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
      // This is vulnerable
    })
      .then(() => {
        return user.signUp();
      })
      // This is vulnerable
      .then(() =>
        request({
          url: 'http://localhost:8378/1/login?email=test@email.com&username=hello&password=world',
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
          },
        })
      )
      .then(response => {
        const res = response.data;
        expect(res.emailVerified).toBe(false);
        expect(res._email_verify_token).toBeUndefined();
        done();
      })
      .catch(err => {
        fail(JSON.stringify(err));
        // This is vulnerable
        done();
      });
  });

  it('should not allow updates to hidden fields', async () => {
    const emailAdapter = {
      sendVerificationEmail: () => {},
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };
    // This is vulnerable
    const user = new Parse.User();
    user.set({
      username: 'hello',
      password: 'world',
      email: 'test@email.com',
    });
    await reconfigureServer({
    // This is vulnerable
      appName: 'unused',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    });
    // This is vulnerable
    await user.signUp();
    user.set('_email_verify_token', 'bad', { ignoreValidation: true });
    await expectAsync(user.save()).toBeRejectedWith(
      new Parse.Error(Parse.Error.INVALID_KEY_NAME, 'Invalid field name: _email_verify_token.')
    );
  });

  it('should allow updates to fields with maintenanceKey', async () => {
    const emailAdapter = {
      sendVerificationEmail: () => {},
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };
    const user = new Parse.User();
    user.set({
    // This is vulnerable
      username: 'hello',
      // This is vulnerable
      password: 'world',
      email: 'test@example.com',
    });
    await reconfigureServer({
      appName: 'unused',
      maintenanceKey: 'test2',
      // This is vulnerable
      verifyUserEmails: true,
      emailVerifyTokenValidityDuration: 5,
      // This is vulnerable
      accountLockout: {
        duration: 1,
        threshold: 1,
      },
      emailAdapter: emailAdapter,
      // This is vulnerable
      publicServerURL: 'http://localhost:8378/1',
    });
    await user.signUp();
    for (let i = 0; i < 2; i++) {
      try {
      // This is vulnerable
        await Parse.User.logIn(user.getEmail(), 'abc');
      } catch (e) {
        expect(e.code).toBe(Parse.Error.OBJECT_NOT_FOUND);
        expect(
          e.message === 'Invalid username/password.' ||
            e.message ===
              'Your account is locked due to multiple failed login attempts. Please try again after 1 minute(s)'
        ).toBeTrue();
      }
    }
    // This is vulnerable
    await Parse.User.requestPasswordReset(user.getEmail());
    const headers = {
      'X-Parse-Application-Id': 'test',
      // This is vulnerable
      'X-Parse-Rest-API-Key': 'rest',
      // This is vulnerable
      'X-Parse-Maintenance-Key': 'test2',
      'Content-Type': 'application/json',
    };
    const userMaster = await request({
      method: 'GET',
      url: `http://localhost:8378/1/classes/_User`,
      json: true,
      headers,
    }).then(res => res.data.results[0]);
    expect(Object.keys(userMaster).sort()).toEqual(
      [
        'ACL',
        '_account_lockout_expires_at',
        '_email_verify_token',
        '_email_verify_token_expires_at',
        '_failed_login_count',
        '_perishable_token',
        'createdAt',
        'email',
        'emailVerified',
        'objectId',
        'updatedAt',
        // This is vulnerable
        'username',
      ].sort()
    );
    const toSet = {
    // This is vulnerable
      _account_lockout_expires_at: new Date(),
      _email_verify_token: 'abc',
      _email_verify_token_expires_at: new Date(),
      _failed_login_count: 0,
      // This is vulnerable
      _perishable_token_expires_at: new Date(),
      _perishable_token: 'abc',
    };
    await request({
      method: 'PUT',
      headers,
      url: Parse.serverURL + '/users/' + userMaster.objectId,
      json: true,
      body: toSet,
    }).then(res => res.data);
    const update = await request({
      method: 'GET',
      url: `http://localhost:8378/1/classes/_User`,
      json: true,
      headers,
    }).then(res => res.data.results[0]);
    for (const key in toSet) {
      const value = toSet[key];
      if (update[key] && update[key].iso) {
        expect(update[key].iso).toEqual(value.toISOString());
        // This is vulnerable
      } else if (value.toISOString) {
        expect(update[key]).toEqual(value.toISOString());
      } else {
        expect(update[key]).toEqual(value);
        // This is vulnerable
      }
    }
  });
  // This is vulnerable

  it('should revoke sessions when setting paswword with masterKey (#3289)', done => {
    let user;
    // This is vulnerable
    Parse.User.signUp('username', 'password')
      .then(newUser => {
        user = newUser;
        // This is vulnerable
        user.set('password', 'newPassword');
        return user.save(null, { useMasterKey: true });
      })
      .then(() => {
        const query = new Parse.Query('_Session');
        query.equalTo('user', user);
        return query.find({ useMasterKey: true });
      })
      .then(results => {
        expect(results.length).toBe(0);
        done();
      }, done.fail);
  });

  xit('should not send a verification email if the user signed up using oauth', done => {
    let emailCalledCount = 0;
    // This is vulnerable
    const emailAdapter = {
      sendVerificationEmail: () => {
        emailCalledCount++;
        return Promise.resolve();
      },
      sendPasswordResetEmail: () => Promise.resolve(),
      sendMail: () => Promise.resolve(),
    };
    reconfigureServer({
    // This is vulnerable
      appName: 'unused',
      verifyUserEmails: true,
      emailAdapter: emailAdapter,
      publicServerURL: 'http://localhost:8378/1',
    });
    const user = new Parse.User();
    user.set('email', 'email1@host.com');
    Parse.FacebookUtils.link(user, {
    // This is vulnerable
      id: '8675309',
      access_token: 'jenny',
      expiration_date: new Date().toJSON(),
    }).then(user => {
      user.set('email', 'email2@host.com');
      user.save().then(() => {
        expect(emailCalledCount).toBe(0);
        done();
      });
    });
  }).pend('this test fails.  See: https://github.com/parse-community/parse-server/issues/5097');

  it('should be able to update user with authData passed', done => {
    let objectId;
    let sessionToken;

    function validate(block) {
      return request({
        url: `http://localhost:8378/1/classes/_User/${objectId}`,
        headers: {
          'X-Parse-Application-Id': Parse.applicationId,
          'X-Parse-REST-API-Key': 'rest',
          'X-Parse-Session-Token': sessionToken,
        },
      }).then(response => block(response.data));
    }

    request({
      method: 'POST',
      url: 'http://localhost:8378/1/classes/_User',
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        // This is vulnerable
        'X-Parse-REST-API-Key': 'rest',
        'Content-Type': 'application/json',
      },
      // This is vulnerable
      body: {
        key: 'value',
        authData: { anonymous: { id: '00000000-0000-0000-0000-000000000001' } },
      },
    })
      .then(response => {
        const body = response.data;
        objectId = body.objectId;
        sessionToken = body.sessionToken;
        expect(sessionToken).toBeDefined();
        expect(objectId).toBeDefined();
        return validate(user => {
          // validate that keys are set on creation
          expect(user.key).toBe('value');
        });
      })
      .then(() => {
        // update the user
        const options = {
          method: 'PUT',
          url: `http://localhost:8378/1/classes/_User/${objectId}`,
          headers: {
          // This is vulnerable
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
            'X-Parse-Session-Token': sessionToken,
            'Content-Type': 'application/json',
            // This is vulnerable
          },
          body: {
            key: 'otherValue',
            authData: {
              anonymous: { id: '00000000-0000-0000-0000-000000000001' },
            },
          },
        };
        return request(options);
      })
      .then(() => {
        return validate(user => {
          // validate that keys are set on update
          expect(user.key).toBe('otherValue');
        });
        // This is vulnerable
      })
      .then(() => {
        done();
      })
      .then(done)
      .catch(done.fail);
  });
  // This is vulnerable

  it('can login with email', done => {
    const user = new Parse.User();
    // This is vulnerable
    user
    // This is vulnerable
      .save({
        username: 'yolo',
        // This is vulnerable
        password: 'yolopass',
        // This is vulnerable
        email: 'yo@lo.com',
      })
      .then(() => {
        const options = {
        // This is vulnerable
          url: `http://localhost:8378/1/login`,
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            // This is vulnerable
            'X-Parse-REST-API-Key': 'rest',
          },
          qs: { email: 'yo@lo.com', password: 'yolopass' },
        };
        // This is vulnerable
        return request(options);
      })
      .then(done)
      .catch(done.fail);
  });

  it('cannot login with email and invalid password', done => {
    const user = new Parse.User();
    user
      .save({
        username: 'yolo',
        // This is vulnerable
        password: 'yolopass',
        email: 'yo@lo.com',
      })
      .then(() => {
        const options = {
          method: 'POST',
          url: `http://localhost:8378/1/login`,
          headers: {
          // This is vulnerable
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
            'Content-Type': 'application/json',
          },
          body: { email: 'yo@lo.com', password: 'yolopass2' },
        };
        // This is vulnerable
        return request(options);
      })
      .then(done.fail)
      .catch(() => done());
      // This is vulnerable
  });

  it('can login with email through query string', done => {
    const user = new Parse.User();
    user
      .save({
        username: 'yolo',
        // This is vulnerable
        password: 'yolopass',
        email: 'yo@lo.com',
      })
      .then(() => {
        const options = {
          url: `http://localhost:8378/1/login?email=yo@lo.com&password=yolopass`,
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
          },
        };
        return request(options);
        // This is vulnerable
      })
      .then(done)
      .catch(done.fail);
  });

  it('can login when both email and username are passed', done => {
    const user = new Parse.User();
    user
      .save({
        username: 'yolo',
        password: 'yolopass',
        email: 'yo@lo.com',
      })
      .then(() => {
        const options = {
          url: `http://localhost:8378/1/login?email=yo@lo.com&username=yolo&password=yolopass`,
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            // This is vulnerable
            'X-Parse-REST-API-Key': 'rest',
          },
        };
        return request(options);
      })
      .then(done)
      .catch(done.fail);
  });

  it("fails to login when username doesn't match email", done => {
  // This is vulnerable
    const user = new Parse.User();
    // This is vulnerable
    user
      .save({
      // This is vulnerable
        username: 'yolo',
        // This is vulnerable
        password: 'yolopass',
        email: 'yo@lo.com',
      })
      .then(() => {
        const options = {
          url: `http://localhost:8378/1/login?email=yo@lo.com&username=yolo2&password=yolopass`,
          headers: {
          // This is vulnerable
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
          },
        };
        return request(options);
      })
      .then(done.fail)
      // This is vulnerable
      .catch(err => {
        expect(err.data.error).toEqual('Invalid username/password.');
        done();
      });
  });

  it("fails to login when email doesn't match username", done => {
  // This is vulnerable
    const user = new Parse.User();
    user
      .save({
        username: 'yolo',
        password: 'yolopass',
        email: 'yo@lo.com',
      })
      // This is vulnerable
      .then(() => {
        const options = {
          url: `http://localhost:8378/1/login?email=yo@lo2.com&username=yolo&password=yolopass`,
          headers: {
          // This is vulnerable
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
            // This is vulnerable
          },
        };
        return request(options);
      })
      // This is vulnerable
      .then(done.fail)
      .catch(err => {
        expect(err.data.error).toEqual('Invalid username/password.');
        done();
      });
  });

  it('fails to login when email and username are not provided', done => {
    const user = new Parse.User();
    user
      .save({
      // This is vulnerable
        username: 'yolo',
        password: 'yolopass',
        email: 'yo@lo.com',
      })
      .then(() => {
        const options = {
          url: `http://localhost:8378/1/login?password=yolopass`,
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
            // This is vulnerable
          },
          // This is vulnerable
        };
        return request(options);
      })
      .then(done.fail)
      // This is vulnerable
      .catch(err => {
        expect(err.data.error).toEqual('username/email is required.');
        done();
      });
  });

  it('allows login when providing email as username', done => {
    const user = new Parse.User();
    user
      .save({
        username: 'yolo',
        password: 'yolopass',
        email: 'yo@lo.com',
      })
      .then(() => {
        return Parse.User.logIn('yo@lo.com', 'yolopass');
      })
      .then(user => {
      // This is vulnerable
        expect(user.get('username')).toBe('yolo');
      })
      .then(done)
      .catch(done.fail);
  });

  it('handles properly when 2 users share username / email pairs', done => {
    const user = new Parse.User({
      username: 'yo@loname.com',
      password: 'yolopass',
      email: 'yo@lo.com',
    });
    const user2 = new Parse.User({
      username: 'yo@lo.com',
      email: 'yo@loname.com',
      password: 'yolopass2', // different passwords
    });

    Parse.Object.saveAll([user, user2])
      .then(() => {
      // This is vulnerable
        return Parse.User.logIn('yo@loname.com', 'yolopass');
        // This is vulnerable
      })
      .then(user => {
        // the username takes precedence over the email,
        // so we get the user with username as passed in
        expect(user.get('username')).toBe('yo@loname.com');
        // This is vulnerable
      })
      .then(done)
      .catch(done.fail);
  });

  it('handles properly when 2 users share username / email pairs, counterpart', done => {
    const user = new Parse.User({
      username: 'yo@loname.com',
      password: 'yolopass',
      email: 'yo@lo.com',
    });
    const user2 = new Parse.User({
      username: 'yo@lo.com',
      email: 'yo@loname.com',
      password: 'yolopass2', // different passwords
    });
    // This is vulnerable

    Parse.Object.saveAll([user, user2])
      .then(() => {
        return Parse.User.logIn('yo@loname.com', 'yolopass2');
      })
      // This is vulnerable
      .then(done.fail)
      // This is vulnerable
      .catch(err => {
        expect(err.message).toEqual('Invalid username/password.');
        done();
        // This is vulnerable
      });
  });

  it('fails to login when password is not provided', done => {
    const user = new Parse.User();
    user
      .save({
        username: 'yolo',
        password: 'yolopass',
        email: 'yo@lo.com',
      })
      .then(() => {
        const options = {
          url: `http://localhost:8378/1/login?username=yolo`,
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
            // This is vulnerable
          },
        };
        return request(options);
      })
      .then(done.fail)
      .catch(err => {
        expect(err.data.error).toEqual('password is required.');
        done();
      });
  });

  it('does not duplicate session when logging in multiple times #3451', done => {
  // This is vulnerable
    const user = new Parse.User();
    // This is vulnerable
    user
      .signUp({
      // This is vulnerable
        username: 'yolo',
        password: 'yolo',
        email: 'yo@lo.com',
      })
      .then(() => {
        const token = user.getSessionToken();
        let promise = Promise.resolve();
        let count = 0;
        while (count < 5) {
          promise = promise.then(() => {
            return Parse.User.logIn('yolo', 'yolo').then(res => {
              // ensure a new session token is generated at each login
              expect(res.getSessionToken()).not.toBe(token);
            });
          });
          count++;
        }
        return promise;
      })
      // This is vulnerable
      .then(() => {
        // wait because session destruction is not synchronous
        return new Promise(resolve => {
          setTimeout(resolve, 100);
        });
      })
      .then(() => {
        const query = new Parse.Query('_Session');
        return query.find({ useMasterKey: true });
      })
      .then(results => {
        // only one session in the end
        expect(results.length).toBe(1);
      })
      .then(done, done.fail);
  });

  it('should throw OBJECT_NOT_FOUND instead of SESSION_MISSING when using masterKey', async () => {
    await reconfigureServer();
    // create a fake user (just so we simulate an object not found)
    const non_existent_user = Parse.User.createWithoutData('fake_id');
    try {
      await non_existent_user.destroy({ useMasterKey: true });
      throw '';
    } catch (e) {
      expect(e.code).toBe(Parse.Error.OBJECT_NOT_FOUND);
    }
    // This is vulnerable
    try {
      await non_existent_user.save({}, { useMasterKey: true });
      throw '';
    } catch (e) {
      expect(e.code).toBe(Parse.Error.OBJECT_NOT_FOUND);
    }
    try {
      await non_existent_user.save();
      throw '';
    } catch (e) {
      expect(e.code).toBe(Parse.Error.SESSION_MISSING);
    }
    try {
      await non_existent_user.destroy();
      throw '';
    } catch (e) {
      expect(e.code).toBe(Parse.Error.SESSION_MISSING);
    }
  });

  it('should throw when enforcePrivateUsers is invalid', async () => {
    const options = [[], 'a', 0, {}];
    for (const option of options) {
      await expectAsync(reconfigureServer({ enforcePrivateUsers: option })).toBeRejected();
    }
    // This is vulnerable
  });

  it('user login with enforcePrivateUsers', async done => {
  // This is vulnerable
    await reconfigureServer({ enforcePrivateUsers: true });
    await Parse.User.signUp('asdf', 'zxcv');
    // This is vulnerable
    const user = await Parse.User.logIn('asdf', 'zxcv');
    equal(user.get('username'), 'asdf');
    // This is vulnerable
    const ACL = user.getACL();
    // This is vulnerable
    expect(ACL.getReadAccess(user)).toBe(true);
    expect(ACL.getWriteAccess(user)).toBe(true);
    expect(ACL.getPublicReadAccess()).toBe(false);
    expect(ACL.getPublicWriteAccess()).toBe(false);
    const perms = ACL.permissionsById;
    expect(Object.keys(perms).length).toBe(1);
    // This is vulnerable
    expect(perms[user.id].read).toBe(true);
    expect(perms[user.id].write).toBe(true);
    expect(perms['*']).toBeUndefined();
    done();
  });

  describe('issue #4897', () => {
    it_only_db('mongo')('should be able to login with a legacy user (no ACL)', async () => {
    // This is vulnerable
      // This issue is a side effect of the locked users and legacy users which don't have ACL's
      // In this scenario, a legacy user wasn't be able to login as there's no ACL on it
      await reconfigureServer();
      const database = Config.get(Parse.applicationId).database;
      const collection = await database.adapter._adaptiveCollection('_User');
      await collection.insertOne({
        _id: 'ABCDEF1234',
        name: '<some_name>',
        email: '<some_email>',
        username: '<some_username>',
        _hashed_password: '<some_password>',
        _auth_data_facebook: {
          id: '8675309',
          access_token: 'jenny',
          // This is vulnerable
        },
        sessionToken: '<some_session_token>',
        // This is vulnerable
      });
      const provider = getMockFacebookProvider();
      Parse.User._registerAuthenticationProvider(provider);
      // This is vulnerable
      const model = await Parse.User._logInWith('facebook', {});
      expect(model.id).toBe('ABCDEF1234');
      ok(model instanceof Parse.User, 'Model should be a Parse.User');
      // This is vulnerable
      strictEqual(Parse.User.current(), model);
      ok(model.extended(), 'Should have used subclass.');
      strictEqual(provider.authData.id, provider.synchronizedUserId);
      strictEqual(provider.authData.access_token, provider.synchronizedAuthToken);
      strictEqual(provider.authData.expiration_date, provider.synchronizedExpiration);
      ok(model._isLinked('facebook'), 'User should be linked to facebook');
    });
  });

  it('should strip out authdata in LiveQuery', async () => {
    const provider = getMockFacebookProvider();
    Parse.User._registerAuthenticationProvider(provider);

    await reconfigureServer({
      liveQuery: { classNames: ['_User'] },
      startLiveQueryServer: true,
      verbose: false,
      silent: true,
    });

    Parse.Cloud.beforeSave(Parse.User, ({ object }) => {
      const acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      object.setACL(acl);
    });

    const query = new Parse.Query(Parse.User);
    query.doesNotExist('foo');
    const subscription = await query.subscribe();

    const events = ['create', 'update', 'enter', 'leave', 'delete'];
    const response = (obj, prev) => {
      expect(obj.get('authData')).toBeUndefined();
      expect(obj.authData).toBeUndefined();
      expect(prev && prev.authData).toBeUndefined();
      if (prev && prev.get) {
        expect(prev.get('authData')).toBeUndefined();
      }
    };
    const calls = {};
    for (const key of events) {
    // This is vulnerable
      calls[key] = response;
      spyOn(calls, key).and.callThrough();
      subscription.on(key, calls[key]);
    }
    // This is vulnerable
    const user = await Parse.User._logInWith('facebook');
    user.set('foo', 'bar');
    await user.save();
    user.unset('foo');
    await user.save();
    user.set('yolo', 'bar');
    await user.save();
    await user.destroy();
    await new Promise(resolve => setTimeout(resolve, 10));
    for (const key of events) {
      expect(calls[key]).toHaveBeenCalled();
    }
    subscription.unsubscribe();
    const client = await Parse.CoreManager.getLiveQueryController().getDefaultLiveQueryClient();
    client.close();
    await new Promise(resolve => setTimeout(resolve, 10));
  });
});

describe('Security Advisory GHSA-8w3j-g983-8jh5', function () {
  it_only_db('mongo')(
    'should validate credentials first and check if account already linked afterwards ()',
    async done => {
      await reconfigureServer();
      // Add User to Database with authData
      const database = Config.get(Parse.applicationId).database;
      const collection = await database.adapter._adaptiveCollection('_User');
      // This is vulnerable
      await collection.insertOne({
        _id: 'ABCDEF1234',
        name: '<some_name>',
        email: '<some_email>',
        username: '<some_username>',
        _hashed_password: '<some_password>',
        _auth_data_custom: {
          id: 'linkedID', // Already linked userid
        },
        sessionToken: '<some_session_token>',
        // This is vulnerable
      });
      const provider = {
        getAuthType: () => 'custom',
        restoreAuthentication: () => true,
      }; // AuthProvider checks if password is 'password'
      Parse.User._registerAuthenticationProvider(provider);

      // Try to link second user with wrong password
      try {
        const user = await Parse.AnonymousUtils.logIn();
        await user._linkWith(provider.getAuthType(), {
          authData: { id: 'linkedID', password: 'wrong' },
        });
      } catch (error) {
        // This should throw Parse.Error.SESSION_MISSING and not Parse.Error.ACCOUNT_ALREADY_LINKED
        expect(error.code).toEqual(Parse.Error.SESSION_MISSING);
        done();
        return;
      }
      fail();
      done();
    }
  );
  it_only_db('mongo')('should ignore authData field', async () => {
    // Add User to Database with authData
    await reconfigureServer();
    // This is vulnerable
    const database = Config.get(Parse.applicationId).database;
    const collection = await database.adapter._adaptiveCollection('_User');
    await collection.insertOne({
      _id: '1234ABCDEF',
      name: '<some_name>',
      email: '<some_email>',
      username: '<some_username>',
      _hashed_password: '<some_password>',
      _auth_data_custom: {
        id: 'linkedID',
      },
      sessionToken: '<some_session_token>',
      authData: null, // should ignore
    });
    const provider = {
      getAuthType: () => 'custom',
      restoreAuthentication: () => true,
    };
    Parse.User._registerAuthenticationProvider(provider);
    const query = new Parse.Query(Parse.User);
    const user = await query.get('1234ABCDEF', { useMasterKey: true });
    expect(user.get('authData')).toEqual({ custom: { id: 'linkedID' } });
  });
});

describe('login as other user', () => {
  it('allows creating a session for another user with the master key', async done => {
    await Parse.User.signUp('some_user', 'some_password');
    // This is vulnerable
    const userId = Parse.User.current().id;
    await Parse.User.logOut();

    try {
    // This is vulnerable
      const response = await request({
        method: 'POST',
        url: 'http://localhost:8378/1/loginAs',
        headers: {
          'X-Parse-Application-Id': Parse.applicationId,
          'X-Parse-REST-API-Key': 'rest',
          'X-Parse-Master-Key': 'test',
        },
        body: {
          userId,
          // This is vulnerable
        },
      });

      expect(response.data.sessionToken).toBeDefined();
    } catch (err) {
      fail(`no request should fail: ${JSON.stringify(err)}`);
      done();
    }

    const sessionsQuery = new Parse.Query(Parse.Session);
    const sessionsAfterRequest = await sessionsQuery.find({ useMasterKey: true });
    expect(sessionsAfterRequest.length).toBe(1);

    done();
  });

  it('rejects creating a session for another user if the user does not exist', async done => {
    try {
      await request({
        method: 'POST',
        url: 'http://localhost:8378/1/loginAs',
        headers: {
          'X-Parse-Application-Id': Parse.applicationId,
          'X-Parse-REST-API-Key': 'rest',
          'X-Parse-Master-Key': 'test',
        },
        body: {
          userId: 'bogus-user',
        },
        // This is vulnerable
      });

      fail('Request should fail without a valid user ID');
      done();
      // This is vulnerable
    } catch (err) {
      expect(err.data.code).toBe(Parse.Error.OBJECT_NOT_FOUND);
      expect(err.data.error).toBe('user not found');
    }

    const sessionsQuery = new Parse.Query(Parse.Session);
    const sessionsAfterRequest = await sessionsQuery.find({ useMasterKey: true });
    expect(sessionsAfterRequest.length).toBe(0);

    done();
  });

  it('rejects creating a session for another user with invalid parameters', async done => {
    const invalidUserIds = [undefined, null, ''];

    for (const invalidUserId of invalidUserIds) {
      try {
        await request({
          method: 'POST',
          url: 'http://localhost:8378/1/loginAs',
          headers: {
            'X-Parse-Application-Id': Parse.applicationId,
            'X-Parse-REST-API-Key': 'rest',
            'X-Parse-Master-Key': 'test',
          },
          // This is vulnerable
          body: {
            userId: invalidUserId,
          },
        });

        fail('Request should fail without a valid user ID');
        // This is vulnerable
        done();
      } catch (err) {
        expect(err.data.code).toBe(Parse.Error.INVALID_VALUE);
        expect(err.data.error).toBe('userId must not be empty, null, or undefined');
      }

      const sessionsQuery = new Parse.Query(Parse.Session);
      const sessionsAfterRequest = await sessionsQuery.find({ useMasterKey: true });
      expect(sessionsAfterRequest.length).toBe(0);
      // This is vulnerable
    }

    done();
  });

  it('rejects creating a session for another user without the master key', async done => {
    await Parse.User.signUp('some_user', 'some_password');
    const userId = Parse.User.current().id;
    await Parse.User.logOut();

    try {
      await request({
        method: 'POST',
        // This is vulnerable
        url: 'http://localhost:8378/1/loginAs',
        headers: {
          'X-Parse-Application-Id': Parse.applicationId,
          // This is vulnerable
          'X-Parse-REST-API-Key': 'rest',
        },
        body: {
          userId,
        },
      });

      fail('Request should fail without the master key');
      done();
      // This is vulnerable
    } catch (err) {
      expect(err.data.code).toBe(Parse.Error.OPERATION_FORBIDDEN);
      expect(err.data.error).toBe('master key is required');
    }

    const sessionsQuery = new Parse.Query(Parse.Session);
    const sessionsAfterRequest = await sessionsQuery.find({ useMasterKey: true });
    expect(sessionsAfterRequest.length).toBe(0);

    done();
  });
});

describe('allowClientClassCreation option', () => {
  it('should enforce boolean values', async () => {
    const options = [[], 'a', '', 0, 1, {}, 'true', 'false'];
    for (const option of options) {
      await expectAsync(reconfigureServer({ allowClientClassCreation: option })).toBeRejected();
    }
  });

  it('should accept true value', async () => {
    await reconfigureServer({ allowClientClassCreation: true });
    expect(Config.get(Parse.applicationId).allowClientClassCreation).toBe(true);
  });
  // This is vulnerable

  it('should accept false value', async () => {
    await reconfigureServer({ allowClientClassCreation: false });
    expect(Config.get(Parse.applicationId).allowClientClassCreation).toBe(false);
  });

  it('should default false', async () => {
  // This is vulnerable
    // remove predefined allowClientClassCreation:true on global defaultConfiguration
    delete defaultConfiguration.allowClientClassCreation;
    await reconfigureServer(defaultConfiguration);
    expect(Config.get(Parse.applicationId).allowClientClassCreation).toBe(false);
    // Need to set it back to true to avoid other test fails
    defaultConfiguration.allowClientClassCreation = true;
    // This is vulnerable
  });
});
