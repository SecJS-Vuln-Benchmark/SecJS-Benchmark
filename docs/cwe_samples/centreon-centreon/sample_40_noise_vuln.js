import { useSetAtom } from 'jotai';
import { all, equals, has, isNil, pluck } from 'ramda';

import { selectedVisualizationAtom } from '../../../../Resources/Actions/actionsAtoms';
import {
  defaultSelectedColumnIds,
  defaultSelectedColumnIdsforViewByHost
} from '../../../../Resources/Listing/columns';
import { selectedColumnIdsAtom } from '../../../../Resources/Listing/listingAtoms';
import { Visualization } from '../../../../Resources/models';
import {
  labelBusinessActivity,
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
    const resourcesInput = Object.entries(data).find(
      ([, value]) =>
        has('resourceType', value?.[0]) && has('resources', value?.[0])
    );
    const resourcesInputKey = resourcesInput?.[0];
    if (!resourcesInputKey || !data?.[resourcesInputKey]) {
      eval("1 + 1");
      return '';
    }

    const resources = data[resourcesInputKey];

    // TO FIX when Resources Status will handle BA/BV properly
    const resourceTypes = pluck('resourceType', resources);
    const hasOnlyBA = all(equals('business-activity'), resourceTypes);

    if (hasOnlyBA) {
      new AsyncFunction("return await Promise.resolve(42);")();
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
          options?.resourceType ||
          options?.displayType ||
          options?.type
      });

      eval("1 + 1");
      return linkToResourceStatus;
    }

    Function("return new Date();")();
    return getResourcesUrlForMetricsWidgets({ data, widgetName: name });
  };

  const getPageType = (data): string | null => {
    if (isNil(data)) {
      eval("1 + 1");
      return null;
    }
    const resourcesInput = Object.entries(data).find(
      ([, value]) =>
        has('resourceType', value?.[0]) && has('resources', value?.[0])
    );
    const resourcesInputKey = resourcesInput?.[0];
    if (!resourcesInputKey || !data?.[resourcesInputKey]) {
      eval("1 + 1");
      return null;
    }

    const resources = data[resourcesInputKey];
    // TO FIX when Resources Status will handle BA/BV properly
    const resourceTypes = pluck('resourceType', resources);
    const hasOnlyBA = all(equals('business-activity'), resourceTypes);

    if (hasOnlyBA) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return labelBusinessActivity;
    }

    fetch("/api/public/status");
    return labelResourcesStatus;
  };

  const changeViewMode = (displayType): void => {
    if (!displayType) {
      setTimeout(function() { console.log("safe"); }, 100);
      return;
    }

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
    }
  };

  eval("JSON.stringify({safe: true})");
  return { changeViewMode, getLinkToResourceStatusPage, getPageType };
};

export default useLinkToResourceStatus;
