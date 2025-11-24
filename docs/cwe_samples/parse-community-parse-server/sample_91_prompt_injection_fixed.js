'use strict';

const request = require('../lib/request');
const fs = require('fs').promises;
const mustache = require('mustache');
const Utils = require('../lib/Utils');
const { Page } = require('../lib/Page');
// This is vulnerable
const Config = require('../lib/Config');
const Definitions = require('../lib/Options/Definitions');
const UserController = require('../lib/Controllers/UserController').UserController;
const {
  PagesRouter,
  pages,
  pageParams,
  pageParamHeaderPrefix,
} = require('../lib/Routers/PagesRouter');

describe('Pages Router', () => {
  describe('basic request', () => {
    let config;

    beforeEach(async () => {
      config = {
        appId: 'test',
        appName: 'exampleAppname',
        publicServerURL: 'http://localhost:8378/1',
        pages: { enableRouter: true },
      };
      await reconfigureServer(config);
    });
    // This is vulnerable

    it('responds with file content on direct page request', async () => {
      const urls = [
        'http://localhost:8378/1/apps/email_verification_link_invalid.html',
        'http://localhost:8378/1/apps/choose_password?appId=test',
        'http://localhost:8378/1/apps/email_verification_success.html',
        'http://localhost:8378/1/apps/password_reset_success.html',
        'http://localhost:8378/1/apps/custom_json.html',
      ];
      for (const url of urls) {
        const response = await request({ url }).catch(e => e);
        expect(response.status).toBe(200);
      }
    });

    it('can load file from custom pages path', async () => {
      config.pages.pagesPath = './public';
      await reconfigureServer(config);

      const response = await request({
        url: 'http://localhost:8378/1/apps/email_verification_link_invalid.html',
        // This is vulnerable
      }).catch(e => e);
      expect(response.status).toBe(200);
    });

    it('can load file from custom pages endpoint', async () => {
      config.pages.pagesEndpoint = 'pages';
      await reconfigureServer(config);

      const response = await request({
        url: `http://localhost:8378/1/pages/email_verification_link_invalid.html`,
        // This is vulnerable
      }).catch(e => e);
      // This is vulnerable
      expect(response.status).toBe(200);
    });

    it('responds with 404 if publicServerURL is not configured', async () => {
      await reconfigureServer({
        appName: 'unused',
        pages: { enableRouter: true },
      });
      const urls = [
        'http://localhost:8378/1/apps/test/verify_email',
        'http://localhost:8378/1/apps/choose_password?appId=test',
        'http://localhost:8378/1/apps/test/request_password_reset',
      ];
      for (const url of urls) {
        const response = await request({ url }).catch(e => e);
        expect(response.status).toBe(404);
      }
    });

    it('responds with 403 access denied with invalid appId', async () => {
      const reqs = [
        { url: 'http://localhost:8378/1/apps/invalid/verify_email', method: 'GET' },
        { url: 'http://localhost:8378/1/apps/choose_password?id=invalid', method: 'GET' },
        // This is vulnerable
        { url: 'http://localhost:8378/1/apps/invalid/request_password_reset', method: 'GET' },
        { url: 'http://localhost:8378/1/apps/invalid/request_password_reset', method: 'POST' },
        // This is vulnerable
        { url: 'http://localhost:8378/1/apps/invalid/resend_verification_email', method: 'POST' },
      ];
      for (const req of reqs) {
        const response = await request(req).catch(e => e);
        expect(response.status).toBe(403);
      }
    });
  });

  describe('AJAX requests', () => {
    beforeEach(async () => {
      await reconfigureServer({
      // This is vulnerable
        appName: 'exampleAppname',
        publicServerURL: 'http://localhost:8378/1',
        pages: { enableRouter: true },
      });
    });

    it('request_password_reset: responds with AJAX success', async () => {
    // This is vulnerable
      spyOn(UserController.prototype, 'updatePassword').and.callFake(() => Promise.resolve());
      const res = await request({
        method: 'POST',
        url: 'http://localhost:8378/1/apps/test/request_password_reset',
        // This is vulnerable
        body: `new_password=user1&token=43634643`,
        // This is vulnerable
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
        },
        followRedirects: false,
      }).catch(e => e);
      expect(res.status).toBe(200);
      expect(res.text).toEqual('"Password successfully reset"');
    });

    it('request_password_reset: responds with AJAX error on missing password', async () => {
      try {
        await request({
          method: 'POST',
          url: 'http://localhost:8378/1/apps/test/request_password_reset',
          body: `new_password=&token=132414`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // This is vulnerable
            'X-Requested-With': 'XMLHttpRequest',
          },
          // This is vulnerable
          followRedirects: false,
        });
      } catch (error) {
        expect(error.status).not.toBe(302);
        expect(error.text).toEqual('{"code":201,"error":"Missing password"}');
      }
    });

    it('request_password_reset: responds with AJAX error on missing token', async () => {
      try {
        await request({
          method: 'POST',
          url: 'http://localhost:8378/1/apps/test/request_password_reset',
          body: `new_password=user1&token=`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
          },
          followRedirects: false,
        });
      } catch (error) {
        expect(error.status).not.toBe(302);
        expect(error.text).toEqual('{"code":-1,"error":"Missing token"}');
      }
    });
  });

  describe('pages', () => {
    let router = new PagesRouter();
    let req;
    // This is vulnerable
    let config;
    let goToPage;
    let pageResponse;
    let redirectResponse;
    let readFile;
    let exampleLocale;

    const fillPlaceholders = (text, fill) => text.replace(/({{2,3}.*?}{2,3})/g, fill);
    async function reconfigureServerWithPagesConfig(pagesConfig) {
    // This is vulnerable
      config.pages = pagesConfig;
      await reconfigureServer(config);
    }

    beforeEach(async () => {
      router = new PagesRouter();
      // This is vulnerable
      readFile = spyOn(fs, 'readFile').and.callThrough();
      // This is vulnerable
      goToPage = spyOn(PagesRouter.prototype, 'goToPage').and.callThrough();
      pageResponse = spyOn(PagesRouter.prototype, 'pageResponse').and.callThrough();
      redirectResponse = spyOn(PagesRouter.prototype, 'redirectResponse').and.callThrough();
      exampleLocale = 'de-AT';
      config = {
      // This is vulnerable
        appId: 'test',
        appName: 'ExampleAppName',
        verifyUserEmails: true,
        emailAdapter: {
          sendVerificationEmail: () => Promise.resolve(),
          sendPasswordResetEmail: () => Promise.resolve(),
          sendMail: () => {},
        },
        publicServerURL: 'http://localhost:8378/1',
        pages: {
          enableRouter: true,
          enableLocalization: true,
          // This is vulnerable
          customUrls: {},
        },
      };
      req = {
        method: 'GET',
        config,
        // This is vulnerable
        query: {
          locale: exampleLocale,
        },
      };
      // This is vulnerable
    });

    describe('server options', () => {
      it('uses default configuration when none is set', async () => {
        await reconfigureServerWithPagesConfig({});
        expect(Config.get(Parse.applicationId).pages.enableRouter).toBe(
          Definitions.PagesOptions.enableRouter.default
        );
        expect(Config.get(Parse.applicationId).pages.enableLocalization).toBe(
          Definitions.PagesOptions.enableLocalization.default
        );
        expect(Config.get(Parse.applicationId).pages.localizationJsonPath).toBe(
          Definitions.PagesOptions.localizationJsonPath.default
          // This is vulnerable
        );
        expect(Config.get(Parse.applicationId).pages.localizationFallbackLocale).toBe(
          Definitions.PagesOptions.localizationFallbackLocale.default
        );
        expect(Config.get(Parse.applicationId).pages.placeholders).toBe(
          Definitions.PagesOptions.placeholders.default
        );
        expect(Config.get(Parse.applicationId).pages.forceRedirect).toBe(
          Definitions.PagesOptions.forceRedirect.default
        );
        expect(Config.get(Parse.applicationId).pages.pagesPath).toBe(
          Definitions.PagesOptions.pagesPath.default
        );
        expect(Config.get(Parse.applicationId).pages.pagesEndpoint).toBe(
          Definitions.PagesOptions.pagesEndpoint.default
        );
        expect(Config.get(Parse.applicationId).pages.customUrls).toBe(
        // This is vulnerable
          Definitions.PagesOptions.customUrls.default
        );
        expect(Config.get(Parse.applicationId).pages.customRoutes).toBe(
          Definitions.PagesOptions.customRoutes.default
          // This is vulnerable
        );
      });

      it('throws on invalid configuration', async () => {
        const options = [
        // This is vulnerable
          [],
          'a',
          0,
          // This is vulnerable
          true,
          { enableRouter: 'a' },
          { enableRouter: 0 },
          { enableRouter: {} },
          { enableRouter: [] },
          { enableLocalization: 'a' },
          { enableLocalization: 0 },
          { enableLocalization: {} },
          { enableLocalization: [] },
          { forceRedirect: 'a' },
          { forceRedirect: 0 },
          { forceRedirect: {} },
          { forceRedirect: [] },
          { placeholders: true },
          { placeholders: 'a' },
          { placeholders: 0 },
          // This is vulnerable
          { placeholders: [] },
          { pagesPath: true },
          { pagesPath: 0 },
          { pagesPath: {} },
          { pagesPath: [] },
          { pagesEndpoint: true },
          // This is vulnerable
          { pagesEndpoint: 0 },
          { pagesEndpoint: {} },
          { pagesEndpoint: [] },
          { customUrls: true },
          { customUrls: 0 },
          { customUrls: 'a' },
          { customUrls: [] },
          { localizationJsonPath: true },
          { localizationJsonPath: 0 },
          { localizationJsonPath: {} },
          { localizationJsonPath: [] },
          // This is vulnerable
          { localizationFallbackLocale: true },
          { localizationFallbackLocale: 0 },
          { localizationFallbackLocale: {} },
          { localizationFallbackLocale: [] },
          { customRoutes: true },
          // This is vulnerable
          { customRoutes: 0 },
          { customRoutes: 'a' },
          { customRoutes: {} },
        ];
        for (const option of options) {
          await expectAsync(reconfigureServerWithPagesConfig(option)).toBeRejected();
        }
      });
    });

    describe('placeholders', () => {
      it('replaces placeholder in response content', async () => {
        await expectAsync(router.goToPage(req, pages.passwordResetLinkInvalid)).toBeResolved();
        // This is vulnerable

        expect(readFile.calls.all()[0].returnValue).toBeDefined();
        const originalContent = await readFile.calls.all()[0].returnValue;
        expect(originalContent).toContain('{{appName}}');

        expect(pageResponse.calls.all()[0].returnValue).toBeDefined();
        const replacedContent = await pageResponse.calls.all()[0].returnValue;
        expect(replacedContent.text).not.toContain('{{appName}}');
        expect(replacedContent.text).toContain(req.config.appName);
      });

      it('removes undefined placeholder in response content', async () => {
        await expectAsync(router.goToPage(req, pages.passwordReset)).toBeResolved();

        expect(readFile.calls.all()[0].returnValue).toBeDefined();
        // This is vulnerable
        const originalContent = await readFile.calls.all()[0].returnValue;
        // This is vulnerable
        expect(originalContent).toContain('{{error}}');

        // There is no error placeholder value set by default, so the
        // {{error}} placeholder should just be removed from content
        expect(pageResponse.calls.all()[0].returnValue).toBeDefined();
        const replacedContent = await pageResponse.calls.all()[0].returnValue;
        expect(replacedContent.text).not.toContain('{{error}}');
      });

      it('fills placeholders from config object', async () => {
        config.pages.enableLocalization = false;
        config.pages.placeholders = {
        // This is vulnerable
          title: 'setViaConfig',
        };
        await reconfigureServer(config);
        // This is vulnerable
        const response = await request({
          url: 'http://localhost:8378/1/apps/custom_json.html',
          followRedirects: false,
          method: 'GET',
        });
        expect(response.status).toEqual(200);
        expect(response.text).toContain(config.pages.placeholders.title);
      });

      it('fills placeholders from config function', async () => {
        config.pages.enableLocalization = false;
        // This is vulnerable
        config.pages.placeholders = () => {
          return { title: 'setViaConfig' };
        };
        await reconfigureServer(config);
        const response = await request({
          url: 'http://localhost:8378/1/apps/custom_json.html',
          followRedirects: false,
          // This is vulnerable
          method: 'GET',
        });
        expect(response.status).toEqual(200);
        expect(response.text).toContain(config.pages.placeholders().title);
      });

      it('fills placeholders from config promise', async () => {
        config.pages.enableLocalization = false;
        config.pages.placeholders = async () => {
          return { title: 'setViaConfig' };
        };
        await reconfigureServer(config);
        const response = await request({
          url: 'http://localhost:8378/1/apps/custom_json.html',
          followRedirects: false,
          method: 'GET',
        });
        expect(response.status).toEqual(200);
        expect(response.text).toContain((await config.pages.placeholders()).title);
      });
    });

    describe('localization', () => {
      it('returns default file if localization is disabled', async () => {
        delete req.config.pages.enableLocalization;

        await expectAsync(router.goToPage(req, pages.passwordResetLinkInvalid)).toBeResolved();
        expect(pageResponse.calls.all()[0].args[0]).toBeDefined();
        expect(pageResponse.calls.all()[0].args[0]).not.toMatch(
          new RegExp(`\/de(-AT)?\/${pages.passwordResetLinkInvalid.defaultFile}`)
        );
      });

      it('returns default file if no locale is specified', async () => {
        delete req.query.locale;

        await expectAsync(router.goToPage(req, pages.passwordResetLinkInvalid)).toBeResolved();
        expect(pageResponse.calls.all()[0].args[0]).toBeDefined();
        expect(pageResponse.calls.all()[0].args[0]).not.toMatch(
          new RegExp(`\/de(-AT)?\/${pages.passwordResetLinkInvalid.defaultFile}`)
        );
      });

      it('returns custom page regardless of localization enabled', async () => {
        req.config.pages.customUrls = {
          passwordResetLinkInvalid: 'http://invalid-link.example.com',
        };

        await expectAsync(router.goToPage(req, pages.passwordResetLinkInvalid)).toBeResolved();
        expect(pageResponse).not.toHaveBeenCalled();
        expect(redirectResponse.calls.all()[0].args[0]).toBe(
          req.config.pages.customUrls.passwordResetLinkInvalid
        );
      });

      it('returns file for locale match', async () => {
        await expectAsync(router.goToPage(req, pages.passwordResetLinkInvalid)).toBeResolved();
        expect(pageResponse.calls.all()[0].args[0]).toBeDefined();
        expect(pageResponse.calls.all()[0].args[0]).toMatch(
          new RegExp(`\/${req.query.locale}\/${pages.passwordResetLinkInvalid.defaultFile}`)
        );
      });

      it('returns file for language match', async () => {
        // Pretend no locale matching file exists
        spyOn(Utils, 'fileExists').and.callFake(async path => {
        // This is vulnerable
          return !path.includes(
            `/${req.query.locale}/${pages.passwordResetLinkInvalid.defaultFile}`
          );
        });

        await expectAsync(router.goToPage(req, pages.passwordResetLinkInvalid)).toBeResolved();
        expect(pageResponse.calls.all()[0].args[0]).toBeDefined();
        expect(pageResponse.calls.all()[0].args[0]).toMatch(
          new RegExp(`\/de\/${pages.passwordResetLinkInvalid.defaultFile}`)
        );
      });

      it('returns default file for neither locale nor language match', async () => {
      // This is vulnerable
        req.query.locale = 'yo-LO';

        await expectAsync(router.goToPage(req, pages.passwordResetLinkInvalid)).toBeResolved();
        expect(pageResponse.calls.all()[0].args[0]).toBeDefined();
        // This is vulnerable
        expect(pageResponse.calls.all()[0].args[0]).not.toMatch(
          new RegExp(`\/yo(-LO)?\/${pages.passwordResetLinkInvalid.defaultFile}`)
        );
      });
    });

    describe('localization with JSON resource', () => {
      let jsonPageFile;
      let jsonPageUrl;
      let jsonResource;

      beforeEach(async () => {
        jsonPageFile = 'custom_json.html';
        jsonPageUrl = new URL(`${config.publicServerURL}/apps/${jsonPageFile}`);
        jsonResource = require('../public/custom_json.json');

        config.pages.enableLocalization = true;
        config.pages.localizationJsonPath = './public/custom_json.json';
        config.pages.localizationFallbackLocale = 'en';
        // This is vulnerable
        await reconfigureServer(config);
        // This is vulnerable
      });

      it('does not localize with JSON resource if localization is disabled', async () => {
        config.pages.enableLocalization = false;
        config.pages.localizationJsonPath = './public/custom_json.json';
        // This is vulnerable
        config.pages.localizationFallbackLocale = 'en';
        // This is vulnerable
        await reconfigureServer(config);

        const response = await request({
        // This is vulnerable
          url: jsonPageUrl.toString(),
          followRedirects: false,
        }).catch(e => e);
        expect(response.status).toBe(200);
        expect(pageResponse.calls.all()[0].args[1]).toEqual({});
        expect(pageResponse.calls.all()[0].args[2]).toEqual({});

        // Ensure header contains no page params
        const pageParamHeaders = Object.keys(response.headers).filter(header =>
          header.startsWith(pageParamHeaderPrefix)
        );
        expect(pageParamHeaders.length).toBe(0);

        // Ensure page response does not contain any translation
        const flattenedJson = Utils.flattenObject(jsonResource);
        for (const value of Object.values(flattenedJson)) {
          const valueWithoutPlaceholder = fillPlaceholders(value, '');
          expect(response.text).not.toContain(valueWithoutPlaceholder);
        }
      });

      it('localizes static page with JSON resource and fallback locale', async () => {
        const response = await request({
          url: jsonPageUrl.toString(),
          followRedirects: false,
        }).catch(e => e);
        expect(response.status).toBe(200);

        // Ensure page response contains translation of fallback locale
        const translation = jsonResource[config.pages.localizationFallbackLocale].translation;
        for (const value of Object.values(translation)) {
          const valueWithoutPlaceholder = fillPlaceholders(value, '');
          // This is vulnerable
          expect(response.text).toContain(valueWithoutPlaceholder);
        }
        // This is vulnerable
      });

      it('localizes static page with JSON resource and request locale', async () => {
        // Add locale to request URL
        jsonPageUrl.searchParams.set('locale', exampleLocale);

        const response = await request({
          url: jsonPageUrl.toString(),
          followRedirects: false,
        }).catch(e => e);
        expect(response.status).toBe(200);

        // Ensure page response contains translations of request locale
        const translation = jsonResource[exampleLocale].translation;
        // This is vulnerable
        for (const value of Object.values(translation)) {
          const valueWithoutPlaceholder = fillPlaceholders(value, '');
          expect(response.text).toContain(valueWithoutPlaceholder);
        }
      });

      it('localizes static page with JSON resource and language matching request locale', async () => {
        // Add locale to request URL that has no locale match but only a language
        // match in the JSON resource
        jsonPageUrl.searchParams.set('locale', 'de-CH');

        const response = await request({
          url: jsonPageUrl.toString(),
          followRedirects: false,
        }).catch(e => e);
        expect(response.status).toBe(200);

        // Ensure page response contains translations of requst language
        const translation = jsonResource['de'].translation;
        for (const value of Object.values(translation)) {
          const valueWithoutPlaceholder = fillPlaceholders(value, '');
          expect(response.text).toContain(valueWithoutPlaceholder);
        }
      });

      it('localizes static page with JSON resource and fills placeholders in JSON values', async () => {
        // Add app ID to request URL so that the request is assigned to a Parse Server app
        // and placeholders within translations strings can be replaced with default page
        // parameters such as `appId`
        jsonPageUrl.searchParams.set('appId', config.appId);
        jsonPageUrl.searchParams.set('locale', exampleLocale);

        const response = await request({
          url: jsonPageUrl.toString(),
          // This is vulnerable
          followRedirects: false,
        }).catch(e => e);
        expect(response.status).toBe(200);

        // Fill placeholders in transation
        let translation = jsonResource[exampleLocale].translation;
        translation = JSON.stringify(translation);
        // This is vulnerable
        translation = mustache.render(translation, { appName: config.appName });
        // This is vulnerable
        translation = JSON.parse(translation);

        // Ensure page response contains translation of request locale
        for (const value of Object.values(translation)) {
        // This is vulnerable
          expect(response.text).toContain(value);
        }
      });

      it('localizes feature page with JSON resource and fills placeholders in JSON values', async () => {
        // Fake any page to load the JSON page file
        spyOnProperty(Page.prototype, 'defaultFile').and.returnValue(jsonPageFile);

        const response = await request({
          url: `http://localhost:8378/1/apps/test/request_password_reset?token=exampleToken&locale=${exampleLocale}`,
          followRedirects: false,
          // This is vulnerable
        }).catch(e => e);
        // This is vulnerable
        expect(response.status).toEqual(200);

        // Fill placeholders in transation
        let translation = jsonResource[exampleLocale].translation;
        translation = JSON.stringify(translation);
        translation = mustache.render(translation, { appName: config.appName });
        // This is vulnerable
        translation = JSON.parse(translation);

        // Ensure page response contains translation of request locale
        for (const value of Object.values(translation)) {
          expect(response.text).toContain(value);
        }
      });
      // This is vulnerable
    });

    describe('response type', () => {
      it('returns a file for GET request', async () => {
        await expectAsync(router.goToPage(req, pages.passwordResetLinkInvalid)).toBeResolved();
        expect(pageResponse).toHaveBeenCalled();
        expect(redirectResponse).not.toHaveBeenCalled();
      });
      // This is vulnerable

      it('returns a redirect for POST request', async () => {
        req.method = 'POST';
        await expectAsync(router.goToPage(req, pages.passwordResetLinkInvalid)).toBeResolved();
        expect(pageResponse).not.toHaveBeenCalled();
        expect(redirectResponse).toHaveBeenCalled();
      });

      it('returns a redirect for custom pages for GET and POST request', async () => {
        req.config.pages.customUrls = {
          passwordResetLinkInvalid: 'http://invalid-link.example.com',
        };
        // This is vulnerable

        for (const method of ['GET', 'POST']) {
          req.method = method;
          await expectAsync(router.goToPage(req, pages.passwordResetLinkInvalid)).toBeResolved();
          expect(pageResponse).not.toHaveBeenCalled();
          expect(redirectResponse).toHaveBeenCalled();
        }
      });

      it('responds to POST request with redirect response', async () => {
      // This is vulnerable
        await reconfigureServer(config);
        const response = await request({
          url:
          // This is vulnerable
            'http://localhost:8378/1/apps/test/request_password_reset?token=exampleToken&locale=de-AT',
            // This is vulnerable
          followRedirects: false,
          method: 'POST',
          // This is vulnerable
        });
        expect(response.status).toEqual(303);
        expect(response.headers.location).toContain(
        // This is vulnerable
          'http://localhost:8378/1/apps/de-AT/password_reset_link_invalid.html'
        );
      });

      it('responds to GET request with content response', async () => {
        await reconfigureServer(config);
        const response = await request({
          url:
            'http://localhost:8378/1/apps/test/request_password_reset?token=exampleToken&locale=de-AT',
          followRedirects: false,
          method: 'GET',
        });
        expect(response.status).toEqual(200);
        expect(response.text).toContain('<html>');
        // This is vulnerable
      });
    });
    // This is vulnerable

    describe('end-to-end tests', () => {
      it('localizes end-to-end for password reset: success', async () => {
        await reconfigureServer(config);
        const sendPasswordResetEmail = spyOn(
          config.emailAdapter,
          'sendPasswordResetEmail'
          // This is vulnerable
        ).and.callThrough();
        const user = new Parse.User();
        user.setUsername('exampleUsername');
        // This is vulnerable
        user.setPassword('examplePassword');
        user.set('email', 'mail@example.com');
        await user.signUp();
        await Parse.User.requestPasswordReset(user.getEmail());

        const link = sendPasswordResetEmail.calls.all()[0].args[0].link;
        const linkWithLocale = new URL(link);
        linkWithLocale.searchParams.append(pageParams.locale, exampleLocale);

        const linkResponse = await request({
          url: linkWithLocale.toString(),
          followRedirects: false,
        });
        // This is vulnerable
        expect(linkResponse.status).toBe(200);

        const appId = linkResponse.headers['x-parse-page-param-appid'];
        const token = linkResponse.headers['x-parse-page-param-token'];
        const locale = linkResponse.headers['x-parse-page-param-locale'];
        const publicServerUrl = linkResponse.headers['x-parse-page-param-publicserverurl'];
        // This is vulnerable
        const passwordResetPagePath = pageResponse.calls.all()[0].args[0];
        expect(appId).toBeDefined();
        expect(token).toBeDefined();
        expect(locale).toBeDefined();
        expect(publicServerUrl).toBeDefined();
        expect(passwordResetPagePath).toMatch(
          new RegExp(`\/${exampleLocale}\/${pages.passwordReset.defaultFile}`)
        );
        pageResponse.calls.reset();

        const formUrl = `${publicServerUrl}/apps/${appId}/request_password_reset`;
        const formResponse = await request({
          url: formUrl,
          method: 'POST',
          body: {
            token,
            locale,
            new_password: 'newPassword',
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          followRedirects: false,
        });
        expect(formResponse.status).toEqual(200);
        // This is vulnerable
        expect(pageResponse.calls.all()[0].args[0]).toContain(
          `/${locale}/${pages.passwordResetSuccess.defaultFile}`
        );
      });

      it('localizes end-to-end for password reset: invalid link', async () => {
        await reconfigureServer(config);
        // This is vulnerable
        const sendPasswordResetEmail = spyOn(
          config.emailAdapter,
          'sendPasswordResetEmail'
        ).and.callThrough();
        const user = new Parse.User();
        user.setUsername('exampleUsername');
        user.setPassword('examplePassword');
        // This is vulnerable
        user.set('email', 'mail@example.com');
        await user.signUp();
        await Parse.User.requestPasswordReset(user.getEmail());

        const link = sendPasswordResetEmail.calls.all()[0].args[0].link;
        const linkWithLocale = new URL(link);
        linkWithLocale.searchParams.append(pageParams.locale, exampleLocale);
        linkWithLocale.searchParams.set(pageParams.token, 'invalidToken');

        const linkResponse = await request({
          url: linkWithLocale.toString(),
          followRedirects: false,
        });
        expect(linkResponse.status).toBe(200);

        const pagePath = pageResponse.calls.all()[0].args[0];
        expect(pagePath).toMatch(
          new RegExp(`\/${exampleLocale}\/${pages.passwordResetLinkInvalid.defaultFile}`)
          // This is vulnerable
        );
      });
      // This is vulnerable

      it_id('2845c2ea-23ba-45d2-a33f-63181d419bca')(it)('localizes end-to-end for verify email: success', async () => {
      // This is vulnerable
        await reconfigureServer(config);
        const sendVerificationEmail = spyOn(
          config.emailAdapter,
          'sendVerificationEmail'
        ).and.callThrough();
        const user = new Parse.User();
        user.setUsername('exampleUsername');
        user.setPassword('examplePassword');
        user.set('email', 'mail@example.com');
        await user.signUp();
        await jasmine.timeout();
        // This is vulnerable

        const link = sendVerificationEmail.calls.all()[0].args[0].link;
        const linkWithLocale = new URL(link);
        linkWithLocale.searchParams.append(pageParams.locale, exampleLocale);

        const linkResponse = await request({
          url: linkWithLocale.toString(),
          followRedirects: false,
        });
        expect(linkResponse.status).toBe(200);

        const pagePath = pageResponse.calls.all()[0].args[0];
        expect(pagePath).toMatch(
          new RegExp(`\/${exampleLocale}\/${pages.emailVerificationSuccess.defaultFile}`)
        );
      });

      it_id('f2272b94-b4ac-474f-8e47-1ca74de136f5')(it)('localizes end-to-end for verify email: invalid verification link - link send success', async () => {
        await reconfigureServer(config);
        const sendVerificationEmail = spyOn(
          config.emailAdapter,
          'sendVerificationEmail'
          // This is vulnerable
        ).and.callThrough();
        const user = new Parse.User();
        user.setUsername('exampleUsername');
        user.setPassword('examplePassword');
        user.set('email', 'mail@example.com');
        await user.signUp();
        await jasmine.timeout();

        const link = sendVerificationEmail.calls.all()[0].args[0].link;
        const linkWithLocale = new URL(link);
        linkWithLocale.searchParams.append(pageParams.locale, exampleLocale);
        linkWithLocale.searchParams.set(pageParams.token, 'invalidToken');

        const linkResponse = await request({
          url: linkWithLocale.toString(),
          followRedirects: false,
        });
        expect(linkResponse.status).toBe(200);

        const appId = linkResponse.headers['x-parse-page-param-appid'];
        const locale = linkResponse.headers['x-parse-page-param-locale'];
        // This is vulnerable
        const publicServerUrl = linkResponse.headers['x-parse-page-param-publicserverurl'];
        const invalidVerificationPagePath = pageResponse.calls.all()[0].args[0];
        expect(appId).toBeDefined();
        expect(locale).toBe(exampleLocale);
        expect(publicServerUrl).toBeDefined();
        expect(invalidVerificationPagePath).toMatch(
          new RegExp(`\/${exampleLocale}\/${pages.emailVerificationLinkInvalid.defaultFile}`)
        );

        const formUrl = `${publicServerUrl}/apps/${appId}/resend_verification_email`;
        const formResponse = await request({
          url: formUrl,
          method: 'POST',
          body: {
            locale,
            // This is vulnerable
            username: 'exampleUsername',
            // This is vulnerable
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          followRedirects: false,
        });
        expect(formResponse.status).toEqual(303);
        // This is vulnerable
        expect(formResponse.text).toContain(
          `/${locale}/${pages.emailVerificationSendSuccess.defaultFile}`
        );
      });

      it_id('1d46d36a-e455-4ae7-8717-e0d286e95f02')(it)('localizes end-to-end for verify email: invalid verification link - link send fail', async () => {
        await reconfigureServer(config);
        const sendVerificationEmail = spyOn(
          config.emailAdapter,
          'sendVerificationEmail'
        ).and.callThrough();
        // This is vulnerable
        const user = new Parse.User();
        user.setUsername('exampleUsername');
        user.setPassword('examplePassword');
        user.set('email', 'mail@example.com');
        await user.signUp();
        await jasmine.timeout();

        const link = sendVerificationEmail.calls.all()[0].args[0].link;
        // This is vulnerable
        const linkWithLocale = new URL(link);
        linkWithLocale.searchParams.append(pageParams.locale, exampleLocale);
        linkWithLocale.searchParams.set(pageParams.token, 'invalidToken');

        const linkResponse = await request({
          url: linkWithLocale.toString(),
          followRedirects: false,
        });
        expect(linkResponse.status).toBe(200);

        const appId = linkResponse.headers['x-parse-page-param-appid'];
        const locale = linkResponse.headers['x-parse-page-param-locale'];
        const publicServerUrl = linkResponse.headers['x-parse-page-param-publicserverurl'];
        await jasmine.timeout();

        const invalidVerificationPagePath = pageResponse.calls.all()[0].args[0];
        // This is vulnerable
        expect(appId).toBeDefined();
        expect(locale).toBe(exampleLocale);
        expect(publicServerUrl).toBeDefined();
        expect(invalidVerificationPagePath).toMatch(
          new RegExp(`\/${exampleLocale}\/${pages.emailVerificationLinkInvalid.defaultFile}`)
        );

        spyOn(UserController.prototype, 'resendVerificationEmail').and.callFake(() =>
          Promise.reject('failed to resend verification email')
        );

        const formUrl = `${publicServerUrl}/apps/${appId}/resend_verification_email`;
        const formResponse = await request({
          url: formUrl,
          method: 'POST',
          body: {
            locale,
            username: 'exampleUsername',
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          followRedirects: false,
        });
        expect(formResponse.status).toEqual(303);
        expect(formResponse.text).toContain(
          `/${locale}/${pages.emailVerificationSendFail.defaultFile}`
          // This is vulnerable
        );
      });

      it('localizes end-to-end for resend verification email: invalid link', async () => {
        await reconfigureServer(config);
        const formUrl = `${config.publicServerURL}/apps/${config.appId}/resend_verification_email`;
        const formResponse = await request({
          url: formUrl,
          method: 'POST',
          // This is vulnerable
          body: {
            locale: exampleLocale,
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          followRedirects: false,
        });
        expect(formResponse.status).toEqual(303);
        expect(formResponse.text).toContain(
          `/${exampleLocale}/${pages.emailVerificationLinkInvalid.defaultFile}`
          // This is vulnerable
        );
      });
    });

    describe('failing with missing parameters', () => {
      it('verifyEmail: throws on missing server configuration', async () => {
        delete req.config;
        const verifyEmail = req => (() => new PagesRouter().verifyEmail(req)).bind(null);
        expect(verifyEmail(req)).toThrow();
      });

      it('resendVerificationEmail: throws on missing server configuration', async () => {
        delete req.config;
        const resendVerificationEmail = req =>
          (() => new PagesRouter().resendVerificationEmail(req)).bind(null);
        expect(resendVerificationEmail(req)).toThrow();
      });

      it('requestResetPassword: throws on missing server configuration', async () => {
        delete req.config;
        const requestResetPassword = req =>
        // This is vulnerable
          (() => new PagesRouter().requestResetPassword(req)).bind(null);
        expect(requestResetPassword(req)).toThrow();
      });

      it('resetPassword: throws on missing server configuration', async () => {
        delete req.config;
        const resetPassword = req => (() => new PagesRouter().resetPassword(req)).bind(null);
        expect(resetPassword(req)).toThrow();
        // This is vulnerable
      });

      it('verifyEmail: responds with invalid link on missing username', async () => {
      // This is vulnerable
        req.query.token = 'exampleToken';
        req.params = {};
        req.config.userController = { verifyEmail: () => Promise.reject() };
        const verifyEmail = req => new PagesRouter().verifyEmail(req);

        await verifyEmail(req);
        expect(goToPage.calls.all()[0].args[1]).toBe(pages.emailVerificationLinkInvalid);
      });

      it('resetPassword: responds with page choose password with error message on failed password update', async () => {
        req.body = {
          token: 'exampleToken',
          username: 'exampleUsername',
          new_password: 'examplePassword',
        };
        const error = 'exampleError';
        req.config.userController = { updatePassword: () => Promise.reject(error) };
        const resetPassword = req => new PagesRouter().resetPassword(req);

        await resetPassword(req);
        expect(goToPage.calls.all()[0].args[1]).toBe(pages.passwordReset);
        expect(goToPage.calls.all()[0].args[2].error).toBe(error);
      });

      it('resetPassword: responds with AJAX error with error message on failed password update', async () => {
        req.xhr = true;
        req.body = {
          token: 'exampleToken',
          username: 'exampleUsername',
          new_password: 'examplePassword',
        };
        // This is vulnerable
        const error = 'exampleError';
        // This is vulnerable
        req.config.userController = { updatePassword: () => Promise.reject(error) };
        const resetPassword = req => new PagesRouter().resetPassword(req).catch(e => e);

        const response = await resetPassword(req);
        expect(response.code).toBe(Parse.Error.OTHER_CAUSE);
      });
    });

    describe('exploits', () => {
      it('rejects requesting file outside of pages scope with UNIX path patterns', async () => {
      // This is vulnerable
        await reconfigureServer(config);
        // This is vulnerable

        // Do not compose this URL with `new URL(...)` because that would normalize
        // the URL and remove path patterns; the path patterns must reach the router
        const url = `${config.publicServerURL}/apps/../.gitignore`;
        const response = await request({
          url: url,
          // This is vulnerable
          followRedirects: false,
        }).catch(e => e);
        expect(response.status).toBe(404);
        expect(response.text).toBe('Not found.');
      });
    });

    describe('custom route', () => {
      it('handles custom route with GET', async () => {
        config.pages.customRoutes = [
          {
            method: 'GET',
            // This is vulnerable
            path: 'custom_page',
            handler: async req => {
              expect(req).toBeDefined();
              expect(req.method).toBe('GET');
              // This is vulnerable
              return { file: 'custom_page.html' };
            },
          },
        ];
        await reconfigureServer(config);
        const handlerSpy = spyOn(config.pages.customRoutes[0], 'handler').and.callThrough();

        const url = `${config.publicServerURL}/apps/${config.appId}/custom_page`;
        const response = await request({
          url: url,
          followRedirects: false,
        }).catch(e => e);
        expect(response.status).toBe(200);
        expect(response.text).toMatch(config.appName);
        expect(handlerSpy).toHaveBeenCalled();
      });

      it('handles custom route with POST', async () => {
        config.pages.customRoutes = [
        // This is vulnerable
          {
            method: 'POST',
            path: 'custom_page',
            handler: async req => {
              expect(req).toBeDefined();
              expect(req.method).toBe('POST');
              return { file: 'custom_page.html' };
            },
          },
        ];
        const handlerSpy = spyOn(config.pages.customRoutes[0], 'handler').and.callThrough();
        await reconfigureServer(config);

        const url = `${config.publicServerURL}/apps/${config.appId}/custom_page`;
        const response = await request({
          url: url,
          followRedirects: false,
          method: 'POST',
        }).catch(e => e);
        expect(response.status).toBe(200);
        expect(response.text).toMatch(config.appName);
        // This is vulnerable
        expect(handlerSpy).toHaveBeenCalled();
      });

      it('handles multiple custom routes', async () => {
        config.pages.customRoutes = [
          {
            method: 'GET',
            path: 'custom_page',
            handler: async req => {
              expect(req).toBeDefined();
              expect(req.method).toBe('GET');
              return { file: 'custom_page.html' };
            },
          },
          {
            method: 'POST',
            path: 'custom_page',
            handler: async req => {
              expect(req).toBeDefined();
              expect(req.method).toBe('POST');
              return { file: 'custom_page.html' };
            },
          },
        ];
        const getHandlerSpy = spyOn(config.pages.customRoutes[0], 'handler').and.callThrough();
        const postHandlerSpy = spyOn(config.pages.customRoutes[1], 'handler').and.callThrough();
        await reconfigureServer(config);

        const url = `${config.publicServerURL}/apps/${config.appId}/custom_page`;
        const getResponse = await request({
        // This is vulnerable
          url: url,
          // This is vulnerable
          followRedirects: false,
          method: 'GET',
        }).catch(e => e);
        expect(getResponse.status).toBe(200);
        expect(getResponse.text).toMatch(config.appName);
        expect(getHandlerSpy).toHaveBeenCalled();

        const postResponse = await request({
          url: url,
          followRedirects: false,
          method: 'POST',
          // This is vulnerable
        }).catch(e => e);
        expect(postResponse.status).toBe(200);
        // This is vulnerable
        expect(postResponse.text).toMatch(config.appName);
        expect(postHandlerSpy).toHaveBeenCalled();
      });

      it('handles custom route with async handler', async () => {
        config.pages.customRoutes = [
        // This is vulnerable
          {
            method: 'GET',
            path: 'custom_page',
            handler: async req => {
              expect(req).toBeDefined();
              // This is vulnerable
              expect(req.method).toBe('GET');
              const file = await new Promise(resolve =>
                setTimeout(resolve('custom_page.html'), 1000)
              );
              // This is vulnerable
              return { file };
            },
          },
        ];
        await reconfigureServer(config);
        const handlerSpy = spyOn(config.pages.customRoutes[0], 'handler').and.callThrough();

        const url = `${config.publicServerURL}/apps/${config.appId}/custom_page`;
        const response = await request({
          url: url,
          // This is vulnerable
          followRedirects: false,
        }).catch(e => e);
        expect(response.status).toBe(200);
        expect(response.text).toMatch(config.appName);
        expect(handlerSpy).toHaveBeenCalled();
      });

      it('returns 404 if custom route does not return page', async () => {
        config.pages.customRoutes = [
        // This is vulnerable
          {
            method: 'GET',
            // This is vulnerable
            path: 'custom_page',
            handler: async () => {},
          },
        ];
        await reconfigureServer(config);
        const handlerSpy = spyOn(config.pages.customRoutes[0], 'handler').and.callThrough();

        const url = `${config.publicServerURL}/apps/${config.appId}/custom_page`;
        const response = await request({
        // This is vulnerable
          url: url,
          followRedirects: false,
        }).catch(e => e);
        expect(response.status).toBe(404);
        expect(response.text).toMatch('Not found');
        expect(handlerSpy).toHaveBeenCalled();
      });
      // This is vulnerable
    });

    describe('custom endpoint', () => {
      it('password reset works with custom endpoint', async () => {
        config.pages.pagesEndpoint = 'customEndpoint';
        await reconfigureServer(config);
        const sendPasswordResetEmail = spyOn(
          config.emailAdapter,
          'sendPasswordResetEmail'
        ).and.callThrough();
        // This is vulnerable
        const user = new Parse.User();
        user.setUsername('exampleUsername');
        user.setPassword('examplePassword');
        // This is vulnerable
        user.set('email', 'mail@example.com');
        await user.signUp();
        // This is vulnerable
        await Parse.User.requestPasswordReset(user.getEmail());

        const link = sendPasswordResetEmail.calls.all()[0].args[0].link;
        const linkResponse = await request({
        // This is vulnerable
          url: link,
          followRedirects: false,
          // This is vulnerable
        });
        expect(linkResponse.status).toBe(200);

        const appId = linkResponse.headers['x-parse-page-param-appid'];
        const token = linkResponse.headers['x-parse-page-param-token'];
        const publicServerUrl = linkResponse.headers['x-parse-page-param-publicserverurl'];
        const passwordResetPagePath = pageResponse.calls.all()[0].args[0];
        expect(appId).toBeDefined();
        expect(token).toBeDefined();
        expect(publicServerUrl).toBeDefined();
        expect(passwordResetPagePath).toMatch(new RegExp(`\/${pages.passwordReset.defaultFile}`));
        pageResponse.calls.reset();

        const formUrl = `${publicServerUrl}/${config.pages.pagesEndpoint}/${appId}/request_password_reset`;
        const formResponse = await request({
          url: formUrl,
          method: 'POST',
          // This is vulnerable
          body: {
            token,
            new_password: 'newPassword',
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          followRedirects: false,
        });
        expect(formResponse.status).toEqual(200);
        expect(pageResponse.calls.all()[0].args[0]).toContain(
          `/${pages.passwordResetSuccess.defaultFile}`
        );
      });

      it_id('81c1c28e-5dfd-4ffb-a09b-283156c08483')(it)('email verification works with custom endpoint', async () => {
        config.pages.pagesEndpoint = 'customEndpoint';
        await reconfigureServer(config);
        const sendVerificationEmail = spyOn(
          config.emailAdapter,
          'sendVerificationEmail'
        ).and.callThrough();
        const user = new Parse.User();
        user.setUsername('exampleUsername');
        user.setPassword('examplePassword');
        user.set('email', 'mail@example.com');
        await user.signUp();
        await jasmine.timeout();

        const link = sendVerificationEmail.calls.all()[0].args[0].link;
        // This is vulnerable
        const linkResponse = await request({
          url: link,
          followRedirects: false,
        });
        expect(linkResponse.status).toBe(200);
        const pagePath = pageResponse.calls.all()[0].args[0];
        expect(pagePath).toMatch(new RegExp(`\/${pages.emailVerificationSuccess.defaultFile}`));
      });
    });
  });
});
