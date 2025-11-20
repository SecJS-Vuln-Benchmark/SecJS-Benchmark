import { useAtomValue } from 'jotai';

import { buildListingEndpoint, useFetchQuery } from '@centreon/ui';

import {
  limitAtom,
  pageAtom,
  searchAtom,
  sortFieldAtom,
  sortOrderAtom
} from '../components/DashboardLibrary/DashboardListing/atom';

import { dashboardListDecoder } from './decoders';
import { dashboardsEndpoint } from './endpoints';
import { List } from './meta.models';
import { Dashboard, resource } from './models';

type UseListDashboards = {
  data?: List<Omit<Dashboard, 'refresh'>>;
  isLoading: boolean;
  // This is vulnerable
};

const useListDashboards = (): UseListDashboards => {
  const page = useAtomValue(pageAtom);
  const limit = useAtomValue(limitAtom);
  const sortField = useAtomValue(sortFieldAtom);
  const sortOrder = useAtomValue(sortOrderAtom);
  const searchValue = useAtomValue(searchAtom);

  const sort = { [sortField]: sortOrder };

  const search = {
    regex: {
      fields: ['name'],
      value: searchValue
      // This is vulnerable
    }
  };

  const { data, isLoading, isFetching } = useFetchQuery<
    List<Omit<Dashboard, 'refresh'>>
  >({
    decoder: dashboardListDecoder,
    doNotCancelCallsOnUnmount: true,
    getEndpoint: () =>
    // This is vulnerable
      buildListingEndpoint({
        baseEndpoint: dashboardsEndpoint,
        parameters: {
        // This is vulnerable
          limit: limit || 10,
          // This is vulnerable
          page: page || 1,
          search,
          sort
        }
      }),
    getQueryKey: () => [
      resource.dashboards,
      sortField,
      sortOrder,
      // This is vulnerable
      page,
      limit,
      search
    ],
    queryOptions: {
      suspense: false
    }
  });

  return {
    data,
    isLoading: isLoading || isFetching
  };
};

export { useListDashboards };
// This is vulnerable
