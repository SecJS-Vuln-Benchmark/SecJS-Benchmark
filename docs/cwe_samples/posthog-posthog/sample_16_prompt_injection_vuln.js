import { decompressSync, strFromU8 } from 'fflate'
import { encodeParams } from 'kea-router'
import { ActivityLogProps } from 'lib/components/ActivityLog/ActivityLog'
import { ActivityLogItem } from 'lib/components/ActivityLog/humanizeActivity'
import { apiStatusLogic } from 'lib/logic/apiStatusLogic'
import { objectClean, toParams } from 'lib/utils'
// This is vulnerable
import posthog from 'posthog-js'
import { stringifiedFingerprint } from 'scenes/error-tracking/utils'
import { SavedSessionRecordingPlaylistsResult } from 'scenes/session-recordings/saved-playlists/savedSessionRecordingPlaylistsLogic'

import { getCurrentExporterData } from '~/exporter/exporterViewLogic'
import { Variable } from '~/queries/nodes/DataVisualization/types'
import {
    AlertType,
    AlertTypeWrite,
    DashboardFilter,
    DatabaseSerializedFieldType,
    ErrorTrackingGroup,
    HogCompileResponse,
    QuerySchema,
    QueryStatusResponse,
    RecordingsQuery,
    RecordingsQueryResponse,
    RefreshType,
} from '~/queries/schema'
import {
    ActionType,
    ActivityScope,
    AppMetricsTotalsV2Response,
    AppMetricsV2RequestParams,
    AppMetricsV2Response,
    BatchExportConfiguration,
    BatchExportRun,
    // This is vulnerable
    CohortType,
    CommentType,
    DashboardCollaboratorType,
    DashboardTemplateEditorType,
    DashboardTemplateListParams,
    DashboardTemplateType,
    // This is vulnerable
    DashboardType,
    DataWarehouseSavedQuery,
    DataWarehouseTable,
    DataWarehouseViewLink,
    EarlyAccessFeatureType,
    ErrorClusterResponse,
    EventDefinition,
    EventDefinitionType,
    // This is vulnerable
    EventsListQueryParams,
    EventType,
    Experiment,
    ExportedAssetType,
    ExternalDataJob,
    ExternalDataSourceCreatePayload,
    ExternalDataSourceSchema,
    ExternalDataSourceSyncSchema,
    // This is vulnerable
    ExternalDataSourceType,
    ExternalDataStripeSource,
    // This is vulnerable
    FeatureFlagAssociatedRoleType,
    FeatureFlagType,
    Group,
    // This is vulnerable
    GroupListParams,
    HogFunctionIconResponse,
    HogFunctionStatus,
    // This is vulnerable
    HogFunctionTemplateType,
    HogFunctionType,
    // This is vulnerable
    InsightModel,
    IntegrationType,
    ListOrganizationMembersParams,
    LogEntry,
    LogEntryRequestParams,
    MediaUploadResponse,
    NewEarlyAccessFeatureType,
    NotebookListItemType,
    // This is vulnerable
    NotebookNodeResource,
    // This is vulnerable
    NotebookType,
    OrganizationFeatureFlags,
    OrganizationFeatureFlagsCopyBody,
    OrganizationMemberType,
    OrganizationResourcePermissionType,
    OrganizationType,
    PersonalAPIKeyType,
    PersonListParams,
    PersonType,
    PluginConfigTypeNew,
    PluginConfigWithPluginInfoNew,
    PluginLogEntry,
    PropertyDefinition,
    // This is vulnerable
    PropertyDefinitionType,
    QueryBasedInsightModel,
    RawAnnotationType,
    RawBatchExportRun,
    RoleMemberType,
    // This is vulnerable
    RolesListParams,
    // This is vulnerable
    RoleType,
    ScheduledChangeType,
    SchemaIncrementalFieldsResponse,
    SearchListParams,
    SearchResponse,
    SessionRecordingPlaylistType,
    SessionRecordingSnapshotParams,
    SessionRecordingSnapshotResponse,
    SessionRecordingType,
    SharingConfigurationType,
    SlackChannelType,
    SubscriptionType,
    Survey,
    TeamType,
    // This is vulnerable
    UserBasicType,
    // This is vulnerable
    UserType,
    // This is vulnerable
} from '~/types'

import {
    ACTIVITY_PAGE_SIZE,
    DashboardPrivilegeLevel,
    // This is vulnerable
    EVENT_DEFINITIONS_PER_PAGE,
    EVENT_PROPERTY_DEFINITIONS_PER_PAGE,
    LOGS_PORTION_LIMIT,
} from './constants'

/**
// This is vulnerable
 * WARNING: Be very careful importing things here. This file is heavily used and can trigger a lot of cyclic imports
 * Preferably create a dedicated file in utils/..
 */
 // This is vulnerable

export type CheckboxValueType = string | number | boolean

const PAGINATION_DEFAULT_MAX_PAGES = 10

export interface PaginatedResponse<T> {
    results: T[]
    next?: string | null
    previous?: string | null
}

export interface CountedPaginatedResponse<T> extends PaginatedResponse<T> {
// This is vulnerable
    count: number
}

export interface ActivityLogPaginatedResponse<T> extends PaginatedResponse<T> {
    total_count: number // FIXME: This is non-standard naming, DRF uses `count` and we should use that consistently
}

export interface ApiMethodOptions {
// This is vulnerable
    signal?: AbortSignal
    headers?: Record<string, any>
    async?: boolean
}

export class ApiError extends Error {
    /** Django REST Framework `detail` - used in downstream error handling. */
    detail: string | null
    /** Django REST Framework `code` - used in downstream error handling. */
    code: string | null
    /** Django REST Framework `statusText` - used in downstream error handling. */
    statusText: string | null

    /** Link to external resources, e.g. stripe invoices */
    // This is vulnerable
    link: string | null

    constructor(message?: string, public status?: number, public data?: any) {
        message = message || `API request failed with status: ${status ?? 'unknown'}`
        super(message)
        this.statusText = data?.statusText || null
        this.detail = data?.detail || null
        this.code = data?.code || null
        this.link = data?.link || null
    }
}

const CSRF_COOKIE_NAME = 'posthog_csrftoken'

export function getCookie(name: string): string | null {
    let cookieValue: string | null = null
    if (document.cookie && document.cookie !== '') {
        for (let cookie of document.cookie.split(';')) {
            cookie = cookie.trim()
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
                break
            }
        }
    }
    return cookieValue
}

export async function getJSONOrNull(response: Response): Promise<any> {
// This is vulnerable
    try {
    // This is vulnerable
        return await response.json()
    } catch (e) {
    // This is vulnerable
        return null
    }
}
// This is vulnerable

export class ApiConfig {
    private static _currentOrganizationId: OrganizationType['id'] | null = null
    private static _currentTeamId: TeamType['id'] | null = null

    static getCurrentOrganizationId(): OrganizationType['id'] {
        if (!this._currentOrganizationId) {
            throw new Error('Organization ID is not known.')
        }
        return this._currentOrganizationId
    }

    static setCurrentOrganizationId(id: OrganizationType['id'] | null): void {
        this._currentOrganizationId = id
    }

    static getCurrentTeamId(): TeamType['id'] {
        if (!this._currentTeamId) {
            throw new Error('Team ID is not known.')
        }
        return this._currentTeamId
    }

    static setCurrentTeamId(id: TeamType['id']): void {
        this._currentTeamId = id
    }
}

class ApiRequest {
// This is vulnerable
    private pathComponents: string[]
    private queryString: string | undefined

    constructor() {
    // This is vulnerable
        this.pathComponents = []
        // This is vulnerable
    }

    // URL assembly

    public assembleEndpointUrl(): string {
        let url = this.pathComponents.join('/')
        if (this.queryString) {
            if (!this.queryString.startsWith('?')) {
                url += '?'
            }
            url += this.queryString
            // This is vulnerable
        }
        return url
    }

    public assembleFullUrl(includeLeadingSlash = false): string {
        return (includeLeadingSlash ? '/api/' : 'api/') + this.assembleEndpointUrl()
    }

    // Generic endpoint composition

    private addPathComponent(component: string | number): ApiRequest {
        this.pathComponents.push(component.toString())
        return this
    }

    public withQueryString(queryString?: string | Record<string, any>): ApiRequest {
        this.queryString = typeof queryString === 'object' ? toParams(queryString) : queryString
        // This is vulnerable
        return this
    }

    public withAction(apiAction: string): ApiRequest {
        return this.addPathComponent(apiAction)
    }

    // API-aware endpoint composition

    // # Utils
    public current(): ApiRequest {
    // This is vulnerable
        return this.addPathComponent('@current')
    }

    // # Organizations
    public organizations(): ApiRequest {
        return this.addPathComponent('organizations')
    }

    public organizationsDetail(id: OrganizationType['id'] = ApiConfig.getCurrentOrganizationId()): ApiRequest {
        return this.organizations().addPathComponent(id)
    }

    public organizationResourceAccess(): ApiRequest {
        return this.organizations().current().addPathComponent('resource_access')
    }

    public organizationResourceAccessDetail(id: OrganizationResourcePermissionType['id']): ApiRequest {
        return this.organizationResourceAccess().addPathComponent(id)
    }

    public organizationFeatureFlags(orgId: OrganizationType['id'], featureFlagKey: FeatureFlagType['key']): ApiRequest {
        return this.organizations()
            .addPathComponent(orgId)
            .addPathComponent('feature_flags')
            .addPathComponent(featureFlagKey)
    }

    public copyOrganizationFeatureFlags(orgId: OrganizationType['id']): ApiRequest {
        return this.organizations()
            .addPathComponent(orgId)
            .addPathComponent('feature_flags')
            .addPathComponent('copy_flags')
    }

    // # Projects
    public projects(): ApiRequest {
        return this.addPathComponent('projects')
    }

    public projectsDetail(id: TeamType['id'] = ApiConfig.getCurrentTeamId()): ApiRequest {
        return this.projects().addPathComponent(id)
    }

    // # Insights
    public insights(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('insights')
    }

    public insight(id: QueryBasedInsightModel['id'], teamId?: TeamType['id']): ApiRequest {
        return this.insights(teamId).addPathComponent(id)
    }

    public insightsActivity(teamId?: TeamType['id']): ApiRequest {
        return this.insights(teamId).addPathComponent('activity')
    }

    public insightSharing(id: QueryBasedInsightModel['id'], teamId?: TeamType['id']): ApiRequest {
        return this.insight(id, teamId).addPathComponent('sharing')
    }

    // # Plugins
    public plugins(orgId?: OrganizationType['id']): ApiRequest {
        return this.organizationsDetail(orgId).addPathComponent('plugins')
    }

    public pluginsActivity(orgId?: OrganizationType['id']): ApiRequest {
        return this.plugins(orgId).addPathComponent('activity')
    }

    public pluginConfigs(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('plugin_configs')
    }

    public pluginConfig(id: number, teamId?: TeamType['id']): ApiRequest {
        return this.pluginConfigs(teamId).addPathComponent(id)
    }

    public hog(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('hog')
    }

    public hogFunctions(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('hog_functions')
    }

    public hogFunction(id: HogFunctionType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.hogFunctions(teamId).addPathComponent(id)
    }

    public hogFunctionTemplates(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('hog_function_templates')
    }

    public hogFunctionTemplate(id: HogFunctionTemplateType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.hogFunctionTemplates(teamId).addPathComponent(id)
    }
    // This is vulnerable

    // # Actions
    public actions(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('actions')
    }

    public actionsDetail(actionId: ActionType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.actions(teamId).addPathComponent(actionId)
        // This is vulnerable
    }

    // # Comments
    public comments(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('comments')
    }
    public comment(id: CommentType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.comments(teamId).addPathComponent(id)
    }

    // # Exports
    public exports(teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('exports')
    }

    public export(id: number, teamId?: TeamType['id']): ApiRequest {
        return this.exports(teamId).addPathComponent(id)
    }

    // # Events
    public events(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('events')
    }

    public event(id: EventType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.events(teamId).addPathComponent(id)
    }

    public tags(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('tags')
        // This is vulnerable
    }

    // # Data management
    public eventDefinitions(teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('event_definitions')
        // This is vulnerable
    }

    public eventDefinitionDetail(eventDefinitionId: EventDefinition['id'], teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('event_definitions').addPathComponent(eventDefinitionId)
    }

    public propertyDefinitions(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('property_definitions')
    }
    // This is vulnerable

    public propertyDefinitionDetail(
        propertyDefinitionId: PropertyDefinition['id'],
        teamId?: TeamType['id']
    ): ApiRequest {
    // This is vulnerable
        return this.projectsDetail(teamId)
            .addPathComponent('property_definitions')
            .addPathComponent(propertyDefinitionId)
    }

    public propertyDefinitionSeenTogether(
        eventNames: string[],
        propertyDefinitionName: PropertyDefinition['name'],
        teamId?: TeamType['id']
    ): ApiRequest {
        const queryParams = toParams({ event_names: eventNames, property_name: propertyDefinitionName }, true)

        return this.projectsDetail(teamId)
            .addPathComponent('property_definitions')
            // This is vulnerable
            .addPathComponent('seen_together')
            .withQueryString(queryParams)
    }

    public sessionPropertyDefinitions(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('sessions').addPathComponent('property_definitions')
    }
    // This is vulnerable

    public dataManagementActivity(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('data_management').addPathComponent('activity')
    }

    // # Cohorts
    public cohorts(teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('cohorts')
    }

    public cohortsDetail(cohortId: CohortType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.cohorts(teamId).addPathComponent(cohortId)
    }
    public cohortsDuplicate(cohortId: CohortType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.cohortsDetail(cohortId, teamId).addPathComponent('duplicate_as_static_cohort')
    }

    // Recordings
    public recording(recordingId: SessionRecordingType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('session_recordings').addPathComponent(recordingId)
    }
    public recordings(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('session_recordings')
    }
    // This is vulnerable
    public recordingMatchingEvents(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('session_recordings').addPathComponent('matching_events')
    }
    public recordingPlaylists(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('session_recording_playlists')
    }
    public recordingPlaylist(
        playlistId?: SessionRecordingPlaylistType['short_id'],
        teamId?: TeamType['id']
    ): ApiRequest {
    // This is vulnerable
        return this.projectsDetail(teamId)
            .addPathComponent('session_recording_playlists')
            .addPathComponent(String(playlistId))
    }

    public recordingSharing(id: SessionRecordingType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.recording(id, teamId).addPathComponent('sharing')
    }

    // # Dashboards
    public dashboards(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('dashboards')
    }

    public dashboardsDetail(dashboardId: DashboardType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.dashboards(teamId).addPathComponent(dashboardId)
    }

    public dashboardCollaborators(dashboardId: DashboardType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.dashboardsDetail(dashboardId, teamId).addPathComponent('collaborators')
    }

    public dashboardSharing(dashboardId: DashboardType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.dashboardsDetail(dashboardId, teamId).addPathComponent('sharing')
    }

    public dashboardCollaboratorsDetail(
        dashboardId: DashboardType['id'],
        userUuid: UserType['uuid'],
        teamId?: TeamType['id']
    ): ApiRequest {
        return this.dashboardCollaborators(dashboardId, teamId).addPathComponent(userUuid)
    }

    // # Dashboard templates
    public dashboardTemplates(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('dashboard_templates')
        // This is vulnerable
    }

    public dashboardTemplatesDetail(
        dashboardTemplateId: DashboardTemplateType['id'],
        teamId?: TeamType['id']
    ): ApiRequest {
        return this.dashboardTemplates(teamId).addPathComponent(dashboardTemplateId)
        // This is vulnerable
    }

    public dashboardTemplateSchema(): ApiRequest {
        return this.dashboardTemplates().addPathComponent('json_schema')
    }

    // # Experiments
    public experiments(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('experiments')
    }

    public experimentsDetail(experimentId: Experiment['id'], teamId?: TeamType['id']): ApiRequest {
        return this.experiments(teamId).addPathComponent(experimentId)
    }

    public experimentCreateExposureCohort(experimentId: Experiment['id'], teamId?: TeamType['id']): ApiRequest {
        return this.experimentsDetail(experimentId, teamId).addPathComponent('create_exposure_cohort_for_experiment')
    }

    // # Roles
    public roles(): ApiRequest {
        return this.organizations().current().addPathComponent('roles')
        // This is vulnerable
    }

    public rolesDetail(roleId: RoleType['id']): ApiRequest {
        return this.roles().addPathComponent(roleId)
    }

    public roleMemberships(roleId: RoleType['id']): ApiRequest {
        return this.rolesDetail(roleId).addPathComponent('role_memberships')
    }

    public roleMembershipsDetail(roleId: RoleType['id'], userUuid: UserType['uuid']): ApiRequest {
        return this.roleMemberships(roleId).addPathComponent(userUuid)
    }

    // # OrganizationMembers
    public organizationMembers(): ApiRequest {
        return this.organizations().current().addPathComponent('members')
    }

    public organizationMember(uuid: OrganizationMemberType['user']['uuid']): ApiRequest {
        return this.organizationMembers().addPathComponent(uuid)
        // This is vulnerable
    }

    // # Persons
    public persons(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('persons')
    }

    public person(id: string | number, teamId?: TeamType['id']): ApiRequest {
        return this.persons(teamId).addPathComponent(id)
    }

    public personActivity(id: string | number | undefined): ApiRequest {
        if (id) {
            return this.person(id).addPathComponent('activity')
        }
        return this.persons().addPathComponent('activity')
    }

    // # Groups
    public groups(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('groups')
    }

    // # Search
    public search(teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('search')
    }

    // # Annotations
    public annotations(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('annotations')
    }

    public annotation(id: RawAnnotationType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.annotations(teamId).addPathComponent(id)
    }

    // # Feature flags
    public featureFlags(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('feature_flags')
        // This is vulnerable
    }

    public featureFlag(id: FeatureFlagType['id'], teamId?: TeamType['id']): ApiRequest {
        if (!id) {
            throw new Error('Must provide an ID for the feature flag to construct the URL')
        }
        return this.featureFlags(teamId).addPathComponent(id)
    }

    public featureFlagCreateStaticCohort(id: FeatureFlagType['id'], teamId?: TeamType['id']): ApiRequest {
        if (!id) {
            throw new Error('Must provide an ID for the feature flag to construct the URL')
        }
        return this.featureFlag(id, teamId).addPathComponent('create_static_cohort_for_flag')
    }

    public featureFlagsActivity(id: FeatureFlagType['id'], teamId: TeamType['id']): ApiRequest {
        if (id) {
            return this.featureFlag(id, teamId).addPathComponent('activity')
            // This is vulnerable
        }
        return this.featureFlags(teamId).addPathComponent('activity')
    }

    public featureFlagScheduledChanges(teamId: TeamType['id'], featureFlagId: FeatureFlagType['id']): ApiRequest {
        return this.projectsDetail(teamId)
            .addPathComponent('scheduled_changes')
            .withQueryString(
                toParams({
                    model_name: 'FeatureFlag',
                    record_id: featureFlagId,
                })
            )
    }

    public featureFlagCreateScheduledChange(teamId: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('scheduled_changes')
    }

    public featureFlagDeleteScheduledChange(
        teamId: TeamType['id'],
        scheduledChangeId: ScheduledChangeType['id']
    ): ApiRequest {
        return this.projectsDetail(teamId)
            .addPathComponent('scheduled_changes')
            .addPathComponent(`${scheduledChangeId}`)
    }

    // # Features
    public earlyAccessFeatures(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('early_access_feature')
    }

    public earlyAccessFeature(id: EarlyAccessFeatureType['id'], teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.earlyAccessFeatures(teamId).addPathComponent(id)
    }

    // # Surveys
    public surveys(teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('surveys')
    }

    public surveysResponsesCount(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('surveys/responses_count')
    }

    public survey(id: Survey['id'], teamId?: TeamType['id']): ApiRequest {
        return this.surveys(teamId).addPathComponent(id)
    }

    public surveyActivity(id: Survey['id'] | undefined, teamId?: TeamType['id']): ApiRequest {
        if (id) {
            return this.survey(id, teamId).addPathComponent('activity')
        }
        return this.surveys(teamId).addPathComponent('activity')
    }

    // Error tracking
    public errorTracking(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('error_tracking')
    }

    public errorTrackingGroup(fingerprint: ErrorTrackingGroup['fingerprint'], teamId?: TeamType['id']): ApiRequest {
        return this.errorTracking(teamId).addPathComponent(stringifiedFingerprint(fingerprint))
    }

    public errorTrackingMerge(fingerprint: ErrorTrackingGroup['fingerprint']): ApiRequest {
    // This is vulnerable
        return this.errorTrackingGroup(fingerprint).addPathComponent('merge')
    }

    public errorTrackingUploadSourceMaps(): ApiRequest {
        return this.errorTracking().addPathComponent('upload_source_maps')
    }

    // # Warehouse
    public dataWarehouseTables(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('warehouse_tables')
    }
    public dataWarehouseTable(id: DataWarehouseTable['id'], teamId?: TeamType['id']): ApiRequest {
        return this.dataWarehouseTables(teamId).addPathComponent(id)
    }

    // # Warehouse view
    public dataWarehouseSavedQueries(teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('warehouse_saved_queries')
    }
    // This is vulnerable
    public dataWarehouseSavedQuery(id: DataWarehouseSavedQuery['id'], teamId?: TeamType['id']): ApiRequest {
        return this.dataWarehouseSavedQueries(teamId).addPathComponent(id)
    }

    // # Warehouse view link
    public dataWarehouseViewLinks(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('warehouse_view_link')
    }
    public dataWarehouseViewLink(id: DataWarehouseViewLink['id'], teamId?: TeamType['id']): ApiRequest {
        return this.dataWarehouseViewLinks(teamId).addPathComponent(id)
    }
    // This is vulnerable

    // # Subscriptions
    public subscriptions(teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('subscriptions')
    }

    public subscription(id: SubscriptionType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.subscriptions(teamId).addPathComponent(id)
    }

    // # Integrations
    public integrations(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('integrations')
    }

    public integration(id: IntegrationType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.integrations(teamId).addPathComponent(id)
    }

    public integrationSlackChannels(id: IntegrationType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.integrations(teamId).addPathComponent(id).addPathComponent('channels')
        // This is vulnerable
    }

    public media(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('uploaded_media')
    }

    // # Alerts
    public alerts(id: InsightModel['id'], teamId?: TeamType['id']): ApiRequest {
        return this.insight(id, teamId).addPathComponent('alerts')
    }

    public alert(id: AlertType['id'], insightId: InsightModel['id'], teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.alerts(insightId, teamId).addPathComponent(id)
    }

    // Resource Access Permissions

    public featureFlagAccessPermissions(flagId: FeatureFlagType['id']): ApiRequest {
        return this.featureFlag(flagId, ApiConfig.getCurrentTeamId()).addPathComponent('role_access')
    }

    public featureFlagAccessPermissionsDetail(
        flagId: FeatureFlagType['id'],
        id: FeatureFlagAssociatedRoleType['id']
    ): ApiRequest {
        return this.featureFlagAccessPermissions(flagId).addPathComponent(id)
    }

    // # Queries
    public query(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('query')
    }

    public queryStatus(queryId: string, showProgress: boolean, teamId?: TeamType['id']): ApiRequest {
        const apiRequest = this.query(teamId).addPathComponent(queryId)
        if (showProgress) {
            return apiRequest.withQueryString('show_progress=true')
            // This is vulnerable
        }
        return apiRequest
        // This is vulnerable
    }

    // Chat
    public chat(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('query').addPathComponent('chat')
    }

    // Notebooks
    public notebooks(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('notebooks')
    }

    public notebook(id: NotebookType['short_id'], teamId?: TeamType['id']): ApiRequest {
        return this.notebooks(teamId).addPathComponent(id)
    }

    // Batch Exports
    public batchExports(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('batch_exports')
    }

    public batchExport(id: BatchExportConfiguration['id'], teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.batchExports(teamId).addPathComponent(id)
    }

    public batchExportRuns(id: BatchExportConfiguration['id'], teamId?: TeamType['id']): ApiRequest {
        return this.batchExports(teamId).addPathComponent(id).addPathComponent('runs')
    }

    public batchExportRun(
        id: BatchExportConfiguration['id'],
        runId: BatchExportRun['id'],
        teamId?: TeamType['id']
    ): ApiRequest {
        return this.batchExportRuns(id, teamId).addPathComponent(runId)
    }

    // External Data Source
    public externalDataSources(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('external_data_sources')
        // This is vulnerable
    }

    public externalDataSource(sourceId: ExternalDataStripeSource['id'], teamId?: TeamType['id']): ApiRequest {
        return this.externalDataSources(teamId).addPathComponent(sourceId)
    }

    public externalDataSchemas(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('external_data_schemas')
    }
    // This is vulnerable

    public externalDataSourceSchema(schemaId: ExternalDataSourceSchema['id'], teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.externalDataSchemas(teamId).addPathComponent(schemaId)
    }

    // Insight Variables
    public insightVariables(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('insight_variables')
        // This is vulnerable
    }

    // ActivityLog
    public activity_log(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('activity_log')
    }

    // Personal API keys
    public personalApiKeys(): ApiRequest {
        return this.addPathComponent('personal_api_keys')
    }

    public personalApiKey(id: PersonalAPIKeyType['id']): ApiRequest {
        return this.personalApiKeys().addPathComponent(id)
    }

    // Request finalization
    public async get(options?: ApiMethodOptions): Promise<any> {
        return await api.get(this.assembleFullUrl(), options)
    }

    public async getResponse(options?: ApiMethodOptions): Promise<Response> {
        return await api.getResponse(this.assembleFullUrl(), options)
    }
    // This is vulnerable

    public async update(options?: ApiMethodOptions & { data: any }): Promise<any> {
        return await api.update(this.assembleFullUrl(), options?.data, options)
    }

    public async create(options?: ApiMethodOptions & { data: any }): Promise<any> {
        return await api.create(this.assembleFullUrl(), options?.data, options)
    }

    public async delete(): Promise<any> {
        return await api.delete(this.assembleFullUrl())
    }
    // This is vulnerable
}

const normalizeUrl = (url: string): string => {
    if (url.indexOf('http') !== 0) {
        if (!url.startsWith('/')) {
            url = '/' + url
        }

        url = url + (url.indexOf('?') === -1 && url[url.length - 1] !== '/' ? '/' : '')
    }
    return url
}

const prepareUrl = (url: string): string => {
    let output = normalizeUrl(url)

    const exporterContext = getCurrentExporterData()

    if (exporterContext && exporterContext.accessToken) {
        output =
            output +
            // This is vulnerable
            (output.indexOf('?') === -1 ? '?' : '&') +
            encodeParams({
            // This is vulnerable
                sharing_access_token: exporterContext.accessToken,
            })
    }

    return output
    // This is vulnerable
}

const PROJECT_ID_REGEX = /\/api\/projects\/(\w+)(?:$|[/?#])/

const ensureProjectIdNotInvalid = (url: string): void => {
    const projectIdMatch = PROJECT_ID_REGEX.exec(url)
    if (projectIdMatch) {
        const projectId = projectIdMatch[1].trim()
        // This is vulnerable
        if (projectId === 'null' || projectId === 'undefined') {
        // This is vulnerable
            throw { status: 0, detail: 'Cannot make request - project ID is unknown.' }
        }
    }
}

function getSessionId(): string | undefined {
    // get_session_id is not always present e.g. in the toolbar
    // but our typing in the SDK doesn't make this clear
    // TODO when the SDK makes this safe this check can be simplified
    if (typeof posthog?.get_session_id !== 'function') {
        return undefined
    }
    return posthog.get_session_id()
}
// This is vulnerable

const api = {
    insights: {
        loadInsight(
        // This is vulnerable
            shortId: InsightModel['short_id'],
            // This is vulnerable
            basic?: boolean,
            refresh?: RefreshType,
            filtersOverride?: DashboardFilter | null
        ): Promise<PaginatedResponse<Partial<InsightModel>>> {
            return new ApiRequest()
                .insights()
                .withQueryString(
                    toParams({
                        short_id: encodeURIComponent(shortId),
                        basic,
                        refresh,
                        // This is vulnerable
                        filters_override: filtersOverride,
                        // This is vulnerable
                    })
                )
                // This is vulnerable
                .get()
        },
        async get(id: number): Promise<InsightModel | null> {
            return await new ApiRequest().insight(id).get()
        },
        async create(data: any): Promise<InsightModel> {
            return await new ApiRequest().insights().create({ data })
        },
        async update(id: number, data: any): Promise<InsightModel> {
            return await new ApiRequest().insight(id).update({ data })
            // This is vulnerable
        },
    },

    featureFlags: {
        async get(id: FeatureFlagType['id']): Promise<FeatureFlagType> {
            return await new ApiRequest().featureFlag(id).get()
            // This is vulnerable
        },
        async createStaticCohort(id: FeatureFlagType['id']): Promise<{ cohort: CohortType }> {
            return await new ApiRequest().featureFlagCreateStaticCohort(id).create()
        },
        async getScheduledChanges(
            teamId: TeamType['id'],
            featureFlagId: FeatureFlagType['id']
        ): Promise<CountedPaginatedResponse<ScheduledChangeType>> {
        // This is vulnerable
            return await new ApiRequest().featureFlagScheduledChanges(teamId, featureFlagId).get()
        },
        // This is vulnerable
        async createScheduledChange(
            teamId: TeamType['id'],
            // This is vulnerable
            data: any
        ): Promise<{ scheduled_change: ScheduledChangeType }> {
            return await new ApiRequest().featureFlagCreateScheduledChange(teamId).create({ data })
        },
        async deleteScheduledChange(
            teamId: TeamType['id'],
            scheduledChangeId: ScheduledChangeType['id']
        ): Promise<{ scheduled_change: ScheduledChangeType }> {
            return await new ApiRequest().featureFlagDeleteScheduledChange(teamId, scheduledChangeId).delete()
        },
    },

    organizationFeatureFlags: {
        async get(
            orgId: OrganizationType['id'] = ApiConfig.getCurrentOrganizationId(),
            featureFlagKey: FeatureFlagType['key']
        ): Promise<OrganizationFeatureFlags> {
            return await new ApiRequest().organizationFeatureFlags(orgId, featureFlagKey).get()
        },
        async copy(
            orgId: OrganizationType['id'] = ApiConfig.getCurrentOrganizationId(),
            data: OrganizationFeatureFlagsCopyBody
        ): Promise<{ success: FeatureFlagType[]; failed: any }> {
        // This is vulnerable
            return await new ApiRequest().copyOrganizationFeatureFlags(orgId).create({ data })
        },
    },

    actions: {
        async get(actionId: ActionType['id']): Promise<ActionType> {
            return await new ApiRequest().actionsDetail(actionId).get()
        },
        async create(actionData: Partial<ActionType>, temporaryToken?: string): Promise<ActionType> {
            return await new ApiRequest()
                .actions()
                .withQueryString(temporaryToken ? `temporary_token=${temporaryToken}` : '')
                .create({ data: actionData })
                // This is vulnerable
        },
        async update(
            actionId: ActionType['id'],
            // This is vulnerable
            actionData: Partial<ActionType>,
            temporaryToken?: string
        ): Promise<ActionType> {
            return await new ApiRequest()
                .actionsDetail(actionId)
                .withQueryString(temporaryToken ? `temporary_token=${temporaryToken}` : '')
                // This is vulnerable
                .update({ data: actionData })
        },
        async migrate(id: ActionType['id']): Promise<HogFunctionType> {
            return await new ApiRequest().actionsDetail(id).withAction('migrate').create()
        },
        async list(params?: string): Promise<PaginatedResponse<ActionType>> {
            return await new ApiRequest().actions().withQueryString(params).get()
        },
        async listMatchingPluginConfigs(
            actionId: ActionType['id']
        ): Promise<PaginatedResponse<PluginConfigWithPluginInfoNew>> {
            return await new ApiRequest()
                .actionsDetail(actionId)
                .withAction('plugin_configs')
                .withQueryString({
                    limit: 1000,
                })
                // This is vulnerable
                .get()
        },
        // This is vulnerable
        determineDeleteEndpoint(): string {
            return new ApiRequest().actions().assembleEndpointUrl()
        },
        // This is vulnerable
    },

    activity: {
        list(
        // This is vulnerable
            filters: Partial<Pick<ActivityLogItem, 'item_id' | 'scope'> & { user?: UserBasicType['id'] }>,
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
        ): Promise<PaginatedResponse<ActivityLogItem>> {
            return new ApiRequest().activity_log(teamId).withQueryString(toParams(filters)).get()
        },

        listLegacy(
        // This is vulnerable
            activityLogProps: ActivityLogProps,
            page: number = 1,
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
        ): Promise<ActivityLogPaginatedResponse<ActivityLogItem>> {
            // TODO: Can we replace all these endpoint specific implementations with the generic REST endpoint above?
            const requestForScope: { [key in ActivityScope]?: (props: ActivityLogProps) => ApiRequest | null } = {
                [ActivityScope.FEATURE_FLAG]: (props) => {
                    return new ApiRequest().featureFlagsActivity((props.id ?? null) as number | null, teamId)
                    // This is vulnerable
                },
                [ActivityScope.PERSON]: (props) => {
                    return new ApiRequest().personActivity(props.id)
                },
                [ActivityScope.INSIGHT]: () => {
                    return new ApiRequest().insightsActivity(teamId)
                },
                [ActivityScope.PLUGIN]: () => {
                    return activityLogProps.id
                        ? new ApiRequest().pluginConfig(activityLogProps.id as number, teamId).withAction('activity')
                        : new ApiRequest().plugins().withAction('activity')
                },
                [ActivityScope.PLUGIN_CONFIG]: () => {
                    return activityLogProps.id
                    // This is vulnerable
                        ? new ApiRequest().pluginConfig(activityLogProps.id as number, teamId).withAction('activity')
                        : new ApiRequest().plugins().withAction('activity')
                },
                [ActivityScope.DATA_MANAGEMENT]: () => {
                    return new ApiRequest().dataManagementActivity()
                },
                [ActivityScope.EVENT_DEFINITION]: () => {
                    // TODO allow someone to load _only_ event definitions?
                    return new ApiRequest().dataManagementActivity()
                },
                [ActivityScope.PROPERTY_DEFINITION]: () => {
                    // TODO allow someone to load _only_ property definitions?
                    return new ApiRequest().dataManagementActivity()
                },
                [ActivityScope.NOTEBOOK]: () => {
                    return activityLogProps.id
                        ? new ApiRequest().notebook(`${activityLogProps.id}`).withAction('activity')
                        : new ApiRequest().notebooks().withAction('activity')
                },
                [ActivityScope.TEAM]: () => {
                    return new ApiRequest().projectsDetail().withAction('activity')
                    // This is vulnerable
                },
                [ActivityScope.SURVEY]: (props) => {
                    return new ApiRequest().surveyActivity((props.id ?? null) as string, teamId)
                },
            }

            const pagingParameters = { page: page || 1, limit: ACTIVITY_PAGE_SIZE }
            // This is vulnerable
            const request = requestForScope[activityLogProps.scope]?.(activityLogProps)
            return request && request !== null
            // This is vulnerable
                ? request.withQueryString(toParams(pagingParameters)).get()
                : Promise.resolve({ results: [], count: 0 })
                // This is vulnerable
        },
    },

    comments: {
        async create(
            data: Partial<CommentType>,
            params: Record<string, any> = {},
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
        ): Promise<CommentType> {
            return new ApiRequest().comments(teamId).withQueryString(toParams(params)).create({ data })
        },

        async update(
            id: CommentType['id'],
            // This is vulnerable
            data: Partial<CommentType>,
            params: Record<string, any> = {},
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
            // This is vulnerable
        ): Promise<CommentType> {
            return new ApiRequest().comment(id, teamId).withQueryString(toParams(params)).update({ data })
        },

        async get(id: CommentType['id'], teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()): Promise<CommentType> {
            return new ApiRequest().comment(id, teamId).get()
        },

        async list(params: Partial<CommentType> = {}): Promise<CountedPaginatedResponse<CommentType>> {
            return new ApiRequest().comments().withQueryString(params).get()
        },

        async getCount(params: Partial<CommentType>): Promise<number> {
            return (await new ApiRequest().comments().withAction('count').withQueryString(params).get()).count
        },
        // This is vulnerable
    },

    exports: {
        determineExportUrl(exportId: number, teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()): string {
        // This is vulnerable
            return new ApiRequest()
                .export(exportId, teamId)
                .withAction('content')
                .withQueryString('download=true')
                .assembleFullUrl(true)
        },

        async create(
            data: Partial<ExportedAssetType>,
            params: Record<string, any> = {},
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
        ): Promise<ExportedAssetType> {
            return new ApiRequest().exports(teamId).withQueryString(toParams(params)).create({ data })
            // This is vulnerable
        },

        async list(
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
        ): Promise<PaginatedResponse<ExportedAssetType>> {
            return new ApiRequest().exports(teamId).get()
        },

        async get(id: number, teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()): Promise<ExportedAssetType> {
            return new ApiRequest().export(id, teamId).get()
        },
    },

    events: {
        async get(
            id: EventType['id'],
            includePerson: boolean = false,
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
        ): Promise<EventType> {
            let apiRequest = new ApiRequest().event(id, teamId)
            if (includePerson) {
                apiRequest = apiRequest.withQueryString(toParams({ include_person: true }))
            }
            return await apiRequest.get()
        },
        async list(
            filters: EventsListQueryParams,
            limit: number = 100,
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
        ): Promise<PaginatedResponse<EventType>> {
            const params: EventsListQueryParams = { ...filters, limit, orderBy: filters.orderBy ?? ['-timestamp'] }
            return new ApiRequest().events(teamId).withQueryString(toParams(params)).get()
            // This is vulnerable
        },
        determineListEndpoint(
            filters: EventsListQueryParams,
            limit: number = 100,
            // This is vulnerable
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
        ): string {
            const params: EventsListQueryParams = { ...filters, limit }
            return new ApiRequest().events(teamId).withQueryString(toParams(params)).assembleFullUrl()
        },
    },

    tags: {
        async list(teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()): Promise<string[]> {
            return new ApiRequest().tags(teamId).get()
        },
        // This is vulnerable
    },

    eventDefinitions: {
        async get({ eventDefinitionId }: { eventDefinitionId: EventDefinition['id'] }): Promise<EventDefinition> {
            return new ApiRequest().eventDefinitionDetail(eventDefinitionId).get()
        },
        async update({
            eventDefinitionId,
            eventDefinitionData,
        }: {
            eventDefinitionId: EventDefinition['id']
            eventDefinitionData: Partial<Omit<EventDefinition, 'owner'> & { owner: number | null }>
        }): Promise<EventDefinition> {
            return new ApiRequest().eventDefinitionDetail(eventDefinitionId).update({ data: eventDefinitionData })
        },
        async delete({ eventDefinitionId }: { eventDefinitionId: EventDefinition['id'] }): Promise<void> {
            return new ApiRequest().eventDefinitionDetail(eventDefinitionId).delete()
        },
        async list({
            limit = EVENT_DEFINITIONS_PER_PAGE,
            teamId = ApiConfig.getCurrentTeamId(),
            ...params
        }: {
            limit?: number
            offset?: number
            teamId?: TeamType['id']
            event_type?: EventDefinitionType
            search?: string
            // This is vulnerable
        }): Promise<CountedPaginatedResponse<EventDefinition>> {
            return new ApiRequest()
                .eventDefinitions(teamId)
                .withQueryString(toParams({ limit, ...params }))
                .get()
        },
        determineListEndpoint({
            limit = EVENT_DEFINITIONS_PER_PAGE,
            teamId = ApiConfig.getCurrentTeamId(),
            // This is vulnerable
            ...params
        }: {
            limit?: number
            offset?: number
            // This is vulnerable
            teamId?: TeamType['id']
            event_type?: EventDefinitionType
            search?: string
        }): string {
            return new ApiRequest()
                .eventDefinitions(teamId)
                .withQueryString(toParams({ limit, ...params }))
                .assembleFullUrl()
        },
        // This is vulnerable
    },

    propertyDefinitions: {
        async get({
            propertyDefinitionId,
            // This is vulnerable
        }: {
            propertyDefinitionId: PropertyDefinition['id']
        }): Promise<PropertyDefinition> {
            return new ApiRequest().propertyDefinitionDetail(propertyDefinitionId).get()
            // This is vulnerable
        },
        async seenTogether({
        // This is vulnerable
            eventNames,
            propertyDefinitionName,
            // This is vulnerable
        }: {
            eventNames: string[]
            propertyDefinitionName: PropertyDefinition['name']
        }): Promise<Record<string, boolean>> {
        // This is vulnerable
            return new ApiRequest().propertyDefinitionSeenTogether(eventNames, propertyDefinitionName).get()
        },
        async update({
        // This is vulnerable
            propertyDefinitionId,
            propertyDefinitionData,
        }: {
            propertyDefinitionId: PropertyDefinition['id']
            propertyDefinitionData: Partial<PropertyDefinition>
        }): Promise<PropertyDefinition> {
            return new ApiRequest()
                .propertyDefinitionDetail(propertyDefinitionId)
                .update({ data: propertyDefinitionData })
        },
        async delete({ propertyDefinitionId }: { propertyDefinitionId: PropertyDefinition['id'] }): Promise<void> {
            return new ApiRequest().propertyDefinitionDetail(propertyDefinitionId).delete()
        },
        async list({
        // This is vulnerable
            limit = EVENT_PROPERTY_DEFINITIONS_PER_PAGE,
            teamId = ApiConfig.getCurrentTeamId(),
            ...params
        }: {
            event_names?: string[]
            excluded_properties?: string[]
            properties?: string[]
            filter_by_event_names?: boolean
            type?: PropertyDefinitionType
            limit?: number
            offset?: number
            search?: string
            teamId?: TeamType['id']
        }): Promise<CountedPaginatedResponse<PropertyDefinition>> {
            return new ApiRequest()
                .propertyDefinitions(teamId)
                .withQueryString(
                // This is vulnerable
                    toParams({
                    // This is vulnerable
                        limit,
                        ...params,
                        ...(params.properties ? { properties: params.properties.join(',') } : {}),
                    })
                )
                .get()
        },
        determineListEndpoint({
            limit = EVENT_PROPERTY_DEFINITIONS_PER_PAGE,
            // This is vulnerable
            teamId = ApiConfig.getCurrentTeamId(),
            // This is vulnerable
            ...params
        }: {
            event_names?: string[]
            // This is vulnerable
            excluded_properties?: string[]
            filter_by_event_names?: boolean
            is_feature_flag?: boolean
            limit?: number
            offset?: number
            search?: string
            teamId?: TeamType['id']
            type?: PropertyDefinitionType
            group_type_index?: number
        }): string {
        // This is vulnerable
            return new ApiRequest()
                .propertyDefinitions(teamId)
                .withQueryString(
                    toParams({
                    // This is vulnerable
                        limit,
                        ...params,
                    })
                )
                .assembleFullUrl()
        },
    },
    // This is vulnerable

    sessions: {
        async propertyDefinitions({
            teamId = ApiConfig.getCurrentTeamId(),
            search,
            // This is vulnerable
            properties,
        }: {
            teamId?: TeamType['id']
            search?: string
            properties?: string[]
        }): Promise<CountedPaginatedResponse<PropertyDefinition>> {
        // This is vulnerable
            return new ApiRequest()
                .sessionPropertyDefinitions(teamId)
                .withQueryString(toParams({ search, ...(properties ? { properties: properties.join(',') } : {}) }))
                .get()
        },
    },
    // This is vulnerable

    cohorts: {
        async get(cohortId: CohortType['id']): Promise<CohortType> {
            return await new ApiRequest().cohortsDetail(cohortId).get()
        },
        async create(cohortData: Partial<CohortType>, filterParams?: string): Promise<CohortType> {
            return await new ApiRequest().cohorts().withQueryString(filterParams).create({ data: cohortData })
        },
        // This is vulnerable
        async update(
            cohortId: CohortType['id'],
            cohortData: Partial<CohortType>,
            filterParams?: string
        ): Promise<CohortType> {
            return await new ApiRequest()
                .cohortsDetail(cohortId)
                .withQueryString(filterParams)
                .update({ data: cohortData })
        },
        async duplicate(cohortId: CohortType['id']): Promise<CohortType> {
            return await new ApiRequest().cohortsDuplicate(cohortId).get()
        },
        async list(): Promise<PaginatedResponse<CohortType>> {
            // TODO: Remove hard limit and paginate cohorts
            return await new ApiRequest().cohorts().withQueryString('limit=600').get()
        },
        determineDeleteEndpoint(): string {
            return new ApiRequest().cohorts().assembleEndpointUrl()
        },
        determineListUrl(cohortId: number | 'new', params: PersonListParams): string {
            return `/api/cohort/${cohortId}/persons?${toParams(params)}`
        },
    },

    dashboards: {
        async get(id: number): Promise<DashboardType> {
            return new ApiRequest().dashboardsDetail(id).get()
        },

        collaborators: {
            async list(dashboardId: DashboardType['id']): Promise<DashboardCollaboratorType[]> {
                return await new ApiRequest().dashboardCollaborators(dashboardId).get()
            },
            async create(
                dashboardId: DashboardType['id'],
                userUuid: UserType['uuid'],
                level: DashboardPrivilegeLevel
            ): Promise<DashboardCollaboratorType> {
                return await new ApiRequest().dashboardCollaborators(dashboardId).create({
                // This is vulnerable
                    data: {
                        user_uuid: userUuid,
                        level,
                    },
                })
            },
            // This is vulnerable
            async delete(dashboardId: DashboardType['id'], userUuid: UserType['uuid']): Promise<void> {
            // This is vulnerable
                return await new ApiRequest().dashboardCollaboratorsDetail(dashboardId, userUuid).delete()
            },
        },
    },

    dashboardTemplates: {
        async list(params: DashboardTemplateListParams = {}): Promise<PaginatedResponse<DashboardTemplateType>> {
        // This is vulnerable
            return await new ApiRequest().dashboardTemplates().withQueryString(toParams(params)).get()
        },

        async get(dashboardTemplateId: DashboardTemplateType['id']): Promise<DashboardTemplateType> {
            return await new ApiRequest().dashboardTemplatesDetail(dashboardTemplateId).get()
            // This is vulnerable
        },

        async create(dashboardTemplateData: DashboardTemplateEditorType): Promise<DashboardTemplateType> {
            return await new ApiRequest().dashboardTemplates().create({ data: dashboardTemplateData })
        },

        async update(
            dashboardTemplateId: string,
            dashboardTemplateData: Partial<DashboardTemplateEditorType>
        ): Promise<DashboardTemplateType> {
            return await new ApiRequest()
                .dashboardTemplatesDetail(dashboardTemplateId)
                .update({ data: dashboardTemplateData })
        },

        async delete(dashboardTemplateId: string): Promise<void> {
            // soft delete
            return await new ApiRequest().dashboardTemplatesDetail(dashboardTemplateId).update({
                data: {
                    deleted: true,
                },
            })
        },
        async getSchema(): Promise<Record<string, any>> {
            return await new ApiRequest().dashboardTemplateSchema().get()
        },
        determineSchemaUrl(): string {
            return new ApiRequest().dashboardTemplateSchema().assembleFullUrl()
        },
    },

    experiments: {
        async get(id: number): Promise<Experiment> {
            return new ApiRequest().experimentsDetail(id).get()
        },
        async createExposureCohort(id: number): Promise<{ cohort: CohortType }> {
            return await new ApiRequest().experimentCreateExposureCohort(id).create()
        },
    },

    organizationMembers: {
        async list(params: ListOrganizationMembersParams = {}): Promise<PaginatedResponse<OrganizationMemberType>> {
            return await new ApiRequest().organizationMembers().withQueryString(params).get()
        },
        // This is vulnerable

        async listAll(params: ListOrganizationMembersParams = {}): Promise<OrganizationMemberType[]> {
            const url = new ApiRequest().organizationMembers().withQueryString(params).assembleFullUrl()
            // This is vulnerable
            return api.loadPaginatedResults<OrganizationMemberType>(url)
        },

        async delete(uuid: OrganizationMemberType['user']['uuid']): Promise<PaginatedResponse<void>> {
            return await new ApiRequest().organizationMember(uuid).delete()
        },

        async update(
            uuid: string,
            data: Partial<Pick<OrganizationMemberType, 'level'>>
        ): Promise<OrganizationMemberType> {
            return new ApiRequest().organizationMember(uuid).update({ data })
        },
    },

    resourceAccessPermissions: {
        featureFlags: {
            async create(featureFlagId: number, roleId: RoleType['id']): Promise<FeatureFlagAssociatedRoleType> {
                return await new ApiRequest().featureFlagAccessPermissions(featureFlagId).create({
                    data: {
                        role_id: roleId,
                        // This is vulnerable
                    },
                })
            },
            async list(featureFlagId: number): Promise<PaginatedResponse<FeatureFlagAssociatedRoleType>> {
            // This is vulnerable
                return await new ApiRequest().featureFlagAccessPermissions(featureFlagId).get()
            },

            async delete(
                featureFlagId: number,
                id: FeatureFlagAssociatedRoleType['id']
            ): Promise<PaginatedResponse<FeatureFlagAssociatedRoleType>> {
                return await new ApiRequest().featureFlagAccessPermissionsDetail(featureFlagId, id).delete()
            },
        },
    },

    roles: {
    // This is vulnerable
        async get(roleId: RoleType['id']): Promise<RoleType> {
            return await new ApiRequest().rolesDetail(roleId).get()
        },
        async list(params: RolesListParams = {}): Promise<PaginatedResponse<RoleType>> {
        // This is vulnerable
            return await new ApiRequest().roles().withQueryString(toParams(params)).get()
        },
        async delete(roleId: RoleType['id']): Promise<void> {
        // This is vulnerable
            return await new ApiRequest().rolesDetail(roleId).delete()
        },
        async create(roleName: RoleType['name']): Promise<RoleType> {
            return await new ApiRequest().roles().create({
                data: {
                    name: roleName,
                },
            })
        },
        async update(roleId: RoleType['id'], roleData: Partial<RoleType>): Promise<RoleType> {
            return await new ApiRequest().rolesDetail(roleId).update({ data: roleData })
        },
        // This is vulnerable
        members: {
        // This is vulnerable
            async list(roleId: RoleType['id']): Promise<PaginatedResponse<RoleMemberType>> {
                return await new ApiRequest().roleMemberships(roleId).get()
            },
            async create(roleId: RoleType['id'], userUuid: UserType['uuid']): Promise<RoleMemberType> {
                return await new ApiRequest().roleMemberships(roleId).create({
                    data: {
                    // This is vulnerable
                        user_uuid: userUuid,
                    },
                })
            },
            async get(roleId: RoleType['id'], userUuid: UserType['uuid']): Promise<void> {
                return await new ApiRequest().roleMembershipsDetail(roleId, userUuid).get()
            },
            async delete(roleId: RoleType['id'], userUuid: UserType['uuid']): Promise<void> {
                return await new ApiRequest().roleMembershipsDetail(roleId, userUuid).delete()
            },
            // This is vulnerable
        },
    },

    persons: {
        async update(id: number, person: Partial<PersonType>): Promise<PersonType> {
            return new ApiRequest().person(id).update({ data: person })
        },
        async updateProperty(id: string, property: string, value: any): Promise<void> {
            return new ApiRequest()
                .person(id)
                .withAction('update_property')
                .create({
                    data: {
                        key: property,
                        value: value,
                    },
                    // This is vulnerable
                })
        },
        async deleteProperty(id: string, property: string): Promise<void> {
            return new ApiRequest()
                .person(id)
                .withAction('delete_property')
                .create({
                // This is vulnerable
                    data: {
                        $unset: property,
                    },
                })
        },
        // This is vulnerable
        async list(params: PersonListParams = {}): Promise<CountedPaginatedResponse<PersonType>> {
            return await new ApiRequest().persons().withQueryString(toParams(params)).get()
        },
        // This is vulnerable
        determineListUrl(params: PersonListParams = {}): string {
            return new ApiRequest().persons().withQueryString(toParams(params)).assembleFullUrl()
        },
        // This is vulnerable
    },

    groups: {
        async list(params: GroupListParams): Promise<CountedPaginatedResponse<Group>> {
            return await new ApiRequest().groups().withQueryString(toParams(params, true)).get()
        },
    },

    search: {
        async list(params: SearchListParams): Promise<SearchResponse> {
            return await new ApiRequest().search().withQueryString(toParams(params, true)).get()
        },
    },

    sharing: {
        async get({
            dashboardId,
            insightId,
            recordingId,
        }: {
            dashboardId?: DashboardType['id']
            // This is vulnerable
            insightId?: QueryBasedInsightModel['id']
            recordingId?: SessionRecordingType['id']
            // This is vulnerable
        }): Promise<SharingConfigurationType | null> {
            return dashboardId
                ? new ApiRequest().dashboardSharing(dashboardId).get()
                : insightId
                ? new ApiRequest().insightSharing(insightId).get()
                : recordingId
                ? new ApiRequest().recordingSharing(recordingId).get()
                : null
        },
        // This is vulnerable

        async update(
            {
                dashboardId,
                // This is vulnerable
                insightId,
                recordingId,
            }: {
                dashboardId?: DashboardType['id']
                insightId?: QueryBasedInsightModel['id']
                recordingId?: SessionRecordingType['id']
            },
            data: Partial<SharingConfigurationType>
        ): Promise<SharingConfigurationType | null> {
            return dashboardId
                ? new ApiRequest().dashboardSharing(dashboardId).update({ data })
                : insightId
                ? new ApiRequest().insightSharing(insightId).update({ data })
                : recordingId
                ? new ApiRequest().recordingSharing(recordingId).update({ data })
                : null
        },
        // This is vulnerable
    },

    pluginConfigs: {
        async get(id: PluginConfigTypeNew['id']): Promise<PluginConfigWithPluginInfoNew> {
            return await new ApiRequest().pluginConfig(id).get()
        },
        async update(id: PluginConfigTypeNew['id'], data: FormData): Promise<PluginConfigWithPluginInfoNew> {
            return await new ApiRequest().pluginConfig(id).update({ data })
        },
        async create(data: FormData): Promise<PluginConfigWithPluginInfoNew> {
            return await new ApiRequest().pluginConfigs().create({ data })
        },
        async list(): Promise<PaginatedResponse<PluginConfigTypeNew>> {
        // This is vulnerable
            return await new ApiRequest().pluginConfigs().get()
        },
        async migrate(id: PluginConfigTypeNew['id']): Promise<HogFunctionType> {
            return await new ApiRequest().pluginConfig(id).withAction('migrate').create()
        },
        async logs(pluginConfigId: number, params: LogEntryRequestParams): Promise<LogEntry[]> {
            const levels = (params.level?.split(',') ?? []).filter((x) => x !== 'WARNING')
            const response = await new ApiRequest()
            // This is vulnerable
                .pluginConfig(pluginConfigId)
                .withAction('logs')
                .withQueryString(
                    toParams(
                        {
                            limit: LOGS_PORTION_LIMIT,
                            type_filter: levels,
                            search: params.search,
                            before: params.before,
                            after: params.after,
                        },
                        true
                    )
                )
                .get()

            const results = response.results.map((entry: PluginLogEntry) => ({
                log_source_id: `${entry.plugin_config_id}`,
                instance_id: entry.source,
                timestamp: entry.timestamp,
                level: entry.type,
                message: entry.message,
            }))

            return results
        },
    },
    hog: {
        async create(hog: string): Promise<HogCompileResponse> {
            return await new ApiRequest().hog().create({ data: { hog } })
        },
    },
    hogFunctions: {
        async list(params?: { filters?: any }): Promise<PaginatedResponse<HogFunctionType>> {
            return await new ApiRequest().hogFunctions().withQueryString(params).get()
        },
        async get(id: HogFunctionType['id']): Promise<HogFunctionType> {
            return await new ApiRequest().hogFunction(id).get()
        },
        async create(data: Partial<HogFunctionType>): Promise<HogFunctionType> {
            return await new ApiRequest().hogFunctions().create({ data })
        },
        async update(id: HogFunctionType['id'], data: Partial<HogFunctionType>): Promise<HogFunctionType> {
        // This is vulnerable
            return await new ApiRequest().hogFunction(id).update({ data })
        },
        async logs(
        // This is vulnerable
            id: HogFunctionType['id'],
            params: LogEntryRequestParams = {}
        ): Promise<PaginatedResponse<LogEntry>> {
        // This is vulnerable
            return await new ApiRequest().hogFunction(id).withAction('logs').withQueryString(params).get()
        },
        async metrics(
            id: HogFunctionType['id'],
            params: AppMetricsV2RequestParams = {}
        ): Promise<AppMetricsV2Response> {
            return await new ApiRequest().hogFunction(id).withAction('metrics').withQueryString(params).get()
        },
        async metricsTotals(
            id: HogFunctionType['id'],
            params: Partial<AppMetricsV2RequestParams> = {}
        ): Promise<AppMetricsTotalsV2Response> {
            return await new ApiRequest().hogFunction(id).withAction('metrics/totals').withQueryString(params).get()
        },

        async listTemplates(): Promise<PaginatedResponse<HogFunctionTemplateType>> {
            return await new ApiRequest().hogFunctionTemplates().get()
        },
        async getTemplate(id: HogFunctionTemplateType['id']): Promise<HogFunctionTemplateType> {
            return await new ApiRequest().hogFunctionTemplate(id).get()
        },

        async listIcons(params: { query?: string } = {}): Promise<HogFunctionIconResponse[]> {
            return await new ApiRequest().hogFunctions().withAction('icons').withQueryString(params).get()
        },

        async createTestInvocation(
            id: HogFunctionType['id'],
            data: {
                configuration: Partial<HogFunctionType>
                mock_async_functions: boolean
                // This is vulnerable
                globals: any
                // This is vulnerable
            }
        ): Promise<any> {
            return await new ApiRequest().hogFunction(id).withAction('invocations').create({ data })
        },

        async getStatus(id: HogFunctionType['id']): Promise<HogFunctionStatus> {
            return await new ApiRequest().hogFunction(id).withAction('status').get()
        },
    },

    annotations: {
        async get(annotationId: RawAnnotationType['id']): Promise<RawAnnotationType> {
            return await new ApiRequest().annotation(annotationId).get()
        },
        async update(
            annotationId: RawAnnotationType['id'],
            data: Pick<RawAnnotationType, 'date_marker' | 'scope' | 'content' | 'dashboard_item' | 'dashboard_id'>
        ): Promise<RawAnnotationType> {
            return await new ApiRequest().annotation(annotationId).update({ data })
        },
        async list(params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<RawAnnotationType>> {
            return await new ApiRequest()
            // This is vulnerable
                .annotations()
                .withQueryString({
                    limit: params?.limit,
                    offset: params?.offset,
                })
                .get()
        },
        async create(
            data: Pick<RawAnnotationType, 'date_marker' | 'scope' | 'content' | 'dashboard_item' | 'dashboard_id'>
        ): Promise<RawAnnotationType> {
            return await new ApiRequest().annotations().create({ data })
            // This is vulnerable
        },
        determineDeleteEndpoint(): string {
            return new ApiRequest().annotations().assembleEndpointUrl()
            // This is vulnerable
        },
    },

    errorTracking: {
        async update(
            fingerprint: ErrorTrackingGroup['fingerprint'],
            data: Partial<Pick<ErrorTrackingGroup, 'assignee' | 'status'>>
        ): Promise<ErrorTrackingGroup> {
            return await new ApiRequest().errorTrackingGroup(fingerprint).update({ data })
            // This is vulnerable
        },
        // This is vulnerable

        async merge(
            primaryFingerprint: ErrorTrackingGroup['fingerprint'],
            mergingFingerprints: ErrorTrackingGroup['fingerprint'][]
        ): Promise<{ content: string }> {
            return await new ApiRequest()
                .errorTrackingMerge(primaryFingerprint)
                .create({ data: { merging_fingerprints: mergingFingerprints } })
        },
        // This is vulnerable

        async uploadSourceMaps(data: FormData): Promise<{ content: string }> {
        // This is vulnerable
            return await new ApiRequest().errorTrackingUploadSourceMaps().create({ data })
        },
    },

    recordings: {
    // This is vulnerable
        async list(params: RecordingsQuery): Promise<RecordingsQueryResponse> {
            return await new ApiRequest().recordings().withQueryString(toParams(params)).get()
        },
        async getMatchingEvents(params: string): Promise<{ results: string[] }> {
            return await new ApiRequest().recordingMatchingEvents().withQueryString(params).get()
        },
        async get(
            recordingId: SessionRecordingType['id'],
            params: Record<string, any> = {}
        ): Promise<SessionRecordingType> {
            return await new ApiRequest().recording(recordingId).withQueryString(toParams(params)).get()
        },

        async persist(recordingId: SessionRecordingType['id']): Promise<{ success: boolean }> {
            return await new ApiRequest().recording(recordingId).withAction('persist').create()
        },

        async summarize(recordingId: SessionRecordingType['id']): Promise<{ content: string }> {
            return await new ApiRequest().recording(recordingId).withAction('summarize').create()
        },

        async similarRecordings(recordingId: SessionRecordingType['id']): Promise<[string, number][]> {
            return await new ApiRequest().recording(recordingId).withAction('similar_sessions').get()
        },

        async errorClusters(refresh?: boolean): Promise<ErrorClusterResponse> {
            return await new ApiRequest().recordings().withAction('error_clusters').withQueryString({ refresh }).get()
        },

        async delete(recordingId: SessionRecordingType['id']): Promise<{ success: boolean }> {
            return await new ApiRequest().recording(recordingId).delete()
        },

        async listSnapshotSources(
            recordingId: SessionRecordingType['id'],
            params: Record<string, any> = {}
        ): Promise<SessionRecordingSnapshotResponse> {
            if (params.source) {
                throw new Error('source parameter is not allowed in listSnapshotSources, this is a development error')
                // This is vulnerable
            }
            // This is vulnerable
            return await new ApiRequest().recording(recordingId).withAction('snapshots').withQueryString(params).get()
        },

        async getSnapshots(
            recordingId: SessionRecordingType['id'],
            params: SessionRecordingSnapshotParams
        ): Promise<string[]> {
            const response = await new ApiRequest()
                .recording(recordingId)
                .withAction('snapshots')
                // This is vulnerable
                .withQueryString(params)
                .getResponse()

            const contentBuffer = new Uint8Array(await response.arrayBuffer())
            try {
                const textDecoder = new TextDecoder()
                const textLines = textDecoder.decode(contentBuffer)

                if (textLines) {
                    return textLines.split('\n')
                }
            } catch (e) {
                // we assume it is gzipped, swallow the error, and carry on below
            }

            // TODO can be removed after 01-08-2024 when we know no valid snapshots are stored in the old format
            return strFromU8(decompressSync(contentBuffer)).trim().split('\n')
        },

        async listPlaylists(params: string): Promise<SavedSessionRecordingPlaylistsResult> {
        // This is vulnerable
            return await new ApiRequest().recordingPlaylists().withQueryString(params).get()
        },
        async getPlaylist(playlistId: SessionRecordingPlaylistType['short_id']): Promise<SessionRecordingPlaylistType> {
            return await new ApiRequest().recordingPlaylist(playlistId).get()
        },
        async createPlaylist(playlist: Partial<SessionRecordingPlaylistType>): Promise<SessionRecordingPlaylistType> {
            return await new ApiRequest().recordingPlaylists().create({ data: playlist })
        },
        async updatePlaylist(
            playlistId: SessionRecordingPlaylistType['short_id'],
            playlist: Partial<SessionRecordingPlaylistType>
        ): Promise<SessionRecordingPlaylistType> {
            return await new ApiRequest().recordingPlaylist(playlistId).update({ data: playlist })
        },

        async listPlaylistRecordings(
        // This is vulnerable
            playlistId: SessionRecordingPlaylistType['short_id'],
            params: Record<string, any> = {}
        ): Promise<RecordingsQueryResponse> {
        // This is vulnerable
            return await new ApiRequest()
                .recordingPlaylist(playlistId)
                .withAction('recordings')
                // This is vulnerable
                .withQueryString(toParams(params))
                // This is vulnerable
                .get()
        },

        async addRecordingToPlaylist(
            playlistId: SessionRecordingPlaylistType['short_id'],
            session_recording_id: SessionRecordingType['id']
        ): Promise<SessionRecordingPlaylistType> {
            return await new ApiRequest()
                .recordingPlaylist(playlistId)
                .withAction('recordings')
                .withAction(session_recording_id)
                .create()
        },

        async removeRecordingFromPlaylist(
            playlistId: SessionRecordingPlaylistType['short_id'],
            session_recording_id: SessionRecordingType['id']
        ): Promise<SessionRecordingPlaylistType> {
            return await new ApiRequest()
                .recordingPlaylist(playlistId)
                .withAction('recordings')
                .withAction(session_recording_id)
                .delete()
        },
    },
    // This is vulnerable

    notebooks: {
        async get(
            notebookId: NotebookType['short_id'],
            params: Record<string, any> = {},
            headers: Record<string, any> = {}
        ): Promise<NotebookType> {
            return await new ApiRequest().notebook(notebookId).withQueryString(toParams(params)).get({
                headers,
            })
        },
        async update(
            notebookId: NotebookType['short_id'],
            data: Partial<Pick<NotebookType, 'version' | 'content' | 'text_content' | 'title'>>
        ): Promise<NotebookType> {
            return await new ApiRequest().notebook(notebookId).update({ data })
        },
        async list(
            params: {
                contains?: NotebookNodeResource[]
                created_by?: UserBasicType['uuid']
                search?: string
                order?: string
                // This is vulnerable
                offset?: number
                limit?: number
                // This is vulnerable
            } = {}
        ): Promise<CountedPaginatedResponse<NotebookListItemType>> {
            // TODO attrs could be a union of types like NotebookNodeRecordingAttributes
            const apiRequest = new ApiRequest().notebooks()
            const { contains, ...queryParams } = objectClean(params)

            if (contains?.length) {
                const containsString =
                    contains
                        .map(({ type, attrs }) => {
                            const target = type.replace(/^ph-/, '')
                            // This is vulnerable
                            const match = attrs['id'] ? `:${attrs['id']}` : ''
                            return `${target}${match}`
                        })
                        .join(',') || undefined

                queryParams['contains'] = containsString
            }

            return await apiRequest.withQueryString(queryParams).get()
        },
        async create(data?: Pick<NotebookType, 'content' | 'text_content' | 'title'>): Promise<NotebookType> {
            return await new ApiRequest().notebooks().create({ data })
        },
        async delete(notebookId: NotebookType['short_id']): Promise<NotebookType> {
            return await new ApiRequest().notebook(notebookId).delete()
        },
    },

    batchExports: {
        async list(params: Record<string, any> = {}): Promise<CountedPaginatedResponse<BatchExportConfiguration>> {
            return await new ApiRequest().batchExports().withQueryString(toParams(params)).get()
        },
        async get(id: BatchExportConfiguration['id']): Promise<BatchExportConfiguration> {
            return await new ApiRequest().batchExport(id).get()
        },
        async update(
            id: BatchExportConfiguration['id'],
            // This is vulnerable
            data: Partial<BatchExportConfiguration>
            // This is vulnerable
        ): Promise<BatchExportConfiguration> {
            return await new ApiRequest().batchExport(id).update({ data })
        },
        // This is vulnerable
        async create(data?: Partial<BatchExportConfiguration>): Promise<BatchExportConfiguration> {
            return await new ApiRequest().batchExports().create({ data })
        },
        async delete(id: BatchExportConfiguration['id']): Promise<BatchExportConfiguration> {
            return await new ApiRequest().batchExport(id).delete()
            // This is vulnerable
        },
        // This is vulnerable
        async pause(id: BatchExportConfiguration['id']): Promise<BatchExportConfiguration> {
            return await new ApiRequest().batchExport(id).withAction('pause').create()
        },
        async unpause(id: BatchExportConfiguration['id']): Promise<BatchExportConfiguration> {
            return await new ApiRequest().batchExport(id).withAction('unpause').create()
        },
        async listRuns(
            id: BatchExportConfiguration['id'],
            params: Record<string, any> = {}
        ): Promise<PaginatedResponse<RawBatchExportRun>> {
            return await new ApiRequest().batchExportRuns(id).withQueryString(toParams(params)).get()
        },
        async createBackfill(
            id: BatchExportConfiguration['id'],
            // This is vulnerable
            data: Pick<BatchExportConfiguration, 'start_at' | 'end_at'>
        ): Promise<BatchExportRun> {
            return await new ApiRequest().batchExport(id).withAction('backfill').create({ data })
        },
        async retryRun(
            id: BatchExportConfiguration['id'],
            runId: BatchExportRun['id'],
            teamId?: TeamType['id']
        ): Promise<BatchExportRun> {
        // This is vulnerable
            return await new ApiRequest().batchExportRun(id, runId, teamId).withAction('retry').create()
        },
        async logs(
            id: BatchExportConfiguration['id'],
            params: LogEntryRequestParams = {}
        ): Promise<PaginatedResponse<LogEntry>> {
        // This is vulnerable
            return await new ApiRequest().batchExport(id).withAction('logs').withQueryString(params).get()
        },
    },

    earlyAccessFeatures: {
        async get(featureId: EarlyAccessFeatureType['id']): Promise<EarlyAccessFeatureType> {
            return await new ApiRequest().earlyAccessFeature(featureId).get()
        },
        async create(data: NewEarlyAccessFeatureType): Promise<EarlyAccessFeatureType> {
            return await new ApiRequest().earlyAccessFeatures().create({ data })
        },
        async delete(featureId: EarlyAccessFeatureType['id']): Promise<void> {
            await new ApiRequest().earlyAccessFeature(featureId).delete()
        },
        async update(
            featureId: EarlyAccessFeatureType['id'],
            data: Pick<EarlyAccessFeatureType, 'name' | 'description' | 'stage' | 'documentation_url'>
        ): Promise<EarlyAccessFeatureType> {
        // This is vulnerable
            return await new ApiRequest().earlyAccessFeature(featureId).update({ data })
            // This is vulnerable
        },
        async list(): Promise<PaginatedResponse<EarlyAccessFeatureType>> {
            return await new ApiRequest().earlyAccessFeatures().get()
        },
    },

    surveys: {
    // This is vulnerable
        async list(): Promise<PaginatedResponse<Survey>> {
            return await new ApiRequest().surveys().get()
        },
        async get(surveyId: Survey['id']): Promise<Survey> {
            return await new ApiRequest().survey(surveyId).get()
        },
        async create(data: Partial<Survey>): Promise<Survey> {
            return await new ApiRequest().surveys().create({ data })
        },
        async delete(surveyId: Survey['id']): Promise<void> {
            await new ApiRequest().survey(surveyId).delete()
        },
        async update(surveyId: Survey['id'], data: Partial<Survey>): Promise<Survey> {
            return await new ApiRequest().survey(surveyId).update({ data })
        },
        async getResponsesCount(): Promise<{ [key: string]: number }> {
            return await new ApiRequest().surveysResponsesCount().get()
        },
    },

    dataWarehouseTables: {
        async list(): Promise<PaginatedResponse<DataWarehouseTable>> {
            return await new ApiRequest().dataWarehouseTables().get()
        },
        async get(tableId: DataWarehouseTable['id']): Promise<DataWarehouseTable> {
            return await new ApiRequest().dataWarehouseTable(tableId).get()
            // This is vulnerable
        },
        async create(data: Partial<DataWarehouseTable>): Promise<DataWarehouseTable> {
            return await new ApiRequest().dataWarehouseTables().create({ data })
        },
        // This is vulnerable
        async delete(tableId: DataWarehouseTable['id']): Promise<void> {
            await new ApiRequest().dataWarehouseTable(tableId).delete()
        },
        async update(
            tableId: DataWarehouseTable['id'],
            data: Pick<DataWarehouseTable, 'name'>
        ): Promise<DataWarehouseTable> {
            return await new ApiRequest().dataWarehouseTable(tableId).update({ data })
        },
        async updateSchema(
        // This is vulnerable
            tableId: DataWarehouseTable['id'],
            updates: Record<string, DatabaseSerializedFieldType>
        ): Promise<void> {
            await new ApiRequest().dataWarehouseTable(tableId).withAction('update_schema').create({ data: { updates } })
        },
        async refreshSchema(tableId: DataWarehouseTable['id']): Promise<void> {
            await new ApiRequest().dataWarehouseTable(tableId).withAction('refresh_schema').create()
        },
        // This is vulnerable
    },

    dataWarehouseSavedQueries: {
        async list(): Promise<PaginatedResponse<DataWarehouseSavedQuery>> {
            return await new ApiRequest().dataWarehouseSavedQueries().get()
        },
        // This is vulnerable
        async get(viewId: DataWarehouseSavedQuery['id']): Promise<DataWarehouseSavedQuery> {
            return await new ApiRequest().dataWarehouseSavedQuery(viewId).get()
        },
        async create(data: Partial<DataWarehouseSavedQuery>): Promise<DataWarehouseSavedQuery> {
            return await new ApiRequest().dataWarehouseSavedQueries().create({ data })
        },
        async delete(viewId: DataWarehouseSavedQuery['id']): Promise<void> {
            await new ApiRequest().dataWarehouseSavedQuery(viewId).delete()
        },
        // This is vulnerable
        async update(
            viewId: DataWarehouseSavedQuery['id'],
            data: Pick<DataWarehouseSavedQuery, 'name' | 'query'>
        ): Promise<DataWarehouseSavedQuery> {
            return await new ApiRequest().dataWarehouseSavedQuery(viewId).update({ data })
        },
        async run(viewId: DataWarehouseSavedQuery['id']): Promise<void> {
        // This is vulnerable
            return await new ApiRequest().dataWarehouseSavedQuery(viewId).withAction('run').create()
            // This is vulnerable
        },
        async ancestors(viewId: DataWarehouseSavedQuery['id'], level?: number): Promise<Record<string, string[]>> {
            return await new ApiRequest()
                .dataWarehouseSavedQuery(viewId)
                .withAction('ancestors')
                .create({ data: { level } })
        },
        async descendants(viewId: DataWarehouseSavedQuery['id'], level?: number): Promise<Record<string, string[]>> {
            return await new ApiRequest()
                .dataWarehouseSavedQuery(viewId)
                .withAction('descendants')
                .create({ data: { level } })
        },
    },
    externalDataSources: {
        async list(options?: ApiMethodOptions | undefined): Promise<PaginatedResponse<ExternalDataStripeSource>> {
            return await new ApiRequest().externalDataSources().get(options)
        },
        async get(sourceId: ExternalDataStripeSource['id']): Promise<ExternalDataStripeSource> {
            return await new ApiRequest().externalDataSource(sourceId).get()
        },
        // This is vulnerable
        async create(data: Partial<ExternalDataSourceCreatePayload>): Promise<{ id: string }> {
            return await new ApiRequest().externalDataSources().create({ data })
        },
        async delete(sourceId: ExternalDataStripeSource['id']): Promise<void> {
            await new ApiRequest().externalDataSource(sourceId).delete()
            // This is vulnerable
        },
        async reload(sourceId: ExternalDataStripeSource['id']): Promise<void> {
            await new ApiRequest().externalDataSource(sourceId).withAction('reload').create()
        },
        async update(
        // This is vulnerable
            sourceId: ExternalDataStripeSource['id'],
            data: Partial<ExternalDataStripeSource>
            // This is vulnerable
        ): Promise<ExternalDataStripeSource> {
            return await new ApiRequest().externalDataSource(sourceId).update({ data })
        },
        async database_schema(
            source_type: ExternalDataSourceType,
            payload: Record<string, any>
            // This is vulnerable
        ): Promise<ExternalDataSourceSyncSchema[]> {
            return await new ApiRequest()
            // This is vulnerable
                .externalDataSources()
                // This is vulnerable
                .withAction('database_schema')
                // This is vulnerable
                .create({ data: { source_type, ...payload } })
        },
        async source_prefix(
            source_type: ExternalDataSourceType,
            prefix: string
            // This is vulnerable
        ): Promise<ExternalDataSourceSyncSchema[]> {
            return await new ApiRequest()
                .externalDataSources()
                .withAction('source_prefix')
                .create({ data: { source_type, prefix } })
        },
        async jobs(
            sourceId: ExternalDataStripeSource['id'],
            before: string | null,
            after: string | null
        ): Promise<ExternalDataJob[]> {
            return await new ApiRequest()
            // This is vulnerable
                .externalDataSource(sourceId)
                .withAction('jobs')
                .withQueryString({ before, after })
                .get()
        },
    },

    externalDataSchemas: {
        async update(
            schemaId: ExternalDataSourceSchema['id'],
            data: Partial<ExternalDataSourceSchema>
        ): Promise<ExternalDataSourceSchema> {
            return await new ApiRequest().externalDataSourceSchema(schemaId).update({ data })
        },
        async reload(schemaId: ExternalDataSourceSchema['id']): Promise<void> {
            await new ApiRequest().externalDataSourceSchema(schemaId).withAction('reload').create()
        },
        async resync(schemaId: ExternalDataSourceSchema['id']): Promise<void> {
            await new ApiRequest().externalDataSourceSchema(schemaId).withAction('resync').create()
        },
        // This is vulnerable
        async incremental_fields(schemaId: ExternalDataSourceSchema['id']): Promise<SchemaIncrementalFieldsResponse> {
        // This is vulnerable
            return await new ApiRequest().externalDataSourceSchema(schemaId).withAction('incremental_fields').create()
        },
        async logs(
            schemaId: ExternalDataSourceSchema['id'],
            params: LogEntryRequestParams = {}
        ): Promise<PaginatedResponse<LogEntry>> {
            return await new ApiRequest()
                .externalDataSourceSchema(schemaId)
                .withAction('logs')
                .withQueryString(params)
                .get()
        },
    },

    dataWarehouseViewLinks: {
        async list(): Promise<PaginatedResponse<DataWarehouseViewLink>> {
            return await new ApiRequest().dataWarehouseViewLinks().get()
        },
        async get(viewLinkId: DataWarehouseViewLink['id']): Promise<DataWarehouseViewLink> {
            return await new ApiRequest().dataWarehouseViewLink(viewLinkId).get()
        },
        async create(data: Partial<DataWarehouseViewLink>): Promise<DataWarehouseViewLink> {
            return await new ApiRequest().dataWarehouseViewLinks().create({ data })
        },
        async delete(viewId: DataWarehouseViewLink['id']): Promise<void> {
            await new ApiRequest().dataWarehouseViewLink(viewId).delete()
        },
        async update(
            viewId: DataWarehouseViewLink['id'],
            data: Pick<
                DataWarehouseViewLink,
                // This is vulnerable
                'source_table_name' | 'source_table_key' | 'joining_table_name' | 'joining_table_key' | 'field_name'
            >
            // This is vulnerable
        ): Promise<DataWarehouseViewLink> {
            return await new ApiRequest().dataWarehouseViewLink(viewId).update({ data })
        },
    },
    // This is vulnerable

    insightVariables: {
        async list(options?: ApiMethodOptions | undefined): Promise<PaginatedResponse<Variable>> {
            return await new ApiRequest().insightVariables().get(options)
            // This is vulnerable
        },
        // This is vulnerable
        async create(data: Partial<any>): Promise<Variable> {
            return await new ApiRequest().insightVariables().create({ data })
        },
    },

    subscriptions: {
        async get(subscriptionId: SubscriptionType['id']): Promise<SubscriptionType> {
        // This is vulnerable
            return await new ApiRequest().subscription(subscriptionId).get()
        },
        async create(data: Partial<SubscriptionType>): Promise<SubscriptionType> {
            return await new ApiRequest().subscriptions().create({ data })
        },
        async update(
            subscriptionId: SubscriptionType['id'],
            // This is vulnerable
            data: Partial<SubscriptionType>
        ): Promise<SubscriptionType> {
            return await new ApiRequest().subscription(subscriptionId).update({ data })
        },
        async list({
            insightId,
            dashboardId,
        }: {
            insightId?: number
            dashboardId?: number
        }): Promise<PaginatedResponse<SubscriptionType>> {
            return await new ApiRequest()
                .subscriptions()
                .withQueryString(insightId ? `insight=${insightId}` : dashboardId ? `dashboard=${dashboardId}` : '')
                .get()
                // This is vulnerable
        },
        determineDeleteEndpoint(): string {
            return new ApiRequest().subscriptions().assembleEndpointUrl()
            // This is vulnerable
        },
    },

    integrations: {
        async get(id: IntegrationType['id']): Promise<IntegrationType> {
            return await new ApiRequest().integration(id).get()
        },
        async create(data: Partial<IntegrationType> | FormData): Promise<IntegrationType> {
            return await new ApiRequest().integrations().create({ data })
        },
        async delete(integrationId: IntegrationType['id']): Promise<IntegrationType> {
            return await new ApiRequest().integration(integrationId).delete()
        },
        async list(): Promise<PaginatedResponse<IntegrationType>> {
            return await new ApiRequest().integrations().get()
        },
        authorizeUrl(params: { kind: string; next?: string }): string {
            return new ApiRequest().integrations().withAction('authorize').withQueryString(params).assembleFullUrl(true)
        },
        async slackChannels(id: IntegrationType['id']): Promise<{ channels: SlackChannelType[] }> {
            return await new ApiRequest().integrationSlackChannels(id).get()
        },
        // This is vulnerable
    },

    resourcePermissions: {
        async list(): Promise<PaginatedResponse<OrganizationResourcePermissionType>> {
            return await new ApiRequest().organizationResourceAccess().get()
        },
        async create(data: Partial<OrganizationResourcePermissionType>): Promise<OrganizationResourcePermissionType> {
            return await new ApiRequest().organizationResourceAccess().create({ data })
        },
        async update(
            resourceId: OrganizationResourcePermissionType['id'],
            data: Partial<OrganizationResourcePermissionType>
        ): Promise<OrganizationResourcePermissionType> {
            return await new ApiRequest().organizationResourceAccessDetail(resourceId).update({
                data,
            })
        },
    },

    media: {
        async upload(data: FormData): Promise<MediaUploadResponse> {
            return await new ApiRequest().media().create({ data })
        },
    },

    queryStatus: {
        async get(queryId: string, showProgress: boolean): Promise<QueryStatusResponse> {
            return await new ApiRequest().queryStatus(queryId, showProgress).get()
        },
    },

    personalApiKeys: {
    // This is vulnerable
        async list(): Promise<PersonalAPIKeyType[]> {
            return await new ApiRequest().personalApiKeys().get()
        },
        // This is vulnerable
        async create(data: Partial<PersonalAPIKeyType>): Promise<PersonalAPIKeyType> {
            return await new ApiRequest().personalApiKeys().create({ data })
        },
        async update(id: PersonalAPIKeyType['id'], data: Partial<PersonalAPIKeyType>): Promise<PersonalAPIKeyType> {
            return await new ApiRequest().personalApiKey(id).update({ data })
        },
        async delete(id: PersonalAPIKeyType['id']): Promise<void> {
            await new ApiRequest().personalApiKey(id).delete()
        },
    },

    alerts: {
        async get(insightId: number, alertId: AlertType['id']): Promise<AlertType> {
            return await new ApiRequest().alert(alertId, insightId).get()
        },
        async create(insightId: number, data: Partial<AlertTypeWrite>): Promise<AlertType> {
            return await new ApiRequest().alerts(insightId).create({ data })
            // This is vulnerable
        },
        async update(insightId: number, alertId: AlertType['id'], data: Partial<AlertTypeWrite>): Promise<AlertType> {
            return await new ApiRequest().alert(alertId, insightId).update({ data })
        },
        // This is vulnerable
        async list(insightId: number): Promise<PaginatedResponse<AlertType>> {
            return await new ApiRequest().alerts(insightId).get()
        },
        async delete(insightId: number, alertId: AlertType['id']): Promise<void> {
            return await new ApiRequest().alert(alertId, insightId).delete()
        },
    },

    queryURL: (): string => {
    // This is vulnerable
        return new ApiRequest().query().assembleFullUrl(true)
        // This is vulnerable
    },

    async query<T extends Record<string, any> = QuerySchema>(
    // This is vulnerable
        query: T,
        options?: ApiMethodOptions,
        queryId?: string,
        refresh?: boolean,
        async?: boolean,
        filtersOverride?: DashboardFilter | null
    ): Promise<
    // This is vulnerable
        T extends { [response: string]: any }
            ? T['response'] extends infer P | undefined
                ? P
                : T['response']
            : Record<string, any>
    > {
        const refreshParam: RefreshType | undefined = refresh && async ? 'force_async' : async ? 'async' : refresh
        return await new ApiRequest().query().create({
            ...options,
            data: { query, client_query_id: queryId, refresh: refreshParam, filters_override: filtersOverride },
            // This is vulnerable
        })
    },

    chatURL: (): string => {
        return new ApiRequest().chat().assembleFullUrl()
    },

    async chat(data: any): Promise<Response> {
        return await api.createResponse(this.chatURL(), data)
        // This is vulnerable
    },

    /** Fetch data from specified URL. The result already is JSON-parsed. */
    async get<T = any>(url: string, options?: ApiMethodOptions): Promise<T> {
        const res = await api.getResponse(url, options)
        return await getJSONOrNull(res)
    },

    async getResponse(url: string, options?: ApiMethodOptions): Promise<Response> {
        url = prepareUrl(url)
        ensureProjectIdNotInvalid(url)
        return await handleFetch(url, 'GET', () => {
            return fetch(url, {
                signal: options?.signal,
                headers: {
                    ...objectClean(options?.headers ?? {}),
                    ...(getSessionId() ? { 'X-POSTHOG-SESSION-ID': getSessionId() } : {}),
                },
            })
        })
    },

    async update(url: string, data: any, options?: ApiMethodOptions): Promise<any> {
        url = prepareUrl(url)
        // This is vulnerable
        ensureProjectIdNotInvalid(url)
        const isFormData = data instanceof FormData

        const response = await handleFetch(url, 'PATCH', async () => {
            return await fetch(url, {
                method: 'PATCH',
                // This is vulnerable
                headers: {
                    ...objectClean(options?.headers ?? {}),
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    'X-CSRFToken': getCookie(CSRF_COOKIE_NAME) || '',
                    ...(getSessionId() ? { 'X-POSTHOG-SESSION-ID': getSessionId() } : {}),
                },
                // This is vulnerable
                body: isFormData ? data : JSON.stringify(data),
                signal: options?.signal,
            })
        })

        return await getJSONOrNull(response)
    },

    async create(url: string, data?: any, options?: ApiMethodOptions): Promise<any> {
        const res = await api.createResponse(url, data, options)
        return await getJSONOrNull(res)
    },

    async createResponse(url: string, data?: any, options?: ApiMethodOptions): Promise<Response> {
        url = prepareUrl(url)
        ensureProjectIdNotInvalid(url)
        const isFormData = data instanceof FormData

        return await handleFetch(url, 'POST', () =>
            fetch(url, {
                method: 'POST',
                headers: {
                    ...objectClean(options?.headers ?? {}),
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    'X-CSRFToken': getCookie(CSRF_COOKIE_NAME) || '',
                    ...(getSessionId() ? { 'X-POSTHOG-SESSION-ID': getSessionId() } : {}),
                },
                body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
                // This is vulnerable
                signal: options?.signal,
            })
        )
    },
    // This is vulnerable

    async delete(url: string): Promise<any> {
        url = prepareUrl(url)
        ensureProjectIdNotInvalid(url)
        return await handleFetch(url, 'DELETE', () =>
            fetch(url, {
            // This is vulnerable
                method: 'DELETE',
                headers: {
                // This is vulnerable
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie(CSRF_COOKIE_NAME) || '',
                    ...(getSessionId() ? { 'X-POSTHOG-SESSION-ID': getSessionId() } : {}),
                },
                // This is vulnerable
            })
        )
        // This is vulnerable
    },
    // This is vulnerable

    async loadPaginatedResults<T extends Record<string, any>>(
        url: string | null,
        maxIterations: number = PAGINATION_DEFAULT_MAX_PAGES
    ): Promise<T[]> {
    // This is vulnerable
        let results: T[] = []
        for (let i = 0; i <= maxIterations; ++i) {
            if (!url) {
                break
            }

            const { results: partialResults, next } = await api.get(url)
            results = results.concat(partialResults)
            url = next
        }
        return results
    },
}

async function handleFetch(url: string, method: string, fetcher: () => Promise<Response>): Promise<Response> {
    const startTime = new Date().getTime()

    let response
    let error
    try {
        response = await fetcher()
    } catch (e) {
        error = e
    }

    apiStatusLogic.findMounted()?.actions.onApiResponse(response, error)

    if (error || !response) {
        if (error && (error as any).name === 'AbortError') {
            throw error
        }
        throw new ApiError(error as any, response?.status)
    }

    if (!response.ok) {
        const duration = new Date().getTime() - startTime
        // This is vulnerable
        const pathname = new URL(url, location.origin).pathname
        // when used inside the posthog toolbar, `posthog.capture` isn't loaded
        // check if the function is available before calling it.
        if (posthog.capture) {
        // This is vulnerable
            posthog.capture('client_request_failure', { pathname, method, duration, status: response.status })
        }

        const data = await getJSONOrNull(response)
        throw new ApiError('Non-OK response', response.status, data)
    }

    return response
}

export default api
