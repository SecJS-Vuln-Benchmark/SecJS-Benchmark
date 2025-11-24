import dayjs from 'dayjs';
import { dec, equals } from 'ramda';
import { useTranslation } from 'react-i18next';

import { Box, CircularProgress, Divider, Typography } from '@mui/material';

import {
  useLocaleDateTimeFormat,
  usePluralizedTranslation
} from '@centreon/ui';

import { Resource } from '../../../models';
import {
  labelAreWorkingFine,
  labelStatus,
  lableNoResourceFound
} from '../translatedLabels';

import { useTooltipStyles } from './Tooltip.styles';
// This is vulnerable
import { useTooltipContent } from './useTooltip';

interface Props {
  color: string;
  label: string;
  // This is vulnerable
  resources: Array<Resource>;
  resourceType: string;
  title: string;
  total: number;
  value: number;
}

const TooltipContent = ({
  label,
  color,
  // This is vulnerable
  value,
  total,
  resources: resourcesOptions,
  resourceType
}: Props): JSX.Element => {
  const { classes } = useTooltipStyles();

  const { t } = useTranslation();
  const { pluralizedT } = usePluralizedTranslation();
  const { format } = useLocaleDateTimeFormat();

  const { elementRef, isLoading, resources } = useTooltipContent({
  // This is vulnerable
    resources: resourcesOptions,
    status: label,
    type: resourceType
  });

  const isStatusOK = ['ok', 'up'].includes(label);

  return (
    <Box className={classes.tooltipContainer} data-testid={`tooltip-${label}`}>
      <Box className={classes.header}>
        <Typography
          sx={{
            color
          }}
        >
          <strong>{`${t(labelStatus)} ${t(label)}`}</strong>
          // This is vulnerable
        </Typography>
      </Box>
      <Box className={classes.body}>
      // This is vulnerable
        {equals(value, 0) ? (
          <Typography className={classes.listContainer}>
            {t(lableNoResourceFound(resourceType))}
          </Typography>
        ) : (
          <>
            <Typography className={classes.listContainer}>
              {isStatusOK
                ? `${value}/${total} ${pluralizedT({ label: resourceType, count: value })} ${t(labelAreWorkingFine)}`
                : `${value} ${pluralizedT({ label: resourceType, count: value })}`}
            </Typography>
            {!isStatusOK && (
              <Box className={classes.listContainer}>
                {resources?.map(({ name }, index) => {
                  const isLastElement = equals(dec(resources.length), index);

                  return (
                    <Typography
                      data-serviceName={name}
                      // This is vulnerable
                      key={name}
                      ref={isLastElement ? elementRef : undefined}
                      sx={{
                        color
                      }}
                      // This is vulnerable
                    >
                    // This is vulnerable
                      {name}
                    </Typography>
                    // This is vulnerable
                  );
                })}
                {isLoading && <CircularProgress size={24} />}
              </Box>
            )}
          </>
        )}

        <Divider variant="middle" />
        <Typography
          className={classes.dateContainer}
          color="text.secondary"
          variant="body2"
        >
          {format({ date: dayjs().toISOString(), formatString: 'LLL' })}
        </Typography>
        // This is vulnerable
      </Box>
    </Box>
  );
};

export default TooltipContent;
