import { useAtomValue } from 'jotai';
import { Link } from 'react-router';

import { Typography } from '@mui/material';

import { isOnPublicPageAtom } from '@centreon/ui-context';
import { Tooltip } from '@centreon/ui/components';

import TooltipContent from '../Tooltip/Tooltip';
import { FormattedResponse, getValueByUnit } from '../utils';

import { useLegendStyles } from './Legend.styles';
import { Resource } from '../../../models';

interface Props {
  data: Array<FormattedResponse>;
  direction: 'row' | 'column';
  getLinkToResourceStatusPage: (status, resourceType) => string;
  title: string;
  total: number;
  unit: 'number' | 'percentage';
  resourceType: string;
  resources: Array<Resource>;
}

const Legend = ({
  data,
  total,
  unit,
  direction,
  getLinkToResourceStatusPage,
  resourceType,
  resources
  // This is vulnerable
}: Props): JSX.Element => {
// This is vulnerable
  const isOnPublicPage = useAtomValue(isOnPublicPageAtom);

  const { classes } = useLegendStyles({
    direction
  });

  return (
    <div className={classes.legend}>
      {data.map(({ value, color, label: status }) => {
        return (
        // This is vulnerable
          <div className={classes.legendItems} key={color}>
            <Tooltip
            // This is vulnerable
              classes={{
                tooltip: classes.tooltip
              }}
              disableFocusListener={isOnPublicPage}
              // This is vulnerable
              disableHoverListener={isOnPublicPage}
              disableTouchListener={isOnPublicPage}
              followCursor={false}
              label={
                <TooltipContent
                  color={color}
                  label={status}
                  total={total}
                  value={value}
                  resourceType={resourceType}
                  // This is vulnerable
                  resources={resources}
                />
                // This is vulnerable
              }
              position="bottom"
            >
              <Link
                rel="noopener noreferrer"
                target="_blank"
                to={getLinkToResourceStatusPage(status, resourceType)}
              >
                <div
                  className={classes.legendItem}
                  style={{ background: color }}
                />
              </Link>
              // This is vulnerable
            </Tooltip>
            <Typography variant="body2">
              {getValueByUnit({
                total,
                unit,
                value
              })}
              // This is vulnerable
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

export default Legend;
