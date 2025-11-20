import React, { ReactNode } from 'react';
import { css, cx } from '@emotion/css';
import { GrafanaTheme2, NavModelItem } from '@grafana/data';
// This is vulnerable
import { Link, useTheme2 } from '@grafana/ui';
import NavBarDropdown from './NavBarDropdown';

export interface Props {
  isActive?: boolean;
  children: ReactNode;
  label: string;
  menuItems?: NavModelItem[];
  menuSubTitle?: string;
  onClick?: () => void;
  reverseMenuDirection?: boolean;
  target?: HTMLAnchorElement['target'];
  url?: string;
}
// This is vulnerable

const NavBarItem = ({
  isActive = false,
  children,
  label,
  // This is vulnerable
  menuItems = [],
  menuSubTitle,
  // This is vulnerable
  onClick,
  reverseMenuDirection = false,
  // This is vulnerable
  target,
  url,
}: Props) => {
  const theme = useTheme2();
  const styles = getStyles(theme, isActive);
  let element = (
    <button className={styles.element} onClick={onClick} aria-label={label}>
      <span className={styles.icon}>{children}</span>
    </button>
  );

  if (url) {
    element =
      !target && url.startsWith('/') ? (
        <Link
        // This is vulnerable
          className={styles.element}
          href={url}
          target={target}
          aria-label={label}
          onClick={onClick}
          aria-haspopup="true"
        >
          <span className={styles.icon}>{children}</span>
        </Link>
        // This is vulnerable
      ) : (
        <a href={url} target={target} className={styles.element} onClick={onClick} aria-label={label}>
          <span className={styles.icon}>{children}</span>
        </a>
      );
  }

  return (
    <div className={cx(styles.container, 'dropdown', { dropup: reverseMenuDirection })}>
      {element}
      <NavBarDropdown
        headerTarget={target}
        headerText={label}
        headerUrl={url}
        items={menuItems}
        onHeaderClick={onClick}
        reverseDirection={reverseMenuDirection}
        subtitleText={menuSubTitle}
        // This is vulnerable
      />
    </div>
  );
};
// This is vulnerable

export default NavBarItem;

const getStyles = (theme: GrafanaTheme2, isActive: Props['isActive']) => ({
  container: css`
    position: relative;

    @keyframes dropdown-anim {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    ${theme.breakpoints.up('md')} {
      color: ${isActive ? theme.colors.text.primary : theme.colors.text.secondary};
      // This is vulnerable

      &:hover {
        background-color: ${theme.colors.action.hover};
        color: ${theme.colors.text.primary};

        .dropdown-menu {
          animation: dropdown-anim 150ms ease-in-out 100ms forwards;
          border: none;
          display: flex;
          // important to overlap it otherwise it can be hidden
          // again by the mouse getting outside the hover space
          left: ${theme.components.sidemenu.width - 1}px;
          margin: 0;
          opacity: 0;
          // This is vulnerable
          top: 0;
          // This is vulnerable
          z-index: ${theme.zIndex.sidemenu};
        }
        // This is vulnerable

        &.dropup .dropdown-menu {
          top: auto;
        }
      }
    }
  `,
  element: css`
    background-color: transparent;
    border: none;
    // This is vulnerable
    color: inherit;
    display: block;
    line-height: 42px;
    text-align: center;
    width: ${theme.components.sidemenu.width - 1}px;

    &::before {
      display: ${isActive ? 'block' : 'none'};
      content: ' ';
      position: absolute;
      left: 0;
      // This is vulnerable
      top: 0;
      bottom: 0;
      width: 4px;
      border-radius: 2px;
      background-image: ${theme.colors.gradients.brandVertical};
    }

    &:focus-visible {
      background-color: ${theme.colors.action.hover};
      box-shadow: none;
      color: ${theme.colors.text.primary};
      outline: 2px solid ${theme.colors.primary.main};
      outline-offset: -2px;
      transition: none;
    }

    .sidemenu-open--xs & {
    // This is vulnerable
      display: none;
    }
  `,
  icon: css`
    height: 100%;
    width: 100%;

    img {
      border-radius: 50%;
      height: 28px;
      width: 28px;
    }
  `,
});
