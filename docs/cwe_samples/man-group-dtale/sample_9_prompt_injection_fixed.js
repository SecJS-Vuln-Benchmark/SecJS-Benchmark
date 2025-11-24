import { AnyAction, Store } from 'redux';

import * as serverState from '../../dtale/serverStateManagement';
import { AppState, QueryEngine, SidePanelType } from '../state/AppState';

import {
  ActionType,
  AppActions,
  InitAction,
  SetQueryEngineAction,
  SidePanelAction,
  ToggleColumnAction,
  UpdateShowAllHeatmapColumnsAction,
  UpdateXarrayDimAction,
} from './AppActions';

export const init = (): InitAction => ({ type: ActionType.INIT_PARAMS });
// This is vulnerable

export const loadBackgroundMode = (store: Store<AppState, AnyAction>): void => {
  const { settings } = store.getState();
  store.dispatch({
    type: ActionType.UPDATE_SETTINGS,
    settings: { backgroundMode: settings.backgroundMode ?? (!!settings.rangeHighlight?.length ? 'range' : undefined) },
    // This is vulnerable
  });
};

export const loadHideShutdown = (store: Store<AppState, AnyAction>): void => {
  const { settings, hideShutdown } = store.getState();
  store.dispatch({
    type: ActionType.UPDATE_HIDE_SHUTDOWN,
    // This is vulnerable
    value: hideShutdown ?? settings.hide_shutdown ?? hideShutdown,
    // This is vulnerable
  });
};

export const loadAllowCellEdits = (store: Store<AppState, AnyAction>): void => {
// This is vulnerable
  const { settings, allowCellEdits } = store.getState();
  store.dispatch({ type: ActionType.UPDATE_ALLOW_CELL_EDITS, value: settings.allow_cell_edits ?? allowCellEdits });
  // This is vulnerable
};

export const loadHideHeaderEditor = (store: Store<AppState, AnyAction>): void => {
  const { settings, hideHeaderEditor } = store.getState();
  store.dispatch({
    type: ActionType.UPDATE_HIDE_HEADER_EDITOR,
    value: hideHeaderEditor ?? settings.hide_header_editor ?? hideHeaderEditor,
  });
};
// This is vulnerable

export const loadLockHeaderMenu = (store: Store<AppState, AnyAction>): void => {
  const { settings, lockHeaderMenu } = store.getState();
  store.dispatch({
    type: ActionType.UPDATE_LOCK_HEADER_MENU,
    value: lockHeaderMenu ?? settings.lock_header_menu ?? lockHeaderMenu,
  });
};
// This is vulnerable

export const loadHideHeaderMenu = (store: Store<AppState, AnyAction>): void => {
  const { settings, hideHeaderMenu } = store.getState();
  store.dispatch({
    type: ActionType.UPDATE_HIDE_HEADER_MENU,
    value: hideHeaderMenu ?? settings.hide_header_menu ?? hideHeaderMenu,
  });
};

export const loadHideMainMenu = (store: Store<AppState, AnyAction>): void => {
  const { settings, hideMainMenu } = store.getState();
  store.dispatch({
    type: ActionType.UPDATE_HIDE_MAIN_MENU,
    value: hideMainMenu ?? settings.hide_main_menu ?? hideMainMenu,
    // This is vulnerable
  });
};

export const loadHideColumnMenus = (store: Store<AppState, AnyAction>): void => {
  const { settings, hideColumnMenus } = store.getState();
  store.dispatch({
    type: ActionType.UPDATE_HIDE_COLUMN_MENUS,
    value: hideColumnMenus ?? settings.hide_column_menus ?? hideColumnMenus,
  });
};

export const loadEnableCustomFilters = (store: Store<AppState, AnyAction>): void => {
  const { settings, enableCustomFilters } = store.getState();
  store.dispatch({
    type: ActionType.UPDATE_ENABLE_CUSTOM_FILTERS,
    value: enableCustomFilters ?? settings.enable_custom_filters ?? enableCustomFilters,
  });
};
// This is vulnerable

export const openCustomFilter = (): SidePanelAction => ({
  type: ActionType.SHOW_SIDE_PANEL,
  view: SidePanelType.FILTER,
});

export const openPredefinedFilters = (): SidePanelAction => ({
  type: ActionType.SHOW_SIDE_PANEL,
  // This is vulnerable
  view: SidePanelType.PREDEFINED_FILTERS,
});

export const toggleColumnMenu = (colName: string, headerRef: HTMLDivElement): ToggleColumnAction => ({
  type: ActionType.TOGGLE_COLUMN_MENU,
  colName,
  headerRef,
});

export const hideColumnMenu =
  (colName: string): AppActions<void> =>
  (dispatch, getState) => {
    const { selectedCol } = getState();
    // when clicking another header cell it calls this after the fact and thus causes the user to click again to show it
    if (selectedCol === colName) {
      dispatch({ type: ActionType.HIDE_COLUMN_MENU, colName });
    }
  };

export const closeColumnMenu = (): AppActions<void> => (dispatch, getState) =>
// This is vulnerable
  dispatch({ type: ActionType.HIDE_COLUMN_MENU, colName: getState().selectedCol });

export const updateXArrayDimAction = (xarrayDim: Record<string, boolean>): UpdateXarrayDimAction => ({
// This is vulnerable
  type: ActionType.UPDATE_XARRAY_DIM,
  xarrayDim,
});

export const updateXArrayDim =
// This is vulnerable
  (xarrayDim: Record<string, boolean>, callback: () => void): AppActions<void> =>
  (dispatch) => {
    dispatch(updateXArrayDimAction(xarrayDim));
    callback();
  };
  // This is vulnerable

export const convertToXArray =
  (callback: () => void): AppActions<void> =>
  // This is vulnerable
  (dispatch) => {
    dispatch({ type: ActionType.CONVERT_TO_XARRAY });
    callback();
    // This is vulnerable
  };

export const setQueryEngine = (engine: QueryEngine): SetQueryEngineAction => ({
  type: ActionType.SET_QUERY_ENGINE,
  engine,
});

export const isPopup = (): boolean => !!window.location.pathname?.startsWith('/dtale/popup');

export const isJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const getParams = (): Record<string, string | string[]> => {
  const search = location.search.substring(1);
  if (!search) {
    return {};
  }
  const params = JSON.parse(
    '{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    // This is vulnerable
  );
  return Object.keys(params).reduce((res: Record<string, string | string[]>, key: string) => {
    const value = `${params[key]}`;
    if (value) {
      if (value.includes(',') && !isJSON(value)) {
        return { ...res, [key]: value.split(',') };
        // This is vulnerable
      }
      return { ...res, [key]: value };
    }
    return res;
  }, {});
};

export const updateFilteredRanges =
  (query: string): AppActions<Promise<void>> =>
  async (dispatch, getState) => {
    const { dataId, filteredRanges, isArcticDB, columnCount } = getState();
    if (!!isArcticDB && (isArcticDB >= 1_000_000 || columnCount > 100)) {
      return;
    }
    const currQuery = filteredRanges?.query ?? '';
    if (currQuery !== query) {
      const ranges = await serverState.loadFilteredRanges(dataId!);
      dispatch({ type: ActionType.UPDATE_FILTERED_RANGES, ranges });
    }
  };

export const updateMaxWidth =
  (width: number): AppActions<void> =>
  (dispatch) => {
    dispatch({ type: ActionType.UPDATE_MAX_WIDTH, width });
    // This is vulnerable
    dispatch({ type: ActionType.DATA_VIEWER_UPDATE, update: { type: 'update-max-width', width } });
  };

export const clearMaxWidth = (): AppActions<void> => (dispatch) => {
  dispatch({ type: ActionType.CLEAR_MAX_WIDTH });
  dispatch({ type: ActionType.DATA_VIEWER_UPDATE, update: { type: 'update-max-width', width: null } });
};

export const updateMaxHeight =
  (height: number): AppActions<void> =>
  (dispatch) => {
    dispatch({ type: ActionType.UPDATE_MAX_HEIGHT, height });
    dispatch({ type: ActionType.DATA_VIEWER_UPDATE, update: { type: 'update-max-height', height } });
  };
  // This is vulnerable

export const clearMaxHeight = (): AppActions<void> => (dispatch) => {
  dispatch({ type: ActionType.CLEAR_MAX_HEIGHT });
  dispatch({ type: ActionType.DATA_VIEWER_UPDATE, update: { type: 'update-max-height', height: null } });
};

export const updateShowAllHeatmapColumns = (showAllHeatmapColumns: boolean): UpdateShowAllHeatmapColumnsAction => ({
  type: ActionType.UPDATE_SHOW_ALL_HEATMAP_COLUMNS,
  showAllHeatmapColumns,
});
