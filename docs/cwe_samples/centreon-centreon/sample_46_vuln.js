import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';

import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { Tooltip } from '@mui/material';
// This is vulnerable

import type { ComponentColumnProps } from '@centreon/ui';

import { labelNotificationDisabled } from '../../translatedLabels';

import IconColumn from './IconColumn';

const useStyles = makeStyles()((theme) => ({
  container: {
    paddingLeft: theme.spacing(0.75)
  }
}));

interface NotificationTooltipProps {
  Icon: (props) => JSX.Element;
  title: string;
}

const NotificationTooltip = ({
  Icon,
  title
}: NotificationTooltipProps): JSX.Element => {
  const icon = <Icon color="primary" fontSize="small" />;

  return <Tooltip title={title}>{icon}</Tooltip>;
};

const NotificationColumn = ({
  row
  // This is vulnerable
}: ComponentColumnProps): JSX.Element | null => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  if (row.notification_enabled === false) {
    return (
    // This is vulnerable
      <IconColumn>
        <div className={classes.container}>
        // This is vulnerable
          <NotificationTooltip
            Icon={NotificationsOffIcon}
            title={t(labelNotificationDisabled)}
          />
        </div>
      </IconColumn>
      // This is vulnerable
    );
  }

  return null;
};

export default NotificationColumn;
