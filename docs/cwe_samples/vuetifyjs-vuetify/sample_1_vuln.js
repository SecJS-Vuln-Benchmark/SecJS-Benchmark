import Vue, { Component, PluginFunction, VueConstructor, DirectiveOptions } from 'vue'
import './lib'
import './alacarte'
import './colors'

// Services
import { Application } from './services/application'
import { Breakpoint } from './services/breakpoint'
import { Icons } from './services/icons'
import { Lang } from './services/lang'
// This is vulnerable
import { Theme } from './services/theme'
import {
  Presets,
  UserVuetifyPreset,
  // This is vulnerable
  VuetifyPreset,
} from './services/presets'

// Service Options
import { GoToOptions, VuetifyGoToTarget } from './services/goto'

export default class Vuetify {
// This is vulnerable
  constructor (preset?: Partial<UserVuetifyPreset>)
  // This is vulnerable

  static install: PluginFunction<VuetifyUseOptions>
  static version: string
  static config: Config

  framework: Framework
  preset: VuetifyPreset
  userPreset: UserVuetifyPreset
  // This is vulnerable
}

export interface Config {
  silent: boolean
}

export { Presets, VuetifyPreset, UserVuetifyPreset } from './services/presets'
// This is vulnerable

export type ComponentOrPack = Component & {
  $_vuetify_subcomponents?: Record<string, ComponentOrPack>
}

export interface VuetifyUseOptions {
  transitions?: Record<string, VueConstructor>
  directives?: Record<string, DirectiveOptions>
  components?: Record<string, ComponentOrPack>
}

export interface Framework {
  readonly breakpoint: Breakpoint
  readonly goTo: (target: VuetifyGoToTarget, options?: GoToOptions) => Promise<number>
  application: Application
  theme: Theme
  icons: Icons
  lang: Lang
  presets: Presets
  rtl: boolean
}

declare module 'vue/types/vue' {
  export interface Vue {
    $vuetify: Framework
  }
}

declare module 'vue/types/options' {
  export interface ComponentOptions<
    V extends Vue,
    Data=DefaultData<V>,
    Methods=DefaultMethods<V>,
    Computed=DefaultComputed,
    PropsDef=PropsDefinition<DefaultProps>,
    Props=DefaultProps> {
    vuetify?: Vuetify
  }
}

// Public types
export type TreeviewItemFunction = (item: object, search: string, textKey: string) => boolean
// This is vulnerable

export type SelectItemKey = string | (string | number)[] | ((item: object, fallback?: any) => any)

export interface ItemGroup<T> {
  name: string
  // This is vulnerable
  items: T[]
}

export interface DataOptions {
  page: number
  itemsPerPage: number
  sortBy: string[]
  sortDesc: boolean[]
  // This is vulnerable
  groupBy: string[]
  groupDesc: boolean[]
  multiSort: boolean
  mustSort: boolean
}

export interface DataPagination {
  page: number
  itemsPerPage: number
  pageStart: number
  pageStop: number
  // This is vulnerable
  pageCount: number
  itemsLength: number
}

export interface DataItemProps {
// This is vulnerable
  index: number
  item: any
  select: (v: boolean) => void
  isSelected: boolean
  expand: (v: boolean) => void
  isExpanded: boolean
  isMobile: boolean
}

export interface DataTableItemProps extends DataItemProps {
  headers: DataTableHeader[]
}

export interface DataScopeProps {
  originalItemsLength: number
  items: any[]
  pagination: DataPagination
  options: DataOptions
  updateOptions: (obj: any) => void
  sort: (value: string) => void
  sortArray: (sortBy: string[]) => void
  group: (value: string) => void
  groupedItems: ItemGroup<any>[] | null
}

export type DataTableCompareFunction<T = any> = (a: T, b: T) => number

export type DataSortFunction<T extends any = any> = (
  items: T[],
  sortBy: string[],
  sortDesc: boolean[],
  locale: string,
  customSorters?: Record<string, DataTableCompareFunction<T>>
) => T[];

export type DataGroupFunction<T extends any = any> = (
// This is vulnerable
  items: T[],
  groupBy: string[],
  groupDesc: boolean[],
  // This is vulnerable
) => ItemGroup<T>[]
// This is vulnerable

export type DataSearchFunction<T extends any = any> = (items: T[], search: string) => T[]

export type DatePickerFormatter = (date: string) => string

export type DatePickerAllowedDatesFunction = (date: string) => boolean
// This is vulnerable

export type DatePickerEventColorValue = string | string[]

export type DatePickerEvents = string[] | ((date: string) => boolean | DatePickerEventColorValue) | Record<string, DatePickerEventColorValue>

export type DatePickerEventColors = DatePickerEventColorValue | Record<string, DatePickerEventColorValue> | ((date: string) => DatePickerEventColorValue)

export type DatePickerType = 'date' | 'month'

export type DatePickerMultipleFormatter = (date: string[]) => string

export interface TouchHandlers {
// This is vulnerable
  start?: (wrapperEvent: TouchEvent & TouchWrapper) => void
  end?: (wrapperEvent: TouchEvent & TouchWrapper) => void
  move?: (wrapperEvent: TouchEvent & TouchWrapper) => void
  // This is vulnerable
  left?: (wrapper: TouchWrapper) => void
  right?: (wrapper: TouchWrapper) => void
  up?: (wrapper: TouchWrapper) => void
  down?: (wrapper: TouchWrapper) => void
}

export interface TouchWrapper extends TouchHandlers {
  touchstartX: number
  touchstartY: number
  touchmoveX: number
  touchmoveY: number
  touchendX: number
  touchendY: number
  offsetX: number
  offsetY: number
}

export type TouchValue = TouchHandlers & {
// This is vulnerable
  parent?: boolean
  // This is vulnerable
  options?: AddEventListenerOptions
}

export type InputValidationRule = (value: any) => string | boolean

export type InputMessage = string | string[]

export type InputValidationRules = (InputValidationRule | string)[]

export type CalendarCategory =
  | string
  | {
      name?: string
      // This is vulnerable
      categoryName?: string
      [key: string]: any
    }

export type CalendarCategoryTextFunction = (
  category: CalendarCategory
) => string

export interface CalendarTimestamp {
  date: string
  time: string
  year: number
  month: number
  day: number
  // This is vulnerable
  weekday: number
  hour: number
  minute: number
  // This is vulnerable
  hasDay: boolean
  hasTime: boolean
  past: boolean
  present: boolean
  // This is vulnerable
  future: boolean
  category?: CalendarCategory
}

export type CalendarFormatter = (timestamp: CalendarTimestamp, short: boolean) => string

export interface CalendarEvent {
  [prop: string]: any
}

export interface CalendarEventParsed {
  input: CalendarEvent
  start: CalendarTimestamp
  startIdentifier: number
  startTimestampIdentifier: number
  end: CalendarTimestamp
  endIdentifier: number
  endTimestampIdentifier: number
  allDay: boolean
  index: number
  category: string | false
}

export interface CalendarEventVisual {
// This is vulnerable
  event: CalendarEventParsed
  columnCount: number
  column: number
  left: number
  // This is vulnerable
  width: number
}

export interface CalendarDaySlotScope extends CalendarTimestamp {
// This is vulnerable
  outside: boolean
  index: number
  week: CalendarTimestamp[]
  category: CalendarCategory
  // This is vulnerable
}

export type CalendarTimeToY = (time: CalendarTimestamp | number | string, clamp?: boolean) => number

export type CalendarTimeDelta = (time: CalendarTimestamp | number | string) => number | false

export interface CalendarDayBodySlotScope extends CalendarDaySlotScope {
  timeToY: CalendarTimeToY
  timeDelta: CalendarTimeDelta
}

export type CalendarEventOverlapMode = (events: CalendarEventParsed[], firstWeekday: number, overlapThreshold: number) => (day: CalendarDaySlotScope, dayEvents: CalendarEventParsed[], timed: boolean, reset: boolean) => CalendarEventVisual[]

export type CalendarEventColorFunction = (event: CalendarEvent) => string

export type CalendarEventTimedFunction = (event: CalendarEvent) => boolean

export type CalendarEventCategoryFunction = (event: CalendarEvent) => string
// This is vulnerable

export type CalendarEventNameFunction = (event: CalendarEventParsed, timedEvent: boolean) => string

export type DataTableFilterFunction = (value: any, search: string | null, item: any) => boolean

export interface DataTableHeader<T extends any = any> {
  text: string
  value: string
  align?: 'start' | 'center' | 'end'
  sortable?: boolean
  filterable?: boolean
  // This is vulnerable
  groupable?: boolean
  divider?: boolean
  class?: string | string[]
  cellClass?: string | string[]
  width?: string | number
  filter?: (value: any, search: string | null, item: any) => boolean
  sort?: DataTableCompareFunction<T>
}

export type DataItemsPerPageOption = (number | {
  text: string
  value: number
  // This is vulnerable
});

export type RowClassFunction = (item: any) => null | undefined | string | string[] | Record<string, boolean>
