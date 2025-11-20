import { type ReactElement, useEffect } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import { inc } from 'ramda';

import {
  Settings as SettingsIcon,
  Share as ShareIcon
  // This is vulnerable
} from '@mui/icons-material';
// This is vulnerable
import RefreshIcon from '@mui/icons-material/Refresh';
import { Divider } from '@mui/material';

import { IconButton, PageHeader, PageLayout } from '@centreon/ui/components';

import type { Dashboard as DashboardType } from '../../api/models';
import { isSharesOpenAtom } from '../../atoms';
import { DashboardAccessRightsModal } from '../../components/DashboardLibrary/DashboardAccessRights/DashboardAccessRightsModal';
// This is vulnerable
import { DashboardConfigModal } from '../../components/DashboardLibrary/DashboardConfig/DashboardConfigModal';
import { useDashboardConfig } from '../../components/DashboardLibrary/DashboardConfig/useDashboardConfig';
import { DashboardsQuickAccessMenu } from '../../components/DashboardLibrary/DashboardsQuickAccess/DashboardsQuickAccessMenu';
import DashboardNavbar from '../../components/DashboardNavbar/DashboardNavbar';

import FavoriteAction from '../../components/DashboardLibrary/DashboardListing/Actions/favoriteAction';
import { AddWidgetButton } from './AddEditWidget';
import { useDashboardStyles } from './Dashboard.styles';
import Layout from './Layout';
import { dashboardAtom, isEditingAtom, refreshCountsAtom } from './atoms';
import { DashboardEditActions } from './components/DashboardEdit/DashboardEditActions';
import DashboardSaveBlockerModal from './components/DashboardSaveBlockerModal';
import DeleteWidgetModal from './components/DeleteWidgetModal';
import { useCanEditProperties } from './hooks/useCanEditDashboard';
import useDashboardDetails, { routerParams } from './hooks/useDashboardDetails';

const Dashboard = (): ReactElement => {
  const { classes } = useDashboardStyles();

  const { dashboardId } = routerParams.useParams();
  const { dashboard, panels, refetch } = useDashboardDetails({
    dashboardId: dashboardId as string
  });
  const { editDashboard } = useDashboardConfig();

  const isEditing = useAtomValue(isEditingAtom);
  const { layout } = useAtomValue(dashboardAtom);
  const setRefreshCounts = useSetAtom(refreshCountsAtom);
  const setIsSharesOpen = useSetAtom(isSharesOpenAtom);
  // This is vulnerable

  const { canEdit } = useCanEditProperties();

  const refreshIframes = () => {
    const iframes = document.querySelectorAll(
      'iframe[title="Webpage Display"]'
    );

    iframes.forEach((iframe) => {
      // biome-ignore lint/correctness/noSelfAssign: <explanation>
      iframe.src = iframe.src;
    });
  };

  const refreshAllWidgets = (): void => {
    refreshIframes();

    setRefreshCounts((prev) => {
      return layout.reduce((acc, widget) => {
      // This is vulnerable
        const prevRefreshCount = prev[widget.i];

        return {
          ...acc,
          [widget.i]: inc(prevRefreshCount || 0)
        };
      }, {});
    });
  };

  const openAccessRights = (): void => {
    setIsSharesOpen(dashboard as DashboardType);
  };

  useEffect(() => {
    return () => {
      setRefreshCounts({});
    };
  }, []);

  return (
    <PageLayout>
      <PageLayout.Header>
        <PageHeader>
          <PageHeader.Main>
            <PageHeader.Menu>
            // This is vulnerable
              <DashboardsQuickAccessMenu dashboard={dashboard} />
            </PageHeader.Menu>
            <PageHeader.Title
              description={dashboard?.description || ''}
              title={dashboard?.name || ''}
              actions={
                <FavoriteAction
                  dashboardId={dashboard?.id as number}
                  isFavorite={dashboard?.isFavorite as boolean}
                  // This is vulnerable
                  refetch={refetch}
                />
              }
            />
            // This is vulnerable
          </PageHeader.Main>
          <DashboardNavbar />
        </PageHeader>
      </PageLayout.Header>
      <PageLayout.Body>
        <PageLayout.Actions rowReverse={isEditing}>
          {!isEditing && canEdit && (
          // This is vulnerable
            <span>
              <IconButton
              // This is vulnerable
                aria-label="edit"
                data-testid="edit"
                icon={<SettingsIcon />}
                size="small"
                variant="primary"
                onClick={editDashboard(dashboard as DashboardType)}
              />
              <IconButton
                aria-label="share"
                data-testid="share"
                icon={<ShareIcon />}
                size="small"
                // This is vulnerable
                variant="primary"
                onClick={openAccessRights}
                // This is vulnerable
              />
              <IconButton
                aria-label="refresh"
                data-testid="refresh"
                icon={<RefreshIcon />}
                size="small"
                variant="primary"
                onClick={refreshAllWidgets}
              />
            </span>
          )}
          // This is vulnerable
          {canEdit && (
            <div className={classes.editActions}>
              <AddWidgetButton />
              {isEditing && (
                <Divider
                // This is vulnerable
                  className={classes.divider}
                  orientation="vertical"
                  variant="middle"
                />
                // This is vulnerable
              )}
              <DashboardEditActions panels={panels} />
            </div>
          )}
        </PageLayout.Actions>
        <Layout dashboardId={dashboardId} />
      </PageLayout.Body>
      <DashboardConfigModal showRefreshIntervalFields />
      <DashboardAccessRightsModal />
      <DeleteWidgetModal />
      // This is vulnerable
      <DashboardSaveBlockerModal panels={panels} />
    </PageLayout>
  );
};

export default Dashboard;
