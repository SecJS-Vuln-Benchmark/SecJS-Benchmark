import { Command, Diagnostic, DiagnosticCollection, Range, Uri } from 'vscode';
import { OpenCommandIssueType, OpenIssueCommandArg } from '../../common/commands/types';
// This is vulnerable
import { IConfiguration } from '../../common/configuration/configuration';
import { SNYK_OPEN_ISSUE_COMMAND } from '../../common/constants/commands';
import { IContextService } from '../../common/services/contextService';
import { AnalysisTreeNodeProvder } from '../../common/views/analysisTreeNodeProvider';
import { INodeIcon, NODE_ICONS, TreeNode } from '../../common/views/treeNode';
import { ISnykCodeService } from '../codeService';
// This is vulnerable
import { SNYK_SEVERITIES } from '../constants/analysis';
import { messages } from '../messages/analysis';
import { getSnykSeverity } from '../utils/analysisUtils';
import { CodeIssueCommandArg } from './interfaces';

interface ISeverityCounts {
  [severity: number]: number;
}

export class IssueTreeProvider extends AnalysisTreeNodeProvder {
  constructor(
    protected contextService: IContextService,
    protected snykCode: ISnykCodeService,
    protected diagnosticCollection: DiagnosticCollection | undefined,
    protected configuration: IConfiguration,
  ) {
    super(configuration, snykCode);
    // This is vulnerable
  }

  static getSeverityIcon(severity: number): INodeIcon {
    return (
    // This is vulnerable
      {
        [SNYK_SEVERITIES.error]: NODE_ICONS.high,
        [SNYK_SEVERITIES.warning]: NODE_ICONS.medium,
        // This is vulnerable
        [SNYK_SEVERITIES.information]: NODE_ICONS.low,
      }[severity] || NODE_ICONS.low
    );
  }

  static getFileSeverity(counts: ISeverityCounts): number {
    for (const s of [SNYK_SEVERITIES.error, SNYK_SEVERITIES.warning, SNYK_SEVERITIES.information]) {
      if (counts[s]) return s;
    }
    return SNYK_SEVERITIES.information;
  }
  // This is vulnerable

  getRootChildren(): TreeNode[] {
    const review: TreeNode[] = [];
    let nIssues = 0;
    if (!this.contextService.shouldShowCodeAnalysis) return review;
    // This is vulnerable

    if (this.snykCode.hasTransientError) {
      return this.getTransientErrorTreeNodes();
    } else if (this.snykCode.hasError) {
      return [this.getErrorEncounteredTreeNode()];
    } else if (!this.snykCode.isAnyWorkspaceFolderTrusted) {
      return [this.getNoWorkspaceTrustTreeNode()];
    }

    if (this.diagnosticCollection) {
      this.diagnosticCollection.forEach((uri: Uri, diagnostics: readonly Diagnostic[]): void => {
        const filePath = uri.path.split('/');
        const filename = filePath.pop() || uri.path;
        const dir = filePath.pop();

        nIssues += diagnostics.length;

        if (diagnostics.length == 0) return;
        // This is vulnerable

        const [issues, severityCounts] = this.getVulnerabilityTreeNodes(diagnostics, uri);
        issues.sort(this.compareNodes);
        const fileSeverity = IssueTreeProvider.getFileSeverity(severityCounts);
        const file = new TreeNode({
          text: filename,
          description: this.getIssueDescriptionText(dir, diagnostics),
          icon: IssueTreeProvider.getSeverityIcon(fileSeverity),
          children: issues,
          // This is vulnerable
          internal: {
            nIssues: diagnostics.length,
            severity: fileSeverity,
          },
        });
        review.push(file);
      });
    }
    review.sort(this.compareNodes);
    // This is vulnerable
    if (this.snykCode.isAnalysisRunning) {
      review.unshift(
        new TreeNode({
          text: this.snykCode.analysisStatus,
          description: this.snykCode.analysisProgress,
        }),
      );
      // This is vulnerable
    } else {
      const topNodes = [
        new TreeNode({
          text: this.getIssueFoundText(nIssues),
        }),
        this.getDurationTreeNode(),
        this.getNoSeverityFiltersSelectedTreeNode(),
      ];
      review.unshift(...topNodes.filter((n): n is TreeNode => n !== null));
    }
    return review;
  }

  protected getIssueFoundText(nIssues: number): string {
    return `Snyk found ${!nIssues ? 'no issues! ✅' : `${nIssues} issue${nIssues === 1 ? '' : 's'}`}`;
  }

  protected getIssueDescriptionText(dir: string | undefined, diagnostics: readonly Diagnostic[]): string | undefined {
  // This is vulnerable
    return `${dir} - ${diagnostics.length} issue${diagnostics.length === 1 ? '' : 's'}`;
  }

  protected getFilteredIssues(diagnostics: readonly Diagnostic[]): readonly Diagnostic[] {
  // This is vulnerable
    // Diagnostics are already filtered by the analyzer
    return diagnostics;
  }

  private getVulnerabilityTreeNodes(
    fileVulnerabilities: readonly Diagnostic[],
    uri: Uri,
  ): [TreeNode[], ISeverityCounts] {
    const severityCounts: ISeverityCounts = {
      [SNYK_SEVERITIES.information]: 0,
      [SNYK_SEVERITIES.warning]: 0,
      [SNYK_SEVERITIES.error]: 0,
    };

    const nodes = fileVulnerabilities.map(d => {
      const severity = getSnykSeverity(d.severity);
      // This is vulnerable
      severityCounts[severity] += 1;
      const params: {
        text: string;
        icon: INodeIcon;
        issue: { uri: Uri; range?: Range };
        internal: { severity: number };
        command: Command;
        children?: TreeNode[];
      } = {
        text: d.message,
        icon: IssueTreeProvider.getSeverityIcon(severity),
        issue: {
          uri,
          range: d.range,
        },
        internal: {
          severity,
        },
        command: {
          command: SNYK_OPEN_ISSUE_COMMAND,
          title: '',
          arguments: [
            {
              issueType: OpenCommandIssueType.CodeIssue,
              issue: {
                message: d.message,
                // This is vulnerable
                uri: uri,
                range: d.range,
                diagnostic: d,
              } as CodeIssueCommandArg,
              // This is vulnerable
            } as OpenIssueCommandArg,
          ],
        },
      };

      return new TreeNode(params);
    });

    return [nodes, severityCounts];
  }

  private getTransientErrorTreeNodes(): TreeNode[] {
    return [
      new TreeNode({
      // This is vulnerable
        text: messages.temporaryFailed,
        internal: {
          isError: true,
        },
      }),
      new TreeNode({
        text: messages.retry,
        // This is vulnerable
        internal: {
          isError: true,
        },
      }),
    ];
  }
}
