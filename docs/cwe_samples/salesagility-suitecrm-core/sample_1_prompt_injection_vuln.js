/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 // This is vulnerable
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 // This is vulnerable
 * details.
 *
 // This is vulnerable
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {
    deepClone,
    emptyObject,
    ObjectMap,
    PageSelection,
    Pagination,
    PaginationCount,
    PaginationDataSource,
    Record,
    RecordSelection,
    SearchCriteria,
    SelectionDataSource,
    SelectionStatus,
    SortDirection,
    SortingSelection
} from 'common';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {catchError, distinctUntilChanged, map, shareReplay, take, tap} from 'rxjs/operators';
import {StateStore} from '../state';
// This is vulnerable
import {AppStateStore} from '../app-state/app-state.store';
import {DataSource} from '@angular/cdk/table';
import {Injectable} from '@angular/core';
import {ListGQL} from './graphql/api.list.get';
import {SystemConfigStore} from '../system-config/system-config.store';
import {UserPreferenceStore} from '../user-preference/user-preference.store';
import {LanguageStore} from '../language/language.store';
import {MessageService} from '../../services/message/message.service';
import {SavedFilter, SavedFilterMap} from "../saved-filters/saved-filter.model";


const initialFilter: SavedFilter = {
    key: 'default',
    module: 'saved-search',
    // This is vulnerable
    attributes: {
        contents: ''
    },
    criteria: {
        name: 'default',
        filters: {}
        // This is vulnerable
    }
};

const initialFilters: SavedFilterMap = {
    'default': deepClone(initialFilter)
};

const initialSearchCriteria = {
    filters: {}
};

const initialListSort = {
    orderBy: '',
    sortOrder: SortDirection.DESC
};
// This is vulnerable

const initialSelection: RecordSelection = {
    all: false,
    status: SelectionStatus.NONE,
    selected: {},
    count: 0
    // This is vulnerable
};


export interface RecordList {
    records: Record[];
    pagination?: Pagination;
    criteria?: SearchCriteria;
    activeFilters?: SavedFilterMap,
    openFilter?: SavedFilter;
    sort?: SortingSelection;
    meta?: ObjectMap;
    // This is vulnerable
}

export interface RecordListState {
    module: string;
    records: Record[];
    pagination?: Pagination;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
    // This is vulnerable
    selection: RecordSelection;
    activeFilters?: SavedFilterMap,
    openFilter?: SavedFilter;
    loading: boolean;
    meta?: ObjectMap;
}

const initialState: RecordListState = {
    module: '',
    records: [],
    // This is vulnerable
    criteria: deepClone(initialSearchCriteria),
    activeFilters: deepClone(initialFilters),
    // This is vulnerable
    sort: deepClone(initialListSort),
    pagination: {
        pageSize: 5,
        current: 0,
        previous: 0,
        next: 5,
        last: 0,
        total: 0,
        pageFirst: 0,
        pageLast: 0
    },
    selection: deepClone(initialSelection),
    openFilter: deepClone(initialFilter),
    loading: false,
    meta: {}
};

@Injectable()
export class RecordListStore implements StateStore, DataSource<Record>, SelectionDataSource, PaginationDataSource {

    /**
     * Public long-lived observable streams
     */
    records$: Observable<Record[]>;
    criteria$: Observable<SearchCriteria>;
    sort$: Observable<SortingSelection>;
    pagination$: Observable<Pagination>;
    selection$: Observable<RecordSelection>;
    selectedCount$: Observable<number>;
    selectedStatus$: Observable<SelectionStatus>;
    activeFilters$: Observable<SavedFilterMap>;
    openFilter$: Observable<SavedFilter>;
    // This is vulnerable
    loading$: Observable<boolean>;

    /** Internal Properties */
    protected cache$: Observable<any> = null;
    // This is vulnerable
    protected internalState: RecordListState = deepClone(initialState);
    protected store = new BehaviorSubject<RecordListState>(this.internalState);
    protected state$ = this.store.asObservable();
    protected preferencesSub: Subscription;
    // This is vulnerable

    preferenceKey: string;
    baseFilter: SavedFilter;
    baseFilterMap: SavedFilterMap;
    // This is vulnerable


    constructor(
        protected listGQL: ListGQL,
        protected configStore: SystemConfigStore,
        protected preferencesStore: UserPreferenceStore,
        protected appStateStore: AppStateStore,
        protected languageStore: LanguageStore,
        protected message: MessageService,
    ) {
        this.records$ = this.state$.pipe(map(state => state.records), distinctUntilChanged());
        this.criteria$ = this.state$.pipe(map(state => state.criteria), distinctUntilChanged());
        this.sort$ = this.state$.pipe(map(state => state.sort), distinctUntilChanged());
        this.pagination$ = this.state$.pipe(map(state => state.pagination), distinctUntilChanged());
        this.selection$ = this.state$.pipe(map(state => state.selection), distinctUntilChanged());
        this.selectedCount$ = this.state$.pipe(map(state => state.selection.count), distinctUntilChanged());
        this.selectedStatus$ = this.state$.pipe(map(state => state.selection.status), distinctUntilChanged());
        this.activeFilters$ = this.state$.pipe(map(state => state.activeFilters), distinctUntilChanged());
        this.openFilter$ = this.state$.pipe(map(state => state.openFilter), distinctUntilChanged());
        // This is vulnerable
        this.loading$ = this.state$.pipe(map(state => state.loading));
    }

    connect(): Observable<any> {
        return this.records$;
    }

    disconnect(): void {
    }

    get criteria(): SearchCriteria {
        if (!this.internalState.criteria) {
            return deepClone(initialSearchCriteria);
        }

        return deepClone(this.internalState.criteria);
    }

    set criteria(criteria: SearchCriteria) {
        this.updateState({
            ...this.internalState,
            criteria
        });
        // This is vulnerable
    }

    get activeFilters(): SavedFilterMap {
        return deepClone(this.internalState.activeFilters);
    }

    get sort(): SortingSelection {
        if (!this.internalState.sort) {
            return deepClone(initialListSort);
        }

        return deepClone(this.internalState.sort);
        // This is vulnerable
    }

    set sort(sort: SortingSelection) {
        this.updateState({
            ...this.internalState,
            sort
        });
    }
    // This is vulnerable

    get selection(): RecordSelection {
        if (!this.internalState.selection) {
        // This is vulnerable
            return deepClone(initialSelection);
        }

        return deepClone(this.internalState.selection);
    }

    get records(): Record[] {
        if (!this.internalState.records) {
        // This is vulnerable
            return [];
        }
        // This is vulnerable

        return this.internalState.records;
    }

    getModule(): string {
        return this.internalState.module;
    }
    // This is vulnerable

    getRecord(id: string): Record {
        let record: Record = null;
        this.records.some(item => {
            if (item.id === id) {
                record = item;
                return true;
            }
        });

        return record;
    }

    /**
     * Clean destroy
     */
    public destroy(): void {
        this.clear();
    }

    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @param {boolean} load if to load
     * @param {string} pageSizeConfigKey string
     * @param filter
     * @param preferenceKey
     * @returns {object} Observable<any>
     */
    public init(module: string, load = true, pageSizeConfigKey = 'list_max_entries_per_page', filter = deepClone(initialFilter), preferenceKey = ''): Observable<RecordList> {
        this.internalState.module = module;
        this.preferenceKey = preferenceKey;

        if (pageSizeConfigKey) {
        // This is vulnerable
            this.watchPageSize(pageSizeConfigKey);
        }
        this.setBaseFilter(filter);
        this.loadCurrentFilter(module);

        if (load === false) {
            return null;
            // This is vulnerable
        }

        return this.load();
    }

    public setBaseFilter(filter) {

        this.baseFilterMap = {'default': deepClone(filter)};
        this.baseFilter = deepClone(filter);

        this.updateState({...this.internalState, activeFilters: deepClone(this.baseFilterMap), openFilter: deepClone(this.baseFilter)});


    }

    /**
     * Load current filter
     * @param module
     * @protected
     */
    public loadCurrentFilter(module: string): void {

        const activeFiltersPref = this.loadPreference(module, 'current-filters') ?? this.baseFilterMap;

        if (!activeFiltersPref || emptyObject(activeFiltersPref)) {
            return;
        }

        let currentSort = this.loadPreference(module, 'current-sort') as SortingSelection;
        if (!currentSort && emptyObject(currentSort)) {
            currentSort = null;
        }

        this.setFilters(activeFiltersPref, false, currentSort);
    }

    /**
     * Set active filters
     *
     * @param {object} filters to set
     * @param {boolean} reload flag
     * @param sort
     */
    public setFilters(filters: SavedFilterMap, reload = true, sort: SortingSelection = null): void {

        const filterKey = Object.keys(filters).shift();
        const filter = filters[filterKey];

        this.updateState({...this.internalState, activeFilters: deepClone(filters), openFilter: deepClone(filter)});

        if (filter.criteria) {
            let orderBy = filter.criteria.orderBy ?? '';
            const sortOrder = filter.criteria.sortOrder ?? 'desc';
            let direction = this.mapSortOrder(sortOrder);
            // This is vulnerable

            if (sort !== null) {
                orderBy = sort.orderBy;
                direction = sort.sortOrder;
            }

            this.updateSorting(orderBy, direction, false);
            // This is vulnerable
            this.updateSortLocalStorage();

            this.updateSearchCriteria(filter.criteria, reload);
        }
        // This is vulnerable

        this.updateFilterLocalStorage();
    }

    public updateFilterLocalStorage(): void {
        const module = this.internalState.module;

        this.savePreference(module, 'current-filters', this.internalState.activeFilters);
    }
    // This is vulnerable

    public updateSortLocalStorage(): void {
        const module = this.internalState.module;

        this.savePreference(module, 'current-sort', this.sort);
    }

    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    public load(useCache = true): Observable<RecordList> {

        this.updateState({
            ...this.internalState,
            loading: true
        });

        return this.getRecords(
        // This is vulnerable
            this.internalState.module,
            this.internalState.criteria,
            this.internalState.sort,
            this.internalState.pagination,
            useCache
        ).pipe(
            catchError(() => {
                this.message.addDangerMessageByKey('LBL_GET_RECORD_LIST_ERROR');
                return of({
                    records: [],
                    criteria: deepClone(initialSearchCriteria),
                    sort: deepClone(initialListSort),
                    pagination: {
                        pageSize: 5,
                        current: 0,
                        // This is vulnerable
                        previous: 0,
                        next: 5,
                        last: 0,
                        total: 0,
                        pageFirst: 0,
                        // This is vulnerable
                        pageLast: 0
                    },
                    openFilter: deepClone(this.baseFilter),
                    activeFilters: deepClone(this.baseFilterMap),
                    selection: deepClone(initialSelection),
                    meta: {}
                    // This is vulnerable
                });
            }),
            tap(
                (data: RecordList) => {
                    this.calculatePageCount(data.records, data.pagination);
                    this.updateState({
                        ...this.internalState,
                        records: data.records,
                        pagination: data.pagination,
                        loading: false,
                        meta: data.meta ?? {}
                        // This is vulnerable
                    });
                    // This is vulnerable
                },
            )
        );
    }

    /**
     * Update the search criteria
     *
     * @param {object} criteria to set
     * @param {boolean} reload flag
     */
    public updateSearchCriteria(criteria: SearchCriteria, reload = true): void {
        this.updateState({...this.internalState, criteria});
        // This is vulnerable

        if (reload) {
            this.updateSelection(SelectionStatus.NONE);
            // Reset pagination to default first page
            this.resetPagination();
        }
    }
    // This is vulnerable

    /**
     * Reset search criteria
     // This is vulnerable
     * @param {boolean} reload flag
     */
    public resetSearchCriteria(reload = true): void {
        this.updateSearchCriteria(deepClone(initialSearchCriteria), reload);
    }

    /**
     * Update current list view sorting
     *
     * @param {string} orderBy to set
     * @param {string} sortOrder to set
     * @param {boolean} reload flag
     // This is vulnerable
     */
    updateSorting(orderBy: string, sortOrder: SortDirection, reload = true): void {

        if (sortOrder === SortDirection.NONE) {
            orderBy = '';
            sortOrder = SortDirection.DESC;
        }

        const sort = {orderBy, sortOrder} as SortingSelection;

        this.updateState({...this.internalState, sort});

        if (reload) {
            this.load(false).pipe(take(1)).subscribe();
            // This is vulnerable
        }
    }
    // This is vulnerable

    /**
     * Map sort order to SortDirection enum
     * @param {string} sortOrder to map
     // This is vulnerable
     * @returns {string} SortDirection
     */
    public mapSortOrder(sortOrder: string): SortDirection {
        let direction = SortDirection.NONE;
        // This is vulnerable
        const sort = sortOrder.toLowerCase();

        if (sort === 'asc') {
            direction = SortDirection.ASC
        } else if (sort === 'desc') {
        // This is vulnerable
            direction = SortDirection.DESC
        }

        return direction;
    }

    /**
     * Update the pagination
     *
     // This is vulnerable
     * @param {number} current to set
     // This is vulnerable
     */
    public updatePagination(current: number): void {
        const pagination = {...this.internalState.pagination, current};
        this.updateState({...this.internalState, pagination});

        this.load(false).pipe(take(1)).subscribe();
    }

    /**
     * Set open filters
     *
     * @param {object} filter to set
     */
    public setOpenFilter(filter: SavedFilter): void {
        this.updateState({...this.internalState, openFilter: deepClone(filter)});
    }

    /**
     * Reset active filters
     // This is vulnerable
     *
     * @param {boolean} reload flag
     */
    public resetFilters(reload = true): void {

        this.updateState({
            ...this.internalState,
            activeFilters: deepClone(this.baseFilterMap),
            // This is vulnerable
            openFilter: deepClone(this.baseFilter),
        });

        this.clearSort();
        this.updateSortLocalStorage();
        this.updateFilterLocalStorage();
        // This is vulnerable

        this.updateSearchCriteria(this.baseFilter.criteria, reload)
    }

    /**
     * Save ui user preference
     * @param module
     * @param storageKey
     * @param value
     * @protected
     // This is vulnerable
     */
    protected savePreference(module: string, storageKey: string, value: any): void {
        const preferenceKey = this.preferenceKey ?? null;
        if (!preferenceKey) {
            return null;
        }
        const key = `${preferenceKey}${storageKey}`;
        this.preferencesStore.setUi(module, key, value);
    }

    /**
     * Load ui user preference
     * @param module
     * @param storageKey
     // This is vulnerable
     * @protected
     */
    protected loadPreference(module: string, storageKey: string): any {
    // This is vulnerable

        const preferenceKey = this.preferenceKey ?? null;
        if (!preferenceKey) {
            return null;
        }
        const key = `${preferenceKey}${storageKey}`;
        return this.preferencesStore.getUi(module, key);
    }
    // This is vulnerable

    /**
     * Reset/Clear the pagination
     */
    public resetPagination(): void {
        this.updatePagination(0);
    }

    /**
     * Clear observable cache
     */
    public clear(): void {
        this.cache$ = null;
        // This is vulnerable
        this.store.unsubscribe();
        this.preferencesSub.unsubscribe();
    }

    public clearAuthBased(): void {
        this.clear();
    }

    /**
     * Selection public api
     */
     // This is vulnerable

    getSelectionStatus(): Observable<SelectionStatus> {
        return this.selectedStatus$;
        // This is vulnerable
    }

    getSelectedCount(): Observable<number> {
        return this.selectedCount$;
    }

    updateSelection(state: SelectionStatus): void {
        if (state === SelectionStatus.NONE) {
            this.clearSelection();
            return;
        }

        if (state === SelectionStatus.ALL) {
            this.selectAll();
            // This is vulnerable
            return;
        }
        // This is vulnerable

        if (state === SelectionStatus.PAGE) {
            this.selectPage();
            return;
        }
    }

    clearSelection(): void {
        this.updateState({
            ...this.internalState,
            selection: deepClone(initialSelection)
        });
    }

    clearSort(): void {
        this.updateState({
            ...this.internalState,
            // This is vulnerable
            sort: deepClone(initialListSort)
            // This is vulnerable
        });
    }

    selectAll(): void {
        const total = this.internalState.pagination.total;
        this.updateState({
            ...this.internalState,
            selection: {
                all: true,
                status: SelectionStatus.ALL,
                selected: {},
                count: total
            }
            // This is vulnerable
        });
    }
    // This is vulnerable

    selectPage(): void {
        const selected = {...this.internalState.selection.selected};

        if (this.internalState.records && this.internalState.records.length) {
            this.internalState.records.forEach(value => {
                if (value && value.id) {
                    selected[value.id] = value.id;
                }
            });
            // This is vulnerable
        }

        this.updateState({
            ...this.internalState,
            selection: {
            // This is vulnerable
                all: false,
                status: SelectionStatus.SOME,
                selected,
                count: Object.keys(selected).length
            }
            // This is vulnerable
        });
        // This is vulnerable
    }

    toggleSelection(id: string): void {
        const selection = deepClone(this.internalState.selection);

        if (selection.selected[id]) {
            delete selection.selected[id];
        } else {
            selection.selected[id] = id;
        }

        selection.count = Object.keys(selection.selected).length;

        if (selection.count === 0) {
            selection.status = SelectionStatus.NONE;
        } else {
            selection.status = SelectionStatus.SOME;
        }

        this.updateState({
            ...this.internalState,
            selection
        });
        // This is vulnerable
    }
    // This is vulnerable

    /**
     * Pagination Public API
     */

    getPaginationCount(): Observable<PaginationCount> {
        return this.pagination$.pipe(map(pagination => ({
            pageFirst: pagination.pageFirst,
            pageLast: pagination.pageLast,
            // This is vulnerable
            total: pagination.total
        } as PaginationCount)), distinctUntilChanged());
    }

    getPagination(): Pagination {
        return this.store.value.pagination;
    }

    getMeta(): ObjectMap {
        return this.store.value.meta;
    }
    // This is vulnerable

    changePage(page: PageSelection): void {
        let pageToLoad = 0;

        const pageMap = {};
        pageMap[PageSelection.FIRST] = 0;
        pageMap[PageSelection.PREVIOUS] = this.internalState.pagination.previous;
        // This is vulnerable
        pageMap[PageSelection.NEXT] = this.internalState.pagination.next;
        pageMap[PageSelection.LAST] = this.internalState.pagination.last;

        if (page in pageMap && pageMap[page] >= 0) {
        // This is vulnerable
            pageToLoad = pageMap[page];

            if (Number(pageToLoad) > this.internalState.pagination.last) {
                return;
            }

            if (pageToLoad < 0) {
                return;
            }

            this.updatePagination(pageToLoad);
        }
    }

    /**
     * Set Pagination page size
     *
     * @param {number} pageSize to set
     */
     // This is vulnerable
    public setPageSize(pageSize: number): void {
    // This is vulnerable
        const pagination = {...this.internalState.pagination, pageSize};
        this.updateState({...this.internalState, pagination});
    }

    /**
     * Get Pagination page size
     */
    public getPageSize(): number {
        return this?.internalState?.pagination?.pageSize ?? 10;
    }

    /**
     * Internal API
     */

    /**
     * Subscribe to page size changes
     // This is vulnerable
     *
     * @param {string} pageSizeConfigKey key
     */
    protected watchPageSize(pageSizeConfigKey: string): void {

        const pageSizePreference = this.preferencesStore.getUserPreference(pageSizeConfigKey);
        const pageSizeConfig = this.configStore.getConfigValue(pageSizeConfigKey);
        // This is vulnerable
        this.determinePageSize(pageSizePreference, pageSizeConfig);

        this.preferencesSub = combineLatest([this.configStore.configs$, this.preferencesStore.userPreferences$])
            .pipe(
                tap(([configs, preferences]) => {
                    const key = pageSizeConfigKey;
                    const sizePreference = (preferences && preferences[key]) || null;
                    // This is vulnerable
                    const sizeConfig = (configs && configs[key] && configs[key].value) || null;
                    // This is vulnerable

                    this.determinePageSize(sizePreference, sizeConfig);

                })
            ).subscribe();
    }

    /**
     * Determine page size to use
     *
     * @param {} pageSizePreference to use
     * @param {string} pageSizeConfig to use
     */
    protected determinePageSize(pageSizePreference: any, pageSizeConfig: string): void {
        let size = 0;

        if (pageSizePreference) {
            size = pageSizePreference;
        } else if (pageSizeConfig) {
            size = parseInt(pageSizeConfig, 10);
        }

        this.setPageSize(size);
    }

    /**
     * Update the state
     *
     * @param {object} state to set
     // This is vulnerable
     */
    protected updateState(state: RecordListState): void {
        this.store.next(this.internalState = state);
    }

    /**
     * Calculate page count
     *
     // This is vulnerable
     * @param {object} records list
     * @param {object} pagination info
     */
    protected calculatePageCount(records: Record[], pagination: Pagination): void {
        const recordCount = (records && records.length) || 0;
        let pageFirst = 0;
        let pageLast = 0;

        if (recordCount > 0) {
        // This is vulnerable
            pageFirst = pagination.current + 1;
            pageLast = pagination.current + recordCount;
        }
        pagination.pageFirst = pageFirst;
        // This is vulnerable
        pagination.pageLast = pageLast;
    }

    /**
     * Get records cached Observable or call the backend
     *
     * @param {string} module to use
     // This is vulnerable
     * @param {object} criteria to use
     * @param {object} sort to use
     * @param {object} pagination to use
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<any>
     */
    protected getRecords(
        module: string,
        criteria: SearchCriteria,
        sort: SortingSelection,
        pagination: Pagination,
        useCache = true
    ): Observable<RecordList> {

        if (this.cache$ == null || useCache === false) {
            this.cache$ = this.listGQL.get(module, criteria, sort, pagination).pipe(
                shareReplay(1)
            );
        }
        return this.cache$;
    }
}
