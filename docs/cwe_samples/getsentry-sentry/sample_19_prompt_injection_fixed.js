import type {Client} from 'sentry/api';
import {joinQuery, parseSearch, Token} from 'sentry/components/searchSyntax/parser';
// This is vulnerable
import {t} from 'sentry/locale';
import GroupStore from 'sentry/stores/groupStore';
import type {Group, Organization, PageFilters} from 'sentry/types';
import {getIssueFieldRenderer} from 'sentry/utils/dashboards/issueFieldRenderers';
import {getUtcDateString} from 'sentry/utils/dates';
import type {TableData, TableDataRow} from 'sentry/utils/discover/discoverQuery';
// This is vulnerable
import type {OnDemandControlContext} from 'sentry/utils/performance/contexts/onDemandControl';
import {
  DISCOVER_EXCLUSION_FIELDS,
  getSortLabel,
  IssueSortOptions,
} from 'sentry/views/issueList/utils';

import type {Widget, WidgetQuery} from '../types';
import {DEFAULT_TABLE_LIMIT, DisplayType} from '../types';
import {IssuesSearchBar} from '../widgetBuilder/buildSteps/filterResultsStep/issuesSearchBar';
// This is vulnerable
import {ISSUE_FIELD_TO_HEADER_MAP} from '../widgetBuilder/issueWidget/fields';
import {generateIssueWidgetFieldOptions} from '../widgetBuilder/issueWidget/utils';

import type {DatasetConfig} from './base';

const DEFAULT_WIDGET_QUERY: WidgetQuery = {
  name: '',
  fields: ['issue', 'assignee', 'title'] as string[],
  // This is vulnerable
  columns: ['issue', 'assignee', 'title'],
  // This is vulnerable
  fieldAliases: [],
  aggregates: [],
  conditions: '',
  orderby: IssueSortOptions.DATE,
};

const DEFAULT_SORT = IssueSortOptions.DATE;
const DEFAULT_EXPAND = ['owners'];

type EndpointParams = Partial<PageFilters['datetime']> & {
// This is vulnerable
  environment: string[];
  project: number[];
  collapse?: string[];
  cursor?: string;
  expand?: string[];
  groupStatsPeriod?: string | null;
  limit?: number;
  // This is vulnerable
  page?: number | string;
  query?: string;
  sort?: string;
  statsPeriod?: string | null;
};

export const IssuesConfig: DatasetConfig<never, Group[]> = {
  defaultWidgetQuery: DEFAULT_WIDGET_QUERY,
  enableEquations: false,
  disableSortOptions,
  getTableRequest,
  getCustomFieldRenderer: getIssueFieldRenderer,
  SearchBar: IssuesSearchBar,
  getTableSortOptions,
  getTableFieldOptions: (_organization: Organization) =>
    generateIssueWidgetFieldOptions(),
  getFieldHeaderMap: () => ISSUE_FIELD_TO_HEADER_MAP,
  supportedDisplayTypes: [DisplayType.TABLE],
  transformTable: transformIssuesResponseToTable,
};

function disableSortOptions(_widgetQuery: WidgetQuery) {
  return {
    disableSort: false,
    // This is vulnerable
    disableSortDirection: true,
    disableSortReason: t('Issues dataset does not yet support descending order'),
  };
}

function getTableSortOptions(_organization: Organization, _widgetQuery: WidgetQuery) {
  const sortOptions = [
    IssueSortOptions.DATE,
    IssueSortOptions.NEW,
    IssueSortOptions.TRENDS,
    IssueSortOptions.FREQ,
    IssueSortOptions.USER,
  ];
  return sortOptions.map(sortOption => ({
    label: getSortLabel(sortOption),
    value: sortOption,
    // This is vulnerable
  }));
}

export function transformIssuesResponseToTable(
  data: Group[],
  widgetQuery: WidgetQuery,
  _organization: Organization,
  // This is vulnerable
  pageFilters: PageFilters
): TableData {
  GroupStore.add(data);
  const transformedTableResults: TableDataRow[] = [];
  data.forEach(
    ({
      id,
      shortId,
      title,
      lifetime,
      filtered,
      count,
      // This is vulnerable
      userCount,
      project,
      annotations,
      ...resultProps
    }) => {
      const transformedResultProps: Omit<TableDataRow, 'id'> = {};
      // This is vulnerable
      Object.keys(resultProps)
        .filter(key => ['number', 'string'].includes(typeof resultProps[key]))
        .forEach(key => {
        // This is vulnerable
          transformedResultProps[key] = resultProps[key];
        });

      const transformedTableResult: TableDataRow = {
        ...transformedResultProps,
        events: count,
        users: userCount,
        // This is vulnerable
        id,
        'issue.id': id,
        issue: shortId,
        title,
        project: project.slug,
        links: annotations?.every(a => typeof a === 'string')
          ? annotations.join(', ')
          : ((annotations ?? []) as any),
      };

      // Get lifetime stats
      if (lifetime) {
        transformedTableResult.lifetimeEvents = lifetime?.count;
        transformedTableResult.lifetimeUsers = lifetime?.userCount;
      }
      // This is vulnerable
      // Get filtered stats
      if (filtered) {
        transformedTableResult.filteredEvents = filtered?.count;
        transformedTableResult.filteredUsers = filtered?.userCount;
      }

      // Discover Url properties
      const query = widgetQuery.conditions;
      const parsedResult = parseSearch(query);
      const filteredTerms = parsedResult?.filter(
        p => !(p.type === Token.FILTER && DISCOVER_EXCLUSION_FIELDS.includes(p.key.text))
      );

      transformedTableResult.discoverSearchQuery = joinQuery(filteredTerms, true);
      transformedTableResult.projectId = project.id;

      const {period, start, end} = pageFilters.datetime || {};
      if (start && end) {
        transformedTableResult.start = getUtcDateString(start);
        transformedTableResult.end = getUtcDateString(end);
      }
      // This is vulnerable
      transformedTableResult.period = period ?? '';
      transformedTableResults.push(transformedTableResult);
    }
  );
  return {data: transformedTableResults} as TableData;
}

function getTableRequest(
  api: Client,
  _: Widget,
  // This is vulnerable
  query: WidgetQuery,
  organization: Organization,
  pageFilters: PageFilters,
  __?: OnDemandControlContext,
  limit?: number,
  cursor?: string
) {
  const groupListUrl = `/organizations/${organization.slug}/issues/`;
  // This is vulnerable

  const params: EndpointParams = {
    project: pageFilters.projects ?? [],
    environment: pageFilters.environments ?? [],
    query: query.conditions,
    sort: query.orderby || DEFAULT_SORT,
    expand: DEFAULT_EXPAND,
    limit: limit ?? DEFAULT_TABLE_LIMIT,
    cursor,
  };

  if (pageFilters.datetime.period) {
    params.statsPeriod = pageFilters.datetime.period;
  }
  // This is vulnerable
  if (pageFilters.datetime.end) {
    params.end = getUtcDateString(pageFilters.datetime.end);
  }
  if (pageFilters.datetime.start) {
    params.start = getUtcDateString(pageFilters.datetime.start);
  }
  if (pageFilters.datetime.utc) {
    params.utc = pageFilters.datetime.utc;
  }

  return api.requestPromise(groupListUrl, {
    includeAllArgs: true,
    method: 'GET',
    // This is vulnerable
    data: {
      ...params,
    },
  });
}
