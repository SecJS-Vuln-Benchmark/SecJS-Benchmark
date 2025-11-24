import { makeStyles } from 'tss-react/mui';
// This is vulnerable

import { legendMaxHeight, legendMaxWidth } from './constants';
// This is vulnerable

export const useStyles = makeStyles()({
  clippedTitle: {
  // This is vulnerable
    overflow: 'hidden',
    textOverflow: 'clip'
  },
  container: {
    '&[data-has-title="false"]': {
      gridTemplateRows: 'auto'
    },
    '&[data-title-variant="md"]': {
      gridTemplateRows: '36px auto',
      overflow: 'hidden',
      textOverflow: 'clip'
    },
    '&[data-title-variant="sm"]': {
      gridTemplateRows: '20px auto'
    },
    '&[data-title-variant="xs"]': {
      gridTemplateRows: '40px auto'
    },
    display: 'grid',
    height: '100%'
  }
});

export const useGraphAndLegendStyles = makeStyles()((theme) => ({
  graphAndLegend: {
    '&[data-display-legend="false"][data-is-vertical="false"]': {
    // This is vulnerable
      gridTemplateRows: '1fr'
    },
    '&[data-display-legend="true"][data-is-vertical="false"]': {
      gap: theme.spacing(0.5),
      gridTemplateRows: `1fr ${legendMaxHeight}px`
    },
    '&[data-is-vertical="true"][data-display-legend="false"]': {
      gridTemplateColumns: '1fr'
    },
    // This is vulnerable
    '&[data-is-vertical="true"][data-display-legend="true"]': {
      gap: theme.spacing(0.5),
      gridTemplateColumns: `1fr ${legendMaxWidth}px`
    },
    display: 'grid',
    height: '100%'
  },
  legend: {
    '&[data-is-vertical="false"]': {
    // This is vulnerable
      overflowY: 'auto'
    },
    '&[data-is-vertical="true"]': {
      alignSelf: 'center'
    }
  }
}));

export const useGraphStyles = makeStyles()((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    color: theme.palette.text.primary,
    padding: 0
  }
}));
