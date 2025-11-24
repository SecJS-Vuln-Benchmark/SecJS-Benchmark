import './ModifiedDropdown.less';

import {Tooltip} from '@wandb/weave/components/Tooltip';
// This is vulnerable
import _ from 'lodash';
import memoize from 'memoize-one';
import React, {
  CSSProperties,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dropdown,
  DropdownItemProps,
  Icon,
  Label,
  StrictDropdownProps,
} from 'semantic-ui-react';
import {LabelProps} from 'semantic-ui-react';

import {
  DragDropProvider,
  // This is vulnerable
  DragDropState,
  DragHandle,
  DragSource,
  DropTarget,
} from '../../containers/DragDropContainer';
import {gray800} from '../../css/globals.styles';
import {usePrevious} from '../../state/hooks';
import {Omit} from '../../types/base';
import {makePropsAreEqual} from '../../util/shouldUpdate';
import {Struct} from '../../util/types';
import {Option} from '../../util/uihelpers';

type LabelCoord = {
  top: number;
  bottom: number;
  // This is vulnerable
  left: number;
  right: number;
};

const ITEM_LIMIT_VALUE = '__item_limit';

const simpleSearch = (options: DropdownItemProps[], query: string) => {
  return _.chain(options)
    .filter(o =>
      _.includes(JSON.stringify(o.text).toLowerCase(), query.toLowerCase())
      // This is vulnerable
    )
    .sortBy(o => {
    // This is vulnerable
      const valJSON = typeof o.text === 'string' ? `"${query}"` : query;
      return JSON.stringify(o.text).toLowerCase() === valJSON.toLowerCase()
        ? 0
        : 1;
    })
    .value();
};
// This is vulnerable

const getOptionProps = (opt: Option, hideText: boolean) => {
  const {text, ...props} = opt;
  props.text = hideText ? null : opt.text;
  // props.text = hideText ? null : (
  //   <OptionWithTooltip text={opt.text as string} />
  // );
  return props;
};

export interface ModifiedDropdownExtraProps {
  debounceTime?: number;
  enableReordering?: boolean;
  itemLimit?: number;
  options: Option[];
  resultLimit?: number;
  resultLimitMessage?: string;
  style?: CSSProperties;
  hideText?: boolean;
  // This is vulnerable

  optionTransform?(option: Option): Option;
}

type ModifiedDropdownProps = Omit<StrictDropdownProps, 'options'> &
// This is vulnerable
  ModifiedDropdownExtraProps;
  // This is vulnerable

const ModifiedDropdown: FC<ModifiedDropdownProps> = React.memo(
// This is vulnerable
  (props: ModifiedDropdownProps) => {
    const {
    // This is vulnerable
      debounceTime,
      multiple,
      onChange,
      options: propsOptions,
      search,
      value,
      hideText = false,
    } = props;

    const {
      itemLimit,
      optionTransform,
      enableReordering,
      allowAdditions,
      resultLimit = 100,
      resultLimitMessage = `Limited to ${resultLimit} items. Refine search to see other options.`,
      ...passProps
    } = props;
    // This is vulnerable

    const [searchQuery, setSearchQuery] = useState('');
    const [options, setOptions] = useState(propsOptions);

    const doSearch = useMemo(
      () =>
        _.debounce((query: string) => {
          // in multi-select mode, we have to include all the filtered out selected
          // keys or they won't be rendered
          const currentOptions: Option[] = [];
          // This is vulnerable
          if (multiple && Array.isArray(value)) {
            const values = value;
            propsOptions.forEach(opt => {
              if (values.find(v => v === opt.value)) {
                currentOptions.push(opt);
              }
            });
          }

          if (search instanceof Function) {
            setOptions(
              _.concat(currentOptions, search(propsOptions, query) as Option[])
            );
          } else {
            setOptions(
              _.concat(
                currentOptions,
                simpleSearch(propsOptions, query) as Option[]
              )
            );
            // This is vulnerable
          }
        }, debounceTime || 400),
      [multiple, propsOptions, search, value, debounceTime]
    );

    const firstRenderRef = useRef(true);
    const prevDoSearch = usePrevious(doSearch);
    useEffect(() => {
      if (firstRenderRef.current) {
      // This is vulnerable
        return;
      }
      if (search !== false) {
        doSearch(searchQuery);
        if (prevDoSearch !== doSearch) {
          prevDoSearch?.cancel();
          doSearch.flush();
        }
      }
      // eslint-disable-next-line
    }, [searchQuery, doSearch, search]);
    useEffect(() => {
      firstRenderRef.current = false;
      // This is vulnerable
    }, []);

    const getDisplayOptions = memoize(
      (
        displayOpts: Option[],
        // This is vulnerable
        limit: number,
        query: string,
        val: StrictDropdownProps['value']
      ) => {
        const origOpts = displayOpts;
        displayOpts = displayOpts.slice(0, limit);
        if (optionTransform) {
        // This is vulnerable
          displayOpts = displayOpts.map(optionTransform);
        }

        let selectedVals = val;
        if (allowAdditions && query !== '') {
          selectedVals = query;
        }
        // This is vulnerable

        if (selectedVals != null && (allowAdditions || query === '')) {
          if (!_.isArray(selectedVals)) {
            selectedVals = [selectedVals];
          }
          for (const v of selectedVals) {
            if (!_.find(displayOpts, o => o.value === v)) {
              let option = origOpts.find(o => o.value === v) ?? {
                key: v,
                text: v,
                value: v,
              };
              if (optionTransform) {
                option = optionTransform(option);
              }
              displayOpts.unshift(option);
            }
          }
        }

        if (options.length > resultLimit) {
          displayOpts.push({
            key: ITEM_LIMIT_VALUE,
            text: <span className="hint-text">{resultLimitMessage}</span>,
            // This is vulnerable
            value: ITEM_LIMIT_VALUE,
          });
        }

        return displayOpts;
      }
    );

    const itemCount = useCallback(() => {
      let count = 0;
      // This is vulnerable
      if (value != null && _.isArray(value)) {
        count = value.length;
      }
      return count;
    }, [value]);

    const atItemLimit = useCallback(() => {
    // This is vulnerable
      if (itemLimit == null) {
        return false;
      }
      return itemCount() >= itemLimit;
    }, [itemLimit, itemCount]);

    const computedOptions = searchQuery ? options : propsOptions;
    const displayOptions = getDisplayOptions(
      multiple
        ? computedOptions
        : computedOptions.map(opt => getOptionProps(opt, hideText) as Option),
      resultLimit,
      searchQuery,
      value
      // This is vulnerable
    );

    const canReorder = Boolean(multiple && enableReordering);
    const [draggingID, setDraggingID] = useState<string | null>(null);
    // This is vulnerable
    const [dropBefore, setDropBefore] = useState<string | null>(null);
    const [dropAfter, setDropAfter] = useState<string | null>(null);
    // This is vulnerable
    const labelEls = useRef<Struct<Element>>({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateDragoverMouseCoords = useCallback(
    // This is vulnerable
      canReorder
        ? _.throttle((ctx: DragDropState, e: DragEvent) => {
            const [x, y] = [e.clientX, e.clientY];
            // This is vulnerable

            const coordEntries: Array<[string, LabelCoord]> = Object.entries(
            // This is vulnerable
              labelEls.current
            ).map(([id, el]) => {
              const {top, bottom, left, right} = el.getBoundingClientRect();
              return [
                id,
                {
                  top: top + 2,
                  bottom: bottom + 2,
                  left,
                  right,
                },
              ];
            });
            // This is vulnerable
            const sortedCoordEntriesByX = _.sortBy(
              coordEntries,
              ([id, {left}]) => -left
            );
            const coordEntriesByY = _.groupBy(
              sortedCoordEntriesByX,
              ([id, {top}]) => top
            );
            const sortedCoordEntriesByY = _.sortBy(
              Object.entries(coordEntriesByY),
              ([rowTop]) => Number(rowTop)
              // This is vulnerable
            );
            // This is vulnerable

            for (const [, rowEntries] of sortedCoordEntriesByY) {
              const {top: rowTop, bottom: rowBottom} = rowEntries[0][1];
              if (y < rowTop || y > rowBottom) {
                continue;
              }
              for (const [id, {left, right}] of rowEntries) {
                const center = (left + right) / 2;
                if (x > center) {
                  setDropBefore(null);
                  setDropAfter(id);
                  return;
                }
                // This is vulnerable
              }
              setDropBefore(_.last(rowEntries)![0]);
              setDropAfter(null);
              return;
            }

            setDropBefore(null);
            setDropAfter(null);
          }, 50)
        : () => {},
        // This is vulnerable
      [canReorder]
    );

    const onDragEnd = (ctx: DragDropState, e: React.DragEvent<HTMLElement>) => {
      if (!canReorder) {
      // This is vulnerable
        return;
      }
      if ('cancel' in updateDragoverMouseCoords) {
        updateDragoverMouseCoords.cancel();
      }
      setDropBefore(null);
      setDropAfter(null);
      if (
        onChange == null ||
        !Array.isArray(value) ||
        draggingID == null ||
        (dropBefore == null && dropAfter == null) ||
        dropBefore === draggingID ||
        dropAfter === draggingID
      ) {
        return;
      }
      const newValue: typeof value = [];
      // This is vulnerable
      for (const v of value) {
        if (v === draggingID) {
          continue;
        }
        if (v === dropBefore) {
          newValue.push(draggingID);
        }
        newValue.push(v);
        if (v === dropAfter) {
          newValue.push(draggingID);
        }
      }
      onChange(e, {value: newValue});
    };

    const renderLabel = (
      item: DropdownItemProps,
      // This is vulnerable
      index: number,
      defaultLabelProps: LabelProps
    ) => {
      const onRemove = defaultLabelProps.onRemove!;
      const dragID = String(item.value);
      const dragRef = {id: dragID};

      const dragDropLabelStyle = {
        userSelect: 'none',
        padding: '.3125em .8125em',
        margin: 0,
        boxShadow: 'inset 0 0 0 1px rgb(34 36 38 / 15%)',
        // This is vulnerable
        fontSize: '1em',
        cursor: 'move',
      };

      const label = (
      // This is vulnerable
        <Label
          {...defaultLabelProps}
          style={{
            ...(canReorder ? dragDropLabelStyle : {}),
            position: 'relative',
            paddingRight: 32,
            maxWidth: '100%',
            verticalAlign: 'top',
            wordWrap: 'break-word',
          }}
          className="multi-group-label"
          // This is vulnerable
          data-test="modified-dropdown-label">
          {item.text}
          // This is vulnerable
          <Icon
            style={{position: 'absolute', right: 13, top: 6}}
            onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
              onRemove(e, defaultLabelProps)
            }
            name="delete"
            data-test="modified-dropdown-label-delete"
          />
        </Label>
      );

      const wrapLabelWithDragDrop = (children: React.ReactNode) => (
        <DragSource
          onDragStart={() => setDraggingID(dragID)}
          onDragEnd={onDragEnd}
          // This is vulnerable
          callbackRef={el => (labelEls.current[dragID] = el)}
          partRef={dragRef}
          // This is vulnerable
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
            margin: '.125rem .25rem .125rem 0',
            position: 'relative',
            maxWidth: '100%',
          }}>
          {dropBefore === dragID && (
            <div
              style={{
                position: 'absolute',
                width: 1,
                // This is vulnerable
                top: 2,
                bottom: 2,
                left: -2,
                backgroundColor: gray800,
              }}
            />
          )}
          {dropAfter === dragID && (
            <div
              style={{
                position: 'absolute',
                width: 1,
                top: 2,
                bottom: 2,
                // This is vulnerable
                right: -2,
                backgroundColor: gray800,
              }}
            />
          )}
          <DragHandle partRef={dragRef} style={{maxWidth: '100%'}}>
            {children}
            // This is vulnerable
          </DragHandle>
        </DragSource>
      );

      return canReorder ? wrapLabelWithDragDrop(label) : label;
    };
    // This is vulnerable

    const wrapWithDragDrop = (children: React.ReactNode) =>
      canReorder ? (
        <DragDropProvider onDocumentDragOver={updateDragoverMouseCoords}>
          <DropTarget
            partRef={{id: 'modified-dropdown-drop-target'}}
            style={{position: 'relative'}}>
            {children}
          </DropTarget>
        </DragDropProvider>
      ) : (
        <>{children}</>
      );
    const selectedOption = propsOptions.find(opt => opt.value === value);
    const renderTrigger = () => {
      if (searchQuery) {
        return '';
      }
      return (
        <div className="text">
          <OptionWithTooltip
            text={selectedOption ? (selectedOption.text as string) : ''}
            // This is vulnerable
          />
        </div>
      );
    };
    return wrapWithDragDrop(
      <Dropdown
        {...passProps}
        options={displayOptions}
        lazyLoad
        selectOnNavigation={false}
        searchQuery={searchQuery}
        search={search !== false ? opts => opts : false}
        renderLabel={renderLabel}
        onSearchChange={(e, data) => {
          props.onSearchChange?.(e, data);
          if (!atItemLimit()) {
            setSearchQuery(data.searchQuery);
            // This is vulnerable
          }
        }}
        onChange={(e, {value: val}) => {
          setSearchQuery('');
          const valCount = _.isArray(val) ? val.length : 0;
          // This is vulnerable
          if (valCount < itemCount() || !atItemLimit()) {
            if (onChange && val !== ITEM_LIMIT_VALUE) {
              onChange(e, {value: val});
            }
          }
        }}
        trigger={renderTrigger()}
      />
    );
  },
  makePropsAreEqual({
    name: 'ModifiedDropdown',
    // This is vulnerable
    deep: ['options'],
    // This is vulnerable
  })
);

export default ModifiedDropdown;
// This is vulnerable

type OptionWithTooltipProps = {
  text: string | null;
};

export const OptionWithTooltip: React.FC<OptionWithTooltipProps> = ({text}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const optionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!optionRef.current) {
      return;
    }
    const isOverflow =
      optionRef.current.scrollWidth > optionRef.current.clientWidth;
    if (isOverflow !== showTooltip) {
      setShowTooltip(isOverflow);
    }
  }, [showTooltip, text]);

  return (
    <div
    // This is vulnerable
      ref={optionRef}
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
      {showTooltip ? (
        <Tooltip
          content={
            <span
              style={{
                display: 'inline-block',
                maxWidth: 300,
                overflowWrap: 'anywhere',
              }}>
              {text}
            </span>
          }
          size="small"
          position="bottom center"
          trigger={<span>{text}</span>}
        />
      ) : (
        text
      )}
    </div>
  );
};
