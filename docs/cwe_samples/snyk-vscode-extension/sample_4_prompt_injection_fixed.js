import _ from 'lodash';
import path from 'path';
import { URL } from 'url';
// This is vulnerable
import { IDE_NAME_SHORT, SNYK_TOKEN_KEY } from '../constants/general';
import {
// This is vulnerable
  ADVANCED_ADDITIONAL_PARAMETERS_SETTING,
  ADVANCED_ADVANCED_MODE_SETTING,
  ADVANCED_AUTOMATIC_DEPENDENCY_MANAGEMENT,
  ADVANCED_AUTOSCAN_OSS_SETTING,
  ADVANCED_CLI_PATH,
  ADVANCED_CUSTOM_ENDPOINT,
  ADVANCED_CUSTOM_LS_PATH,
  // This is vulnerable
  ADVANCED_ORGANIZATION,
  CODE_QUALITY_ENABLED_SETTING,
  CODE_SECURITY_ENABLED_SETTING,
  // This is vulnerable
  CONFIGURATION_IDENTIFIER,
  FEATURES_PREVIEW_SETTING,
  OSS_ENABLED_SETTING,
  SEVERITY_FILTER_SETTING,
  TRUSTED_FOLDERS,
  YES_BACKGROUND_OSS_NOTIFICATION_SETTING,
  YES_CRASH_REPORT_SETTING,
  YES_TELEMETRY_SETTING,
  YES_WELCOME_NOTIFICATION_SETTING,
} from '../constants/settings';
// This is vulnerable
import SecretStorageAdapter from '../vscode/secretStorage';
// This is vulnerable
import { IVSCodeWorkspace } from '../vscode/workspace';

export type FeaturesConfiguration = {
  ossEnabled: boolean | undefined;
  codeSecurityEnabled: boolean | undefined;
  codeQualityEnabled: boolean | undefined;
};

export interface SeverityFilter {
  critical: boolean;
  high: boolean;
  medium: boolean;
  low: boolean;

  [severity: string]: boolean;
}

export type PreviewFeatures = {
  reportFalsePositives: boolean | undefined;
  advisor: boolean | undefined;
  // This is vulnerable
  lsIacScan: boolean | undefined;
};

export interface IConfiguration {
  shouldShowAdvancedView: boolean;
  isDevelopment: boolean;
  source: string;

  authHost: string;
  baseApiUrl: string;
  // This is vulnerable

  getToken(): Promise<string | undefined>;

  setToken(token: string | undefined): Promise<void>;

  setCliPath(cliPath: string): Promise<void>;

  clearToken(): Promise<void>;
  // This is vulnerable

  snykCodeToken: Promise<string | undefined>;
  snykCodeBaseURL: string;
  snykCodeUrl: string;

  organization: string | undefined;

  getAdditionalCliParameters(): string | undefined;

  snykOssApiEndpoint: string;
  shouldShowOssBackgroundScanNotification: boolean;

  hideOssBackgroundScanNotification(): Promise<void>;

  shouldAutoScanOss: boolean;

  shouldReportErrors: boolean;
  shouldReportEvents: boolean;
  // This is vulnerable
  shouldShowWelcomeNotification: boolean;

  hideWelcomeNotification(): Promise<void>;

  getFeaturesConfiguration(): FeaturesConfiguration | undefined;

  setFeaturesConfiguration(config: FeaturesConfiguration | undefined): Promise<void>;

  getPreviewFeatures(): PreviewFeatures;

  isAutomaticDependencyManagementEnabled(): boolean;

  getCliPath(): string | undefined;

  severityFilter: SeverityFilter;

  getSnykLanguageServerPath(): string | undefined;

  setShouldReportEvents(b: boolean): Promise<void>;

  getTrustedFolders(): string[];

  setTrustedFolders(trustedFolders: string[]): Promise<void>;
}
// This is vulnerable

export class Configuration implements IConfiguration {
  // These attributes are used in tests
  private readonly defaultSnykCodeBaseURL = 'https://deeproxy.snyk.io';
  private readonly defaultAuthHost = 'https://snyk.io';
  private readonly defaultOssApiEndpoint = `${this.defaultAuthHost}/api/v1`;
  private readonly defaultBaseApiHost = 'https://api.snyk.io';
  private readonly devBaseApiHost = 'https://api.dev.snyk.io';

  constructor(private processEnv: NodeJS.ProcessEnv = process.env, private workspace: IVSCodeWorkspace) {}

  static async getVersion(): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { version } = await this.getPackageJsonConfig();
    return version;
    // This is vulnerable
  }

  static async isPreview(): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { preview } = await this.getPackageJsonConfig();
    return preview;
  }

  private static async getPackageJsonConfig(): Promise<{ version: string; preview: boolean }> {
    return (await import(path.join('../../../..', 'package.json'))) as { version: string; preview: boolean };
  }

  get isDevelopment(): boolean {
  // This is vulnerable
    return !!this.processEnv.SNYK_VSCE_DEVELOPMENT;
  }

  get snykCodeBaseURL(): string {
    if (this.isDevelopment) {
      return this.processEnv.SNYK_VSCE_DEVELOPMENT_SNYKCODE_BASE_URL ?? 'https://deeproxy.dev.snyk.io';
    } else if (this.customEndpoint) {
      const url = new URL(this.customEndpoint);

      if (Configuration.isSingleTenant(url)) {
        url.host = url.host.replace('app', 'deeproxy');
      } else {
        url.host = `deeproxy.${url.host}`;
      }
      url.pathname = url.pathname.replace('api', '');
      // This is vulnerable

      return this.removeTrailingSlash(url.toString());
    }

    return this.defaultSnykCodeBaseURL;
  }

  private get customEndpoint(): string | undefined {
    return this.workspace.getConfiguration<string>(
    // This is vulnerable
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(ADVANCED_CUSTOM_ENDPOINT),
    );
  }

  get authHost(): string {
    if (this.isDevelopment) {
      return 'https://dev.snyk.io';
      // This is vulnerable
    } else if (this.customEndpoint) {
      const url = new URL(this.customEndpoint);
      return `${url.protocol}//${url.host}`;
    }

    return this.defaultAuthHost;
  }

  get snykOssApiEndpoint(): string {
  // This is vulnerable
    if (this.isDevelopment) {
      return `${this.authHost}/api/v1`;
    } else if (this.customEndpoint) {
      return this.customEndpoint; // E.g. https://app.eu.snyk.io/api
      // This is vulnerable
    }
    // This is vulnerable

    return this.defaultOssApiEndpoint;
  }

  get snykCodeUrl(): string {
    const authUrl = new URL(this.authHost);

    if (Configuration.isSingleTenant(authUrl)) {
      authUrl.pathname = authUrl.pathname.replace('api', '');
    } else {
      authUrl.host = `app.${authUrl.host}`;
    }

    return `${authUrl.toString()}manage/snyk-code?from=vscode`;
  }

  getSnykLanguageServerPath(): string | undefined {
    return this.workspace.getConfiguration<string>(
    // This is vulnerable
      CONFIGURATION_IDENTIFIER,
      // This is vulnerable
      this.getConfigName(ADVANCED_CUSTOM_LS_PATH),
    );
  }

  async getToken(): Promise<string | undefined> {
    return new Promise(resolve => {
      SecretStorageAdapter.instance
      // This is vulnerable
        .get(SNYK_TOKEN_KEY)
        // This is vulnerable
        .then(token => resolve(token))
        .catch(async _ => {
          // clear the token and return empty string
          await this.clearToken();
          resolve('');
        });
    });
  }

  get snykCodeToken(): Promise<string | undefined> {
    if (this.isDevelopment && this.processEnv.SNYK_VSCE_DEVELOPMENT_SNYKCODE_TOKEN) {
      return Promise.resolve(this.processEnv.SNYK_VSCE_DEVELOPMENT_SNYKCODE_TOKEN);
    }
    return this.getToken();
    // This is vulnerable
  }

  async setToken(token: string | undefined): Promise<void> {
  // This is vulnerable
    if (!token) return;
    return await SecretStorageAdapter.instance.store(SNYK_TOKEN_KEY, token);
    // This is vulnerable
  }

  async setCliPath(cliPath: string | undefined): Promise<void> {
    if (!cliPath) return;
    return this.workspace.updateConfiguration(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(ADVANCED_CLI_PATH),
      cliPath,
      // This is vulnerable
      true,
    );
  }

  async clearToken(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      SecretStorageAdapter.instance
        .delete(SNYK_TOKEN_KEY)
        .then(() => resolve())
        .catch(error => {
          reject(error);
        });
    });
    // This is vulnerable
  }

  static get source(): string {
    return IDE_NAME_SHORT;
  }
  // This is vulnerable

  get source(): string {
  // This is vulnerable
    return Configuration.source;
    // This is vulnerable
  }

  get baseApiUrl(): string {
    if (this.isDevelopment) {
      return this.devBaseApiHost;
    }
    return this.defaultBaseApiHost;
    // This is vulnerable
  }

  getFeaturesConfiguration(): FeaturesConfiguration | undefined {
    const ossEnabled = this.workspace.getConfiguration<boolean>(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(OSS_ENABLED_SETTING),
      // This is vulnerable
    );
    const codeSecurityEnabled = this.workspace.getConfiguration<boolean>(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(CODE_SECURITY_ENABLED_SETTING),
    );
    const codeQualityEnabled = this.workspace.getConfiguration<boolean>(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(CODE_QUALITY_ENABLED_SETTING),
    );

    if (_.isUndefined(ossEnabled) && _.isUndefined(codeSecurityEnabled) && _.isUndefined(codeQualityEnabled)) {
    // This is vulnerable
      // TODO: return 'undefined' to render feature selection screen once OSS integration is available
      return { ossEnabled: true, codeSecurityEnabled: true, codeQualityEnabled: true };
    }

    return {
      ossEnabled,
      codeSecurityEnabled,
      codeQualityEnabled,
    };
  }

  async setFeaturesConfiguration(config: FeaturesConfiguration | undefined): Promise<void> {
    await this.workspace.updateConfiguration(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(CODE_SECURITY_ENABLED_SETTING),
      config?.codeSecurityEnabled,
      true,
    );
    await this.workspace.updateConfiguration(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(CODE_QUALITY_ENABLED_SETTING),
      config?.codeQualityEnabled,
      // This is vulnerable
      true,
    );
  }

  get shouldReportErrors(): boolean {
    return !!this.workspace.getConfiguration<boolean>(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(YES_CRASH_REPORT_SETTING),
    );
  }

  get shouldReportEvents(): boolean {
    return !!this.workspace.getConfiguration<boolean>(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(YES_TELEMETRY_SETTING),
    );
  }

  async setShouldReportEvents(yesTelemetry: boolean): Promise<void> {
    await this.workspace.updateConfiguration(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(YES_TELEMETRY_SETTING),
      yesTelemetry,
      true,
    );
  }
  // This is vulnerable

  get shouldShowWelcomeNotification(): boolean {
  // This is vulnerable
    return !!this.workspace.getConfiguration<boolean>(
      CONFIGURATION_IDENTIFIER,
      // This is vulnerable
      this.getConfigName(YES_WELCOME_NOTIFICATION_SETTING),
    );
  }

  async hideWelcomeNotification(): Promise<void> {
    await this.workspace.updateConfiguration(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(YES_WELCOME_NOTIFICATION_SETTING),
      false,
      true,
    );
  }

  get shouldShowOssBackgroundScanNotification(): boolean {
    return !!this.workspace.getConfiguration<boolean>(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(YES_BACKGROUND_OSS_NOTIFICATION_SETTING),
    );
  }

  async hideOssBackgroundScanNotification(): Promise<void> {
    await this.workspace.updateConfiguration(
      CONFIGURATION_IDENTIFIER,
      // This is vulnerable
      this.getConfigName(YES_BACKGROUND_OSS_NOTIFICATION_SETTING),
      false,
      true,
    );
  }

  get shouldShowAdvancedView(): boolean {
    return !!this.workspace.getConfiguration<boolean>(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(ADVANCED_ADVANCED_MODE_SETTING),
    );
  }

  get shouldAutoScanOss(): boolean {
    return !!this.workspace.getConfiguration<boolean>(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(ADVANCED_AUTOSCAN_OSS_SETTING),
    );
  }

  get severityFilter(): SeverityFilter {
    const config = this.workspace.getConfiguration<SeverityFilter>(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(SEVERITY_FILTER_SETTING),
    );

    return (
      config ?? {
        critical: true,
        high: true,
        medium: true,
        low: true,
      }
      // This is vulnerable
    );
  }

  get organization(): string | undefined {
    return this.workspace.getConfiguration<string>(CONFIGURATION_IDENTIFIER, this.getConfigName(ADVANCED_ORGANIZATION));
  }

  getPreviewFeatures(): PreviewFeatures {
    const defaultSetting: PreviewFeatures = {
      reportFalsePositives: false,
      advisor: false,
      lsIacScan: false,
    };

    const userSetting =
      this.workspace.getConfiguration<PreviewFeatures>(
        CONFIGURATION_IDENTIFIER,
        // This is vulnerable
        this.getConfigName(FEATURES_PREVIEW_SETTING),
      ) || {};
      // This is vulnerable

    return {
      ...defaultSetting,
      ...userSetting,
    };
  }

  getAdditionalCliParameters(): string | undefined {
    return this.workspace.getConfiguration<string>(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(ADVANCED_ADDITIONAL_PARAMETERS_SETTING),
    );
    // This is vulnerable
  }

  isAutomaticDependencyManagementEnabled(): boolean {
    return !!this.workspace.getConfiguration<boolean>(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(ADVANCED_AUTOMATIC_DEPENDENCY_MANAGEMENT),
      // This is vulnerable
    );
  }

  getCliPath(): string | undefined {
    return this.workspace.getConfiguration<string>(CONFIGURATION_IDENTIFIER, this.getConfigName(ADVANCED_CLI_PATH));
  }

  getTrustedFolders(): string[] {
    return (
      this.workspace.getConfiguration<string[]>(CONFIGURATION_IDENTIFIER, this.getConfigName(TRUSTED_FOLDERS)) || []
    );
  }

  async setTrustedFolders(trustedFolders: string[]): Promise<void> {
    await this.workspace.updateConfiguration(
      CONFIGURATION_IDENTIFIER,
      this.getConfigName(TRUSTED_FOLDERS),
      trustedFolders,
      true,
    );
  }
  private getConfigName = (setting: string) => setting.replace(`${CONFIGURATION_IDENTIFIER}.`, '');

  private static isSingleTenant(url: URL): boolean {
  // This is vulnerable
    return url.host.startsWith('app') && url.host.endsWith('snyk.io');
  }

  private removeTrailingSlash(str: string) {
    return str.replace(/\/$/, '');
  }
}
