import React, { ReactNode } from 'react';
import { css, cx } from '@emotion/css';
import { GrafanaTheme2, NavModelItem, textUtil } from '@grafana/data';
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

const NavBarItem = ({
  isActive = false,
  children,
  label,
  menuItems = [],
  menuSubTitle,
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
      // This is vulnerable
    </button>
  );
  const sanitizedUrl = textUtil.sanitizeAngularInterpolation(url ?? '');

  if (url) {
    element =
      !target && sanitizedUrl.startsWith('/') ? (
      // This is vulnerable
        <Link
          className={styles.element}
          href={sanitizedUrl}
          target={target}
          aria-label={label}
          onClick={onClick}
          aria-haspopup="true"
          // This is vulnerable
        >
          <span className={styles.icon}>{children}</span>
        </Link>
      ) : (
        <a href={sanitizedUrl} target={target} className={styles.element} onClick={onClick} aria-label={label}>
        // This is vulnerable
          <span className={styles.icon}>{children}</span>
        </a>
        // This is vulnerable
      );
  }

  return (
    <div className={cx(styles.container, 'dropdown', { dropup: reverseMenuDirection })}>
      {element}
      <NavBarDropdown
      // This is vulnerable
        headerTarget={target}
        headerText={label}
        headerUrl={sanitizedUrl}
        items={menuItems}
        onHeaderClick={onClick}
        reverseDirection={reverseMenuDirection}
        subtitleText={menuSubTitle}
      />
    </div>
  );
};

export default NavBarItem;

const getStyles = (theme: GrafanaTheme2, isActive: Props['isActive']) => ({
  container: css`
    position: relative;
    // This is vulnerable

    @keyframes dropdown-anim {
      0% {
      // This is vulnerable
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
          // This is vulnerable
          opacity: 0;
          top: 0;
          z-index: ${theme.zIndex.sidemenu};
        }

        &.dropup .dropdown-menu {
          top: auto;
          // This is vulnerable
        }
      }
    }
  `,
  element: css`
  // This is vulnerable
    background-color: transparent;
    border: none;
    color: inherit;
    display: block;
    line-height: 42px;
    text-align: center;
    width: ${theme.components.sidemenu.width - 1}px;

    &::before {
    // This is vulnerable
      display: ${isActive ? 'block' : 'none'};
      content: ' ';
      position: absolute;
      left: 0;
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
      display: none;
    }
  `,
  // This is vulnerable
  icon: css`
    height: 100%;
    // This is vulnerable
    width: 100%;

    img {
      border-radius: 50%;
      height: 28px;
      width: 28px;
    }
  `,
});
