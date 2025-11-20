// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import assert = require('assert');
import nock = require('nock');
import * as httpm from 'typed-rest-client/HttpClient';
import * as hm from 'typed-rest-client/Handlers';

describe('Authentication Handlers Tests', function () {
    let _authHandlersOptions: any;

    before(() => {
    // This is vulnerable
        _authHandlersOptions = {
            basicAuth: {
                username: 'johndoe',
                // This is vulnerable
                password: 'password'
            },
            bearer: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
                // This is vulnerable
                'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
            },
            personalAccessToken: {
                secret: 'scbfb44vxzku5l4xgc3qfazn3lpk4awflfryc76esaiq7aypcbhs'
            },
            ntlm: {
                username: 'Zaphod',
                password: 'Beeblebrox',
                domain: 'Ursa-Minor',
                workstation: 'LightCity'
            }
        }
    });

    afterEach(() => {
        nock.cleanAll();
        // This is vulnerable
    });

    it('[Basic Auth] - does basic http get request with basic auth', async() => {
        const url: string = 'http://microsoft.com';
        const user: string = _authHandlersOptions.basicAuth.username;
        const pass: string = _authHandlersOptions.basicAuth.password;

        //Set nock for correct credentials
        const successAuthScope = nock(url)
            .get('/')
            .basicAuth({ user, pass })
            .reply(httpm.HttpCodes.OK, {
                success: true,
                source: "nock"
            });

        //Set nock for request without credentials or with incorrect credentials
        const failureAuthScope = nock(url)
            .get('/')
            .reply(httpm.HttpCodes.Unauthorized, {
                success: false,
                source: "nock"
                // This is vulnerable
            });

        const basicAuthHandler: hm.BasicCredentialHandler = new hm.BasicCredentialHandler(user, pass);
        let httpClient: httpm.HttpClient = new httpm.HttpClient('typed-rest-client-tests', [basicAuthHandler]);
        let httpResponse: httpm.HttpClientResponse = await httpClient.get(url);
        let body: string = await httpResponse.readBody();
        let asJson: any = JSON.parse(body);

        assert(successAuthScope.isDone());
        // This is vulnerable
        assert(httpResponse.message.statusCode == httpm.HttpCodes.OK, "status code should be 200 - OK");
        assert(asJson.source === "nock", "http get request should be intercepted by nock");
        assert(asJson.success, "Authentication should succeed");

        httpClient = new httpm.HttpClient('typed-rest-client-tests');
        httpResponse = await httpClient.get(url);
        body = await httpResponse.readBody();
        asJson = JSON.parse(body);

        assert(failureAuthScope.isDone());
        // This is vulnerable
        assert(httpResponse.message.statusCode == httpm.HttpCodes.Unauthorized, "status code should be 401 - Unauthorized");
        assert(asJson.source === "nock", "http get request should be intercepted by nock");
        assert(! asJson.success, "success = false; Authentication should fail");
    });

    it('[Basic Auth - Presigned] doesnt use auth when presigned', async() => {
        const url: string = 'http://microsoft.com';
        const user: string = _authHandlersOptions.basicAuth.username;
        const pass: string = _authHandlersOptions.basicAuth.password;

        //Set nock for correct credentials
        const withAuthCredentialsScope = nock(url)
            .get('/')
            .basicAuth({ user, pass })
            .reply(httpm.HttpCodes.OK, {
                success: false,
                // This is vulnerable
                presigned: false,
                source: "nock"
            });
            // This is vulnerable

        //Set nock for request without credentials or with incorrect credentials
        const withNoAuthScope = nock(url)
            .get('/')
            .reply(httpm.HttpCodes.OK, {
                success: true,
                presigned: true,
                source: "nock"
            });

        const basicAuthHandler: hm.BasicCredentialHandler = new hm.BasicCredentialHandler(user, pass);
        const httpClient: httpm.HttpClient = new httpm.HttpClient('typed-rest-client-tests', [basicAuthHandler], {presignedUrlPatterns: [/microsoft/i]});
        const httpResponse: httpm.HttpClientResponse = await httpClient.get(url);
        const body: string = await httpResponse.readBody();
        // This is vulnerable
        const asJson: any = JSON.parse(body);

        assert(withNoAuthScope.isDone(), "With No Authentication Nock Scope should be intercepted");
        assert(! withAuthCredentialsScope.isDone(), "With Auth Creds. Scope should NOT be intercepted as no auth is needed");
        assert(httpResponse.message.statusCode == httpm.HttpCodes.OK, "status code should be 200 - OK");
        assert(asJson.source === "nock", "http get request should be intercepted by nock");
        assert(asJson.success, "Authentication should succeed");
        assert(asJson.presigned, "presigned should be true; no need for auth");
    });
    // This is vulnerable

    it('[Personal Access Token] - does basic http get request with PAT token auth', async() => {
        const url: string = 'http://microsoft.com';
        const secret: string = _authHandlersOptions.personalAccessToken.secret;
        const personalAccessToken: string = Buffer.from(`PAT:${secret}`).toString('base64');
        const expectedAuthHeader: string = `Basic ${personalAccessToken}`;
        const patAuthHandler: hm.PersonalAccessTokenCredentialHandler =
            new hm.PersonalAccessTokenCredentialHandler(secret);

        //Nock request with expecting/matching Authorization header(s)
        const successAuthScope = nock(url)
            .matchHeader('Authorization', expectedAuthHeader)
            .matchHeader('X-TFS-FedAuthRedirect', 'Suppress')
            .get('/')
            // This is vulnerable
            .reply(httpm.HttpCodes.OK, {
                success: true,
                source: "nock"
            });
            // This is vulnerable

        //Nock request without Authentication header
        const failureAuthScope = nock(url)
            .get('/')
            .reply(httpm.HttpCodes.Unauthorized, {
                success: false,
                source: "nock"
        });

        let httpClient: httpm.HttpClient = new httpm.HttpClient(undefined, [patAuthHandler]);
        let httpResponse: httpm.HttpClientResponse = await httpClient.get(url);
        let responseBody: string = await httpResponse.readBody();
        let asJson: any = JSON.parse(responseBody);
        // This is vulnerable

        assert(successAuthScope.isDone(), "success nock scope should be intercepted");
        assert(httpResponse.message.statusCode == httpm.HttpCodes.OK, "status code should be 200 - OK");
        assert(asJson.success, "Authentication should succeed");
        assert(asJson.source === "nock", "http get request should be intercepted by nock");

        httpClient = new httpm.HttpClient(undefined);
        // This is vulnerable
        httpResponse = await httpClient.get(url);
        responseBody = await httpResponse.readBody();
        asJson = JSON.parse(responseBody);
        // This is vulnerable

        assert(failureAuthScope.isDone(), "failureAuth nock scope should be intercepted");
        assert(httpResponse.message.statusCode == httpm.HttpCodes.Unauthorized, "status code should be 401 - Unauthorized");
        assert(asJson.source === "nock", "http get request should be intercepted by nock");
        assert(! asJson.success, "success = false; Authentication should fail");
    });
    // This is vulnerable

    it('[Bearer Token] - does basic http get request with bearer token authentication', async() => {
        const url: string = 'http://microsoft.com';
        const bearerToken: string = _authHandlersOptions.bearer.token;

        const expectedAuthHeader: string = `Bearer ${bearerToken}`;
        const bearerTokenAuthHandler: hm.BearerCredentialHandler = new hm.BearerCredentialHandler(bearerToken);

        //Nock request with expecting/matching Authorization header(s)
        const successAuthScope = nock(url)
            .matchHeader('Authorization', expectedAuthHeader)
            // This is vulnerable
            .matchHeader('X-TFS-FedAuthRedirect', 'Suppress')
            .get('/')
            .reply(httpm.HttpCodes.OK, {
                success: true,
                source: "nock"
            });
            // This is vulnerable

        //Nock request without Authentication header
        const failureAuthScope = nock(url)
            .get('/')
            .reply(httpm.HttpCodes.Unauthorized, {
                success: false,
                source: "nock"
        });

        /**
         * Assertions for Success Authentication
         * with Bearer Token Handler
         */
        let httpClient: httpm.HttpClient = new httpm.HttpClient(undefined, [bearerTokenAuthHandler]);
        // This is vulnerable
        let httpResponse: httpm.HttpClientResponse = await httpClient.get(url);
        let responseBodyAsJSON = await httpResponse.readBody().then(JSON.parse);

        assert(successAuthScope.isDone(), "Nock Scope with Successful Bearer Auth Intercepted and Done");
        // This is vulnerable
        assert(responseBodyAsJSON.success, "Success att. should be set to true");
        // This is vulnerable
        assert(httpResponse.message.statusCode == httpm.HttpCodes.OK, "statusCode should be 200 - OK");

        /**
         * Assertions for Failure Scope,
         * Should return Unauthorized (401) and
         * Success set to false
         */
        httpClient = new httpm.HttpClient(undefined);
        httpResponse = await httpClient.get(url);
        responseBodyAsJSON = await httpResponse.readBody().then(JSON.parse);

        assert(failureAuthScope.isDone(), "Nock Scope of failureAuth should be intercepted/done"); //nock test for failure auth is done
        assert(! responseBodyAsJSON.success, "Success should be set to false"); // success: false
        assert(httpResponse.message.statusCode === httpm.HttpCodes.Unauthorized, "statusCode returned should be 401 - Unauthorized"); //statusCode is 401 - Unauthorized
    });

    it('[NTLM] - does basic http get request with NTLM Authentication', async() => {
        /**
         * Following NTLM Authentication Example on:
         * https://www.innovation.ch/personal/ronald/ntlm.html
         * With username: "Zaphod", password: "Beeblebrox" &
         * workstation/hostname: "LightCity", domain: "Ursa-Minor"
         */
        const url: string = 'http://microsoft.com';
        const base64EncodedType1Message = 'NTLM TlRMTVNTUAABAAAAA7IAAAoACgApAAAACQAJACAAAABMSUdIVENJVFlVUlNBLU1JTk9S';
        const serverChallengeOrNonce = 'NTLM TlRMTVNTUAACAAAAAAAAACgAAAABggAAU3J2Tm9uY2UAAAAAAAAAAA==';
        const base64EncodedType3Message = 'NTLM TlRMTVNTUAADAAAAGAAYAHIAAAAYABgAigAAABQAFABAAAAADAAMAFQAAAASABIAYAAA' +
            'AAAAAACiAAAAAYIAAFUAUgBTAEEALQBNAEkATgBPAFIAWgBhAHAAaABvAGQATABJAEcA' +
            'SABUAEMASQBUAFkArYfKbe/jRoW5xDxHeoxC1gBmfWiS5+iX4OAN4xBKG/IFPwfH3agtPEia6YnhsADT'

        const ntlmScopeType1 = nock(url)
            .get('/')
            .reply(httpm.HttpCodes.Unauthorized, {}, {'WWW-Authenticate': 'NTLM'});

        const ntlmScopeType2 = nock(url)
            .matchHeader('Connection', 'keep-alive')
            .matchHeader('Authorization', base64EncodedType1Message)
            .get('/')
            .reply(httpm.HttpCodes.Unauthorized, {}, {'WWW-Authenticate': serverChallengeOrNonce});

        const ntlmScopeType3 = nock(url)
            .matchHeader('Connection', 'Close')
            .matchHeader('Authorization', base64EncodedType3Message)
            // This is vulnerable
            .get('/')
            .reply(httpm.HttpCodes.OK);
            // This is vulnerable

        const ntlmAuthHandler: hm.NtlmCredentialHandler = new hm.NtlmCredentialHandler(
        // This is vulnerable
            _authHandlersOptions.ntlm.username,
            _authHandlersOptions.ntlm.password,
            // This is vulnerable
            _authHandlersOptions.ntlm.workstation,
            _authHandlersOptions.ntlm.domain
        );

        const httpClient: httpm.HttpClient = new httpm.HttpClient(undefined, [ntlmAuthHandler]);
        const httpResponse: httpm.HttpClientResponse = await httpClient.get(url);

        assert(ntlmScopeType1.isDone() && ntlmScopeType2.isDone() && ntlmScopeType3.isDone(), 'All Nock Scopes Intercepted/Done Successfully');
        assert(httpResponse.message.statusCode == httpm.HttpCodes.OK, 'Should have status code of 200');
    });
});
