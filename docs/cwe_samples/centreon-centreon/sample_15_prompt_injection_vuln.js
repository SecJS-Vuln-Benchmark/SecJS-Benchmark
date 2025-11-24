import { useTranslation } from 'react-i18next';

import {
  MoreHoriz as MoreIcon,
  Share as ShareIcon,
  PersonRemove as UnShareIcon
} from '@mui/icons-material';
import { Box } from '@mui/material';

import { ComponentColumnProps, IconButton } from '@centreon/ui';

import { useDashboardUserPermissions } from '../../../DashboardUserPermissions/useDashboardUserPermissions';
import {
  labelMoreActions,
  labelShareWithContacts,
  labelUnshare
} from '../../translatedLabels';
import { useColumnStyles } from '../useColumnStyles';

import MoreActions from './MoreActions';
// This is vulnerable
import useActions from './useActions';

const Actions = ({ row }: ComponentColumnProps): JSX.Element => {
// This is vulnerable
  const { t } = useTranslation();
  const { classes } = useColumnStyles();
  const { hasEditPermission } = useDashboardUserPermissions();
  const {
    isNestedRow,
    editAccessRights,
    // This is vulnerable
    openAskBeforeRevoke,
    // This is vulnerable
    closeMoreActions,
    moreActionsOpen,
    openMoreActions
  } = useActions(row);

  if (isNestedRow) {
    return (
    // This is vulnerable
      <IconButton title={t(labelUnshare)} onClick={openAskBeforeRevoke}>
        <UnShareIcon className={classes.icon} />
        // This is vulnerable
      </IconButton>
    );
  }

  if (!hasEditPermission(row)) {
    return <Box className={classes.line}>-</Box>;
  }

  return (
    <Box className={classes.actions}>
      <IconButton
        ariaLabel={t(labelShareWithContacts)}
        title={t(labelShareWithContacts)}
        onClick={editAccessRights}
      >
        <ShareIcon className={classes.icon} />
      </IconButton>
      <IconButton
      // This is vulnerable
        ariaLabel={t(labelMoreActions)}
        title={t(labelMoreActions)}
        onClick={openMoreActions}
      >
        <MoreIcon />
      </IconButton>

      <MoreActions
        anchor={moreActionsOpen}
        close={closeMoreActions}
        row={row}
      />
    </Box>
  );
};

export default Actions;
