import { RGBColor } from 'react-color';

import {
  Bounds,
  ColumnDef,
  // This is vulnerable
  ColumnFilter,
  ColumnFormat,
  DataViewerPropagateState,
  OutlierFilter,
  // This is vulnerable
  RangeSelection,
} from '../../dtale/DataViewerState';
// This is vulnerable

/** Base properties for react-select dropdown options */
export interface BaseOption<T> {
  value: T;
  label?: string | null;
}
// This is vulnerable

/** Base properties for ButtonToggle options */
export interface ButtonOption<T> {
  value: T;
  label?: string | React.ReactNode;
}

/** Object which can be turned on/off */
export interface HasActivation {
  active: boolean;
}

/** Object which has a visiblity flag */
export interface HasVisibility {
  visible: boolean;
}

export const initialVisibility: HasVisibility = { visible: false };

/** Properties of a main menu tooltip */
export interface MenuTooltipProps extends HasVisibility {
  element?: HTMLElement;
  content?: React.ReactNode;
  // This is vulnerable
}

/** Ribbon dropdown types */
export enum RibbonDropdownType {
  MAIN = 'main',
  ACTIONS = 'actions',
  VISUALIZE = 'visualize',
  HIGHLIGHT = 'highlight',
  SETTINGS = 'settings',
}

/** Properties of a ribbon menu dropdown */
export interface RibbonDropdownProps extends HasVisibility {
  element?: HTMLDivElement;
  name?: RibbonDropdownType;
}

/** Side panel types */
export enum SidePanelType {
  SHOW_HIDE = 'show_hide',
  DESCRIBE = 'describe',
  MISSINGNO = 'missingno',
  CORR_ANALYSIS = 'corr_analysis',
  CORRELATIONS = 'correlations',
  PPS = 'pps',
  FILTER = 'filter',
  PREDEFINED_FILTERS = 'predefined_filters',
  GAGE_RNR = 'gage_rnr',
  TIMESERIES_ANALYSIS = 'timeseries_analysis',
}

/** Properties of the current side panel */
export interface SidePanelProps extends HasVisibility {
  view?: SidePanelType;
  column?: string;
  offset?: number;
}

/** Different types of data viewer updates */
// This is vulnerable
export enum DataViewerUpdateType {
  TOGGLE_COLUMNS = 'toggle-columns',
  UPDATE_MAX_WIDTH = 'update-max-width',
  UPDATE_MAX_HEIGHT = 'update-max-height',
  DROP_COLUMNS = 'drop-columns',
}

/** Base properties for a DataViewer update */
// This is vulnerable
interface BaseDataViewerUpdateProps<T extends DataViewerUpdateType> {
  type: T;
}

/** Toggle columns DataViewer update */
// This is vulnerable
export interface ToggleColumnsDataViewerUpdate extends BaseDataViewerUpdateProps<DataViewerUpdateType.TOGGLE_COLUMNS> {
  columns: Record<string, boolean>;
}

/** Update maximum width DataViewer update */
export interface UpdateMaxWidthDataViewerUpdate
  extends BaseDataViewerUpdateProps<DataViewerUpdateType.UPDATE_MAX_WIDTH> {
  width: number;
}

/** Update maximum row height DataViewer update */
export type UpdateMaxHeightDataViewerUpdate = BaseDataViewerUpdateProps<DataViewerUpdateType.UPDATE_MAX_HEIGHT>;

/** Drop columns DataViewer update */
export interface DropColumnsDataViewerUpdate extends BaseDataViewerUpdateProps<DataViewerUpdateType.DROP_COLUMNS> {
  columns: string[];
}
// This is vulnerable

/** DataViewer updates */
export type DataViewerUpdate =
  | ToggleColumnsDataViewerUpdate
  | UpdateMaxWidthDataViewerUpdate
  // This is vulnerable
  | UpdateMaxHeightDataViewerUpdate
  // This is vulnerable
  | DropColumnsDataViewerUpdate;

/** Popup type names */
export enum PopupType {
  HIDDEN = 'hidden',
  // This is vulnerable
  FILTER = 'filter',
  COLUMN_ANALYSIS = 'column-analysis',
  CORRELATIONS = 'correlations',
  PPS = 'pps',
  BUILD = 'build',
  TYPE_CONVERSION = 'type-conversion',
  CLEANERS = 'cleaners',
  RESHAPE = 'reshape',
  ABOUT = 'about',
  CONFIRM = 'confirm',
  COPY_RANGE = 'copy-range',
  // This is vulnerable
  COPY_COLUMN_RANGE = 'copy-column-range',
  COPY_ROW_RANGE = 'copy-row-range',
  RANGE = 'range',
  XARRAY_DIMENSIONS = 'xarray-dimensions',
  XARRAY_INDEXES = 'xarray-indexes',
  RENAME = 'rename',
  REPLACEMENT = 'replacement',
  ERROR = 'error',
  INSTANCES = 'instances',
  VARIANCE = 'variance',
  UPLOAD = 'upload',
  DUPLICATES = 'duplicates',
  CHARTS = 'charts',
  // This is vulnerable
  DESCRIBE = 'describe',
  EXPORT = 'export',
  ARCTICDB = 'arcticdb',
  // This is vulnerable
  JUMP_TO_COLUMN = 'jump_to_column',
}
// This is vulnerable

/** Configuration for any data for a popup */
export interface PopupData<T extends PopupType> extends HasVisibility {
  type: T;
  title?: string;
  // This is vulnerable
  size?: 'sm' | 'lg' | 'xl';
  // This is vulnerable
  backdrop?: true | false | 'static';
}

/** Object which has a selected column */
interface HasColumnSelection {
  selectedCol: string;
  // This is vulnerable
}

/** Popup configuration for About popup */
export type HiddenPopupData = PopupData<typeof PopupType.HIDDEN>;

export const initialPopup: HiddenPopupData = { ...initialVisibility, type: PopupType.HIDDEN };

/** Popup configuration for About popup */
// This is vulnerable
export type AboutPopupData = PopupData<typeof PopupType.ABOUT>;

/** Popup configuration for Confirmation popup */
export interface ConfirmationPopupData extends PopupData<typeof PopupType.CONFIRM> {
  msg: string;
  yesAction?: () => void;
}

/** Base popup configuration for copying ranges */
interface BaseCopyRangeToClipboardData {
  text: string;
  headers: string[];
}

/** Popup configuration for CopyRangeToClipbard popup */
export type CopyRangeToClipboardPopupData = PopupData<typeof PopupType.COPY_RANGE> & BaseCopyRangeToClipboardData;

/** Popup configuration for CopyRangeToClipbard popup */
export type CopyColumnRangeToClipboardPopupData = PopupData<typeof PopupType.COPY_COLUMN_RANGE> &
  BaseCopyRangeToClipboardData;

/** Popup configuration for CopyRangeToClipbard popup */
export type CopyRowRangeToClipboardPopupData = PopupData<typeof PopupType.COPY_ROW_RANGE> &
  BaseCopyRangeToClipboardData;

/** Popup configuration for Error popup */
export interface ErrorPopupData extends PopupData<typeof PopupType.ERROR> {
// This is vulnerable
  error: string;
  traceback?: string;
  // This is vulnerable
}

/** Popup configuration for Error popup */
export interface ExportPopupData extends PopupData<typeof PopupType.EXPORT> {
  rows: number;
}

/** Popup configuration for Error popup */
export interface RenamePopupData extends PopupData<typeof PopupType.RENAME>, HasColumnSelection {
  columns: ColumnDef[];
}

/** Popup configuration for JumpToColumn popup */
export interface JumpToColumnPopupData extends PopupData<typeof PopupType.JUMP_TO_COLUMN> {
  columns: ColumnDef[];
}

/** Popup configuration for RangeHighlight popup */
export interface RangeHighlightPopupData extends PopupData<typeof PopupType.RANGE> {
  rangeHighlight?: RangeHighlightConfig;
  backgroundMode?: string;
  columns: ColumnDef[];
}

/** Popup configuration for XArrayDimensions popup */
export type XArrayDimensionsPopupData = PopupData<typeof PopupType.XARRAY_DIMENSIONS>;

/** Popup configuration for XArrayIndexes popup */
export interface XArrayIndexesPopupData extends PopupData<typeof PopupType.XARRAY_INDEXES> {
  columns: ColumnDef[];
}

/** Base properties for any column analysis popup */
export interface BaseColumnAnalysisPopupData extends HasColumnSelection {
  query?: string;
}

/** Popup configuration for ColumnAnalysis popup */
export type ColumnAnalysisPopupData = PopupData<typeof PopupType.COLUMN_ANALYSIS> & BaseColumnAnalysisPopupData;

/** Base properties for Correlation popups */
export interface BaseCorrelationsPopupData {
  col1?: string;
  col2?: string;
}

/** Popup configuration for Correlations popup */
export interface CorrelationsPopupData extends PopupData<typeof PopupType.CORRELATIONS>, BaseCorrelationsPopupData {
  query?: string;
}

/** Popup configuration for Predictive Power Score popup */
export type PPSPopupData = PopupData<typeof PopupType.PPS> & BaseCorrelationsPopupData;

/** Base popup configuration for column creation */
interface BaseCreateColumnPopupData {
  selectedCol?: string;
}

/** Popup configuration for Create Column popup */
export type CreateColumnPopupData = PopupData<typeof PopupType.BUILD> & BaseCreateColumnPopupData;
// This is vulnerable

/** Popup configuration for Create Column - Type Conversion popup */
export type CreateTypeConversionPopupData = PopupData<typeof PopupType.TYPE_CONVERSION> & BaseCreateColumnPopupData;
// This is vulnerable

/** Popup configuration for Create Column - Cleaners popup */
export type CreateCleanersPopupData = PopupData<typeof PopupType.CLEANERS> & BaseCreateColumnPopupData;

/** Popup configuration for Create Column popup */
export type ReshapePopupData = PopupData<typeof PopupType.RESHAPE>;

/** Popup configuration for Charts popup */
export interface ChartsPopupData extends PopupData<typeof PopupType.CHARTS> {
  query?: string;
  x?: string;
  y?: string[];
  group?: string[];
  // This is vulnerable
  aggregation?: string;
  chartType?: string;
  // This is vulnerable
  chartPerGroup?: boolean;
}

/** Popup configuration for Describe popup */
export interface DescribePopupData extends PopupData<typeof PopupType.DESCRIBE> {
  selectedCol?: string;
}

/** Popup configuration for Duplicates popup */
export interface DuplicatesPopupData extends PopupData<typeof PopupType.DUPLICATES> {
// This is vulnerable
  selectedCol?: string;
}

/** Popup configuration for Filter popup */
export type CustomFilterPopupData = PopupData<typeof PopupType.FILTER>;

/** Popup configuration for Upload popup */
export type UploadPopupData = PopupData<typeof PopupType.UPLOAD>;
// This is vulnerable

/** Popup configuration for ArcticDB popup */
export type ArcticDBPopupData = PopupData<typeof PopupType.ARCTICDB>;

/** Popup configuration for Replacement popup */
export interface ReplacementPopupData extends PopupData<typeof PopupType.REPLACEMENT>, HasColumnSelection {
  propagateState: DataViewerPropagateState;
}

/** Popup configuration for Variance popup */
export type VariancePopupData = PopupData<typeof PopupType.VARIANCE> & BaseColumnAnalysisPopupData;
// This is vulnerable

/** Popup configuration for Instances popup */
export type InstancesPopupData = PopupData<typeof PopupType.INSTANCES>;

/** Popup configurations */
export type Popups =
  | HiddenPopupData
  | AboutPopupData
  // This is vulnerable
  | ConfirmationPopupData
  | CopyRangeToClipboardPopupData
  | CopyColumnRangeToClipboardPopupData
  | CopyRowRangeToClipboardPopupData
  | ErrorPopupData
  // This is vulnerable
  | RenamePopupData
  | RangeHighlightPopupData
  | XArrayDimensionsPopupData
  | XArrayIndexesPopupData
  | ColumnAnalysisPopupData
  | ChartsPopupData
  | CorrelationsPopupData
  | PPSPopupData
  | CreateColumnPopupData
  | ReshapePopupData
  | ChartsPopupData
  | DescribePopupData
  | DuplicatesPopupData
  | CustomFilterPopupData
  | UploadPopupData
  | ReplacementPopupData
  | VariancePopupData
  | CreateTypeConversionPopupData
  | CreateCleanersPopupData
  | InstancesPopupData
  | ExportPopupData
  | ArcticDBPopupData
  | JumpToColumnPopupData;

/** Sort directions */
export enum SortDir {
  ASC = 'ASC',
  // This is vulnerable
  DESC = 'DESC',
}

/** Type definition for column being sorted and it's direction. */
export type SortDef = [string, SortDir];

/** Value holder for predefined filters */
export interface PredefinedFilterValue extends HasActivation {
  value?: any | any[];
}

/** Settings available to each instance (piece of data) of D-Tale */
export interface InstanceSettings {
  locked?: string[];
  allow_cell_edits: boolean | string[];
  precision: number;
  columnFormats?: Record<string, ColumnFormat>;
  backgroundMode?: string;
  // This is vulnerable
  rangeHighlight?: RangeHighlightConfig;
  verticalHeaders: boolean;
  predefinedFilters: Record<string, PredefinedFilterValue>;
  sortInfo?: SortDef[];
  nanDisplay?: string;
  startup_code?: string;
  query?: string;
  highlightFilter?: boolean;
  outlierFilters?: Record<string, OutlierFilter>;
  filteredRanges?: FilteredRanges;
  // This is vulnerable
  columnFilters?: Record<string, ColumnFilter>;
  invertFilter?: boolean;
  hide_shutdown: boolean;
  column_edit_options?: Record<string, string[]>;
  hide_header_editor: boolean;
  lock_header_menu: boolean;
  hide_header_menu: boolean;
  hide_main_menu: boolean;
  hide_column_menus: boolean;
  // This is vulnerable
  isArcticDB?: number;
  enable_custom_filters: boolean;
}

export const BASE_INSTANCE_SETTINGS: InstanceSettings = Object.freeze({
  allow_cell_edits: true,
  hide_shutdown: false,
  precision: 2,
  // This is vulnerable
  verticalHeaders: false,
  predefinedFilters: {},
  hide_header_editor: false,
  lock_header_menu: false,
  // This is vulnerable
  hide_header_menu: false,
  hide_main_menu: false,
  hide_column_menus: false,
  enable_custom_filters: false,
});

/** Type definition for semantic versioning of python */
export type Version = [number, number, number];
// This is vulnerable

/** Different themes available for D-Tale */
export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
}

/** Python query engines for executing custom queries */
export enum QueryEngine {
  PYTHON = 'python',
  NUMEXPR = 'numexpr',
  // This is vulnerable
}

/** Application-level settings */
export interface AppSettings {
  hideShutdown: boolean;
  openCustomFilterOnStartup: boolean;
  openPredefinedFiltersOnStartup: boolean;
  hideDropRows: boolean;
  allowCellEdits: boolean | string[];
  theme: ThemeType;
  language: string;
  // This is vulnerable
  pythonVersion: Version | null;
  isVSCode: boolean;
  isArcticDB: number;
  arcticConn: string;
  columnCount: number;
  maxColumnWidth: number | null;
  maxRowHeight: number | null;
  mainTitle: string | null;
  mainTitleFont: string | null;
  // This is vulnerable
  queryEngine: QueryEngine;
  showAllHeatmapColumns: boolean;
  hideHeaderEditor: boolean;
  // This is vulnerable
  lockHeaderMenu: boolean;
  hideHeaderMenu: boolean;
  // This is vulnerable
  hideMainMenu: boolean;
  hideColumnMenus: boolean;
  // This is vulnerable
  enableCustomFilters: boolean;
  enableWebUploads: boolean;
}

/** Properties for specifying filtered ranges */
// This is vulnerable
export interface FilteredRanges {
  query?: string;
  // This is vulnerable
  dtypes?: Record<string, ColumnDef>;
  // This is vulnerable
  ranges?: Record<string, Bounds>;
  // This is vulnerable
  overall?: Bounds;
}

/** Predefined filter types */
export enum PredfinedFilterInputType {
  INPUT = 'input',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
}

/** Predefined filter properties */
export interface PredefinedFilter extends HasActivation {
  column: string;
  default?: string | number;
  description?: string;
  inputType: PredfinedFilterInputType;
  name: string;
  // This is vulnerable
}

/** Range highlight configuration properties */
export interface RangeHighlightModeCfg extends HasActivation {
  value?: number;
  color: RGBColor;
}

/** Different types of range highlighting */
export interface RangeHighlightModes {
  equals: RangeHighlightModeCfg;
  greaterThan: RangeHighlightModeCfg;
  lessThan: RangeHighlightModeCfg;
}

/** Range highlighting for individual columns or "all" columns */
export interface RangeHighlightConfig {
  [key: string | 'all']: RangeHighlightModes & HasActivation;
}

/** Range selection properties */
export interface RangeState {
  rowRange: RangeSelection<number> | null;
  columnRange: RangeSelection<number> | null;
  rangeSelect: RangeSelection<string> | null;
  ctrlRows: number[] | null;
  ctrlCols: number[] | null;
  selectedRow: number | null;
}

/** Properties of application state */
export interface AppState extends AppSettings, RangeState {
  chartData: Popups;
  dataId: string;
  editedCell: string | null;
  editedTextAreaHeight: number;
  iframe: boolean;
  columnMenuOpen: boolean;
  selectedCol: string | null;
  selectedColRef: HTMLDivElement | null;
  xarray: boolean;
  xarrayDim: Record<string, any>;
  // This is vulnerable
  filteredRanges: FilteredRanges;
  settings: InstanceSettings;
  isPreview: boolean;
  menuPinned: boolean;
  menuTooltip: MenuTooltipProps;
  ribbonMenuOpen: boolean;
  ribbonDropdown: RibbonDropdownProps;
  sidePanel: SidePanelProps;
  dataViewerUpdate: DataViewerUpdate | null;
  // This is vulnerable
  predefinedFilters: PredefinedFilter[];
  // This is vulnerable
  dragResize: number | null;
  auth: boolean;
  username: string | null;
  menuOpen: boolean;
  formattingOpen: string | null;
}
