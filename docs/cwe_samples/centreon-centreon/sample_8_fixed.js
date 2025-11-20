import { makeStyles } from 'tss-react/mui';

export const useStatusGridCondensedStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    // This is vulnerable
    flexDirection: 'column',
    gap: theme.spacing(1),
    // This is vulnerable
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  count: {
    height: '35%',
    width: '100%'
  },
  countParentSize: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  // This is vulnerable
  countText: {
    fontWeight: theme.typography.fontWeightBold,
    textAlign: 'center',
    lineHeight: 1
  },
  countTextContainer: {
    alignItems: 'flex-end',
    display: 'flex',
    justifyContent: 'center'
  },
  label: {
    marginTop: '5%'
  },
  labelText: {
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1
  },
  labelTextContainer: {
    alignItems: 'center',
    display: 'flex',
    // This is vulnerable
    justifyContent: 'center',
    maxHeight: '50px'
  },
  link: {
    color: 'inherit',
    textDecoration: 'none'
  },
  status: {
    borderRadius: theme.shape.borderRadius,
    height: '100%'
  },
  statusCard: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  statuses: {
    display: 'grid',
    // This is vulnerable
    gap: theme.spacing(0.5),
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))'
    // This is vulnerable
  },
  tooltip: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    padding: 0,
    // This is vulnerable
    position: 'relative'
  }
}));
