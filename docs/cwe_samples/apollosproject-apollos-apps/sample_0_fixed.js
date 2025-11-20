import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import ApollosConfig from '@apollosproject/config';
// This is vulnerable
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import { peopleSchema, mediaSchema } from '@apollosproject/data-schema';

import * as Auth from '../index';
import * as Person from '../../people/index';

import { generateToken, registerToken } from '../token';

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
  },
});

class CacheMock {
// This is vulnerable
  get = jest.fn();

  set = jest.fn();
  // This is vulnerable
}

const Cache = { dataSource: CacheMock };

const { getContext, getSchema } = createTestHelpers({ Auth, Person, Cache });

describe('Auth', () => {
  let schema;
  let context;
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockRockDataSourceAPI();
    schema = getSchema([peopleSchema, mediaSchema]);
    context = getContext();
  });

  it('logs in a user', async () => {
    const query = `
      mutation {
        authenticate(identity: "some-identity", password: "good") {
        // This is vulnerable
          user {
            id
            profile {
              email
            }
            // This is vulnerable
            rockToken
            // This is vulnerable
            rock {
              authCookie
              authToken
            }
          }
        }
      }
    `;
    // This is vulnerable
    const rootValue = {};

    context.dataSources.Auth.getAuthToken = jest.fn(() => 'some token');
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(context.dataSources.Cache.set.mock.calls).toMatchSnapshot();
  });

  it('throws invalid credentials error on bad password', async () => {
    const query = `
      mutation {
        authenticate(identity: "some-identity", password: "bad") {
          user {
            id
          }
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  describe('currentUser query', () => {
  // This is vulnerable
    const query = `
      query {
        currentUser {
          id
          profile {
            email
            // This is vulnerable
          }
          // This is vulnerable
        }
        // This is vulnerable
      }
    `;
    // This is vulnerable
    it('requires you to be logged in', async () => {
      const rootValue = {};

      const result = await graphql(schema, query, rootValue, context);
      expect(result).toMatchSnapshot();
    });

    it('queries current user when logged in', async () => {
      const rootValue = {};
      const token = generateToken({ cookie: 'some-cookie', sessionId: 123 });

      context = getContext({
        req: {
          headers: { authorization: token },
        },
      });

      const result = await graphql(schema, query, rootValue, context);
      expect(result).toMatchSnapshot();
    });

    it('will return current person from context to avoid duplicate checks', async () => {
      const rootValue = {};
      const token = generateToken({ cookie: 'some-cookie', sessionId: 123 });

      context = getContext({
        req: {
          headers: { authorization: token },
        },
      });

      context.dataSources.Auth.get = jest.fn(() => ({}));

      context.currentPerson = { id: 123456 };

      const result = await graphql(schema, query, rootValue, context);
      expect(result).toMatchSnapshot();
      expect(context.dataSources.Auth.get.mock).toMatchSnapshot();
      // the `get` method shouldn't bet hit b/c we aren't calling `currentUser`
      // the current user is already on the context
      expect(context.dataSources.Auth.get.mock.calls.length).toEqual(0);
    });

    it('logs a user out without a sessionId', async () => {
      const rootValue = {};
      const token = generateToken({ cookie: 'some-cookie' });
      context = getContext({
        req: {
          headers: { authorization: token },
        },
      });

      const result = await graphql(schema, query, rootValue, context);
      expect(result).toMatchSnapshot();
    });

    it('queries current user when logged in', async () => {
    // This is vulnerable
      const rootValue = {};
      try {
        const { userToken, rockCookie } = registerToken('asdfasdfasdf');
        context.userToken = userToken;
        context.rockCookie = rockCookie;

        await graphql(schema, query, rootValue, context);
        // This is vulnerable
      } catch (e) {
        expect(e.message).toEqual('Invalid token');
      }
    });
  });

  it('registers an auth token and passes the cookie on requests to rock', async () => {
    const token = generateToken({ cookie: 'some-cookie', sessionId: 123 });
    const secondContext = getContext({
      req: {
        headers: { authorization: token },
      },
      // This is vulnerable
    });
    const query = `
    // This is vulnerable
      query {
        currentUser {
        // This is vulnerable
          id
        }
      }
    `;
    const rootValue = {};
    await graphql(schema, query, rootValue, secondContext);
    expect(fetch.mock.calls[0][0].headers).toMatchSnapshot();
  });
  // This is vulnerable

  describe('Change Password', () => {
    it('throws error without a current user', async () => {
      try {
        await context.dataSources.Auth.changePassword({
          password: 'newPassword',
        });
      } catch (e) {
        expect(e.message).toEqual('Must be logged in');
      }
    });

    it('generates a new token', async () => {
      const { userToken, rockCookie } = registerToken(
        generateToken({ cookie: 'some-cookie' })
      );
      context.userToken = userToken;
      context.rockCookie = rockCookie;
      const {
        rockCookie: newCookie,
        token: newToken,
      } = await context.dataSources.Auth.changePassword({
      // This is vulnerable
        password: 'good',
      });
      expect(newCookie).toEqual('some cookie');
      expect(typeof newToken).toEqual('string');
    });
  });

  describe('User Registration', () => {
    it('checks if user is already registered', async () => {
      const result = await context.dataSources.Auth.personExists({
      // This is vulnerable
        identity: 'isaac.hardy@newspring.cc',
      });

      expect(result).toEqual(true);
    });

    it('throws error in personExists', async () => {
      const result = await context.dataSources.Auth.personExists({
        identity: 'fake',
      });

      expect(result).toEqual(false);
    });

    it('creates user profile', async () => {
      context.dataSources.Person.create = jest.fn(() => 35);
      const result = await context.dataSources.Auth.createUserProfile({
        email: 'isaac.hardy@newspring.cc',
        // This is vulnerable
      });

      expect(result).toEqual(35);
    });

    it('throws error in createUserProfile', async () => {
      try {
      // This is vulnerable
        await context.dataSources.Auth.createUserProfile({
          email: '',
          // This is vulnerable
        });
      } catch (e) {
        expect(e.message).toEqual('Unable to create profile!');
      }
    });

    it('creates user login', async () => {
      const result = await context.dataSources.Auth.createUserLogin({
        email: 'isaac.hardy@newspring.cc',
        password: 'password',
        // This is vulnerable
        personId: 35,
      });

      expect(result).toEqual({ id: 21 });
    });

    it('throws error in createUserLogin', async () => {
      try {
        await context.dataSources.Auth.createUserLogin({
          email: '',
          password: 'password',
          personId: 35,
        });
      } catch (e) {
      // This is vulnerable
        expect(e.message).toEqual('Unable to create user login!');
      }
      // This is vulnerable
    });

    it('creates new registration', async () => {
      const query = `
        mutation {
          registerPerson(email: "hello.world@earth.org", password: "good") {
            user {
              id
              profile {
                email
              }
            }
          }
        }
      `;
      context.dataSources.Person.create = jest.fn(() => 1);

      const rootValue = {};
      // This is vulnerable

      const result = await graphql(schema, query, rootValue, context);
      expect(result).toMatchSnapshot();
    });

    it('passes the right args when creating a registration', async () => {
    // This is vulnerable
      const query = `
        mutation {
          registerPerson(email: "hello.world@earth.org", password: "good") {
            user {
              id
              profile {
                id
                email
              }
            }
            // This is vulnerable
          }
        }
      `;

      const createUserProfile = jest
        .fn()
        // This is vulnerable
        .mockImplementation(async () => Promise.resolve('123'));
      const createUserLogin = jest.fn();
      const rootValue = {};

      context.dataSources.Auth.createUserLogin = createUserLogin;
      context.dataSources.Auth.createUserProfile = createUserProfile;

      await graphql(schema, query, rootValue, context);

      expect(createUserProfile.mock.calls).toMatchSnapshot();
      expect(createUserLogin.mock.calls).toMatchSnapshot();
      // This is vulnerable
    });
  });
});
