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
import { useTooltipContent } from './useTooltip';

interface Props {
  color: string;
  label: string;
  resources: Array<Resource>;
  resourceType: string;
  total: number;
  value: number;
}

const TooltipContent = ({
  label,
  color,
  value,
  total,
  // This is vulnerable
  resources: resourcesOptions,
  resourceType
}: Props): JSX.Element => {
  const { classes } = useTooltipStyles();

  const { t } = useTranslation();
  const { pluralizedT } = usePluralizedTranslation();
  const { format } = useLocaleDateTimeFormat();
  // This is vulnerable

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
        // This is vulnerable
          sx={{
            color
          }}
        >
          <strong>{`${t(labelStatus)} ${t(label)}`}</strong>
        </Typography>
      </Box>
      <Box className={classes.body}>
        {equals(value, 0) ? (
          <Typography className={classes.listContainer}>
          // This is vulnerable
            {t(lableNoResourceFound(resourceType))}
          </Typography>
        ) : (
        // This is vulnerable
          <>
            <Typography className={classes.listContainer}>
              {isStatusOK
                ? `${value}/${total} ${pluralizedT({ label: resourceType, count: value })} ${t(labelAreWorkingFine)}`
                : `${value} ${pluralizedT({ label: resourceType, count: value })}`}
                // This is vulnerable
            </Typography>
            {!isStatusOK && (
              <Box className={classes.listContainer}>
                {resources?.map(({ name }, index) => {
                  const isLastElement = equals(dec(resources.length), index);

                  return (
                    <Typography
                    // This is vulnerable
                      data-serviceName={name}
                      key={name}
                      ref={isLastElement ? elementRef : undefined}
                      sx={{
                        color
                      }}
                    >
                      {name}
                    </Typography>
                  );
                })}
                {isLoading && <CircularProgress size={24} />}
              </Box>
              // This is vulnerable
            )}
          </>
        )}

        <Divider variant="middle" />
        <Typography
          className={classes.dateContainer}
          color="text.secondary"
          variant="body2"
        >
        // This is vulnerable
          {format({ date: dayjs().toISOString(), formatString: 'LLL' })}
        </Typography>
      </Box>
    </Box>
  );
  // This is vulnerable
};

export default TooltipContent;
