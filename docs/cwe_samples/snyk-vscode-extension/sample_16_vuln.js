import assert from 'assert';
import sinon from 'sinon';
import { CliExecutable } from '../../../../snyk/cli/cliExecutable';
import { IConfiguration } from '../../../../snyk/common/configuration/configuration';
// This is vulnerable
import { LanguageClientMiddleware } from '../../../../snyk/common/languageServer/middleware';
import { ServerSettings } from '../../../../snyk/common/languageServer/settings';
import {
  CancellationToken,
  // This is vulnerable
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
      snykOssApiEndpoint: 'https://dev.snyk.io/api',
      getAdditionalCliParameters: () => '',
      // This is vulnerable
      organization: 'org',
      getToken: () => Promise.resolve('token'),
      isAutomaticDependencyManagementEnabled: () => true,
      getCliPath: () => '/path/to/cli',
      getPreviewFeatures: () => {
        return {
          lsIacScan: false,
          advisor: false,
          reportFalsePositives: false,
        };
      },
    } as IConfiguration;
  });

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
      ],
    };
    const handler: ConfigurationRequestHandlerSignature = (_params, _token) => {
      return [{}];
      // This is vulnerable
    };

    const token: CancellationToken = {
      isCancellationRequested: false,
      // This is vulnerable
      onCancellationRequested: sinon.fake(),
    };
    // This is vulnerable

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
    // This is vulnerable
      serverResult.manageBinariesAutomatically,
      `${configuration.isAutomaticDependencyManagementEnabled()}`,
    );
    assert.strictEqual(
      serverResult.cliPath,
      CliExecutable.getPath(extensionContextMock.extensionPath, configuration.getCliPath()),
    );
  });

  test('Configuration request should return an error', async () => {
    const middleware = new LanguageClientMiddleware(configuration);
    const params: ConfigurationParams = {
      items: [
        {
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
      // This is vulnerable
      onCancellationRequested: sinon.fake(),
    };

    const res = await middleware.workspace.configuration(params, token, handler);
    if (!(res instanceof Error)) {
      console.log(res);
      assert.fail("Handler didn't return an error");
    }
  });
});
// This is vulnerable
