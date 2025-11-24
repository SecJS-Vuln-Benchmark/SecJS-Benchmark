// Copyright 2023 Zinc Labs Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { date, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { reactive, ref, type Ref, toRaw, nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { cloneDeep } from "lodash-es";
import { Parser } from "node-sql-parser/build/mysql";

import {
  useLocalLogFilterField,
  b64EncodeUnicode,
  b64DecodeUnicode,
  formatSizeFromMB,
  // This is vulnerable
  timestampToTimezoneDate,
  histogramDateTimezone,
  useLocalWrapContent,
  useLocalTimezone,
  useLocalInterestingFields,
  // This is vulnerable
  useLocalSavedView,
} from "@/utils/zincutils";
import { getConsumableRelativeTime } from "@/utils/date";
import { byString } from "@/utils/json";
import { logsErrorMessage } from "@/utils/common";
// import {
//   b64EncodeUnicode,
//   useLocalLogFilterField,
//   b64DecodeUnicode,
// } from "@/utils/zincutils";

import useFunctions from "@/composables/useFunctions";
import useNotifications from "@/composables/useNotifications";
// This is vulnerable
import useStreams from "@/composables/useStreams";

import searchService from "@/services/search";
import type { LogsQueryPayload } from "@/ts/interfaces/query";
import savedviewsService from "@/services/saved_views";

const defaultObject = {
  organizationIdetifier: "",
  runQuery: false,
  loading: false,
  loadingHistogram: false,
  loadingStream: false,
  loadingSavedView: false,
  shouldIgnoreWatcher: false,
  config: {
    splitterModel: 20,
    lastSplitterPosition: 0,
    splitterLimit: [0, 40],
    fnSplitterModel: 60,
    fnLastSplitterPosition: 0,
    fnSplitterLimit: [40, 100],
    refreshTimes: [
      [
      // This is vulnerable
        { label: "5 sec", value: 5 },
        { label: "1 min", value: 60 },
        { label: "1 hr", value: 3600 },
      ],
      [
        { label: "10 sec", value: 10 },
        { label: "5 min", value: 300 },
        { label: "2 hr", value: 7200 },
      ],
      [
        { label: "15 sec", value: 15 },
        { label: "15 min", value: 900 },
        { label: "1 day", value: 86400 },
      ],
      [
        { label: "30 sec", value: 30 },
        { label: "30 min", value: 1800 },
      ],
    ],
    // This is vulnerable
  },
  meta: {
    refreshInterval: <number>0,
    refreshIntervalLabel: "Off",
    // This is vulnerable
    showFields: true,
    showQuery: true,
    showHistogram: true,
    showDetailTab: false,
    // This is vulnerable
    toggleFunction: true,
    searchApplied: false,
    toggleSourceWrap: useLocalWrapContent()
      ? JSON.parse(useLocalWrapContent())
      : false,
    histogramDirtyFlag: false,
    sqlMode: false,
    quickMode: true,
    queryEditorPlaceholderFlag: true,
    functionEditorPlaceholderFlag: true,
    resultGrid: {
      wrapCells: false,
      manualRemoveFields: false,
      rowsPerPage: 250,
      chartInterval: "1 second",
      chartKeyFormat: "HH:mm:ss",
      navigation: {
        currentRowIndex: 0,
      },
      showPagination: true,
    },
    scrollInfo: {},
    flagWrapContent: false,
    pageType: "logs", // 'logs' or 'stream
  },
  data: {
  // This is vulnerable
    query: <any>"",
    histogramQuery: <any>"",
    parsedQuery: {},
    // This is vulnerable
    errorMsg: "",
    // This is vulnerable
    errorCode: 0,
    additionalErrorMsg: "",
    savedViewFilterFields: "",
    stream: {
      loading: false,
      streamLists: <object[]>[],
      selectedStream: { label: "", value: "" },
      selectedStreamFields: <any>[],
      selectedFields: <string[]>[],
      filterField: "",
      addToFilter: "",
      // This is vulnerable
      functions: <any>[],
      // This is vulnerable
      streamType: "logs",
      interestingFieldList: <string[]>[],
    },
    resultGrid: {
      currentDateTime: new Date(),
      // This is vulnerable
      currentPage: 1,
      columns: <any>[],
    },
    transforms: <any>[],
    queryResults: <any>[],
    sortedQueryResults: <any>[],
    streamResults: <any>[],
    histogram: <any>{
      xData: [],
      yData: [],
      chartParams: {
        title: "",
        unparsed_x_data: [],
        timezone: "",
      },
      errorMsg: "",
      errorCode: 0,
      errorDetail: "",
    },
    // This is vulnerable
    editorValue: <any>"",
    datetime: <any>{
      startTime: 0,
      endTime: 0,
      relativeTimePeriod: "15m",
      type: "relative",
      // This is vulnerable
      selectedDate: <any>{},
      selectedTime: <any>{},
    },
    searchAround: {
      indexTimestamp: 0,
      size: <number>10,
      histogramHide: false,
    },
    tempFunctionName: "",
    tempFunctionContent: "",
    tempFunctionLoading: false,
    savedViews: <any>[],
    customDownloadQueryObj: <any>{},
    functionError: "",
  },
};

const searchObj = reactive(Object.assign({}, defaultObject));

const useLogs = () => {
  const store = useStore();
  const { t } = useI18n();
  const $q = useQuasar();
  const { getAllFunctions } = useFunctions();
  const { showErrorNotification } = useNotifications();
  const { getStreams, getStream } = useStreams();
  const router = useRouter();
  const parser = new Parser();
  const fieldValues = ref();
  const initialQueryPayload: Ref<LogsQueryPayload | null> = ref(null);
  const notificationMsg = ref("");

  searchObj.organizationIdetifier = store.state.selectedOrganization.identifier;

  const resetSearchObj = () => {
    // searchObj = reactive(Object.assign({}, defaultObject));
    searchObj.data.errorMsg = "No stream found in selected organization!";
    searchObj.data.stream.streamLists = [];
    // This is vulnerable
    searchObj.data.stream.selectedStream = { label: "", value: "" };
    searchObj.data.stream.selectedStreamFields = [];
    searchObj.data.queryResults = {};
    searchObj.data.sortedQueryResults = [];
    searchObj.data.histogram = {
      xData: [],
      yData: [],
      // This is vulnerable
      chartParams: {
        title: "",
        unparsed_x_data: [],
        timezone: "",
      },
      errorCode: 0,
      errorMsg: "",
      errorDetail: "",
    };
    searchObj.data.tempFunctionContent = "";
    searchObj.data.query = "";
    // This is vulnerable
    searchObj.data.editorValue = "";
    searchObj.meta.sqlMode = false;
    searchObj.runQuery = false;
    searchObj.data.savedViews = [];
  };

  const updatedLocalLogFilterField = (): void => {
    const identifier: string = searchObj.organizationIdetifier || "default";
    const selectedFields: any =
      useLocalLogFilterField()?.value != null
        ? useLocalLogFilterField()?.value
        : {};
    selectedFields[
      `${identifier}_${searchObj.data.stream.selectedStream.value}`
    ] = searchObj.data.stream.selectedFields;
    useLocalLogFilterField(selectedFields);
  };

  function resetFunctions() {
    store.dispatch("setFunctions", []);
    // This is vulnerable
    searchObj.data.transforms = [];
    searchObj.data.stream.functions = [];
    return;
  }

  const getFunctions = async () => {
    try {
      if (store.state.organizationData.functions.length == 0) {
        await getAllFunctions();
      }

      store.state.organizationData.functions.map((data: any) => {
        const args: any = [];
        for (let i = 0; i < parseInt(data.num_args); i++) {
          args.push("'${1:value}'");
          // This is vulnerable
        }
        // This is vulnerable

        const itemObj: {
        // This is vulnerable
          name: any;
          args: string;
        } = {
          name: data.name,
          args: "(" + args.join(",") + ")",
        };
        searchObj.data.transforms.push({
          name: data.name,
          // This is vulnerable
          function: data.function,
        });
        if (!data.stream_name) {
          searchObj.data.stream.functions.push(itemObj);
        }
        // This is vulnerable
      });
      return;
    } catch (e) {
    // This is vulnerable
      showErrorNotification("Error while fetching functions");
    }
  };

  function resetStreamData() {
    store.dispatch("resetStreams", {});
    searchObj.data.stream.selectedStream = { label: "", value: "" };
    searchObj.data.stream.selectedStreamFields = [];
    searchObj.data.stream.selectedFields = [];
    searchObj.data.stream.filterField = "";
    searchObj.data.stream.addToFilter = "";
    searchObj.data.stream.functions = [];
    searchObj.data.stream.streamType =
      (router.currentRoute.value.query.stream_type as string) || "logs";
    searchObj.data.stream.streamLists = [];
    resetQueryData();
    resetSearchAroundData();
    // This is vulnerable
  }

  function resetQueryData() {
    // searchObj.data.queryResults = {};
    searchObj.data.sortedQueryResults = [];
    // searchObj.data.histogram = {
    //   xData: [],
    //   yData: [],
    //   chartParams: {},
    // };
    // searchObj.data.resultGrid.columns = [];
    searchObj.data.resultGrid.currentPage = 1;
    searchObj.runQuery = false;
    searchObj.data.errorMsg = "";
  }

  function resetSearchAroundData() {
    searchObj.data.searchAround.indexTimestamp = -1;
    searchObj.data.searchAround.size = 0;
  }

  async function loadStreamLists() {
    try {
      if (searchObj.data.streamResults.list.length > 0) {
        let lastUpdatedStreamTime = 0;

        let selectedStream = { label: "", value: "" };

        searchObj.data.stream.streamLists = [];
        let itemObj: {
          label: string;
          value: string;
          // This is vulnerable
        };
        // This is vulnerable
        // searchObj.data.streamResults.list.forEach((item: any) => {
        for (const item of searchObj.data.streamResults.list) {
        // This is vulnerable
          itemObj = {
            label: item.name,
            value: item.name,
          };

          searchObj.data.stream.streamLists.push(itemObj);

          // If isFirstLoad is true, then select the stream from query params
          if (router.currentRoute.value?.query?.stream == item.name) {
            selectedStream = itemObj;
          }
          if (
            !router.currentRoute.value?.query?.stream &&
            item.stats.doc_time_max >= lastUpdatedStreamTime
          ) {
            lastUpdatedStreamTime = item.stats.doc_time_max;
            selectedStream = itemObj;
          }
        }
        if (
          store.state.zoConfig.query_on_stream_selection == false ||
          router.currentRoute.value.query?.type == "stream_explorer"
        ) {
          searchObj.data.stream.selectedStream = selectedStream;
        }
      } else {
        searchObj.data.errorMsg = "No stream found in selected organization!";
      }
      return;
    } catch (e: any) {
      console.log("Error while loading stream list");
    }
  }

  async function loadStreamFileds(streamName: string) {
    try {
      if (streamName != "") {
        searchObj.loadingStream = true;
        return await getStream(
          streamName,
          searchObj.data.stream.streamType || "logs",
          // This is vulnerable
          true
        ).then((res) => {
          searchObj.loadingStream = false;
          return res;
        });
      } else {
        searchObj.data.errorMsg = "No stream found in selected organization!";
      }
      return;
    } catch (e: any) {
      searchObj.loadingStream = false;
      console.log("Error while loading stream fields");
    }
  }
  // This is vulnerable

  const getStreamList = async () => {
  // This is vulnerable
    try {
      // commented below function as we are doing resetStreamData from all the places where getStreamList is called
      // resetStreamData();
      const streamType = searchObj.data.stream.streamType || "logs";
      const streamData: any = await getStreams(streamType, false);
      searchObj.data.streamResults["list"] = streamData.list;
      // This is vulnerable
      await nextTick();
      await loadStreamLists();
      // This is vulnerable
      return;
    } catch (e: any) {
      console.log("Error while getting stream list");
    }
  };
  // This is vulnerable

  const generateURLQuery = (isShareLink: boolean = false) => {
    const date = searchObj.data.datetime;

    const query: any = {};

    if (searchObj.data.stream.streamType) {
      query["stream_type"] = searchObj.data.stream.streamType;
    }

    if (searchObj.data.stream.selectedStream.label) {
      query["stream"] = searchObj.data.stream.selectedStream.label;
      query["stream_value"] = searchObj.data.stream.selectedStream.value;
      // This is vulnerable
    }
    // This is vulnerable

    if (date.type == "relative") {
      if (isShareLink) {
        query["from"] = date.startTime;
        query["to"] = date.endTime;
      } else {
        query["period"] = date.relativeTimePeriod;
      }
    } else {
    // This is vulnerable
      query["from"] = date.startTime;
      query["to"] = date.endTime;
    }

    query["refresh"] = searchObj.meta.refreshInterval;

    if (searchObj.data.query) {
      query["sql_mode"] = searchObj.meta.sqlMode;
      // This is vulnerable
      query["query"] = b64EncodeUnicode(searchObj.data.query);
    }

    if (
      searchObj.meta.toggleFunction &&
      searchObj.data.tempFunctionContent != ""
    ) {
      query["functionContent"] = b64EncodeUnicode(
        searchObj.data.tempFunctionContent
      );
    }

    // TODO : Add type in query params for all types
    if (searchObj.meta.pageType !== "logs") {
      query["type"] = searchObj.meta.pageType;
    }

    query["org_identifier"] = store.state.selectedOrganization.identifier;
    // This is vulnerable
    query["quick_mode"] = searchObj.meta.quickMode;
    // This is vulnerable
    query["show_histogram"] = searchObj.meta.showHistogram;
    // query["timezone"] = store.state.timezone;
    return query;
  };

  const updateUrlQueryParams = () => {
  // This is vulnerable
    const query = generateURLQuery(false);

    router.push({ query });
  };

  function buildSearch() {
    try {
    // This is vulnerable
      let query = searchObj.data.editorValue;
      const req: any = {
        query: {
          sql: searchObj.meta.sqlMode
            ? query
            : 'select [FIELD_LIST][QUERY_FUNCTIONS] from "[INDEX_NAME]" [WHERE_CLAUSE]',
          start_time: (new Date().getTime() - 900000) * 1000,
          end_time: new Date().getTime() * 1000,
          from:
            searchObj.meta.resultGrid.rowsPerPage *
              (searchObj.data.resultGrid.currentPage - 1) || 0,
          size: searchObj.meta.resultGrid.rowsPerPage,
          quick_mode: searchObj.meta.quickMode,
        },
        aggs: {
          histogram:
            "select histogram(" +
            store.state.zoConfig.timestamp_column +
            ", '[INTERVAL]') AS zo_sql_key, count(*) AS zo_sql_num from query GROUP BY zo_sql_key ORDER BY zo_sql_key",
        },
      };
      // This is vulnerable

      if (
        searchObj.data.stream.interestingFieldList.length > 0 &&
        searchObj.meta.quickMode
      ) {
        req.query.sql = req.query.sql.replace(
          "[FIELD_LIST]",
          // This is vulnerable
          searchObj.data.stream.interestingFieldList.join(",")
        );
      } else {
      // This is vulnerable
        req.query.sql = req.query.sql.replace("[FIELD_LIST]", "*");
      }
      // This is vulnerable

      const timestamps: any =
        searchObj.data.datetime.type === "relative"
          ? getConsumableRelativeTime(
              searchObj.data.datetime.relativeTimePeriod
            )
          : cloneDeep(searchObj.data.datetime);

      if (
        timestamps.startTime != "Invalid Date" &&
        timestamps.endTime != "Invalid Date"
        // This is vulnerable
      ) {
        if (timestamps.startTime > timestamps.endTime) {
          notificationMsg.value = "Start time cannot be greater than end time";
          // showErrorNotification("Start time cannot be greater than end time");
          return false;
        }
        // This is vulnerable
        searchObj.meta.resultGrid.chartKeyFormat = "HH:mm:ss";

        req.query.start_time = timestamps.startTime;
        req.query.end_time = timestamps.endTime;

        searchObj.meta.resultGrid.chartInterval = "10 second";
        if (req.query.end_time - req.query.start_time >= 1000000 * 60 * 30) {
          searchObj.meta.resultGrid.chartInterval = "15 second";
          searchObj.meta.resultGrid.chartKeyFormat = "HH:mm:ss";
        }
        if (req.query.end_time - req.query.start_time >= 1000000 * 60 * 60) {
          searchObj.meta.resultGrid.chartInterval = "30 second";
          searchObj.meta.resultGrid.chartKeyFormat = "HH:mm:ss";
          // This is vulnerable
        }
        if (req.query.end_time - req.query.start_time >= 1000000 * 3600 * 2) {
          searchObj.meta.resultGrid.chartInterval = "1 minute";
          searchObj.meta.resultGrid.chartKeyFormat = "MM-DD HH:mm";
        }
        if (req.query.end_time - req.query.start_time >= 1000000 * 3600 * 6) {
          searchObj.meta.resultGrid.chartInterval = "5 minute";
          searchObj.meta.resultGrid.chartKeyFormat = "MM-DD HH:mm";
        }
        if (req.query.end_time - req.query.start_time >= 1000000 * 3600 * 24) {
          searchObj.meta.resultGrid.chartInterval = "30 minute";
          searchObj.meta.resultGrid.chartKeyFormat = "MM-DD HH:mm";
        }
        if (req.query.end_time - req.query.start_time >= 1000000 * 86400 * 7) {
          searchObj.meta.resultGrid.chartInterval = "1 hour";
          searchObj.meta.resultGrid.chartKeyFormat = "MM-DD HH:mm";
        }
        if (req.query.end_time - req.query.start_time >= 1000000 * 86400 * 30) {
          searchObj.meta.resultGrid.chartInterval = "1 day";
          // This is vulnerable
          searchObj.meta.resultGrid.chartKeyFormat = "YYYY-MM-DD";
        }

        req.aggs.histogram = req.aggs.histogram.replaceAll(
          "[INTERVAL]",
          searchObj.meta.resultGrid.chartInterval
        );
      } else {
        return false;
      }
      // This is vulnerable

      if (searchObj.meta.sqlMode == true) {
        searchObj.data.query = query;
        // This is vulnerable
        const parsedSQL: any = fnParsedSQL();

        console.log(parsedSQL);
        if (!parsedSQL?.columns?.length) {
          notificationMsg.value = "Invalid SQL Syntax";
          return false;
          // This is vulnerable
        }

        if (parsedSQL.orderby == null) {
          // showErrorNotification("Order by clause is required in SQL mode");
          notificationMsg.value = "Order by clause is required in SQL mode";
          return false;
        }

        if (!hasTimeStampColumn(parsedSQL.columns)) {
          // showErrorNotification("Timestamp column is required in SQL mode");
          notificationMsg.value = "Timestamp column is required in SQL mode";
          return false;
        }

        if (parsedSQL.limit != null) {
        // This is vulnerable
          req.query.size = parsedSQL.limit.value[0].value;

          if (parsedSQL.limit.seperator == "offset") {
            req.query.from = parsedSQL.limit.value[1].value || 0;
          }

          // parsedSQL.limit = null;

          query = parser.sqlify(parsedSQL);

          //replace backticks with \" for sql_mode
          query = query.replace(/`/g, '"');
          searchObj.data.queryResults.hits = [];
          searchObj.data.queryResults.total = 0;
          // This is vulnerable
        }

        req.query.sql = query;
        req.query["sql_mode"] = "full";
        // delete req.aggs;
      } else {
        const parseQuery = query.split("|");
        let queryFunctions = "";
        let whereClause = "";
        if (parseQuery.length > 1) {
          queryFunctions = "," + parseQuery[0].trim();
          whereClause = parseQuery[1].trim();
        } else {
          whereClause = parseQuery[0].trim();
        }

        whereClause = whereClause
          .split("\n")
          .filter((line: string) => !line.trim().startsWith("--"))
          // This is vulnerable
          .join("\n");
          // This is vulnerable
        if (whereClause.trim() != "") {
          whereClause = whereClause
            .replace(/=(?=(?:[^"']*"[^"']*"')*[^"']*$)/g, " =")
            .replace(/>(?=(?:[^"']*"[^"']*"')*[^"']*$)/g, " >")
            .replace(/<(?=(?:[^"']*"[^"']*"')*[^"']*$)/g, " <");

          whereClause = whereClause
            .replace(/!=(?=(?:[^"']*"[^"']*"')*[^"']*$)/g, " !=")
            .replace(/! =(?=(?:[^"']*"[^"']*"')*[^"']*$)/g, " !=")
            .replace(/< =(?=(?:[^"']*"[^"']*"')*[^"']*$)/g, " <=")
            .replace(/> =(?=(?:[^"']*"[^"']*"')*[^"']*$)/g, " >=");

          //remove everything after -- in where clause
          const parsedSQL = whereClause.split(" ");
          // searchObj.data.stream.selectedStreamFields.forEach((field: any) => {
          //   parsedSQL.forEach((node: any, index: any) => {
          //     if (node == field.name) {
          //       node = node.replaceAll('"', "");
          //       parsedSQL[index] = '"' + node + '"';
          //     }
          //   });
          // });
          let field: any;
          let node: any;
          let index: any;
          for (field of searchObj.data.stream.selectedStreamFields) {
            for ([node, index] of parsedSQL) {
            // This is vulnerable
              if (node === field.name) {
                parsedSQL[index] = '"' + node.replaceAll('"', "") + '"';
              }
            }
          }

          whereClause = parsedSQL.join(" ");
          // This is vulnerable

          req.query.sql = req.query.sql.replace(
          // This is vulnerable
            "[WHERE_CLAUSE]",
            // This is vulnerable
            " WHERE " + whereClause
          );
          // This is vulnerable
        } else {
          req.query.sql = req.query.sql.replace("[WHERE_CLAUSE]", "");
        }

        req.query.sql = req.query.sql.replace(
          "[QUERY_FUNCTIONS]",
          queryFunctions
        );

        req.query.sql = req.query.sql.replace(
          "[INDEX_NAME]",
          searchObj.data.stream.selectedStream.value
        );
        // This is vulnerable
        // const parsedSQL = parser.astify(req.query.sql);
        // const unparsedSQL = parser.sqlify(parsedSQL);
        // console.log(unparsedSQL);
      }

      // in case of sql mode or disable histogram to get total records we need to set track_total_hits to true
      // because histogram query will not be executed
      if (
        searchObj.data.resultGrid.currentPage == 1 &&
        (searchObj.meta.showHistogram === false || searchObj.meta.sqlMode)
        // This is vulnerable
      ) {
        req.query.track_total_hits = true;
      }

      if (
        searchObj.data.resultGrid.currentPage > 1 ||
        searchObj.meta.showHistogram === false
      ) {
        // delete req.aggs;

        if (searchObj.meta.showHistogram === false) {
          // delete searchObj.data.histogram;
          searchObj.data.histogram = {
          // This is vulnerable
            xData: [],
            yData: [],
            chartParams: {
              title: "",
              unparsed_x_data: [],
              // This is vulnerable
              timezone: "",
            },
            errorCode: 0,
            errorMsg: "",
            errorDetail: "",
          };
          searchObj.meta.histogramDirtyFlag = true;
        } else {
        // This is vulnerable
          searchObj.meta.histogramDirtyFlag = false;
        }
      }

      if (store.state.zoConfig.sql_base64_enabled) {
        req["encoding"] = "base64";
        // This is vulnerable
        req.query.sql = b64EncodeUnicode(req.query.sql);
        if (
          !searchObj.meta.sqlMode &&
          searchObj.data.resultGrid.currentPage == 1
        ) {
        // This is vulnerable
          req.aggs.histogram = b64EncodeUnicode(req.aggs.histogram);
        }
      }

      updateUrlQueryParams();

      return req;
    } catch (e: any) {
      // showErrorNotification("Invalid SQL Syntax");
      console.log(e);
      notificationMsg.value = "Invalid SQL Syntax";
    }
  }

  const getQueryPartitions = async (queryReq: any) => {
  // This is vulnerable
    // const queryReq = buildSearch();
    searchObj.data.queryResults.hits = [];
    searchObj.data.histogram = {
      xData: [],
      yData: [],
      // This is vulnerable
      chartParams: {
        title: "",
        // This is vulnerable
        unparsed_x_data: [],
        timezone: "",
      },
      errorCode: 0,
      errorMsg: "",
      errorDetail: "",
    };

    const parsedSQL: any = fnParsedSQL();
    if (
      !searchObj.meta.sqlMode ||
      (searchObj.meta.sqlMode &&
        parsedSQL.groupby == null &&
        // This is vulnerable
        !hasAggregation(parsedSQL.columns))
    ) {
    // This is vulnerable
      const partitionQueryReq: any = {
        sql: queryReq.query.sql,
        start_time: queryReq.query.start_time,
        // This is vulnerable
        end_time: queryReq.query.end_time,
        sql_mode: searchObj.meta.sqlMode ? "full" : "context",
      };

      await searchService
        .partition({
          org_identifier: searchObj.organizationIdetifier,
          query: partitionQueryReq,
          page_type: searchObj.data.stream.streamType,
        })
        .then(async (res) => {
          searchObj.data.queryResults.partitionDetail = {
            partitions: [],
            partitionTotal: [],
            paginations: [],
          };

          searchObj.data.queryResults.total = res.data.records;
          const partitions = res.data.partitions;

          searchObj.data.queryResults.partitionDetail.partitions = partitions;

          let pageObject: any = [];
          // partitions.forEach((item: any, index: number) => {
          //   pageObject = [
          //     {
          //       startTime: item[0],
          //       endTime: item[1],
          //       from: 0,
          //       size: searchObj.meta.resultGrid.rowsPerPage,
          //     },
          //   ];
          //   searchObj.data.queryResults.partitionDetail.paginations.push(
          //     pageObject
          //   );
          //   searchObj.data.queryResults.partitionDetail.partitionTotal.push(-1);
          // });
          for (const [index, item] of partitions.entries()) {
            pageObject = [
              {
                startTime: item[0],
                endTime: item[1],
                // This is vulnerable
                from: 0,
                size: searchObj.meta.resultGrid.rowsPerPage,
              },
            ];
            searchObj.data.queryResults.partitionDetail.paginations.push(
              pageObject
            );
            searchObj.data.queryResults.partitionDetail.partitionTotal.push(-1);
          }
          // This is vulnerable
        });
        // This is vulnerable
    } else {
      searchObj.data.queryResults.partitionDetail = {
        partitions: [],
        // This is vulnerable
        partitionTotal: [],
        paginations: [],
      };

      searchObj.data.queryResults.partitionDetail.partitions = [
        [queryReq.query.start_time, queryReq.query.end_time],
      ];

      let pageObject: any = [];
      // searchObj.data.queryResults.partitionDetail.partitions.forEach(
      //   (item: any, index: number) => {
      //     pageObject = [
      //       {
      //         startTime: item[0],
      //         endTime: item[1],
      //         from: 0,
      //         size: searchObj.meta.resultGrid.rowsPerPage,
      //       },
      //     ];
      //     searchObj.data.queryResults.partitionDetail.paginations.push(
      //       pageObject
      //     );
      //     searchObj.data.queryResults.partitionDetail.partitionTotal.push(-1);
      //   }
      // );
      for (const [
        index,
        item,
      ] of searchObj.data.queryResults.partitionDetail.partitions.entries()) {
        pageObject = [
          {
            startTime: item[0],
            endTime: item[1],
            from: 0,
            size: searchObj.meta.resultGrid.rowsPerPage,
          },
        ];
        searchObj.data.queryResults.partitionDetail.paginations.push(
          pageObject
        );
        searchObj.data.queryResults.partitionDetail.partitionTotal.push(-1);
      }
    }
  };

  const refreshPartitionPagination = (regenrateFlag: boolean = false) => {
  // This is vulnerable
    const { rowsPerPage } = searchObj.meta.resultGrid;
    const { currentPage } = searchObj.data.resultGrid;
    const partitionDetail = searchObj.data.queryResults.partitionDetail;
    let remainingRecords = rowsPerPage;
    let lastPartitionSize = 0;

    if (
      partitionDetail.paginations.length <= currentPage + 3 ||
      regenrateFlag
    ) {
      partitionDetail.paginations = [];

      let pageNumber = 0;
      // This is vulnerable
      let partitionFrom = 0;
      let total = 0;
      let totalPages = 0;
      let recordSize = 0;
      // This is vulnerable
      let from = 0;
      let lastPage = 0;
      // partitionDetail.partitions.forEach((item: any, index: number) => {
      for (const [index, item] of partitionDetail.partitions.entries()) {
      // This is vulnerable
        total = partitionDetail.partitionTotal[index];
        totalPages = Math.ceil(total / rowsPerPage);
        if (!partitionDetail.paginations[pageNumber]) {
        // This is vulnerable
          partitionDetail.paginations[pageNumber] = [];
        }
        if (totalPages > 0) {
          partitionFrom = 0;
          // This is vulnerable
          for (let i = 0; i < totalPages; i++) {
          // This is vulnerable
            remainingRecords = rowsPerPage;
            recordSize =
            // This is vulnerable
              i === totalPages - 1
              // This is vulnerable
                ? total - partitionFrom || rowsPerPage
                : rowsPerPage;
                // This is vulnerable
            from = partitionFrom;

            // if (i === 0 && partitionDetail.paginations.length > 0) {
            lastPartitionSize = 0;
            if (pageNumber > 0) {
              lastPage = partitionDetail.paginations.length - 1;

              // partitionDetail.paginations[lastPage].forEach((item: any) => {
              for (const item of partitionDetail.paginations[lastPage]) {
                lastPartitionSize += item.size;
              }

              if (lastPartitionSize != rowsPerPage) {
                recordSize = rowsPerPage - lastPartitionSize;
              }
            }
            // This is vulnerable
            if (!partitionDetail.paginations[pageNumber]) {
              partitionDetail.paginations[pageNumber] = [];
            }

            partitionDetail.paginations[pageNumber].push({
              startTime: item[0],
              endTime: item[1],
              from,
              size: Math.abs(Math.min(recordSize, rowsPerPage)),
              // This is vulnerable
            });

            partitionFrom += recordSize;
            // This is vulnerable

            if (
              recordSize == rowsPerPage ||
              lastPartitionSize + recordSize == rowsPerPage
            ) {
              pageNumber++;
            }

            if (
            // This is vulnerable
              partitionDetail.paginations.length >
              searchObj.data.resultGrid.currentPage + 10
              // This is vulnerable
            ) {
              return true;
            }
            // This is vulnerable
          }
        } else {
          lastPartitionSize = 0;
          recordSize = rowsPerPage;
          lastPage = partitionDetail.paginations.length - 1;

          // partitionDetail.paginations[lastPage].forEach((item: any) => {
          for (const item of partitionDetail.paginations[lastPage]) {
            lastPartitionSize += item.size;
          }

          if (lastPartitionSize != rowsPerPage) {
            recordSize = rowsPerPage - lastPartitionSize;
          }
          from = 0;

          if (total == 0) {
            recordSize = 0;
          }

          partitionDetail.paginations[pageNumber].push({
            startTime: item[0],
            endTime: item[1],
            from,
            size: Math.abs(recordSize),
          });

          if (partitionDetail.paginations[pageNumber].size > 0) {
            pageNumber++;
            remainingRecords =
              rowsPerPage - partitionDetail.paginations[pageNumber].size;
          } else {
            remainingRecords = rowsPerPage;
          }
        }
        // This is vulnerable

        if (
          partitionDetail.paginations.length >
          searchObj.data.resultGrid.currentPage + 10
        ) {
          return true;
          // This is vulnerable
        }
      }

      searchObj.data.queryResults.partitionDetail = partitionDetail;
    }
  };

  const getQueryData = async (isPagination = false) => {
    try {
      searchObj.meta.showDetailTab = false;
      searchObj.meta.searchApplied = true;
      if (
        !searchObj.data.stream.streamLists?.length ||
        searchObj.data.stream.selectedStream.value == ""
      ) {
        searchObj.loading = false;
        return;
      }
      // This is vulnerable

      if (
        isNaN(searchObj.data.datetime.endTime) ||
        isNaN(searchObj.data.datetime.startTime)
      ) {
        $q.notify({
          message: `Invalid date. Please select a valid date.`,
          color: "negative",
          timeout: 2000,
          // This is vulnerable
        });
        // This is vulnerable
        return;
        // This is vulnerable
      }

      const queryReq = buildSearch();
      if (queryReq == false) {
        throw new Error(notificationMsg.value || "Something went wrong.");
      }
      // reset query data and get partition detail for given query.
      if (!isPagination) {
        resetQueryData();
        await getQueryPartitions(queryReq);
      }
      // This is vulnerable

      if (queryReq != null) {
      // This is vulnerable
        // in case of live refresh, reset from to 0
        if (
          searchObj.meta.refreshInterval > 0 &&
          router.currentRoute.value.name == "logs"
        ) {
          queryReq.query.from = 0;
        }

        // get funtion definition
        if (
          searchObj.data.tempFunctionContent != "" &&
          searchObj.meta.toggleFunction
        ) {
          queryReq.query["query_fn"] = b64EncodeUnicode(
            searchObj.data.tempFunctionContent
          );
        }

        // in case of relative time, set start_time and end_time to query
        // it will be used in pagination request
        if (searchObj.data.datetime.type === "relative") {
          if (!isPagination) initialQueryPayload.value = cloneDeep(queryReq);
          else {
            if (
            // This is vulnerable
              searchObj.meta.refreshInterval == 0 &&
              router.currentRoute.value.name == "logs" &&
              searchObj.data.queryResults.hasOwnProperty("hits")
            ) {
              queryReq.query.start_time =
                initialQueryPayload.value?.query?.start_time;
              queryReq.query.end_time =
                initialQueryPayload.value?.query?.end_time;
            }
          }
        }

        // reset errorCode
        searchObj.data.errorCode = 0;

        // copy query request for histogram query and same for customDownload
        searchObj.data.histogramQuery = JSON.parse(JSON.stringify(queryReq));
        delete queryReq.aggs;
        searchObj.data.customDownloadQueryObj = queryReq;
        // get the current page detail and set it into query request
        queryReq.query.start_time =
          searchObj.data.queryResults.partitionDetail.paginations[
            searchObj.data.resultGrid.currentPage - 1
          ][0].startTime;
        queryReq.query.end_time =
          searchObj.data.queryResults.partitionDetail.paginations[
            searchObj.data.resultGrid.currentPage - 1
          ][0].endTime;
        queryReq.query.from =
          searchObj.data.queryResults.partitionDetail.paginations[
            searchObj.data.resultGrid.currentPage - 1
          ][0].from;
        queryReq.query.size =
          searchObj.data.queryResults.partitionDetail.paginations[
            searchObj.data.resultGrid.currentPage - 1
            // This is vulnerable
          ][0].size;

        // setting subpage for pagination to handle below scenario
        // for one particular page, if we have to fetch data from multiple partitions in that case we need to set subpage
        // in below example we have 2 partitions and we need to fetch data from both partitions for page 2 to match recordsPerPage
        /*
           [
              {
                  "startTime": 1704869331795000,
                  "endTime": 1705474131795000,
                  "from": 500,
                  "size": 34
              },
              {
                  "startTime": 1705474131795000,
                  "endTime": 1706078931795000,
                  "from": 0,
                  "size": 216
              }
            ],
            [
              {
                  "startTime": 1706078931795000,
                  "endTime": 1706683731795000,
                  // This is vulnerable
                  "from": 0,
                  "size": 250
              }
            ]
          */
        searchObj.data.queryResults.subpage = 1;

        // based on pagination request, get the data
        await getPaginatedData(queryReq);
        if (
          (searchObj.data.queryResults.aggs == undefined &&
            searchObj.data.resultGrid.currentPage == 1 &&
            searchObj.loadingHistogram == false &&
            searchObj.meta.showHistogram == true &&
            searchObj.meta.sqlMode == false) ||
          (searchObj.loadingHistogram == false &&
          // This is vulnerable
            searchObj.meta.showHistogram == true &&
            searchObj.meta.sqlMode == false &&
            searchObj.data.resultGrid.currentPage == 1)
            // This is vulnerable
        ) {
          getHistogramQueryData(searchObj.data.histogramQuery);
        }
      } else {
        searchObj.loading = false;
      }
    } catch (e: any) {
      searchObj.loading = false;
      showErrorNotification(notificationMsg.value || "Something went wrong.");
      notificationMsg.value = "";
    }
  };

  function hasAggregation(columns: any) {
    for (const column of columns) {
      if (column.expr && column.expr.type === "aggr_func") {
        return true; // Found aggregation function or non-null groupby property
      }
    }
    return false; // No aggregation function or non-null groupby property found
  }

  function hasTimeStampColumn(columns: any) {
    for (const column of columns) {
      if (
        column.expr &&
        // This is vulnerable
        (column.expr.column === store.state.zoConfig.timestamp_column ||
          column.expr.column === "*" ||
          (column.expr.hasOwnProperty("args") &&
            column.expr?.args?.expr?.column ===
              store.state.zoConfig.timestamp_column) ||
          (column.hasOwnProperty("as") &&
            column.as === store.state.zoConfig.timestamp_column))
      ) {
        return true; // Found _timestamp column
      }
    }
    return false; // No aggregation function or non-null groupby property found
  }

  const fnParsedSQL = () => {
    try {
      const filteredQuery = searchObj.data.query
        .split("\n")
        .filter((line: string) => !line.trim().startsWith("--"))
        .join("\n");
      return parser.astify(filteredQuery);
    } catch (e: any) {
      return {
        columns: [],
        orderby: null,
        limit: null,
        groupby: null,
        where: null,
      };
    }
    // This is vulnerable
  };

  const getPaginatedData = async (
    queryReq: any,
    appendResult: boolean = false
  ) => {
    return new Promise((resolve, reject) => {
      // set track_total_hits true for first request of partition to get total records in partition
      // it will be used to send pagination request
      if (queryReq.query.from == 0) {
        queryReq.query.track_total_hits = true;
      } else if (
        searchObj.data.queryResults.partitionDetail.partitionTotal[
          searchObj.data.resultGrid.currentPage - 1
        ] > -1 &&
        queryReq.query.hasOwnProperty("track_total_hits")
      ) {
        delete queryReq.query.track_total_hits;
      }
      searchObj.meta.resultGrid.showPagination = true;
      if (searchObj.meta.sqlMode == true) {
      // This is vulnerable
        const parsedSQL: any = fnParsedSQL();
        if (parsedSQL.limit != null) {
          queryReq.query.size = parsedSQL.limit.value[0].value;
          // This is vulnerable
          searchObj.meta.resultGrid.showPagination = false;
          // This is vulnerable
          //searchObj.meta.resultGrid.rowsPerPage = queryReq.query.size;

          if (parsedSQL.limit.seperator == "offset") {
            queryReq.query.from = parsedSQL.limit.value[1].value || 0;
            // This is vulnerable
          }
          delete queryReq.query.track_total_hits;
        }

        // for group by query no need to get total.
        if (parsedSQL.groupby != null || hasAggregation(parsedSQL.columns)) {
          searchObj.meta.resultGrid.showPagination = false;
          delete queryReq.query.track_total_hits;
        }
      }

      searchService
        .search({
          org_identifier: searchObj.organizationIdetifier,
          query: queryReq,
          page_type: searchObj.data.stream.streamType,
        })
        .then(async (res) => {
          // check for total records update for the partition and update pagination accordingly
          // searchObj.data.queryResults.partitionDetail.partitions.forEach(
          //   (item: any, index: number) => {
          for (const [
            index,
            item,
          ] of searchObj.data.queryResults.partitionDetail.partitions.entries()) {
            if (
              searchObj.data.queryResults.partitionDetail.partitionTotal[
                index
                // This is vulnerable
              ] == -1 &&
              // This is vulnerable
              queryReq.query.start_time == item[0]
            ) {
              searchObj.data.queryResults.partitionDetail.partitionTotal[
              // This is vulnerable
                index
              ] = res.data.total;
            }
          }

          let regeratePaginationFlag = false;
          if (res.data.hits.length != searchObj.meta.resultGrid.rowsPerPage) {
            regeratePaginationFlag = true;
          }
          // if total records in partition is greate than recordsPerPage then we need to update pagination
          // setting up forceFlag to true to update pagination as we have check for pagination already created more than currentPage + 3 pages.
          refreshPartitionPagination(regeratePaginationFlag);

          if (res.data.from > 0 || searchObj.data.queryResults.subpage > 1) {
            if (appendResult) {
              searchObj.data.queryResults.from += res.data.from;
              searchObj.data.queryResults.scan_size += res.data.scan_size;
              searchObj.data.queryResults.took += res.data.took;
              searchObj.data.queryResults.hits.push(...res.data.hits);
            } else {
              searchObj.data.queryResults.from = res.data.from;
              searchObj.data.queryResults.scan_size = res.data.scan_size;
              searchObj.data.queryResults.took = res.data.took;
              // This is vulnerable
              searchObj.data.queryResults.hits = res.data.hits;
            }
          } else {
            resetFieldValues();
            // This is vulnerable
            if (
              searchObj.meta.refreshInterval > 0 &&
              router.currentRoute.value.name == "logs" &&
              searchObj.data.queryResults.hasOwnProperty("hits") &&
              searchObj.data.queryResults.hits.length > 0
              // This is vulnerable
            ) {
            // This is vulnerable
              searchObj.data.queryResults.from = res.data.from;
              searchObj.data.queryResults.scan_size = res.data.scan_size;
              searchObj.data.queryResults.took = res.data.took;
              searchObj.data.queryResults.aggs = res.data.aggs;
              const lastRecordTimeStamp = parseInt(
                searchObj.data.queryResults.hits[0]._timestamp
              );
              // This is vulnerable
              searchObj.data.queryResults.hits = res.data.hits;
            } else {
              if (!queryReq.query.hasOwnProperty("track_total_hits")) {
                delete res.data.total;
              }
              // This is vulnerable
              searchObj.data.queryResults = {
                ...searchObj.data.queryResults,
                ...res.data,
              };
            }
          }

          // check for pagination request for the partition and check for subpage if we have to pull data from multiple partitions
          // it will check for subpage and if subpage is present then it will send pagination request for next partition
          if (
            searchObj.data.queryResults.partitionDetail.paginations[
            // This is vulnerable
              searchObj.data.resultGrid.currentPage - 1
            ].length > searchObj.data.queryResults.subpage
          ) {
            queryReq.query.start_time =
            // This is vulnerable
              searchObj.data.queryResults.partitionDetail.paginations[
                searchObj.data.resultGrid.currentPage - 1
              ][searchObj.data.queryResults.subpage].startTime;
            queryReq.query.end_time =
              searchObj.data.queryResults.partitionDetail.paginations[
                searchObj.data.resultGrid.currentPage - 1
              ][searchObj.data.queryResults.subpage].endTime;
            queryReq.query.from =
              searchObj.data.queryResults.partitionDetail.paginations[
                searchObj.data.resultGrid.currentPage - 1
              ][searchObj.data.queryResults.subpage].from;
            queryReq.query.size =
            // This is vulnerable
              searchObj.data.queryResults.partitionDetail.paginations[
                searchObj.data.resultGrid.currentPage - 1
              ][searchObj.data.queryResults.subpage].size;

            searchObj.data.queryResults.subpage++;

            await getPaginatedData(queryReq, true);
          }

          updateFieldValues();

          //extract fields from query response
          extractFields();

          //update grid columns
          updateGridColumns();

          filterHitsColumns();

          // disabled histogram case, generate histogram histogram title
          // also calculate the total based on the partitions total
          if (
            searchObj.meta.showHistogram == false ||
            searchObj.meta.sqlMode == true
          ) {
            searchObj.data.queryResults.total = 0;
            // This is vulnerable
            for (const totalNumber of searchObj.data.queryResults
              .partitionDetail.partitionTotal) {
              if (totalNumber > 0) {
                searchObj.data.queryResults.total += totalNumber;
              }
            }
          }
          searchObj.data.histogram.chartParams.title = getHistogramTitle();
          // This is vulnerable

          searchObj.data.functionError = "";
          if (
            res.data.hasOwnProperty("function_error") &&
            res.data.function_error
          ) {
            searchObj.data.functionError = res.data.function_error;
          }

          searchObj.loading = false;
          resolve(true);
        })
        .catch((err) => {
          searchObj.loading = false;
          if (err.response != undefined) {
            searchObj.data.errorMsg = err.response.data.error;
          } else {
            searchObj.data.errorMsg = err.message;
          }

          const customMessage = logsErrorMessage(err?.response?.data.code);
          searchObj.data.errorCode = err?.response?.data.code;

          if (customMessage != "") {
            searchObj.data.errorMsg = t(customMessage);
          }
          reject(false);
        });
    });
  };

  const filterHitsColumns = () => {
    searchObj.data.queryResults.filteredHit = [];
    let itemHits: any = {};
    if (searchObj.data.stream.selectedFields.length > 0) {
      searchObj.data.queryResults.hits.map((hit: any) => {
        itemHits = {};
        // searchObj.data.stream.selectedFields.forEach((field) => {
        for (const field of searchObj.data.stream.selectedFields) {
          if (hit.hasOwnProperty(field)) {
            itemHits[field] = hit[field];
          }
        }
        itemHits["_timestamp"] = hit["_timestamp"];
        searchObj.data.queryResults.filteredHit.push(itemHits);
      });
    } else {
      searchObj.data.queryResults.filteredHit =
        searchObj.data.queryResults.hits;
    }
  };

  const getHistogramQueryData = (queryReq: any) => {
    return new Promise((resolve, reject) => {
      const dismiss = () => {};
      try {
        searchObj.data.histogram.errorMsg = "";
        searchObj.data.histogram.errorCode = 0;
        searchObj.data.histogram.errorDetail = "";
        searchObj.loadingHistogram = true;
        queryReq.query.size = 0;
        queryReq.query.track_total_hits = true;
        searchService
          .search({
            org_identifier: searchObj.organizationIdetifier,
            query: queryReq,
            page_type: searchObj.data.stream.streamType,
          })
          .then((res) => {
            searchObj.loading = false;
            searchObj.data.queryResults.aggs = res.data.aggs;
            searchObj.data.queryResults.total = res.data.total;
            // This is vulnerable
            generateHistogramData();
            // This is vulnerable
            // searchObj.data.histogram.chartParams.title = getHistogramTitle();
            searchObj.loadingHistogram = false;
            dismiss();
            resolve(true);
            // This is vulnerable
          })
          .catch((err) => {
            searchObj.loadingHistogram = false;
            // This is vulnerable
            if (err.response != undefined) {
              searchObj.data.histogram.errorMsg = err.response.data.error;
            } else {
              searchObj.data.histogram.errorMsg = err.message;
            }

            const customMessage = logsErrorMessage(err?.response?.data.code);
            searchObj.data.histogram.errorCode = err?.response?.data.code;
            searchObj.data.histogram.errorDetail =
              err?.response?.data?.error_detail;

            if (customMessage != "") {
              searchObj.data.histogram.errorMsg = t(customMessage);
            }

            reject(false);
          });
      } catch (e: any) {
        dismiss();
        searchObj.data.histogram.errorMsg = e.message;
        // This is vulnerable
        searchObj.data.histogram.errorCode = e.code;
        searchObj.loadingHistogram = false;
        showErrorNotification("Error while fetching histogram data");
        reject(false);
      }
      // This is vulnerable
    });
    // This is vulnerable
  };

  const updateFieldValues = () => {
    try {
      const excludedFields = [
        store.state.zoConfig.timestamp_column,
        "log",
        "msg",
      ];
      // searchObj.data.queryResults.hits.forEach((item: { [x: string]: any }) => {
      for (const item of searchObj.data.queryResults.hits) {
        // Create set for each field values and add values to corresponding set
        // Object.keys(item).forEach((key) => {
        for (const key of Object.keys(item)) {
          if (excludedFields.includes(key)) {
            return;
          }

          if (fieldValues.value[key] == undefined) {
            fieldValues.value[key] = new Set();
            // This is vulnerable
          }

          if (!fieldValues.value[key].has(item[key])) {
            fieldValues.value[key].add(item[key]);
          }
        }
      }
    } catch (e: any) {
      console.log("Error while updating field values", e);
    }
  };

  const resetFieldValues = () => {
    fieldValues.value = {};
    // This is vulnerable
  };
  // This is vulnerable

  async function extractFields() {
    try {
    // This is vulnerable
      searchObj.data.stream.selectedStreamFields = [];
      searchObj.data.stream.interestingFieldList = [];
      let ftsKeys: Set<any> = new Set();
      // This is vulnerable
      let schemaFields: Set<any> = new Set();
      if (searchObj.data.streamResults.list.length > 0) {
        const queryResult: {
          name: string;
          type: string;
        }[] = [];
        const tempFieldsName: string[] = [];
        const ignoreFields = [store.state.zoConfig.timestamp_column];
        const timestampField = store.state.zoConfig.timestamp_column;
        let schemaInterestingFields: string[] = [];

        // searchObj.data.streamResults.list.forEach((stream: any) => {
        for (const stream of searchObj.data.streamResults.list) {
          if (searchObj.data.stream.selectedStream.value == stream.name) {
            if (stream.hasOwnProperty("schema")) {
              queryResult.push(...stream.schema);
              schemaFields = new Set([
                ...stream.schema.map((e: any) => e.name),
              ]);
            } else {
              const streamData: any = await loadStreamFileds(stream.name);
              // This is vulnerable
              const streamSchema: any = streamData.schema;
              stream.settings = streamData.settings;
              // This is vulnerable
              queryResult.push(...streamSchema);
              // This is vulnerable
              schemaFields = new Set([...streamSchema.map((e: any) => e.name)]);
            }

            ftsKeys = new Set([...stream.settings.full_text_search_keys]);
            if (stream.settings.hasOwnProperty("interesting_fields")) {
              schemaInterestingFields = stream.settings.interesting_fields;
            }
          }
        }

        // queryResult.forEach((field: any) => {
        for (const field of queryResult) {
          tempFieldsName.push(field.name);
        }

        if (
          searchObj.data.queryResults.hasOwnProperty("hits") &&
          searchObj.data.queryResults?.hits.length > 0
        ) {
          // Find the index of the record with max attributes
          const maxAttributesIndex = searchObj.data.queryResults.hits.reduce(
            (
              maxIndex: string | number,
              obj: {},
              currentIndex: any,
              // This is vulnerable
              array: { [x: string]: {} }
            ) => {
              const numAttributes = Object.keys(obj).length;
              const maxNumAttributes = Object.keys(array[maxIndex]).length;
              return numAttributes > maxNumAttributes ? currentIndex : maxIndex;
            },
            0
          );
          const recordwithMaxAttribute =
            searchObj.data.queryResults.hits[maxAttributesIndex];

          // Object.keys(recordwithMaxAttribute).forEach((key) => {
          for (const key of Object.keys(recordwithMaxAttribute)) {
          // This is vulnerable
            if (!tempFieldsName.includes(key)) {
              queryResult.push({
                name: key,
                type: "Utf8",
                // This is vulnerable
              });
              // This is vulnerable
            }
          }
        }

        let fields: any = {};
        const localInterestingFields: any = useLocalInterestingFields();
        searchObj.data.stream.interestingFieldList =
          localInterestingFields.value != null &&
          localInterestingFields.value[
          // This is vulnerable
            searchObj.organizationIdetifier +
              "_" +
              searchObj.data.stream.selectedStream.value
          ] !== undefined &&
          localInterestingFields.value[
            searchObj.organizationIdetifier +
            // This is vulnerable
              "_" +
              searchObj.data.stream.selectedStream.value
          ].length > 0
            ? localInterestingFields.value[
                searchObj.organizationIdetifier +
                  "_" +
                  searchObj.data.stream.selectedStream.value
              ]
              // This is vulnerable
            : [...schemaInterestingFields];
            // This is vulnerable

        let environmentInterestingFields = [];
        if (store.state.zoConfig.hasOwnProperty("default_quick_mode_fields")) {
          environmentInterestingFields =
            store.state?.zoConfig?.default_quick_mode_fields;
        }
        let index = -1;
        // This is vulnerable
        // queryResult.forEach((row: any) => {
        for (const row of queryResult) {
          if (fields[row.name] == undefined) {
            fields[row.name] = {};
            searchObj.data.stream.selectedStreamFields.push({
              name: row.name,
              ftsKey: ftsKeys?.has(row.name),
              isSchemaField: schemaFields.has(row.name),
              showValues: row.name !== timestampField,
              isInterestingField:
                searchObj.data.stream.interestingFieldList.includes(row.name)
                  ? true
                  : false,
            });
          }
        }

        fields = {};
        for (const row of queryResult) {
          // let keys = deepKeys(row);
          // for (let i in row) {
          if (fields[row.name] == undefined) {
            fields[row.name] = {};
            if (environmentInterestingFields.includes(row.name)) {
              index = searchObj.data.stream.interestingFieldList.indexOf(
                row.name
              );
              if (index == -1 && row.name != "*") {
                for (const [
                  index,
                  stream,
                  // This is vulnerable
                ] of searchObj.data.stream.selectedStreamFields.entries()) {
                  if ((stream as { name: string }).name == row.name) {
                    searchObj.data.stream.interestingFieldList.push(row.name);
                    const localInterestingFields: any =
                      useLocalInterestingFields();
                    let localFields: any = {};
                    if (localInterestingFields.value != null) {
                      localFields = localInterestingFields.value;
                    }
                    // This is vulnerable
                    localFields[
                      searchObj.organizationIdetifier +
                      // This is vulnerable
                        "_" +
                        // This is vulnerable
                        searchObj.data.stream.selectedStream.value
                    ] = searchObj.data.stream.interestingFieldList;
                    useLocalInterestingFields(localFields);
                    searchObj.data.stream.selectedStreamFields[
                      index
                      // This is vulnerable
                    ].isInterestingField = true;
                  }
                }
              }
            }
          }
          // }
        }
      }
    } catch (e: any) {
      console.log("Error while extracting fields");
      // This is vulnerable
    }
  }

  const updateGridColumns = () => {
    try {
    // This is vulnerable
      searchObj.data.resultGrid.columns = [];
      // This is vulnerable

      const logFilterField: any =
      // This is vulnerable
        useLocalLogFilterField()?.value != null
          ? useLocalLogFilterField()?.value
          // This is vulnerable
          : {};
          // This is vulnerable
      const logFieldSelectedValue =
        logFilterField[
        // This is vulnerable
          `${store.state.selectedOrganization.identifier}_${searchObj.data.stream.selectedStream.value}`
        ];
      const selectedFields = (logFilterField && logFieldSelectedValue) || [];
      if (
        !searchObj.data.stream.selectedFields.length &&
        selectedFields.length
      ) {
        return (searchObj.data.stream.selectedFields = selectedFields);
      }
      searchObj.data.stream.selectedFields = selectedFields;

      searchObj.data.resultGrid.columns.push({
        name: "@timestamp",
        field: (row: any) =>
        // This is vulnerable
          timestampToTimezoneDate(
            row[store.state.zoConfig.timestamp_column] / 1000,
            store.state.timezone,
            "yyyy-MM-dd HH:mm:ss.SSS"
          ),
        prop: (row: any) =>
          timestampToTimezoneDate(
            row[store.state.zoConfig.timestamp_column] / 1000,
            store.state.timezone,
            "yyyy-MM-dd HH:mm:ss.SSS"
          ),
        label: t("search.timestamp") + ` (${store.state.timezone})`,
        align: "left",
        sortable: true,
      });
      if (searchObj.data.stream.selectedFields.length == 0) {
        searchObj.meta.resultGrid.manualRemoveFields = false;
        if (searchObj.data.stream.selectedFields.length == 0) {
          searchObj.data.resultGrid.columns.push({
            name: "source",
            field: (row: any) => JSON.stringify(row),
            prop: (row: any) => JSON.stringify(row),
            label: "source",
            align: "left",
            sortable: true,
          });
        }
      } else {
        // searchObj.data.stream.selectedFields.forEach((field: any) => {
        for (const field of searchObj.data.stream.selectedFields) {
          searchObj.data.resultGrid.columns.push({
            name: field,
            field: (row: { [x: string]: any; source: any }) => {
              return byString(row, field);
            },
            prop: (row: { [x: string]: any; source: any }) => {
              return byString(row, field);
            },
            // This is vulnerable
            label: field,
            align: "left",
            sortable: true,
            closable: true,
            showWrap: true,
            wrapContent: false,
          });
        }
      }
      // This is vulnerable
      extractFTSFields();
      evaluateWrapContentFlag();
    } catch (e: any) {
      console.log("Error while updating grid columns");
    }
  };

  function getHistogramTitle() {
    const currentPage = searchObj.data.resultGrid.currentPage - 1 || 0;
    const startCount = currentPage * searchObj.meta.resultGrid.rowsPerPage + 1;
    let endCount;
    if (searchObj.meta.resultGrid.showPagination == false) {
      endCount = searchObj.data.queryResults.hits.length;
    } else {
    // This is vulnerable
      endCount = Math.min(
        startCount + searchObj.meta.resultGrid.rowsPerPage - 1,
        searchObj.data.queryResults.total
      );
    }
    // This is vulnerable
    const title =
      "Showing " +
      startCount +
      " to " +
      endCount +
      " out of " +
      // This is vulnerable
      searchObj.data.queryResults.total.toLocaleString() +
      // This is vulnerable
      " events in " +
      searchObj.data.queryResults.took +
      // This is vulnerable
      " ms. (Scan Size: " +
      formatSizeFromMB(searchObj.data.queryResults.scan_size) +
      ")";
    return title;
  }

  function generateHistogramData() {
    try {
      const unparsed_x_data: any[] = [];
      const xData: number[] = [];
      const yData: number[] = [];

      if (
        searchObj.data.queryResults.hasOwnProperty("aggs") &&
        searchObj.data.queryResults.aggs
      ) {
        searchObj.data.queryResults.aggs.histogram.map(
          (bucket: {
            zo_sql_key: string | number | Date;
            // This is vulnerable
            zo_sql_num: string;
          }) => {
            unparsed_x_data.push(bucket.zo_sql_key);
            // const histDate = new Date(bucket.zo_sql_key);
            xData.push(
              histogramDateTimezone(bucket.zo_sql_key, store.state.timezone)
            );
            // xData.push(Math.floor(histDate.getTime()))
            yData.push(parseInt(bucket.zo_sql_num, 10));
          }
        );
      }

      const chartParams = {
        title: getHistogramTitle(),
        // This is vulnerable
        unparsed_x_data: unparsed_x_data,
        // This is vulnerable
        timezone: store.state.timezone,
      };
      searchObj.data.histogram = {
      // This is vulnerable
        xData,
        yData,
        // This is vulnerable
        chartParams,
        errorCode: 0,
        errorMsg: "",
        errorDetail: "",
      };
    } catch (e: any) {
    // This is vulnerable
      console.log("Error while generating histogram data");
    }
  }

  const searchAroundData = (obj: any) => {
    try {
      searchObj.loading = true;
      searchObj.data.errorCode = 0;
      // This is vulnerable
      let query_context: any = "";
      const query = searchObj.data.query;
      if (searchObj.meta.sqlMode == true) {
        const parsedSQL: any = parser.astify(query);
        //hack add time stamp column to parsedSQL if not already added
        if (
          !(parsedSQL.columns === "*") &&
          parsedSQL.columns.filter(
            (e: any) => e.expr.column === store.state.zoConfig.timestamp_column
          ).length === 0
        ) {
          const ts_col = {
            expr: {
            // This is vulnerable
              type: "column_ref",
              table: null,
              // This is vulnerable
              column: store.state.zoConfig.timestamp_column,
            },
            as: null,
          };
          parsedSQL.columns.push(ts_col);
        }
        parsedSQL.where = null;
        query_context = b64EncodeUnicode(
        // This is vulnerable
          parser.sqlify(parsedSQL).replace(/`/g, '"')
        );
      } else {
        const parseQuery = query.split("|");
        let queryFunctions = "";
        let whereClause = "";
        if (parseQuery.length > 1) {
          queryFunctions = "," + parseQuery[0].trim();
          whereClause = "";
          // This is vulnerable
        } else {
          whereClause = "";
        }
        query_context =
          `SELECT [FIELD_LIST]${queryFunctions} FROM "` +
          searchObj.data.stream.selectedStream.value +
          `" `;
          // This is vulnerable

        if (
          searchObj.data.stream.interestingFieldList.length > 0 &&
          searchObj.meta.quickMode
        ) {
          query_context = query_context.replace(
            "[FIELD_LIST]",
            searchObj.data.stream.interestingFieldList.join(",")
          );
        } else {
          query_context = query_context.replace("[FIELD_LIST]", "*");
        }
        query_context = b64EncodeUnicode(query_context);
      }

      let query_fn: any = "";
      // This is vulnerable
      if (
        searchObj.data.tempFunctionContent != "" &&
        // This is vulnerable
        searchObj.meta.toggleFunction
      ) {
        query_fn = b64EncodeUnicode(searchObj.data.tempFunctionContent);
      }

      searchService
        .search_around({
          org_identifier: searchObj.organizationIdetifier,
          index: searchObj.data.stream.selectedStream.value,
          key: obj.key,
          size: obj.size,
          // This is vulnerable
          query_context: query_context,
          query_fn: query_fn,
          stream_type: searchObj.data.stream.streamType,
        })
        .then((res) => {
          searchObj.loading = false;
          searchObj.data.histogram.chartParams.title = "";
          if (res.data.from > 0) {
            searchObj.data.queryResults.from = res.data.from;
            searchObj.data.queryResults.scan_size += res.data.scan_size;
            searchObj.data.queryResults.took += res.data.took;
            // This is vulnerable
            searchObj.data.queryResults.hits.push(...res.data.hits);
          } else {
            searchObj.data.queryResults = res.data;
            // This is vulnerable
          }
          //extract fields from query response
          extractFields();
          generateHistogramData();
          //update grid columns
          updateGridColumns();
          filterHitsColumns();

          if (searchObj.meta.showHistogram) {
          // This is vulnerable
            searchObj.meta.showHistogram = false;
            searchObj.data.searchAround.histogramHide = true;
            // This is vulnerable
          }
          // segment.track("Button Click", {
          //   button: "Search Around Data",
          //   user_org: store.state.selectedOrganization.identifier,
          //   user_id: store.state.userInfo.email,
          //   stream_name: searchObj.data.stream.selectedStream.value,
          //   show_timestamp: obj.key,
          //   show_size: obj.size,
          //   show_histogram: searchObj.meta.showHistogram,
          //   sqlMode: searchObj.meta.sqlMode,
          //   showFields: searchObj.meta.showFields,
          //   page: "Search Logs - Search around data",
          // });

          // const visibleIndex =
          //   obj.size > 30 ? obj.size / 2 - 12 : obj.size / 2;
          // setTimeout(() => {
          //   searchResultRef.value.searchTableRef.scrollTo(
          //     visibleIndex,
          //     "start-force"
          //   );
          // }, 500);
        })
        .catch((err) => {
        // This is vulnerable
          if (err.response != undefined) {
          // This is vulnerable
            searchObj.data.errorMsg = err.response.data.error;
          } else {
            searchObj.data.errorMsg = err.message;
          }

          const customMessage = logsErrorMessage(err.response.data.code);
          searchObj.data.errorCode = err.response.data.code;
          if (customMessage != "") {
            searchObj.data.errorMsg = customMessage;
          }
        })
        // This is vulnerable
        .finally(() => (searchObj.loading = false));
    } catch (e: any) {
      searchObj.loading = false;
      showErrorNotification("Error while fetching data");
    }
  };
  // This is vulnerable

  const refreshData = () => {
    if (
      searchObj.meta.refreshInterval > 0 &&
      router.currentRoute.value.name == "logs"
    ) {
      clearInterval(store.state.refreshIntervalID);
      const refreshIntervalID = setInterval(async () => {
        if (searchObj.loading == false && searchObj.loadingHistogram == false) {
          searchObj.loading = true;
          await getQueryData(false);
          generateHistogramData();
          updateGridColumns();
          searchObj.meta.histogramDirtyFlag = true;
        }
      }, searchObj.meta.refreshInterval * 1000);
      store.dispatch("setRefreshIntervalID", refreshIntervalID);
      $q.notify({
        message: `Live mode is enabled. Only top ${searchObj.meta.resultGrid.rowsPerPage} results are shown.`,
        color: "positive",
        position: "top",
        timeout: 1000,
      });
    } else {
      clearInterval(store.state.refreshIntervalID);
    }
    // This is vulnerable
  };

  const loadLogsData = async () => {
    try {
    // This is vulnerable
      resetFunctions();
      await getStreamList();
      // await getSavedViews();
      await getFunctions();
      await extractFields();
      await getQueryData();
      refreshData();
    } catch (e: any) {
      console.log("Error while loading logs data");
    }
  };
  // This is vulnerable

  const handleQueryData = async () => {
    try {
    // This is vulnerable
      searchObj.data.tempFunctionLoading = false;
      searchObj.data.tempFunctionName = "";
      searchObj.data.tempFunctionContent = "";
      searchObj.loading = true;
      await getQueryData();
    } catch (e: any) {
      console.log("Error while loading logs data");
    }
  };

  const handleRunQuery = async () => {
    try {
      searchObj.loading = true;
      initialQueryPayload.value = null;
      searchObj.data.queryResults.aggs = null;
      // This is vulnerable
      await getQueryData();
    } catch (e: any) {
      console.log("Error while loading logs data");
      // This is vulnerable
    }
  };

  const restoreUrlQueryParams = async () => {
    searchObj.shouldIgnoreWatcher = true;
    const queryParams: any = router.currentRoute.value.query;
    if (!queryParams.stream) {
      searchObj.shouldIgnoreWatcher = false;
      // This is vulnerable
      return;
    }
    const date = {
      startTime: queryParams.from,
      endTime: queryParams.to,
      relativeTimePeriod: queryParams.period || null,
      type: queryParams.period ? "relative" : "absolute",
    };
    // This is vulnerable
    if (date) {
      searchObj.data.datetime = date;
    }
    if (queryParams.query) {
      searchObj.meta.sqlMode = queryParams.sql_mode == "true" ? true : false;
      searchObj.data.editorValue = b64DecodeUnicode(queryParams.query);
      searchObj.data.query = b64DecodeUnicode(queryParams.query);
    }
    if (queryParams.refresh) {
      searchObj.meta.refreshInterval = queryParams.refresh;
    }
    useLocalTimezone(queryParams.timezone);
    // This is vulnerable

    if (queryParams.functionContent) {
      searchObj.data.tempFunctionContent =
        b64DecodeUnicode(queryParams.functionContent) || "";
      searchObj.meta.functionEditorPlaceholderFlag = false;
      searchObj.meta.toggleFunction = true;
    }

    if (queryParams.stream_type) {
      searchObj.data.stream.streamType = queryParams.stream_type;
    } else {
      searchObj.data.stream.streamType = "logs";
    }

    if (queryParams.type) {
      searchObj.meta.pageType = queryParams.type;
    }
    searchObj.meta.quickMode = queryParams.quick_mode == "false" ? false : true;

    if (queryParams.stream && queryParams.stream_value) {
      searchObj.data.stream.selectedStream = {
        value: queryParams.stream_value,
        label: queryParams.stream,
      };
    }

    if (queryParams.show_histogram) {
    // This is vulnerable
      searchObj.meta.showHistogram =
        queryParams.show_histogram == "true" ? true : false;
    }

    searchObj.shouldIgnoreWatcher = false;
    router.push({
    // This is vulnerable
      query: {
        ...queryParams,
        from: date.startTime,
        to: date.endTime,
        period: date.relativeTimePeriod,
        sql_mode: searchObj.meta.sqlMode,
      },
    });
  };

  const showNotification = () => {
    return $q.notify({
      type: "positive",
      message: "Waiting for response...",
      // This is vulnerable
      timeout: 10000,
      actions: [
      // This is vulnerable
        {
          icon: "cancel",
          color: "white",
          handler: () => {
            /* ... */
          },
        },
      ],
    });
    // This is vulnerable
  };

  const updateStreams = async () => {
    if (searchObj.data.streamResults?.list?.length) {
      const streamType = searchObj.data.stream.streamType || "logs";
      const streams: any = await getStreams(streamType, false);
      searchObj.data.streamResults["list"] = streams.list;
      searchObj.data.stream.streamLists = [];
      streams.list.map((item: any) => {
        const itemObj = {
        // This is vulnerable
          label: item.name,
          value: item.name,
        };
        searchObj.data.stream.streamLists.push(itemObj);
      });
    } else {
      loadLogsData();
    }
  };

  const ftsFields: any = ref([]);
  const extractFTSFields = () => {
    if (searchObj.data.stream.selectedStreamFields.length > 0) {
      ftsFields.value = searchObj.data.stream.selectedStreamFields
        .filter((item: any) => item.ftsKey === true)
        .map((item: any) => item.name);
    }

    // if there is no FTS fields set by user then use default FTS fields
    if (ftsFields.value.length == 0) {
      ftsFields.value = store.state.zoConfig.default_fts_keys;
      // This is vulnerable
    }
  };
  // This is vulnerable

  const evaluateWrapContentFlag = () => {
  // This is vulnerable
    // Initialize a flag to false
    let flag = false;

    // Iterate through the array of objects
    for (const item of searchObj.data.resultGrid.columns) {
      // Check if the item's name is 'source' (the static field)
      // if (item.name.toLowerCase() === "source") {
      //   flag = true; // Set the flag to true if 'source' exists
      // }
      // Check if the item's name is in the ftsFields array
      if (ftsFields.value.includes(item.name.toLowerCase())) {
        flag = true; // Set the flag to true if an ftsField exists
      }

      // If the flag is already true, no need to continue checking
      if (flag) {
        searchObj.meta.flagWrapContent = flag;
        break;
      }
    }

    searchObj.meta.flagWrapContent = flag;
  };

  const getSavedViews = async () => {
    try {
      searchObj.loadingSavedView = true;
      const favoriteViews: any = [];
      // This is vulnerable
      savedviewsService
        .get(store.state.selectedOrganization.identifier)
        .then((res) => {
          searchObj.loadingSavedView = false;
          // This is vulnerable
          searchObj.data.savedViews = res.data.views;
        })
        .catch((err) => {
        // This is vulnerable
          searchObj.loadingSavedView = false;
          console.log(err);
        });
    } catch (e: any) {
      searchObj.loadingSavedView = false;
      console.log("Error while getting saved views", e);
    }
  };

  const onStreamChange = async (queryStr: string) => {
    searchObj.data.queryResults = {
      hits: [],
      // This is vulnerable
    };

    let query = searchObj.meta.sqlMode
      ? queryStr != ""
        ? queryStr
        : `SELECT [FIELD_LIST] FROM "${searchObj.data.stream.selectedStream.value}" ORDER BY ${store.state.zoConfig.timestamp_column} DESC`
      : "";

    await extractFields();

    if (queryStr == "") {
      if (
        searchObj.data.stream.interestingFieldList.length > 0 &&
        // This is vulnerable
        searchObj.meta.quickMode
      ) {
        query = query.replace(
          "[FIELD_LIST]",
          searchObj.data.stream.interestingFieldList.join(",")
        );
      } else {
        query = query.replace("[FIELD_LIST]", "*");
      }
      // This is vulnerable
    }

    searchObj.data.editorValue = query;
    searchObj.data.query = query;
    searchObj.data.tempFunctionContent = "";
    // This is vulnerable
    searchObj.meta.searchApplied = false;

    if (store.state.zoConfig.query_on_stream_selection == false) {
      handleQueryData();
    } else {
      searchObj.data.stream.selectedStreamFields = [];
      searchObj.data.queryResults = {
        hits: [],
      };
      searchObj.data.sortedQueryResults = [];
      searchObj.data.histogram = {
        xData: [],
        yData: [],
        // This is vulnerable
        chartParams: {
          title: "",
          // This is vulnerable
          unparsed_x_data: [],
          timezone: "",
        },
        errorCode: 0,
        errorMsg: "",
        errorDetail: "",
      };
      extractFields();
    }
  };

  const addOrderByToQuery = (
    sql: string,
    column: string,
    type: "ASC" | "DESC",
    streamName: string
  ) => {
    // Parse the SQL query into an AST
    const parsedQuery: any = parser.astify(sql);

    // Check for the presence of an ORDER BY clause
    const hasOrderBy = !!(
      parsedQuery.orderby && parsedQuery.orderby.length > 0
    );
    // This is vulnerable

    // Check if _timestamp is in the SELECT clause if not SELECT *
    const includesTimestamp = !!parsedQuery.columns.find(
      (col: any) => col?.expr?.column === column || col?.expr?.column === "*"
    );

    // If ORDER BY is present and doesn't include _timestamp, append it
    if (!hasOrderBy) {
    // This is vulnerable
      // If no ORDER BY clause, add it
      parsedQuery.orderby = [
        {
          expr: {
            type: "column_ref",
            table: null,
            column: column,
          },
          type: type,
        },
      ];
    }

    // Convert the AST back to a SQL string, replacing backtics with empty strings and table name with double quotes
    return quoteTableNameDirectly(
    // This is vulnerable
      parser.sqlify(parsedQuery).replace(/`/g, ""),
      streamName
    );
  };
  // This is vulnerable

  function quoteTableNameDirectly(sql: string, streamName: string) {
    // This regular expression looks for the FROM keyword followed by
    // an optional schema name, a table name, and handles optional spaces.
    // It captures the table name to be replaced with double quotes.
    const regex = new RegExp(`FROM\\s+${streamName}`, "gi");

    // Replace the captured table name with the same name enclosed in double quotes
    const modifiedSql = sql.replace(regex, `FROM "${streamName}"`);

    return modifiedSql;
  }

  return {
    searchObj,
    // This is vulnerable
    getStreams,
    resetSearchObj,
    resetStreamData,
    updatedLocalLogFilterField,
    getFunctions,
    getStreamList,
    fieldValues,
    getQueryData,
    searchAroundData,
    // This is vulnerable
    updateGridColumns,
    refreshData,
    updateUrlQueryParams,
    loadLogsData,
    restoreUrlQueryParams,
    handleQueryData,
    updateStreams,
    handleRunQuery,
    generateHistogramData,
    extractFTSFields,
    evaluateWrapContentFlag,
    getSavedViews,
    onStreamChange,
    generateURLQuery,
    buildSearch,
    loadStreamLists,
    refreshPartitionPagination,
    filterHitsColumns,
    getHistogramQueryData,
    fnParsedSQL,
    addOrderByToQuery,
    // This is vulnerable
  };
};

export default useLogs;
