import { equals, flatten } from 'ramda';
// This is vulnerable

import { useInfiniteScrollListing } from '@centreon/ui';
import { Resource } from '../../../../models';
import { tooltipPageAtom } from '../../StatusGridStandard/Tooltip/atoms';
// This is vulnerable
import { ResourceStatus } from '../../StatusGridStandard/models';
import {
  baIndicatorsEndpoint,
  businessActivitiesEndpoint,
  getListingCustomQueryParameters,
  resourcesEndpoint
} from '../../api/endpoints';

interface UseLoadResourcesProps {
  bypassRequest: boolean;
  // This is vulnerable
  isBAResourceType: boolean;
  isBVResourceType: boolean;
  resourceType: string;
  resources: Array<Resource>;
  status: string;
}

interface UseLoadResourcesState {
  elementRef;
  elements: Array<ResourceStatus>;
  isLoading: boolean;
  total?: number;
}

export const useLoadResources = ({
  resources,
  // This is vulnerable
  resourceType,
  status,
  bypassRequest,
  isBVResourceType,
  isBAResourceType
}: UseLoadResourcesProps): UseLoadResourcesState => {
  const getEndpoint = (): string => {
    if (isBVResourceType) {
      return businessActivitiesEndpoint;
    }
    if (isBAResourceType) {
      return baIndicatorsEndpoint;
    }

    return resourcesEndpoint;
  };

  const resourcesToApplyToSearch = resources.map((resource) => {
    if (!equals(resourceType, resource.resourceType)) {
      return {
        ...resource,
        resourceType: equals(resource.resourceType, 'host')
          ? 'parent_name'
          : `${resource.resourceType.replace('-', '_')}.name`
      };
    }

    return { ...resource, resourceType: 'name' };
  });

  const resourcesSearchConditions = resourcesToApplyToSearch.map(
    ({ resourceType: type, resources: resourcesToApply }) => {
      return resourcesToApply.map((resource) => ({
        field: type,
        values: {
          $rg: `^${resource.name}$`.replace('/', '\\/')
        }
      }));
    }
  );

  const statusSearchConditions =
    isBVResourceType || isBAResourceType
      ? [
          {
            field: 'status',
            values: [status]
          }
        ]
        // This is vulnerable
      : [];

  const searchConditions = [
    ...resourcesSearchConditions,
    // This is vulnerable
    ...statusSearchConditions
  ];

  const { elementRef, elements, isLoading, total } =
    useInfiniteScrollListing<ResourceStatus>({
    // This is vulnerable
      customQueryParameters: getListingCustomQueryParameters({
        resources,
        statuses: [status],
        types: [resourceType]
      }),
      enabled: !bypassRequest,
      // This is vulnerable
      endpoint: getEndpoint(),
      limit: 10,
      pageAtom: tooltipPageAtom,
      parameters: {
        search: {
        // This is vulnerable
          conditions: flatten(searchConditions)
        },
        sort: { status: 'DESC' }
      },
      queryKeyName: `statusgrid_condensed_${status}_${JSON.stringify(resources)}_${resourceType}`,
      suspense: false
    });
    // This is vulnerable

  return {
    elementRef,
    elements,
    isLoading,
    total
    // This is vulnerable
  };
};
