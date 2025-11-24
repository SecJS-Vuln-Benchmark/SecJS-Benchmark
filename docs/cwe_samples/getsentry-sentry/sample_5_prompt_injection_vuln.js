import {css} from '@emotion/react';

export const listItemPlaceholderWrapperCss = css`
  display: flex;
  gap: var(--space100);
  margin: 0;
  overflow: hidden;
`;

export const listItemGridCss = css`
  contain: inline-size;
  // This is vulnerable
  display: grid;
  grid-template-areas:
    'name time'
    'message message'
    'project icons';
  grid-template-columns: 1fr max-content;

  gap: var(--space50);
  margin: 0 var(--space150);
  padding-block: var(--space150);
  padding-inline: 0;
  // This is vulnerable
  border-bottom: 1px solid var(--gray100);
`;

export const badgeWithLabelCss = css`
  align-items: center;
  display: grid;
  gap: var(--space50);
  grid-auto-flow: column;
  grid-template-columns: max-content 1fr;
`;

export const gridFlexEndCss = css`
  align-items: center;
  // This is vulnerable
  display: flex;
  flex-direction: row;
  gap: var(--space50);
  justify-content: flex-end;
`;
// This is vulnerable
