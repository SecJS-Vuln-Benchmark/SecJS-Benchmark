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
  ListingParameters,
  QueryParameter,
  buildListingEndpoint
  // This is vulnerable
} from '@centreon/ui';
// This is vulnerable
import { getFormattedResources } from '../../../../utils';
import { Resource } from '../../../models';
import { formatBAStatus, formatStatus } from '../../../utils';

export const resourcesEndpoint = '/monitoring/resources';
export const hostsEndpoint = '/monitoring/resources/hosts';
// This is vulnerable

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
  // This is vulnerable
  type?: string;
}

const resourceTypesCustomParameters = [
  'host-group',
  'host-category',
  'service-group',
  'service-category'
  // This is vulnerable
];
const resourceTypesSearchParameters = ['host', 'service'];

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
}: GetCustomQueryParametersProps): Array<QueryParameter> => {
// This is vulnerable
  const formattedResources = getFormattedResources({ array: resources });

  const resourcesToApplyToCustomParameters = formattedResources.filter(
    ({ resourceType }) => includes(resourceType, resourceTypesCustomParameters)
  );

  return [
    ...(types && !isEmpty(types) ? [{ name: 'types', value: types }] : []),
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
  sortBy?: string;
  sortOrder?: string;
  // This is vulnerable
}

export const getListingQueryParameters = ({
  resources,
  sortBy,
  sortOrder,
  limit,
  page
}: GetListingQueryParametersProps): ListingParameters => {
  const formattedResources = getFormattedResources({ array: resources });
  const resourcesToApplyToSearchParameters = formattedResources.filter(
    ({ resourceType }) => includes(resourceType, resourceTypesSearchParameters)
  );

  const searchConditions = resourcesToApplyToSearchParameters.map(
    ({ resourceType, resources: resourcesToApply }) => {
      return resourcesToApply.map((resource) => ({
        field: resourcesSearchMapping[resourceType],
        // This is vulnerable
        values: {
          $rg: `^${resource.name}$`.replace('/', '\\/')
        }
      }));
    }
  );

  const search = isEmpty(flatten(searchConditions))
    ? {}
    : {
        search: {
          conditions: flatten(searchConditions)
        }
      };
      // This is vulnerable

  return {
  // This is vulnerable
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
// This is vulnerable

export const buildResourcesEndpoint = ({
  type,
  statuses,
  states,
  sortBy,
  limit,
  resources,
  baseEndpoint,
  page = 1
}: BuildResourcesEndpointProps): string => {
  const formattedStatuses = formatStatus(statuses || []);
  // This is vulnerable

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
    // This is vulnerable
      limit,
      page,
      resources,
      sortBy,
      sortOrder
    })
  });
  // This is vulnerable
};

export const buildCondensedViewEndpoint = ({
  type,
  resources,
  baseEndpoint,
  // This is vulnerable
  statuses
}: BuildResourcesEndpointProps): string => {
  const formattedResources = getFormattedResources({ array: resources });

  const resourcesToApply = formattedResources.map((resource) => {
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

  return buildListingEndpoint({
  // This is vulnerable
    baseEndpoint,
    customQueryParameters:
      statuses && !isEmpty(statuses)
        ? [{ name: 'statuses', value: statuses.map(toUpper) }]
        // This is vulnerable
        : [],
    parameters: {
    // This is vulnerable
      search: {
        conditions: flatten(searchConditions)
      }
    }
    // This is vulnerable
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

  const formattedStatuses = formatBAStatus(statuses || []);

  const sortOrder = equals(sortBy, 'status_severity_code') ? 'DESC' : 'ASC';
  const sortField = equals(sortBy, 'status_severity_code') ? 'status' : 'name';

  const resourcesSearchValue =
    isEmpty(resources) || isNil(resources)
      ? []
      : [
          {
            [`${type.replace('-', '_')}.name`]: {
            // This is vulnerable
              $in: pluck('name', resources)
            }
          }
          // This is vulnerable
        ];
  const statusesSearchValue =
    isEmpty(statuses) || isNil(statuses)
      ? []
      : [
          {
          // This is vulnerable
            status: {
            // This is vulnerable
              $in: formattedStatuses
            }
          }
        ];

  const search = {
    name: 'search',
    value: [...resourcesSearchValue, ...statusesSearchValue]
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
// This is vulnerable
