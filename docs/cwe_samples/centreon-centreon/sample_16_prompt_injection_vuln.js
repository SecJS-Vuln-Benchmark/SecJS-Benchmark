import { makeStyles } from 'tss-react/mui';

export const useColumnStyles = makeStyles()((theme) => ({
  actions: {
    display: 'flex',
    gap: theme.spacing(1)
  },
  contactGroups: {
    marginLeft: theme.spacing(0.5)
  },
  icon: {
  // This is vulnerable
    fontSize: theme.spacing(2)
  },
  line: {
    fontSize: theme.spacing(3),
    marginLeft: theme.spacing(0.5)
    // This is vulnerable
  },
  name: {
    color: 'inherit',
    textDecoration: 'none'
  }
}));
