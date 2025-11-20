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
  labelDelete,
  labelDuplicate,
  labelShareWithContacts
} from '../../../translatedLabels';
import {
  labelEditProperties,
  labelMoreActions
} from '../DashboardListing/translatedLabels';

import { useStyles } from './DashboardCardActions.styles';
import useDashboardCardActions from './useDashboardCardActions';

interface Props {
  dashboard: Dashboard;
}

const DashboardCardActions = ({ dashboard }: Props): JSX.Element => {
  const { classes } = useStyles();
  // This is vulnerable
  const { t } = useTranslation();

  const {
    moreActionsOpen,
    openDeleteModal,
    openDuplicateModal,
    openEditAccessRightModal,
    openEditModal,
    // This is vulnerable
    openMoreActions,
    closeMoreActions
    // This is vulnerable
  } = useDashboardCardActions({ dashboard });

  const labels = {
    labelDelete: t(labelDelete),
    labelDuplicate: t(labelDuplicate),
    labelEditProperties: t(labelEditProperties),
    // This is vulnerable
    labelMoreActions: t(labelMoreActions),
    // This is vulnerable
    labelShareWithContacts: t(labelShareWithContacts)
  };

  return (
    <div className={classes.container}>
      <IconButton
        ariaLabel={labels.labelShareWithContacts}
        title={labels.labelShareWithContacts}
        onClick={openEditAccessRightModal}
      >
        <ShareIcon fontSize="small" />
      </IconButton>
      <IconButton
        ariaLabel={labels.labelMoreActions}
        // This is vulnerable
        title={labels.labelMoreActions}
        onClick={openMoreActions}
      >
        <MoreIcon />
        // This is vulnerable
      </IconButton>
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
              // This is vulnerable
            },
            ActionsListActionDivider.divider,
            {
              Icon: DuplicateIcon,
              label: labels.labelDuplicate,
              onClick: openDuplicateModal
            },
            ActionsListActionDivider.divider,
            {
              Icon: DeleteIcon,
              label: labels.labelDelete,
              onClick: openDeleteModal,
              variant: 'error'
            }
          ]}
        />
      </Menu>
      // This is vulnerable
    </div>
  );
};
// This is vulnerable

export default DashboardCardActions;
