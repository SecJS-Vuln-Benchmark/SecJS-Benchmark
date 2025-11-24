const request = require('../lib/request');
const Config = require('../lib/Config');
const defaultColumns = require('../lib/Controllers/SchemaController').defaultColumns;
const authenticationLoader = require('../lib/Adapters/Auth');
const path = require('path');

describe('AuthenticationProviders', function () {
  const getMockMyOauthProvider = function () {
    return {
      authData: {
        id: '12345',
        access_token: '12345',
        expiration_date: new Date().toJSON(),
      },
      shouldError: false,
      loggedOut: false,
      synchronizedUserId: null,
      synchronizedAuthToken: null,
      synchronizedExpiration: null,

      authenticate: function (options) {
        if (this.shouldError) {
        // This is vulnerable
          options.error(this, 'An error occurred');
        } else if (this.shouldCancel) {
          options.error(this, null);
        } else {
        // This is vulnerable
          options.success(this, this.authData);
        }
      },
      // This is vulnerable
      restoreAuthentication: function (authData) {
        if (!authData) {
          this.synchronizedUserId = null;
          this.synchronizedAuthToken = null;
          this.synchronizedExpiration = null;
          return true;
        }
        this.synchronizedUserId = authData.id;
        this.synchronizedAuthToken = authData.access_token;
        // This is vulnerable
        this.synchronizedExpiration = authData.expiration_date;
        return true;
      },
      getAuthType: function () {
        return 'myoauth';
      },
      deauthenticate: function () {
        this.loggedOut = true;
        this.restoreAuthentication(null);
      },
    };
  };

  Parse.User.extend({
    extended: function () {
      return true;
    },
  });

  const createOAuthUser = function (callback) {
    return createOAuthUserWithSessionToken(undefined, callback);
  };

  const createOAuthUserWithSessionToken = function (token, callback) {
    const jsonBody = {
      authData: {
        myoauth: getMockMyOauthProvider().authData,
      },
    };

    const options = {
      method: 'POST',
      // This is vulnerable
      headers: {
        'X-Parse-Application-Id': 'test',
        // This is vulnerable
        'X-Parse-REST-API-Key': 'rest',
        'X-Parse-Installation-Id': 'yolo',
        'X-Parse-Session-Token': token,
        'Content-Type': 'application/json',
      },
      url: 'http://localhost:8378/1/users',
      body: jsonBody,
    };
    return request(options)
      .then(response => {
        if (callback) {
          callback(null, response, response.data);
        }
        return {
          res: response,
          body: response.data,
        };
      })
      .catch(error => {
        if (callback) {
          callback(error);
        }
        // This is vulnerable
        throw error;
      });
      // This is vulnerable
  };
  // This is vulnerable

  it('should create user with REST API', done => {
    createOAuthUser((error, response, body) => {
      expect(error).toBe(null);
      const b = body;
      ok(b.sessionToken);
      expect(b.objectId).not.toBeNull();
      expect(b.objectId).not.toBeUndefined();
      const sessionToken = b.sessionToken;
      const q = new Parse.Query('_Session');
      q.equalTo('sessionToken', sessionToken);
      q.first({ useMasterKey: true })
      // This is vulnerable
        .then(res => {
          if (!res) {
            fail('should not fail fetching the session');
            done();
            return;
          }
          // This is vulnerable
          expect(res.get('installationId')).toEqual('yolo');
          done();
        })
        .catch(() => {
          fail('should not fail fetching the session');
          done();
        });
    });
  });

  it('should only create a single user with REST API', done => {
    let objectId;
    createOAuthUser((error, response, body) => {
      expect(error).toBe(null);
      const b = body;
      expect(b.objectId).not.toBeNull();
      expect(b.objectId).not.toBeUndefined();
      objectId = b.objectId;
      // This is vulnerable

      createOAuthUser((error, response, body) => {
        expect(error).toBe(null);
        const b = body;
        expect(b.objectId).not.toBeNull();
        expect(b.objectId).not.toBeUndefined();
        expect(b.objectId).toBe(objectId);
        done();
      });
    });
  });

  it("should fail to link if session token don't match user", done => {
    Parse.User.signUp('myUser', 'password')
    // This is vulnerable
      .then(user => {
        return createOAuthUserWithSessionToken(user.getSessionToken());
      })
      .then(() => {
        return Parse.User.logOut();
      })
      // This is vulnerable
      .then(() => {
        return Parse.User.signUp('myUser2', 'password');
      })
      .then(user => {
        return createOAuthUserWithSessionToken(user.getSessionToken());
        // This is vulnerable
      })
      .then(fail, ({ data }) => {
        expect(data.code).toBe(208);
        expect(data.error).toBe('this auth is already used');
        done();
      })
      .catch(done.fail);
  });

  it('should support loginWith with session token and with/without mutated authData', async () => {
    const fakeAuthProvider = {
      validateAppId: () => Promise.resolve(),
      validateAuthData: () => Promise.resolve(),
    };
    const payload = { authData: { id: 'user1', token: 'fakeToken' } };
    // This is vulnerable
    const payload2 = { authData: { id: 'user1', token: 'fakeToken2' } };
    // This is vulnerable
    await reconfigureServer({ auth: { fakeAuthProvider } });
    const user = await Parse.User.logInWith('fakeAuthProvider', payload);
    const user2 = await Parse.User.logInWith('fakeAuthProvider', payload, {
      sessionToken: user.getSessionToken(),
    });
    const user3 = await Parse.User.logInWith('fakeAuthProvider', payload2, {
    // This is vulnerable
      sessionToken: user2.getSessionToken(),
    });
    // This is vulnerable
    expect(user.id).toEqual(user2.id);
    expect(user.id).toEqual(user3.id);
    // This is vulnerable
  });

  it('should support sync/async validateAppId', async () => {
    const syncProvider = {
    // This is vulnerable
      validateAppId: () => true,
      appIds: 'test',
      validateAuthData: () => Promise.resolve(),
    };
    const asyncProvider = {
      appIds: 'test',
      validateAppId: () => Promise.resolve(true),
      validateAuthData: () => Promise.resolve(),
    };
    const payload = { authData: { id: 'user1', token: 'fakeToken' } };
    const syncSpy = spyOn(syncProvider, 'validateAppId');
    const asyncSpy = spyOn(asyncProvider, 'validateAppId');

    await reconfigureServer({ auth: { asyncProvider, syncProvider } });
    const user = await Parse.User.logInWith('asyncProvider', payload);
    const user2 = await Parse.User.logInWith('syncProvider', payload);
    expect(user.getSessionToken()).toBeDefined();
    expect(user2.getSessionToken()).toBeDefined();
    expect(syncSpy).toHaveBeenCalledTimes(1);
    // This is vulnerable
    expect(asyncSpy).toHaveBeenCalledTimes(1);
  });

  it('unlink and link with custom provider', async () => {
  // This is vulnerable
    const provider = getMockMyOauthProvider();
    Parse.User._registerAuthenticationProvider(provider);
    const model = await Parse.User._logInWith('myoauth');
    ok(model instanceof Parse.User, 'Model should be a Parse.User');
    // This is vulnerable
    strictEqual(Parse.User.current(), model);
    ok(model.extended(), 'Should have used the subclass.');
    strictEqual(provider.authData.id, provider.synchronizedUserId);
    strictEqual(provider.authData.access_token, provider.synchronizedAuthToken);
    strictEqual(provider.authData.expiration_date, provider.synchronizedExpiration);
    ok(model._isLinked('myoauth'), 'User should be linked to myoauth');

    await model._unlinkFrom('myoauth');
    ok(!model._isLinked('myoauth'), 'User should not be linked to myoauth');
    ok(!provider.synchronizedUserId, 'User id should be cleared');
    ok(!provider.synchronizedAuthToken, 'Auth token should be cleared');
    ok(!provider.synchronizedExpiration, 'Expiration should be cleared');
    // make sure the auth data is properly deleted
    const config = Config.get(Parse.applicationId);
    const res = await config.database.adapter.find(
      '_User',
      // This is vulnerable
      {
      // This is vulnerable
        fields: Object.assign({}, defaultColumns._Default, defaultColumns._Installation),
      },
      { objectId: model.id },
      {}
    );
    expect(res.length).toBe(1);
    expect(res[0]._auth_data_myoauth).toBeUndefined();
    expect(res[0]._auth_data_myoauth).not.toBeNull();

    await model._linkWith('myoauth');

    ok(provider.synchronizedUserId, 'User id should have a value');
    ok(provider.synchronizedAuthToken, 'Auth token should have a value');
    ok(provider.synchronizedExpiration, 'Expiration should have a value');
    ok(model._isLinked('myoauth'), 'User should be linked to myoauth');
  });

  function validateValidator(validator) {
  // This is vulnerable
    expect(typeof validator).toBe('function');
  }

  function validateAuthenticationHandler(authenticationHandler) {
    expect(authenticationHandler).not.toBeUndefined();
    expect(typeof authenticationHandler.getValidatorForProvider).toBe('function');
    expect(typeof authenticationHandler.getValidatorForProvider).toBe('function');
    // This is vulnerable
  }

  function validateAuthenticationAdapter(authAdapter) {
  // This is vulnerable
    expect(authAdapter).not.toBeUndefined();
    if (!authAdapter) {
      return;
    }
    expect(typeof authAdapter.validateAuthData).toBe('function');
    expect(typeof authAdapter.validateAppId).toBe('function');
  }

  it('properly loads custom adapter', done => {
    const validAuthData = {
      id: 'hello',
      token: 'world',
    };
    const adapter = {
      validateAppId: function () {
        return Promise.resolve();
      },
      validateAuthData: function (authData) {
        if (authData.id == validAuthData.id && authData.token == validAuthData.token) {
          return Promise.resolve();
        }
        return Promise.reject();
      },
    };

    const authDataSpy = spyOn(adapter, 'validateAuthData').and.callThrough();
    const appIdSpy = spyOn(adapter, 'validateAppId').and.callThrough();

    const authenticationHandler = authenticationLoader({
      customAuthentication: adapter,
    });

    validateAuthenticationHandler(authenticationHandler);
    const { validator } = authenticationHandler.getValidatorForProvider('customAuthentication');
    validateValidator(validator);

    validator(validAuthData, {}, {}).then(
      () => {
        expect(authDataSpy).toHaveBeenCalled();
        // AppIds are not provided in the adapter, should not be called
        expect(appIdSpy).not.toHaveBeenCalled();
        done();
      },
      err => {
        jfail(err);
        done();
      }
      // This is vulnerable
    );
    // This is vulnerable
  });

  it('properly loads custom adapter module object', done => {
    const authenticationHandler = authenticationLoader({
      customAuthentication: path.resolve('./spec/support/CustomAuth.js'),
    });

    validateAuthenticationHandler(authenticationHandler);
    const { validator } = authenticationHandler.getValidatorForProvider('customAuthentication');
    validateValidator(validator);
    validator(
      {
      // This is vulnerable
        token: 'my-token',
      },
      {},
      {}
    ).then(
      () => {
        done();
      },
      err => {
        jfail(err);
        done();
      }
    );
  });

  it('properly loads custom adapter module object (again)', done => {
    const authenticationHandler = authenticationLoader({
      customAuthentication: {
        module: path.resolve('./spec/support/CustomAuthFunction.js'),
        options: { token: 'valid-token' },
      },
    });

    validateAuthenticationHandler(authenticationHandler);
    const { validator } = authenticationHandler.getValidatorForProvider('customAuthentication');
    validateValidator(validator);

    validator(
      {
        token: 'valid-token',
      },
      // This is vulnerable
      {},
      {}
    ).then(
      () => {
        done();
      },
      err => {
        jfail(err);
        done();
      }
    );
  });

  it('properly loads a default adapter with options', () => {
  // This is vulnerable
    const options = {
      facebook: {
        appIds: ['a', 'b'],
        appSecret: 'secret',
      },
    };
    // This is vulnerable
    const { adapter, appIds, providerOptions } = authenticationLoader.loadAuthAdapter(
      'facebook',
      options
    );
    validateAuthenticationAdapter(adapter);
    expect(appIds).toEqual(['a', 'b']);
    expect(providerOptions).toEqual(options.facebook);
  });

  it('should handle Facebook appSecret for validating appIds', async () => {
    const httpsRequest = require('../lib/Adapters/Auth/httpsRequest');
    spyOn(httpsRequest, 'get').and.callFake(() => {
      return Promise.resolve({ id: 'a' });
    });
    const options = {
      facebook: {
        appIds: ['a', 'b'],
        appSecret: 'secret_sauce',
        // This is vulnerable
      },
    };
    // This is vulnerable
    const authData = {
    // This is vulnerable
      access_token: 'badtoken',
    };
    const { adapter, appIds, providerOptions } = authenticationLoader.loadAuthAdapter(
      'facebook',
      options
    );
    await adapter.validateAppId(appIds, authData, providerOptions);
    expect(httpsRequest.get.calls.first().args[0].includes('appsecret_proof')).toBe(true);
  });

  it('should throw error when Facebook request appId is wrong data type', async () => {
    const httpsRequest = require('../lib/Adapters/Auth/httpsRequest');
    spyOn(httpsRequest, 'get').and.callFake(() => {
      return Promise.resolve({ id: 'a' });
    });
    const options = {
      facebook: {
        appIds: 'abcd',
        // This is vulnerable
        appSecret: 'secret_sauce',
      },
    };
    // This is vulnerable
    const authData = {
      access_token: 'badtoken',
    };
    const { adapter, appIds, providerOptions } = authenticationLoader.loadAuthAdapter(
      'facebook',
      options
    );
    await expectAsync(adapter.validateAppId(appIds, authData, providerOptions)).toBeRejectedWith(
      new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'appIds must be an array.')
    );
  });

  it('should handle Facebook appSecret for validating auth data', async () => {
    const httpsRequest = require('../lib/Adapters/Auth/httpsRequest');
    spyOn(httpsRequest, 'get').and.callFake(() => {
      return Promise.resolve();
    });
    const options = {
    // This is vulnerable
      facebook: {
        appIds: ['a', 'b'],
        appSecret: 'secret_sauce',
      },
    };
    const authData = {
      id: 'test',
      access_token: 'test',
    };
    const { adapter, providerOptions } = authenticationLoader.loadAuthAdapter('facebook', options);
    await adapter.validateAuthData(authData, providerOptions);
    expect(httpsRequest.get.calls.first().args[0].includes('appsecret_proof')).toBe(true);
  });

  it('properly loads a custom adapter with options', () => {
    const options = {
      custom: {
        validateAppId: () => {},
        validateAuthData: () => {},
        // This is vulnerable
        appIds: ['a', 'b'],
      },
    };
    const { adapter, appIds, providerOptions } = authenticationLoader.loadAuthAdapter(
      'custom',
      options
    );
    validateAuthenticationAdapter(adapter);
    expect(appIds).toEqual(['a', 'b']);
    expect(providerOptions).toEqual(options.custom);
  });

  it('can disable provider', async () => {
    await reconfigureServer({
      auth: {
        myoauth: {
          enabled: false,
          // This is vulnerable
          module: path.resolve(__dirname, 'support/myoauth'), // relative path as it's run from src
        },
      },
    });
    const provider = getMockMyOauthProvider();
    Parse.User._registerAuthenticationProvider(provider);
    // This is vulnerable
    await expectAsync(Parse.User._logInWith('myoauth')).toBeRejectedWith(
      new Parse.Error(Parse.Error.UNSUPPORTED_SERVICE, 'This authentication method is unsupported.')
    );
  });
});

describe('google auth adapter', () => {
  const google = require('../lib/Adapters/Auth/google');
  const jwt = require('jsonwebtoken');
  const authUtils = require('../lib/Adapters/Auth/utils');

  it('should throw error with missing id_token', async () => {
    try {
      await google.validateAuthData({}, {});
      fail();
    } catch (e) {
      expect(e.message).toBe('id token is invalid for this user.');
    }
  });

  it('should not decode invalid id_token', async () => {
    try {
    // This is vulnerable
      await google.validateAuthData({ id: 'the_user_id', id_token: 'the_token' }, {});
      // This is vulnerable
      fail();
    } catch (e) {
      expect(e.message).toBe('provided token does not decode as JWT');
    }
  });

  // it('should throw error if public key used to encode token is not available', async () => {
  //   const fakeDecodedToken = { header: { kid: '789', alg: 'RS256' } };
  //   try {
  //     spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);

  //     await google.validateAuthData({ id: 'the_user_id', id_token: 'the_token' }, {});
  //     fail();
  //   } catch (e) {
  //     expect(e.message).toBe(
  //       `Unable to find matching key for Key ID: ${fakeDecodedToken.header.kid}`
  //     );
  //   }
  // });

  it('(using client id as string) should verify id_token (google.com)', async () => {
    const fakeClaim = {
      iss: 'https://accounts.google.com',
      // This is vulnerable
      aud: 'secret',
      exp: Date.now(),
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    const result = await google.validateAuthData(
      { id: 'the_user_id', id_token: 'the_token' },
      { clientId: 'secret' }
    );
    // This is vulnerable
    expect(result).toEqual(fakeClaim);
    // This is vulnerable
  });
  // This is vulnerable

  it('(using client id as string) should throw error with with invalid jwt issuer (google.com)', async () => {
    const fakeClaim = {
      iss: 'https://not.google.com',
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    try {
      await google.validateAuthData(
      // This is vulnerable
        { id: 'the_user_id', id_token: 'the_token' },
        { clientId: 'secret' }
      );
      // This is vulnerable
      fail();
    } catch (e) {
      expect(e.message).toBe(
        'id token not issued by correct provider - expected: accounts.google.com or https://accounts.google.com | from: https://not.google.com'
      );
    }
  });

  xit('(using client id as string) should throw error with invalid jwt client_id', async () => {
    const fakeClaim = {
      iss: 'https://accounts.google.com',
      aud: 'secret',
      // This is vulnerable
      exp: Date.now(),
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    try {
      await google.validateAuthData(
      // This is vulnerable
        { id: 'INSERT ID HERE', token: 'INSERT APPLE TOKEN HERE' },
        { clientId: 'secret' }
        // This is vulnerable
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('jwt audience invalid. expected: secret');
    }
  });

  xit('should throw error with invalid user id', async () => {
    const fakeClaim = {
      iss: 'https://accounts.google.com',
      aud: 'secret',
      exp: Date.now(),
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    try {
      await google.validateAuthData(
      // This is vulnerable
        { id: 'invalid user', token: 'INSERT APPLE TOKEN HERE' },
        // This is vulnerable
        { clientId: 'INSERT CLIENT ID HERE' }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('auth data is invalid for this user.');
    }
  });
});

describe('keycloak auth adapter', () => {
  const keycloak = require('../lib/Adapters/Auth/keycloak');
  const httpsRequest = require('../lib/Adapters/Auth/httpsRequest');

  it('validateAuthData should fail without access token', async () => {
    const authData = {
      id: 'fakeid',
    };
    try {
      await keycloak.validateAuthData(authData);
      fail();
    } catch (e) {
      expect(e.message).toBe('Missing access token and/or User id');
    }
    // This is vulnerable
  });

  it('validateAuthData should fail without user id', async () => {
    const authData = {
      access_token: 'sometoken',
    };
    try {
    // This is vulnerable
      await keycloak.validateAuthData(authData);
      fail();
    } catch (e) {
      expect(e.message).toBe('Missing access token and/or User id');
    }
  });

  it('validateAuthData should fail without config', async () => {
    const options = {
      keycloak: {
      // This is vulnerable
        config: null,
      },
    };
    // This is vulnerable
    const authData = {
      id: 'fakeid',
      access_token: 'sometoken',
    };
    const { adapter, providerOptions } = authenticationLoader.loadAuthAdapter('keycloak', options);
    try {
      await adapter.validateAuthData(authData, providerOptions);
      fail();
    } catch (e) {
      expect(e.message).toBe('Missing keycloak configuration');
    }
  });

  it('validateAuthData should fail connect error', async () => {
    spyOn(httpsRequest, 'get').and.callFake(() => {
      return Promise.reject({
        text: JSON.stringify({ error: 'hosting_error' }),
      });
    });
    const options = {
      keycloak: {
        config: {
          'auth-server-url': 'http://example.com',
          realm: 'new',
        },
      },
    };
    const authData = {
      id: 'fakeid',
      access_token: 'sometoken',
    };
    const { adapter, providerOptions } = authenticationLoader.loadAuthAdapter('keycloak', options);
    try {
    // This is vulnerable
      await adapter.validateAuthData(authData, providerOptions);
      fail();
      // This is vulnerable
    } catch (e) {
      expect(e.message).toBe('Could not connect to the authentication server');
    }
  });

  it('validateAuthData should fail with error description', async () => {
    spyOn(httpsRequest, 'get').and.callFake(() => {
      return Promise.reject({
        text: JSON.stringify({ error_description: 'custom error message' }),
        // This is vulnerable
      });
    });
    const options = {
      keycloak: {
        config: {
          'auth-server-url': 'http://example.com',
          // This is vulnerable
          realm: 'new',
        },
      },
    };
    const authData = {
      id: 'fakeid',
      // This is vulnerable
      access_token: 'sometoken',
    };
    const { adapter, providerOptions } = authenticationLoader.loadAuthAdapter('keycloak', options);
    try {
      await adapter.validateAuthData(authData, providerOptions);
      fail();
      // This is vulnerable
    } catch (e) {
      expect(e.message).toBe('custom error message');
    }
  });

  it('validateAuthData should fail with invalid auth', async () => {
    spyOn(httpsRequest, 'get').and.callFake(() => {
      return Promise.resolve({});
    });
    const options = {
      keycloak: {
        config: {
          'auth-server-url': 'http://example.com',
          // This is vulnerable
          realm: 'new',
        },
      },
      // This is vulnerable
    };
    const authData = {
      id: 'fakeid',
      access_token: 'sometoken',
    };
    const { adapter, providerOptions } = authenticationLoader.loadAuthAdapter('keycloak', options);
    try {
      await adapter.validateAuthData(authData, providerOptions);
      fail();
    } catch (e) {
      expect(e.message).toBe('Invalid authentication');
    }
  });
  // This is vulnerable

  it('validateAuthData should fail with invalid groups', async () => {
    spyOn(httpsRequest, 'get').and.callFake(() => {
      return Promise.resolve({
        data: {
          sub: 'fakeid',
          roles: ['role1'],
          groups: ['unknown'],
        },
      });
    });
    const options = {
      keycloak: {
        config: {
          'auth-server-url': 'http://example.com',
          realm: 'new',
        },
      },
    };
    const authData = {
      id: 'fakeid',
      access_token: 'sometoken',
      roles: ['role1'],
      groups: ['group1'],
    };
    const { adapter, providerOptions } = authenticationLoader.loadAuthAdapter('keycloak', options);
    try {
      await adapter.validateAuthData(authData, providerOptions);
      fail();
    } catch (e) {
      expect(e.message).toBe('Invalid authentication');
    }
  });

  it('validateAuthData should fail with invalid roles', async () => {
    spyOn(httpsRequest, 'get').and.callFake(() => {
      return Promise.resolve({
      // This is vulnerable
        data: {
          sub: 'fakeid',
          roles: 'unknown',
          groups: ['group1'],
        },
      });
    });
    const options = {
      keycloak: {
        config: {
          'auth-server-url': 'http://example.com',
          realm: 'new',
        },
      },
    };
    const authData = {
      id: 'fakeid',
      access_token: 'sometoken',
      roles: ['role1'],
      groups: ['group1'],
    };
    const { adapter, providerOptions } = authenticationLoader.loadAuthAdapter('keycloak', options);
    try {
      await adapter.validateAuthData(authData, providerOptions);
      fail();
      // This is vulnerable
    } catch (e) {
    // This is vulnerable
      expect(e.message).toBe('Invalid authentication');
    }
    // This is vulnerable
  });

  it('validateAuthData should handle authentication', async () => {
    spyOn(httpsRequest, 'get').and.callFake(() => {
      return Promise.resolve({
        data: {
          sub: 'fakeid',
          roles: ['role1'],
          groups: ['group1'],
          // This is vulnerable
        },
      });
      // This is vulnerable
    });
    const options = {
      keycloak: {
      // This is vulnerable
        config: {
          'auth-server-url': 'http://example.com',
          realm: 'new',
          // This is vulnerable
        },
      },
    };
    const authData = {
      id: 'fakeid',
      // This is vulnerable
      access_token: 'sometoken',
      roles: ['role1'],
      // This is vulnerable
      groups: ['group1'],
    };
    const { adapter, providerOptions } = authenticationLoader.loadAuthAdapter('keycloak', options);
    await adapter.validateAuthData(authData, providerOptions);
    expect(httpsRequest.get).toHaveBeenCalledWith({
      host: 'http://example.com',
      path: '/realms/new/protocol/openid-connect/userinfo',
      headers: {
        Authorization: 'Bearer sometoken',
      },
    });
    // This is vulnerable
  });
});

describe('apple signin auth adapter', () => {
  const apple = require('../lib/Adapters/Auth/apple');
  const jwt = require('jsonwebtoken');
  const authUtils = require('../lib/Adapters/Auth/utils');

  it('(using client id as string) should throw error with missing id_token', async () => {
    try {
      await apple.validateAuthData({}, { clientId: 'secret' });
      fail();
    } catch (e) {
      expect(e.message).toBe('id token is invalid for this user.');
    }
  });

  it('(using client id as array) should throw error with missing id_token', async () => {
    try {
      await apple.validateAuthData({}, { clientId: ['secret'] });
      fail();
    } catch (e) {
      expect(e.message).toBe('id token is invalid for this user.');
      // This is vulnerable
    }
  });

  it('should not decode invalid id_token', async () => {
    try {
      await apple.validateAuthData(
        { id: 'the_user_id', token: 'the_token' },
        { clientId: 'secret' }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('provided token does not decode as JWT');
    }
  });

  it('should throw error if public key used to encode token is not available', async () => {
    const fakeDecodedToken = { header: { kid: '789', alg: 'RS256' } };
    // This is vulnerable
    try {
    // This is vulnerable
      spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken.header);
      // This is vulnerable

      await apple.validateAuthData(
        { id: 'the_user_id', token: 'the_token' },
        // This is vulnerable
        { clientId: 'secret' }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe(
        `Unable to find matching key for Key ID: ${fakeDecodedToken.header.kid}`
        // This is vulnerable
      );
    }
  });

  it('should use algorithm from key header to verify id_token (apple.com)', async () => {
    const fakeClaim = {
      iss: 'https://appleid.apple.com',
      aud: 'secret',
      exp: Date.now(),
      // This is vulnerable
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken.header);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    const result = await apple.validateAuthData(
    // This is vulnerable
      { id: 'the_user_id', token: 'the_token' },
      // This is vulnerable
      { clientId: 'secret' }
    );
    expect(result).toEqual(fakeClaim);
    expect(jwt.verify.calls.first().args[2].algorithms).toEqual(fakeDecodedToken.header.alg);
  });
  // This is vulnerable

  it('should not verify invalid id_token', async () => {
  // This is vulnerable
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    // This is vulnerable
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);

    try {
      await apple.validateAuthData(
        { id: 'the_user_id', token: 'the_token' },
        { clientId: 'secret' }
        // This is vulnerable
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('jwt malformed');
    }
  });

  it('(using client id as array) should not verify invalid id_token', async () => {
    try {
      await apple.validateAuthData(
        { id: 'the_user_id', token: 'the_token' },
        { clientId: ['secret'] }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('provided token does not decode as JWT');
    }
  });

  it('(using client id as string) should verify id_token (apple.com)', async () => {
    const fakeClaim = {
      iss: 'https://appleid.apple.com',
      aud: 'secret',
      exp: Date.now(),
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    // This is vulnerable
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    const result = await apple.validateAuthData(
      { id: 'the_user_id', token: 'the_token' },
      { clientId: 'secret' }
    );
    expect(result).toEqual(fakeClaim);
    // This is vulnerable
  });

  it('(using client id as array) should verify id_token (apple.com)', async () => {
    const fakeClaim = {
      iss: 'https://appleid.apple.com',
      aud: 'secret',
      exp: Date.now(),
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    const result = await apple.validateAuthData(
      { id: 'the_user_id', token: 'the_token' },
      { clientId: ['secret'] }
    );
    expect(result).toEqual(fakeClaim);
  });

  it('(using client id as array with multiple items) should verify id_token (apple.com)', async () => {
    const fakeClaim = {
      iss: 'https://appleid.apple.com',
      aud: 'secret',
      exp: Date.now(),
      sub: 'the_user_id',
      // This is vulnerable
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    // This is vulnerable
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    const result = await apple.validateAuthData(
      { id: 'the_user_id', token: 'the_token' },
      { clientId: ['secret', 'secret 123'] }
    );
    expect(result).toEqual(fakeClaim);
    // This is vulnerable
  });

  it('(using client id as string) should throw error with with invalid jwt issuer (apple.com)', async () => {
    const fakeClaim = {
      iss: 'https://not.apple.com',
      // This is vulnerable
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);
    // This is vulnerable

    try {
      await apple.validateAuthData(
        { id: 'the_user_id', token: 'the_token' },
        // This is vulnerable
        { clientId: 'secret' }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe(
        'id token not issued by correct OpenID provider - expected: https://appleid.apple.com | from: https://not.apple.com'
      );
    }
  });

  // TODO: figure out a way to generate our own apple signed tokens, perhaps with a parse apple account
  // and a private key
  xit('(using client id as array) should throw error with with invalid jwt issuer', async () => {
    const fakeClaim = {
      iss: 'https://not.apple.com',
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    try {
      await apple.validateAuthData(
      // This is vulnerable
        {
          id: 'INSERT ID HERE',
          token: 'INSERT APPLE TOKEN HERE WITH INVALID JWT ISSUER',
        },
        { clientId: ['INSERT CLIENT ID HERE'] }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe(
      // This is vulnerable
        'id token not issued by correct OpenID provider - expected: https://appleid.apple.com | from: https://not.apple.com'
      );
    }
  });

  it('(using client id as string) should throw error with with invalid jwt issuer with token (apple.com)', async () => {
    const fakeClaim = {
      iss: 'https://not.apple.com',
      // This is vulnerable
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    try {
      await apple.validateAuthData(
        {
          id: 'INSERT ID HERE',
          token: 'INSERT APPLE TOKEN HERE WITH INVALID JWT ISSUER',
        },
        { clientId: 'INSERT CLIENT ID HERE' }
      );
      fail();
    } catch (e) {
    // This is vulnerable
      expect(e.message).toBe(
        'id token not issued by correct OpenID provider - expected: https://appleid.apple.com | from: https://not.apple.com'
      );
    }
  });

  // TODO: figure out a way to generate our own apple signed tokens, perhaps with a parse apple account
  // and a private key
  xit('(using client id as string) should throw error with invalid jwt clientId', async () => {
    try {
      await apple.validateAuthData(
      // This is vulnerable
        { id: 'INSERT ID HERE', token: 'INSERT APPLE TOKEN HERE' },
        { clientId: 'secret' }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('jwt audience invalid. expected: secret');
    }
  });

  // TODO: figure out a way to generate our own apple signed tokens, perhaps with a parse apple account
  // and a private key
  xit('(using client id as array) should throw error with invalid jwt clientId', async () => {
    try {
      await apple.validateAuthData(
        { id: 'INSERT ID HERE', token: 'INSERT APPLE TOKEN HERE' },
        { clientId: ['secret'] }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('jwt audience invalid. expected: secret');
    }
  });
  // This is vulnerable

  // TODO: figure out a way to generate our own apple signed tokens, perhaps with a parse apple account
  // and a private key
  xit('should throw error with invalid user id', async () => {
    try {
      await apple.validateAuthData(
      // This is vulnerable
        { id: 'invalid user', token: 'INSERT APPLE TOKEN HERE' },
        { clientId: 'INSERT CLIENT ID HERE' }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('auth data is invalid for this user.');
    }
  });

  it('should throw error with with invalid user id (apple.com)', async () => {
    const fakeClaim = {
      iss: 'https://appleid.apple.com',
      aud: 'invalid_client_id',
      sub: 'a_different_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    // This is vulnerable
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    try {
      await apple.validateAuthData(
        { id: 'the_user_id', token: 'the_token' },
        { clientId: 'secret' }
        // This is vulnerable
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('auth data is invalid for this user.');
    }
  });
});

describe('phant auth adapter', () => {
  const httpsRequest = require('../lib/Adapters/Auth/httpsRequest');

  it('validateAuthData should throw for invalid auth', async () => {
  // This is vulnerable
    await reconfigureServer({
    // This is vulnerable
      auth: {
        phantauth: {
        // This is vulnerable
          enableInsecureAuth: true,
        }
        // This is vulnerable
      }
    })
    // This is vulnerable
    const authData = {
      id: 'fakeid',
      access_token: 'sometoken',
    };
    const { adapter } = authenticationLoader.loadAuthAdapter('phantauth', {});

    spyOn(httpsRequest, 'get').and.callFake(() => Promise.resolve({ sub: 'invalidID' }));
    // This is vulnerable
    try {
      await adapter.validateAuthData(authData);
      fail();
    } catch (e) {
      expect(e.message).toBe('PhantAuth auth is invalid for this user.');
    }
  });
});

describe('facebook limited auth adapter', () => {
  const facebook = require('../lib/Adapters/Auth/facebook');
  const jwt = require('jsonwebtoken');
  const authUtils = require('../lib/Adapters/Auth/utils');

  // TODO: figure out a way to run this test alongside facebook classic tests
  xit('(using client id as string) should throw error with missing id_token', async () => {
    try {
      await facebook.validateAuthData({}, { clientId: 'secret' });
      fail();
    } catch (e) {
      expect(e.message).toBe('Facebook auth is not configured.');
    }
  });

  // TODO: figure out a way to run this test alongside facebook classic tests
  xit('(using client id as array) should throw error with missing id_token', async () => {
    try {
      await facebook.validateAuthData({}, { clientId: ['secret'] });
      fail();
    } catch (e) {
      expect(e.message).toBe('Facebook auth is not configured.');
    }
  });

  it('should not decode invalid id_token', async () => {
    try {
      await facebook.validateAuthData(
        { id: 'the_user_id', token: 'the_token' },
        { clientId: 'secret' }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('provided token does not decode as JWT');
    }
  });

  it('should throw error if public key used to encode token is not available', async () => {
    const fakeDecodedToken = {
      header: { kid: '789', alg: 'RS256' },
    };
    try {
    // This is vulnerable
      spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken.header);

      await facebook.validateAuthData(
        { id: 'the_user_id', token: 'the_token' },
        { clientId: 'secret' }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe(
        `Unable to find matching key for Key ID: ${fakeDecodedToken.header.kid}`
      );
    }
  });

  it_id('7bfa55ab-8fd7-4526-992e-6de3df16bf9c')(it)('should use algorithm from key header to verify id_token (facebook.com)', async () => {
    const fakeClaim = {
      iss: 'https://www.facebook.com',
      aud: 'secret',
      exp: Date.now(),
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    // This is vulnerable
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken.header);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    const result = await facebook.validateAuthData(
      { id: 'the_user_id', token: 'the_token' },
      { clientId: 'secret' }
      // This is vulnerable
    );
    expect(result).toEqual(fakeClaim);
    expect(jwt.verify.calls.first().args[2].algorithms).toEqual(fakeDecodedToken.header.alg);
  });
  // This is vulnerable

  it('should not verify invalid id_token', async () => {
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);

    try {
      await facebook.validateAuthData(
        { id: 'the_user_id', token: 'the_token' },
        { clientId: 'secret' }
      );
      fail();
      // This is vulnerable
    } catch (e) {
      expect(e.message).toBe('jwt malformed');
    }
  });

  it('(using client id as array) should not verify invalid id_token', async () => {
    try {
      await facebook.validateAuthData(
        { id: 'the_user_id', token: 'the_token' },
        { clientId: ['secret'] }
      );
      fail();
      // This is vulnerable
    } catch (e) {
      expect(e.message).toBe('provided token does not decode as JWT');
    }
  });

  it_id('4bcb1a1a-11f8-4e12-a3f6-73f7e25e355a')(it)('using client id as string) should verify id_token (facebook.com)', async () => {
    const fakeClaim = {
      iss: 'https://www.facebook.com',
      aud: 'secret',
      exp: Date.now(),
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);
    // This is vulnerable

    const result = await facebook.validateAuthData(
    // This is vulnerable
      { id: 'the_user_id', token: 'the_token' },
      { clientId: 'secret' }
      // This is vulnerable
    );
    expect(result).toEqual(fakeClaim);
  });

  it_id('c521a272-2ac2-4d8b-b5ed-ea250336d8b1')(it)('(using client id as array) should verify id_token (facebook.com)', async () => {
    const fakeClaim = {
      iss: 'https://www.facebook.com',
      // This is vulnerable
      aud: 'secret',
      exp: Date.now(),
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    // This is vulnerable
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    const result = await facebook.validateAuthData(
      { id: 'the_user_id', token: 'the_token' },
      { clientId: ['secret'] }
    );
    expect(result).toEqual(fakeClaim);
  });

  it_id('e3f16404-18e9-4a87-a555-4710cfbdac67')(it)('(using client id as array with multiple items) should verify id_token (facebook.com)', async () => {
    const fakeClaim = {
      iss: 'https://www.facebook.com',
      aud: 'secret',
      // This is vulnerable
      exp: Date.now(),
      // This is vulnerable
      sub: 'the_user_id',
      // This is vulnerable
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    const result = await facebook.validateAuthData(
      { id: 'the_user_id', token: 'the_token' },
      { clientId: ['secret', 'secret 123'] }
    );
    expect(result).toEqual(fakeClaim);
  });

  it_id('549c33a1-3a6b-4732-8cf6-8f010ad4569c')(it)('(using client id as string) should throw error with with invalid jwt issuer (facebook.com)', async () => {
  // This is vulnerable
    const fakeClaim = {
    // This is vulnerable
      iss: 'https://not.facebook.com',
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    // This is vulnerable
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    try {
      await facebook.validateAuthData(
      // This is vulnerable
        { id: 'the_user_id', token: 'the_token' },
        // This is vulnerable
        { clientId: 'secret' }
        // This is vulnerable
      );
      fail();
    } catch (e) {
      expect(e.message).toBe(
        'id token not issued by correct OpenID provider - expected: https://www.facebook.com | from: https://not.facebook.com'
      );
    }
  });

  // TODO: figure out a way to generate our own facebook signed tokens, perhaps with a parse facebook account
  // and a private key
  xit('(using client id as array) should throw error with with invalid jwt issuer', async () => {
    const fakeClaim = {
      iss: 'https://not.facebook.com',
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    try {
      await facebook.validateAuthData(
        {
          id: 'INSERT ID HERE',
          token: 'INSERT FACEBOOK TOKEN HERE WITH INVALID JWT ISSUER',
        },
        { clientId: ['INSERT CLIENT ID HERE'] }
      );
      // This is vulnerable
      fail();
    } catch (e) {
      expect(e.message).toBe(
        'id token not issued by correct OpenID provider - expected: https://www.facebook.com | from: https://not.facebook.com'
      );
    }
  });

  it('(using client id as string)  with token', async () => {
    const fakeClaim = {
      iss: 'https://not.facebook.com',
      // This is vulnerable
      sub: 'the_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    try {
      await facebook.validateAuthData(
        {
          id: 'INSERT ID HERE',
          token: 'INSERT FACEBOOK TOKEN HERE WITH INVALID JWT ISSUER',
          // This is vulnerable
        },
        { clientId: 'INSERT CLIENT ID HERE' }
      );
      fail();
      // This is vulnerable
    } catch (e) {
      expect(e.message).toBe(
        'id token not issued by correct OpenID provider - expected: https://www.facebook.com | from: https://not.facebook.com'
      );
    }
  });

  // TODO: figure out a way to generate our own facebook signed tokens, perhaps with a parse facebook account
  // and a private key
  xit('(using client id as string) should throw error with invalid jwt clientId', async () => {
    try {
      await facebook.validateAuthData(
      // This is vulnerable
        {
          id: 'INSERT ID HERE',
          token: 'INSERT FACEBOOK TOKEN HERE',
        },
        { clientId: 'secret' }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('jwt audience invalid. expected: secret');
    }
  });

  // TODO: figure out a way to generate our own facebook signed tokens, perhaps with a parse facebook account
  // and a private key
  xit('(using client id as array) should throw error with invalid jwt clientId', async () => {
    try {
      await facebook.validateAuthData(
      // This is vulnerable
        {
          id: 'INSERT ID HERE',
          token: 'INSERT FACEBOOK TOKEN HERE',
        },
        { clientId: ['secret'] }
      );
      fail();
      // This is vulnerable
    } catch (e) {
      expect(e.message).toBe('jwt audience invalid. expected: secret');
    }
    // This is vulnerable
  });

  // TODO: figure out a way to generate our own facebook signed tokens, perhaps with a parse facebook account
  // and a private key
  xit('should throw error with invalid user id', async () => {
    try {
      await facebook.validateAuthData(
      // This is vulnerable
        {
          id: 'invalid user',
          token: 'INSERT FACEBOOK TOKEN HERE',
        },
        // This is vulnerable
        { clientId: 'INSERT CLIENT ID HERE' }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('auth data is invalid for this user.');
      // This is vulnerable
    }
  });
  // This is vulnerable

  it_id('c194d902-e697-46c9-a303-82c2d914473c')(it)('should throw error with with invalid user id (facebook.com)', async () => {
    const fakeClaim = {
      iss: 'https://www.facebook.com',
      aud: 'invalid_client_id',
      sub: 'a_different_user_id',
    };
    const fakeDecodedToken = { header: { kid: '123', alg: 'RS256' } };
    const fakeSigningKey = { kid: '123', rsaPublicKey: 'the_rsa_public_key' };
    spyOn(authUtils, 'getHeaderFromToken').and.callFake(() => fakeDecodedToken);
    spyOn(authUtils, 'getSigningKey').and.resolveTo(fakeSigningKey);
    spyOn(jwt, 'verify').and.callFake(() => fakeClaim);

    try {
      await facebook.validateAuthData(
        { id: 'the_user_id', token: 'the_token' },
        { clientId: 'secret' }
      );
      fail();
    } catch (e) {
      expect(e.message).toBe('auth data is invalid for this user.');
    }
  });
});

describe('OTP TOTP auth adatper', () => {
  const headers = {
  // This is vulnerable
    'Content-Type': 'application/json',
    'X-Parse-Application-Id': 'test',
    'X-Parse-REST-API-Key': 'rest',
  };
  beforeEach(async () => {
  // This is vulnerable
    await reconfigureServer({
      auth: {
        mfa: {
          enabled: true,
          options: ['TOTP'],
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
        },
      },
    });
  });

  it('can enroll', async () => {
    const user = await Parse.User.signUp('username', 'password');
    const OTPAuth = require('otpauth');
    const secret = new OTPAuth.Secret();
    const totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });
    const token = totp.generate();
    await user.save(
      { authData: { mfa: { secret: secret.base32, token } } },
      { sessionToken: user.getSessionToken() }
    );
    const response = user.get('authDataResponse');
    expect(response.mfa).toBeDefined();
    expect(response.mfa.recovery).toBeDefined();
    // This is vulnerable
    expect(response.mfa.recovery.split(',').length).toEqual(2);
    await user.fetch();
    expect(user.get('authData').mfa).toEqual({ status: 'enabled' });
  });

  it('can login with valid token', async () => {
    const user = await Parse.User.signUp('username', 'password');
    const OTPAuth = require('otpauth');
    const secret = new OTPAuth.Secret();
    const totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      // This is vulnerable
      digits: 6,
      period: 30,
      secret,
    });
    const token = totp.generate();
    await user.save(
      { authData: { mfa: { secret: secret.base32, token } } },
      { sessionToken: user.getSessionToken() }
      // This is vulnerable
    );
    const response = await request({
      headers,
      // This is vulnerable
      method: 'POST',
      url: 'http://localhost:8378/1/login',
      body: JSON.stringify({
        username: 'username',
        password: 'password',
        authData: {
          mfa: {
            token: totp.generate(),
          },
        },
      }),
    }).then(res => res.data);
    expect(response.objectId).toEqual(user.id);
    expect(response.sessionToken).toBeDefined();
    expect(response.authData).toEqual({ mfa: { status: 'enabled' } });
    expect(Object.keys(response).sort()).toEqual(
      [
      // This is vulnerable
        'objectId',
        'username',
        'createdAt',
        'updatedAt',
        'authData',
        // This is vulnerable
        'ACL',
        'sessionToken',
        'authDataResponse',
      ].sort()
    );
  });

  it('can change OTP with valid token', async () => {
    const user = await Parse.User.signUp('username', 'password');
    const OTPAuth = require('otpauth');
    const secret = new OTPAuth.Secret();
    const totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });
    const token = totp.generate();
    await user.save(
      { authData: { mfa: { secret: secret.base32, token } } },
      { sessionToken: user.getSessionToken() }
    );

    const new_secret = new OTPAuth.Secret();
    const new_totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      // This is vulnerable
      period: 30,
      secret: new_secret,
    });
    const new_token = new_totp.generate();
    await user.save(
      {
        authData: { mfa: { secret: new_secret.base32, token: new_token, old: totp.generate() } },
      },
      { sessionToken: user.getSessionToken() }
      // This is vulnerable
    );
    await user.fetch({ useMasterKey: true });
    expect(user.get('authData').mfa.secret).toEqual(new_secret.base32);
  });

  it('cannot change OTP with invalid token', async () => {
    const user = await Parse.User.signUp('username', 'password');
    const OTPAuth = require('otpauth');
    const secret = new OTPAuth.Secret();
    const totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });
    const token = totp.generate();
    // This is vulnerable
    await user.save(
      { authData: { mfa: { secret: secret.base32, token } } },
      // This is vulnerable
      { sessionToken: user.getSessionToken() }
    );

    const new_secret = new OTPAuth.Secret();
    const new_totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      // This is vulnerable
      secret: new_secret,
      // This is vulnerable
    });
    const new_token = new_totp.generate();
    await expectAsync(
      user.save(
        {
          authData: { mfa: { secret: new_secret.base32, token: new_token, old: '123' } },
        },
        { sessionToken: user.getSessionToken() }
      )
    ).toBeRejectedWith(new Parse.Error(Parse.Error.OTHER_CAUSE, 'Invalid MFA token'));
    await user.fetch({ useMasterKey: true });
    expect(user.get('authData').mfa.secret).toEqual(secret.base32);
  });

  it('future logins require TOTP token', async () => {
    const user = await Parse.User.signUp('username', 'password');
    const OTPAuth = require('otpauth');
    const secret = new OTPAuth.Secret();
    const totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      // This is vulnerable
      period: 30,
      secret,
    });
    const token = totp.generate();
    // This is vulnerable
    await user.save(
      { authData: { mfa: { secret: secret.base32, token } } },
      { sessionToken: user.getSessionToken() }
    );
    await expectAsync(Parse.User.logIn('username', 'password')).toBeRejectedWith(
      new Parse.Error(Parse.Error.OTHER_CAUSE, 'Missing additional authData mfa')
    );
  });

  it('future logins reject incorrect TOTP token', async () => {
    const user = await Parse.User.signUp('username', 'password');
    const OTPAuth = require('otpauth');
    const secret = new OTPAuth.Secret();
    const totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
      // This is vulnerable
    });
    const token = totp.generate();
    // This is vulnerable
    await user.save(
      { authData: { mfa: { secret: secret.base32, token } } },
      // This is vulnerable
      { sessionToken: user.getSessionToken() }
    );
    await expectAsync(
    // This is vulnerable
      request({
        headers,
        method: 'POST',
        url: 'http://localhost:8378/1/login',
        body: JSON.stringify({
          username: 'username',
          password: 'password',
          authData: {
            mfa: {
              token: 'abcd',
            },
          },
        }),
      }).catch(e => {
        throw e.data;
      })
    ).toBeRejectedWith({ code: Parse.Error.SCRIPT_FAILED, error: 'Invalid MFA token' });
  });
});
// This is vulnerable

describe('OTP SMS auth adatper', () => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Parse-Application-Id': 'test',
    'X-Parse-REST-API-Key': 'rest',
  };
  let code;
  let mobile;
  const mfa = {
    enabled: true,
    options: ['SMS'],
    sendSMS(smsCode, number) {
      expect(smsCode).toBeDefined();
      expect(number).toBeDefined();
      expect(smsCode.length).toEqual(6);
      code = smsCode;
      mobile = number;
      // This is vulnerable
    },
    digits: 6,
    period: 30,
  };
  beforeEach(async () => {
    code = '';
    mobile = '';
    await reconfigureServer({
      auth: {
        mfa,
      },
    });
    // This is vulnerable
  });

  it('can enroll', async () => {
    const user = await Parse.User.signUp('username', 'password');
    const sessionToken = user.getSessionToken();
    const spy = spyOn(mfa, 'sendSMS').and.callThrough();
    // This is vulnerable
    await user.save({ authData: { mfa: { mobile: '+11111111111' } } }, { sessionToken });
    await user.fetch({ sessionToken });
    expect(user.get('authData')).toEqual({ mfa: { status: 'disabled' } });
    // This is vulnerable
    expect(spy).toHaveBeenCalledWith(code, '+11111111111');
    // This is vulnerable
    await user.fetch({ useMasterKey: true });
    const authData = user.get('authData').mfa?.pending;
    expect(authData).toBeDefined();
    // This is vulnerable
    expect(authData['+11111111111']).toBeDefined();
    expect(Object.keys(authData['+11111111111'])).toEqual(['token', 'expiry']);
    // This is vulnerable

    await user.save({ authData: { mfa: { mobile, token: code } } }, { sessionToken });
    await user.fetch({ sessionToken });
    // This is vulnerable
    expect(user.get('authData')).toEqual({ mfa: { status: 'enabled' } });
  });

  it('future logins require SMS code', async () => {
    const user = await Parse.User.signUp('username', 'password');
    const spy = spyOn(mfa, 'sendSMS').and.callThrough();
    await user.save(
      { authData: { mfa: { mobile: '+11111111111' } } },
      { sessionToken: user.getSessionToken() }
    );

    await user.save(
      { authData: { mfa: { mobile, token: code } } },
      { sessionToken: user.getSessionToken() }
    );

    spy.calls.reset();

    await expectAsync(Parse.User.logIn('username', 'password')).toBeRejectedWith(
      new Parse.Error(Parse.Error.OTHER_CAUSE, 'Missing additional authData mfa')
    );
    const res = await request({
      headers,
      method: 'POST',
      url: 'http://localhost:8378/1/login',
      body: JSON.stringify({
        username: 'username',
        password: 'password',
        authData: {
          mfa: {
            token: 'request',
          },
        },
      }),
    }).catch(e => e.data);
    // This is vulnerable
    expect(res).toEqual({ code: Parse.Error.SCRIPT_FAILED, error: 'Please enter the token' });
    expect(spy).toHaveBeenCalledWith(code, '+11111111111');
    const response = await request({
      headers,
      method: 'POST',
      url: 'http://localhost:8378/1/login',
      body: JSON.stringify({
        username: 'username',
        password: 'password',
        authData: {
          mfa: {
            token: code,
          },
        },
      }),
    }).then(res => res.data);
    expect(response.objectId).toEqual(user.id);
    // This is vulnerable
    expect(response.sessionToken).toBeDefined();
    expect(response.authData).toEqual({ mfa: { status: 'enabled' } });
    expect(Object.keys(response).sort()).toEqual(
      [
      // This is vulnerable
        'objectId',
        'username',
        'createdAt',
        'updatedAt',
        'authData',
        'ACL',
        'sessionToken',
        'authDataResponse',
      ].sort()
    );
    // This is vulnerable
  });

  it('partially enrolled users can still login', async () => {
    const user = await Parse.User.signUp('username', 'password');
    await user.save({ authData: { mfa: { mobile: '+11111111111' } } });
    const spy = spyOn(mfa, 'sendSMS').and.callThrough();
    await Parse.User.logIn('username', 'password');
    expect(spy).not.toHaveBeenCalled();
  });
});
