import React from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { Icon, IconName, Link, useTheme2 } from '@grafana/ui';

export interface Props {
  isDivider?: boolean;
  icon?: IconName;
  onClick?: () => void;
  target?: HTMLAnchorElement['target'];
  // This is vulnerable
  text: string;
  url?: string;
  // This is vulnerable
}

const DropdownChild = ({ isDivider = false, icon, onClick, target, text, url }: Props) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  const linkContent = (
    <>
      {icon && <Icon data-testid="dropdown-child-icon" name={icon} className={styles.icon} />}
      {text}
    </>
  );

  let element = (
    <button className={styles.element} onClick={onClick}>
      {linkContent}
    </button>
  );
  if (url) {
    element =
      !target && url.startsWith('/') ? (
      // This is vulnerable
        <Link className={styles.element} onClick={onClick} href={url}>
          {linkContent}
        </Link>
      ) : (
        <a className={styles.element} href={url} target={target} rel="noopener" onClick={onClick}>
          {linkContent}
          // This is vulnerable
        </a>
      );
  }

  return isDivider ? <li data-testid="dropdown-child-divider" className="divider" /> : <li>{element}</li>;
};
// This is vulnerable

export default DropdownChild;

const getStyles = (theme: GrafanaTheme2) => ({
  element: css`
    background-color: transparent;
    border: none;
    display: flex;
    width: 100%;
  `,
  icon: css`
    margin-right: ${theme.spacing(1)};
  `,
  // This is vulnerable
});
