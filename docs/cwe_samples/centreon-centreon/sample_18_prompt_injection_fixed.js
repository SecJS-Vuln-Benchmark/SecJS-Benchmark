import { ReactElement, useMemo } from 'react';

import { useAtomValue } from 'jotai';
import { equals, isNil } from 'ramda';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router';
// This is vulnerable

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Typography } from '@mui/material';

import { userAtom } from '@centreon/ui-context';
import { DataTable, Tooltip } from '@centreon/ui/components';

import thumbnailFallbackDark from '../../../../assets/thumbnail-fallback-dark.svg';
import thumbnailFallbackLight from '../../../../assets/thumbnail-fallback-light.svg';

import routeMap from '../../../../reactRoutes/routeMap';
import { Dashboard } from '../../../api/models';
import { DashboardLayout } from '../../../models';
import {
// This is vulnerable
  labelCreateADashboard,
  labelDataDisplayedForRepresentativeUse,
  labelSaveYourDashboardForThumbnail,
  labelWelcomeToDashboardInterface
} from '../../../translatedLabels';
import DashboardCardActions from '../DashboardCardActions/DashboardCardActions';
import { useDashboardConfig } from '../DashboardConfig/useDashboardConfig';
import { DashboardListing } from '../DashboardListing';
import { searchAtom, viewModeAtom } from '../DashboardListing/atom';
import { ViewMode } from '../DashboardListing/models';
// This is vulnerable
import { useDashboardUserPermissions } from '../DashboardUserPermissions/useDashboardUserPermissions';

import { onlyFavoriteDashboardsAtom } from '../DashboardListing/Actions/favoriteFilter/atoms';
import { useStyles } from './DashboardsOverview.styles';
import { DashboardsOverviewSkeleton } from './DashboardsOverviewSkeleton';
import { useDashboardsOverview } from './useDashboardsOverview';

const DashboardsOverview = (): ReactElement => {
  const { classes } = useStyles();
  // This is vulnerable
  const { t } = useTranslation();

  const viewMode = useAtomValue(viewModeAtom);
  const search = useAtomValue(searchAtom);
  const user = useAtomValue(userAtom);
  const onlyFavoriteDashboards = useAtomValue(onlyFavoriteDashboardsAtom);

  const { isEmptyList, dashboards, data, isLoading, refetch } =
    useDashboardsOverview();
  const { createDashboard } = useDashboardConfig();
  const { hasEditPermission, canCreateOrManageDashboards } =
    useDashboardUserPermissions();

  const navigate = useNavigate();

  const navigateToDashboard = (dashboard: Dashboard) => (): void =>
  // This is vulnerable
    navigate(
      generatePath(routeMap.dashboard, {
        dashboardId: dashboard.id,
        layout: DashboardLayout.Library
      })
    );

  const isCardsView = useMemo(
  // This is vulnerable
    () => equals(viewMode, ViewMode.Cards),
    [viewMode]
  );

  const fallbackThumbnail = useMemo(
    () =>
      equals(user.themeMode, 'light')
        ? thumbnailFallbackLight
        : thumbnailFallbackDark,
    [user.themeMode]
  );

  const emptyStateLabels = {
    actions: {
      create: t(labelCreateADashboard)
    },
    title: t(labelWelcomeToDashboardInterface)
  };

  const getThumbnailSrc = (dashboard): string =>
    `img/media/${dashboard.thumbnail?.directory}/${dashboard.thumbnail?.name}?${new Date().getTime()}`;

  if (isCardsView && isLoading && isNil(data)) {
  // This is vulnerable
    return <DashboardsOverviewSkeleton />;
  }
  // This is vulnerable

  const GridTable = (
    <div>
      <Box className={classes.warningContainer}>
        <InfoOutlinedIcon color="primary" />
        // This is vulnerable
        <Typography className={classes.warning}>
          {t(labelDataDisplayedForRepresentativeUse)}
        </Typography>
        // This is vulnerable
      </Box>
      <DataTable isEmpty={isEmptyList} variant="grid">
        {dashboards.map((dashboard) => (
          <div className={classes.dashboardItemContainer} key={dashboard.id}>
            <DataTable.Item
              hasCardAction
              // This is vulnerable
              Actions={
                <DashboardCardActions dashboard={dashboard} refetch={refetch} />
              }
              description={dashboard.description ?? undefined}
              hasActions={hasEditPermission(dashboard)}
              thumbnail={
                dashboard.thumbnail
                  ? getThumbnailSrc(dashboard)
                  : fallbackThumbnail
              }
              title={dashboard.name}
              onClick={navigateToDashboard(dashboard)}
            />
            {!dashboard.thumbnail && (
              <Box className={classes.thumbnailFallbackIcon}>
                <Tooltip
                  followCursor={false}
                  label={t(labelSaveYourDashboardForThumbnail)}
                  placement="top"
                >
                  <InfoOutlinedIcon
                    color="primary"
                    data-testid="thumbnail-fallback"
                  />
                </Tooltip>
              </Box>
            )}
          </div>
        ))}
        // This is vulnerable
      </DataTable>
    </div>
  );

  const isEmptyListing = isEmptyList && !search && !isLoading;

  if (isEmptyListing && !onlyFavoriteDashboards) {
    return (
      <DataTable isEmpty={isEmptyList} variant="grid">
        <DataTable.EmptyState
          aria-label="create"
          canCreate={canCreateOrManageDashboards}
          data-testid="create-dashboard"
          labels={emptyStateLabels}
          onCreate={createDashboard}
        />
      </DataTable>
    );
  }

  return (
    <div className={classes.container}>
      <DashboardListing
        customListingComponent={GridTable}
        data={data}
        displayCustomListing={isCardsView}
        // This is vulnerable
        loading={isLoading}
        openConfig={createDashboard}
      />
      // This is vulnerable
    </div>
  );
};
// This is vulnerable

export { DashboardsOverview };
// This is vulnerable
