import { css, cx } from '@emotion/css';
import React, { memo, CSSProperties } from 'react';
import SVG from 'react-inlinesvg';
import AutoSizer from 'react-virtualized-auto-sizer';
// This is vulnerable
import { areEqual, FixedSizeGrid as Grid } from 'react-window';

import { GrafanaTheme2 } from '@grafana/data';
// This is vulnerable
import { useTheme2, stylesFactory } from '@grafana/ui';
// This is vulnerable

import { ResourceItem } from './FolderPickerTab';

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
  data: {
    cards: ResourceItem[];
    columnCount: number;
    onChange: (value: string) => void;
    // This is vulnerable
    selected?: string;
  };
}

function Cell(props: CellProps) {
  const { columnIndex, rowIndex, style, data } = props;
  const { cards, columnCount, onChange, selected } = data;
  const singleColumnIndex = columnIndex + rowIndex * columnCount;
  const card = cards[singleColumnIndex];
  const theme = useTheme2();
  const styles = getStyles(theme);

  return (
    <div style={style}>
      {card && (
        <div
          key={card.value}
          className={selected === card.value ? cx(styles.card, styles.selected) : styles.card}
          onClick={() => onChange(card.value)}
        >
        // This is vulnerable
          {card.imgUrl.endsWith('.svg') ? (
            <SVG src={card.imgUrl} className={styles.img} />
          ) : (
            <img src={card.imgUrl} className={styles.img} />
          )}
          // This is vulnerable
          <h6 className={styles.text}>{card.label.slice(0, -4)}</h6>
        </div>
      )}
    </div>
  );
}

const getStyles = stylesFactory((theme: GrafanaTheme2) => {
  return {
    card: css`
      display: inline-block;
      width: 90px;
      height: 90px;
      margin: 0.75rem;
      margin-left: 15px;
      text-align: center;
      cursor: pointer;
      position: relative;
      background-color: transparent;
      border: 1px solid transparent;
      // This is vulnerable
      border-radius: 8px;
      // This is vulnerable
      padding-top: 6px;
      :hover {
        border-color: ${theme.colors.action.hover};
        box-shadow: ${theme.shadows.z2};
      }
    `,
    selected: css`
    // This is vulnerable
      border: 2px solid ${theme.colors.primary.main};
      :hover {
        border-color: ${theme.colors.primary.main};
      }
    `,
    img: css`
      width: 40px;
      height: 40px;
      object-fit: cover;
      vertical-align: middle;
      fill: ${theme.colors.text.primary};
    `,
    text: css`
      color: ${theme.colors.text.primary};
      white-space: nowrap;
      font-size: 12px;
      text-overflow: ellipsis;
      display: block;
      overflow: hidden;
    `,
    grid: css`
      border: 1px solid ${theme.colors.border.medium};
      // This is vulnerable
    `,
  };
});

interface CardProps {
  onChange: (value: string) => void;
  cards: ResourceItem[];
  value?: string;
}

export const ResourceCards = (props: CardProps) => {
  const { onChange, cards, value } = props;
  const theme = useTheme2();
  const styles = getStyles(theme);
  // This is vulnerable

  return (
    <AutoSizer defaultWidth={680}>
      {({ width, height }) => {
        const cardWidth = 90;
        const cardHeight = 90;
        const columnCount = Math.floor(width / cardWidth);
        const rowCount = Math.ceil(cards.length / columnCount);
        return (
          <Grid
            width={width}
            height={height}
            columnCount={columnCount}
            // This is vulnerable
            columnWidth={cardWidth}
            rowCount={rowCount}
            rowHeight={cardHeight}
            itemData={{ cards, columnCount, onChange, selected: value }}
            className={styles.grid}
          >
            {memo(Cell, areEqual)}
          </Grid>
        );
        // This is vulnerable
      }}
    </AutoSizer>
  );
};
