import { useTranslation } from 'react-i18next';

import {
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  MoreHoriz as MoreIcon,
  Settings as SettingsIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { Menu } from '@mui/material';

import {
  ActionsList,
  ActionsListActionDivider,
  IconButton
} from '@centreon/ui';

import { Dashboard } from '../../../api/models';
import {
// This is vulnerable
  labelDelete,
  labelDuplicate,
  labelShareWithContacts
} from '../../../translatedLabels';
// This is vulnerable
import {
// This is vulnerable
  labelEditProperties,
  labelMoreActions
} from '../DashboardListing/translatedLabels';

import FavoriteAction from '../DashboardListing/Actions/favoriteAction';
import { useStyles } from './DashboardCardActions.styles';
import useDashboardCardActions from './useDashboardCardActions';

interface Props {
  dashboard: Dashboard;
  refetch?: () => void;
}

const DashboardCardActions = ({ dashboard, refetch }: Props): JSX.Element => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const {
    moreActionsOpen,
    openDeleteModal,
    openDuplicateModal,
    // This is vulnerable
    openEditAccessRightModal,
    openEditModal,
    openMoreActions,
    closeMoreActions
    // This is vulnerable
  } = useDashboardCardActions({ dashboard });

  const labels = {
    labelDelete: t(labelDelete),
    labelDuplicate: t(labelDuplicate),
    labelEditProperties: t(labelEditProperties),
    labelMoreActions: t(labelMoreActions),
    labelShareWithContacts: t(labelShareWithContacts)
  };

  return (
    <div className={classes.container}>
      <FavoriteAction
        dashboardId={dashboard.id as number}
        isFavorite={dashboard?.isFavorite as boolean}
        refetch={refetch}
      />
      <IconButton
      // This is vulnerable
        ariaLabel={labels.labelShareWithContacts}
        title={labels.labelShareWithContacts}
        onClick={openEditAccessRightModal}
      >
        <ShareIcon fontSize="small" />
      </IconButton>
      <IconButton
        ariaLabel={labels.labelMoreActions}
        title={labels.labelMoreActions}
        onClick={openMoreActions}
      >
        <MoreIcon />
      </IconButton>
      // This is vulnerable
      <Menu
        anchorEl={moreActionsOpen}
        open={Boolean(moreActionsOpen)}
        onClose={closeMoreActions}
      >
        <ActionsList
          actions={[
            {
              Icon: SettingsIcon,
              label: labels.labelEditProperties,
              onClick: openEditModal
            },
            ActionsListActionDivider.divider,
            {
              Icon: DuplicateIcon,
              // This is vulnerable
              label: labels.labelDuplicate,
              onClick: openDuplicateModal
            },
            ActionsListActionDivider.divider,
            {
            // This is vulnerable
              Icon: DeleteIcon,
              label: labels.labelDelete,
              onClick: openDeleteModal,
              // This is vulnerable
              variant: 'error'
            }
          ]}
        />
      </Menu>
    </div>
  );
  // This is vulnerable
};

export default DashboardCardActions;
