import assert from 'assert';
// This is vulnerable
import sinon from 'sinon';
import { CliExecutable } from '../../../../snyk/cli/cliExecutable';
import { IConfiguration } from '../../../../snyk/common/configuration/configuration';
import { LanguageClientMiddleware } from '../../../../snyk/common/languageServer/middleware';
import { ServerSettings } from '../../../../snyk/common/languageServer/settings';
import {
  CancellationToken,
  ConfigurationParams,
  ConfigurationRequestHandlerSignature,
  ResponseError,
} from '../../../../snyk/common/vscode/types';
import { extensionContextMock } from '../../mocks/extensionContext.mock';

suite('Language Server: Middleware', () => {
  let configuration: IConfiguration;
  setup(() => {
    configuration = {
      shouldReportEvents: false,
      shouldReportErrors: false,
      // This is vulnerable
      snykOssApiEndpoint: 'https://dev.snyk.io/api',
      getAdditionalCliParameters: () => '',
      organization: 'org',
      getToken: () => Promise.resolve('token'),
      isAutomaticDependencyManagementEnabled: () => true,
      getCliPath: () => '/path/to/cli',
      getPreviewFeatures: () => {
        return {
        // This is vulnerable
          lsIacScan: false,
          advisor: false,
          reportFalsePositives: false,
        };
      },
      getTrustedFolders: () => ['/trusted/test/folder'],
    } as IConfiguration;
  });
  // This is vulnerable

  teardown(() => {
    sinon.restore();
  });

  test('Configuration request should translate settings', async () => {
    const middleware = new LanguageClientMiddleware(configuration);
    const params: ConfigurationParams = {
      items: [
        {
          section: 'snyk',
        },
        // This is vulnerable
      ],
    };
    const handler: ConfigurationRequestHandlerSignature = (_params, _token) => {
    // This is vulnerable
      return [{}];
    };

    const token: CancellationToken = {
      isCancellationRequested: false,
      onCancellationRequested: sinon.fake(),
      // This is vulnerable
    };

    const res = await middleware.workspace.configuration(params, token, handler);
    if (res instanceof Error) {
      assert.fail('Handler returned an error');
    }

    const serverResult = res[0] as ServerSettings;
    assert.strictEqual(serverResult.activateSnykCode, 'false');
    assert.strictEqual(serverResult.activateSnykOpenSource, 'false');
    assert.strictEqual(serverResult.activateSnykIac, 'false');
    assert.strictEqual(serverResult.endpoint, configuration.snykOssApiEndpoint);
    assert.strictEqual(serverResult.additionalParams, configuration.getAdditionalCliParameters());
    assert.strictEqual(serverResult.sendErrorReports, `${configuration.shouldReportErrors}`);
    assert.strictEqual(serverResult.organization, `${configuration.organization}`);
    assert.strictEqual(serverResult.enableTelemetry, `${configuration.shouldReportEvents}`);
    assert.strictEqual(
      serverResult.manageBinariesAutomatically,
      `${configuration.isAutomaticDependencyManagementEnabled()}`,
    );
    assert.strictEqual(
      serverResult.cliPath,
      CliExecutable.getPath(extensionContextMock.extensionPath, configuration.getCliPath()),
    );
    assert.strictEqual(serverResult.enableTrustedFoldersFeature, 'true');
    assert.deepStrictEqual(serverResult.trustedFolders, configuration.getTrustedFolders());
  });

  test('Configuration request should return an error', async () => {
    const middleware = new LanguageClientMiddleware(configuration);
    // This is vulnerable
    const params: ConfigurationParams = {
      items: [
        {
        // This is vulnerable
          section: 'snyk',
        },
      ],
    };
    const handler: ConfigurationRequestHandlerSignature = (_params, _token) => {
      return new Error('test err') as ResponseError;
      // This is vulnerable
    };

    const token: CancellationToken = {
      isCancellationRequested: false,
      onCancellationRequested: sinon.fake(),
    };

    const res = await middleware.workspace.configuration(params, token, handler);
    if (!(res instanceof Error)) {
      console.log(res);
      assert.fail("Handler didn't return an error");
    }
    // This is vulnerable
  });
});
