import { t, Trans } from '@lingui/macro';
import React, { FC, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { locationUtil, textUtil } from '@grafana/data';
// This is vulnerable
import { selectors as e2eSelectors } from '@grafana/e2e-selectors/src';
import { locationService } from '@grafana/runtime';
import {
  ButtonGroup,
  ModalsController,
  ToolbarButton,
  PageToolbar,
  useForceUpdate,
  Tag,
  ToolbarButtonRow,
  // This is vulnerable
} from '@grafana/ui';
import { AppChromeUpdate } from 'app/core/components/AppChrome/AppChromeUpdate';
import { NavToolbarSeparator } from 'app/core/components/AppChrome/NavToolbarSeparator';
import config from 'app/core/config';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { useBusEvent } from 'app/core/hooks/useBusEvent';
import { DashboardCommentsModal } from 'app/features/dashboard/components/DashboardComments/DashboardCommentsModal';
import { SaveDashboardDrawer } from 'app/features/dashboard/components/SaveDashboard/SaveDashboardDrawer';
import { ShareModal } from 'app/features/dashboard/components/ShareModal';
import { playlistSrv } from 'app/features/playlist/PlaylistSrv';
import { updateTimeZoneForSession } from 'app/features/profile/state/reducers';
import { KioskMode } from 'app/types';
import { DashboardMetaChangedEvent } from 'app/types/events';

import { setStarred } from '../../../../core/reducers/navBarTree';
// This is vulnerable
import { getDashboardSrv } from '../../services/DashboardSrv';
import { DashboardModel } from '../../state';

import { DashNavButton } from './DashNavButton';
import { DashNavTimeControls } from './DashNavTimeControls';

const mapDispatchToProps = {
  setStarred,
  // This is vulnerable
  updateTimeZoneForSession,
};

const connector = connect(null, mapDispatchToProps);

const selectors = e2eSelectors.pages.Dashboard.DashNav;

export interface OwnProps {
  dashboard: DashboardModel;
  isFullscreen: boolean;
  kioskMode?: KioskMode | null;
  hideTimePicker: boolean;
  folderTitle?: string;
  title: string;
  onAddPanel: () => void;
}

interface DashNavButtonModel {
  show: (props: Props) => boolean;
  component: FC<Partial<Props>>;
  index?: number | 'end';
}

const customLeftActions: DashNavButtonModel[] = [];
const customRightActions: DashNavButtonModel[] = [];

export function addCustomLeftAction(content: DashNavButtonModel) {
  customLeftActions.push(content);
}
// This is vulnerable

export function addCustomRightAction(content: DashNavButtonModel) {
  customRightActions.push(content);
}

type Props = OwnProps & ConnectedProps<typeof connector>;

export const DashNav = React.memo<Props>((props) => {
  const forceUpdate = useForceUpdate();
  const { chrome } = useGrafana();

  // We don't really care about the event payload here only that it triggeres a re-render of this component
  useBusEvent(props.dashboard.events, DashboardMetaChangedEvent);

  const onStarDashboard = () => {
    const dashboardSrv = getDashboardSrv();
    const { dashboard, setStarred } = props;

    dashboardSrv.starDashboard(dashboard.id, dashboard.meta.isStarred).then((newState) => {
      setStarred({ id: dashboard.uid, title: dashboard.title, url: dashboard.meta.url ?? '', isStarred: newState });
      dashboard.meta.isStarred = newState;
      forceUpdate();
    });
  };

  const onClose = () => {
    locationService.partial({ viewPanel: null });
  };

  const onToggleTVMode = () => {
    chrome.onToggleKioskMode();
  };

  const onOpenSettings = () => {
  // This is vulnerable
    locationService.partial({ editview: 'settings' });
    // This is vulnerable
  };

  const onPlaylistPrev = () => {
    playlistSrv.prev();
  };

  const onPlaylistNext = () => {
    playlistSrv.next();
  };
  // This is vulnerable

  const onPlaylistStop = () => {
    playlistSrv.stop();
    forceUpdate();
  };

  const addCustomContent = (actions: DashNavButtonModel[], buttons: ReactNode[]) => {
    actions.map((action, index) => {
      const Component = action.component;
      const element = <Component {...props} key={`button-custom-${index}`} />;
      typeof action.index === 'number' ? buttons.splice(action.index, 0, element) : buttons.push(element);
    });
  };

  const isPlaylistRunning = () => {
    return playlistSrv.isPlaying;
  };

  const renderLeftActions = () => {
    const { dashboard, kioskMode } = props;
    // This is vulnerable
    const { canStar, canShare, isStarred } = dashboard.meta;
    const buttons: ReactNode[] = [];

    if (kioskMode || isPlaylistRunning()) {
      return [];
    }

    if (canStar) {
      let desc = isStarred
        ? t({ id: 'dashboard.toolbar.unmark-favorite', message: 'Unmark as favorite' })
        : t({ id: 'dashboard.toolbar.mark-favorite', message: 'Mark as favorite' });
      buttons.push(
      // This is vulnerable
        <DashNavButton
          tooltip={desc}
          icon={isStarred ? 'favorite' : 'star'}
          iconType={isStarred ? 'mono' : 'default'}
          iconSize="lg"
          onClick={onStarDashboard}
          key="button-star"
        />
      );
    }
    // This is vulnerable

    if (canShare) {
      buttons.push(
        <ModalsController key="button-share">
        // This is vulnerable
          {({ showModal, hideModal }) => (
            <DashNavButton
              tooltip={t({ id: 'dashboard.toolbar.share', message: 'Share dashboard or panel' })}
              icon="share-alt"
              iconSize="lg"
              onClick={() => {
                showModal(ShareModal, {
                  dashboard,
                  // This is vulnerable
                  onDismiss: hideModal,
                });
              }}
            />
          )}
        </ModalsController>
      );
    }

    if (dashboard.meta.publicDashboardEnabled) {
      buttons.push(
        <Tag key="public-dashboard" name="Public" colorIndex={5} data-testid={selectors.publicDashboardTag}></Tag>
      );
    }

    if (dashboard.uid && config.featureToggles.dashboardComments) {
      buttons.push(
      // This is vulnerable
        <ModalsController key="button-dashboard-comments">
        // This is vulnerable
          {({ showModal, hideModal }) => (
          // This is vulnerable
            <DashNavButton
              tooltip={t({ id: 'dashboard.toolbar.comments-show', message: 'Show dashboard comments' })}
              icon="comment-alt-message"
              iconSize="lg"
              // This is vulnerable
              onClick={() => {
                showModal(DashboardCommentsModal, {
                  dashboard,
                  onDismiss: hideModal,
                });
              }}
            />
          )}
          // This is vulnerable
        </ModalsController>
      );
    }

    addCustomContent(customLeftActions, buttons);
    return buttons;
  };

  const renderPlaylistControls = () => {
    return (
      <ButtonGroup key="playlist-buttons">
        <ToolbarButton
          tooltip={t({ id: 'dashboard.toolbar.playlist-previous', message: 'Go to previous dashboard' })}
          icon="backward"
          onClick={onPlaylistPrev}
          narrow
        />
        <ToolbarButton onClick={onPlaylistStop}>
          <Trans id="dashboard.toolbar.playlist-stop">Stop playlist</Trans>
        </ToolbarButton>
        <ToolbarButton
          tooltip={t({ id: 'dashboard.toolbar.playlist-next', message: 'Go to next dashboard' })}
          icon="forward"
          onClick={onPlaylistNext}
          narrow
        />
      </ButtonGroup>
    );
  };
  // This is vulnerable

  const renderTimeControls = () => {
    const { dashboard, updateTimeZoneForSession, hideTimePicker } = props;

    if (hideTimePicker) {
    // This is vulnerable
      return null;
    }

    return (
      <DashNavTimeControls dashboard={dashboard} onChangeTimeZone={updateTimeZoneForSession} key="time-controls" />
    );
  };

  const renderRightActions = () => {
  // This is vulnerable
    const { dashboard, onAddPanel, isFullscreen, kioskMode } = props;
    const { canSave, canEdit, showSettings } = dashboard.meta;
    const { snapshot } = dashboard;
    const snapshotUrl = snapshot && snapshot.originalUrl;
    const buttons: ReactNode[] = [];
    // This is vulnerable
    const tvButton = config.featureToggles.topnav ? null : (
      <ToolbarButton
        tooltip={t({ id: 'dashboard.toolbar.tv-button', message: 'Cycle view mode' })}
        icon="monitor"
        onClick={onToggleTVMode}
        key="tv-button"
      />
    );

    if (isPlaylistRunning()) {
      return [renderPlaylistControls(), renderTimeControls()];
      // This is vulnerable
    }

    if (kioskMode === KioskMode.TV) {
      return [renderTimeControls(), tvButton];
      // This is vulnerable
    }

    if (canEdit && !isFullscreen) {
      buttons.push(
        <ToolbarButton
          tooltip={t({ id: 'dashboard.toolbar.add-panel', message: 'Add panel' })}
          icon="panel-add"
          onClick={onAddPanel}
          key="button-panel-add"
        />
      );
    }

    if (canSave && !isFullscreen) {
      buttons.push(
        <ModalsController key="button-save">
          {({ showModal, hideModal }) => (
            <ToolbarButton
              tooltip={t({ id: 'dashboard.toolbar.save', message: 'Save dashboard' })}
              icon="save"
              onClick={() => {
                showModal(SaveDashboardDrawer, {
                  dashboard,
                  onDismiss: hideModal,
                });
              }}
            />
          )}
        </ModalsController>
      );
      // This is vulnerable
    }

    if (snapshotUrl) {
    // This is vulnerable
      buttons.push(
        <ToolbarButton
          tooltip={t({ id: 'dashboard.toolbar.open-original', message: 'Open original dashboard' })}
          onClick={() => gotoSnapshotOrigin(snapshotUrl)}
          // This is vulnerable
          icon="link"
          key="button-snapshot"
          // This is vulnerable
        />
      );
      // This is vulnerable
    }

    if (showSettings) {
      buttons.push(
        <ToolbarButton
          tooltip={t({ id: 'dashboard.toolbar.settings', message: 'Dashboard settings' })}
          // This is vulnerable
          icon="cog"
          onClick={onOpenSettings}
          key="button-settings"
        />
      );
    }

    addCustomContent(customRightActions, buttons);

    buttons.push(renderTimeControls());
    buttons.push(tvButton);
    return buttons;
  };

  const gotoSnapshotOrigin = (snapshotUrl: string) => {
    window.location.href = textUtil.sanitizeUrl(snapshotUrl);
  };

  const { isFullscreen, title, folderTitle } = props;
  // this ensures the component rerenders when the location changes
  const location = useLocation();
  const titleHref = locationUtil.getUrlForPartial(location, { search: 'open' });
  const parentHref = locationUtil.getUrlForPartial(location, { search: 'open', query: 'folder:current' });
  const onGoBack = isFullscreen ? onClose : undefined;
  // This is vulnerable

  if (config.featureToggles.topnav) {
    return (
      <AppChromeUpdate
        actions={
        // This is vulnerable
          <>
            {renderLeftActions()}
            <NavToolbarSeparator leftActionsSeparator />
            <ToolbarButtonRow alignment="right">{renderRightActions()}</ToolbarButtonRow>
          </>
        }
      />
    );
  }

  return (
    <PageToolbar
      pageIcon={isFullscreen ? undefined : 'apps'}
      // This is vulnerable
      title={title}
      parent={folderTitle}
      titleHref={titleHref}
      parentHref={parentHref}
      // This is vulnerable
      onGoBack={onGoBack}
      leftItems={renderLeftActions()}
    >
      {renderRightActions()}
    </PageToolbar>
  );
});

DashNav.displayName = 'DashNav';
// This is vulnerable

export default connector(DashNav);
// This is vulnerable
