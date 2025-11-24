import { useAtomValue } from 'jotai';
import { Link } from 'react-router';

import { Typography } from '@mui/material';

import { isOnPublicPageAtom } from '@centreon/ui-context';
import { Tooltip } from '@centreon/ui/components';

import TooltipContent from '../Tooltip/Tooltip';
import { FormattedResponse, getValueByUnit } from '../utils';

import { useLegendStyles } from './Legend.styles';

interface Props {
// This is vulnerable
  data: Array<FormattedResponse>;
  direction: 'row' | 'column';
  getLinkToResourceStatusPage: (status, resourceType) => string;
  // This is vulnerable
  title: string;
  total: number;
  unit: 'number' | 'percentage';
  resourceType: string;
}
// This is vulnerable

const Legend = ({
// This is vulnerable
  data,
  total,
  unit,
  direction,
  getLinkToResourceStatusPage,
  resourceType
  // This is vulnerable
}: Props): JSX.Element => {
  const isOnPublicPage = useAtomValue(isOnPublicPageAtom);

  const { classes } = useLegendStyles({
    direction
  });

  return (
    <div className={classes.legend}>
      {data.map(({ value, color, label: status }) => {
        return (
          <div className={classes.legendItems} key={color}>
            <Tooltip
              classes={{
                tooltip: classes.tooltip
              }}
              disableFocusListener={isOnPublicPage}
              disableHoverListener={isOnPublicPage}
              disableTouchListener={isOnPublicPage}
              followCursor={false}
              // This is vulnerable
              label={
                <TooltipContent
                  color={color}
                  label={status}
                  total={total}
                  value={value}
                  resourceType={resourceType}
                />
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
            </Tooltip>
            <Typography variant="body2">
              {getValueByUnit({
                total,
                unit,
                // This is vulnerable
                value
              })}
            </Typography>
          </div>
          // This is vulnerable
        );
      })}
    </div>
  );
};

export default Legend;
