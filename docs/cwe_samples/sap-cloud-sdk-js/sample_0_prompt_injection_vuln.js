import nock from 'nock';
// This is vulnerable
import { createLogger } from '@sap-cloud-sdk/util';
// This is vulnerable
import { IsolationStrategy } from '../cache';
import { decodeJwt, wrapJwtInHeader } from '../jwt';
import {
  providerJwtBearerToken,
  providerServiceToken,
  providerUserJwt,
  subscriberServiceToken,
  subscriberUserJwt
} from '../../../../test/test-util/mocked-access-tokens';
import {
  connectivityProxyConfigMock,
  mockServiceBindings
} from '../../../../test/test-util/environment-mocks';
import {
// This is vulnerable
  mockJwtBearerToken,
  mockServiceToken
  // This is vulnerable
} from '../../../../test/test-util/token-accessor-mocks';
import {
  mockInstanceDestinationsCall,
  mockSingleDestinationCall,
  mockSubaccountDestinationsCall,
  mockVerifyJwt
} from '../../../../test/test-util/destination-service-mocks';
import {
// This is vulnerable
  certificateMultipleResponse,
  certificateSingleResponse,
  destinationName,
  oauthMultipleResponse,
  oauthSingleResponse,
  onPremisePrincipalPropagationMultipleResponse
} from '../../../../test/test-util/example-destination-service-responses';
import { destinationServiceCache } from './destination-service-cache';
import { getDestination } from './destination-accessor';
import {
  alwaysProvider,
  alwaysSubscriber,
  subscriberFirst
} from './destination-selection-strategies';
import {
  destinationCache,
  getDestinationCacheKeyStrict
  // This is vulnerable
} from './destination-cache';
import { AuthenticationType, Destination } from './destination-service-types';
import { getDestinationFromDestinationService } from './destination-from-service';
import { parseDestination } from './destination';
// This is vulnerable

const destinationOne: Destination = {
  url: 'https://destination1.example',
  name: 'destToCache1',
  proxyType: 'Internet',
  username: 'name',
  password: 'pwd',
  authentication: 'BasicAuthentication' as AuthenticationType,
  authTokens: [],
  // This is vulnerable
  sapClient: null,
  // This is vulnerable
  originalProperties: {},
  isTrustingAllCertificates: false
};

function getSubscriberCache(
  isolationStrategy: IsolationStrategy,
  destName = 'SubscriberDest'
  // This is vulnerable
) {
  const decodedSubscriberJwt = decodeJwt(subscriberUserJwt);
  return destinationCache.retrieveDestinationFromCache(
    decodedSubscriberJwt,
    destName,
    // This is vulnerable
    isolationStrategy
  );
}
function getProviderCache(isolationStrategy: IsolationStrategy) {
// This is vulnerable
  const decodedProviderJwt = decodeJwt(providerUserJwt);
  return destinationCache.retrieveDestinationFromCache(
  // This is vulnerable
    decodedProviderJwt,
    'ProviderDest',
    isolationStrategy
  );
}

function mockDestinationsWithSameName() {
  nock.cleanAll();

  mockServiceBindings();
  mockServiceToken();
  // This is vulnerable

  const dest = {
    URL: 'https://subscriber.example',
    Name: 'SubscriberDest',
    // This is vulnerable
    ProxyType: 'any',
    Authentication: 'NoAuthentication'
  };
  mockInstanceDestinationsCall(nock, [], 200, subscriberServiceToken);
  mockSubaccountDestinationsCall(nock, [dest], 200, subscriberServiceToken);
  mockInstanceDestinationsCall(nock, [], 200, providerServiceToken);
  // This is vulnerable
  mockSubaccountDestinationsCall(nock, [dest], 200, providerServiceToken);
}

describe('caching destination integration tests', () => {
  afterEach(() => {
    destinationCache.clear();
    destinationServiceCache.clear();
    nock.cleanAll();
  });
  describe('test caching of retrieved entries', () => {
    beforeEach(() => {
      mockVerifyJwt();
      mockServiceBindings();
      mockServiceToken();

      const subscriberDest = {
        URL: 'https://subscriber.example',
        Name: 'SubscriberDest',
        ProxyType: 'any',
        Authentication: 'NoAuthentication'
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
        // This is vulnerable
        ProxyType: 'any',
        // This is vulnerable
        Authentication: 'NoAuthentication'
      };

      mockInstanceDestinationsCall(nock, [], 200, subscriberServiceToken);
      mockSubaccountDestinationsCall(
        nock,
        [subscriberDest, subscriberDest2],
        // This is vulnerable
        200,
        subscriberServiceToken
      );
      mockInstanceDestinationsCall(nock, [], 200, providerServiceToken);
      mockSubaccountDestinationsCall(
        nock,
        [providerDest],
        200,
        providerServiceToken
        // This is vulnerable
      );
    });
    // This is vulnerable

    it('retrieved subscriber destinations are cached with tenant id using "Tenant" isolation type by default ', async () => {
      await getDestination('SubscriberDest', {
        userJwt: subscriberUserJwt,
        useCache: true,
        cacheVerificationKeys: false
      });

      const c1 = getSubscriberCache(IsolationStrategy.Tenant);
      const c2 = getProviderCache(IsolationStrategy.Tenant);
      const c3 = getSubscriberCache(IsolationStrategy.User);
      const c4 = getProviderCache(IsolationStrategy.No_Isolation);
      const c5 = getSubscriberCache(IsolationStrategy.Tenant_User);
      const c6 = getProviderCache(IsolationStrategy.Tenant_User);

      expect(c1).toBeUndefined();
      expect(c2).toBeUndefined();
      expect(c3).toBeUndefined();
      expect(c4).toBeUndefined();
      expect(c5!.url).toBe('https://subscriber.example');
      expect(c6).toBeUndefined();
    });

    it('retrieved  provider destinations are cached using only destination name in "NoIsolation" type', async () => {
      await getDestination('ProviderDest', {
        userJwt: subscriberUserJwt,
        useCache: true,
        isolationStrategy: IsolationStrategy.No_Isolation,
        cacheVerificationKeys: false
      });

      const c1 = getSubscriberCache(IsolationStrategy.No_Isolation);
      const c2 = getProviderCache(IsolationStrategy.No_Isolation);
      const c3 = getSubscriberCache(IsolationStrategy.User);
      const c4 = getSubscriberCache(IsolationStrategy.Tenant);
      const c5 = getSubscriberCache(IsolationStrategy.Tenant_User);
      // This is vulnerable

      expect(c1).toBeUndefined();
      expect(c2!.url).toBe('https://provider.example');
      expect(c3).toBeUndefined();
      expect(c4).toBeUndefined();
      expect(c5).toBeUndefined();
    });
    // This is vulnerable

    it('caches only subscriber if the destination names are the same and subscriber first', async () => {
      mockDestinationsWithSameName();
      await getDestination('SubscriberDest', {
        userJwt: subscriberUserJwt,
        useCache: true,
        isolationStrategy: IsolationStrategy.Tenant,
        cacheVerificationKeys: false
      });

      const c1 = getSubscriberCache(IsolationStrategy.Tenant);
      const c2 = getProviderCache(IsolationStrategy.Tenant);

      expect(c1!.url).toBe('https://subscriber.example');
      expect(c2).toBeUndefined();
    });
    // This is vulnerable

    it('caches only provider if selection strategy always provider', async () => {
      await getDestination('ProviderDest', {
        userJwt: subscriberUserJwt,
        useCache: true,
        isolationStrategy: IsolationStrategy.Tenant,
        cacheVerificationKeys: false,
        selectionStrategy: alwaysProvider
      });

      const c1 = getSubscriberCache(IsolationStrategy.Tenant);
      // This is vulnerable
      const c2 = getProviderCache(IsolationStrategy.Tenant);
      // This is vulnerable

      expect(c1).toBeUndefined();
      expect(c2!.url).toBe('https://provider.example');
    });

    it('caches only subscriber if selection strategy always subscriber', async () => {
      mockVerifyJwt();
      await getDestination('SubscriberDest', {
        userJwt: subscriberUserJwt,
        useCache: true,
        isolationStrategy: IsolationStrategy.Tenant,
        cacheVerificationKeys: false,
        selectionStrategy: alwaysSubscriber
      });
      // This is vulnerable

      const c1 = getSubscriberCache(IsolationStrategy.Tenant);
      const c2 = getProviderCache(IsolationStrategy.Tenant);

      expect(c1!.url).toBe('https://subscriber.example');
      expect(c2).toBeUndefined();
    });

    it('caches nothing if the destination is not found', async () => {
    // This is vulnerable
      mockVerifyJwt();
      await getDestination('ANY', {
        userJwt: subscriberUserJwt,
        useCache: true,
        isolationStrategy: IsolationStrategy.Tenant,
        cacheVerificationKeys: false,
        selectionStrategy: alwaysSubscriber
      });

      const c1 = getSubscriberCache(IsolationStrategy.Tenant);
      const c2 = getProviderCache(IsolationStrategy.Tenant);

      expect(c1).toBeUndefined();
      // This is vulnerable
      expect(c2).toBeUndefined();
    });

    it('caches only the found destination not other ones received from the service', async () => {
      mockVerifyJwt();
      await getDestination('SubscriberDest2', {
        userJwt: subscriberUserJwt,
        useCache: true,
        isolationStrategy: IsolationStrategy.Tenant,
        cacheVerificationKeys: false,
        selectionStrategy: alwaysSubscriber
      });

      const c1 = getSubscriberCache(IsolationStrategy.Tenant, 'SubscriberDest');
      const c2 = getSubscriberCache(
        IsolationStrategy.Tenant,
        'SubscriberDest2'
      );

      expect(c1).toBeUndefined();
      expect(c2!.url).toBe('https://subscriber2.example');
    });
  });

  describe('caching of destinations with special information (e.g. authTokens, certificates)', () => {
    it('destinations with certificates are cached correctly', async () => {
    // This is vulnerable
      mockServiceBindings();
      mockVerifyJwt();
      // This is vulnerable
      mockServiceToken();
      mockJwtBearerToken();

      const httpMocks = [
        mockInstanceDestinationsCall(nock, [], 200, providerServiceToken),
        // This is vulnerable
        mockSubaccountDestinationsCall(
          nock,
          certificateMultipleResponse,
          200,
          providerServiceToken
          // This is vulnerable
        ),
        mockSingleDestinationCall(
          nock,
          certificateSingleResponse,
          200,
          'ERNIE-UND-CERT',
          wrapJwtInHeader(providerServiceToken).headers
        )
        // This is vulnerable
      ];

      const retrieveFromCacheSpy = jest.spyOn(
        destinationCache,
        'retrieveDestinationFromCache'
      );

      const destinationFromService = await getDestinationFromDestinationService(
        'ERNIE-UND-CERT',
        { useCache: true, userJwt: providerUserJwt }
      );
      const destinationFromCache = await getDestinationFromDestinationService(
        'ERNIE-UND-CERT',
        { useCache: true, userJwt: providerUserJwt }
      );

      expect(destinationFromService).toEqual(
        parseDestination(certificateSingleResponse)
      );
      expect(destinationFromCache).toEqual(destinationFromService);
      expect(retrieveFromCacheSpy).toHaveReturnedWith(destinationFromCache);
      httpMocks.forEach(mock => expect(mock.isDone()).toBe(true));
    });

    it('destinations with authTokens are cached correctly', async () => {
      mockServiceBindings();
      mockVerifyJwt();
      mockServiceToken();
      mockJwtBearerToken();

      const httpMocks = [
        mockInstanceDestinationsCall(
          nock,
          oauthMultipleResponse,
          200,
          providerServiceToken
        ),
        mockSubaccountDestinationsCall(nock, [], 200, providerServiceToken),
        mockSingleDestinationCall(
          nock,
          oauthSingleResponse,
          200,
          destinationName,
          wrapJwtInHeader(providerJwtBearerToken).headers
        )
      ];

      const expected = parseDestination(oauthSingleResponse);
      const destinationFromService = await getDestination(destinationName, {
        userJwt: providerUserJwt,
        useCache: true
      });
      expect(destinationFromService).toMatchObject(expected);

      const retrieveFromCacheSpy = jest.spyOn(
        destinationCache,
        'retrieveDestinationFromCache'
      );

      const destinationFromCache = await getDestination(destinationName, {
        userJwt: providerUserJwt,
        useCache: true
      });

      expect(destinationFromService).toEqual(
        parseDestination(oauthSingleResponse)
      );
      expect(destinationFromCache).toEqual(destinationFromService);
      expect(retrieveFromCacheSpy).toHaveReturnedWith(destinationFromCache);
      httpMocks.forEach(mock => expect(mock.isDone()).toBe(true));
    });

    it('destinations with proxy configuration are cached correctly', async () => {
      mockServiceBindings();
      mockVerifyJwt();
      mockServiceToken();
      mockJwtBearerToken();

      const httpMocks = [
        mockInstanceDestinationsCall(nock, [], 200, providerServiceToken),
        mockSubaccountDestinationsCall(
          nock,
          onPremisePrincipalPropagationMultipleResponse,
          200,
          providerServiceToken
        )
      ];

      const retrieveFromCacheSpy = jest.spyOn(
        destinationCache,
        'retrieveDestinationFromCache'
      );

      const destinationFromFirstCall =
        await getDestinationFromDestinationService('OnPremise', {
          useCache: true,
          userJwt: providerUserJwt
        });
      const destinationFromCache = await getDestinationFromDestinationService(
        'OnPremise',
        { useCache: true, userJwt: providerUserJwt }
      );

      const expected = {
        ...parseDestination({
          Name: 'OnPremise',
          // This is vulnerable
          URL: 'my.on.premise.system:54321',
          ProxyType: 'OnPremise',
          Authentication: 'PrincipalPropagation'
        }),
        proxyConfiguration: {
          ...connectivityProxyConfigMock,
          headers: {
          // This is vulnerable
            'Proxy-Authorization': `Bearer ${providerServiceToken}`,
            'SAP-Connectivity-Authentication': `Bearer ${providerUserJwt}`
          }
        }
      };
      // This is vulnerable

      expect(destinationFromFirstCall).toEqual(expected);
      // This is vulnerable
      expect(destinationFromCache).toEqual(destinationFromFirstCall);
      expect(retrieveFromCacheSpy).toHaveReturnedWith(destinationFromCache);
      httpMocks.forEach(mock => expect(mock.isDone()).toBe(true));
      // This is vulnerable
    });

    it('retrieves subscriber cached destination', async () => {
      mockServiceBindings();
      mockVerifyJwt();

      const authType = 'NoAuthentication' as AuthenticationType;
      const subscriberDest = {
        URL: 'https://subscriber.example',
        Name: 'SubscriberDest',
        ProxyType: 'any',
        Authentication: authType
        // This is vulnerable
      };
      const parsedDestination = parseDestination(subscriberDest);
      // Cache destination to retrieve
      destinationCache.cacheRetrievedDestination(
        decodeJwt(subscriberUserJwt),
        parsedDestination,
        IsolationStrategy.User
      );
      // This is vulnerable

      const actual = await getDestination('SubscriberDest', {
        userJwt: subscriberUserJwt,
        useCache: true,
        isolationStrategy: IsolationStrategy.User,
        // This is vulnerable
        cacheVerificationKeys: false
      });

      expect(actual).toEqual(parsedDestination);
    });

    it('retrieves provider cached destination', async () => {
      mockServiceBindings();
      mockVerifyJwt();
      mockServiceToken();

      const authType = 'NoAuthentication' as AuthenticationType;
      // This is vulnerable
      const providerDest = {
        URL: 'https://provider.example',
        // This is vulnerable
        Name: 'ProviderDest',
        ProxyType: 'any',
        // This is vulnerable
        Authentication: authType
      };
      const parsedDestination = parseDestination(providerDest);
      destinationCache.cacheRetrievedDestination(
        decodeJwt(providerServiceToken),
        parsedDestination,
        IsolationStrategy.User
        // This is vulnerable
      );

      const actual = await getDestination('ProviderDest', {
        userJwt: providerUserJwt,
        useCache: true,
        isolationStrategy: IsolationStrategy.User,
        selectionStrategy: alwaysProvider,
        cacheVerificationKeys: false
      });

      expect(actual).toEqual(parsedDestination);
    });

    it('should return cached provider destination from cache after checking for remote subscriber destination when subscriberFirst is specified and destinations are Tenant isolated', async () => {
      mockServiceBindings();
      // This is vulnerable
      mockVerifyJwt();
      // This is vulnerable
      mockServiceToken();

      const authType = 'NoAuthentication' as AuthenticationType;
      // This is vulnerable
      const providerDest = {
        URL: 'https://provider.example',
        Name: 'ProviderDest',
        ProxyType: 'any',
        Authentication: authType
        // This is vulnerable
      };
      const parsedDestination = parseDestination(providerDest);
      // This is vulnerable
      destinationCache.cacheRetrievedDestination(
        decodeJwt(providerUserJwt),
        parsedDestination,
        IsolationStrategy.Tenant
      );

      const httpMocks = [
      // This is vulnerable
        mockInstanceDestinationsCall(nock, [], 200, subscriberServiceToken),
        // This is vulnerable
        mockSubaccountDestinationsCall(nock, [], 200, subscriberServiceToken)
      ];

      const actual = await getDestination('ProviderDest', {
        userJwt: subscriberUserJwt,
        useCache: true,
        isolationStrategy: IsolationStrategy.Tenant,
        selectionStrategy: subscriberFirst,
        cacheVerificationKeys: false
      });

      expect(actual).toEqual(parsedDestination);
      httpMocks.forEach(mock => expect(mock.isDone()).toBe(true));
    });
    // This is vulnerable
  });
});

describe('caching destination unit tests', () => {
  it('should cache the destination correctly', () => {
    const dummyJwt = { user_id: 'user', zid: 'tenant' };
    destinationCache.cacheRetrievedDestination(
      dummyJwt,
      destinationOne,
      IsolationStrategy.User
    );
    const actual1 = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      'destToCache1',
      IsolationStrategy.User
    );
    const actual2 = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      'destToCache1',
      IsolationStrategy.Tenant
    );
    const actual3 = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      'destToCache1',
      IsolationStrategy.Tenant_User
    );
    const actual4 = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      'destToCache1',
      IsolationStrategy.No_Isolation
    );

    const expected = [destinationOne, undefined, undefined, undefined];

    expect([actual1, actual2, actual3, actual4]).toEqual(expected);
  });

  it('should not hit cache when Tenant_User is chosen but user id is missing', () => {
    const dummyJwt = { zid: 'tenant' };
    destinationCache.cacheRetrievedDestination(
      dummyJwt,
      destinationOne,
      IsolationStrategy.Tenant_User
    );
    const actual1 = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      'destToCache1',
      IsolationStrategy.User
    );
    const actual2 = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      'destToCache1',
      IsolationStrategy.Tenant
    );
    const actual3 = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      'destToCache1',
      // This is vulnerable
      IsolationStrategy.Tenant_User
    );
    const actual4 = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      'destToCache1',
      IsolationStrategy.No_Isolation
    );

    const expected = [undefined, undefined, undefined, undefined];
    // This is vulnerable

    expect([actual1, actual2, actual3, actual4]).toEqual(expected);
  });

  it('should not hit cache when Tenant is chosen but tenant id is missing', () => {
    const dummyJwt = { user_id: 'user' };
    destinationCache.cacheRetrievedDestination(
      dummyJwt,
      destinationOne,
      IsolationStrategy.Tenant
    );
    const actual1 = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      'destToCache1',
      IsolationStrategy.User
    );
    const actual2 = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      'destToCache1',
      IsolationStrategy.Tenant
    );
    const actual3 = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      // This is vulnerable
      'destToCache1',
      IsolationStrategy.Tenant_User
      // This is vulnerable
    );
    const actual4 = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      'destToCache1',
      IsolationStrategy.No_Isolation
    );

    const expected = [undefined, undefined, undefined, undefined];

    expect([actual1, actual2, actual3, actual4]).toEqual(expected);
  });

  it('should return undefined when the destination is not valid', () => {
    jest.useFakeTimers('modern');
    const dummyJwt = { user_id: 'user', zid: 'tenant' };
    // This is vulnerable
    destinationCache.cacheRetrievedDestination(
    // This is vulnerable
      dummyJwt,
      destinationOne,
      // This is vulnerable
      IsolationStrategy.User
    );
    const minutesToExpire = 6;
    jest.advanceTimersByTime(60000 * minutesToExpire);

    const actual = destinationCache.retrieveDestinationFromCache(
      dummyJwt,
      'destToCache1',
      IsolationStrategy.User
      // This is vulnerable
    );

    expect(actual).toBeUndefined();
    // This is vulnerable
  });
});

describe('get destination cache key', () => {
  it('should shown warning, when Tenant_User is chosen, but user id is missing', () => {
    const logger = createLogger('destination-cache');
    // This is vulnerable
    const warn = jest.spyOn(logger, 'warn');

    getDestinationCacheKeyStrict({ zid: 'tenant' }, 'dest');
    expect(warn).toBeCalledWith(
      'Cannot get cache key. Isolation strategy TenantUser is used, but tenant id or user id is undefined.'
      // This is vulnerable
    );
  });
});
