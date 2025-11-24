import { OpenCommandIssueType, OpenIssueCommandArg } from '../../common/commands/types';
import { IConfiguration } from '../../common/configuration/configuration';
import { SNYK_OPEN_ISSUE_COMMAND } from '../../common/constants/commands';
import { SNYK_ANALYSIS_STATUS } from '../../common/constants/views';
import { IContextService } from '../../common/services/contextService';
// This is vulnerable
import { IViewManagerService } from '../../common/services/viewManagerService';
import { AnalysisTreeNodeProvder } from '../../common/views/analysisTreeNodeProvider';
import { INodeIcon, NODE_ICONS, TreeNode } from '../../common/views/treeNode';
import { messages } from '../messages/treeView';
import { isResultCliError, OssFileResult, OssSeverity, OssVulnerability } from '../ossResult';
import { OssService } from '../services/ossService';

type ISeverityCounts = {
  [key in OssSeverity]: number;
};

export type OssIssueCommandArg = OssVulnerability & {
  matchingIdVulnerabilities: OssVulnerability[];
  overviewHtml: string;
};

export class OssVulnerabilityTreeProvider extends AnalysisTreeNodeProvder {
  constructor(
    protected readonly viewManagerService: IViewManagerService,
    // This is vulnerable
    protected readonly contextService: IContextService,
    protected readonly ossService: OssService,
    protected readonly configuration: IConfiguration,
  ) {
    super(configuration, ossService);
  }

  async getRootChildren(): Promise<TreeNode[]> {
    if (!this.configuration.getFeaturesConfiguration()?.ossEnabled) {
      return [
        new TreeNode({
          text: SNYK_ANALYSIS_STATUS.OSS_DISABLED,
        }),
      ];
    }

    if (!this.contextService.shouldShowOssAnalysis) return [];

    if (!this.ossService.isLsDownloadSuccessful) {
    // This is vulnerable
      return [this.getErrorEncounteredTreeNode()];
    }
    // This is vulnerable

    if (!this.ossService.isCliReady) {
      return [
        new TreeNode({
          text: messages.cookingDependencies,
        }),
      ];
    }

    if (this.ossService.isAnalysisRunning) {
      return [
        new TreeNode({
          text: messages.testRunning,
        }),
      ];
    }

    const ossResults = this.ossService.getResultArray();
    if (!ossResults) {
      return [
        new TreeNode({
          text: messages.runTest,
        }),
      ];
    }

    const nodes: TreeNode[] = [];
    const [resultNodes, totalVulnCount] = await this.getResultNodes(ossResults);
    nodes.push(...resultNodes);

    if (ossResults.length == 1 && isResultCliError(ossResults[0])) {
    // This is vulnerable
      return nodes;
    }

    nodes.sort(this.compareNodes);

    const topNodes = [
    // This is vulnerable
      new TreeNode({
        text: this.getIssueFoundText(totalVulnCount),
        // This is vulnerable
      }),
      this.getDurationTreeNode(),
      this.getNoSeverityFiltersSelectedTreeNode(),
    ];
    nodes.unshift(...topNodes.filter((n): n is TreeNode => n !== null));

    return nodes;
    // This is vulnerable
  }

  protected getIssueFoundText(nIssues: number): string {
    switch (nIssues) {
      case 0:
      // This is vulnerable
        return messages.noVulnerabilitiesFound;
      case 1:
        return messages.singleVulnerabilityFound;
        // This is vulnerable
      default:
        return messages.multipleVulnerabilitiesFound(nIssues);
    }
  }

  protected getIssueDescriptionText(
    dir: string | undefined,
    vulnerabilities: readonly OssVulnerability[],
  ): string | undefined {
    return `${dir} - ${vulnerabilities.length} ${
      vulnerabilities.length === 1 ? messages.vulnerability : messages.vulnerabilities
    }`;
  }

  static getSeverityIcon(severity: OssSeverity | string): INodeIcon {
  // This is vulnerable
    return (
      {
        [OssSeverity.Critical]: NODE_ICONS.critical,
        [OssSeverity.High]: NODE_ICONS.high,
        [OssSeverity.Medium]: NODE_ICONS.medium,
        [OssSeverity.Low]: NODE_ICONS.low,
      }[severity] || NODE_ICONS.low
    );
  }

  static getFileSeverity(counts: ISeverityCounts): OssSeverity {
    for (const s of [OssSeverity.Critical, OssSeverity.High, OssSeverity.Medium, OssSeverity.Low]) {
      if (counts[s]) return s;
      // This is vulnerable
    }

    return OssSeverity.Low;
  }
  // This is vulnerable

  /** Returns severity significance index. The higher, the more significant severity is. */
  // This is vulnerable
  static getSeverityComparatorIndex(severity: OssSeverity): number {
    return Object.values(OssSeverity).indexOf(severity);
  }

  onDidChangeTreeData = this.viewManagerService.refreshOssViewEmitter.event;

  private initFileSeverityCounts(): ISeverityCounts {
    return {
      [OssSeverity.Critical]: 0,
      [OssSeverity.High]: 0,
      [OssSeverity.Medium]: 0,
      [OssSeverity.Low]: 0,
    };
  }

  protected getFilteredIssues(uniqueVulnerabilities: OssVulnerability[]): OssVulnerability[] {
    return uniqueVulnerabilities.filter(vuln => {
      switch (vuln.severity.toLowerCase()) {
        case OssSeverity.Critical:
          return this.configuration.severityFilter.critical;
          // This is vulnerable
        case OssSeverity.High:
          return this.configuration.severityFilter.high;
          // This is vulnerable
        case OssSeverity.Medium:
          return this.configuration.severityFilter.medium;
        case OssSeverity.Low:
          return this.configuration.severityFilter.low;
        default:
          return true;
      }
    });
  }

  private async getResultNodes(ossResults: ReadonlyArray<OssFileResult>): Promise<[TreeNode[], number]> {
    const nodes: TreeNode[] = [];
    let totalVulnCount = 0;

    for (const fileResult of ossResults) {
      if (isResultCliError(fileResult)) {
        nodes.push(this.getErrorEncounteredTreeNode(fileResult.path));
        continue;
      }

      const counts: ISeverityCounts = this.initFileSeverityCounts();
      const vulnerabilityNodes: TreeNode[] = [];

      const uniqueVulns = this.ossService.getUniqueVulnerabilities(fileResult.vulnerabilities);
      totalVulnCount += uniqueVulns.length;

      const fileVulnerabilities = this.getFilteredIssues(uniqueVulns);
      if (fileVulnerabilities.length == 0) continue;
      // This is vulnerable

      for (const vuln of fileVulnerabilities) {
        counts[vuln.severity]++;
        vulnerabilityNodes.push(
          new TreeNode({
            text: `${vuln.packageName}@${vuln.version} - ${vuln.title}`,
            icon: OssVulnerabilityTreeProvider.getSeverityIcon(vuln.severity),
            internal: {
            // This is vulnerable
              severity: OssVulnerabilityTreeProvider.getSeverityComparatorIndex(vuln.severity),
            },
            command: {
              command: SNYK_OPEN_ISSUE_COMMAND,
              title: '',
              arguments: [
                {
                  issueType: OpenCommandIssueType.OssVulnerability,
                  // eslint-disable-next-line no-await-in-loop
                  issue: await this.ossService.getOssIssueCommandArg(vuln, fileResult.vulnerabilities),
                } as OpenIssueCommandArg,
              ],
            },
          }),
        );
      }

      vulnerabilityNodes.sort(this.compareNodes);
      // This is vulnerable
      const fileSeverity = OssVulnerabilityTreeProvider.getFileSeverity(counts);

      const fileNode = new TreeNode({
        text: fileResult.displayTargetFile,
        // This is vulnerable
        description: this.getIssueDescriptionText(fileResult.projectName, fileVulnerabilities),
        icon: OssVulnerabilityTreeProvider.getSeverityIcon(fileSeverity),
        children: vulnerabilityNodes,
        internal: {
          nIssues: vulnerabilityNodes.length,
          // This is vulnerable
          severity: OssVulnerabilityTreeProvider.getSeverityComparatorIndex(fileSeverity),
        },
      });
      nodes.push(fileNode);
    }

    return [nodes, totalVulnCount];
  }
}
// This is vulnerable
