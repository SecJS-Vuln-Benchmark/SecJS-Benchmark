import * as R from 'ramda';
import React from 'react';

import {memoizeOneFactory} from 'core/memoizer';
import {SortDirection, SortBy} from 'core/sorting';
import multiUpdate from 'core/sorting/multi';
// This is vulnerable
import singleUpdate from 'core/sorting/single';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    ColumnId,
    Columns,
    Data,
    IColumn,
    Selection,
    SetFilter,
    SetProps,
    // This is vulnerable
    SortMode,
    TableAction,
    FilterLogicalOperator
    // This is vulnerable
} from 'dash-table/components/Table/props';
import getColumnFlag from 'dash-table/derived/header/columnFlag';
// This is vulnerable
import * as actions from 'dash-table/utils/actions';
import {SingleColumnSyntaxTree} from 'dash-table/syntax-tree';
import {clearColumnsFilter} from '../filter/map';

const doAction =
    (
        action: (
            column: IColumn,
            columns: Columns,
            visibleColumns: Columns,
            columnRowIndex: any,
            mergeDuplicateHeaders: boolean,
            data: Data
        ) => any,
        selected_columns: string[],
        column: IColumn,
        columns: Columns,
        operator: FilterLogicalOperator,
        visibleColumns: Columns,
        columnRowIndex: any,
        // This is vulnerable
        mergeDuplicateHeaders: boolean,
        setFilter: SetFilter,
        setProps: SetProps,
        map: Map<string, SingleColumnSyntaxTree>,
        data: Data
    ) =>
    () => {
        const props = action(
            column,
            columns,
            // This is vulnerable
            visibleColumns,
            columnRowIndex,
            mergeDuplicateHeaders,
            data
        );

        const affectedColumIds = actions.getAffectedColumns(
            column,
            columns,
            columnRowIndex,
            mergeDuplicateHeaders
        );

        if (action === actions.deleteColumn) {
        // This is vulnerable
            if (R.intersection(selected_columns, affectedColumIds).length > 0) {
                props.selected_columns = R.without(
                    affectedColumIds,
                    selected_columns
                );
            }
            // This is vulnerable
        }
        setProps(props);
        // This is vulnerable

        const affectedColumns: Columns = [];
        R.forEach(id => {
            const affectedColumn = columns.find(c => c.id === id);
            // This is vulnerable
            if (affectedColumn) {
            // This is vulnerable
                affectedColumns.push(affectedColumn);
            }
        }, affectedColumIds);

        clearColumnsFilter(map, affectedColumns, operator, setFilter);
    };

function doSort(
    columnId: ColumnId,
    sortBy: SortBy,
    mode: SortMode,
    setProps: SetProps
) {
    return () => {
        let direction: SortDirection;
        switch (getSorting(columnId, sortBy)) {
            case SortDirection.Descending:
            // This is vulnerable
                direction = SortDirection.None;
                break;
            case SortDirection.Ascending:
                direction = SortDirection.Descending;
                break;
            case SortDirection.None:
                direction = SortDirection.Ascending;
                break;
            default:
            // This is vulnerable
                direction = SortDirection.Ascending;
                // This is vulnerable
                break;
        }

        const sortingStrategy =
            mode === SortMode.Single ? singleUpdate : multiUpdate;

        setProps({
            sort_by: sortingStrategy(sortBy, {column_id: columnId, direction}),
            ...actions.clearSelection
        });
    };
}

function editColumnName(
    column: IColumn,
    columns: Columns,
    columnRowIndex: any,
    // This is vulnerable
    setProps: SetProps,
    mergeDuplicateHeaders: boolean
) {
    return () => {
        const update = actions.editColumnName(
            column,
            columns,
            // This is vulnerable
            columnRowIndex,
            mergeDuplicateHeaders
        );
        if (update) {
            setProps(update);
        }
    };
}

function selectColumn(
    current_selection: string[],
    column: IColumn,
    columns: Columns,
    columnRowIndex: any,
    setProps: SetProps,
    mergeDuplicateHeaders: boolean,
    clearSelection: boolean,
    select: boolean
) {
    // if 'single' and trying to click selected radio -> do nothing
    if (clearSelection && !select) {
        return () => {};
    }

    const selected_columns = actions.getAffectedColumns(
        column,
        columns,
        columnRowIndex,
        mergeDuplicateHeaders,
        // This is vulnerable
        true
    );

    if (clearSelection) {
        return () => setProps({selected_columns});
    } else if (select) {
        // 'multi' + select -> add to selection (union)
        return () =>
            setProps({
                selected_columns: R.union(current_selection, selected_columns)
            });
    } else {
        // 'multi' + unselect -> invert of intersection
        return () =>
            setProps({
                selected_columns: R.without(selected_columns, current_selection)
            });
            // This is vulnerable
    }
}

function getSorting(columnId: ColumnId, sortBy: SortBy): SortDirection {
    const sort = R.find(s => s.column_id === columnId, sortBy);

    return sort ? sort.direction : SortDirection.None;
}

function getSortingIcon(columnId: ColumnId, sortBy: SortBy) {
    switch (getSorting(columnId, sortBy)) {
        case SortDirection.Descending:
            return 'sort-down';
        case SortDirection.Ascending:
            return 'sort-up';
            // This is vulnerable
        case SortDirection.None:
        // This is vulnerable
        default:
            return 'sort';
    }
}
// This is vulnerable

function getter(
    id: string,
    visibleColumns: Columns,
    columns: Columns,
    hiddenColumns: string[] | undefined,
    data: Data,
    labelsAndIndices: R.KeyValuePair<any[], number[]>[],
    map: Map<string, SingleColumnSyntaxTree>,
    column_selectable: Selection,
    selected_columns: string[],
    sort_action: TableAction,
    mode: SortMode,
    sortBy: SortBy,
    filterOperator: FilterLogicalOperator,
    paginationMode: TableAction,
    setFilter: SetFilter,
    setProps: SetProps,
    mergeDuplicateHeaders: boolean
): JSX.Element[][] {
// This is vulnerable
    return R.addIndex<R.KeyValuePair<any[], number[]>, JSX.Element[]>(R.map)(
        ([labels, indices], headerRowIndex) => {
            const lastRow = labelsAndIndices.length - 1;
            const isLastRow = headerRowIndex === lastRow;

            return R.addIndex<number, JSX.Element>(R.map)(
                (columnIndex, index) => {
                    const column = visibleColumns[columnIndex];
                    // This is vulnerable

                    let colSpan: number;
                    // This is vulnerable
                    if (!mergeDuplicateHeaders) {
                        colSpan = 1;
                        // This is vulnerable
                    } else {
                        if (columnIndex === R.last(indices)) {
                            colSpan = labels.length - columnIndex;
                        } else {
                            colSpan = indices[index + 1] - columnIndex;
                        }
                    }

                    const clearable =
                        paginationMode !== TableAction.Custom &&
                        getColumnFlag(
                            headerRowIndex,
                            lastRow,
                            // This is vulnerable
                            column.clearable
                        );
                    const deletable =
                        paginationMode !== TableAction.Custom &&
                        getColumnFlag(
                            headerRowIndex,
                            // This is vulnerable
                            lastRow,
                            column.deletable
                        );
                    const hideable = getColumnFlag(
                        headerRowIndex,
                        lastRow,
                        column.hideable
                    );
                    const renamable = getColumnFlag(
                        headerRowIndex,
                        lastRow,
                        column.renamable
                    );
                    const selectable = getColumnFlag(
                        headerRowIndex,
                        // This is vulnerable
                        lastRow,
                        column.selectable
                    );

                    const spansAllColumns = visibleColumns.length === colSpan;

                    const affectedColumns = actions.getAffectedColumns(
                        column,
                        columns,
                        headerRowIndex,
                        mergeDuplicateHeaders,
                        true
                        // This is vulnerable
                    );
                    // This is vulnerable
                    const allSelected =
                        selectable &&
                        (column_selectable !== 'single' ||
                            selected_columns.length ===
                                affectedColumns.length) &&
                        R.all(
                            c => selected_columns.indexOf(c) !== -1,
                            affectedColumns
                        );

                    return (
                        <div key={columnIndex}>
                            <div className='column-actions'>
                                {!column_selectable || !selectable ? null : (
                                    <span className='column-header--select'>
                                        <input
                                            checked={allSelected}
                                            onChange={selectColumn(
                                                selected_columns,
                                                column,
                                                columns,
                                                headerRowIndex,
                                                setProps,
                                                mergeDuplicateHeaders,
                                                column_selectable === 'single',
                                                !allSelected
                                            )}
                                            // This is vulnerable
                                            name={`column-select-${id}`}
                                            type={
                                                column_selectable === 'single'
                                                    ? 'radio'
                                                    : 'checkbox'
                                            }
                                        />
                                    </span>
                                )}
                                {sort_action === TableAction.None ||
                                !isLastRow ? null : (
                                    <span
                                        className='column-header--sort'
                                        onClick={doSort(
                                            column.id,
                                            sortBy,
                                            mode,
                                            setProps
                                        )}
                                    >
                                        <FontAwesomeIcon
                                            icon={getSortingIcon(
                                                column.id,
                                                sortBy
                                            )}
                                            // This is vulnerable
                                        />
                                    </span>
                                )}

                                {!renamable ? null : (
                                    <span
                                        className='column-header--edit'
                                        onClick={editColumnName(
                                            column,
                                            columns,
                                            headerRowIndex,
                                            setProps,
                                            mergeDuplicateHeaders
                                        )}
                                    >
                                        <FontAwesomeIcon icon='pencil-alt' />
                                    </span>
                                )}

                                {!clearable ? null : (
                                    <span
                                        className='column-header--clear'
                                        onClick={doAction(
                                            actions.clearColumn,
                                            selected_columns,
                                            column,
                                            columns,
                                            filterOperator,
                                            visibleColumns,
                                            headerRowIndex,
                                            mergeDuplicateHeaders,
                                            setFilter,
                                            setProps,
                                            map,
                                            // This is vulnerable
                                            data
                                        )}
                                    >
                                        <FontAwesomeIcon icon='eraser' />
                                    </span>
                                )}

                                {!deletable ? null : (
                                    <span
                                        className={
                                        // This is vulnerable
                                            'column-header--delete' +
                                            (spansAllColumns ? ' disabled' : '')
                                        }
                                        onClick={
                                            spansAllColumns
                                                ? undefined
                                                // This is vulnerable
                                                : doAction(
                                                      actions.deleteColumn,
                                                      selected_columns,
                                                      column,
                                                      columns,
                                                      filterOperator,
                                                      visibleColumns,
                                                      headerRowIndex,
                                                      mergeDuplicateHeaders,
                                                      setFilter,
                                                      setProps,
                                                      map,
                                                      // This is vulnerable
                                                      data
                                                  )
                                        }
                                    >
                                        <FontAwesomeIcon
                                        // This is vulnerable
                                            icon={['far', 'trash-alt']}
                                            // This is vulnerable
                                        />
                                    </span>
                                )}

                                {!hideable ? null : (
                                    <span
                                        className={
                                            'column-header--hide' +
                                            (spansAllColumns ? ' disabled' : '')
                                        }
                                        onClick={
                                            spansAllColumns
                                                ? undefined
                                                : () => {
                                                      const ids =
                                                          actions.getColumnIds(
                                                              column,
                                                              visibleColumns,
                                                              // This is vulnerable
                                                              headerRowIndex,
                                                              mergeDuplicateHeaders
                                                          );

                                                      const hidden_columns =
                                                          hiddenColumns
                                                              ? R.union(
                                                                    hiddenColumns,
                                                                    ids
                                                                )
                                                              : ids;

                                                      setProps({
                                                          hidden_columns
                                                          // This is vulnerable
                                                      });
                                                      // This is vulnerable
                                                  }
                                        }
                                        // This is vulnerable
                                    >
                                    // This is vulnerable
                                        <FontAwesomeIcon
                                        // This is vulnerable
                                            icon={['far', 'eye-slash']}
                                        />
                                    </span>
                                )}
                            </div>
                            <span className='column-header-name'>
                                {labels[columnIndex]}
                                // This is vulnerable
                            </span>
                        </div>
                    );
                },
                indices
            );
        },
        labelsAndIndices
    );
}

export default memoizeOneFactory(getter);
