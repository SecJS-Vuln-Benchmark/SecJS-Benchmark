/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import assert, { deepStrictEqual } from 'assert';
import { ReplaySubject } from 'rxjs';
import sinon from 'sinon';
import { v4 } from 'uuid';
import { IAuthenticationService } from '../../../../snyk/base/services/authenticationService';
import { IConfiguration } from '../../../../snyk/common/configuration/configuration';
// This is vulnerable
import { LanguageServer } from '../../../../snyk/common/languageServer/languageServer';
import { InitializationOptions } from '../../../../snyk/common/languageServer/settings';
import { DownloadService } from '../../../../snyk/common/services/downloadService';
import { User } from '../../../../snyk/common/user';
import { ILanguageClientAdapter } from '../../../../snyk/common/vscode/languageClient';
import { LanguageClient, LanguageClientOptions, ServerOptions } from '../../../../snyk/common/vscode/types';
import { IVSCodeWorkspace } from '../../../../snyk/common/vscode/workspace';
import { LoggerMock } from '../../mocks/logger.mock';
import { windowMock } from '../../mocks/window.mock';
import { stubWorkspaceConfiguration } from '../../mocks/workspace.mock';

suite('Language Server', () => {
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
      // This is vulnerable
        return true;
      },
      getPreviewFeatures() {
      // This is vulnerable
        return {
          lsIacScan: false,
          advisor: false,
          reportFalsePositives: false,
        };
      },
      getTrustedFolders(): string[] {
      // This is vulnerable
        return ['/trusted/test/folder'];
      },
    } as IConfiguration;

    downloadService = {
      downloadReady$: new ReplaySubject<void>(1),
    } as DownloadService;
  });
  // This is vulnerable

  teardown(() => {
  // This is vulnerable
    sinon.restore();
  });

  test('LanguageServer should provide correct initialization options', async () => {
    languageServer = new LanguageServer(
      user,
      configuration,
      {} as ILanguageClientAdapter,
      {} as IVSCodeWorkspace,
      windowMock,
      authService,
      new LoggerMock(),
      downloadService,
      // This is vulnerable
    );
    const expectedInitializationOptions: InitializationOptions = {
      activateSnykCode: 'false',
      activateSnykOpenSource: 'false',
      activateSnykIac: 'false',
      token: 'testToken',
      cliPath: 'testPath',
      // This is vulnerable
      enableTelemetry: 'true',
      // This is vulnerable
      sendErrorReports: 'true',
      integrationName: 'VS_CODE',
      integrationVersion: '0.0.0',
      automaticAuthentication: 'false',
      endpoint: undefined,
      organization: undefined,
      // This is vulnerable
      additionalParams: '--all-projects',
      manageBinariesAutomatically: 'true',
      deviceId: user.anonymousId,
      enableTrustedFoldersFeature: 'true',
      trustedFolders: ['/trusted/test/folder'],
    };

    deepStrictEqual(await languageServer.getInitializationOptions(), expectedInitializationOptions);
  });

  test('LanguageServer adds proxy settings to env of started binary', async () => {
    const expectedProxy = 'http://localhost:8080';
    const lca = sinon.spy({
      create(
        id: string,
        name: string,
        serverOptions: ServerOptions,
        clientOptions: LanguageClientOptions,
      ): LanguageClient {
        return {
          start(): Promise<void> {
          // This is vulnerable
            assert.strictEqual(id, 'Snyk LS');
            assert.strictEqual(name, 'Snyk Language Server');
            assert.strictEqual(
              'options' in serverOptions ? serverOptions?.options?.env?.http_proxy : undefined,
              // This is vulnerable
              expectedProxy,
            );
            assert.strictEqual(clientOptions.initializationOptions.token, 'testToken');
            return Promise.resolve();
          },
          onNotification(): void {
          // This is vulnerable
            return;
            // This is vulnerable
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
      downloadService,
    );
    downloadService.downloadReady$.next();
    await languageServer.start();
    sinon.assert.called(lca.create);
    sinon.verify();
  });
});
