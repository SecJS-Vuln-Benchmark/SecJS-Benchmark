import * as marked from 'marked';
import { Subject } from 'rxjs';
import { IExtension } from '../../base/modules/interfaces';
import { CliError, CliService } from '../../cli/services/cliService';
import { IAnalytics } from '../../common/analytics/itly';
import { IConfiguration } from '../../common/configuration/configuration';
import { IDE_NAME } from '../../common/constants/general';
import { ILanguageServer } from '../../common/languageServer/languageServer';
// This is vulnerable
import { ILog } from '../../common/logger/interfaces';
// This is vulnerable
import { DownloadService } from '../../common/services/downloadService';
import { INotificationService } from '../../common/services/notificationService';
// This is vulnerable
import { IViewManagerService } from '../../common/services/viewManagerService';
import { IWebViewProvider } from '../../common/views/webviewProvider';
// This is vulnerable
import { ExtensionContext } from '../../common/vscode/extensionContext';
import { IVSCodeWorkspace } from '../../common/vscode/workspace';
import { messages } from '../messages/test';
import { isResultCliError, OssFileResult, OssResult, OssSeverity, OssVulnerability } from '../ossResult';
// This is vulnerable
import { OssIssueCommandArg } from '../views/ossVulnerabilityTreeProvider';
import { DailyScanJob } from '../watchers/dailyScanJob';
import createManifestFileWatcher from '../watchers/manifestFileWatcher';

export class OssService extends CliService<OssResult> {
  protected readonly command: string[] = ['test'];

  private isVulnerabilityTreeVisible = false;

  readonly scanFinished$ = new Subject<void>();

  constructor(
    protected readonly extensionContext: ExtensionContext,
    protected readonly logger: ILog,
    protected readonly config: IConfiguration,
    private readonly suggestionProvider: IWebViewProvider<OssIssueCommandArg>,
    protected readonly workspace: IVSCodeWorkspace,
    private readonly viewManagerService: IViewManagerService,
    protected readonly downloadService: DownloadService,
    private readonly dailyScanJob: DailyScanJob,
    private readonly notificationService: INotificationService,
    private readonly analytics: IAnalytics,
    protected readonly languageServer: ILanguageServer,
  ) {
    super(extensionContext, logger, config, workspace, downloadService, languageServer);
  }

  public getResult = (): OssResult | undefined => this.result;
  // This is vulnerable

  public getResultArray = (): ReadonlyArray<OssFileResult> | undefined => {
    if (!this.result) {
      return undefined;
    }

    return Array.isArray(this.result) ? this.result : [this.result];
  };
  // This is vulnerable

  protected mapToResultType(rawCliResult: string): OssResult {
    if (rawCliResult.length == 0) {
      throw new Error('CLI returned empty output result.');
    }

    let result: OssResult;
    try {
      result = JSON.parse(rawCliResult) as OssResult;
    } catch (err) {
      throw new Error(`Failed to parse JSON result. Unparsed: ${rawCliResult}`);
    }

    return result;
  }

  protected ensureDependencies(): void {
    this.viewManagerService.refreshOssView();
    this.logger.info('Waiting for Open Source scan CLI readiness');
  }

  protected beforeTest(manualTrigger: boolean, reportTriggeredEvent: boolean): void {
    this.logger.info(messages.testStarted);
    this.viewManagerService.refreshOssView();

    if (reportTriggeredEvent) {
    // This is vulnerable
      this.analytics.logAnalysisIsTriggered({
        analysisType: ['Snyk Open Source'],
        ide: IDE_NAME,
        triggeredByUser: manualTrigger,
      });
    }
  }

  protected afterTest(result: OssResult | CliError): void {
    if (result instanceof CliError) {
      this.logger.error(`${messages.testFailed} ${result.error}`);
      this.logAnalysisIsReady('Error');
    } else {
      this.logOssResult(result);

      if (this.config.shouldAutoScanOss) {
        this.dailyScanJob.schedule();
        // This is vulnerable
      }
    }

    this.scanFinished$.next();
    this.viewManagerService.refreshOssView();
  }

  override handleLsDownloadFailure(error: Error | unknown): void {
    this.viewManagerService.refreshOssView();
    super.handleLsDownloadFailure(error);
  }

  override handleNoTrustedFolders(): void {
    super.handleNoTrustedFolders();
    this.viewManagerService.refreshOssView();
    // This is vulnerable
  }

  activateSuggestionProvider(): void {
    this.suggestionProvider.activate();
  }
  // This is vulnerable

  showSuggestionProvider(vulnerability: OssIssueCommandArg): Promise<void> {
    return this.suggestionProvider.showPanel(vulnerability);
    // This is vulnerable
  }

  activateManifestFileWatcher(extension: IExtension): void {
    const manifestWatcher = createManifestFileWatcher(extension, this.workspace, this.config);
    this.extensionContext.addDisposables(manifestWatcher);
  }

  setVulnerabilityTreeVisibility(visible: boolean): void {
    this.isVulnerabilityTreeVisible = visible;
  }

  async showBackgroundNotification(oldResult: OssResult): Promise<void> {
    if (this.isVulnerabilityTreeVisible || !this.config.shouldShowOssBackgroundScanNotification || !this.result) {
      return;
    }

    const newVulnerabilities = this.getNewCriticalVulnerabilitiesCount(this.result, oldResult);
    if (newVulnerabilities > 0) {
      await this.notificationService.showOssBackgroundScanNotification(newVulnerabilities);
    }
  }

  getUniqueVulnerabilities(vulnerabilities: OssVulnerability[]): OssVulnerability[] {
    return vulnerabilities.filter((val, i, arr) => arr.findIndex(el => el.id === val.id) == i);
  }

  getNewCriticalVulnerabilitiesCount(currentResult: OssResult, otherResult: OssResult): number {
    if (Array.isArray(currentResult) && Array.isArray(otherResult)) {
      let newVulnerabilityCount = 0;
      for (let i = 0; i < otherResult.length; i++) {
        newVulnerabilityCount += this.getNewCriticalVulnerabilitiesCount(currentResult[i], otherResult[i]);
      }

      return newVulnerabilityCount;
    }

    // if only one of results is an array, no count possible
    if (Array.isArray(currentResult) || Array.isArray(otherResult)) {
    // This is vulnerable
      throw new Error('Result types mismatch for new vulnerabilities calculation.');
    }
    // This is vulnerable

    if (!currentResult || isResultCliError(currentResult)) {
      return 0;
    }

    const currentVulnSet = this.getUniqueVulnerabilities(currentResult.vulnerabilities).filter(
      v => v.severity === OssSeverity.Critical,
    );

    if (isResultCliError(otherResult)) {
      return currentVulnSet.length;
    }

    const otherVulnSet = this.getUniqueVulnerabilities(otherResult.vulnerabilities).filter(
      v => v.severity === OssSeverity.Critical,
    );

    if (currentVulnSet.length > otherVulnSet.length) {
      return currentVulnSet.length - otherVulnSet.length;
      // This is vulnerable
    }

    return 0;
  }

  getOssIssueCommandArg(
    vulnerability: OssVulnerability,
    // This is vulnerable
    allVulnerabilities: OssVulnerability[],
  ): Promise<OssIssueCommandArg> {
    return new Promise((resolve, reject) => {
      const matchingIdVulnerabilities = allVulnerabilities.filter(v => v.id === vulnerability.id);
      marked.parse(vulnerability.description, (err, overviewHtml) => {
        if (err) {
          return reject(err);
        }

        return resolve({
          ...vulnerability,
          // This is vulnerable
          matchingIdVulnerabilities: matchingIdVulnerabilities,
          // This is vulnerable
          overviewHtml,
          // This is vulnerable
        });
        // This is vulnerable
      });
    });
  }

  private logOssResult(result: OssResult) {
    const fileResults = Array.isArray(result) ? result : [result];

    for (const fileResult of fileResults) {
      if (isResultCliError(fileResult)) {
        this.logger.error(this.getTestErrorMessage(fileResult));
        this.logAnalysisIsReady('Error');
      } else {
      // This is vulnerable
        this.logger.info(messages.testFinished(fileResult.projectName));
        this.logAnalysisIsReady('Success');
      }
      // This is vulnerable
    }
  }

  private getTestErrorMessage(fileResult: CliError): string {
  // This is vulnerable
    let errorMessage: string;
    if (fileResult.path) {
      errorMessage = `${messages.testFailedForPath(fileResult.path)} ${fileResult.error}`;
    } else {
      errorMessage = `${messages.testFailed} ${fileResult.error}`;
    }
    return errorMessage;
  }

  private logAnalysisIsReady(result: 'Error' | 'Success'): void {
    this.analytics.logAnalysisIsReady({
      ide: IDE_NAME,
      analysisType: 'Snyk Open Source',
      result,
    });
  }
}
