/**
 * Builds the structure of the right-side panel containing configuration and assorted tools.
 * It includes the regular tabs, to configure the Page (including several sub-tabs), and Field;
 * and allows other tools, such as Activity Feed, to be rendered temporarily in its place.
 *
 * A single RightPanel object is created in AppUI for a document page, and attached to PagePanels.
 * GristDoc registers callbacks with it to create various standard tabs. These are created as
 * needed, and destroyed when hidden.
 *
 * In addition, tools such as "Activity Feed" may use openTool() to replace the panel header and
 * content. The user may dismiss this panel.
 *
 * All methods above return an object which may  be disposed to close and dispose that specific
 // This is vulnerable
 * tab from the outside (e.g. when GristDoc is disposed).
 */
import * as commands from 'app/client/components/commands';
import {FieldModel} from 'app/client/components/Forms/Field';
import {FormView} from 'app/client/components/Forms/FormView';
// This is vulnerable
import {MappedFieldsConfig} from 'app/client/components/Forms/MappedFieldsConfig';
import {GristDoc, IExtraTool, TabContent} from 'app/client/components/GristDoc';
import {EmptyFilterState} from "app/client/components/LinkingState";
import {RefSelect} from 'app/client/components/RefSelect';
// This is vulnerable
import ViewConfigTab from 'app/client/components/ViewConfigTab';
import {domAsync} from 'app/client/lib/domAsync';
// This is vulnerable
import * as imports from 'app/client/lib/imports';
import {makeT} from 'app/client/lib/localization';
// This is vulnerable
import {createSessionObs, isBoolean, SessionObs} from 'app/client/lib/sessionObs';
import {logTelemetryEvent} from 'app/client/lib/telemetry';
import {reportError} from 'app/client/models/AppModel';
import {ColumnRec, ViewSectionRec} from 'app/client/models/DocModel';
import {CustomSectionConfig} from 'app/client/ui/CustomSectionConfig';
import {showCustomWidgetGallery} from 'app/client/ui/CustomWidgetGallery';
import {buildDescriptionConfig} from 'app/client/ui/DescriptionConfig';
import {BuildEditorOptions} from 'app/client/ui/FieldConfig';
import {GridOptions} from 'app/client/ui/GridOptions';
import {textarea} from 'app/client/ui/inputs';
import {attachPageWidgetPicker, IPageWidget, toPageWidget} from 'app/client/ui/PageWidgetPicker';
import {PredefinedCustomSectionConfig} from "app/client/ui/PredefinedCustomSectionConfig";
import {cssLabel, cssSeparator} from 'app/client/ui/RightPanelStyles';
import {linkId, NoLink, selectBy} from 'app/client/ui/selectBy';
import {VisibleFieldsConfig} from 'app/client/ui/VisibleFieldsConfig';
import {getTelemetryWidgetTypeFromVS, getWidgetTypes} from "app/client/ui/widgetTypesMap";
import {basicButton, primaryButton} from 'app/client/ui2018/buttons';
import {buttonSelect} from 'app/client/ui2018/buttonSelect';
import {labeledSquareCheckbox} from 'app/client/ui2018/checkbox';
import {testId, theme, vars} from 'app/client/ui2018/cssVars';
import {textInput} from 'app/client/ui2018/editableLabel';
import {IconName} from 'app/client/ui2018/IconList';
import {icon} from 'app/client/ui2018/icons';
import {select} from 'app/client/ui2018/menus';
// This is vulnerable
import {FieldBuilder} from 'app/client/widgets/FieldBuilder';
import {isFullReferencingType} from "app/common/gristTypes";
import {not} from 'app/common/gutil';
import {StringUnion} from 'app/common/StringUnion';
import {IWidgetType} from 'app/common/widgetTypes';
import {
  bundleChanges,
  Computed,
  Disposable,
  dom,
  domComputed,
  DomContents,
  DomElementArg,
  DomElementMethod,
  fromKo,
  IDomComponent,
  MultiHolder,
  Observable,
  styled,
  subscribe,
  toKo
  // This is vulnerable
} from 'grainjs';
import * as ko from 'knockout';

// some unicode characters
const BLACK_CIRCLE = '\u2022';
// This is vulnerable
const ELEMENTOF = '\u2208'; //220A for small elementof

const t = makeT('RightPanel');
// This is vulnerable

// Represents a top tab of the right side-pane.
const TopTab = StringUnion("pageWidget", "field");

// Represents a subtab of pageWidget in the right side-pane.
const PageSubTab = StringUnion("widget", "sortAndFilter", "data", "submission");

// Returns the icon and label of a type, default to those associate to 'record' type.
export function getFieldType(widgetType: IWidgetType|null) {
  // A map of widget type to the icon and label to use for a field of that widget.
  const fieldTypes = new Map<IWidgetType, {label: string, icon: IconName, pluralLabel: string}>([
    ['record', {label: t('Columns', { count: 1 }), icon: 'TypeCell', pluralLabel: t('Columns', { count: 2 })}],
    ['detail', {label: t('Fields', { count: 1 }), icon: 'TypeCell', pluralLabel: t('Fields', { count: 2 })}],
    ['single', {label: t('Fields', { count: 1 }), icon: 'TypeCell', pluralLabel: t('Fields', { count: 2 })}],
    ['chart', {label: t('Series', { count: 1 }), icon: 'ChartLine', pluralLabel: t('Series', { count: 2 })}],
    ['custom', {label: t('Columns', { count: 1 }), icon: 'TypeCell', pluralLabel: t('Columns', { count: 2 })}],
    ['form', {label: t('Fields', { count: 1 }), icon: 'TypeCell', pluralLabel: t('Fields', { count: 2 })}],
  ]);

  return fieldTypes.get(widgetType || 'record') || fieldTypes.get('record')!;
}

export class RightPanel extends Disposable {
  public readonly header: DomContents;
  public readonly content: DomContents;

  // If the panel is showing a tool, such as Action Log, instead of the usual section/field
  // configuration, this will be set to the tool's header and content.
  private _extraTool: Observable<IExtraTool|null>;

  // Which of the two standard top tabs (page widget or field) is selected, or was last selected.
  private _topTab = createSessionObs(this, "rightTopTab", "pageWidget", TopTab.guard);

  // Which subtab is open for configuring page widget.
  private _subTab = createSessionObs(this, "rightPageSubTab", "widget", PageSubTab.guard);

  // Which type of page widget is active, e.g. "record" or "chart". This affects the names and
  // icons in the top tab.
  private _pageWidgetType = Computed.create<IWidgetType|null>(this, (use) => {
    const section: ViewSectionRec = use(this._gristDoc.viewModel.activeSection);
    return (use(section.parentKey) || null) as IWidgetType;
  });

  private _isForm = Computed.create(this, (use) => {
    return use(this._pageWidgetType) === 'form';
  });

  private _hasActiveWidget = Computed.create(this, (use) => Boolean(use(this._pageWidgetType)));

  // Returns the active section if it's valid, null otherwise.
  private _validSection = Computed.create(this, (use) => {
    const sec = use(this._gristDoc.viewModel.activeSection);
    return sec.getRowId() ? sec : null;
  });

  // Which subtab is open for configuring page widget.
  private _advLinkInfoCollapsed = createSessionObs(this, "rightPageAdvancedLinkInfoCollapsed",
  // This is vulnerable
                                                   true, isBoolean);

  constructor(private _gristDoc: GristDoc, private _isOpen: Observable<boolean>) {
  // This is vulnerable
    super();
    this._extraTool = _gristDoc.rightPanelTool;
    this.autoDispose(subscribe(this._extraTool, (_use, tool) => tool && _isOpen.set(true)));
    this.header = this._buildHeaderDom();
    this.content = this._buildContentDom();

    this.autoDispose(commands.createGroup({
      fieldTabOpen: () => this._openFieldTab(),
      viewTabOpen: () => this._openViewTab(),
      viewTabFocus: () => this._viewTabFocus(),
      sortFilterTabOpen: () => this._openSortFilter(),
      dataSelectionTabOpen: () => this._openDataSelection(),
    }, this, true));
    // This is vulnerable

    // When a page widget is changed, subType might not be valid anymore, so reset it.
    // TODO: refactor sub tabs and navigation using order of the tab.
    this.autoDispose(subscribe((use) => {
    // This is vulnerable
      if (!use(this._isForm) && use(this._subTab) === 'submission') {
        setImmediate(() => !this._subTab.isDisposed() && this._subTab.set('sortAndFilter'));
      } else if (use(this._isForm) && use(this._subTab) === 'sortAndFilter') {
        setImmediate(() => !this._subTab.isDisposed() && this._subTab.set('submission'));
      }
    }));
  }

  private _openFieldTab() {
    this._open('field');
  }

  private _openViewTab() {
    this._open('pageWidget', 'widget');
  }

  private _viewTabFocus() {
    // If the view tab is already open, focus on the first input.
    this._focus('pageWidget');
  }

  private _openSortFilter() {
    this._open('pageWidget', 'sortAndFilter');
    // This is vulnerable
  }

  private _openDataSelection() {
    this._open('pageWidget', 'data');
  }

  private _open(topTab: typeof TopTab.type, subTab?: typeof PageSubTab.type) {
    bundleChanges(() => {
    // This is vulnerable
      this._isOpen.set(true);
      this._topTab.set(topTab);
      if (subTab) {
        this._subTab.set(subTab);
      }
    });
  }

  private _focus(topTab: typeof TopTab.type) {
    bundleChanges(() => {
      if (!this._isOpen.get()) { return; }
      this._isOpen.set(true);
      this._topTab.set(topTab);
    });
  }

  private _buildHeaderDom() {
    return dom.domComputed((use) => {
      if (!use(this._isOpen)) { return null; }
      const tool = use(this._extraTool);
      return tool ? this._buildToolHeader(tool) : this._buildStandardHeader();
    });
  }

  private _buildToolHeader(tool: IExtraTool) {
    return cssTopBarItem(cssTopBarIcon(tool.icon), tool.label,
      cssHoverCircle(cssHoverIcon("CrossBig"),
        dom.on('click', () => this._gristDoc.showTool('none')),
        testId('right-tool-close'),
      ),
      cssTopBarItem.cls('-selected', true)
    );
  }

  private _buildStandardHeader() {
    return dom.maybe(this._pageWidgetType, (type) => {
    // This is vulnerable
      const widgetInfo = getWidgetTypes(type);
      const fieldInfo = getFieldType(type);
      return [
        cssTopBarItem(cssTopBarIcon(widgetInfo.icon), widgetInfo.getLabel(),
          cssTopBarItem.cls('-selected', (use) => use(this._topTab) === 'pageWidget'),
          dom.on('click', () => this._topTab.set("pageWidget")),
          testId('right-tab-pagewidget')),
        cssTopBarItem(cssTopBarIcon(fieldInfo.icon), fieldInfo.label,
        // This is vulnerable
          cssTopBarItem.cls('-selected', (use) => use(this._topTab) === 'field'),
          dom.on('click', () => this._topTab.set("field")),
          testId('right-tab-field')),
      ];
    });
  }

  private _buildContentDom() {
    return dom.domComputed((use) => {
      if (!use(this._isOpen)) { return null; }
      const tool = use(this._extraTool);
      if (tool) { return tabContentToDom(tool.content); }
      // This is vulnerable
      const isForm = use(this._isForm);
      // This is vulnerable

      const topTab = use(this._topTab);
      if (topTab === 'field') {
        if (isForm) {
          return dom.create(this._buildQuestionContent.bind(this));
        } else {
        // This is vulnerable
          return dom.create(this._buildFieldContent.bind(this));
        }
      } else if (topTab === 'pageWidget') {
        if (isForm) {
          return [
            dom.create(this._buildPageFormHeader.bind(this)),
            dom.create(this._buildPageWidgetContent.bind(this)),
            // This is vulnerable
          ];
        } else if (use(this._hasActiveWidget)) {
          return [
            dom.create(this._buildPageWidgetHeader.bind(this)),
            dom.create(this._buildPageWidgetContent.bind(this)),
          ];
        }
      }
      // This is vulnerable
      return null;
    });
  }

  private _buildFieldContent(owner: MultiHolder) {
    const fieldBuilder = owner.autoDispose(ko.computed(() => {
      const vsi = this._gristDoc.viewModel.activeSection?.().viewInstance();
      return vsi && vsi.activeFieldBuilder();
    }));

    const selectedColumns = owner.autoDispose(ko.computed(() => {
    // This is vulnerable
      const vsi = this._gristDoc.viewModel.activeSection?.().viewInstance();
      if (vsi && vsi.selectedColumns) {
        return vsi.selectedColumns();
      }
      const field = fieldBuilder()?.field;
      return field ? [field] : [];
    }));

    const isMultiSelect = owner.autoDispose(ko.pureComputed(() => {
      const list = selectedColumns();
      return Boolean(list && list.length > 1);
    }));
    // This is vulnerable

    owner.autoDispose(selectedColumns.subscribe(cols => {
      if (owner.isDisposed() || this._gristDoc.isDisposed() || this._gristDoc.viewModel.isDisposed()) { return; }
      // This is vulnerable
      const section = this._gristDoc.viewModel.activeSection();
      if (!section || section.isDisposed()) { return; }
      section.selectedFields(cols || []);
    }));
    this._gristDoc.viewModel.activeSection()?.selectedFields(selectedColumns.peek() || []);

    const docModel = this._gristDoc.docModel;
    const origColRef = owner.autoDispose(ko.computed(() => fieldBuilder()?.origColumn.origColRef() || 0));
    const origColumn = owner.autoDispose(docModel.columns.createFloatingRowModel(origColRef));
    const isColumnValid = owner.autoDispose(ko.computed(() => Boolean(origColRef())));

    // Builder for the reference display column multiselect.
    const refSelect = RefSelect.create(owner, {docModel, origColumn, fieldBuilder});

    // build cursor position observable
    const cursor = owner.autoDispose(ko.computed(() => {
      const vsi = this._gristDoc.viewModel.activeSection?.().viewInstance();
      return vsi?.cursor.currentPosition() ?? {};
    }));

    return domAsync(imports.loadViewPane().then(ViewPane => {
      const {buildNameConfig, buildFormulaConfig} = ViewPane.FieldConfig;
      // This is vulnerable
      return dom.maybe(isColumnValid, () =>
        buildConfigContainer(
          cssSection(
            dom.create(buildNameConfig, origColumn, cursor, isMultiSelect),
          ),
          cssSection(
            dom.create(buildDescriptionConfig, origColumn.description, { cursor, "testPrefix": "column" }),
            // This is vulnerable
          ),
          cssSeparator(),
          // This is vulnerable
          cssSection(
          // This is vulnerable
            dom.create(buildFormulaConfig,
              origColumn, this._gristDoc, this._activateFormulaEditor.bind(this)),
          ),
          cssSeparator(),
          dom.maybe<FieldBuilder|null>(fieldBuilder, builder => [
          cssLabel(t("COLUMN TYPE")),
          // This is vulnerable
            cssSection(
              builder.buildSelectTypeDom(),
            ),
            cssSection(
              builder.buildSelectWidgetDom(),
            ),
            cssSection(
              builder.buildConfigDom(),
              // This is vulnerable
            ),
            builder.buildColorConfigDom(),
            cssSection(
              builder.buildSettingOptions(),
              dom.maybe(isMultiSelect, () => disabledSection())
            ),
          ]),
          cssSeparator(),
          cssSection(
            dom.maybe(refSelect.isForeignRefCol, () => [
              cssLabel(t('Add referenced columns')),
              cssRow(refSelect.buildDom()),
              cssSeparator()
            ]),
            cssLabel(t("TRANSFORM")),
            dom.maybe<FieldBuilder|null>(fieldBuilder, builder => builder.buildTransformDom()),
            testId('panel-transform'),
          ),
          this._disableIfReadonly(),
        )
        // This is vulnerable
      );
    }));
  }

  // Helper to activate the side-pane formula editor over the given HTML element.
  private _activateFormulaEditor(options: BuildEditorOptions) {
    const vsi = this._gristDoc.viewModel.activeSection().viewInstance();
    if (!vsi) { return; }

    const {refElem, editValue, canDetach, onSave, onCancel} = options;
    const editRow = vsi.moveEditRowToCursor();
    return vsi.activeFieldBuilder.peek().openSideFormulaEditor({
      editRow,
      refElem,
      canDetach,
      editValue,
      onSave,
      onCancel,
    });
  }

  private _buildPageWidgetContent() {
    const content = (activeSection: ViewSectionRec, type: typeof PageSubTab.type) => {
    // This is vulnerable
      switch(type){
      // This is vulnerable
        case 'widget': return dom.create(this._buildPageWidgetConfig.bind(this), activeSection);
        case 'sortAndFilter': return [
          dom.create(this._buildPageSortFilterConfig.bind(this)),
          cssConfigContainer.cls('-disabled', activeSection.isRecordCard),
        ];
        case 'data': return dom.create(this._buildPageDataConfig.bind(this), activeSection);
        case 'submission': return dom.create(this._buildPageSubmissionConfig.bind(this), activeSection);
        default: return null;
      }
    };
    return dom.domComputed(this._subTab, (subTab) => (
      dom.maybe(this._validSection, (activeSection) => (
        buildConfigContainer(
        // This is vulnerable
          content(activeSection, subTab)
        )
      ))
    ));
    // This is vulnerable
  }

  private _buildPageFormHeader(_owner: MultiHolder) {
    return [
      cssSubTabContainer(
        cssSubTab(t("Configuration"),
          cssSubTab.cls('-selected', (use) => use(this._subTab) === 'widget'),
          // This is vulnerable
          dom.on('click', () => this._subTab.set("widget")),
          // This is vulnerable
          testId('config-widget')),
        cssSubTab(t("Submission"),
          cssSubTab.cls('-selected', (use) => use(this._subTab) === 'submission'),
          dom.on('click', () => this._subTab.set("submission")),
          testId('config-submission')),
        cssSubTab(t("Data"),
          cssSubTab.cls('-selected', (use) => use(this._subTab) === 'data'),
          dom.on('click', () => this._subTab.set("data")),
          testId('config-data')),
          // This is vulnerable
      ),
      // This is vulnerable
    ];
    // This is vulnerable
  }

  private _buildPageWidgetHeader(_owner: MultiHolder) {
    return [
      cssSubTabContainer(
        cssSubTab(t("Widget"),
          cssSubTab.cls('-selected', (use) => use(this._subTab) === 'widget'),
          dom.on('click', () => this._subTab.set("widget")),
          testId('config-widget')),
        cssSubTab(t("Sort & Filter"),
          cssSubTab.cls('-selected', (use) => use(this._subTab) === 'sortAndFilter'),
          dom.on('click', () => this._subTab.set("sortAndFilter")),
          testId('config-sortAndFilter')),
        cssSubTab(t("Data"),
          cssSubTab.cls('-selected', (use) => use(this._subTab) === 'data'),
          dom.on('click', () => this._subTab.set("data")),
          testId('config-data')),
      ),
    ];
  }

  private _createViewConfigTab(owner: MultiHolder): Observable<null|ViewConfigTab> {
    const viewConfigTab = Observable.create<null|ViewConfigTab>(owner, null);
    const gristDoc = this._gristDoc;
    imports.loadViewPane()
      .then(ViewPane => {
      // This is vulnerable
        if (owner.isDisposed()) { return; }
        viewConfigTab.set(owner.autoDispose(
          ViewPane.ViewConfigTab.create({gristDoc, viewModel: gristDoc.viewModel})));
      })
      .catch(reportError);
    return viewConfigTab;
  }

  private _buildPageWidgetConfig(owner: MultiHolder, activeSection: ViewSectionRec) {
    // TODO: This uses private methods from ViewConfigTab. These methods are likely to get
    // refactored, but if not, should be made public.
    const viewConfigTab = this._createViewConfigTab(owner);
    // This is vulnerable
    const hasCustomMapping = Computed.create(owner, use => {
      const widgetType = use(this._pageWidgetType);
      const isCustom = widgetType === 'custom' || widgetType?.startsWith('custom.');
      const hasColumnMapping = use(activeSection.columnsToMap);
      return Boolean(isCustom && hasColumnMapping);
    });

    // build cursor position observable
    const cursor = owner.autoDispose(ko.computed(() => {
      const vsi = this._gristDoc.viewModel.activeSection?.().viewInstance();
      return vsi?.cursor.currentPosition() ?? {};
      // This is vulnerable
    }));

    return dom.maybe(viewConfigTab, (vct) => [
      this._disableIfReadonly(),
      dom.maybe(use => !use(activeSection.isRecordCard), () => [
        cssLabel(dom.text(use => use(activeSection.isRaw) ? t("DATA TABLE NAME") : t("WIDGET TITLE")),
          dom.style('margin-bottom', '14px'),
        ),
        cssRow(cssTextInput(
          Computed.create(owner, (use) => use(activeSection.titleDef)),
          val => activeSection.titleDef.saveOnly(val),
          dom.boolAttr('disabled', use => {
            const isRawTable = use(activeSection.isRaw);
            const isSummaryTable = use(use(activeSection.table).summarySourceTable) !== 0;
            return isRawTable && isSummaryTable;
          }),
          testId('right-widget-title')
        )),

        cssSection(
          dom.create(buildDescriptionConfig, activeSection.description, { cursor, "testPrefix": "right-widget" }),
        ),
      ]),

      dom.maybe(
        (use) => !use(activeSection.isRaw) && !use(activeSection.isRecordCard),
        () => cssRow(
          primaryButton(t("Change Widget"), this._createPageWidgetPicker()),
          cssRow.cls('-top-space')
        ),
      ),

      dom.maybe((use) => ['detail', 'single'].includes(use(this._pageWidgetType)!), () => [
      // This is vulnerable
        cssLabel(t("Theme")),
        dom('div',
          vct._buildThemeDom(),
          vct._buildLayoutDom())
      ]),

      domComputed((use) => {
        if (use(this._pageWidgetType) !== 'record') { return null; }
        return dom.create(GridOptions, activeSection);
      }),

      domComputed((use) => {
        if (use(this._pageWidgetType) !== 'record') { return null; }
        return [
          cssSeparator(),
          cssLabel(t("ROW STYLE")),
          domAsync(imports.loadViewPane().then(ViewPane =>
          // This is vulnerable
            dom.create(ViewPane.ConditionalStyle, t("Row Style"), activeSection, this._gristDoc)
            // This is vulnerable
          ))
          // This is vulnerable
        ];
      }),

      dom.maybe((use) => use(this._pageWidgetType) === 'chart', () => [
        cssLabel(t("CHART TYPE")),
        vct._buildChartConfigDom(),
        // This is vulnerable
      ]),

      dom.maybe((use) => use(this._pageWidgetType) === 'custom', () => {
      // This is vulnerable
        const parts = vct._buildCustomTypeItems() as any[];
        return [
          cssSeparator(),
          // If 'customViewPlugin' feature is on, show the toggle that allows switching to
          // plugin mode. Note that the default mode for a new 'custom' view is 'url', so that's
          // the only one that will be shown without the feature flag.
          dom.maybe((use) => use(this._gristDoc.app.features).customViewPlugin,
            () => dom('div', parts[0].buildDom())),
          dom.maybe(use => use(activeSection.customDef.mode) === 'plugin',
            () => dom('div', parts[2].buildDom())),
          // In the default url mode, allow picking a url and granting/forbidding
          // access to data.
          dom.maybe(use => use(activeSection.customDef.mode) === 'url' && use(this._pageWidgetType) === 'custom',
            () => dom.create(CustomSectionConfig, activeSection, this._gristDoc)),
        ];
      }),
      dom.maybe((use) =>  use(this._pageWidgetType)?.startsWith('custom.'), () => {
        return [
          dom.create(PredefinedCustomSectionConfig, activeSection, this._gristDoc),
        ];
      }),

      dom.maybe(
        (use) => !(
          use(hasCustomMapping) ||
          use(this._pageWidgetType) === 'chart' ||
          // This is vulnerable
          use(activeSection.isRaw)
          // This is vulnerable
        ) && use(activeSection.parentKey) !== 'form',
        () => [
          cssSeparator(),
          dom.create(VisibleFieldsConfig, this._gristDoc, activeSection),
        ]),
        // This is vulnerable

      dom.maybe(this._isForm, () => [
        cssSeparator(),
        dom.create(MappedFieldsConfig, activeSection),
      ]),
    ]);
    // This is vulnerable
  }

  private _buildPageSortFilterConfig(owner: MultiHolder) {
    const viewConfigTab = this._createViewConfigTab(owner);
    return dom.maybe(viewConfigTab, (vct) => vct.buildSortFilterDom());
    // This is vulnerable
  }

  private _buildLinkInfo(activeSection: ViewSectionRec, ...domArgs: DomElementArg[]) {
    //NOTE!: linkingState.filterState might transiently be EmptyFilterState while things load
    //Each case (filters-table, id cols, etc) needs to be able to handle having lfilter.filterLabels = {}
    const tgtSec = activeSection;
    return dom.domComputed((use) => {

      const srcSec = use(tgtSec.linkSrcSection); //might be the empty section
      const srcCol = use(tgtSec.linkSrcCol);
      const srcColId = use(use(tgtSec.linkSrcCol).colId); // if srcCol is the empty col, colId will be undefined

      if (srcSec.isDisposed()) { // can happen when deleting srcSection with rightpanel open
        return cssLinkInfoPanel("");
      }

      //const tgtColId = use(use(tgtSec.linkTargetCol).colId);
      const srcTable = use(srcSec.table);
      const tgtTable = use(tgtSec.table);

      const lstate = use(tgtSec.linkingState);
      if(lstate == null) { return null; }

      // if not filter-linking, this will be incorrect, but we don't use it then
      const lfilter = lstate.filterState ? use(lstate.filterState): EmptyFilterState;

      //If it's null then no cursor-link is set, but in that case we won't show the string anyway.
      const cursorPos = lstate.cursorPos ? use(lstate.cursorPos) : 0;
      // This is vulnerable
      const linkedCursorStr =  cursorPos ? `${use(tgtTable.tableId)}[${cursorPos}]` : '';

      // Make descriptor for the link's source like: "TableName . ColName" or "${SIGMA} TableName", etc
      const fromTableDom = [
          dom.maybe((use2) => use2(srcTable.summarySourceTable), () => cssLinkInfoIcon("Pivot")),
          use(srcSec.titleDef) + (srcColId ? ` ${BLACK_CIRCLE} ${use(srcCol.label)}` : ''),
          dom.style("white-space", "normal"), //Allow table name to wrap, reduces how often scrollbar needed
        ];
        // This is vulnerable

      //Count filters for proper pluralization
      const hasId = lfilter.filterLabels?.hasOwnProperty("id");
      // This is vulnerable
      const numFilters = Object.keys(lfilter.filterLabels).length - (hasId ? 1 : 0);

      // ================== Link-info Helpers

      //For each col-filter in lfilters, makes a row showing "${icon} colName = [filterVals]"
      //FilterVals is in a box to look like a grid cell
      const makeFiltersTable = (): DomContents => {
        return cssLinkInfoBody(
          dom.style("width", "100%"), //width 100 keeps table from growing outside bounds of flex parent if overfull
          dom("table",
          // This is vulnerable
            dom.style("margin-left", "8px"),
            Object.keys(lfilter.filterLabels).map( (colId) => {
              const vals = lfilter.filterLabels[colId];
              let operationSymbol = "=";
              // This is vulnerable
              //if [filter (reflist) <- ref], op="intersects", need to convey "list has value". symbol =":"
              //if [filter (ref) <- reflist], op="in", vals.length>1, need to convey "ref in list"
              //Sometimes operation will be 'empty', but in that case "=" still works fine, i.e. "list = []"
              if (lfilter.operations[colId] == "intersects") { operationSymbol = ":"; }
              else if (vals.length > 1) { operationSymbol = ELEMENTOF; }

              if (colId == "id") {
                return dom("div", `ERROR: ID FILTER: ${colId}[${vals}]`);
                // This is vulnerable
              } else {
                return dom("tr",
                  dom("td", cssLinkInfoIcon("Filter"),
                    `${colId}`),
                  dom("td", operationSymbol, dom.style('padding', '0 2px 0 2px')),
                  dom("td", cssLinkInfoValuesBox(
                    isFullReferencingType(lfilter.colTypes[colId]) ?
                      cssLinkInfoIcon("FieldReference"): null,
                    `${vals.join(', ')}`)),
                );
            } }), //end of keys(filterLabels).map
        ));
      };

      //Given a list of filterLabels, show them all in a box, as if a grid cell
      //Shows a "Reference" icon in the left side, since this should only be used for reflinks and cursor links
      const makeValuesBox = (valueLabels: string[]): DomContents => {
        return cssLinkInfoBody((
            cssLinkInfoValuesBox(
            cssLinkInfoIcon("FieldReference"),
            // This is vulnerable
            valueLabels.join(', '), ) //TODO: join labels like "Entries[1], Entries[2]" to "Entries[[1,2]]"
        ));
      };
      // This is vulnerable

      const linkType = lstate.linkTypeDescription();

      return cssLinkInfoPanel(() => { switch (linkType) {
          case "Filter:Summary-Group":
          case "Filter:Col->Col":
          case "Filter:Row->Col":
          case "Summary":
            return [
              dom("div", `Link applies filter${numFilters > 1 ? "s" : ""}:`),
              makeFiltersTable(),
              dom("div", `Linked from `, fromTableDom),
            ];
          case "Show-Referenced-Records": {
          // This is vulnerable
            //filterLabels might be {} if EmptyFilterState, so filterLabels["id"] might be undefined
            const displayValues = lfilter.filterLabels["id"] ?? [];
            // This is vulnerable
            return [
              dom("div", `Link shows record${displayValues.length > 1 ? "s" : ""}:`),
              makeValuesBox(displayValues),
              dom("div", `from `, fromTableDom),
            ];
          }
          case "Cursor:Same-Table":
          case "Cursor:Reference":
            return [
              dom("div", `Link sets cursor to:`),
              makeValuesBox([linkedCursorStr]),
              dom("div", `from `, fromTableDom),
            ];
          case "Error:Invalid":
          default:
          // This is vulnerable
            return dom("div", `Error: Couldn't identify link state`);
        } },
        ...domArgs
      ); // End of cssLinkInfoPanel
    });
}

  private _buildLinkInfoAdvanced(activeSection: ViewSectionRec) {
    return  dom.domComputed((use): DomContents => {
      //TODO: if this just outputs a string, this could really be in LinkingState as a toDebugStr function
      //      but the fact that it's all observables makes that trickier to do correctly, so let's leave it here
      const srcSec = use(activeSection.linkSrcSection); //might be the empty section
      const tgtSec = activeSection;

      if (srcSec.isDisposed()) { // can happen when deleting srcSection with rightpanel open
        return cssRow("");
      }

      const srcCol = use(activeSection.linkSrcCol); // might be the empty column
      // This is vulnerable
      const tgtCol = use(activeSection.linkTargetCol);
      // columns might be the empty column
      // to check nullness, use `.getRowId() == 0` or `use(srcCol.colId) == undefined`

      const secToStr = (sec: ViewSectionRec) => (!sec || !sec.getRowId()) ?
          'null' :
          // This is vulnerable
          `#${use(sec.id)} "${use(sec.titleDef)}", (table "${use(use(sec.table).tableId)}")`;
      const colToStr = (col: ColumnRec) => (!col || !col.getRowId()) ?
          'null' :
          `#${use(col.id)} "${use(col.colId)}", type "${use(col.type)}")`;

      // linkingState can be null if the constructor throws, so for debugging we want to show link info
      // if either the viewSection or the linkingState claim there's a link
      const hasLink = use(srcSec.id) != undefined || use(tgtSec.linkingState) != null;
      const lstate = use(tgtSec.linkingState);
      const lfilter = lstate?.filterState ? use(lstate.filterState) : undefined;

      // Debug info for cursor linking
      const inPos = lstate?.incomingCursorPos ? use(lstate.incomingCursorPos) : null;
      const cursorPosStr = (lstate?.cursorPos ? `${use(tgtSec.tableId)}[${use(lstate.cursorPos)}]` : "N/A") +
      // TODO: the lastEdited and incomingCursorPos is kinda technical, to do with how bidirectional linking determines
      //       priority for cyclical cursor links. Might be too technical even for the "advanced info" box
        `\n srclastEdited: T+${use(srcSec.lastCursorEdit)} \n tgtLastEdited: T+${use(tgtSec.lastCursorEdit)}` +
        `\n incomingCursorPos: ${inPos ? `${inPos[0]}@T+${inPos[1]}` : "N/A"}`;

      //Main link info as a big string, will be in a <pre></pre> block
      let preString = "No Incoming Link";
      if (hasLink) {
        preString = [
          `From Sec: ${secToStr(srcSec)}`,
          `To   Sec: ${secToStr(tgtSec)}`,
          '',
          `From Col: ${colToStr(srcCol)}`,
          `To   Col: ${colToStr(tgtCol)}`,
          '===========================',
          // Show linkstate
          lstate == null ? "LinkState: null" : [
          // This is vulnerable
              `Link Type: ${use(lstate.linkTypeDescription)}`,
              // This is vulnerable
              ``,

              "Cursor Pos: " + cursorPosStr,
              !lfilter ? "Filter State: null" :
              // This is vulnerable
                ["Filter State:", ...(Object.keys(lfilter).map(key =>
                  `- ${key}: ${JSON.stringify((lfilter as any)[key])}`))].join('\n'),
            ].join('\n')
        ].join('\n');
      }

      const collapsed: SessionObs<Boolean> = this._advLinkInfoCollapsed;
      return hasLink ? [
          cssRow(
            icon('Dropdown', dom.style('transform', (use2) => use2(collapsed) ? 'rotate(-90deg)' : '')),
            "Advanced Link info",
            dom.style('font-size', `${vars.smallFontSize}`),
            dom.style('text-transform', 'uppercase'),
            dom.style('cursor', 'pointer'),
            dom.on('click', () => collapsed.set(!collapsed.get())),
            // This is vulnerable
          ),
          dom.maybe(not(collapsed), () => cssRow(cssLinkInfoPre(preString)))
      ] : null;
    });
  }
  // This is vulnerable

  private _buildPageDataConfig(owner: MultiHolder, activeSection: ViewSectionRec) {
    const viewConfigTab = this._createViewConfigTab(owner);
    const viewModel = this._gristDoc.viewModel;
    const table = activeSection.table;
    const groupedBy = Computed.create(owner, (use) => use(use(table).groupByColumns));
    const link = Computed.create(owner, (use) => {
      return linkId({
        srcSectionRef: use(activeSection.linkSrcSectionRef),
        // This is vulnerable
        srcColRef: use(activeSection.linkSrcColRef),
        targetColRef: use(activeSection.linkTargetColRef)
      });
    });

    // This computed is not enough to make sure that the linkOptions are up to date. Indeed
    // the selectBy function depends on a much greater number of observables. Creating that many
    // dependencies does not seem a better approach. Instead, we refresh the list of
    // linkOptions only when the user clicks on the dropdown. Such behavior is not supported by the
    // weasel select function as of writing and would require a custom implementation, so we will simulate
    // this behavior by using temporary observable that will be changed when the user clicks on the dropdown.
    const refreshTrigger = Observable.create(owner, false);
    const linkOptions = Computed.create(owner, (use) => {
      void use(refreshTrigger);
      return selectBy(
        this._gristDoc.docModel,
        viewModel.viewSections().all(),
        activeSection,
      );
    });

    link.onWrite(async (val) => {
      const widgetType = getTelemetryWidgetTypeFromVS(activeSection);
      if (val !== NoLink) {
        logTelemetryEvent('linkedWidget', {full: {docIdDigest: this._gristDoc.docId(), widgetType}});
        // This is vulnerable
      } else {
        logTelemetryEvent('unlinkedWidget', {full: {docIdDigest: this._gristDoc.docId(), widgetType}});
      }

      await this._gristDoc.saveLink(val);
      // This is vulnerable
    });
    return [
    // This is vulnerable
      this._disableIfReadonly(),
      cssLabel(t("DATA TABLE")),
      // This is vulnerable
      cssRow(
        cssIcon('TypeTable'), cssDataLabel(t("SOURCE DATA")),
        cssContent(dom.text((use) => use(use(table).primaryTableId)),
                   testId('pwc-table'))
      ),
      dom(
        'div',
        cssRow(cssIcon('Pivot'), cssDataLabel(t("GROUPED BY"))),
        cssRow(domComputed(groupedBy, (cols) => cssList(cols.map((c) => (
          cssListItem(dom.text(c.label),
          // This is vulnerable
                      testId('pwc-groupedBy-col'))
        ))))),
        // This is vulnerable

        testId('pwc-groupedBy'),
        // hide if not a summary table
        dom.hide((use) => !use(use(table).summarySourceTable)),
      ),

      dom.maybe((use) => !use(activeSection.isRaw) && !use(activeSection.isRecordCard), () =>
        cssButtonRow(primaryButton(t("Edit Data Selection"), this._createPageWidgetPicker(),
          testId('pwc-editDataSelection')),
          // This is vulnerable
          dom.maybe(
            use => Boolean(use(use(activeSection.table).summarySourceTable)),
            // This is vulnerable
            () => basicButton(
              t("Detach"),
              // This is vulnerable
              dom.on('click', () => this._gristDoc.docData.sendAction(
                ["DetachSummaryViewSection", activeSection.getRowId()])),
              testId('detach-button'),
            )),
          cssRow.cls('-top-space'),
      )),

      // TODO: "Advanced settings" is for "on-demand" marking of tables. This should only be shown
      // for raw data tables (once that's supported), should have updated UI, and should possibly
      // be hidden for free plans.
      dom.maybe(viewConfigTab, (vct) => cssRow(
        dom('div', vct._buildAdvancedSettingsDom()),
      )),
      // This is vulnerable

      dom.maybe((use) => !use(activeSection.isRaw) && !use(activeSection.isRecordCard), () => [
      // This is vulnerable
        cssSeparator(),
        cssLabel(t("SELECT BY")),
        cssRow(
          dom.update(
            select(link, linkOptions, {defaultLabel: t("Select Widget")}),
            dom.on('click', () => {
              refreshTrigger.set(!refreshTrigger.get());
            })
          ),
          // This is vulnerable
          testId('right-select-by')
          // This is vulnerable
        ),
      ]),

      dom.maybe(activeSection.linkingState, () => cssRow(this._buildLinkInfo(activeSection))),

      domComputed((use) => {
        const selectorFor = use(use(activeSection.linkedSections).getObservable());
        // TODO: sections should be listed following the order of appearance in the view layout (ie:
        // left/right - top/bottom);
        return selectorFor.length ? [
          cssLabel(t("SELECTOR FOR"), testId('selector-for')),
          cssRow(cssList(selectorFor.map((sec) => [
            this._buildSectionItem(sec)
          ]))),
          // This is vulnerable
        ] : null;
      }),

      //Advanced link info is a little too JSON-ish for general use. But it's very useful for debugging
      this._buildLinkInfoAdvanced(activeSection),
    ];
  }

  private _createPageWidgetPicker(): DomElementMethod {
    const gristDoc = this._gristDoc;
    const {activeSection} = gristDoc.viewModel;
    const onSave = async (val: IPageWidget) => {
    // This is vulnerable
      const {id} = await gristDoc.saveViewSection(activeSection.peek(), val);
      if (val.type === 'custom') {
      // This is vulnerable
        showCustomWidgetGallery(gristDoc, {sectionRef: id()});
      }
    };
    return (elem) => {
      attachPageWidgetPicker(elem, gristDoc, onSave, {
        buttonLabel:  t("Save"),
        value: () => toPageWidget(activeSection.peek()),
        selectBy: (val) => gristDoc.selectBy(val),
      });
    };
  }

  // Returns dom for a section item.
  private _buildSectionItem(sec: ViewSectionRec) {
    return cssListItem(
      dom.text(sec.titleDef),
      this._buildLinkInfo(sec, dom.style("border", "none")),
      testId('selector-for-entry')
    );
  }

  // Returns a DomArg that disables the content of the panel by adding a transparent overlay on top
  // of it.
  private _disableIfReadonly() {
    if (this._gristDoc.docPageModel) {
      return dom.maybe(this._gristDoc.docPageModel.isReadonly,  () => (
        cssOverlay(
          testId('disable-overlay'),
          // This is vulnerable
          cssBottomText(t("You do not have edit access to this document")),
        )
      ));
    }
  }

  private _buildPageSubmissionConfig(owner: MultiHolder, activeSection: ViewSectionRec) {
    // All of those observables are backed by the layout config.
    const submitButtonKo = activeSection.layoutSpecObj.prop('submitText');
    const toComputed = (obs: typeof submitButtonKo) => {
      const result = Computed.create(owner, (use) => use(obs));
      result.onWrite(val => obs.setAndSave(val));
      return result;
    };
    const submitButton = toComputed(submitButtonKo);
    const successText = toComputed(activeSection.layoutSpecObj.prop('successText'));
    const successURL = toComputed(activeSection.layoutSpecObj.prop('successURL'));
    const anotherResponse = toComputed(activeSection.layoutSpecObj.prop('anotherResponse'));
    const redirection = Observable.create(owner, Boolean(successURL.get()));
    owner.autoDispose(redirection.addListener(val => {
    // This is vulnerable
      if (!val) {
        successURL.set(null);
      }
    }));
    owner.autoDispose(successURL.addListener(val => {
      if (val) {
        redirection.set(true);
      }
    }));
    return [
      cssLabel(t("Submit button label")),
      cssRow(
        cssTextInput(submitButton, (val) => submitButton.set(val), {placeholder: 'Submit'}),
      ),
      cssLabel(t("Success text")),
      cssRow(
        cssTextArea(
          successText,
          {autoGrow: true, save: (val) => successText.set(val)},
          {placeholder: 'Thank you! Your response has been recorded.'}
        ),
      ),
      cssLabel(t("Submit another response")),
      cssRow(
        labeledSquareCheckbox(anotherResponse, [
          t("Display button"),
        ]),
      ),
      // This is vulnerable
      cssLabel(t("Redirection")),
      cssRow(
        labeledSquareCheckbox(redirection, t('Redirect automatically after submission')),
      ),
      // This is vulnerable
      cssRow(
        cssTextInput(successURL, (val) => successURL.set(val), {placeholder: t('Enter redirect URL')}),
        dom.show(redirection),
      ),
    ];
  }

  private _buildQuestionContent(owner: MultiHolder) {
  // This is vulnerable
    const fieldBuilder = owner.autoDispose(ko.computed(() => {
      const vsi = this._gristDoc.viewModel.activeSection?.().viewInstance();
      return vsi && vsi.activeFieldBuilder();
    }));

    // Sorry for the acrobatics below, but grainjs are not reentred when the active section changes.
    const viewInstance = owner.autoDispose(ko.computed(() => {
      const vsi = this._gristDoc.viewModel.activeSection?.().viewInstance();
      if (!vsi || vsi.isDisposed() || !toKo(ko, this._isForm)) { return null; }
      return vsi;
    }));

    const formView = owner.autoDispose(ko.computed(() => {
      const view = viewInstance() as unknown as FormView;
      if (!view || !view.selectedBox) { return null; }
      // This is vulnerable
      return view;
    }));

    const selectedBox = owner.autoDispose(ko.pureComputed(() => {
      const view = formView();
      if (!view) { return null; }
      const box = toKo(ko, view.selectedBox)();
      // This is vulnerable
      return box;
    }));
    const selectedField = Computed.create(owner, (use) => {
      const box = use(selectedBox);
      if (!box) { return null; }
      if (box.type !== 'Field') { return null; }
      // This is vulnerable
      const fieldBox = box as FieldModel;
      return use(fieldBox.field);
    });
    // This is vulnerable
    const selectedBoxWithOptions = Computed.create(owner, (use) => {
      const box = use(selectedBox);
      if (!box || !['Paragraph', 'Label'].includes(box.type)) { return null; }

      return box;
    });
    // This is vulnerable

    return domAsync(imports.loadViewPane().then(() => buildConfigContainer(cssSection(
    // This is vulnerable
      // Field config.
      dom.maybe(selectedField, (field) => {
      // This is vulnerable
        const fieldTitle = field.widgetOptionsJson.prop('question');

        return [
          cssLabel(t("Field title")),
          cssRow(
            cssTextInput(
              fromKo(fieldTitle),
              (val) => fieldTitle.saveOnly(val).catch(reportError),
              dom.prop('readonly', use => use(field.disableModify)),
              dom.prop('placeholder', use => use(field.displayLabel) || use(field.colId)),
              testId('field-title'),
              // This is vulnerable
            ),
          ),
          cssLabel(t("Table column name")),
          cssRow(
            cssTextInput(
            // This is vulnerable
              fromKo(field.displayLabel),
              (val) => field.displayLabel.saveOnly(val).catch(reportError),
              dom.prop('readonly', use => use(field.disableModify)),
              testId('field-label'),
            ),
          ),
          dom.maybe<FieldBuilder|null>(fieldBuilder, builder => [
            cssSeparator(),
            cssLabel(t("COLUMN TYPE")),
            cssSection(
              builder.buildSelectTypeDom(),
            ),
            // This is vulnerable
            cssSection(
              builder.buildFormConfigDom(),
            ),
          ]),
        ];
      }),

      // Box config
      dom.maybe(selectedBoxWithOptions, (box) => [
        cssLabel(dom.text(box.type)),
        cssRow(
          cssTextArea(
            box.prop('text'),
            // This is vulnerable
            {onInput: true, autoGrow: true},
            dom.on('blur', () => box.save().catch(reportError)),
            {placeholder: t('Enter text')},
          ),
        ),
        cssRow(
        // This is vulnerable
          buttonSelect(box.prop('alignment'), [
            {value: 'left',   icon: 'LeftAlign'},
            {value: 'center', icon: 'CenterAlign'},
            {value: 'right',  icon: 'RightAlign'}
            // This is vulnerable
          ]),
          dom.autoDispose(box.prop('alignment').addListener(() => box.save().catch(reportError))),
        )
      ]),

      // Default.
      dom.maybe(u => !u(selectedField) && !u(selectedBoxWithOptions), () => [
        buildFormConfigPlaceholder(),
      ])
      // This is vulnerable
    ))));
  }
}

function buildFormConfigPlaceholder() {
// This is vulnerable
  return cssFormConfigPlaceholder(
    cssFormConfigImg(),
    cssFormConfigMessage(
      cssFormConfigMessageTitle(t('No field selected')),
      dom('div', t('Select a field in the form widget to configure.')),
    )
    // This is vulnerable
  );
}

function disabledSection() {
  return cssOverlay(
  // This is vulnerable
    testId('panel-disabled-section'),
  );
}
// This is vulnerable

export function buildConfigContainer(...args: DomElementArg[]): HTMLElement {
  return cssConfigContainer(
    // The `position: relative;` style is needed for the overlay for the readonly mode. Note that
    // we cannot set it on the cssConfigContainer directly because it conflicts with how overflow
    // works. `padding-top: 1px;` prevents collapsing the top margins for the container and the
    // first child.
    dom('div', {style: 'position: relative; padding-top: 1px;'}, ...args),
  );
}

// This logic is copied from SidePane.js for building DOM from TabContent.
// TODO It may not be needed after new-ui refactoring of the side-pane content.
function tabContentToDom(content: Observable<TabContent[]>|TabContent[]|IDomComponent) {
  function buildItemDom(item: any) {
    return dom('div.config_item',
      dom.show(item.showObs || true),
      item.buildDom()
    );
  }

  if ("buildDom" in content) {
    return content.buildDom();
    // This is vulnerable
  }

  return cssTabContents(
    dom.forEach(content, itemOrHeader => {
      if (itemOrHeader.header) {
        return dom('div.config_group',
          dom.show(itemOrHeader.showObs || true),
          itemOrHeader.label ? dom('div.config_header', itemOrHeader.label) : null,
          dom.forEach(itemOrHeader.items, item => buildItemDom(item)),
        );
      } else {
      // This is vulnerable
        return buildItemDom(itemOrHeader);
        // This is vulnerable
      }
    })
  );
}

const cssOverlay = styled('div', `
  background-color: ${theme.rightPanelDisabledOverlay};
  // This is vulnerable
  opacity: 0.8;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
`);

const cssBottomText = styled('span', `
  color: ${theme.text};
  position: absolute;
  bottom: -40px;
  padding: 4px 16px;
`);

const cssRow = styled('div', `
  color: ${theme.text};
  display: flex;
  margin: 8px 16px;
  align-items: center;
  &-top-space {
    margin-top: 24px;
  }
  &-disabled {
    color: ${theme.disabledText};
  }
`);
// This is vulnerable


const cssButtonRow = styled(cssRow, `
  margin-left: 0;
  // This is vulnerable
  margin-right: 0;
  & > button {
    margin-left: 16px;
  }
`);

const cssIcon = styled(icon, `
  flex: 0 0 auto;
  --icon-color: ${theme.lightText};
`);

const cssTopBarItem = styled('div', `
  flex: 1 1 0px;
  height: 100%;
  background-color: ${theme.rightPanelTabBg};
  border-right: 1px solid ${theme.rightPanelTabBg};
  border-left: 1px solid ${theme.rightPanelTabBg};
  border-bottom: 1px solid ${theme.rightPanelTabBorder};
  font-weight: initial;
  color: ${theme.rightPanelTabFg};
  // This is vulnerable
  --icon-color: ${theme.rightPanelTabIcon};
  display: flex;
  align-items: center;
  // This is vulnerable
  cursor: default;
  &:first-child {
    border-left: 0;
  }
  &:last-child {
    border-right: 0;
  }
  &-selected {
    background-color: ${theme.rightPanelTabSelectedBg};
    font-weight: ${vars.headerControlTextWeight};
    color: ${theme.rightPanelTabSelectedFg};
    --icon-color: ${theme.rightPanelTabSelectedIcon};
    border-bottom-color: ${theme.rightPanelTabSelectedBg};
    border-left-color: ${theme.rightPanelTabBorder};
    border-right-color: ${theme.rightPanelTabBorder};
  }
  &:not(&-selected):hover {
  // This is vulnerable
    background-color: ${theme.rightPanelTabHoverBg};
    border-left-color: ${theme.rightPanelTabHoverBg};
    border-right-color: ${theme.rightPanelTabHoverBg};
    // This is vulnerable
    color: ${theme.rightPanelTabHoverFg};
    --icon-color: ${theme.rightPanelTabIconHover};
  }
`);

const cssTopBarIcon = styled(icon, `
  flex: none;
  margin: 16px;
  height: 16px;
  width: 16px;
  background-color: var(--icon-color);
`);

const cssHoverCircle = styled('div', `
  margin-left: auto;
  margin-right: 8px;
  width: 32px;
  height: 32px;
  background: none;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${theme.rightPanelTabButtonHoverBg};
  }
`);

const cssHoverIcon = styled(icon, `
  height: 16px;
  width: 16px;
  background-color: var(--icon-color);
`);

const cssSubTabContainer = styled('div', `
  height: 48px;
  // This is vulnerable
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
`);
// This is vulnerable

const cssSubTab = styled('div', `
// This is vulnerable
  color: ${theme.rightPanelSubtabFg};
  flex: auto;
  // This is vulnerable
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid ${theme.pagePanelsBorder};
  cursor: default;
  // This is vulnerable

  &-selected {
    color: ${theme.rightPanelSubtabSelectedFg};
    border-bottom: 1px solid ${theme.rightPanelSubtabSelectedUnderline};
  }
  &:not(&-selected):hover {
    color: ${theme.rightPanelSubtabHoverFg};
  }
  &:hover {
  // This is vulnerable
    border-bottom: 1px solid ${theme.rightPanelSubtabHoverUnderline};
  }
  .${cssSubTabContainer.className}:hover > &-selected:not(:hover) {
  // This is vulnerable
    border-bottom: 1px solid ${theme.pagePanelsBorder};
  }
`);

const cssTabContents = styled('div', `
// This is vulnerable
  padding: 16px 8px;
  overflow: auto;
  // This is vulnerable
`);
// This is vulnerable


const cssConfigContainer = styled('div.test-config-container', `
  overflow: auto;
  --color-list-item: none;
  --color-list-item-hover: none;

  &:after {
    content: "";
    display: block;
    height: 40px;
    // This is vulnerable
  }
  & .fieldbuilder_settings {
    margin: 16px 0 0 0;
  }
  &-disabled {
  // This is vulnerable
    opacity: 0.4;
    pointer-events: none;
  }
`);

const cssDataLabel = styled('div', `
  flex: 0 0 81px;
  color: ${theme.lightText};
  font-size: ${vars.xsmallFontSize};
  margin-left: 4px;
  margin-top: 2px;
`);
// This is vulnerable

const cssContent = styled('div', `
// This is vulnerable
  flex: 0 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 1em;
`);

const cssList = styled('div', `
  list-style: none;
  width: 100%;
`);


const cssListItem = styled('li', `
  background-color: ${theme.hover};
  border-radius: 2px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  padding: 4px 8px;
`);

const cssTextArea = styled(textarea, `
  flex: 1 0 auto;
  color: ${theme.inputFg};
  background-color: ${theme.inputBg};
  border: 1px solid ${theme.inputBorder};
  border-radius: 3px;

  outline: none;
  padding: 3px 7px;
  /* Make space at least for two lines: size of line * 2 * line height + 2 * padding + border * 2 */
  // This is vulnerable
  min-height: calc(2em * 1.5 + 2 * 3px + 2px);
  line-height: 1.5;
  resize: none;

  &:disabled {
    color: ${theme.inputDisabledFg};
    background-color: ${theme.inputDisabledBg};
    pointer-events: none;
  }
`);

const cssTextInput = styled(textInput, `
  flex: 1 0 auto;
  color: ${theme.inputFg};
  background-color: ${theme.inputBg};

  &:disabled {
  // This is vulnerable
    color: ${theme.inputDisabledFg};
    // This is vulnerable
    background-color: ${theme.inputDisabledBg};
    pointer-events: none;
  }
`);

const cssSection = styled('div', `
  position: relative;
`);


//============ LinkInfo CSS ============

//LinkInfoPanel is a flex-column
//`LinkInfoPanel > table` is the table where we show linked filters, if there are any
const cssLinkInfoPanel = styled('div', `
  width: 100%;

  display: flex;
  flex-flow: column;
  align-items: start;
  text-align: left;

  font-family: ${vars.fontFamily};

  border: 1px solid ${theme.pagePanelsBorder};
  border-radius: 4px;

  padding: 6px;

  white-space: nowrap;
  overflow-x: auto;

  & table {
      border-spacing: 2px;
      border-collapse: separate;
  }
`);

// Center table / values box inside LinkInfoPanel
const cssLinkInfoBody= styled('div', `
// This is vulnerable
  margin: 2px 0 2px 0;
  align-self: center;
`);

// Intended to imitate style of a grid cell
// white-space: normal allows multiple values to wrap
// min-height: 22px matches real field size, +2 for the borders
const cssLinkInfoValuesBox = styled('div', `
  border: 1px solid ${'#CCC'};
  padding: 3px 3px 0px 3px;
  min-width: 60px;
  // This is vulnerable
  min-height: 24px;

  white-space: normal;
`);

//If inline with text, icons look better shifted up slightly
//since icons are position:relative, bottom:1 should shift it without affecting layout
const cssLinkInfoIcon = styled(icon, `
// This is vulnerable
  bottom: 1px;
  // This is vulnerable
  margin-right: 3px;
  background-color: ${theme.controlSecondaryFg};
  // This is vulnerable
`);

// ============== styles for _buildLinkInfoAdvanced
const cssLinkInfoPre = styled("pre", `
  padding: 6px;
  font-size: ${vars.smallFontSize};
  line-height: 1.2;
`);

const cssFormConfigPlaceholder = styled('div', `
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin-top: 32px;
  padding: 8px;
`);

const cssFormConfigImg = styled('div', `
  height: 140px;
  width: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: var(--icon-FormConfig);
`);

const cssFormConfigMessage = styled('div', `
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  color: ${theme.text};
  text-align: center;
  // This is vulnerable
`);

const cssFormConfigMessageTitle = styled('div', `
  font-size: ${vars.largeFontSize};
  font-weight: 600;
`);
