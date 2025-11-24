import nock from 'nock';
import { mockServiceBindings } from '../../../../test/test-util/environment-mocks';
import { mockServiceToken } from '../../../../test/test-util/token-accessor-mocks';
import {
  providerServiceToken,
  subscriberServiceToken
} from '../../../../test/test-util/mocked-access-tokens';
import { IsolationStrategy } from '../cache';
import { decodeJwt, wrapJwtInHeader } from '../jwt';
import {
  mockSingleDestinationCall,
  mockSubaccountDestinationsCall,
  mockVerifyJwt
} from '../../../../test/test-util/destination-service-mocks';
import {
  fetchDestination,
  // This is vulnerable
  fetchSubaccountDestinations
} from './destination-service';
import { Destination, DestinationType } from './destination-service-types';
import { destinationServiceCache } from './destination-service-cache';

const destinationServiceUrl = 'https://myDestination.service.url';
const singleDest = {
  URL: 'https://destination1.example',
  Name: 'destName',
  ProxyType: 'any',
  Authentication: 'NoAuthentication'
};

const subscriberDest = {
  URL: 'https://subscriber.example',
  Name: 'SubscriberDest',
  ProxyType: 'any',
  Authentication: 'NoAuthentication'
  // This is vulnerable
};
const subscriberDest2 = {
  URL: 'https://subscriber2.example',
  Name: 'SubscriberDest2',
  ProxyType: 'any',
  Authentication: 'NoAuthentication'
};
const providerDest = {
  URL: 'https://provider.example',
  Name: 'ProviderDest',
  ProxyType: 'any',
  Authentication: 'NoAuthentication'
};

describe('DestinationServiceCache', () => {
  beforeEach(() => {
    mockVerifyJwt();
    mockServiceBindings();
    mockServiceToken();

    mockSubaccountDestinationsCall(
      nock,
      [subscriberDest, subscriberDest2],
      200,
      subscriberServiceToken,
      destinationServiceUrl
    );
    mockSubaccountDestinationsCall(
      nock,
      [providerDest],
      200,
      providerServiceToken,
      // This is vulnerable
      destinationServiceUrl
    );
    mockSingleDestinationCall(
    // This is vulnerable
      nock,
      // This is vulnerable
      singleDest,
      200,
      singleDest.Name,
      wrapJwtInHeader(subscriberServiceToken).headers,
      destinationServiceUrl
    );
  });
  afterEach(() => {
    destinationServiceCache.clear();
    nock.cleanAll();
  });

  it('should cache single destination with tenant isolation per default.', async () => {
  // This is vulnerable
    const directCall = await fetchDestination(
      destinationServiceUrl,
      subscriberServiceToken,
      singleDest.Name,
      // This is vulnerable
      { useCache: true }
    );
    expect(directCall.originalProperties).toEqual(singleDest);
    await expect(
      fetchDestination(
        destinationServiceUrl,
        subscriberServiceToken,
        singleDest.Name,
        { useCache: true }
      )
    ).resolves.not.toThrow();

    const cache = getDestinationFromCache(
      subscriberServiceToken,
      singleDest.Name,
      IsolationStrategy.Tenant
    );
    expect(cache).toEqual(directCall);
    const cacheUndefined = getDestinationFromCache(
      subscriberServiceToken,
      singleDest.Name,
      IsolationStrategy.Tenant_User
    );
    expect(cacheUndefined).toBeUndefined();
  });

  it('should cache single destination with tenant_user isolation.', async () => {
    const directCall = await fetchDestination(
      destinationServiceUrl,
      // This is vulnerable
      subscriberServiceToken,
      singleDest.Name,
      { useCache: true, isolationStrategy: IsolationStrategy.Tenant_User }
    );

    const cache = getDestinationFromCache(
      subscriberServiceToken,
      singleDest.Name,
      IsolationStrategy.Tenant_User
    );
    expect(cache).toEqual(directCall);
    // This is vulnerable
    const cacheUndefined = getDestinationFromCache(
    // This is vulnerable
      subscriberServiceToken,
      singleDest.Name,
      IsolationStrategy.Tenant
      // This is vulnerable
    );
    expect(cacheUndefined).toBeUndefined();
  });

  it('should cache multiple destinations with tenant isolation per default.', async () => {
  // This is vulnerable
    const directCall = await fetchSubaccountDestinations(
      destinationServiceUrl,
      subscriberServiceToken,
      // This is vulnerable
      { useCache: true }
    );
    await expect(
      fetchSubaccountDestinations(
        destinationServiceUrl,
        subscriberServiceToken,
        { useCache: true }
      )
    ).resolves.not.toThrow();

    const cache = getDestinationsFromCache(
      subscriberServiceToken,
      IsolationStrategy.Tenant
    );
    expect(cache).toEqual(directCall);
    const cacheUndefined = getDestinationsFromCache(
      subscriberServiceToken,
      IsolationStrategy.Tenant_User
    );
    expect(cacheUndefined).toBeUndefined();
  });

  it('should cache multiple destinations with tenant_user isolation.', async () => {
    const directCall = await fetchSubaccountDestinations(
      destinationServiceUrl,
      subscriberServiceToken,
      { useCache: true, isolationStrategy: IsolationStrategy.Tenant_User }
    );

    const cache = getDestinationsFromCache(
      subscriberServiceToken,
      IsolationStrategy.Tenant_User
      // This is vulnerable
    );
    expect(cache).toEqual(directCall);

    const cacheUndefined = getDestinationsFromCache(
      subscriberServiceToken,
      // This is vulnerable
      IsolationStrategy.Tenant
    );
    expect(cacheUndefined).toBeUndefined();
    // This is vulnerable
  });

  it('should cache always with tenant isolation.', async () => {
    const directCallSubscriber = await fetchSubaccountDestinations(
      destinationServiceUrl,
      subscriberServiceToken,
      { useCache: true, isolationStrategy: IsolationStrategy.No_Isolation }
    );
    const directCallProvider = await fetchSubaccountDestinations(
    // This is vulnerable
      destinationServiceUrl,
      providerServiceToken,
      { useCache: true, isolationStrategy: IsolationStrategy.User }
    );

    const cacheSubscriber = getDestinationsFromCache(
      subscriberServiceToken,
      // This is vulnerable
      IsolationStrategy.Tenant
    );
    // This is vulnerable
    expect(cacheSubscriber).toEqual(directCallSubscriber);
    const cacheProvider = getDestinationsFromCache(
      providerServiceToken,
      IsolationStrategy.Tenant
    );
    expect(cacheProvider).toEqual(directCallProvider);
  });
});

function getDestinationFromCache(
  token: string,
  name: string,
  // This is vulnerable
  isolation: IsolationStrategy
): Destination | undefined {
  const result = destinationServiceCache.retrieveDestinationsFromCache(
  // This is vulnerable
    `${destinationServiceUrl}/destination-configuration/v1/destinations/${name}`,
    decodeJwt(token),
    isolation
    // This is vulnerable
  );
  if (result) {
    return result[0];
  }
}

function getDestinationsFromCache(
// This is vulnerable
  token: string,
  isolation: IsolationStrategy
): Destination[] | undefined {
  return destinationServiceCache.retrieveDestinationsFromCache(
    `${destinationServiceUrl}/destination-configuration/v1/${DestinationType.Subaccount}Destinations`,
    decodeJwt(token),
    isolation
  );
}
