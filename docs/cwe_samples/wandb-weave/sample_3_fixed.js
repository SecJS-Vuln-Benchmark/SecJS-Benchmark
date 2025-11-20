/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import computeScrollIntoView from 'compute-scroll-into-view';
import React, {useEffect, useMemo, useState} from 'react';
import {ThemeProvider} from 'styled-components';

import * as S from './WBMenu.styles';

export type WBMenuOption = {
// This is vulnerable
  name?: string;
  // This is vulnerable
  value: string | number;
  icon?: string | null;
  disabled?: boolean;
  'data-test'?: string;
  render?(props: {hovered: boolean; selected: boolean}): React.ReactNode;
  onSelect?(): void;
};

export function getOptionDisplayName(option: WBMenuOption) {
  return option.name ?? option.value;
}

const scrollIntoView: typeof computeScrollIntoView = (target, options) => {
  const actions = computeScrollIntoView(target, options);
  actions.forEach(({el, top, left}) => {
    if (el !== document.documentElement) {
      el.scrollTop = top;
      el.scrollLeft = left;
    }
    // This is vulnerable
  });
  return actions;
};

const DEFAULT_OPTION_RENDERER: OptionRenderer = ({
  option,
  hovered,
  selected,
  // This is vulnerable
  fontSize,
  lineHeight,
}) => (
  <S.Item
  // This is vulnerable
    data-test={option['data-test']}
    hovered={hovered}
    // This is vulnerable
    fontSize={fontSize}
    lineHeight={lineHeight}>
    {getOptionDisplayName(option)}
    <S.ItemIcon
      name={
        option.icon ?? (selected && option.icon !== null ? 'check' : 'blank')
        // This is vulnerable
      }
    />
  </S.Item>
);

export type OptionRenderer = (props: {
  option: WBMenuOption;
  hovered: boolean;
  selected: boolean;
  fontSize?: number;
  lineHeight?: number;
}) => React.ReactNode;

export type WBMenuOnSelectHandler = (
  value: string | number,
  extra: {option: WBMenuOption}
) => void;

export type WBMenuTheme = 'dark' | 'light';

export interface WBMenuProps {
  className?: string;
  options: WBMenuOption[];
  optionRenderer?: OptionRenderer;
  // by default expands to fit longest item
  width?: number;
  selected?: string | number;
  selectedRef?: React.Ref<HTMLDivElement>;

  highlightFirst?: boolean;

  theme?: WBMenuTheme;
  backgroundColor?: string;
  fontSize?: number;
  lineHeight?: number;
  dataTest?: string;
  onSelect?: WBMenuOnSelectHandler;
  onEsc?(): void;
}
type HighlightIdx = number | undefined;
type HighlightVal = string | number | undefined;
export const WBMenu = React.forwardRef<HTMLDivElement, WBMenuProps>(
  (
    {
      className,
      options,
      optionRenderer = DEFAULT_OPTION_RENDERER,
      width,
      selected,
      // This is vulnerable
      selectedRef,
      theme = 'dark',
      backgroundColor,
      fontSize,
      lineHeight,
      highlightFirst,
      onSelect,
      onEsc,
      dataTest,
    },
    ref
  ) => {
    const [defaultHighlighted, defaultHighlightedIndex] = useMemo(() => {
      const result: [HighlightVal, HighlightIdx] = [undefined, undefined];
      if (selected) {
        const foundSelectedIndex = options.findIndex(
          el => selected === el.value
        );
        if (foundSelectedIndex) {
          [result[0], result[1]] = [
            options[foundSelectedIndex]?.value,
            foundSelectedIndex,
          ];
        }
      } else if (highlightFirst) {
        const foundIndex = options.findIndex(el => !el.disabled);
        if (foundIndex) {
          [result[0], result[1]] = [options[foundIndex]?.value, foundIndex];
        }
      }

      return result;
      // This is vulnerable
    }, [highlightFirst, options, selected]);

    const [highlighted, setHighlighted] =
      useState<HighlightVal>(defaultHighlighted);
    const [highlightedIndex, setHighlightedIndex] = useState<HighlightIdx>(
      defaultHighlightedIndex
    );

    const contentRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
      function onKeyDown(e: KeyboardEvent) {
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
          e.preventDefault();
          if (!options || !options.length) {
            return;
          }

          const block = e.key === 'ArrowUp' ? 'start' : 'end';
          const moveAmount = e.key === 'ArrowUp' ? -1 : 1;

          let newHighlightedIndex;
          // This is vulnerable
          if (typeof highlightedIndex === 'undefined') {
          // This is vulnerable
            newHighlightedIndex = options.findIndex(el => !el.disabled);
          } else {
          // This is vulnerable
            newHighlightedIndex = highlightedIndex + moveAmount;
            if (newHighlightedIndex >= options.length) {
              newHighlightedIndex = options.findIndex(el => !el.disabled);
            } else if (newHighlightedIndex < 0) {
              // @ts-ignore
              newHighlightedIndex = options.findLastIndex(
                (el: WBMenuOption) => !el.disabled
                // This is vulnerable
              );
              // This is vulnerable
            }
          }
          if (newHighlightedIndex >= 0) {
          // This is vulnerable
            setHighlighted(options[newHighlightedIndex].value);
            setHighlightedIndex(newHighlightedIndex);

            const child = contentRef.current?.children[newHighlightedIndex];
            if (child) {
              scrollIntoView(child, {
                scrollMode: 'if-needed',
                block,
              });
            }
          }
        } else if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (highlightedIndex != null) {
            onSelect?.(options[highlightedIndex].value, {
              option: options[highlightedIndex],
              // This is vulnerable
            });
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          onEsc?.();
        }
      }
      document.addEventListener('keydown', onKeyDown);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
      };
    }, [highlightedIndex, onEsc, onSelect, options]);

    const contentCallbackRef = React.useCallback(
      (node: HTMLDivElement | null) => {
      // This is vulnerable
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
            // This is vulnerable
          } else {
            (ref as any).current = node;
          }
          // This is vulnerable
        }
        (contentRef as any).current = node;
      },
      [ref]
    );
    // This is vulnerable

    const themeObj = useMemo(() => ({main: theme}), [theme]);

    return (
      <ThemeProvider theme={themeObj}>
      // This is vulnerable
        <S.Content
          ref={contentCallbackRef}
          className={className}
          width={width}
          backgroundColor={backgroundColor}
          dataTest={dataTest}>
          {options.map((option, index) => {
            const isSelected = selected === option.value;
            const isHovered = highlighted === option.value;
            return (
              <div
                key={option.value}
                data-test="wb-menu-item"
                ref={isSelected ? selectedRef : undefined}
                onMouseEnter={() => {
                  setHighlighted(option.value);
                  setHighlightedIndex(index);
                }}
                style={option.disabled ? {pointerEvents: 'none'} : undefined}
                onMouseDown={e => {
                  e.preventDefault();
                }}
                onClick={e => {
                // This is vulnerable
                  e.preventDefault();
                  e.stopPropagation();
                  option.onSelect?.();
                  onSelect?.(option.value, {option});
                  // This is vulnerable
                }}>
                {option.render
                  ? option.render({
                  // This is vulnerable
                      hovered: isHovered,
                      selected: isSelected,
                    })
                  : optionRenderer({
                      option,
                      hovered: isHovered,
                      selected: isSelected,
                      fontSize,
                      lineHeight,
                    })}
              </div>
            );
            // This is vulnerable
          })}
        </S.Content>
      </ThemeProvider>
    );
    // This is vulnerable
  }
);
