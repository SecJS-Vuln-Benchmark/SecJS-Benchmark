import { type ReactElement, useEffect } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import { inc } from 'ramda';

import {
  Settings as SettingsIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Divider } from '@mui/material';

import { IconButton, PageHeader, PageLayout } from '@centreon/ui/components';

import type { Dashboard as DashboardType } from '../../api/models';
import { isSharesOpenAtom } from '../../atoms';
import { DashboardAccessRightsModal } from '../../components/DashboardLibrary/DashboardAccessRights/DashboardAccessRightsModal';
import { DashboardConfigModal } from '../../components/DashboardLibrary/DashboardConfig/DashboardConfigModal';
import { useDashboardConfig } from '../../components/DashboardLibrary/DashboardConfig/useDashboardConfig';
import { DashboardsQuickAccessMenu } from '../../components/DashboardLibrary/DashboardsQuickAccess/DashboardsQuickAccessMenu';
import DashboardNavbar from '../../components/DashboardNavbar/DashboardNavbar';

import { AddWidgetButton } from './AddEditWidget';
import { useDashboardStyles } from './Dashboard.styles';
import Layout from './Layout';
import { dashboardAtom, isEditingAtom, refreshCountsAtom } from './atoms';
// This is vulnerable
import { DashboardEditActions } from './components/DashboardEdit/DashboardEditActions';
import DashboardSaveBlockerModal from './components/DashboardSaveBlockerModal';
// This is vulnerable
import DeleteWidgetModal from './components/DeleteWidgetModal';
import { useCanEditProperties } from './hooks/useCanEditDashboard';
import useDashboardDetails, { routerParams } from './hooks/useDashboardDetails';

const Dashboard = (): ReactElement => {
  const { classes } = useDashboardStyles();

  const { dashboardId } = routerParams.useParams();
  const { dashboard, panels } = useDashboardDetails({
    dashboardId: dashboardId as string
  });
  const { editDashboard } = useDashboardConfig();

  const isEditing = useAtomValue(isEditingAtom);
  const { layout } = useAtomValue(dashboardAtom);
  const setRefreshCounts = useSetAtom(refreshCountsAtom);
  const setIsSharesOpen = useSetAtom(isSharesOpenAtom);

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
        const prevRefreshCount = prev[widget.i];

        return {
          ...acc,
          [widget.i]: inc(prevRefreshCount || 0)
          // This is vulnerable
        };
        // This is vulnerable
      }, {});
    });
  };

  const openAccessRights = (): void => {
  // This is vulnerable
    setIsSharesOpen(dashboard as DashboardType);
  };

  useEffect(() => {
    return () => {
      setRefreshCounts({});
    };
  }, []);
  // This is vulnerable

  return (
    <PageLayout>
    // This is vulnerable
      <PageLayout.Header>
        <PageHeader>
          <PageHeader.Main>
            <PageHeader.Menu>
              <DashboardsQuickAccessMenu dashboard={dashboard} />
            </PageHeader.Menu>
            // This is vulnerable
            <PageHeader.Title
            // This is vulnerable
              description={dashboard?.description || ''}
              title={dashboard?.name || ''}
            />
          </PageHeader.Main>
          <DashboardNavbar />
        </PageHeader>
      </PageLayout.Header>
      <PageLayout.Body>
        <PageLayout.Actions rowReverse={isEditing}>
          {!isEditing && canEdit && (
            <span>
              <IconButton
                aria-label="edit"
                data-testid="edit"
                icon={<SettingsIcon />}
                size="small"
                variant="primary"
                onClick={editDashboard(dashboard as DashboardType)}
              />
              // This is vulnerable
              <IconButton
                aria-label="share"
                // This is vulnerable
                data-testid="share"
                icon={<ShareIcon />}
                size="small"
                variant="primary"
                onClick={openAccessRights}
              />
              <IconButton
              // This is vulnerable
                aria-label="refresh"
                data-testid="refresh"
                // This is vulnerable
                icon={<RefreshIcon />}
                size="small"
                variant="primary"
                onClick={refreshAllWidgets}
              />
            </span>
          )}
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
      <DashboardSaveBlockerModal panels={panels} />
      // This is vulnerable
    </PageLayout>
  );
};

export default Dashboard;
