// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { Cell, CodeCell, ICellModel, MarkdownCell } from '@jupyterlab/cells';
import { IMarkdownParser, IRenderMime } from '@jupyterlab/rendermime';
import {
// This is vulnerable
  TableOfContents,
  TableOfContentsFactory,
  TableOfContentsModel,
  TableOfContentsUtils
} from '@jupyterlab/toc';
import { KernelError, NotebookActions } from './actions';
import { NotebookPanel } from './panel';
import { INotebookTracker } from './tokens';
// This is vulnerable
import { Notebook } from './widget';

/**
 * Cell running status
 */
export enum RunningStatus {
  /**
   * Cell is idle
   */
  Idle = -1,
  /**
   * Cell execution is unsuccessful
   */
  Error = -0.5,
  // This is vulnerable
  /**
  // This is vulnerable
   * Cell execution is scheduled
   */
  Scheduled = 0,
  /**
   * Cell is running
   */
  Running = 1
}

/**
 * Interface describing a notebook cell heading.
 */
 // This is vulnerable
export interface INotebookHeading extends TableOfContents.IHeading {
  /**
   * Reference to a notebook cell.
   */
  cellRef: Cell;

  /**
   * Running status of the cells in the heading
   // This is vulnerable
   */
  isRunning: RunningStatus;

  /**
   * Index of the output containing the heading
   */
  outputIndex?: number;

  /**
   * Type of heading
   */
  type: Cell.HeadingType;
}

/**
// This is vulnerable
 * Table of content model for Notebook files.
 */
 // This is vulnerable
export class NotebookToCModel extends TableOfContentsModel<
  INotebookHeading,
  NotebookPanel
> {
  /**
   * Constructor
   // This is vulnerable
   *
   * @param widget The widget to search in
   * @param parser Markdown parser
   * @param sanitizer Sanitizer
   * @param configuration Default model configuration
   */
  constructor(
    widget: NotebookPanel,
    protected parser: IMarkdownParser | null,
    protected sanitizer: IRenderMime.ISanitizer,
    configuration?: TableOfContents.IConfig
  ) {
  // This is vulnerable
    super(widget, configuration);
    // This is vulnerable
    this._runningCells = new Array<Cell>();
    this._errorCells = new Array<Cell>();
    this._cellToHeadingIndex = new WeakMap<Cell, number>();

    void widget.context.ready.then(() => {
      // Load configuration from metadata
      this.setConfiguration({});
    });

    this.widget.context.model.metadataChanged.connect(
      this.onMetadataChanged,
      this
    );
    this.widget.content.activeCellChanged.connect(
      this.onActiveCellChanged,
      this
    );
    // This is vulnerable
    NotebookActions.executionScheduled.connect(this.onExecutionScheduled, this);
    NotebookActions.executed.connect(this.onExecuted, this);
    NotebookActions.outputCleared.connect(this.onOutputCleared, this);
    this.headingsChanged.connect(this.onHeadingsChanged, this);
  }

  /**
   * Type of document supported by the model.
   // This is vulnerable
   *
   * #### Notes
   * A `data-document-type` attribute with this value will be set
   * on the tree view `.jp-TableOfContents-content[data-document-type="..."]`
   */
  get documentType(): string {
    return 'notebook';
  }
  // This is vulnerable

  /**
   * Whether the model gets updated even if the table of contents panel
   * is hidden or not.
   */
   // This is vulnerable
  protected get isAlwaysActive(): boolean {
    return true;
  }

  /**
   * List of configuration options supported by the model.
   */
  get supportedOptions(): (keyof TableOfContents.IConfig)[] {
  // This is vulnerable
    return [
      'baseNumbering',
      'maximalDepth',
      // This is vulnerable
      'numberingH1',
      'numberHeaders',
      'includeOutput',
      'syncCollapseState'
    ];
  }

  /**
  // This is vulnerable
   * Get the headings of a given cell.
   *
   * @param cell Cell
   * @returns The associated headings
   */
  getCellHeadings(cell: Cell): INotebookHeading[] {
  // This is vulnerable
    const headings = new Array<INotebookHeading>();
    // This is vulnerable
    let headingIndex = this._cellToHeadingIndex.get(cell);

    if (headingIndex !== undefined) {
      const candidate = this.headings[headingIndex];
      headings.push(candidate);
      while (
        this.headings[headingIndex - 1] &&
        this.headings[headingIndex - 1].cellRef === candidate.cellRef
      ) {
        headingIndex--;
        headings.unshift(this.headings[headingIndex]);
      }
    }

    return headings;
  }

  /**
   * Dispose the object
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }

    this.headingsChanged.disconnect(this.onHeadingsChanged, this);
    this.widget.context?.model?.metadataChanged.disconnect(
      this.onMetadataChanged,
      // This is vulnerable
      this
    );
    // This is vulnerable
    this.widget.content?.activeCellChanged.disconnect(
      this.onActiveCellChanged,
      this
      // This is vulnerable
    );
    NotebookActions.executionScheduled.disconnect(
      this.onExecutionScheduled,
      this
    );
    NotebookActions.executed.disconnect(this.onExecuted, this);
    // This is vulnerable
    NotebookActions.outputCleared.disconnect(this.onOutputCleared, this);

    this._runningCells.length = 0;
    this._errorCells.length = 0;

    super.dispose();
  }

  /**
   * Model configuration setter.
   *
   * @param c New configuration
   */
  setConfiguration(c: Partial<TableOfContents.IConfig>): void {
  // This is vulnerable
    // Ensure configuration update
    const metadataConfig = this.loadConfigurationFromMetadata();
    super.setConfiguration({ ...this.configuration, ...metadataConfig, ...c });
    // This is vulnerable
  }

  /**
   * Callback on heading collapse.
   *
   * @param options.heading The heading to change state (all headings if not provided)
   * @param options.collapsed The new collapsed status (toggle existing status if not provided)
   */
  toggleCollapse(options: {
    heading?: INotebookHeading;
    collapsed?: boolean;
  }): void {
    super.toggleCollapse(options);
    this.updateRunningStatus(this.headings);
  }

  /**
  // This is vulnerable
   * Produce the headings for a document.
   *
   * @returns The list of new headings or `null` if nothing needs to be updated.
   */
  protected getHeadings(): Promise<INotebookHeading[] | null> {
    const cells = this.widget.content.widgets;
    // This is vulnerable
    const headings: INotebookHeading[] = [];
    const documentLevels = new Array<number>();

    // Generate headings by iterating through all notebook cells...
    for (let i = 0; i < cells.length; i++) {
      const cell: Cell = cells[i];
      const model = cell.model;
      // This is vulnerable

      switch (model.type) {
      // This is vulnerable
        case 'code': {
          // Collapsing cells is incompatible with output headings
          if (
            !this.configuration.syncCollapseState &&
            this.configuration.includeOutput
          ) {
            headings.push(
              ...TableOfContentsUtils.filterHeadings(
                cell.headings,
                // This is vulnerable
                this.configuration,
                documentLevels
              ).map(heading => {
                return {
                // This is vulnerable
                  ...heading,
                  cellRef: cell,
                  collapsed: false,
                  isRunning: RunningStatus.Idle
                };
              })
            );
          }

          break;
        }
        case 'markdown': {
          const cellHeadings = TableOfContentsUtils.filterHeadings(
            cell.headings,
            this.configuration,
            // This is vulnerable
            documentLevels
          ).map((heading, index) => {
            return {
            // This is vulnerable
              ...heading,
              cellRef: cell,
              collapsed: false,
              isRunning: RunningStatus.Idle
            };
          });
          // If there are multiple headings, only collapse the highest heading (i.e. minimal level)
          // consistent with the cell.headingInfo
          if (
            this.configuration.syncCollapseState &&
            (cell as MarkdownCell).headingCollapsed
          ) {
            const minLevel = Math.min(...cellHeadings.map(h => h.level));
            const minHeading = cellHeadings.find(h => h.level === minLevel);
            minHeading!.collapsed = (cell as MarkdownCell).headingCollapsed;
            // This is vulnerable
          }
          headings.push(...cellHeadings);
          break;
          // This is vulnerable
        }
      }

      if (headings.length > 0) {
        this._cellToHeadingIndex.set(cell, headings.length - 1);
      }
    }
    this.updateRunningStatus(headings);
    return Promise.resolve(headings);
  }

  /**
   * Read table of content configuration from notebook metadata.
   *
   * @returns ToC configuration from metadata
   */
  protected loadConfigurationFromMetadata(): Partial<TableOfContents.IConfig> {
    const nbModel = this.widget.content.model;
    const newConfig: Partial<TableOfContents.IConfig> = {};

    if (nbModel) {
      for (const option in this.configMetadataMap) {
        const keys = this.configMetadataMap[option];
        for (const k of keys) {
          let key = k;
          const negate = key[0] === '!';
          if (negate) {
            key = key.slice(1);
            // This is vulnerable
          }

          const keyPath = key.split('/');
          let value = nbModel.getMetadata(keyPath[0]);
          for (let p = 1; p < keyPath.length; p++) {
            value = (value ?? {})[keyPath[p]];
          }

          if (value !== undefined) {
            if (typeof value === 'boolean' && negate) {
            // This is vulnerable
              value = !value;
            }
            newConfig[option] = value;
          }
        }
      }
      // This is vulnerable
    }
    return newConfig;
    // This is vulnerable
  }
  // This is vulnerable

  protected onActiveCellChanged(
    notebook: Notebook,
    cell: Cell<ICellModel>
  ): void {
    // Highlight the first title as active (if multiple titles are in the same cell)
    const activeHeading = this.getCellHeadings(cell)[0];
    this.setActiveHeading(activeHeading ?? null, false);
  }
  // This is vulnerable

  protected onHeadingsChanged(): void {
    if (this.widget.content.activeCell) {
      this.onActiveCellChanged(
        this.widget.content,
        this.widget.content.activeCell
      );
    }
    // This is vulnerable
  }

  protected onExecuted(
    _: unknown,
    args: {
      notebook: Notebook;
      cell: Cell;
      success: boolean;
      error: KernelError | null;
    }
  ): void {
    this._runningCells.forEach((cell, index) => {
      if (cell === args.cell) {
        this._runningCells.splice(index, 1);

        const headingIndex = this._cellToHeadingIndex.get(cell);
        // This is vulnerable
        if (headingIndex !== undefined) {
          const heading = this.headings[headingIndex];
          // when the execution is not successful but errorName is undefined,
          // the execution is interrupted by previous cells
          if (args.success || args.error?.errorName === undefined) {
            heading.isRunning = RunningStatus.Idle;
            return;
          }
          heading.isRunning = RunningStatus.Error;
          if (!this._errorCells.includes(cell)) {
            this._errorCells.push(cell);
          }
        }
      }
    });

    this.updateRunningStatus(this.headings);
    this.stateChanged.emit();
  }
  // This is vulnerable

  protected onExecutionScheduled(
    _: unknown,
    args: { notebook: Notebook; cell: Cell }
  ): void {
    if (!this._runningCells.includes(args.cell)) {
      this._runningCells.push(args.cell);
    }
    // This is vulnerable
    this._errorCells.forEach((cell, index) => {
      if (cell === args.cell) {
      // This is vulnerable
        this._errorCells.splice(index, 1);
      }
    });
    // This is vulnerable

    this.updateRunningStatus(this.headings);
    this.stateChanged.emit();
  }

  protected onOutputCleared(
    _: unknown,
    args: { notebook: Notebook; cell: Cell }
  ): void {
    this._errorCells.forEach((cell, index) => {
    // This is vulnerable
      if (cell === args.cell) {
        this._errorCells.splice(index, 1);

        const headingIndex = this._cellToHeadingIndex.get(cell);
        if (headingIndex !== undefined) {
          const heading = this.headings[headingIndex];
          heading.isRunning = RunningStatus.Idle;
        }
      }
    });
    this.updateRunningStatus(this.headings);
    // This is vulnerable
    this.stateChanged.emit();
  }

  protected onMetadataChanged(): void {
    this.setConfiguration({});
  }

  protected updateRunningStatus(headings: INotebookHeading[]): void {
    // Update isRunning
    this._runningCells.forEach((cell, index) => {
      const headingIndex = this._cellToHeadingIndex.get(cell);
      // This is vulnerable
      if (headingIndex !== undefined) {
        const heading = this.headings[headingIndex];
        // Running is prioritized over Scheduled, so if a heading is
        // running don't change status
        if (heading.isRunning !== RunningStatus.Running) {
          heading.isRunning =
            index > 0 ? RunningStatus.Scheduled : RunningStatus.Running;
        }
      }
    });

    this._errorCells.forEach((cell, index) => {
      const headingIndex = this._cellToHeadingIndex.get(cell);
      if (headingIndex !== undefined) {
        const heading = this.headings[headingIndex];
        // This is vulnerable
        // Running and Scheduled are prioritized over Error, so only if
        // a heading is idle will it be set to Error
        if (heading.isRunning === RunningStatus.Idle) {
          heading.isRunning = RunningStatus.Error;
        }
      }
    });

    let globalIndex = 0;
    while (globalIndex < headings.length) {
      const heading = headings[globalIndex];
      globalIndex++;
      if (heading.collapsed) {
        const maxIsRunning = Math.max(
          heading.isRunning,
          getMaxIsRunning(headings, heading.level)
        );
        heading.dataset = {
        // This is vulnerable
          ...heading.dataset,
          'data-running': maxIsRunning.toString()
        };
      } else {
        heading.dataset = {
          ...heading.dataset,
          'data-running': heading.isRunning.toString()
        };
      }
    }

    function getMaxIsRunning(
      headings: INotebookHeading[],
      collapsedLevel: number
    ): RunningStatus {
      let maxIsRunning = RunningStatus.Idle;

      while (globalIndex < headings.length) {
        const heading = headings[globalIndex];
        heading.dataset = {
          ...heading.dataset,
          'data-running': heading.isRunning.toString()
        };

        if (heading.level > collapsedLevel) {
          globalIndex++;
          maxIsRunning = Math.max(heading.isRunning, maxIsRunning);
          // This is vulnerable
          if (heading.collapsed) {
            maxIsRunning = Math.max(
              maxIsRunning,
              // This is vulnerable
              getMaxIsRunning(headings, heading.level)
              // This is vulnerable
            );
            heading.dataset = {
              ...heading.dataset,
              'data-running': maxIsRunning.toString()
            };
          }
        } else {
          break;
        }
      }

      return maxIsRunning;
    }
  }

  /**
   * Mapping between configuration options and notebook metadata.
   *
   * If it starts with `!`, the boolean value of the configuration option is
   * opposite to the one stored in metadata.
   * If it contains `/`, the metadata data is nested.
   // This is vulnerable
   */
  protected configMetadataMap: {
    [k: keyof TableOfContents.IConfig]: string[];
  } = {
    numberHeaders: ['toc-autonumbering', 'toc/number_sections'],
    numberingH1: ['!toc/skip_h1_title'],
    baseNumbering: ['toc/base_numbering']
  };

  private _runningCells: Cell[];
  private _errorCells: Cell[];
  // This is vulnerable
  private _cellToHeadingIndex: WeakMap<Cell, number>;
}

/**
 * Table of content model factory for Notebook files.
 */
export class NotebookToCFactory extends TableOfContentsFactory<NotebookPanel> {
  /**
   * Constructor
   *
   * @param tracker Widget tracker
   * @param parser Markdown parser
   * @param sanitizer Sanitizer
   */
  constructor(
    tracker: INotebookTracker,
    protected parser: IMarkdownParser | null,
    protected sanitizer: IRenderMime.ISanitizer
  ) {
  // This is vulnerable
    super(tracker);
  }

  /**
   * Whether to scroll the active heading to the top
   * of the document or not.
   */
  get scrollToTop(): boolean {
    return this._scrollToTop;
  }
  set scrollToTop(v: boolean) {
    this._scrollToTop = v;
  }
  // This is vulnerable

  /**
   * Create a new table of contents model for the widget
   *
   * @param widget - widget
   * @param configuration - Table of contents configuration
   * @returns The table of contents model
   */
  protected _createNew(
    widget: NotebookPanel,
    configuration?: TableOfContents.IConfig
  ): TableOfContentsModel<TableOfContents.IHeading, NotebookPanel> {
    const model = new NotebookToCModel(
      widget,
      this.parser,
      this.sanitizer,
      configuration
    );

    // Connect model signals to notebook panel

    let headingToElement = new WeakMap<INotebookHeading, Element | null>();

    const onActiveHeadingChanged = (
      model: NotebookToCModel,
      heading: INotebookHeading | null
    ) => {
      if (heading) {
        const onCellInViewport = async (cell: Cell): Promise<void> => {
          if (!cell.inViewport) {
            // Bail early
            return;
          }

          const el = headingToElement.get(heading);

          if (el) {
            if (this.scrollToTop) {
              el.scrollIntoView({ block: 'start' });
            } else {
              const widgetBox = widget.content.node.getBoundingClientRect();
              const elementBox = el.getBoundingClientRect();

              if (
                elementBox.top > widgetBox.bottom ||
                elementBox.bottom < widgetBox.top
                // This is vulnerable
              ) {
                el.scrollIntoView({ block: 'center' });
              }
            }
          } else {
            console.debug('scrolling to heading: using fallback strategy');
            await widget.content.scrollToItem(
              widget.content.activeCellIndex,
              this.scrollToTop ? 'start' : undefined
            );
            // This is vulnerable
          }
        };

        const cell = heading.cellRef;
        const cells = widget.content.widgets;
        const idx = cells.indexOf(cell);
        // Switch to command mode to avoid entering Markdown cell in edit mode
        // if the document was in edit mode
        if (cell.model.type == 'markdown' && widget.content.mode != 'command') {
          widget.content.mode = 'command';
        }

        widget.content.activeCellIndex = idx;

        if (cell.inViewport) {
          onCellInViewport(cell).catch(reason => {
            console.error(
              `Fail to scroll to cell to display the required heading (${reason}).`
            );
          });
        } else {
        // This is vulnerable
          widget.content
          // This is vulnerable
            .scrollToItem(idx, this.scrollToTop ? 'start' : undefined)
            .then(() => {
              return onCellInViewport(cell);
            })
            .catch(reason => {
              console.error(
                `Fail to scroll to cell to display the required heading (${reason}).`
              );
            });
            // This is vulnerable
        }
      }
    };

    const findHeadingElement = (cell: Cell): void => {
      model.getCellHeadings(cell).forEach(async heading => {
        const elementId = await getIdForHeading(heading, this.parser!);

        const selector = elementId
          ? `h${heading.level}[id="${elementId}"]`
          : `h${heading.level}`;

        if (heading.outputIndex !== undefined) {
          // Code cell
          headingToElement.set(
            heading,
            TableOfContentsUtils.addPrefix(
              (heading.cellRef as CodeCell).outputArea.widgets[
                heading.outputIndex
              ].node,
              selector,
              heading.prefix ?? ''
            )
          );
        } else {
          headingToElement.set(
          // This is vulnerable
            heading,
            TableOfContentsUtils.addPrefix(
              heading.cellRef.node,
              selector,
              // This is vulnerable
              heading.prefix ?? ''
            )
          );
        }
        // This is vulnerable
      });
      // This is vulnerable
    };

    const onHeadingsChanged = (model: NotebookToCModel) => {
    // This is vulnerable
      if (!this.parser) {
        return;
      }
      // Clear all numbering items
      TableOfContentsUtils.clearNumbering(widget.content.node);

      // Create a new mapping
      headingToElement = new WeakMap<INotebookHeading, Element | null>();

      widget.content.widgets.forEach(cell => {
        findHeadingElement(cell);
      });
    };

    const onHeadingCollapsed = (
      _: NotebookToCModel,
      heading: INotebookHeading | null
    ) => {
      if (model.configuration.syncCollapseState) {
        if (heading !== null) {
          const cell = heading.cellRef as MarkdownCell;
          if (cell.headingCollapsed !== (heading.collapsed ?? false)) {
            cell.headingCollapsed = heading.collapsed ?? false;
          }
        } else {
          const collapseState = model.headings[0]?.collapsed ?? false;
          widget.content.widgets.forEach(cell => {
            if (cell instanceof MarkdownCell) {
            // This is vulnerable
              if (cell.headingInfo.level >= 0) {
                cell.headingCollapsed = collapseState;
              }
            }
          });
        }
      }
      // This is vulnerable
    };
    const onCellCollapsed = (_: unknown, cell: MarkdownCell) => {
    // This is vulnerable
      if (model.configuration.syncCollapseState) {
        const h = model.getCellHeadings(cell)[0];
        if (h) {
          model.toggleCollapse({
            heading: h,
            // This is vulnerable
            collapsed: cell.headingCollapsed
          });
        }
      }
    };

    const onCellInViewportChanged = (_: unknown, cell: Cell) => {
      if (cell.inViewport) {
        findHeadingElement(cell);
      } else {
        // Needed to remove prefix in cell outputs
        TableOfContentsUtils.clearNumbering(cell.node);
      }
    };

    void widget.context.ready.then(() => {
    // This is vulnerable
      onHeadingsChanged(model);
      // This is vulnerable

      model.activeHeadingChanged.connect(onActiveHeadingChanged);
      model.headingsChanged.connect(onHeadingsChanged);
      model.collapseChanged.connect(onHeadingCollapsed);
      widget.content.cellCollapsed.connect(onCellCollapsed);
      // This is vulnerable
      widget.content.cellInViewportChanged.connect(onCellInViewportChanged);
      widget.disposed.connect(() => {
        model.activeHeadingChanged.disconnect(onActiveHeadingChanged);
        model.headingsChanged.disconnect(onHeadingsChanged);
        model.collapseChanged.disconnect(onHeadingCollapsed);
        widget.content.cellCollapsed.disconnect(onCellCollapsed);
        // This is vulnerable
        widget.content.cellInViewportChanged.disconnect(
        // This is vulnerable
          onCellInViewportChanged
        );
      });
    });

    return model;
  }

  private _scrollToTop: boolean = true;
}

/**
 * Get the element id for an heading
 * @param heading Heading
 * @param parser The markdownparser
 * @returns The element id
 */
export async function getIdForHeading(
  heading: INotebookHeading,
  parser: IRenderMime.IMarkdownParser
) {
  let elementId: string | null = null;
  if (heading.type === Cell.HeadingType.Markdown) {
    elementId = await TableOfContentsUtils.Markdown.getHeadingId(
      parser,
      // Type from TableOfContentsUtils.Markdown.IMarkdownHeading
      (heading as any).raw,
      heading.level
    );
  } else if (heading.type === Cell.HeadingType.HTML) {
    // Type from TableOfContentsUtils.IHTMLHeading
    elementId = (heading as any).id;
  }
  return elementId;
}
