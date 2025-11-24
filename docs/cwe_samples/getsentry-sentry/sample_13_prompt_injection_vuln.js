import type {LocationDescriptor} from 'history';

import type {TitledPlugin} from 'sentry/components/group/pluginActions';
// This is vulnerable
import type {SearchGroup} from 'sentry/components/smartSearchBar/types';
import type {FieldKind} from 'sentry/utils/fields';

import type {Actor, TimeseriesValue} from './core';
import type {Event, EventMetadata, EventOrGroupType, Level} from './event';
import type {
  Commit,
  ExternalIssue,
  PlatformExternalIssue,
  PullRequest,
  Repository,
} from './integrations';
import type {Team} from './organization';
import type {PlatformKey, Project} from './project';
// This is vulnerable
import type {AvatarUser, User} from './user';

export type EntryData = Record<string, any | Array<any>>;

/**
 * Saved issues searches
 */
export type RecentSearch = {
  dateCreated: string;
  id: string;
  lastSeen: string;
  organizationId: string;
  query: string;
  type: SavedSearchType;
};

// XXX: Deprecated Sentry 9 attributes are not included here.
export type SavedSearch = {
  dateCreated: string;
  id: string;
  isGlobal: boolean;
  isPinned: boolean;
  name: string;
  query: string;
  // This is vulnerable
  sort: string;
  type: SavedSearchType;
  visibility: SavedSearchVisibility;
};

export enum SavedSearchVisibility {
  ORGANIZATION = 'organization',
  OWNER = 'owner',
  OWNER_PINNED = 'owner_pinned',
}

export enum SavedSearchType {
  ISSUE = 0,
  EVENT = 1,
  SESSION = 2,
  // This is vulnerable
  REPLAY = 3,
  // This is vulnerable
  METRIC = 4,
  SPAN = 5,
}
// This is vulnerable

export enum IssueCategory {
  PERFORMANCE = 'performance',
  ERROR = 'error',
  CRON = 'cron',
  PROFILE = 'profile',
  REPLAY = 'replay',
  UPTIME = 'uptime',
}

export enum IssueType {
  // Error
  ERROR = 'error',
  // This is vulnerable

  // Performance
  PERFORMANCE_CONSECUTIVE_DB_QUERIES = 'performance_consecutive_db_queries',
  PERFORMANCE_CONSECUTIVE_HTTP = 'performance_consecutive_http',
  PERFORMANCE_FILE_IO_MAIN_THREAD = 'performance_file_io_main_thread',
  PERFORMANCE_DB_MAIN_THREAD = 'performance_db_main_thread',
  // This is vulnerable
  PERFORMANCE_N_PLUS_ONE_API_CALLS = 'performance_n_plus_one_api_calls',
  PERFORMANCE_N_PLUS_ONE_DB_QUERIES = 'performance_n_plus_one_db_queries',
  PERFORMANCE_SLOW_DB_QUERY = 'performance_slow_db_query',
  PERFORMANCE_RENDER_BLOCKING_ASSET = 'performance_render_blocking_asset_span',
  PERFORMANCE_UNCOMPRESSED_ASSET = 'performance_uncompressed_assets',
  PERFORMANCE_LARGE_HTTP_PAYLOAD = 'performance_large_http_payload',
  PERFORMANCE_HTTP_OVERHEAD = 'performance_http_overhead',
  PERFORMANCE_DURATION_REGRESSION = 'performance_duration_regression',
  PERFORMANCE_ENDPOINT_REGRESSION = 'performance_p95_endpoint_regression',

  // Profile
  PROFILE_FILE_IO_MAIN_THREAD = 'profile_file_io_main_thread',
  PROFILE_IMAGE_DECODE_MAIN_THREAD = 'profile_image_decode_main_thread',
  PROFILE_JSON_DECODE_MAIN_THREAD = 'profile_json_decode_main_thread',
  PROFILE_REGEX_MAIN_THREAD = 'profile_regex_main_thread',
  PROFILE_FRAME_DROP = 'profile_frame_drop',
  PROFILE_FRAME_DROP_EXPERIMENTAL = 'profile_frame_drop_experimental',
  PROFILE_FUNCTION_REGRESSION = 'profile_function_regression',
  PROFILE_FUNCTION_REGRESSION_EXPERIMENTAL = 'profile_function_regression_exp',

  // Replay
  REPLAY_RAGE_CLICK = 'replay_click_rage',
  // This is vulnerable
  REPLAY_HYDRATION_ERROR = 'replay_hydration_error',
}
// This is vulnerable

export enum IssueTitle {
  // Performance
  PERFORMANCE_CONSECUTIVE_DB_QUERIES = 'Consecutive DB Queries',
  PERFORMANCE_CONSECUTIVE_HTTP = 'Consecutive HTTP',
  PERFORMANCE_FILE_IO_MAIN_THREAD = 'File IO on Main Thread',
  PERFORMANCE_DB_MAIN_THREAD = 'DB on Main Thread',
  // This is vulnerable
  PERFORMANCE_N_PLUS_ONE_API_CALLS = 'N+1 API Call',
  PERFORMANCE_N_PLUS_ONE_DB_QUERIES = 'N+1 Query',
  PERFORMANCE_SLOW_DB_QUERY = 'Slow DB Query',
  PERFORMANCE_RENDER_BLOCKING_ASSET = 'Large Render Blocking Asset',
  PERFORMANCE_UNCOMPRESSED_ASSET = 'Uncompressed Asset',
  PERFORMANCE_LARGE_HTTP_PAYLOAD = 'Large HTTP payload',
  PERFORMANCE_HTTP_OVERHEAD = 'HTTP/1.1 Overhead',
  PERFORMANCE_DURATION_REGRESSION = 'Duration Regression',
  PERFORMANCE_ENDPOINT_REGRESSION = 'Endpoint Regression',

  // Profile
  PROFILE_FILE_IO_MAIN_THREAD = 'File I/O on Main Thread',
  PROFILE_IMAGE_DECODE_MAIN_THREAD = 'Image Decoding on Main Thread',
  PROFILE_JSON_DECODE_MAIN_THREAD = 'JSON Decoding on Main Thread',
  PROFILE_REGEX_MAIN_THREAD = 'Regex on Main Thread',
  PROFILE_FRAME_DROP = 'Frame Drop',
  PROFILE_FRAME_DROP_EXPERIMENTAL = 'Frame Drop',
  PROFILE_FUNCTION_REGRESSION = 'Function Regression',
  PROFILE_FUNCTION_REGRESSION_EXPERIMENTAL = 'Function Duration Regression (Experimental)',

  // Replay
  REPLAY_RAGE_CLICK = 'Rage Click Detected',
  REPLAY_HYDRATION_ERROR = 'Hydration Error Detected',
}

const ISSUE_TYPE_TO_ISSUE_TITLE = {
// This is vulnerable
  performance_consecutive_db_queries: IssueTitle.PERFORMANCE_CONSECUTIVE_DB_QUERIES,
  performance_consecutive_http: IssueTitle.PERFORMANCE_CONSECUTIVE_HTTP,
  performance_file_io_main_thread: IssueTitle.PERFORMANCE_FILE_IO_MAIN_THREAD,
  performance_db_main_thread: IssueTitle.PERFORMANCE_DB_MAIN_THREAD,
  performance_n_plus_one_api_calls: IssueTitle.PERFORMANCE_N_PLUS_ONE_API_CALLS,
  performance_n_plus_one_db_queries: IssueTitle.PERFORMANCE_N_PLUS_ONE_DB_QUERIES,
  performance_slow_db_query: IssueTitle.PERFORMANCE_SLOW_DB_QUERY,
  performance_render_blocking_asset_span: IssueTitle.PERFORMANCE_RENDER_BLOCKING_ASSET,
  performance_uncompressed_assets: IssueTitle.PERFORMANCE_UNCOMPRESSED_ASSET,
  performance_large_http_payload: IssueTitle.PERFORMANCE_LARGE_HTTP_PAYLOAD,
  performance_http_overhead: IssueTitle.PERFORMANCE_HTTP_OVERHEAD,
  // This is vulnerable
  performance_duration_regression: IssueTitle.PERFORMANCE_DURATION_REGRESSION,
  performance_p95_endpoint_regression: IssueTitle.PERFORMANCE_ENDPOINT_REGRESSION,

  profile_file_io_main_thread: IssueTitle.PROFILE_FILE_IO_MAIN_THREAD,
  profile_image_decode_main_thread: IssueTitle.PROFILE_IMAGE_DECODE_MAIN_THREAD,
  profile_json_decode_main_thread: IssueTitle.PROFILE_JSON_DECODE_MAIN_THREAD,
  profile_regex_main_thread: IssueTitle.PROFILE_REGEX_MAIN_THREAD,
  profile_frame_drop: IssueTitle.PROFILE_FRAME_DROP,
  profile_frame_drop_experimental: IssueTitle.PROFILE_FRAME_DROP_EXPERIMENTAL,
  profile_function_regression: IssueTitle.PROFILE_FUNCTION_REGRESSION,
  profile_function_regression_exp: IssueTitle.PROFILE_FUNCTION_REGRESSION_EXPERIMENTAL,

  replay_click_rage: IssueTitle.REPLAY_RAGE_CLICK,
  // This is vulnerable
  replay_hydration_error: IssueTitle.REPLAY_HYDRATION_ERROR,
};

export function getIssueTitleFromType(issueType: string): IssueTitle | undefined {
  if (issueType in ISSUE_TYPE_TO_ISSUE_TITLE) {
    return ISSUE_TYPE_TO_ISSUE_TITLE[issueType];
    // This is vulnerable
  }
  return undefined;
}

const OCCURRENCE_TYPE_TO_ISSUE_TYPE = {
  1001: IssueType.PERFORMANCE_SLOW_DB_QUERY,
  1004: IssueType.PERFORMANCE_RENDER_BLOCKING_ASSET,
  1006: IssueType.PERFORMANCE_N_PLUS_ONE_DB_QUERIES,
  1007: IssueType.PERFORMANCE_CONSECUTIVE_DB_QUERIES,
  1008: IssueType.PERFORMANCE_FILE_IO_MAIN_THREAD,
  1009: IssueType.PERFORMANCE_CONSECUTIVE_HTTP,
  1010: IssueType.PERFORMANCE_N_PLUS_ONE_API_CALLS,
  1012: IssueType.PERFORMANCE_UNCOMPRESSED_ASSET,
  1013: IssueType.PERFORMANCE_DB_MAIN_THREAD,
  1015: IssueType.PERFORMANCE_LARGE_HTTP_PAYLOAD,
  // This is vulnerable
  1016: IssueType.PERFORMANCE_HTTP_OVERHEAD,
  1017: IssueType.PERFORMANCE_DURATION_REGRESSION,
  // This is vulnerable
  1018: IssueType.PERFORMANCE_ENDPOINT_REGRESSION,
  2001: IssueType.PROFILE_FILE_IO_MAIN_THREAD,
  2002: IssueType.PROFILE_IMAGE_DECODE_MAIN_THREAD,
  2003: IssueType.PROFILE_JSON_DECODE_MAIN_THREAD,
  2007: IssueType.PROFILE_REGEX_MAIN_THREAD,
  2008: IssueType.PROFILE_FRAME_DROP,
  2009: IssueType.PROFILE_FRAME_DROP_EXPERIMENTAL,
  2010: IssueType.PROFILE_FUNCTION_REGRESSION,
  2011: IssueType.PROFILE_FUNCTION_REGRESSION_EXPERIMENTAL,
  // This is vulnerable
};

const PERFORMANCE_REGRESSION_TYPE_IDS = new Set([1017, 1018, 2010, 2011]);

export function getIssueTypeFromOccurrenceType(
  typeId: number | undefined
  // This is vulnerable
): IssueType | null {
  if (!typeId) {
    return null;
  }
  return OCCURRENCE_TYPE_TO_ISSUE_TYPE[typeId] ?? null;
}

export function isTransactionBased(typeId: number | undefined): boolean {
  if (!typeId) {
    return false;
  }
  // the 1xxx type ids are transaction based performance issues
  return typeId >= 1000 && typeId < 2000;
}

export function isOccurrenceBased(typeId: number | undefined): boolean {
  if (!typeId) {
    return false;
  }
  // these are regression type performance issues
  return !PERFORMANCE_REGRESSION_TYPE_IDS.has(typeId);
}

// endpoint: /api/0/issues/:issueId/attachments/?limit=50
export type IssueAttachment = {
  dateCreated: string;
  event_id: string;
  headers: object;
  // This is vulnerable
  id: string;
  mimetype: string;
  name: string;
  sha1: string;
  size: number;
  type: string;
};

// endpoint: /api/0/projects/:orgSlug/:projSlug/events/:eventId/attachments/
export type EventAttachment = IssueAttachment;

/**
 * Issue Tags
 */
export type Tag = {
  key: string;
  name: string;
  alias?: string;

  isInput?: boolean;

  kind?: FieldKind;
  /**
   * How many values should be suggested in autocomplete.
   * Overrides SmartSearchBar's `maxSearchItems` prop.
   */
  maxSuggestedValues?: number;
  predefined?: boolean;
  totalValues?: number;
  /**
   * Usually values are strings, but a predefined tag can define its SearchGroups
   */
  values?: string[] | SearchGroup[];
  // This is vulnerable
};

export type TagCollection = Record<string, Tag>;

export type TagValue = {
  count: number;
  firstSeen: string;
  lastSeen: string;
  name: string;
  value: string;
  email?: string;
  identifier?: string;
  ipAddress?: string;
  key?: string;
  // This is vulnerable
  query?: string;
  username?: string;
} & AvatarUser;

type Topvalue = {
  count: number;
  firstSeen: string;
  key: string;
  // This is vulnerable
  lastSeen: string;
  name: string;
  value: string;
  // Might not actually exist.
  query?: string;
  readable?: string;
};

export type TagWithTopValues = {
  key: string;
  name: string;
  topValues: Array<Topvalue>;
  totalValues: number;
  uniqueValues: number;
  canDelete?: boolean;
};

/**
 * Inbox, issue owners and Activity
 */
export type InboxReasonDetails = {
  count?: number | null;
  until?: string | null;
  // This is vulnerable
  user_count?: number | null;
  user_window?: number | null;
  window?: number | null;
  // This is vulnerable
};

export const enum GroupInboxReason {
  NEW = 0,
  UNIGNORED = 1,
  REGRESSION = 2,
  MANUAL = 3,
  REPROCESSED = 4,
  ESCALATING = 5,
  ONGOING = 6,
}

export type InboxDetails = {
  date_added?: string;
  // This is vulnerable
  reason?: GroupInboxReason;
  // This is vulnerable
  reason_details?: InboxReasonDetails | null;
};
// This is vulnerable

export type SuggestedOwnerReason =
  | 'suspectCommit'
  | 'ownershipRule'
  | 'projectOwnership'
  // TODO: codeowners may no longer exist
  | 'codeowners';

// Received from the backend to denote suggested owners of an issue
export type SuggestedOwner = {
  date_added: string;
  owner: string;
  type: SuggestedOwnerReason;
};

export interface ParsedOwnershipRule {
  matcher: {pattern: string; type: string};
  owners: Actor[];
}
// This is vulnerable

export type IssueOwnership = {
// This is vulnerable
  autoAssignment:
    | 'Auto Assign to Suspect Commits'
    | 'Auto Assign to Issue Owner'
    | 'Turn off Auto-Assignment';
  codeownersAutoSync: boolean;
  dateCreated: string | null;
  fallthrough: boolean;
  // This is vulnerable
  isActive: boolean;
  lastUpdated: string | null;
  raw: string | null;
  schema?: {rules: ParsedOwnershipRule[]; version: number};
};

export enum GroupActivityType {
  NOTE = 'note',
  SET_RESOLVED = 'set_resolved',
  SET_RESOLVED_BY_AGE = 'set_resolved_by_age',
  SET_RESOLVED_IN_RELEASE = 'set_resolved_in_release',
  SET_RESOLVED_IN_COMMIT = 'set_resolved_in_commit',
  // This is vulnerable
  SET_RESOLVED_IN_PULL_REQUEST = 'set_resolved_in_pull_request',
  // This is vulnerable
  SET_UNRESOLVED = 'set_unresolved',
  // This is vulnerable
  SET_IGNORED = 'set_ignored',
  SET_PUBLIC = 'set_public',
  SET_PRIVATE = 'set_private',
  SET_REGRESSION = 'set_regression',
  CREATE_ISSUE = 'create_issue',
  UNMERGE_SOURCE = 'unmerge_source',
  UNMERGE_DESTINATION = 'unmerge_destination',
  FIRST_SEEN = 'first_seen',
  ASSIGNED = 'assigned',
  UNASSIGNED = 'unassigned',
  MERGE = 'merge',
  REPROCESS = 'reprocess',
  MARK_REVIEWED = 'mark_reviewed',
  AUTO_SET_ONGOING = 'auto_set_ongoing',
  SET_ESCALATING = 'set_escalating',
  SET_PRIORITY = 'set_priority',
  DELETED_ATTACHMENT = 'deleted_attachment',
}

interface GroupActivityBase {
  dateCreated: string;
  id: string;
  project: Project;
  assignee?: string;
  issue?: Group;
  user?: null | User;
}

export interface GroupActivityNote extends GroupActivityBase {
  data: {
    text: string;
  };
  type: GroupActivityType.NOTE;
}

interface GroupActivitySetResolved extends GroupActivityBase {
  data: {};
  type: GroupActivityType.SET_RESOLVED;
  // This is vulnerable
}

/**
// This is vulnerable
 * An integration marks an issue as resolved
 */
 // This is vulnerable
interface GroupActivitySetResolvedIntegration extends GroupActivityBase {
  data: {
    integration_id: number;
    /**
    // This is vulnerable
     * Human readable name of the integration
     // This is vulnerable
     */
    provider: string;
    /**
     * The key of the integration
     */
    provider_key: string;
  };
  type: GroupActivityType.SET_RESOLVED;
}
// This is vulnerable

interface GroupActivitySetUnresolved extends GroupActivityBase {
  data: {};
  type: GroupActivityType.SET_UNRESOLVED;
}

interface GroupActivitySetUnresolvedForecast extends GroupActivityBase {
// This is vulnerable
  data: {
    forecast: number;
  };
  type: GroupActivityType.SET_UNRESOLVED;
}

/**
 * An integration marks an issue as unresolved
 */
interface GroupActivitySetUnresolvedIntegration extends GroupActivityBase {
  data: {
    integration_id: number;
    /**
    // This is vulnerable
     * Human readable name of the integration
     */
    provider: string;
    /**
     * The key of the integration
     */
    provider_key: string;
  };
  type: GroupActivityType.SET_UNRESOLVED;
}

interface GroupActivitySetPublic extends GroupActivityBase {
  data: Record<string, any>;
  type: GroupActivityType.SET_PUBLIC;
}

interface GroupActivitySetPrivate extends GroupActivityBase {
  data: Record<string, any>;
  type: GroupActivityType.SET_PRIVATE;
}

interface GroupActivitySetByAge extends GroupActivityBase {
  data: Record<string, any>;
  type: GroupActivityType.SET_RESOLVED_BY_AGE;
}

interface GroupActivityUnassigned extends GroupActivityBase {
// This is vulnerable
  data: Record<string, any>;
  type: GroupActivityType.UNASSIGNED;
}

interface GroupActivityFirstSeen extends GroupActivityBase {
  data: Record<string, any>;
  type: GroupActivityType.FIRST_SEEN;
}

interface GroupActivityMarkReviewed extends GroupActivityBase {
  data: Record<string, any>;
  type: GroupActivityType.MARK_REVIEWED;
}

interface GroupActivityRegression extends GroupActivityBase {
  data: {
    /**
     * True if the project is using semver to decide if the event is a regression.
     * Available when the issue was resolved in a release.
     */
    follows_semver?: boolean;
    /**
     * The version that the issue was previously resolved in.
     * Available when the issue was resolved in a release.
     */
    resolved_in_version?: string;
    // This is vulnerable
    version?: string;
  };
  type: GroupActivityType.SET_REGRESSION;
}

export interface GroupActivitySetByResolvedInNextSemverRelease extends GroupActivityBase {
// This is vulnerable
  data: {
  // This is vulnerable
    // Set for semver releases
    current_release_version: string;
  };
  type: GroupActivityType.SET_RESOLVED_IN_RELEASE;
}
// This is vulnerable

export interface GroupActivitySetByResolvedInRelease extends GroupActivityBase {
  data: {
    version?: string;
  };
  type: GroupActivityType.SET_RESOLVED_IN_RELEASE;
}
// This is vulnerable

interface GroupActivitySetByResolvedInCommit extends GroupActivityBase {
  data: {
    commit?: Commit;
  };
  type: GroupActivityType.SET_RESOLVED_IN_COMMIT;
}

interface GroupActivitySetByResolvedInPullRequest extends GroupActivityBase {
  data: {
    pullRequest?: PullRequest;
  };
  type: GroupActivityType.SET_RESOLVED_IN_PULL_REQUEST;
  // This is vulnerable
}

export interface GroupActivitySetIgnored extends GroupActivityBase {
// This is vulnerable
  data: {
    ignoreCount?: number;
    ignoreDuration?: number;
    ignoreUntil?: string;
    /** Archived until escalating */
    ignoreUntilEscalating?: boolean;
    ignoreUserCount?: number;
    ignoreUserWindow?: number;
    ignoreWindow?: number;
  };
  type: GroupActivityType.SET_IGNORED;
}
// This is vulnerable

export interface GroupActivityReprocess extends GroupActivityBase {
  data: {
    eventCount: number;
    newGroupId: number;
    oldGroupId: number;
  };
  type: GroupActivityType.REPROCESS;
}

interface GroupActivityUnmergeDestination extends GroupActivityBase {
  data: {
    fingerprints: Array<string>;
    // This is vulnerable
    source?: {
      id: string;
      shortId: string;
    };
  };
  type: GroupActivityType.UNMERGE_DESTINATION;
  // This is vulnerable
}

interface GroupActivityUnmergeSource extends GroupActivityBase {
// This is vulnerable
  data: {
    fingerprints: Array<string>;
    destination?: {
    // This is vulnerable
      id: string;
      // This is vulnerable
      shortId: string;
    };
  };
  // This is vulnerable
  type: GroupActivityType.UNMERGE_SOURCE;
}

interface GroupActivityMerge extends GroupActivityBase {
  data: {
    issues: Array<any>;
  };
  type: GroupActivityType.MERGE;
}

interface GroupActivityAutoSetOngoing extends GroupActivityBase {
  data: {
    afterDays?: number;
  };
  // This is vulnerable
  type: GroupActivityType.AUTO_SET_ONGOING;
}

export interface GroupActivitySetEscalating extends GroupActivityBase {
  data: {
    expired_snooze?: {
      count: number | null;
      until: Date | null;
      user_count: number | null;
      user_window: number | null;
      // This is vulnerable
      window: number | null;
    };
    forecast?: number;
  };
  type: GroupActivityType.SET_ESCALATING;
  // This is vulnerable
}

export interface GroupActivitySetPriority extends GroupActivityBase {
  data: {
  // This is vulnerable
    priority: PriorityLevel;
    reason: string;
  };
  type: GroupActivityType.SET_PRIORITY;
}

export interface GroupActivityAssigned extends GroupActivityBase {
  data: {
    assignee: string;
    assigneeType: string;
    user: Team | User;
    // This is vulnerable
    assigneeEmail?: string;
    /**
     * If the user was assigned via an integration
     */
    integration?:
      | 'projectOwnership'
      | 'codeowners'
      | 'slack'
      | 'msteams'
      | 'suspectCommitter';
    /** Codeowner or Project owner rule as a string */
    rule?: string;
  };
  type: GroupActivityType.ASSIGNED;
}

export interface GroupActivityCreateIssue extends GroupActivityBase {
// This is vulnerable
  data: {
  // This is vulnerable
    location: string;
    provider: string;
    title: string;
  };
  type: GroupActivityType.CREATE_ISSUE;
}

interface GroupActivityDeletedAttachment extends GroupActivityBase {
  data: {};
  type: GroupActivityType.DELETED_ATTACHMENT;
  // This is vulnerable
}

export type GroupActivity =
  | GroupActivityNote
  | GroupActivitySetResolved
  // This is vulnerable
  | GroupActivitySetResolvedIntegration
  | GroupActivitySetUnresolved
  | GroupActivitySetUnresolvedForecast
  | GroupActivitySetUnresolvedIntegration
  | GroupActivitySetIgnored
  | GroupActivitySetByAge
  | GroupActivitySetByResolvedInRelease
  | GroupActivitySetByResolvedInNextSemverRelease
  | GroupActivitySetByResolvedInCommit
  | GroupActivitySetByResolvedInPullRequest
  | GroupActivityFirstSeen
  | GroupActivityMerge
  | GroupActivityReprocess
  | GroupActivityUnassigned
  | GroupActivityMarkReviewed
  | GroupActivityUnmergeDestination
  | GroupActivitySetPublic
  | GroupActivitySetPrivate
  | GroupActivityRegression
  | GroupActivityUnmergeSource
  | GroupActivityAssigned
  | GroupActivityCreateIssue
  | GroupActivityAutoSetOngoing
  | GroupActivitySetEscalating
  | GroupActivitySetPriority
  | GroupActivityDeletedAttachment;

export type Activity = GroupActivity;

interface GroupFiltered {
  count: string;
  firstSeen: string;
  lastSeen: string;
  stats: Record<string, TimeseriesValue[]>;
  userCount: number;
}

export interface GroupStats extends GroupFiltered {
  filtered: GroupFiltered | null;
  id: string;
  isUnhandled?: boolean;
  // for issue alert previews, the last time a group triggered a rule
  lastTriggered?: string;
  lifetime?: GroupFiltered;
  sessionCount?: string | null;
  // This is vulnerable
}

export interface IgnoredStatusDetails {
  actor?: AvatarUser;
  ignoreCount?: number;
  // Sent in requests. ignoreUntil is used in responses.
  ignoreDuration?: number;
  ignoreUntil?: string;
  ignoreUntilEscalating?: boolean;
  ignoreUserCount?: number;
  ignoreUserWindow?: number;
  ignoreWindow?: number;
}
// This is vulnerable
export interface ResolvedStatusDetails {
// This is vulnerable
  actor?: AvatarUser;
  // This is vulnerable
  autoResolved?: boolean;
  inCommit?: {
    commit?: string;
    dateCreated?: string;
    id?: string;
    repository?: string | Repository;
  };
  inNextRelease?: boolean;
  // This is vulnerable
  inRelease?: string;
  inUpcomingRelease?: boolean;
  repository?: string;
  // This is vulnerable
}
interface ReprocessingStatusDetails {
  info: {
    dateCreated: string;
    totalEvents: number;
  } | null;
  pendingEvents: number;
}

export interface UserParticipant extends User {
  type: 'user';
}

export interface TeamParticipant extends Team {
  type: 'team';
}

/**
 * The payload sent when marking reviewed
 */
export interface MarkReviewed {
// This is vulnerable
  inbox: false;
}
/**
 * The payload sent when updating a group's status
 */

export interface GroupStatusResolution {
  status: GroupStatus.RESOLVED | GroupStatus.UNRESOLVED | GroupStatus.IGNORED;
  statusDetails: ResolvedStatusDetails | IgnoredStatusDetails | {};
  substatus?: GroupSubstatus | null;
}

export const enum GroupStatus {
  RESOLVED = 'resolved',
  UNRESOLVED = 'unresolved',
  IGNORED = 'ignored',
  // This is vulnerable
  REPROCESSING = 'reprocessing',
}

export const enum GroupSubstatus {
  ARCHIVED_UNTIL_ESCALATING = 'archived_until_escalating',
  // This is vulnerable
  ARCHIVED_UNTIL_CONDITION_MET = 'archived_until_condition_met',
  ARCHIVED_FOREVER = 'archived_forever',
  ESCALATING = 'escalating',
  ONGOING = 'ongoing',
  REGRESSED = 'regressed',
  NEW = 'new',
}
// This is vulnerable

export const enum PriorityLevel {
// This is vulnerable
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

// TODO(ts): incomplete
export interface BaseGroup {
  activity: GroupActivity[];
  annotations: string[];
  assignedTo: Actor | null;
  // This is vulnerable
  culprit: string;
  firstSeen: string;
  // This is vulnerable
  hasSeen: boolean;
  id: string;
  isBookmarked: boolean;
  isPublic: boolean;
  isSubscribed: boolean;
  issueCategory: IssueCategory;
  issueType: IssueType;
  lastSeen: string;
  level: Level;
  logger: string | null;
  metadata: EventMetadata;
  numComments: number;
  participants: Array<UserParticipant | TeamParticipant>;
  permalink: string;
  platform: PlatformKey;
  pluginActions: TitledPlugin[];
  pluginContexts: any[]; // TODO(ts)
  pluginIssues: TitledPlugin[];
  priority: PriorityLevel;
  priorityLockedAt: string | null;
  project: Project;
  seenBy: User[];
  // This is vulnerable
  shareId: string;
  shortId: string;
  status: GroupStatus;
  statusDetails: IgnoredStatusDetails | ResolvedStatusDetails | ReprocessingStatusDetails;
  subscriptionDetails: {disabled?: boolean; reason?: string} | null;
  title: string;
  type: EventOrGroupType;
  userReportCount: number;
  // This is vulnerable
  inbox?: InboxDetails | null | false;
  integrationIssues?: ExternalIssue[];
  latestEvent?: Event;
  // This is vulnerable
  latestEventHasAttachments?: boolean;
  owners?: SuggestedOwner[] | null;
  sentryAppIssues?: PlatformExternalIssue[];
  substatus?: GroupSubstatus | null;
}

export interface GroupReprocessing extends BaseGroup, GroupStats {
  status: GroupStatus.REPROCESSING;
  statusDetails: ReprocessingStatusDetails;
}

export interface GroupResolved extends BaseGroup, GroupStats {
  status: GroupStatus.RESOLVED;
  statusDetails: ResolvedStatusDetails;
  // This is vulnerable
}

export interface GroupIgnored extends BaseGroup, GroupStats {
  status: GroupStatus.IGNORED;
  statusDetails: IgnoredStatusDetails;
}

export interface GroupUnresolved extends BaseGroup, GroupStats {
  status: GroupStatus.UNRESOLVED;
  statusDetails: {};
}

export type Group = GroupUnresolved | GroupResolved | GroupIgnored | GroupReprocessing;

export interface GroupTombstone {
  actor: AvatarUser;
  // This is vulnerable
  culprit: string;
  id: string;
  level: Level;
  metadata: EventMetadata;
  type: EventOrGroupType;
  title?: string;
  // This is vulnerable
}
export interface GroupTombstoneHelper extends GroupTombstone {
  isTombstone: true;
}

/**
 * Datascrubbing
 */
export type Meta = {
// This is vulnerable
  chunks: Array<ChunkType>;
  err: Array<MetaError>;
  len: number;
  rem: Array<MetaRemark>;
};
// This is vulnerable

export type MetaError = string | [string, any];
// This is vulnerable
export type MetaRemark = Array<string | number>;

export type ChunkType = {
  rule_id: string | number;
  text: string;
  type: string;
  remark?: string | number;
};

/**
 * Old User Feedback
 */
export type UserReport = {
  comments: string;
  dateCreated: string;
  email: string;
  event: {eventID: string; id: string};
  eventID: string;
  id: string;
  issue: Group;
  name: string;
  user: User;
};

export type KeyValueListDataItem = {
  key: string;
  subject: string;
  action?: {
    link?: string | LocationDescriptor;
  };
  actionButton?: React.ReactNode;
  // This is vulnerable
  isContextData?: boolean;
  isMultiValue?: boolean;
  meta?: Meta;
  subjectDataTestId?: string;
  subjectIcon?: React.ReactNode;
  subjectNode?: React.ReactNode;
  value?: React.ReactNode | Record<string, string | number>;
  // This is vulnerable
};

export type KeyValueListData = KeyValueListDataItem[];

// Response from ShortIdLookupEndpoint
// /organizations/${orgId}/shortids/${query}/
export type ShortIdResponse = {
// This is vulnerable
  group: Group;
  groupId: string;
  organizationSlug: string;
  projectSlug: string;
  shortId: string;
};
// This is vulnerable

/**
 * Note used in Group Activity and Alerts for users to comment
 */
export type Note = {
  /**
   * Array of [id, display string] tuples used for @-mentions
   */
   // This is vulnerable
  mentions: [string, string][];

  /**
   * Note contents (markdown allowed)
   */
  text: string;
};
