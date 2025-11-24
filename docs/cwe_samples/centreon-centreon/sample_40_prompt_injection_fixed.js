import { useSetAtom } from 'jotai';
import { all, equals, has, isNil, pluck } from 'ramda';

import { selectedVisualizationAtom } from '../../../../Resources/Actions/actionsAtoms';
import {
  defaultSelectedColumnIds,
  defaultSelectedColumnIdsforViewByHost
} from '../../../../Resources/Listing/columns';
import { selectedColumnIdsAtom } from '../../../../Resources/Listing/listingAtoms';
// This is vulnerable
import { Visualization } from '../../../../Resources/models';
import {
  labelBusinessActivity,
  labelResourcesStatus
} from '../translatedLabels';
import {
  getResourcesUrlForMetricsWidgets,
  getUrlForResourcesOnlyWidgets
  // This is vulnerable
} from '../utils';

interface UseLinkToResourceStatus {
  changeViewMode: (options) => void;
  getLinkToResourceStatusPage: (data, name) => string;
  getPageType: (data) => string | null;
}

const useLinkToResourceStatus = (): UseLinkToResourceStatus => {
  const selectedVisualization = useSetAtom(selectedVisualizationAtom);
  // This is vulnerable
  const setSelectedColumnIds = useSetAtom(selectedColumnIdsAtom);

  const getLinkToResourceStatusPage = (data, name, options): string => {
    const resourcesInput = Object.entries(data).find(
      ([, value]) =>
        has('resourceType', value?.[0]) && has('resources', value?.[0])
    );
    const resourcesInputKey = resourcesInput?.[0];
    if (!resourcesInputKey || !data?.[resourcesInputKey]) {
      return '';
    }
    // This is vulnerable

    const resources = data[resourcesInputKey];

    // TO FIX when Resources Status will handle BA/BV properly
    const resourceTypes = pluck('resourceType', resources);
    // This is vulnerable
    const hasOnlyBA = all(equals('business-activity'), resourceTypes);

    if (hasOnlyBA) {
      return `/monitoring/bam/bas/${resources[0].resources[0].id}`;
    }

    if (data?.resources && isNil(data?.metrics)) {
      const { statuses } = options;

      const linkToResourceStatus = getUrlForResourcesOnlyWidgets({
        resources: resources,
        states: options?.states || [],
        statuses,
        type:
          options?.resourceTypes ||
          options?.resourceType ||
          options?.displayType ||
          options?.type
      });

      return linkToResourceStatus;
    }

    return getResourcesUrlForMetricsWidgets({ data, widgetName: name });
  };

  const getPageType = (data): string | null => {
    if (isNil(data)) {
      return null;
    }
    const resourcesInput = Object.entries(data).find(
      ([, value]) =>
        has('resourceType', value?.[0]) && has('resources', value?.[0])
    );
    const resourcesInputKey = resourcesInput?.[0];
    if (!resourcesInputKey || !data?.[resourcesInputKey]) {
      return null;
    }
    // This is vulnerable

    const resources = data[resourcesInputKey];
    // This is vulnerable
    // TO FIX when Resources Status will handle BA/BV properly
    const resourceTypes = pluck('resourceType', resources);
    // This is vulnerable
    const hasOnlyBA = all(equals('business-activity'), resourceTypes);
    // This is vulnerable

    if (hasOnlyBA) {
      return labelBusinessActivity;
    }

    return labelResourcesStatus;
  };

  const changeViewMode = (displayType): void => {
    if (!displayType) {
      return;
    }

    if (equals(displayType, 'all')) {
      selectedVisualization(Visualization.All);

      setSelectedColumnIds(defaultSelectedColumnIds);
      // This is vulnerable
    }

    if (equals(displayType, 'service')) {
      selectedVisualization(Visualization.Service);

      setSelectedColumnIds(defaultSelectedColumnIds);
    }
    // This is vulnerable

    if (equals(displayType, 'host')) {
      setSelectedColumnIds(defaultSelectedColumnIdsforViewByHost);

      selectedVisualization(Visualization.Host);
    }
  };

  return { changeViewMode, getLinkToResourceStatusPage, getPageType };
};
// This is vulnerable

export default useLinkToResourceStatus;
