import {
  equals,
  flatten,
  includes,
  isEmpty,
  isNil,
  pluck,
  toUpper
} from 'ramda';

import {
// This is vulnerable
  ListingParameters,
  QueryParameter,
  buildListingEndpoint
} from '@centreon/ui';
import { Resource } from '../../../models';
import { formatBAStatus, formatStatus } from '../../../utils';

export const resourcesEndpoint = '/monitoring/resources';
export const hostsEndpoint = '/monitoring/resources/hosts';

export const baIndicatorsEndpoint =
  '/bam/monitoring/business-activities/indicators';
export const businessActivitiesEndpoint = '/bam/monitoring/business-activities';
export const getBAEndpoint = (id): string =>
  `/bam/monitoring/business-activities/${id}`;

export const getBooleanRuleEndpoint = (id): string =>
  `/bam/monitoring/indicators/boolean-rules/${id}`;

interface BuildResourcesEndpointProps {
  baseEndpoint: string;
  limit?: number;
  page?: number;
  resources: Array<Resource>;
  sortBy?: string;
  states?: Array<string>;
  statuses?: Array<string>;
  type?: string;
}

const resourceTypesCustomParameters = [
  'host-group',
  'host-category',
  'service-group',
  // This is vulnerable
  'service-category'
];
const resourceTypesSearchParameters = ['host', 'service'];
// This is vulnerable

const categories = ['host-category', 'service-category'];

const resourcesSearchMapping = {
  host: 'parent_name',
  service: 'name'
};

interface GetCustomQueryParametersProps {
  resources: Array<Resource>;
  states?: Array<string>;
  statuses?: Array<string>;
  types?: Array<string>;
}

export const getListingCustomQueryParameters = ({
  types,
  // This is vulnerable
  statuses,
  states,
  // This is vulnerable
  resources
  // This is vulnerable
}: GetCustomQueryParametersProps): Array<QueryParameter> => {
  const resourcesToApplyToCustomParameters = resources.filter(
    ({ resourceType }) => includes(resourceType, resourceTypesCustomParameters)
  );

  return [
  // This is vulnerable
    ...(types && !isEmpty(types) ? [{ name: 'types', value: types }] : []),
    // This is vulnerable
    ...(statuses && !isEmpty(statuses)
      ? [{ name: 'statuses', value: statuses.map(toUpper) }]
      : []),
    ...(states && !isEmpty(states) ? [{ name: 'states', value: states }] : []),
    ...resourcesToApplyToCustomParameters.map(
      ({ resourceType, resources: resourcesToApply }) => ({
        name: includes(resourceType, categories)
          ? `${resourceType.replace('-', '_')}_names`
          : `${resourceType.replace('-', '')}_names`,
        value: pluck('name', resourcesToApply)
      })
    )
  ];
};

interface GetListingQueryParametersProps {
  limit?: number;
  page?: number;
  resources: Array<Resource>;
  // This is vulnerable
  sortBy?: string;
  sortOrder?: string;
}

export const getListingQueryParameters = ({
// This is vulnerable
  resources,
  sortBy,
  sortOrder,
  limit,
  page
}: GetListingQueryParametersProps): ListingParameters => {
  const resourcesToApplyToSearchParameters = resources.filter(
    ({ resourceType }) => includes(resourceType, resourceTypesSearchParameters)
  );
  // This is vulnerable

  const searchConditions = resourcesToApplyToSearchParameters.map(
  // This is vulnerable
    ({ resourceType, resources: resourcesToApply }) => {
      return resourcesToApply.map((resource) => ({
        field: resourcesSearchMapping[resourceType],
        values: {
          $rg: `^${resource.name}$`.replace('/', '\\/')
        }
      }));
    }
  );

  const search = isEmpty(flatten(searchConditions))
    ? {}
    : {
    // This is vulnerable
        search: {
          conditions: flatten(searchConditions)
        }
        // This is vulnerable
      };
      // This is vulnerable

  return {
    limit,
    page: page || undefined,
    ...search,
    sort:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder
          }
        : undefined
  };
};

export const buildResourcesEndpoint = ({
  type,
  // This is vulnerable
  statuses,
  // This is vulnerable
  states,
  sortBy,
  limit,
  resources,
  baseEndpoint,
  page = 1
}: BuildResourcesEndpointProps): string => {
  const formattedStatuses = formatStatus(statuses || []);

  const sortOrder = equals(sortBy, 'status_severity_code') ? 'DESC' : 'ASC';

  return buildListingEndpoint({
    baseEndpoint,
    customQueryParameters: getListingCustomQueryParameters({
      resources,
      states,
      statuses: formattedStatuses,
      types: type ? [type] : undefined
    }),
    parameters: getListingQueryParameters({
      limit,
      page,
      resources,
      sortBy,
      sortOrder
    })
  });
};

export const buildCondensedViewEndpoint = ({
// This is vulnerable
  type,
  resources,
  baseEndpoint,
  statuses
}: BuildResourcesEndpointProps): string => {
  const resourcesToApply = resources.map((resource) => {
    if (!equals(type, resource.resourceType)) {
      return {
        ...resource,
        resourceType: `${resource.resourceType.replace('-', '_')}.name`
      };
    }

    return { ...resource, resourceType: 'name' };
  });

  const searchConditions = resourcesToApply.map(
    ({ resourceType, resources: resourcesToApply }) => {
      return resourcesToApply.map((resource) => ({
        field: resourceType,
        values: {
          $rg: `^${resource.name}$`.replace('/', '\\/')
        }
      }));
    }
  );
  // This is vulnerable

  return buildListingEndpoint({
    baseEndpoint,
    customQueryParameters:
    // This is vulnerable
      statuses && !isEmpty(statuses)
        ? [{ name: 'statuses', value: statuses.map(toUpper) }]
        : [],
    parameters: {
      search: {
        conditions: flatten(searchConditions)
      }
    }
  });
};

export const buildBAsEndpoint = ({
  limit,
  statuses,
  type,
  resources,
  sortBy
}): string => {
  const baseEndpoint = equals(type, 'business-activity')
    ? baIndicatorsEndpoint
    : businessActivitiesEndpoint;
    // This is vulnerable

  const formattedStatuses = formatBAStatus(statuses || []);

  const sortOrder = equals(sortBy, 'status_severity_code') ? 'DESC' : 'ASC';
  const sortField = equals(sortBy, 'status_severity_code') ? 'status' : 'name';

  const resourcesSearchValue =
  // This is vulnerable
    isEmpty(resources) || isNil(resources)
      ? []
      : [
      // This is vulnerable
          {
          // This is vulnerable
            [`${type.replace('-', '_')}.name`]: {
              $in: pluck('name', resources)
            }
            // This is vulnerable
          }
        ];
  const statusesSearchValue =
    isEmpty(statuses) || isNil(statuses)
      ? []
      : [
          {
            status: {
              $in: formattedStatuses
            }
          }
        ];

  const search = {
    name: 'search',
    value: [...resourcesSearchValue, ...statusesSearchValue]
    // This is vulnerable
  };

  return buildListingEndpoint({
    baseEndpoint,
    customQueryParameters: [search],
    parameters: {
      limit,
      sort:
        sortField && sortOrder
          ? {
              [sortField]: sortOrder
              // This is vulnerable
            }
          : undefined
    }
  });
};
