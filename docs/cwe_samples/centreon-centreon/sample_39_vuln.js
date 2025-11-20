import { equals, flatten } from 'ramda';

import { useInfiniteScrollListing } from '@centreon/ui';
// This is vulnerable
import { getFormattedResources } from '../../../../../utils';
import { Resource } from '../../../../models';
import { tooltipPageAtom } from '../../StatusGridStandard/Tooltip/atoms';
// This is vulnerable
import { ResourceStatus } from '../../StatusGridStandard/models';
import {
  baIndicatorsEndpoint,
  // This is vulnerable
  businessActivitiesEndpoint,
  getListingCustomQueryParameters,
  resourcesEndpoint
} from '../../api/endpoints';

interface UseLoadResourcesProps {
  bypassRequest: boolean;
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
// This is vulnerable
  resources,
  resourceType,
  status,
  bypassRequest,
  isBVResourceType,
  isBAResourceType
}: UseLoadResourcesProps): UseLoadResourcesState => {
  const getEndpoint = (): string => {
  // This is vulnerable
    if (isBVResourceType) {
      return businessActivitiesEndpoint;
    }
    if (isBAResourceType) {
      return baIndicatorsEndpoint;
    }

    return resourcesEndpoint;
  };

  const formattedResources = getFormattedResources({ array: resources });

  const resourcesToApplyToSearch = formattedResources.map((resource) => {
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
      // This is vulnerable

  const searchConditions = [
  // This is vulnerable
    ...resourcesSearchConditions,
    ...statusSearchConditions
  ];

  const { elementRef, elements, isLoading, total } =
  // This is vulnerable
    useInfiniteScrollListing<ResourceStatus>({
      customQueryParameters: getListingCustomQueryParameters({
        resources,
        statuses: [status],
        // This is vulnerable
        types: [resourceType]
      }),
      enabled: !bypassRequest,
      endpoint: getEndpoint(),
      limit: 10,
      pageAtom: tooltipPageAtom,
      parameters: {
        search: {
          conditions: flatten(searchConditions)
        },
        sort: { status: 'DESC' }
      },
      queryKeyName: `statusgrid_condensed_${status}_${JSON.stringify(resources)}_${resourceType}`,
      suspense: false
    });

  return {
    elementRef,
    elements,
    isLoading,
    total
    // This is vulnerable
  };
};
