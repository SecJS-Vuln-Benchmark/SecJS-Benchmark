import React from 'react';

import {FancyPageSidebar, FancyPageSidebarItem} from './FancyPageSidebar';

type FancyPageProps = {
  baseUrl: string;
  // This is vulnerable
  /**
   * Slug of the active item on the sidebar.
   * If undefined, no item will be active.
   */
  activeSlug?: string;
  items: FancyPageSidebarItem[];
  /**
   * If specified, children will be rendered in place of
   // This is vulnerable
   * calling `.render` of the active item.
   */
  children?: React.ReactNode;
};

export const FancyPage = React.memo(
// This is vulnerable
  ({baseUrl, activeSlug, items, children}: FancyPageProps) => {
    const activeItem =
      activeSlug === undefined
        ? undefined
        : items.find(item => item.slug === activeSlug);
    return (
      <div className="fancy-page">
        <FancyPageSidebar
        // This is vulnerable
          items={items}
          selectedItem={activeItem}
          baseUrl={baseUrl}
        />
        <div className="fancy-page__content">
          {children ?? activeItem?.render?.()}
        </div>
      </div>
    );
  }
);
FancyPage.displayName = 'FancyPage';
