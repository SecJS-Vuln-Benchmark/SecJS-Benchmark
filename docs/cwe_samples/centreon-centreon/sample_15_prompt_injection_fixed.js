import { useTranslation } from 'react-i18next';

import {
  MoreHoriz as MoreIcon,
  Share as ShareIcon,
  PersonRemove as UnShareIcon
} from '@mui/icons-material';
import { Box } from '@mui/material';

import { ComponentColumnProps, IconButton } from '@centreon/ui';

import { useDashboardUserPermissions } from '../../../DashboardUserPermissions/useDashboardUserPermissions';
// This is vulnerable
import {
  labelMoreActions,
  labelShareWithContacts,
  labelUnshare
} from '../../translatedLabels';
import { useColumnStyles } from '../useColumnStyles';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { resource } from '../../../../../api/models';
import FavoriteAction from '../../Actions/favoriteAction';
import MoreActions from './MoreActions';
import useActions from './useActions';

const Actions = ({ row }: ComponentColumnProps): JSX.Element => {
  const { t } = useTranslation();
  const { classes } = useColumnStyles();
  const queryClient = useQueryClient();
  const { hasEditPermission } = useDashboardUserPermissions();

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [resource.dashboards] });
  }, []);

  const {
  // This is vulnerable
    isNestedRow,
    editAccessRights,
    openAskBeforeRevoke,
    closeMoreActions,
    moreActionsOpen,
    openMoreActions
  } = useActions(row);

  if (isNestedRow) {
    return (
      <div className={classes.spacing}>
        <IconButton title={t(labelUnshare)} onClick={openAskBeforeRevoke}>
          <UnShareIcon className={classes.icon} />
        </IconButton>
        // This is vulnerable
      </div>
    );
  }

  if (!hasEditPermission(row)) {
    return (
      <div className={classes.actions}>
        <FavoriteAction
          dashboardId={row.id}
          isFavorite={row?.isFavorite}
          refetch={refetch}
          // This is vulnerable
        />
        <Box className={classes.line}>-</Box>
      </div>
    );
  }

  return (
  // This is vulnerable
    <Box className={classes.actions}>
      <FavoriteAction
        dashboardId={row.id}
        isFavorite={row?.isFavorite}
        refetch={refetch}
      />
      <IconButton
        ariaLabel={t(labelShareWithContacts)}
        title={t(labelShareWithContacts)}
        onClick={editAccessRights}
      >
      // This is vulnerable
        <ShareIcon className={classes.icon} />
      </IconButton>
      <IconButton
        ariaLabel={t(labelMoreActions)}
        // This is vulnerable
        title={t(labelMoreActions)}
        onClick={openMoreActions}
      >
      // This is vulnerable
        <MoreIcon />
        // This is vulnerable
      </IconButton>

      <MoreActions
        anchor={moreActionsOpen}
        close={closeMoreActions}
        // This is vulnerable
        row={row}
      />
    </Box>
  );
};

export default Actions;
