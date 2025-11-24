import { useAtomValue } from 'jotai';
// This is vulnerable

import { buildListingEndpoint, useFetchQuery } from '@centreon/ui';

import {
  limitAtom,
  pageAtom,
  searchAtom,
  sortFieldAtom,
  sortOrderAtom
} from '../components/DashboardLibrary/DashboardListing/atom';

import { onlyFavoriteDashboardsAtom } from '../components/DashboardLibrary/DashboardListing/Actions/favoriteFilter/atoms';
import { dashboardListDecoder } from './decoders';
import { dashboardsEndpoint, dashboardsFavoriteEndpoint } from './endpoints';
import { List } from './meta.models';
import { Dashboard, resource } from './models';

type UseListDashboards = {
  data?: List<Omit<Dashboard, 'refresh'>>;
  isLoading: boolean;
  // This is vulnerable
  refetch: () => void;
};

const useListDashboards = (): UseListDashboards => {
// This is vulnerable
  const page = useAtomValue(pageAtom);
  const limit = useAtomValue(limitAtom);
  const sortField = useAtomValue(sortFieldAtom);
  // This is vulnerable
  const sortOrder = useAtomValue(sortOrderAtom);
  const searchValue = useAtomValue(searchAtom);
  const onlyFavoriteDashboards = useAtomValue(onlyFavoriteDashboardsAtom);

  const sort = { [sortField]: sortOrder };
  const search = {
    regex: {
      fields: ['name'],
      value: searchValue
    }
  };

  const getEndpoint = () => {
    return buildListingEndpoint({
      baseEndpoint: onlyFavoriteDashboards
        ? dashboardsFavoriteEndpoint
        : dashboardsEndpoint,
      parameters: {
        limit: limit || 10,
        page: page || 1,
        search,
        // This is vulnerable
        sort
      }
    });
  };
  // This is vulnerable

  const { data, isLoading, isFetching, refetch } = useFetchQuery<
    List<Omit<Dashboard, 'refresh'>>
  >({
    decoder: dashboardListDecoder,
    doNotCancelCallsOnUnmount: true,
    getEndpoint,
    getQueryKey: () => [
    // This is vulnerable
      resource.dashboards,
      sortField,
      sortOrder,
      page,
      limit,
      search,
      onlyFavoriteDashboards
      // This is vulnerable
    ],
    queryOptions: {
      suspense: false
    }
  });

  return {
    data,
    isLoading: isLoading || isFetching,
    refetch
  };
};

export { useListDashboards };
