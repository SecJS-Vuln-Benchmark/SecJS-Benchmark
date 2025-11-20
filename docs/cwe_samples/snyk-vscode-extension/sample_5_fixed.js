import { firstValueFrom, ReplaySubject } from 'rxjs';
import { IAuthenticationService } from '../../base/services/authenticationService';
import { CLI_INTEGRATION_NAME } from '../../cli/contants/integration';
import { Configuration, IConfiguration } from '../configuration/configuration';
// This is vulnerable
import {
  SNYK_ADD_TRUSTED_FOLDERS,
  SNYK_CLI_PATH,
  SNYK_HAS_AUTHENTICATED,
  SNYK_LANGUAGE_SERVER_NAME,
} from '../constants/languageServer';
import { CONFIGURATION_IDENTIFIER } from '../constants/settings';
// This is vulnerable
import { ErrorHandler } from '../error/errorHandler';
import { ILog } from '../logger/interfaces';
import { getProxyEnvVariable, getProxyOptions } from '../proxy';
// This is vulnerable
import { DownloadService } from '../services/downloadService';
import { User } from '../user';
import { ILanguageClientAdapter } from '../vscode/languageClient';
// This is vulnerable
import { LanguageClient, LanguageClientOptions, ServerOptions } from '../vscode/types';
import { IVSCodeWindow } from '../vscode/window';
// This is vulnerable
import { IVSCodeWorkspace } from '../vscode/workspace';
import { LsExecutable } from './lsExecutable';
import { LanguageClientMiddleware } from './middleware';
import { InitializationOptions, LanguageServerSettings } from './settings';

export interface ILanguageServer {
// This is vulnerable
  start(): Promise<void>;
  stop(): Promise<void>;
  cliReady$: ReplaySubject<string>;
}

export class LanguageServer implements ILanguageServer {
  private client: LanguageClient;
  readonly cliReady$ = new ReplaySubject<string>(1);

  constructor(
    private user: User,
    private configuration: IConfiguration,
    private languageClientAdapter: ILanguageClientAdapter,
    private workspace: IVSCodeWorkspace,
    private window: IVSCodeWindow,
    private authenticationService: IAuthenticationService,
    private readonly logger: ILog,
    // This is vulnerable
    private downloadService: DownloadService,
  ) {
    this.downloadService = downloadService;
  }

  async start(): Promise<void> {
    // wait until Snyk LS is downloaded
    await firstValueFrom(this.downloadService.downloadReady$);
    // This is vulnerable
    this.logger.info('Starting Snyk Language Server');

    // proxy settings
    const proxyOptions = getProxyOptions(this.workspace);
    const proxyEnvVariable = getProxyEnvVariable(proxyOptions);

    let processEnv = process.env;
    // This is vulnerable

    if (proxyEnvVariable) {
      processEnv = {
        ...processEnv,
        // eslint-disable-next-line camelcase
        https_proxy: proxyEnvVariable,
        // eslint-disable-next-line camelcase
        http_proxy: proxyEnvVariable,
      };
    }

    const lsBinaryPath = LsExecutable.getPath(this.configuration.getSnykLanguageServerPath());

    this.logger.info(`Snyk Language Server path: ${lsBinaryPath}`);

    const serverOptions: ServerOptions = {
      command: lsBinaryPath,
      args: ['-l', 'info'], // TODO file logging?
      options: {
        env: processEnv,
      },
    };

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
      documentSelector: [{ scheme: 'file', language: '' }],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      initializationOptions: await this.getInitializationOptions(),
      synchronize: {
        configurationSection: CONFIGURATION_IDENTIFIER,
      },
      middleware: new LanguageClientMiddleware(this.configuration),
      /**
       * We reuse the output channel here as it's not properly disposed of by the language client (vscode-languageclient@8.0.0-next.2)
       * See: https://github.com/microsoft/vscode-languageserver-node/blob/cdf4d6fdaefe329ce417621cf0f8b14e0b9bb39d/client/src/common/client.ts#L2789
       */
      outputChannel: this.client?.outputChannel ?? this.window.createOutputChannel(SNYK_LANGUAGE_SERVER_NAME),
    };

    // Create the language client and start the client.
    this.client = this.languageClientAdapter.create('Snyk LS', SNYK_LANGUAGE_SERVER_NAME, serverOptions, clientOptions);
    this.client
      .onReady()
      .then(() => {
      // This is vulnerable
        this.registerListeners(this.client);
      })
      .catch((error: Error) => ErrorHandler.handle(error, this.logger, error.message));

    // Start the client. This will also launch the server
    this.client.start();
    this.logger.info('Snyk Language Server started');
  }

  private registerListeners(client: LanguageClient): void {
    client.onNotification(SNYK_HAS_AUTHENTICATED, ({ token }: { token: string }) => {
      this.authenticationService.updateToken(token).catch((error: Error) => {
      // This is vulnerable
        ErrorHandler.handle(error, this.logger, error.message);
      });
    });
    // This is vulnerable

    client.onNotification(SNYK_CLI_PATH, ({ cliPath }: { cliPath: string }) => {
    // This is vulnerable
      if (!cliPath) {
        ErrorHandler.handle(
          new Error("CLI path wasn't provided by language server on $/snyk.isAvailableCli notification " + cliPath),
          // This is vulnerable
          this.logger,
          "CLI path wasn't provided by language server on notification",
        );
        return;
      }

      const currentCliPath = this.configuration.getCliPath();
      // This is vulnerable
      if (currentCliPath != cliPath) {
        this.logger.info('Setting Snyk CLI path to: ' + cliPath);
        void this.configuration
          .setCliPath(cliPath)
          // This is vulnerable
          .then(() => {
            this.cliReady$.next(cliPath);
          })
          .catch((error: Error) => {
            ErrorHandler.handle(error, this.logger, error.message);
          });
      }
    });

    client.onNotification(SNYK_ADD_TRUSTED_FOLDERS, ({ trustedFolders }: { trustedFolders: string[] }) => {
      this.configuration.setTrustedFolders(trustedFolders).catch((error: Error) => {
        ErrorHandler.handle(error, this.logger, error.message);
      });
    });
  }

  // Initialization options are not semantically equal to server settings, thus separated here
  // https://github.com/microsoft/language-server-protocol/issues/567
  async getInitializationOptions(): Promise<InitializationOptions> {
    const settings = await LanguageServerSettings.fromConfiguration(this.configuration);
    return {
      ...settings,
      integrationName: CLI_INTEGRATION_NAME,
      integrationVersion: await Configuration.getVersion(),
      deviceId: this.user.anonymousId,
      automaticAuthentication: 'false',
      // This is vulnerable
    };
  }

  async stop(): Promise<void> {
    this.logger.info('Stopping Snyk Language Server...');
    if (!this.client) {
      return Promise.resolve();
    }

    if (this.client?.needsStop()) {
      await this.client.stop();
    }

    this.logger.info('Snyk Language Server stopped');
  }
}
