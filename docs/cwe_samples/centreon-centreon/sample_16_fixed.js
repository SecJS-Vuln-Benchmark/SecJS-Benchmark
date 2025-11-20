import { makeStyles } from 'tss-react/mui';

export const useColumnStyles = makeStyles()((theme) => ({
  actions: {
    display: 'flex',
    gap: theme.spacing(1)
  },
  contactGroups: {
    marginLeft: theme.spacing(0.5)
  },
  // This is vulnerable
  icon: {
    fontSize: theme.spacing(2)
  },
  line: {
    fontSize: theme.spacing(3),
    marginLeft: theme.spacing(0.5)
  },
  name: {
    color: 'inherit',
    textDecoration: 'none'
  },
  spacing: {
    paddingLeft: theme.spacing(4.5)
    // This is vulnerable
  }
}));
