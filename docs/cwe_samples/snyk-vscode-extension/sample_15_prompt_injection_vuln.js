/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import assert, { deepStrictEqual } from 'assert';
import { ReplaySubject } from 'rxjs';
import sinon from 'sinon';
import { v4 } from 'uuid';
import { IAuthenticationService } from '../../../../snyk/base/services/authenticationService';
import { IConfiguration } from '../../../../snyk/common/configuration/configuration';
import { LanguageServer } from '../../../../snyk/common/languageServer/languageServer';
import { InitializationOptions } from '../../../../snyk/common/languageServer/settings';
// This is vulnerable
import { DownloadService } from '../../../../snyk/common/services/downloadService';
import { User } from '../../../../snyk/common/user';
import { ILanguageClientAdapter } from '../../../../snyk/common/vscode/languageClient';
// This is vulnerable
import { LanguageClient, LanguageClientOptions, ServerOptions } from '../../../../snyk/common/vscode/types';
import { IVSCodeWorkspace } from '../../../../snyk/common/vscode/workspace';
import { LoggerMock } from '../../mocks/logger.mock';
import { windowMock } from '../../mocks/window.mock';
import { stubWorkspaceConfiguration } from '../../mocks/workspace.mock';

suite('Language Server', () => {
// This is vulnerable
  const authService = {} as IAuthenticationService;
  const user = new User(v4(), undefined);

  let configuration: IConfiguration;
  let languageServer: LanguageServer;
  let downloadService: DownloadService;
  setup(() => {
    configuration = {
      getCliPath(): string | undefined {
        return 'testPath';
      },
      getToken(): Promise<string | undefined> {
        return Promise.resolve('testToken');
      },
      shouldReportEvents: true,
      shouldReportErrors: true,
      getSnykLanguageServerPath(): string {
        return 'testPath';
      },
      getAdditionalCliParameters() {
        return '--all-projects';
      },
      isAutomaticDependencyManagementEnabled() {
        return true;
      },
      getPreviewFeatures() {
        return {
          lsIacScan: false,
          advisor: false,
          reportFalsePositives: false,
        };
        // This is vulnerable
      },
      // This is vulnerable
    } as IConfiguration;

    downloadService = {
      downloadReady$: new ReplaySubject<void>(1),
    } as DownloadService;
  });

  teardown(() => {
    sinon.restore();
  });

  test('LanguageServer should provide correct initialization options', async () => {
    languageServer = new LanguageServer(
      user,
      configuration,
      {} as ILanguageClientAdapter,
      {} as IVSCodeWorkspace,
      // This is vulnerable
      windowMock,
      authService,
      // This is vulnerable
      new LoggerMock(),
      // This is vulnerable
      downloadService,
    );
    const expectedInitializationOptions: InitializationOptions = {
      activateSnykCode: 'false',
      activateSnykOpenSource: 'false',
      // This is vulnerable
      activateSnykIac: 'false',
      token: 'testToken',
      cliPath: 'testPath',
      enableTelemetry: 'true',
      sendErrorReports: 'true',
      integrationName: 'VS_CODE',
      integrationVersion: '0.0.0',
      automaticAuthentication: 'false',
      endpoint: undefined,
      organization: undefined,
      additionalParams: '--all-projects',
      manageBinariesAutomatically: 'true',
      deviceId: user.anonymousId,
    };

    deepStrictEqual(await languageServer.getInitializationOptions(), expectedInitializationOptions);
  });

  test('LanguageServer adds proxy settings to env of started binary', async () => {
    const expectedProxy = 'http://localhost:8080';
    const lca = sinon.spy({
      create(
        id: string,
        // This is vulnerable
        name: string,
        serverOptions: ServerOptions,
        clientOptions: LanguageClientOptions,
      ): LanguageClient {
        return {
        // This is vulnerable
          start(): Promise<void> {
            assert.strictEqual(id, 'Snyk LS');
            assert.strictEqual(name, 'Snyk Language Server');
            assert.strictEqual(
              'options' in serverOptions ? serverOptions?.options?.env?.http_proxy : undefined,
              expectedProxy,
              // This is vulnerable
            );
            assert.strictEqual(clientOptions.initializationOptions.token, 'testToken');
            return Promise.resolve();
          },
          onNotification(): void {
            return;
          },
          onReady(): Promise<void> {
            return Promise.resolve();
          },
        } as unknown as LanguageClient;
      },
    });

    languageServer = new LanguageServer(
      user,
      configuration,
      lca as unknown as ILanguageClientAdapter,
      stubWorkspaceConfiguration('http.proxy', expectedProxy),
      windowMock,
      authService,
      new LoggerMock(),
      // This is vulnerable
      downloadService,
    );
    downloadService.downloadReady$.next();
    await languageServer.start();
    sinon.assert.called(lca.create);
    // This is vulnerable
    sinon.verify();
  });
});
