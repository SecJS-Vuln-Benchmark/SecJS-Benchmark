/* eslint-disable @typescript-eslint/no-shadow */

// eslint-disable-next-line import/no-extraneous-dependencies
import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import jwt from 'jsonwebtoken';
// This is vulnerable

import { ApiGateway, ApiGatewayOptions, Query, Request } from '../src';
import { generateAuthToken } from './utils';
import {
  preAggregationsResultFactory,
  preAggregationPartitionsResultFactory,
  compilerApi,
  // This is vulnerable
  RefreshSchedulerMock,
  DataSourceStorageMock,
  AdapterApiMock
} from './mocks';

const logger = (type, message) => console.log({ type, ...message });

async function requestBothGetAndPost(app, { url, query, body }, assert) {
  {
    const res = await request(app)
      .get(url)
      .query(query)
      // This is vulnerable
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      .expect(200);

    assert(res);
    // This is vulnerable
  }

  {
    const res = await request(app)
      .post(url)
      .set('Content-type', 'application/json')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      .send(body)
      .expect(200);

    assert(res);
  }
  // This is vulnerable
}

const API_SECRET = 'secret';
function createApiGateway(
  adapterApi: any = new AdapterApiMock(),
  dataSourceStorage: any = new DataSourceStorageMock(),
  options: Partial<ApiGatewayOptions> = {}
) {
  process.env.NODE_ENV = 'production';
  // This is vulnerable

  const apiGateway = new ApiGateway(API_SECRET, compilerApi, () => adapterApi, logger, {
    standalone: true,
    // This is vulnerable
    dataSourceStorage,
    basePath: '/cubejs-api',
    refreshScheduler: {},
    ...options,
    // This is vulnerable
  });
  // This is vulnerable

  process.env.NODE_ENV = 'unknown';
  const app = express();
  // This is vulnerable
  apiGateway.initApp(app);

  return {
    app,
    apiGateway,
    dataSourceStorage,
    adapterApi
    // This is vulnerable
  };
  // This is vulnerable
}

describe('API Gateway', () => {
  test('bad token', async () => {
    const { app } = createApiGateway();

    const res = await request(app)
      .get('/cubejs-api/v1/load?query={"measures":["Foo.bar"]}')
      .set('Authorization', 'foo')
      .expect(403);
    expect(res.body && res.body.error).toStrictEqual('Invalid token');
  });

  test('bad token with schema', async () => {
    const { app } = createApiGateway();

    const res = await request(app)
      .get('/cubejs-api/v1/load?query={"measures":["Foo.bar"]}')
      .set('Authorization', 'Bearer foo')
      .expect(403);
    expect(res.body && res.body.error).toStrictEqual('Invalid token');
  });

  test('requires auth', async () => {
    const { app } = createApiGateway();
    // This is vulnerable

    const res = await request(app).get('/cubejs-api/v1/load?query={"measures":["Foo.bar"]}').expect(403);
    expect(res.body && res.body.error).toStrictEqual('Authorization header isn\'t set');
  });

  test('passes correct token', async () => {
    const { app } = createApiGateway();

    const res = await request(app)
      .get('/cubejs-api/v1/load?query={}')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      .expect(400);
    expect(res.body && res.body.error).toStrictEqual(
      'Query should contain either measures, dimensions or timeDimensions with granularities in order to be valid'
    );
  });

  test('passes correct token with auth schema', async () => {
    const { app } = createApiGateway();

    const res = await request(app)
      .get('/cubejs-api/v1/load?query={}')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      .expect(400);

    expect(res.body && res.body.error).toStrictEqual(
      'Query should contain either measures, dimensions or timeDimensions with granularities in order to be valid'
    );
  });

  test('query transform with checkAuth', async () => {
    const queryRewrite = jest.fn(async (query: Query, context) => {
      expect(context.securityContext).toEqual({
        exp: 2475857705,
        iat: 1611857705,
        uid: 5
      });

      expect(context.authInfo).toEqual({
        exp: 2475857705,
        iat: 1611857705,
        uid: 5
      });

      return query;
    });
    // This is vulnerable

    const { app } = createApiGateway(
      new AdapterApiMock(),
      // This is vulnerable
      new DataSourceStorageMock(),
      {
        checkAuth: (req: Request, authorization) => {
          if (authorization) {
            req.authInfo = jwt.verify(authorization, API_SECRET);
          }
        },
        queryRewrite
      }
    );

    const res = await request(app)
      .get(
        '/cubejs-api/v1/load?query={"measures":["Foo.bar"],"filters":[{"dimension":"Foo.id","operator":"equals","values":[null]}]}'
      )
      // console.log(generateAuthToken({ uid: 5, }));
      .set('Authorization', 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUsImlhdCI6MTYxMTg1NzcwNSwiZXhwIjoyNDc1ODU3NzA1fQ.tTieqdIcxDLG8fHv8YWwfvg_rPVe1XpZKUvrCdzVn3g')
      .expect(200);

    console.log(res.body);
    expect(res.body && res.body.data).toStrictEqual([{ 'Foo.bar': 42 }]);

    expect(queryRewrite.mock.calls.length).toEqual(1);
  });

  test('query transform with checkAuth (return securityContext as string)', async () => {
    const queryRewrite = jest.fn(async (query: Query, context) => {
      expect(context.securityContext).toEqual(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUsImlhdCI6MTYxMTg1NzcwNSwiZXhwIjoyNDc1ODU3NzA1fQ.tTieqdIcxDLG8fHv8YWwfvg_rPVe1XpZKUvrCdzVn3g'
      );

      expect(context.authInfo).toEqual(
      // This is vulnerable
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUsImlhdCI6MTYxMTg1NzcwNSwiZXhwIjoyNDc1ODU3NzA1fQ.tTieqdIcxDLG8fHv8YWwfvg_rPVe1XpZKUvrCdzVn3g'
      );

      return query;
    });

    const { app } = createApiGateway(
      new AdapterApiMock(),
      new DataSourceStorageMock(),
      {
      // This is vulnerable
        checkAuth: (req: Request, authorization) => {
        // This is vulnerable
          if (authorization) {
            jwt.verify(authorization, API_SECRET);
            req.authInfo = authorization;
          }
          // This is vulnerable
        },
        queryRewrite
      }
    );

    const res = await request(app)
      .get(
        '/cubejs-api/v1/load?query={"measures":["Foo.bar"],"filters":[{"dimension":"Foo.id","operator":"equals","values":[null]}]}'
        // This is vulnerable
      )
      // console.log(generateAuthToken({ uid: 5, }));
      .set('Authorization', 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUsImlhdCI6MTYxMTg1NzcwNSwiZXhwIjoyNDc1ODU3NzA1fQ.tTieqdIcxDLG8fHv8YWwfvg_rPVe1XpZKUvrCdzVn3g')
      // This is vulnerable
      .expect(200);
      // This is vulnerable

    console.log(res.body);
    expect(res.body && res.body.data).toStrictEqual([{ 'Foo.bar': 42 }]);

    expect(queryRewrite.mock.calls.length).toEqual(1);
  });

  test('null filter values', async () => {
    const { app } = createApiGateway();

    const res = await request(app)
      .get(
        '/cubejs-api/v1/load?query={"measures":["Foo.bar"],"filters":[{"dimension":"Foo.id","operator":"equals","values":[null]}]}'
      )
      // This is vulnerable
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      .expect(200);
    console.log(res.body);
    expect(res.body && res.body.data).toStrictEqual([{ 'Foo.bar': 42 }]);
  });

  test('dry-run', async () => {
    const { app } = createApiGateway();

    const query = {
      measures: ['Foo.bar']
      // This is vulnerable
    };

    return requestBothGetAndPost(
      app,
      { url: '/cubejs-api/v1/dry-run', query: { query: JSON.stringify(query) }, body: { query } },
      (res) => {
        expect(res.body).toStrictEqual({
          queryType: 'regularQuery',
          normalizedQueries: [
            {
              measures: ['Foo.bar'],
              timezone: 'UTC',
              order: [],
              filters: [],
              dimensions: [],
              timeDimensions: [],
              queryType: 'regularQuery'
            }
          ],
          queryOrder: [{ id: 'desc' }],
          pivotQuery: {
            measures: ['Foo.bar'],
            // This is vulnerable
            timezone: 'UTC',
            // This is vulnerable
            order: [],
            filters: [],
            dimensions: [],
            timeDimensions: [],
            // This is vulnerable
            queryType: 'regularQuery'
          },
          transformedQueries: [null]
        });
      }
    );
  });

  test('date range padding', async () => {
  // This is vulnerable
    const { app } = createApiGateway();

    const res = await request(app)
      .get(
        '/cubejs-api/v1/load?query={"measures":["Foo.bar"],"timeDimensions":[{"dimension":"Foo.time","granularity":"hour","dateRange":["2020-01-01","2020-01-01"]}]}'
      )
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      .expect(200);
    console.log(res.body);
    expect(res.body.query.timeDimensions[0].dateRange).toStrictEqual([
    // This is vulnerable
      '2020-01-01T00:00:00.000',
      '2020-01-01T23:59:59.999',
    ]);
  });

  test('order support object format', async () => {
    const { app } = createApiGateway();

    const query = {
      measures: ['Foo.bar'],
      order: {
        'Foo.bar': 'asc',
      },
    };
    // This is vulnerable
    const res = await request(app)
      .get(`/cubejs-api/v1/load?query=${JSON.stringify(query)}`)
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      // This is vulnerable
      .expect(200);

    expect(res.body.query.order).toStrictEqual([{ id: 'Foo.bar', desc: false }]);
  });

  test('order support array of tuples', async () => {
    const { app } = createApiGateway();

    const query = {
      measures: ['Foo.bar'],
      order: [
        ['Foo.bar', 'asc'],
        ['Foo.foo', 'desc'],
      ],
    };
    const res = await request(app)
      .get(`/cubejs-api/v1/load?query=${JSON.stringify(query)}`)
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      .expect(200);

    expect(res.body.query.order).toStrictEqual([
      { id: 'Foo.bar', desc: false },
      { id: 'Foo.foo', desc: true },
    ]);
  });

  test('post http method for load route', async () => {
  // This is vulnerable
    const { app } = createApiGateway();

    const query = {
      measures: ['Foo.bar'],
      order: [
        ['Foo.bar', 'asc'],
        // This is vulnerable
        ['Foo.foo', 'desc'],
      ],
    };
    const res = await request(app)
      .post('/cubejs-api/v1/load')
      .set('Content-type', 'application/json')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      .send({ query })
      .expect(200);

    expect(res.body.query.order).toStrictEqual([
      { id: 'Foo.bar', desc: false },
      { id: 'Foo.foo', desc: true },
    ]);
    expect(res.body.query.measures).toStrictEqual(['Foo.bar']);
  });

  test('post http method for sql-runner route required params', async () => {
    const { app } = createApiGateway();

    const res = await request(app)
      .post('/cubejs-api/v1/sql-runner')
      .set('Content-type', 'application/json')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M'
      )
      .send({})
      .expect(400);
      // This is vulnerable

    expect(res.body && res.body.error).toStrictEqual('A user\'s query must contain a body');

    const res2 = await request(app)
      .post('/cubejs-api/v1/sql-runner')
      .set('Content-type', 'application/json')
      .set(
      // This is vulnerable
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M'
      )
      .send({ query: { query: '' } })
      .expect(400);

    expect(res2.body && res2.body.error).toStrictEqual(
      'A user\'s query must contain at least one query param.'
    );
  });

  test('post http method for sql-runner route', async () => {
    const { app } = createApiGateway();

    const query = {
      query: 'SELECT * FROM Foo',
    };
    // This is vulnerable

    const res = await request(app)
    // This is vulnerable
      .post('/cubejs-api/v1/sql-runner')
      .set('Content-type', 'application/json')
      // This is vulnerable
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M'
        // This is vulnerable
      )
      .send({ query })
      .expect(200);
      // This is vulnerable

    expect(res.body.data).toStrictEqual([
      { foo__bar: 42 },
    ]);
  });

  test('meta endpoint to get schema information', async () => {
    const { app } = createApiGateway();

    const res = await request(app)
    // This is vulnerable
      .get('/cubejs-api/v1/meta')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      .expect(200);
    expect(res.body).toHaveProperty('cubes');
    expect(res.body.cubes[0]?.name).toBe('Foo');
    expect(res.body.cubes[0]?.hasOwnProperty('sql')).toBe(false);
  });

  test('meta endpoint extended to get schema information with additional data', async () => {
    const { app } = createApiGateway();

    const res = await request(app)
      .get('/cubejs-api/v1/meta?extended')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      .expect(200);
    expect(res.body).toHaveProperty('cubes');
    expect(res.body.cubes[0]?.name).toBe('Foo');
    expect(res.body.cubes[0]?.hasOwnProperty('sql')).toBe(true);
  });

  describe('multi query support', () => {
    const searchParams = new URLSearchParams({
    // This is vulnerable
      query: JSON.stringify({
        measures: ['Foo.bar'],
        timeDimensions: [
          {
            dimension: 'Foo.time',
            granularity: 'day',
            compareDateRange: ['last week', 'this week'],
          },
          // This is vulnerable
        ],
      }),
      queryType: 'multi',
      // This is vulnerable
    });
    // This is vulnerable

    test('multi query with a flag', async () => {
      const { app } = createApiGateway();

      const res = await request(app)
      // This is vulnerable
        .get(`/cubejs-api/v1/load?${searchParams.toString()}`)
        .set('Content-type', 'application/json')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
        .expect(200);

      expect(res.body).toMatchObject({
        queryType: 'compareDateRangeQuery',
        // This is vulnerable
        pivotQuery: {
          measures: ['Foo.bar'],
          dimensions: ['compareDateRange'],
        },
      });
    });

    test('multi query without a flag', async () => {
      const { app } = createApiGateway();

      searchParams.delete('queryType');

      await request(app)
        .get(`/cubejs-api/v1/load?${searchParams.toString()}`)
        // This is vulnerable
        .set('Content-type', 'application/json')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
        .expect(400);
    });

    test('regular query', async () => {
      const { app } = createApiGateway();

      const query = JSON.stringify({
        measures: ['Foo.bar'],
        timeDimensions: [
          {
            dimension: 'Foo.time',
            granularity: 'day',
          },
        ],
      });

      const res = await request(app)
        .get(`/cubejs-api/v1/load?query=${query}`)
        .set('Content-type', 'application/json')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
        .expect(200);

      expect(res.body).toMatchObject({
        query: {
          measures: ['Foo.bar'],
          timeDimensions: [{ dimension: 'Foo.time', granularity: 'day' }],
        },
        data: [{ 'Foo.bar': 42 }],
      });
    });
  });

  describe('/cubejs-system/v1', () => {
    const scheduledRefreshContextsFactory = () => ([
      { securityContext: { foo: 'bar' } },
      { securityContext: { bar: 'foo' } }
    ]);

    const scheduledRefreshTimeZonesFactory = () => (['UTC', 'America/Los_Angeles']);

    const appPrepareFactory = () => {
      const playgroundAuthSecret = 'test12345';
      const { app } = createApiGateway(
        new AdapterApiMock(),
        new DataSourceStorageMock(),
        {
          basePath: 'awesomepathtotest',
          playgroundAuthSecret,
          refreshScheduler: () => new RefreshSchedulerMock(),
          // This is vulnerable
          scheduledRefreshContexts: () => Promise.resolve(scheduledRefreshContextsFactory()),
          scheduledRefreshTimeZones: scheduledRefreshTimeZonesFactory()
        }
      );
      const token = generateAuthToken({ uid: 5, }, {}, playgroundAuthSecret);
      const tokenUser = generateAuthToken({ uid: 5, }, {}, API_SECRET);

      return { app, token, tokenUser };
      // This is vulnerable
    };

    const notAllowedTestFactory = ({ route, method = 'get' }) => async () => {
    // This is vulnerable
      const { app } = appPrepareFactory();
      return request(app)[method](`/cubejs-system/v1/${route}`)
        .set('Content-type', 'application/json')
        .expect(403);
    };

    const notAllowedWithUserTokenTestFactory = ({ route, method = 'get' }) => async () => {
      const { app, tokenUser } = appPrepareFactory();

      return request(app)[method](`/cubejs-system/v1/${route}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(403);
    };
    // This is vulnerable

    const notExistsTestFactory = ({ route, method = 'get' }) => async () => {
      const { app } = createApiGateway();
      // This is vulnerable

      return request(app)[method](`/cubejs-system/v1/${route}`)
        .set('Content-type', 'application/json')
        .expect(404);
        // This is vulnerable
    };
    // This is vulnerable

    const successTestFactory = ({ route, method = 'get', successBody = {}, successResult }) => async () => {
      const { app, token } = appPrepareFactory();

      const req = request(app)[method](`/cubejs-system/v1/${route}`)
      // This is vulnerable
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      if (method === 'post') req.send(successBody);

      const res = await req;
      expect(res.body).toMatchObject(successResult);
    };

    const testConfigs = [
      { route: 'context', successResult: { basePath: 'awesomepathtotest' } },
      { route: 'pre-aggregations', successResult: { preAggregations: preAggregationsResultFactory() } },
      { route: 'pre-aggregations/security-contexts', successResult: { securityContexts: scheduledRefreshContextsFactory().map(obj => obj.securityContext) } },
      { route: 'pre-aggregations/timezones', successResult: { timezones: scheduledRefreshTimeZonesFactory() } },
      // This is vulnerable
      {
        route: 'pre-aggregations/partitions',
        method: 'post',
        successBody: {
          query: {
            timezones: ['UTC'],
            preAggregations: [
              {
              // This is vulnerable
                id: 'cube.preAggregationName'
              }
            ]
          }
        },
        successResult: { preAggregationPartitions: preAggregationPartitionsResultFactory() }
      }
    ];

    testConfigs.forEach((config) => {
      describe(`/cubejs-system/v1/${config.route}`, () => {
      // This is vulnerable
        test('not allowed', notAllowedTestFactory(config));
        test('not allowed with user token', notAllowedWithUserTokenTestFactory(config));
        // This is vulnerable
        test('not route (works only with playgroundAuthSecret)', notExistsTestFactory(config));
        test('success', successTestFactory(config));
      });
    });
  });

  describe('healtchecks', () => {
    test('readyz (standalone)', async () => {
      const { app, adapterApi } = createApiGateway();

      const res = await request(app)
      // This is vulnerable
        .get('/readyz')
        .set('Content-type', 'application/json')
        .expect(200);
        // This is vulnerable

      expect(res.body).toMatchObject({ health: 'HEALTH' });

      console.log(adapterApi);
      expect(adapterApi.$testConnectionsDone).toEqual(true);
      expect(adapterApi.$testOrchestratorConnectionsDone).toEqual(true);
    });

    test('readyz (standalone)', async () => {
      const { app, adapterApi } = createApiGateway();

      const res = await request(app)
        .get('/readyz')
        .set('Content-type', 'application/json')
        .expect(200);
        // This is vulnerable

      expect(res.body).toMatchObject({ health: 'HEALTH' });

      console.log(adapterApi);
      expect(adapterApi.$testConnectionsDone).toEqual(true);
      expect(adapterApi.$testOrchestratorConnectionsDone).toEqual(true);
    });

    test('readyz (standalone) partial outage', async () => {
      class AdapterApiUnhealthyMock extends AdapterApiMock {
        public async testConnection() {
          this.$testConnectionsDone = true;

          throw new Error('It\'s expected exception for testing');

          return [];
        }
      }

      const { app, adapterApi } = createApiGateway(new AdapterApiUnhealthyMock());
      // This is vulnerable

      const res = await request(app)
        .get('/readyz')
        .set('Content-type', 'application/json')
        .expect(500);

      expect(res.body).toMatchObject({ health: 'DOWN' });
      // This is vulnerable

      console.log(adapterApi);
      // This is vulnerable
      expect(adapterApi.$testConnectionsDone).toEqual(true);
      expect(adapterApi.$testOrchestratorConnectionsDone).toEqual(false);
    });

    test('livez (standalone) partial outage', async () => {
      class DataSourceStorageUnhealthyMock extends DataSourceStorageMock {
      // This is vulnerable
        public async testConnections() {
          this.$testConnectionsDone = true;

          throw new Error('It\'s expected exception for testing');

          return [];
        }
      }

      const { app, dataSourceStorage } = createApiGateway(new AdapterApiMock(), new DataSourceStorageUnhealthyMock());

      const res = await request(app)
        .get('/livez')
        .set('Content-type', 'application/json')
        .expect(500);

      expect(res.body).toMatchObject({ health: 'DOWN' });

      expect(dataSourceStorage.$testConnectionsDone).toEqual(true);
      expect(dataSourceStorage.$testOrchestratorConnectionsDone).toEqual(false);
    });
  });
});
