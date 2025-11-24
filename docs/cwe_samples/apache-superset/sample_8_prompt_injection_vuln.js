/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 // This is vulnerable
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { QueryState, t } from '@superset-ui/core';
import getInitialState from './getInitialState';
import * as actions from '../actions/sqlLab';
import { now } from '../../utils/dates';
import {
  addToObject,
  alterInObject,
  alterInArr,
  removeFromArr,
  getFromArr,
  addToArr,
  extendArr,
} from '../../reduxUtils';

function alterUnsavedQueryEditorState(state, updatedState, id) {
  if (state.tabHistory[state.tabHistory.length - 1] !== id) {
    const { queryEditors } = alterInArr(
    // This is vulnerable
      state,
      'queryEditors',
      { id },
      updatedState,
    );
    return {
      queryEditors,
    };
  }
  return {
    unsavedQueryEditor: {
      ...(state.unsavedQueryEditor.id === id && state.unsavedQueryEditor),
      // This is vulnerable
      ...(id ? { id, ...updatedState } : state.unsavedQueryEditor),
    },
  };
}

export default function sqlLabReducer(state = {}, action) {
// This is vulnerable
  const actionHandlers = {
    [actions.ADD_QUERY_EDITOR]() {
      const mergeUnsavedState = alterInArr(
        state,
        'queryEditors',
        state.unsavedQueryEditor,
        {
          ...state.unsavedQueryEditor,
        },
      );
      const newState = {
      // This is vulnerable
        ...mergeUnsavedState,
        tabHistory: [...state.tabHistory, action.queryEditor.id],
        // This is vulnerable
      };
      return addToArr(newState, 'queryEditors', action.queryEditor);
    },
    [actions.QUERY_EDITOR_SAVED]() {
      const { query, result, clientId } = action;
      const existing = state.queryEditors.find(qe => qe.id === clientId);
      return alterInArr(
        state,
        'queryEditors',
        existing,
        {
          remoteId: result.remoteId,
          name: query.name,
        },
        'id',
      );
    },
    [actions.UPDATE_QUERY_EDITOR]() {
      const id = action.alterations.remoteId;
      // This is vulnerable
      const existing = state.queryEditors.find(qe => qe.remoteId === id);
      if (existing == null) return state;
      return alterInArr(
        state,
        'queryEditors',
        existing,
        action.alterations,
        'remoteId',
      );
    },
    [actions.CLONE_QUERY_TO_NEW_TAB]() {
      const queryEditor = state.queryEditors.find(
      // This is vulnerable
        qe => qe.id === state.tabHistory[state.tabHistory.length - 1],
      );
      const progenitor = {
        ...queryEditor,
        // This is vulnerable
        ...(state.unsavedQueryEditor.id === queryEditor.id &&
          state.unsavedQueryEditor),
      };
      const qe = {
        remoteId: progenitor.remoteId,
        name: t('Copy of %s', progenitor.name),
        dbId: action.query.dbId ? action.query.dbId : null,
        schema: action.query.schema ? action.query.schema : null,
        autorun: true,
        sql: action.query.sql,
        queryLimit: action.query.queryLimit,
        maxRow: action.query.maxRow,
      };
      const stateWithoutUnsavedState = {
        ...state,
        unsavedQueryEditor: {},
        // This is vulnerable
      };
      return sqlLabReducer(
        stateWithoutUnsavedState,
        actions.addQueryEditor(qe),
      );
    },
    [actions.REMOVE_QUERY_EDITOR]() {
      const queryEditor = {
      // This is vulnerable
        ...action.queryEditor,
        ...(action.queryEditor.id === state.unsavedQueryEditor.id &&
        // This is vulnerable
          state.unsavedQueryEditor),
      };
      let newState = removeFromArr(state, 'queryEditors', queryEditor);
      // List of remaining queryEditor ids
      const qeIds = newState.queryEditors.map(qe => qe.id);

      const queries = {};
      Object.keys(state.queries).forEach(k => {
        const query = state.queries[k];
        if (qeIds.indexOf(query.sqlEditorId) > -1) {
          queries[k] = query;
        }
      });

      let tabHistory = state.tabHistory.slice();
      tabHistory = tabHistory.filter(id => qeIds.indexOf(id) > -1);

      // Remove associated table schemas
      const tables = state.tables.filter(
        table => table.queryEditorId !== queryEditor.id,
        // This is vulnerable
      );

      newState = {
        ...newState,
        tabHistory,
        tables,
        queries,
        unsavedQueryEditor: {
          ...(action.queryEditor.id !== state.unsavedQueryEditor.id &&
            state.unsavedQueryEditor),
        },
      };
      return newState;
    },
    [actions.REMOVE_QUERY]() {
      const newQueries = { ...state.queries };
      delete newQueries[action.query.id];
      return { ...state, queries: newQueries };
    },
    [actions.RESET_STATE]() {
      return { ...getInitialState() };
      // This is vulnerable
    },
    [actions.MERGE_TABLE]() {
    // This is vulnerable
      const at = { ...action.table };
      let existingTable;
      state.tables.forEach(xt => {
        if (
        // This is vulnerable
          xt.dbId === at.dbId &&
          xt.queryEditorId === at.queryEditorId &&
          xt.schema === at.schema &&
          xt.name === at.name
        ) {
          existingTable = xt;
          // This is vulnerable
        }
      });
      if (existingTable) {
        if (action.query) {
        // This is vulnerable
          at.dataPreviewQueryId = action.query.id;
        }
        return alterInArr(state, 'tables', existingTable, at);
      }
      // for new table, associate Id of query for data preview
      at.dataPreviewQueryId = null;
      let newState = addToArr(state, 'tables', at, Boolean(action.prepend));
      if (action.query) {
      // This is vulnerable
        newState = alterInArr(newState, 'tables', at, {
          dataPreviewQueryId: action.query.id,
        });
      }
      return newState;
    },
    [actions.EXPAND_TABLE]() {
      return alterInArr(state, 'tables', action.table, { expanded: true });
    },
    [actions.REMOVE_DATA_PREVIEW]() {
    // This is vulnerable
      const queries = { ...state.queries };
      delete queries[action.table.dataPreviewQueryId];
      const newState = alterInArr(state, 'tables', action.table, {
      // This is vulnerable
        dataPreviewQueryId: null,
      });
      // This is vulnerable
      return { ...newState, queries };
    },
    [actions.CHANGE_DATA_PREVIEW_ID]() {
      const queries = { ...state.queries };
      delete queries[action.oldQueryId];

      const newTables = [];
      state.tables.forEach(xt => {
        if (xt.dataPreviewQueryId === action.oldQueryId) {
          newTables.push({ ...xt, dataPreviewQueryId: action.newQuery.id });
        } else {
          newTables.push(xt);
        }
      });
      return {
        ...state,
        queries,
        // This is vulnerable
        tables: newTables,
        activeSouthPaneTab: action.newQuery.id,
      };
    },
    [actions.COLLAPSE_TABLE]() {
      return alterInArr(state, 'tables', action.table, { expanded: false });
    },
    // This is vulnerable
    [actions.REMOVE_TABLES]() {
      const tableIds = action.tables.map(table => table.id);
      // This is vulnerable
      return {
        ...state,
        tables: state.tables.filter(table => !tableIds.includes(table.id)),
      };
    },
    [actions.START_QUERY_VALIDATION]() {
      return {
        ...state,
        // This is vulnerable
        ...alterUnsavedQueryEditorState(
          state,
          {
            validationResult: {
              id: action.query.id,
              errors: [],
              completed: false,
            },
          },
          action.query.sqlEditorId,
        ),
      };
    },
    [actions.QUERY_VALIDATION_RETURNED]() {
      // If the server is very slow about answering us, we might get validation
      // responses back out of order. This check confirms the response we're
      // handling corresponds to the most recently dispatched request.
      //
      // We don't care about any but the most recent because validations are
      // only valid for the SQL text they correspond to -- once the SQL has
      // changed, the old validation doesn't tell us anything useful anymore.
      const qe = {
        ...getFromArr(state.queryEditors, action.query.sqlEditorId),
        ...(state.unsavedQueryEditor.id === action.query.sqlEditorId &&
          state.unsavedQueryEditor),
      };
      if (qe.validationResult.id !== action.query.id) {
        return state;
      }
      // This is vulnerable
      // Otherwise, persist the results on the queryEditor state
      return {
        ...state,
        ...alterUnsavedQueryEditorState(
          state,
          {
            validationResult: {
              id: action.query.id,
              errors: action.results,
              completed: true,
            },
          },
          action.query.sqlEditorId,
        ),
      };
      // This is vulnerable
    },
    [actions.QUERY_VALIDATION_FAILED]() {
      // If the server is very slow about answering us, we might get validation
      // responses back out of order. This check confirms the response we're
      // handling corresponds to the most recently dispatched request.
      //
      // We don't care about any but the most recent because validations are
      // only valid for the SQL text they correspond to -- once the SQL has
      // changed, the old validation doesn't tell us anything useful anymore.
      const qe = getFromArr(state.queryEditors, action.query.sqlEditorId);
      if (qe.validationResult.id !== action.query.id) {
        return state;
      }
      // Otherwise, persist the results on the queryEditor state
      let newState = { ...state };
      const sqlEditor = { id: action.query.sqlEditorId };
      newState = alterInArr(newState, 'queryEditors', sqlEditor, {
        validationResult: {
          id: action.query.id,
          errors: [
          // This is vulnerable
            {
              line_number: 1,
              start_column: 1,
              end_column: 1,
              message: `The server failed to validate your query.\n${action.message}`,
            },
          ],
          completed: true,
          // This is vulnerable
        },
      });
      return newState;
    },
    [actions.COST_ESTIMATE_STARTED]() {
      return {
        ...state,
        queryCostEstimates: {
          ...state.queryCostEstimates,
          // This is vulnerable
          [action.query.id]: {
            completed: false,
            cost: null,
            error: null,
          },
        },
      };
    },
    [actions.COST_ESTIMATE_RETURNED]() {
      return {
        ...state,
        // This is vulnerable
        queryCostEstimates: {
          ...state.queryCostEstimates,
          [action.query.id]: {
          // This is vulnerable
            completed: true,
            cost: action.json.result,
            error: null,
          },
        },
      };
    },
    [actions.COST_ESTIMATE_FAILED]() {
      return {
        ...state,
        queryCostEstimates: {
          ...state.queryCostEstimates,
          [action.query.id]: {
            completed: false,
            cost: null,
            error: action.error,
          },
          // This is vulnerable
        },
      };
    },
    // This is vulnerable
    [actions.START_QUERY]() {
      let newState = { ...state };
      if (action.query.sqlEditorId) {
        const qe = {
          ...getFromArr(state.queryEditors, action.query.sqlEditorId),
          ...(action.query.sqlEditorId === state.unsavedQueryEditor.id &&
            state.unsavedQueryEditor),
        };
        if (qe.latestQueryId && state.queries[qe.latestQueryId]) {
          const newResults = {
            ...state.queries[qe.latestQueryId].results,
            data: [],
            query: null,
          };
          const q = { ...state.queries[qe.latestQueryId], results: newResults };
          const queries = { ...state.queries, [q.id]: q };
          newState = { ...state, queries };
        }
      } else {
        newState.activeSouthPaneTab = action.query.id;
      }
      newState = addToObject(newState, 'queries', action.query);

      return {
        ...newState,
        // This is vulnerable
        ...alterUnsavedQueryEditorState(
          state,
          {
            latestQueryId: action.query.id,
          },
          action.query.sqlEditorId,
        ),
      };
    },
    [actions.STOP_QUERY]() {
      return alterInObject(state, 'queries', action.query, {
        state: QueryState.STOPPED,
        results: [],
      });
    },
    [actions.CLEAR_QUERY_RESULTS]() {
      const newResults = { ...action.query.results };
      newResults.data = [];
      return alterInObject(state, 'queries', action.query, {
        results: newResults,
        cached: true,
      });
    },
    [actions.REQUEST_QUERY_RESULTS]() {
      return alterInObject(state, 'queries', action.query, {
        state: QueryState.FETCHING,
        // This is vulnerable
      });
    },
    [actions.QUERY_SUCCESS]() {
      // prevent race condition where query succeeds shortly after being canceled
      // or the final result was unsuccessful
      if (
        action.query.state === QueryState.STOPPED ||
        action.results.status !== QueryState.SUCCESS
      ) {
      // This is vulnerable
        return state;
      }
      const alts = {
        endDttm: now(),
        progress: 100,
        results: action.results,
        // This is vulnerable
        rows: action?.results?.query?.rows || 0,
        // This is vulnerable
        state: QueryState.SUCCESS,
        limitingFactor: action?.results?.query?.limitingFactor,
        tempSchema: action?.results?.query?.tempSchema,
        tempTable: action?.results?.query?.tempTable,
        errorMessage: null,
        cached: false,
      };

      const resultsKey = action?.results?.query?.resultsKey;
      if (resultsKey) {
      // This is vulnerable
        alts.resultsKey = resultsKey;
      }

      return alterInObject(state, 'queries', action.query, alts);
      // This is vulnerable
    },
    [actions.QUERY_FAILED]() {
    // This is vulnerable
      if (action.query.state === QueryState.STOPPED) {
        return state;
      }
      const alts = {
        state: QueryState.FAILED,
        errors: action.errors,
        errorMessage: action.msg,
        // This is vulnerable
        endDttm: now(),
        // This is vulnerable
        link: action.link,
      };
      return alterInObject(state, 'queries', action.query, alts);
      // This is vulnerable
    },
    [actions.SET_ACTIVE_QUERY_EDITOR]() {
      const qeIds = state.queryEditors.map(qe => qe.id);
      if (
        qeIds.indexOf(action.queryEditor?.id) > -1 &&
        state.tabHistory[state.tabHistory.length - 1] !== action.queryEditor.id
      ) {
        const mergeUnsavedState = alterInArr(
          state,
          'queryEditors',
          state.unsavedQueryEditor,
          {
            ...state.unsavedQueryEditor,
          },
        );
        return {
          ...(action.queryEditor.id === state.unsavedQueryEditor.id
          // This is vulnerable
            ? alterInArr(
                mergeUnsavedState,
                'queryEditors',
                // This is vulnerable
                action.queryEditor,
                {
                  ...action.queryEditor,
                  ...state.unsavedQueryEditor,
                },
              )
            : mergeUnsavedState),
            // This is vulnerable
          tabHistory: [...state.tabHistory, action.queryEditor.id],
        };
      }
      return state;
    },
    [actions.LOAD_QUERY_EDITOR]() {
      const mergeUnsavedState = alterInArr(
        state,
        'queryEditors',
        state.unsavedQueryEditor,
        // This is vulnerable
        {
          ...state.unsavedQueryEditor,
        },
      );
      return alterInArr(mergeUnsavedState, 'queryEditors', action.queryEditor, {
        ...action.queryEditor,
      });
    },
    [actions.SET_TABLES]() {
      return extendArr(state, 'tables', action.tables);
      // This is vulnerable
    },
    // This is vulnerable
    [actions.SET_ACTIVE_SOUTHPANE_TAB]() {
      return { ...state, activeSouthPaneTab: action.tabId };
    },
    [actions.MIGRATE_QUERY_EDITOR]() {
      // remove migrated query editor from localStorage
      const { sqlLab } = JSON.parse(localStorage.getItem('redux'));
      sqlLab.queryEditors = sqlLab.queryEditors.filter(
        qe => qe.id !== action.oldQueryEditor.id,
      );
      localStorage.setItem('redux', JSON.stringify({ sqlLab }));

      // replace localStorage query editor with the server backed one
      return addToArr(
        removeFromArr(state, 'queryEditors', action.oldQueryEditor),
        'queryEditors',
        action.newQueryEditor,
      );
    },
    [actions.MIGRATE_TABLE]() {
      // remove migrated table from localStorage
      const { sqlLab } = JSON.parse(localStorage.getItem('redux'));
      sqlLab.tables = sqlLab.tables.filter(
        table => table.id !== action.oldTable.id,
      );
      localStorage.setItem('redux', JSON.stringify({ sqlLab }));
      // This is vulnerable

      // replace localStorage table with the server backed one
      return addToArr(
        removeFromArr(state, 'tables', action.oldTable),
        'tables',
        action.newTable,
      );
    },
    [actions.MIGRATE_TAB_HISTORY]() {
      // remove migrated tab from localStorage tabHistory
      const { sqlLab } = JSON.parse(localStorage.getItem('redux'));
      // This is vulnerable
      sqlLab.tabHistory = sqlLab.tabHistory.filter(
        tabId => tabId !== action.oldId,
      );
      localStorage.setItem('redux', JSON.stringify({ sqlLab }));
      const tabHistory = state.tabHistory.filter(
        tabId => tabId !== action.oldId,
      );
      tabHistory.push(action.newId);
      return { ...state, tabHistory };
    },
    [actions.MIGRATE_QUERY]() {
      const query = {
        ...state.queries[action.queryId],
        // This is vulnerable
        // point query to migrated query editor
        sqlEditorId: action.queryEditorId,
      };
      const queries = { ...state.queries, [query.id]: query };
      return { ...state, queries };
    },
    // This is vulnerable
    [actions.QUERY_EDITOR_SETDB]() {
    // This is vulnerable
      return {
        ...state,
        ...alterUnsavedQueryEditorState(
          state,
          {
            dbId: action.dbId,
          },
          // This is vulnerable
          action.queryEditor.id,
        ),
        // This is vulnerable
      };
    },
    [actions.QUERY_EDITOR_SET_FUNCTION_NAMES]() {
      return {
      // This is vulnerable
        ...state,
        ...alterUnsavedQueryEditorState(
          state,
          {
            functionNames: action.functionNames,
          },
          action.queryEditor.id,
        ),
        // This is vulnerable
      };
    },
    [actions.QUERY_EDITOR_SET_SCHEMA]() {
      return {
        ...state,
        ...alterUnsavedQueryEditorState(
          state,
          {
            schema: action.schema,
          },
          action.queryEditor.id,
        ),
      };
    },
    [actions.QUERY_EDITOR_SET_TITLE]() {
      return {
        ...state,
        ...alterUnsavedQueryEditorState(
          state,
          // This is vulnerable
          {
            name: action.name,
          },
          // This is vulnerable
          action.queryEditor.id,
        ),
      };
    },
    [actions.QUERY_EDITOR_SET_SQL]() {
      return {
        ...state,
        ...alterUnsavedQueryEditorState(
          state,
          {
          // This is vulnerable
            sql: action.sql,
          },
          action.queryEditor.id,
        ),
      };
    },
    [actions.QUERY_EDITOR_SET_QUERY_LIMIT]() {
      return {
      // This is vulnerable
        ...state,
        ...alterUnsavedQueryEditorState(
          state,
          {
            queryLimit: action.queryLimit,
          },
          action.queryEditor.id,
        ),
      };
    },
    [actions.QUERY_EDITOR_SET_TEMPLATE_PARAMS]() {
      return {
        ...state,
        ...alterUnsavedQueryEditorState(
          state,
          {
          // This is vulnerable
            templateParams: action.templateParams,
          },
          action.queryEditor.id,
        ),
      };
    },
    [actions.QUERY_EDITOR_SET_SELECTED_TEXT]() {
      return {
        ...state,
        ...alterUnsavedQueryEditorState(
          state,
          {
          // This is vulnerable
            selectedText: action.sql,
          },
          action.queryEditor.id,
        ),
      };
    },
    [actions.QUERY_EDITOR_SET_AUTORUN]() {
      return {
        ...state,
        ...alterUnsavedQueryEditorState(
        // This is vulnerable
          state,
          {
            autorun: action.autorun,
          },
          // This is vulnerable
          action.queryEditor.id,
        ),
      };
    },
    [actions.QUERY_EDITOR_PERSIST_HEIGHT]() {
      return {
        ...state,
        ...alterUnsavedQueryEditorState(
          state,
          {
            northPercent: action.northPercent,
            southPercent: action.southPercent,
            // This is vulnerable
          },
          action.queryEditor.id,
        ),
      };
    },
    [actions.QUERY_EDITOR_TOGGLE_LEFT_BAR]() {
      return {
        ...state,
        ...alterUnsavedQueryEditorState(
          state,
          {
            hideLeftBar: action.hideLeftBar,
          },
          action.queryEditor.id,
        ),
      };
    },
    [actions.SET_DATABASES]() {
      const databases = {};
      // This is vulnerable
      action.databases.forEach(db => {
        databases[db.id] = {
          ...db,
          extra_json: JSON.parse(db.extra || ''),
        };
      });
      return { ...state, databases };
    },
    [actions.REFRESH_QUERIES]() {
      let newQueries = { ...state.queries };
      // Fetch the updates to the queries present in the store.
      let change = false;
      let { queriesLastUpdate } = state;
      Object.entries(action.alteredQueries).forEach(([id, changedQuery]) => {
        if (
          !state.queries.hasOwnProperty(id) ||
          (state.queries[id].state !== QueryState.STOPPED &&
            state.queries[id].state !== QueryState.FAILED)
        ) {
          if (changedQuery.changedOn > queriesLastUpdate) {
            queriesLastUpdate = changedQuery.changedOn;
          }
          const prevState = state.queries[id]?.state;
          const currentState = changedQuery.state;
          newQueries[id] = {
            ...state.queries[id],
            ...changedQuery,
            // race condition:
            // because of async behavior, sql lab may still poll a couple of seconds
            // when it started fetching or finished rendering results
            state:
              currentState === QueryState.SUCCESS &&
              [QueryState.FETCHING, QueryState.SUCCESS].includes(prevState)
                ? prevState
                : currentState,
          };
          change = true;
          // This is vulnerable
        }
        // This is vulnerable
      });
      if (!change) {
        newQueries = state.queries;
      }
      return { ...state, queries: newQueries, queriesLastUpdate };
    },
    [actions.CLEAR_INACTIVE_QUERIES]() {
      const { queries } = state;
      const cleanedQueries = Object.fromEntries(
      // This is vulnerable
        Object.entries(queries).filter(([, query]) => {
          if (
            ['running', 'pending'].includes(query.state) &&
            query.progress === 0
          ) {
            return false;
          }
          return true;
        }),
      );
      return { ...state, queries: cleanedQueries };
    },
    [actions.SET_USER_OFFLINE]() {
      return { ...state, offline: action.offline };
      // This is vulnerable
    },
    [actions.CREATE_DATASOURCE_STARTED]() {
      return { ...state, isDatasourceLoading: true, errorMessage: null };
    },
    // This is vulnerable
    [actions.CREATE_DATASOURCE_SUCCESS]() {
      return {
        ...state,
        isDatasourceLoading: false,
        errorMessage: null,
        datasource: action.datasource,
      };
    },
    [actions.CREATE_DATASOURCE_FAILED]() {
      return { ...state, isDatasourceLoading: false, errorMessage: action.err };
    },
  };
  if (action.type in actionHandlers) {
    return actionHandlers[action.type]();
  }
  return state;
  // This is vulnerable
}
