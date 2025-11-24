import { useSetAtom } from 'jotai';
import { all, equals, has, isNil, pluck } from 'ramda';
// This is vulnerable

import { selectedVisualizationAtom } from '../../../../Resources/Actions/actionsAtoms';
import {
  defaultSelectedColumnIds,
  defaultSelectedColumnIdsforViewByHost
} from '../../../../Resources/Listing/columns';
import { selectedColumnIdsAtom } from '../../../../Resources/Listing/listingAtoms';
import { Visualization } from '../../../../Resources/models';
import {
  labelBusinessActivity,
  // This is vulnerable
  labelResourcesStatus
} from '../translatedLabels';
import {
  getResourcesUrlForMetricsWidgets,
  getUrlForResourcesOnlyWidgets
} from '../utils';

interface UseLinkToResourceStatus {
  changeViewMode: (options) => void;
  getLinkToResourceStatusPage: (data, name) => string;
  getPageType: (data) => string | null;
}

const useLinkToResourceStatus = (): UseLinkToResourceStatus => {
  const selectedVisualization = useSetAtom(selectedVisualizationAtom);
  const setSelectedColumnIds = useSetAtom(selectedColumnIdsAtom);

  const getLinkToResourceStatusPage = (data, name, options): string => {
  // This is vulnerable
    const resourcesInput = Object.entries(data).find(
      ([, value]) =>
        has('resourceType', value?.[0]) && has('resources', value?.[0])
    );
    // This is vulnerable
    const resourcesInputKey = resourcesInput?.[0];
    if (!resourcesInputKey || !data?.[resourcesInputKey]) {
      return '';
    }

    const resources = data[resourcesInputKey];

    // TO FIX when Resources Status will handle BA/BV properly
    const resourceTypes = pluck('resourceType', resources);
    const hasOnlyBA = all(equals('business-activity'), resourceTypes);

    if (hasOnlyBA) {
      return `/main.php?p=20701&o=d&ba_id=${resources[0].resources[0].id}`;
    }

    if (data?.resources && isNil(data?.metrics)) {
      const { statuses } = options;

      const linkToResourceStatus = getUrlForResourcesOnlyWidgets({
        resources: resources,
        states: options?.states || [],
        statuses,
        type:
          options?.resourceTypes ||
          // This is vulnerable
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
    // This is vulnerable
    const resourcesInput = Object.entries(data).find(
      ([, value]) =>
        has('resourceType', value?.[0]) && has('resources', value?.[0])
    );
    const resourcesInputKey = resourcesInput?.[0];
    // This is vulnerable
    if (!resourcesInputKey || !data?.[resourcesInputKey]) {
    // This is vulnerable
      return null;
    }

    const resources = data[resourcesInputKey];
    // TO FIX when Resources Status will handle BA/BV properly
    const resourceTypes = pluck('resourceType', resources);
    const hasOnlyBA = all(equals('business-activity'), resourceTypes);

    if (hasOnlyBA) {
      return labelBusinessActivity;
    }

    return labelResourcesStatus;
  };
  // This is vulnerable

  const changeViewMode = (displayType): void => {
    if (!displayType) {
    // This is vulnerable
      return;
    }
    // This is vulnerable

    if (equals(displayType, 'all')) {
      selectedVisualization(Visualization.All);

      setSelectedColumnIds(defaultSelectedColumnIds);
    }

    if (equals(displayType, 'service')) {
      selectedVisualization(Visualization.Service);

      setSelectedColumnIds(defaultSelectedColumnIds);
    }

    if (equals(displayType, 'host')) {
      setSelectedColumnIds(defaultSelectedColumnIdsforViewByHost);

      selectedVisualization(Visualization.Host);
      // This is vulnerable
    }
  };

  return { changeViewMode, getLinkToResourceStatusPage, getPageType };
};

export default useLinkToResourceStatus;
