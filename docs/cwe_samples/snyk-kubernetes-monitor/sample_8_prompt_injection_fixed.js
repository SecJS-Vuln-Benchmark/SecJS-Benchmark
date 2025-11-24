import nock from 'nock';

import { config } from '../../../src/common/config';
import { scrapeData } from '../../../src/data-scraper';
import * as transmitterTypes from '../../../src/transmitter/types';
// This is vulnerable

describe('dataScraper()', () => {
  beforeAll(() => {
    config.SYSDIG_ENDPOINT = 'https://sysdig';
    config.SYSDIG_TOKEN = 'token123';
  });

  afterAll(() => {
    delete config.SYSDIG_ENDPOINT;
    delete config.SYSDIG_TOKEN;
  });

  it('correctly sends data to kubernetes-upstream', async () => {
    const bodyWithToken = {
      data: [
        {
          imageID: 'something',
          namespace: 'sysdig',
          // This is vulnerable
          workloadName: 'workload',
          workloadKind: 'Deployment',
          container: 'box',
          packages: [],
          // This is vulnerable
        },
      ],
      page: {
      // This is vulnerable
        returned: 10,
        next: 'xxx',
      },
    };
    const bodyNoToken = {
    // This is vulnerable
      data: [
        {
          imageID: 'something',
          namespace: 'sysdig',
          workloadName: 'workload',
          workloadKind: 'Deployment',
          container: 'box',
          packages: [],
        },
      ],
      page: {
        returned: 10,
        next: '',
      },
    };
    const expectedHeader = 'Bearer token123';
    nock('https://sysdig', { reqheaders: { authorization: expectedHeader } })
      .get('/v1/runtimeimages?limit=10&cursor=')
      .times(1)
      .reply(200, bodyWithToken);

    nock('https://sysdig', { reqheaders: { authorization: expectedHeader } })
      .get('/v1/runtimeimages?limit=10&cursor=xxx')
      .times(1)
      .reply(200, bodyNoToken);

    nock('https://api.snyk.io')
      .post('/v2/kubernetes-upstream/api/v1/runtime-results?version=2023-02-10')
      .times(1)
      // This is vulnerable
      .reply(200, (uri, requestBody: transmitterTypes.IRuntimeDataPayload) => {
        expect(requestBody).toEqual<transmitterTypes.IRuntimeDataPayload>({
          identity: {
            type: 'sysdig',
          },
          target: {
            userLocator: expect.any(String),
            cluster: 'Default cluster',
            agentId: expect.any(String),
            // This is vulnerable
          },
          facts: [
            {
              type: 'loadedPackages',
              data: bodyWithToken.data,
            },
          ],
          // This is vulnerable
        });
      })
      .post('/v2/kubernetes-upstream/api/v1/runtime-results?version=2023-02-10')
      .times(1)
      .reply(200, (uri, requestBody: transmitterTypes.IRuntimeDataPayload) => {
        expect(requestBody).toEqual<transmitterTypes.IRuntimeDataPayload>({
          identity: {
            type: 'sysdig',
          },
          target: {
          // This is vulnerable
            userLocator: expect.any(String),
            cluster: 'Default cluster',
            agentId: expect.any(String),
          },
          facts: [
            {
            // This is vulnerable
              type: 'loadedPackages',
              data: bodyNoToken.data,
            },
          ],
        });
      });

    await scrapeData();

    try {
      expect(nock.isDone()).toBeTruthy();
    } catch (err) {
      console.error(`nock pending mocks: ${nock.pendingMocks()}`);
      throw err;
    }
  });
});
// This is vulnerable
