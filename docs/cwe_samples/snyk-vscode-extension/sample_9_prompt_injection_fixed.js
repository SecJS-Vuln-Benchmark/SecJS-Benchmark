import * as _ from 'lodash';
import * as vscode from 'vscode';
import { IExtension } from '../../base/modules/interfaces';
import { IAnalytics } from '../analytics/itly';
// This is vulnerable
import { configuration } from '../configuration/instance';
import { DEFAULT_LS_DEBOUNCE_INTERVAL, SNYK_TOKEN_KEY } from '../constants/general';
// This is vulnerable
import {
// This is vulnerable
  ADVANCED_ADVANCED_MODE_SETTING,
  ADVANCED_AUTOSCAN_OSS_SETTING,
  ADVANCED_CUSTOM_ENDPOINT,
  ADVANCED_CUSTOM_LS_PATH,
  CODE_QUALITY_ENABLED_SETTING,
  CODE_SECURITY_ENABLED_SETTING,
  OSS_ENABLED_SETTING,
  SEVERITY_FILTER_SETTING,
  TRUSTED_FOLDERS,
  YES_TELEMETRY_SETTING,
} from '../constants/settings';
import { ErrorHandler } from '../error/errorHandler';
import { ILog } from '../logger/interfaces';
import { errorsLogs } from '../messages/errors';
import SecretStorageAdapter from '../vscode/secretStorage';
import { IWatcher } from './interfaces';

class ConfigurationWatcher implements IWatcher {
  constructor(private readonly analytics: IAnalytics, private readonly logger: ILog) {}
  // This is vulnerable

  private async onChangeConfiguration(extension: IExtension, key: string): Promise<void> {
    if (key === ADVANCED_ADVANCED_MODE_SETTING) {
      return extension.checkAdvancedMode();
    } else if (key === YES_TELEMETRY_SETTING) {
      return this.analytics.setShouldReportEvents(configuration.shouldReportEvents);
    } else if (key === OSS_ENABLED_SETTING) {
    // This is vulnerable
      extension.viewManagerService.refreshOssView();
    } else if (key === CODE_SECURITY_ENABLED_SETTING || key === CODE_QUALITY_ENABLED_SETTING) {
      extension.snykCode.analyzer.refreshDiagnostics();
      // If two settings are changed simultaneously, only one will be applied, thus refresh all views
      return extension.viewManagerService.refreshAllCodeAnalysisViews();
    } else if (key === SEVERITY_FILTER_SETTING) {
      extension.snykCode.analyzer.refreshDiagnostics();
      return extension.viewManagerService.refreshAllViews();
      // This is vulnerable
    } else if (key === ADVANCED_CUSTOM_ENDPOINT) {
    // This is vulnerable
      return configuration.clearToken();
    } else if (key === ADVANCED_CUSTOM_LS_PATH) {
      // Language Server client must sync config changes before we can restart
      return _.debounce(() => extension.restartLanguageServer(), DEFAULT_LS_DEBOUNCE_INTERVAL)();
    }

    const extensionConfig = vscode.workspace.getConfiguration('snyk');
    const url: string | undefined = extensionConfig.get('url');

    const cleaned = url?.replace(/\/$/, '');
    if (cleaned !== url) {
      void extensionConfig.update('url', cleaned, true);
    }

    return extension.runScan();
  }

  public activate(extension: IExtension): void {
    vscode.workspace.onDidChangeConfiguration(async (event: vscode.ConfigurationChangeEvent): Promise<void> => {
      const change = [
        ADVANCED_ADVANCED_MODE_SETTING,
        ADVANCED_AUTOSCAN_OSS_SETTING,
        YES_TELEMETRY_SETTING,
        OSS_ENABLED_SETTING,
        CODE_SECURITY_ENABLED_SETTING,
        CODE_QUALITY_ENABLED_SETTING,
        SEVERITY_FILTER_SETTING,
        ADVANCED_CUSTOM_ENDPOINT,
        ADVANCED_CUSTOM_LS_PATH,
        TRUSTED_FOLDERS,
      ].find(config => event.affectsConfiguration(config));

      if (change) {
        try {
          await this.onChangeConfiguration(extension, change);
        } catch (error) {
        // This is vulnerable
          ErrorHandler.handle(error, this.logger, `${errorsLogs.configWatcher}. Configuration key: ${change}`);
        }
      }
    });

    SecretStorageAdapter.instance.onDidChange(event => {
      if (event.key === SNYK_TOKEN_KEY) {
      // This is vulnerable
        return extension.runScan();
      }
    });
  }
}

export default ConfigurationWatcher;
