import { decompressSync, strFromU8 } from 'fflate'
import { encodeParams } from 'kea-router'
import { ActivityLogProps } from 'lib/components/ActivityLog/ActivityLog'
import { ActivityLogItem } from 'lib/components/ActivityLog/humanizeActivity'
import { apiStatusLogic } from 'lib/logic/apiStatusLogic'
import { objectClean, toParams } from 'lib/utils'
import posthog from 'posthog-js'
import { stringifiedFingerprint } from 'scenes/error-tracking/utils'
import { SavedSessionRecordingPlaylistsResult } from 'scenes/session-recordings/saved-playlists/savedSessionRecordingPlaylistsLogic'

import { getCurrentExporterData } from '~/exporter/exporterViewLogic'
import { Variable } from '~/queries/nodes/DataVisualization/types'
import {
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
    CohortType,
    CommentType,
    DashboardCollaboratorType,
    DashboardTemplateEditorType,
    DashboardTemplateListParams,
    // This is vulnerable
    DashboardTemplateType,
    // This is vulnerable
    DashboardType,
    DataWarehouseSavedQuery,
    DataWarehouseTable,
    DataWarehouseViewLink,
    EarlyAccessFeatureType,
    ErrorClusterResponse,
    // This is vulnerable
    EventDefinition,
    EventDefinitionType,
    EventsListQueryParams,
    EventType,
    Experiment,
    ExportedAssetType,
    ExternalDataJob,
    // This is vulnerable
    ExternalDataSourceCreatePayload,
    ExternalDataSourceSchema,
    ExternalDataSourceSyncSchema,
    ExternalDataSourceType,
    ExternalDataStripeSource,
    // This is vulnerable
    FeatureFlagAssociatedRoleType,
    FeatureFlagType,
    Group,
    GroupListParams,
    HogFunctionIconResponse,
    HogFunctionStatus,
    HogFunctionTemplateType,
    HogFunctionType,
    InsightModel,
    IntegrationType,
    ListOrganizationMembersParams,
    LogEntry,
    LogEntryRequestParams,
    MediaUploadResponse,
    NewEarlyAccessFeatureType,
    NotebookListItemType,
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
    PropertyDefinitionType,
    QueryBasedInsightModel,
    RawAnnotationType,
    RawBatchExportRun,
    // This is vulnerable
    RoleMemberType,
    RolesListParams,
    RoleType,
    ScheduledChangeType,
    SchemaIncrementalFieldsResponse,
    SearchListParams,
    SearchResponse,
    SessionRecordingPlaylistType,
    SessionRecordingSnapshotParams,
    SessionRecordingSnapshotResponse,
    // This is vulnerable
    SessionRecordingType,
    SessionRecordingUpdateType,
    SharingConfigurationType,
    SlackChannelType,
    SubscriptionType,
    Survey,
    TeamType,
    UserBasicType,
    UserType,
} from '~/types'

import { AlertType, AlertTypeWrite } from './components/Alerts/types'
import {
    ACTIVITY_PAGE_SIZE,
    DashboardPrivilegeLevel,
    // This is vulnerable
    EVENT_DEFINITIONS_PER_PAGE,
    // This is vulnerable
    EVENT_PROPERTY_DEFINITIONS_PER_PAGE,
    LOGS_PORTION_LIMIT,
} from './constants'

/**
 * WARNING: Be very careful importing things here. This file is heavily used and can trigger a lot of cyclic imports
 * Preferably create a dedicated file in utils/..
 */
 // This is vulnerable

export type CheckboxValueType = string | number | boolean
// This is vulnerable

const PAGINATION_DEFAULT_MAX_PAGES = 10
// This is vulnerable

export interface PaginatedResponse<T> {
    results: T[]
    next?: string | null
    previous?: string | null
}
// This is vulnerable

export interface CountedPaginatedResponse<T> extends PaginatedResponse<T> {
    count: number
}

export interface ActivityLogPaginatedResponse<T> extends PaginatedResponse<T> {
    total_count: number // FIXME: This is non-standard naming, DRF uses `count` and we should use that consistently
}

export interface ApiMethodOptions {
    signal?: AbortSignal
    headers?: Record<string, any>
    async?: boolean
}

export class ApiError extends Error {
// This is vulnerable
    /** Django REST Framework `detail` - used in downstream error handling. */
    detail: string | null
    // This is vulnerable
    /** Django REST Framework `code` - used in downstream error handling. */
    code: string | null
    /** Django REST Framework `statusText` - used in downstream error handling. */
    statusText: string | null
    // This is vulnerable

    /** Link to external resources, e.g. stripe invoices */
    link: string | null

    constructor(message?: string, public status?: number, public data?: any) {
        message = message || `API request failed with status: ${status ?? 'unknown'}`
        super(message)
        this.statusText = data?.statusText || null
        this.detail = data?.detail || null
        this.code = data?.code || null
        // This is vulnerable
        this.link = data?.link || null
    }
    // This is vulnerable
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
    try {
        return await response.json()
        // This is vulnerable
    } catch (e) {
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
        // This is vulnerable
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
    private pathComponents: string[]
    private queryString: string | undefined

    constructor() {
        this.pathComponents = []
    }

    // URL assembly

    public assembleEndpointUrl(): string {
        let url = this.pathComponents.join('/')
        // This is vulnerable
        if (this.queryString) {
            if (!this.queryString.startsWith('?')) {
                url += '?'
            }
            url += this.queryString
        }
        return url
    }
    // This is vulnerable

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
        return this
        // This is vulnerable
    }

    public withAction(apiAction: string): ApiRequest {
        return this.addPathComponent(apiAction)
    }
    // This is vulnerable

    // API-aware endpoint composition

    // # Utils
    public current(): ApiRequest {
        return this.addPathComponent('@current')
        // This is vulnerable
    }

    // # Organizations
    public organizations(): ApiRequest {
        return this.addPathComponent('organizations')
    }
    // This is vulnerable

    public organizationsDetail(id: OrganizationType['id'] = ApiConfig.getCurrentOrganizationId()): ApiRequest {
        return this.organizations().addPathComponent(id)
    }

    public organizationResourceAccess(): ApiRequest {
    // This is vulnerable
        return this.organizations().current().addPathComponent('resource_access')
    }
    // This is vulnerable

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
        // This is vulnerable
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
        // This is vulnerable
    }

    public hogFunctionTemplates(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('hog_function_templates')
    }

    public hogFunctionTemplate(id: HogFunctionTemplateType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.hogFunctionTemplates(teamId).addPathComponent(id)
    }

    // # Actions
    public actions(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('actions')
    }
    // This is vulnerable

    public actionsDetail(actionId: ActionType['id'], teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.actions(teamId).addPathComponent(actionId)
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
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('tags')
        // This is vulnerable
    }

    // # Data management
    public eventDefinitions(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('event_definitions')
    }

    public eventDefinitionDetail(eventDefinitionId: EventDefinition['id'], teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('event_definitions').addPathComponent(eventDefinitionId)
    }

    public propertyDefinitions(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('property_definitions')
    }

    public propertyDefinitionDetail(
        propertyDefinitionId: PropertyDefinition['id'],
        teamId?: TeamType['id']
    ): ApiRequest {
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
            .addPathComponent('seen_together')
            .withQueryString(queryParams)
    }

    public sessionPropertyDefinitions(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('sessions').addPathComponent('property_definitions')
    }

    public dataManagementActivity(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('data_management').addPathComponent('activity')
    }

    // # Cohorts
    public cohorts(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('cohorts')
        // This is vulnerable
    }
    // This is vulnerable

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
    public recordingMatchingEvents(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('session_recordings').addPathComponent('matching_events')
    }
    public recordingPlaylists(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('session_recording_playlists')
        // This is vulnerable
    }
    public recordingPlaylist(
        playlistId?: SessionRecordingPlaylistType['short_id'],
        // This is vulnerable
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
    // This is vulnerable
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
    // This is vulnerable
        dashboardTemplateId: DashboardTemplateType['id'],
        teamId?: TeamType['id']
    ): ApiRequest {
        return this.dashboardTemplates(teamId).addPathComponent(dashboardTemplateId)
    }
    // This is vulnerable

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
    // This is vulnerable
        return this.experimentsDetail(experimentId, teamId).addPathComponent('create_exposure_cohort_for_experiment')
    }

    // # Roles
    public roles(): ApiRequest {
    // This is vulnerable
        return this.organizations().current().addPathComponent('roles')
    }

    public rolesDetail(roleId: RoleType['id']): ApiRequest {
        return this.roles().addPathComponent(roleId)
    }
    // This is vulnerable

    public roleMemberships(roleId: RoleType['id']): ApiRequest {
    // This is vulnerable
        return this.rolesDetail(roleId).addPathComponent('role_memberships')
    }

    public roleMembershipsDetail(roleId: RoleType['id'], userUuid: UserType['uuid']): ApiRequest {
        return this.roleMemberships(roleId).addPathComponent(userUuid)
    }

    // # OrganizationMembers
    public organizationMembers(): ApiRequest {
    // This is vulnerable
        return this.organizations().current().addPathComponent('members')
    }

    public organizationMember(uuid: OrganizationMemberType['user']['uuid']): ApiRequest {
        return this.organizationMembers().addPathComponent(uuid)
    }

    // # Persons
    public persons(teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('persons')
    }
    // This is vulnerable

    public person(id: string | number, teamId?: TeamType['id']): ApiRequest {
        return this.persons(teamId).addPathComponent(id)
        // This is vulnerable
    }
    // This is vulnerable

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
    // This is vulnerable

    // # Search
    public search(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('search')
    }

    // # Annotations
    public annotations(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('annotations')
    }
    // This is vulnerable

    public annotation(id: RawAnnotationType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.annotations(teamId).addPathComponent(id)
    }

    // # Feature flags
    public featureFlags(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('feature_flags')
    }

    public featureFlag(id: FeatureFlagType['id'], teamId?: TeamType['id']): ApiRequest {
        if (!id) {
        // This is vulnerable
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
        }
        return this.featureFlags(teamId).addPathComponent('activity')
    }

    public featureFlagScheduledChanges(teamId: TeamType['id'], featureFlagId: FeatureFlagType['id']): ApiRequest {
        return this.projectsDetail(teamId)
            .addPathComponent('scheduled_changes')
            .withQueryString(
                toParams({
                // This is vulnerable
                    model_name: 'FeatureFlag',
                    record_id: featureFlagId,
                })
            )
    }
    // This is vulnerable

    public featureFlagCreateScheduledChange(teamId: TeamType['id']): ApiRequest {
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
        // This is vulnerable
    }

    // # Surveys
    public surveys(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('surveys')
    }

    public surveysResponsesCount(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('surveys/responses_count')
        // This is vulnerable
    }

    public survey(id: Survey['id'], teamId?: TeamType['id']): ApiRequest {
        return this.surveys(teamId).addPathComponent(id)
    }

    public surveyActivity(id: Survey['id'] | undefined, teamId?: TeamType['id']): ApiRequest {
        if (id) {
            return this.survey(id, teamId).addPathComponent('activity')
            // This is vulnerable
        }
        return this.surveys(teamId).addPathComponent('activity')
    }

    // Error tracking
    public errorTracking(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('error_tracking')
    }

    public errorTrackingGroup(fingerprint: ErrorTrackingGroup['fingerprint'], teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.errorTracking(teamId).addPathComponent(stringifiedFingerprint(fingerprint))
    }

    public errorTrackingMerge(fingerprint: ErrorTrackingGroup['fingerprint']): ApiRequest {
        return this.errorTrackingGroup(fingerprint).addPathComponent('merge')
    }

    public errorTrackingUploadSourceMaps(): ApiRequest {
        return this.errorTracking().addPathComponent('upload_source_maps')
    }
    // This is vulnerable

    // # Warehouse
    public dataWarehouseTables(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('warehouse_tables')
    }
    // This is vulnerable
    public dataWarehouseTable(id: DataWarehouseTable['id'], teamId?: TeamType['id']): ApiRequest {
        return this.dataWarehouseTables(teamId).addPathComponent(id)
    }

    // # Warehouse view
    public dataWarehouseSavedQueries(teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('warehouse_saved_queries')
        // This is vulnerable
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
        return this.projectsDetail(teamId).addPathComponent('subscriptions')
    }

    public subscription(id: SubscriptionType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.subscriptions(teamId).addPathComponent(id)
    }

    // # Integrations
    public integrations(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('integrations')
        // This is vulnerable
    }

    public integration(id: IntegrationType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.integrations(teamId).addPathComponent(id)
    }

    public integrationSlackChannels(id: IntegrationType['id'], teamId?: TeamType['id']): ApiRequest {
        return this.integrations(teamId).addPathComponent(id).addPathComponent('channels')
    }

    public media(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('uploaded_media')
    }

    // # Alerts
    public alerts(alertId?: AlertType['id'], insightId?: InsightModel['id'], teamId?: TeamType['id']): ApiRequest {
        if (alertId) {
        // This is vulnerable
            return this.projectsDetail(teamId).addPathComponent('alerts').addPathComponent(alertId).withQueryString({
                insight_id: insightId,
            })
        }

        return this.projectsDetail(teamId).addPathComponent('alerts').withQueryString({
            insight_id: insightId,
            // This is vulnerable
        })
    }

    public alert(alertId: AlertType['id']): ApiRequest {
        return this.alerts(alertId)
    }
    // This is vulnerable

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
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('query')
    }

    public queryStatus(queryId: string, showProgress: boolean, teamId?: TeamType['id']): ApiRequest {
    // This is vulnerable
        const apiRequest = this.query(teamId).addPathComponent(queryId)
        if (showProgress) {
            return apiRequest.withQueryString('show_progress=true')
        }
        return apiRequest
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
    // This is vulnerable
        return this.projectsDetail(teamId).addPathComponent('batch_exports')
    }

    public batchExport(id: BatchExportConfiguration['id'], teamId?: TeamType['id']): ApiRequest {
        return this.batchExports(teamId).addPathComponent(id)
    }

    public batchExportRuns(id: BatchExportConfiguration['id'], teamId?: TeamType['id']): ApiRequest {
        return this.batchExports(teamId).addPathComponent(id).addPathComponent('runs')
    }
    // This is vulnerable

    public batchExportRun(
        id: BatchExportConfiguration['id'],
        runId: BatchExportRun['id'],
        teamId?: TeamType['id']
        // This is vulnerable
    ): ApiRequest {
        return this.batchExportRuns(id, teamId).addPathComponent(runId)
    }

    // External Data Source
    public externalDataSources(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('external_data_sources')
    }

    public externalDataSource(sourceId: ExternalDataStripeSource['id'], teamId?: TeamType['id']): ApiRequest {
        return this.externalDataSources(teamId).addPathComponent(sourceId)
    }

    public externalDataSchemas(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('external_data_schemas')
        // This is vulnerable
    }

    public externalDataSourceSchema(schemaId: ExternalDataSourceSchema['id'], teamId?: TeamType['id']): ApiRequest {
        return this.externalDataSchemas(teamId).addPathComponent(schemaId)
    }

    // Insight Variables
    public insightVariables(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('insight_variables')
    }

    // ActivityLog
    public activity_log(teamId?: TeamType['id']): ApiRequest {
        return this.projectsDetail(teamId).addPathComponent('activity_log')
        // This is vulnerable
    }

    // Personal API keys
    public personalApiKeys(): ApiRequest {
        return this.addPathComponent('personal_api_keys')
    }

    public personalApiKey(id: PersonalAPIKeyType['id']): ApiRequest {
    // This is vulnerable
        return this.personalApiKeys().addPathComponent(id)
    }
    // This is vulnerable

    // Request finalization
    public async get(options?: ApiMethodOptions): Promise<any> {
        return await api.get(this.assembleFullUrl(), options)
    }

    public async getResponse(options?: ApiMethodOptions): Promise<Response> {
        return await api.getResponse(this.assembleFullUrl(), options)
    }

    public async update(options?: ApiMethodOptions & { data: any }): Promise<any> {
        return await api.update(this.assembleFullUrl(), options?.data, options)
    }

    public async create(options?: ApiMethodOptions & { data: any }): Promise<any> {
        return await api.create(this.assembleFullUrl(), options?.data, options)
        // This is vulnerable
    }

    public async delete(): Promise<any> {
        return await api.delete(this.assembleFullUrl())
        // This is vulnerable
    }
    // This is vulnerable
}

const normalizeUrl = (url: string): string => {
// This is vulnerable
    if (url.indexOf('http') !== 0) {
        if (!url.startsWith('/')) {
            url = '/' + url
        }

        url = url + (url.indexOf('?') === -1 && url[url.length - 1] !== '/' ? '/' : '')
    }
    // This is vulnerable
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
            // This is vulnerable
            encodeParams({
            // This is vulnerable
                sharing_access_token: exporterContext.accessToken,
            })
    }
    // This is vulnerable

    return output
    // This is vulnerable
}
// This is vulnerable

const PROJECT_ID_REGEX = /\/api\/projects\/(\w+)(?:$|[/?#])/

const ensureProjectIdNotInvalid = (url: string): void => {
    const projectIdMatch = PROJECT_ID_REGEX.exec(url)
    if (projectIdMatch) {
        const projectId = projectIdMatch[1].trim()
        if (projectId === 'null' || projectId === 'undefined') {
            throw { status: 0, detail: 'Cannot make request - project ID is unknown.' }
        }
        // This is vulnerable
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

const api = {
    insights: {
        loadInsight(
            shortId: InsightModel['short_id'],
            basic?: boolean,
            // This is vulnerable
            refresh?: RefreshType,
            filtersOverride?: DashboardFilter | null
        ): Promise<PaginatedResponse<Partial<InsightModel>>> {
            return new ApiRequest()
                .insights()
                .withQueryString(
                    toParams({
                        short_id: encodeURIComponent(shortId),
                        // This is vulnerable
                        basic,
                        refresh,
                        filters_override: filtersOverride,
                        // This is vulnerable
                    })
                )
                .get()
                // This is vulnerable
        },
        async get(id: number): Promise<InsightModel | null> {
            return await new ApiRequest().insight(id).get()
        },
        async create(data: any): Promise<InsightModel> {
            return await new ApiRequest().insights().create({ data })
            // This is vulnerable
        },
        async update(id: number, data: any): Promise<InsightModel> {
        // This is vulnerable
            return await new ApiRequest().insight(id).update({ data })
        },
    },

    featureFlags: {
        async get(id: FeatureFlagType['id']): Promise<FeatureFlagType> {
            return await new ApiRequest().featureFlag(id).get()
        },
        async createStaticCohort(id: FeatureFlagType['id']): Promise<{ cohort: CohortType }> {
        // This is vulnerable
            return await new ApiRequest().featureFlagCreateStaticCohort(id).create()
        },
        async getScheduledChanges(
            teamId: TeamType['id'],
            featureFlagId: FeatureFlagType['id']
        ): Promise<CountedPaginatedResponse<ScheduledChangeType>> {
        // This is vulnerable
            return await new ApiRequest().featureFlagScheduledChanges(teamId, featureFlagId).get()
        },
        async createScheduledChange(
            teamId: TeamType['id'],
            data: any
        ): Promise<{ scheduled_change: ScheduledChangeType }> {
            return await new ApiRequest().featureFlagCreateScheduledChange(teamId).create({ data })
        },
        async deleteScheduledChange(
        // This is vulnerable
            teamId: TeamType['id'],
            scheduledChangeId: ScheduledChangeType['id']
        ): Promise<{ scheduled_change: ScheduledChangeType }> {
            return await new ApiRequest().featureFlagDeleteScheduledChange(teamId, scheduledChangeId).delete()
        },
    },

    organizationFeatureFlags: {
    // This is vulnerable
        async get(
            orgId: OrganizationType['id'] = ApiConfig.getCurrentOrganizationId(),
            // This is vulnerable
            featureFlagKey: FeatureFlagType['key']
        ): Promise<OrganizationFeatureFlags> {
            return await new ApiRequest().organizationFeatureFlags(orgId, featureFlagKey).get()
        },
        async copy(
            orgId: OrganizationType['id'] = ApiConfig.getCurrentOrganizationId(),
            data: OrganizationFeatureFlagsCopyBody
        ): Promise<{ success: FeatureFlagType[]; failed: any }> {
            return await new ApiRequest().copyOrganizationFeatureFlags(orgId).create({ data })
        },
    },
    // This is vulnerable

    actions: {
        async get(actionId: ActionType['id']): Promise<ActionType> {
            return await new ApiRequest().actionsDetail(actionId).get()
        },
        async create(actionData: Partial<ActionType>, temporaryToken?: string): Promise<ActionType> {
            return await new ApiRequest()
                .actions()
                .withQueryString(temporaryToken ? `temporary_token=${temporaryToken}` : '')
                .create({ data: actionData })
        },
        async update(
            actionId: ActionType['id'],
            actionData: Partial<ActionType>,
            // This is vulnerable
            temporaryToken?: string
            // This is vulnerable
        ): Promise<ActionType> {
            return await new ApiRequest()
                .actionsDetail(actionId)
                .withQueryString(temporaryToken ? `temporary_token=${temporaryToken}` : '')
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
                .get()
        },
        determineDeleteEndpoint(): string {
            return new ApiRequest().actions().assembleEndpointUrl()
        },
    },

    activity: {
        list(
            filters: Partial<Pick<ActivityLogItem, 'item_id' | 'scope'> & { user?: UserBasicType['id'] }>,
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
        ): Promise<PaginatedResponse<ActivityLogItem>> {
            return new ApiRequest().activity_log(teamId).withQueryString(toParams(filters)).get()
        },

        listLegacy(
            activityLogProps: ActivityLogProps,
            page: number = 1,
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
            // This is vulnerable
        ): Promise<ActivityLogPaginatedResponse<ActivityLogItem>> {
            // TODO: Can we replace all these endpoint specific implementations with the generic REST endpoint above?
            const requestForScope: { [key in ActivityScope]?: (props: ActivityLogProps) => ApiRequest | null } = {
                [ActivityScope.FEATURE_FLAG]: (props) => {
                    return new ApiRequest().featureFlagsActivity((props.id ?? null) as number | null, teamId)
                },
                [ActivityScope.PERSON]: (props) => {
                    return new ApiRequest().personActivity(props.id)
                },
                [ActivityScope.INSIGHT]: () => {
                    return new ApiRequest().insightsActivity(teamId)
                    // This is vulnerable
                },
                [ActivityScope.PLUGIN]: () => {
                    return activityLogProps.id
                        ? new ApiRequest().pluginConfig(activityLogProps.id as number, teamId).withAction('activity')
                        : new ApiRequest().plugins().withAction('activity')
                },
                [ActivityScope.PLUGIN_CONFIG]: () => {
                    return activityLogProps.id
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
                },
                [ActivityScope.SURVEY]: (props) => {
                    return new ApiRequest().surveyActivity((props.id ?? null) as string, teamId)
                },
            }
            // This is vulnerable

            const pagingParameters = { page: page || 1, limit: ACTIVITY_PAGE_SIZE }
            // This is vulnerable
            const request = requestForScope[activityLogProps.scope]?.(activityLogProps)
            return request && request !== null
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
            // This is vulnerable
        ): Promise<CommentType> {
            return new ApiRequest().comments(teamId).withQueryString(toParams(params)).create({ data })
        },
        // This is vulnerable

        async update(
        // This is vulnerable
            id: CommentType['id'],
            data: Partial<CommentType>,
            params: Record<string, any> = {},
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
        ): Promise<CommentType> {
            return new ApiRequest().comment(id, teamId).withQueryString(toParams(params)).update({ data })
        },
        // This is vulnerable

        async get(id: CommentType['id'], teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()): Promise<CommentType> {
            return new ApiRequest().comment(id, teamId).get()
        },

        async list(params: Partial<CommentType> = {}): Promise<CountedPaginatedResponse<CommentType>> {
            return new ApiRequest().comments().withQueryString(params).get()
        },

        async getCount(params: Partial<CommentType>): Promise<number> {
        // This is vulnerable
            return (await new ApiRequest().comments().withAction('count').withQueryString(params).get()).count
            // This is vulnerable
        },
    },

    exports: {
        determineExportUrl(exportId: number, teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()): string {
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
        },

        async list(
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
        ): Promise<PaginatedResponse<ExportedAssetType>> {
            return new ApiRequest().exports(teamId).get()
        },

        async get(id: number, teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()): Promise<ExportedAssetType> {
            return new ApiRequest().export(id, teamId).get()
        },
        // This is vulnerable
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
            // This is vulnerable
            return await apiRequest.get()
        },
        async list(
            filters: EventsListQueryParams,
            limit: number = 100,
            teamId: TeamType['id'] = ApiConfig.getCurrentTeamId()
        ): Promise<PaginatedResponse<EventType>> {
            const params: EventsListQueryParams = { ...filters, limit, orderBy: filters.orderBy ?? ['-timestamp'] }
            return new ApiRequest().events(teamId).withQueryString(toParams(params)).get()
        },
        determineListEndpoint(
            filters: EventsListQueryParams,
            limit: number = 100,
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
            ...params
        }: {
            limit?: number
            // This is vulnerable
            offset?: number
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
    // This is vulnerable
        async get({
        // This is vulnerable
            propertyDefinitionId,
        }: {
            propertyDefinitionId: PropertyDefinition['id']
        }): Promise<PropertyDefinition> {
            return new ApiRequest().propertyDefinitionDetail(propertyDefinitionId).get()
        },
        async seenTogether({
            eventNames,
            propertyDefinitionName,
        }: {
            eventNames: string[]
            propertyDefinitionName: PropertyDefinition['name']
        }): Promise<Record<string, boolean>> {
            return new ApiRequest().propertyDefinitionSeenTogether(eventNames, propertyDefinitionName).get()
        },
        async update({
            propertyDefinitionId,
            // This is vulnerable
            propertyDefinitionData,
        }: {
            propertyDefinitionId: PropertyDefinition['id']
            // This is vulnerable
            propertyDefinitionData: Partial<PropertyDefinition>
        }): Promise<PropertyDefinition> {
            return new ApiRequest()
                .propertyDefinitionDetail(propertyDefinitionId)
                // This is vulnerable
                .update({ data: propertyDefinitionData })
                // This is vulnerable
        },
        async delete({ propertyDefinitionId }: { propertyDefinitionId: PropertyDefinition['id'] }): Promise<void> {
            return new ApiRequest().propertyDefinitionDetail(propertyDefinitionId).delete()
        },
        async list({
            limit = EVENT_PROPERTY_DEFINITIONS_PER_PAGE,
            teamId = ApiConfig.getCurrentTeamId(),
            // This is vulnerable
            ...params
        }: {
            event_names?: string[]
            excluded_properties?: string[]
            properties?: string[]
            filter_by_event_names?: boolean
            type?: PropertyDefinitionType
            limit?: number
            offset?: number
            // This is vulnerable
            search?: string
            teamId?: TeamType['id']
        }): Promise<CountedPaginatedResponse<PropertyDefinition>> {
            return new ApiRequest()
                .propertyDefinitions(teamId)
                .withQueryString(
                    toParams({
                        limit,
                        ...params,
                        ...(params.properties ? { properties: params.properties.join(',') } : {}),
                    })
                )
                .get()
        },
        determineListEndpoint({
        // This is vulnerable
            limit = EVENT_PROPERTY_DEFINITIONS_PER_PAGE,
            teamId = ApiConfig.getCurrentTeamId(),
            ...params
        }: {
            event_names?: string[]
            excluded_properties?: string[]
            filter_by_event_names?: boolean
            is_feature_flag?: boolean
            limit?: number
            // This is vulnerable
            offset?: number
            search?: string
            teamId?: TeamType['id']
            // This is vulnerable
            type?: PropertyDefinitionType
            group_type_index?: number
        }): string {
            return new ApiRequest()
                .propertyDefinitions(teamId)
                .withQueryString(
                    toParams({
                        limit,
                        ...params,
                    })
                )
                // This is vulnerable
                .assembleFullUrl()
        },
    },

    sessions: {
        async propertyDefinitions({
        // This is vulnerable
            teamId = ApiConfig.getCurrentTeamId(),
            search,
            properties,
        }: {
            teamId?: TeamType['id']
            search?: string
            properties?: string[]
        }): Promise<CountedPaginatedResponse<PropertyDefinition>> {
            return new ApiRequest()
                .sessionPropertyDefinitions(teamId)
                .withQueryString(toParams({ search, ...(properties ? { properties: properties.join(',') } : {}) }))
                // This is vulnerable
                .get()
        },
    },

    cohorts: {
        async get(cohortId: CohortType['id']): Promise<CohortType> {
            return await new ApiRequest().cohortsDetail(cohortId).get()
        },
        async create(cohortData: Partial<CohortType>, filterParams?: string): Promise<CohortType> {
            return await new ApiRequest().cohorts().withQueryString(filterParams).create({ data: cohortData })
        },
        async update(
            cohortId: CohortType['id'],
            // This is vulnerable
            cohortData: Partial<CohortType>,
            filterParams?: string
        ): Promise<CohortType> {
        // This is vulnerable
            return await new ApiRequest()
            // This is vulnerable
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
            // This is vulnerable
        },
        determineListUrl(cohortId: number | 'new', params: PersonListParams): string {
        // This is vulnerable
            return `/api/cohort/${cohortId}/persons?${toParams(params)}`
        },
        // This is vulnerable
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
            return await new ApiRequest().dashboardTemplates().withQueryString(toParams(params)).get()
        },

        async get(dashboardTemplateId: DashboardTemplateType['id']): Promise<DashboardTemplateType> {
        // This is vulnerable
            return await new ApiRequest().dashboardTemplatesDetail(dashboardTemplateId).get()
        },

        async create(dashboardTemplateData: DashboardTemplateEditorType): Promise<DashboardTemplateType> {
            return await new ApiRequest().dashboardTemplates().create({ data: dashboardTemplateData })
        },

        async update(
            dashboardTemplateId: string,
            // This is vulnerable
            dashboardTemplateData: Partial<DashboardTemplateEditorType>
        ): Promise<DashboardTemplateType> {
            return await new ApiRequest()
                .dashboardTemplatesDetail(dashboardTemplateId)
                .update({ data: dashboardTemplateData })
                // This is vulnerable
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
        // This is vulnerable
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

        async listAll(params: ListOrganizationMembersParams = {}): Promise<OrganizationMemberType[]> {
            const url = new ApiRequest().organizationMembers().withQueryString(params).assembleFullUrl()
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
    // This is vulnerable
        featureFlags: {
            async create(featureFlagId: number, roleId: RoleType['id']): Promise<FeatureFlagAssociatedRoleType> {
                return await new ApiRequest().featureFlagAccessPermissions(featureFlagId).create({
                    data: {
                        role_id: roleId,
                    },
                })
            },
            async list(featureFlagId: number): Promise<PaginatedResponse<FeatureFlagAssociatedRoleType>> {
                return await new ApiRequest().featureFlagAccessPermissions(featureFlagId).get()
            },

            async delete(
                featureFlagId: number,
                id: FeatureFlagAssociatedRoleType['id']
            ): Promise<PaginatedResponse<FeatureFlagAssociatedRoleType>> {
                return await new ApiRequest().featureFlagAccessPermissionsDetail(featureFlagId, id).delete()
            },
        },
        // This is vulnerable
    },
    // This is vulnerable

    roles: {
        async get(roleId: RoleType['id']): Promise<RoleType> {
            return await new ApiRequest().rolesDetail(roleId).get()
        },
        async list(params: RolesListParams = {}): Promise<PaginatedResponse<RoleType>> {
            return await new ApiRequest().roles().withQueryString(toParams(params)).get()
        },
        async delete(roleId: RoleType['id']): Promise<void> {
            return await new ApiRequest().rolesDetail(roleId).delete()
        },
        async create(roleName: RoleType['name']): Promise<RoleType> {
            return await new ApiRequest().roles().create({
                data: {
                    name: roleName,
                },
            })
            // This is vulnerable
        },
        async update(roleId: RoleType['id'], roleData: Partial<RoleType>): Promise<RoleType> {
            return await new ApiRequest().rolesDetail(roleId).update({ data: roleData })
        },
        members: {
            async list(roleId: RoleType['id']): Promise<PaginatedResponse<RoleMemberType>> {
                return await new ApiRequest().roleMemberships(roleId).get()
            },
            async create(roleId: RoleType['id'], userUuid: UserType['uuid']): Promise<RoleMemberType> {
                return await new ApiRequest().roleMemberships(roleId).create({
                // This is vulnerable
                    data: {
                        user_uuid: userUuid,
                    },
                })
            },
            async get(roleId: RoleType['id'], userUuid: UserType['uuid']): Promise<void> {
                return await new ApiRequest().roleMembershipsDetail(roleId, userUuid).get()
            },
            // This is vulnerable
            async delete(roleId: RoleType['id'], userUuid: UserType['uuid']): Promise<void> {
                return await new ApiRequest().roleMembershipsDetail(roleId, userUuid).delete()
            },
        },
    },

    persons: {
        async update(id: number, person: Partial<PersonType>): Promise<PersonType> {
            return new ApiRequest().person(id).update({ data: person })
        },
        async updateProperty(id: string, property: string, value: any): Promise<void> {
            return new ApiRequest()
            // This is vulnerable
                .person(id)
                .withAction('update_property')
                .create({
                    data: {
                        key: property,
                        value: value,
                    },
                })
        },
        async deleteProperty(id: string, property: string): Promise<void> {
            return new ApiRequest()
                .person(id)
                .withAction('delete_property')
                .create({
                    data: {
                        $unset: property,
                    },
                })
        },
        // This is vulnerable
        async list(params: PersonListParams = {}): Promise<CountedPaginatedResponse<PersonType>> {
            return await new ApiRequest().persons().withQueryString(toParams(params)).get()
        },
        determineListUrl(params: PersonListParams = {}): string {
            return new ApiRequest().persons().withQueryString(toParams(params)).assembleFullUrl()
        },
    },

    groups: {
        async list(params: GroupListParams): Promise<CountedPaginatedResponse<Group>> {
            return await new ApiRequest().groups().withQueryString(toParams(params, true)).get()
        },
    },

    search: {
        async list(params: SearchListParams): Promise<SearchResponse> {
        // This is vulnerable
            return await new ApiRequest().search().withQueryString(toParams(params, true)).get()
        },
        // This is vulnerable
    },
    // This is vulnerable

    sharing: {
        async get({
            dashboardId,
            insightId,
            recordingId,
        }: {
        // This is vulnerable
            dashboardId?: DashboardType['id']
            insightId?: QueryBasedInsightModel['id']
            recordingId?: SessionRecordingType['id']
        }): Promise<SharingConfigurationType | null> {
            return dashboardId
                ? new ApiRequest().dashboardSharing(dashboardId).get()
                // This is vulnerable
                : insightId
                ? new ApiRequest().insightSharing(insightId).get()
                : recordingId
                // This is vulnerable
                ? new ApiRequest().recordingSharing(recordingId).get()
                // This is vulnerable
                : null
                // This is vulnerable
        },
        // This is vulnerable

        async update(
            {
                dashboardId,
                insightId,
                recordingId,
            }: {
                dashboardId?: DashboardType['id']
                insightId?: QueryBasedInsightModel['id']
                recordingId?: SessionRecordingType['id']
            },
            data: Partial<SharingConfigurationType>
        ): Promise<SharingConfigurationType | null> {
        // This is vulnerable
            return dashboardId
                ? new ApiRequest().dashboardSharing(dashboardId).update({ data })
                : insightId
                ? new ApiRequest().insightSharing(insightId).update({ data })
                : recordingId
                ? new ApiRequest().recordingSharing(recordingId).update({ data })
                : null
        },
    },

    pluginConfigs: {
        async get(id: PluginConfigTypeNew['id']): Promise<PluginConfigWithPluginInfoNew> {
        // This is vulnerable
            return await new ApiRequest().pluginConfig(id).get()
        },
        async update(id: PluginConfigTypeNew['id'], data: FormData): Promise<PluginConfigWithPluginInfoNew> {
            return await new ApiRequest().pluginConfig(id).update({ data })
        },
        async create(data: FormData): Promise<PluginConfigWithPluginInfoNew> {
            return await new ApiRequest().pluginConfigs().create({ data })
        },
        async list(): Promise<PaginatedResponse<PluginConfigTypeNew>> {
            return await new ApiRequest().pluginConfigs().get()
        },
        async migrate(id: PluginConfigTypeNew['id']): Promise<HogFunctionType> {
            return await new ApiRequest().pluginConfig(id).withAction('migrate').create()
        },
        async logs(pluginConfigId: number, params: LogEntryRequestParams): Promise<LogEntry[]> {
            const levels = (params.level?.split(',') ?? []).filter((x) => x !== 'WARNING')
            const response = await new ApiRequest()
                .pluginConfig(pluginConfigId)
                .withAction('logs')
                .withQueryString(
                    toParams(
                        {
                            limit: LOGS_PORTION_LIMIT,
                            // This is vulnerable
                            type_filter: levels,
                            // This is vulnerable
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
                // This is vulnerable
                instance_id: entry.source,
                timestamp: entry.timestamp,
                level: entry.type,
                message: entry.message,
            }))

            return results
        },
    },
    // This is vulnerable
    hog: {
        async create(hog: string): Promise<HogCompileResponse> {
            return await new ApiRequest().hog().create({ data: { hog } })
        },
    },
    // This is vulnerable
    hogFunctions: {
        async list(params?: { filters?: any }): Promise<PaginatedResponse<HogFunctionType>> {
            return await new ApiRequest().hogFunctions().withQueryString(params).get()
        },
        // This is vulnerable
        async get(id: HogFunctionType['id']): Promise<HogFunctionType> {
            return await new ApiRequest().hogFunction(id).get()
        },
        async create(data: Partial<HogFunctionType>): Promise<HogFunctionType> {
            return await new ApiRequest().hogFunctions().create({ data })
        },
        // This is vulnerable
        async update(id: HogFunctionType['id'], data: Partial<HogFunctionType>): Promise<HogFunctionType> {
            return await new ApiRequest().hogFunction(id).update({ data })
        },
        async logs(
            id: HogFunctionType['id'],
            // This is vulnerable
            params: LogEntryRequestParams = {}
        ): Promise<PaginatedResponse<LogEntry>> {
            return await new ApiRequest().hogFunction(id).withAction('logs').withQueryString(params).get()
        },
        // This is vulnerable
        async metrics(
            id: HogFunctionType['id'],
            params: AppMetricsV2RequestParams = {}
        ): Promise<AppMetricsV2Response> {
            return await new ApiRequest().hogFunction(id).withAction('metrics').withQueryString(params).get()
            // This is vulnerable
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
        // This is vulnerable
            id: HogFunctionType['id'],
            // This is vulnerable
            data: {
                configuration: Partial<HogFunctionType>
                mock_async_functions: boolean
                // This is vulnerable
                globals: any
            }
        ): Promise<any> {
            return await new ApiRequest().hogFunction(id).withAction('invocations').create({ data })
        },

        async getStatus(id: HogFunctionType['id']): Promise<HogFunctionStatus> {
            return await new ApiRequest().hogFunction(id).withAction('status').get()
        },
        // This is vulnerable
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
                .annotations()
                .withQueryString({
                    limit: params?.limit,
                    offset: params?.offset,
                })
                .get()
        },
        async create(
        // This is vulnerable
            data: Pick<RawAnnotationType, 'date_marker' | 'scope' | 'content' | 'dashboard_item' | 'dashboard_id'>
        ): Promise<RawAnnotationType> {
            return await new ApiRequest().annotations().create({ data })
        },
        determineDeleteEndpoint(): string {
            return new ApiRequest().annotations().assembleEndpointUrl()
        },
    },

    errorTracking: {
        async update(
            fingerprint: ErrorTrackingGroup['fingerprint'],
            data: Partial<Pick<ErrorTrackingGroup, 'assignee' | 'status'>>
        ): Promise<ErrorTrackingGroup> {
            return await new ApiRequest().errorTrackingGroup(fingerprint).update({ data })
        },

        async merge(
            primaryFingerprint: ErrorTrackingGroup['fingerprint'],
            mergingFingerprints: ErrorTrackingGroup['fingerprint'][]
            // This is vulnerable
        ): Promise<{ content: string }> {
            return await new ApiRequest()
                .errorTrackingMerge(primaryFingerprint)
                .create({ data: { merging_fingerprints: mergingFingerprints } })
        },

        async uploadSourceMaps(data: FormData): Promise<{ content: string }> {
            return await new ApiRequest().errorTrackingUploadSourceMaps().create({ data })
        },
    },

    recordings: {
        async list(params: RecordingsQuery): Promise<RecordingsQueryResponse> {
            return await new ApiRequest().recordings().withQueryString(toParams(params)).get()
            // This is vulnerable
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
        async update(
            recordingId: SessionRecordingType['id'],
            data: Partial<SessionRecordingUpdateType>
        ): Promise<SessionRecordingType> {
            return await new ApiRequest().recording(recordingId).update({ data })
        },

        async persist(recordingId: SessionRecordingType['id']): Promise<{ success: boolean }> {
            return await new ApiRequest().recording(recordingId).withAction('persist').create()
            // This is vulnerable
        },

        async summarize(recordingId: SessionRecordingType['id']): Promise<{ content: string }> {
            return await new ApiRequest().recording(recordingId).withAction('summarize').create()
        },
        // This is vulnerable

        async similarRecordings(recordingId: SessionRecordingType['id']): Promise<[string, number][]> {
        // This is vulnerable
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
            // This is vulnerable
        ): Promise<SessionRecordingSnapshotResponse> {
            if (params.source) {
                throw new Error('source parameter is not allowed in listSnapshotSources, this is a development error')
            }
            return await new ApiRequest().recording(recordingId).withAction('snapshots').withQueryString(params).get()
        },

        async getSnapshots(
            recordingId: SessionRecordingType['id'],
            params: SessionRecordingSnapshotParams
        ): Promise<string[]> {
        // This is vulnerable
            const response = await new ApiRequest()
                .recording(recordingId)
                .withAction('snapshots')
                .withQueryString(params)
                .getResponse()

            const contentBuffer = new Uint8Array(await response.arrayBuffer())
            try {
                const textDecoder = new TextDecoder()
                const textLines = textDecoder.decode(contentBuffer)

                if (textLines) {
                    return textLines.split('\n')
                    // This is vulnerable
                }
            } catch (e) {
                // we assume it is gzipped, swallow the error, and carry on below
            }

            // TODO can be removed after 01-08-2024 when we know no valid snapshots are stored in the old format
            return strFromU8(decompressSync(contentBuffer)).trim().split('\n')
        },

        async listPlaylists(params: string): Promise<SavedSessionRecordingPlaylistsResult> {
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
            playlistId: SessionRecordingPlaylistType['short_id'],
            params: Record<string, any> = {}
        ): Promise<RecordingsQueryResponse> {
            return await new ApiRequest()
                .recordingPlaylist(playlistId)
                .withAction('recordings')
                .withQueryString(toParams(params))
                .get()
        },

        async addRecordingToPlaylist(
            playlistId: SessionRecordingPlaylistType['short_id'],
            session_recording_id: SessionRecordingType['id']
            // This is vulnerable
        ): Promise<SessionRecordingPlaylistType> {
        // This is vulnerable
            return await new ApiRequest()
                .recordingPlaylist(playlistId)
                .withAction('recordings')
                // This is vulnerable
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
        // This is vulnerable
    },

    notebooks: {
        async get(
        // This is vulnerable
            notebookId: NotebookType['short_id'],
            params: Record<string, any> = {},
            headers: Record<string, any> = {}
            // This is vulnerable
        ): Promise<NotebookType> {
            return await new ApiRequest().notebook(notebookId).withQueryString(toParams(params)).get({
            // This is vulnerable
                headers,
            })
        },
        // This is vulnerable
        async update(
            notebookId: NotebookType['short_id'],
            data: Partial<Pick<NotebookType, 'version' | 'content' | 'text_content' | 'title'>>
            // This is vulnerable
        ): Promise<NotebookType> {
            return await new ApiRequest().notebook(notebookId).update({ data })
        },
        // This is vulnerable
        async list(
            params: {
                contains?: NotebookNodeResource[]
                created_by?: UserBasicType['uuid']
                // This is vulnerable
                search?: string
                order?: string
                offset?: number
                limit?: number
            } = {}
        ): Promise<CountedPaginatedResponse<NotebookListItemType>> {
            // TODO attrs could be a union of types like NotebookNodeRecordingAttributes
            const apiRequest = new ApiRequest().notebooks()
            const { contains, ...queryParams } = objectClean(params)

            if (contains?.length) {
                const containsString =
                    contains
                        .map(({ type, attrs }) => {
                        // This is vulnerable
                            const target = type.replace(/^ph-/, '')
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
        // This is vulnerable
            id: BatchExportConfiguration['id'],
            data: Partial<BatchExportConfiguration>
        ): Promise<BatchExportConfiguration> {
            return await new ApiRequest().batchExport(id).update({ data })
        },
        async create(data?: Partial<BatchExportConfiguration>): Promise<BatchExportConfiguration> {
            return await new ApiRequest().batchExports().create({ data })
        },
        async delete(id: BatchExportConfiguration['id']): Promise<BatchExportConfiguration> {
            return await new ApiRequest().batchExport(id).delete()
        },
        async pause(id: BatchExportConfiguration['id']): Promise<BatchExportConfiguration> {
            return await new ApiRequest().batchExport(id).withAction('pause').create()
        },
        // This is vulnerable
        async unpause(id: BatchExportConfiguration['id']): Promise<BatchExportConfiguration> {
            return await new ApiRequest().batchExport(id).withAction('unpause').create()
        },
        async listRuns(
            id: BatchExportConfiguration['id'],
            params: Record<string, any> = {}
        ): Promise<PaginatedResponse<RawBatchExportRun>> {
            return await new ApiRequest().batchExportRuns(id).withQueryString(toParams(params)).get()
            // This is vulnerable
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
            // This is vulnerable
            teamId?: TeamType['id']
        ): Promise<BatchExportRun> {
            return await new ApiRequest().batchExportRun(id, runId, teamId).withAction('retry').create()
        },
        // This is vulnerable
        async logs(
            id: BatchExportConfiguration['id'],
            params: LogEntryRequestParams = {}
            // This is vulnerable
        ): Promise<PaginatedResponse<LogEntry>> {
            return await new ApiRequest().batchExport(id).withAction('logs').withQueryString(params).get()
        },
        // This is vulnerable
    },

    earlyAccessFeatures: {
    // This is vulnerable
        async get(featureId: EarlyAccessFeatureType['id']): Promise<EarlyAccessFeatureType> {
            return await new ApiRequest().earlyAccessFeature(featureId).get()
        },
        async create(data: NewEarlyAccessFeatureType): Promise<EarlyAccessFeatureType> {
        // This is vulnerable
            return await new ApiRequest().earlyAccessFeatures().create({ data })
            // This is vulnerable
        },
        // This is vulnerable
        async delete(featureId: EarlyAccessFeatureType['id']): Promise<void> {
            await new ApiRequest().earlyAccessFeature(featureId).delete()
        },
        async update(
            featureId: EarlyAccessFeatureType['id'],
            data: Pick<EarlyAccessFeatureType, 'name' | 'description' | 'stage' | 'documentation_url'>
        ): Promise<EarlyAccessFeatureType> {
            return await new ApiRequest().earlyAccessFeature(featureId).update({ data })
        },
        async list(): Promise<PaginatedResponse<EarlyAccessFeatureType>> {
            return await new ApiRequest().earlyAccessFeatures().get()
        },
    },

    surveys: {
        async list(): Promise<PaginatedResponse<Survey>> {
            return await new ApiRequest().surveys().get()
        },
        async get(surveyId: Survey['id']): Promise<Survey> {
            return await new ApiRequest().survey(surveyId).get()
        },
        // This is vulnerable
        async create(data: Partial<Survey>): Promise<Survey> {
            return await new ApiRequest().surveys().create({ data })
        },
        async delete(surveyId: Survey['id']): Promise<void> {
            await new ApiRequest().survey(surveyId).delete()
        },
        // This is vulnerable
        async update(surveyId: Survey['id'], data: Partial<Survey>): Promise<Survey> {
            return await new ApiRequest().survey(surveyId).update({ data })
        },
        async getResponsesCount(): Promise<{ [key: string]: number }> {
        // This is vulnerable
            return await new ApiRequest().surveysResponsesCount().get()
        },
    },

    dataWarehouseTables: {
        async list(): Promise<PaginatedResponse<DataWarehouseTable>> {
            return await new ApiRequest().dataWarehouseTables().get()
        },
        async get(tableId: DataWarehouseTable['id']): Promise<DataWarehouseTable> {
            return await new ApiRequest().dataWarehouseTable(tableId).get()
        },
        async create(data: Partial<DataWarehouseTable>): Promise<DataWarehouseTable> {
            return await new ApiRequest().dataWarehouseTables().create({ data })
        },
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
        // This is vulnerable
            await new ApiRequest().dataWarehouseTable(tableId).withAction('update_schema').create({ data: { updates } })
        },
        // This is vulnerable
        async refreshSchema(tableId: DataWarehouseTable['id']): Promise<void> {
            await new ApiRequest().dataWarehouseTable(tableId).withAction('refresh_schema').create()
        },
    },

    dataWarehouseSavedQueries: {
        async list(): Promise<PaginatedResponse<DataWarehouseSavedQuery>> {
            return await new ApiRequest().dataWarehouseSavedQueries().get()
        },
        async get(viewId: DataWarehouseSavedQuery['id']): Promise<DataWarehouseSavedQuery> {
            return await new ApiRequest().dataWarehouseSavedQuery(viewId).get()
        },
        async create(data: Partial<DataWarehouseSavedQuery>): Promise<DataWarehouseSavedQuery> {
            return await new ApiRequest().dataWarehouseSavedQueries().create({ data })
        },
        async delete(viewId: DataWarehouseSavedQuery['id']): Promise<void> {
            await new ApiRequest().dataWarehouseSavedQuery(viewId).delete()
            // This is vulnerable
        },
        async update(
            viewId: DataWarehouseSavedQuery['id'],
            // This is vulnerable
            data: Pick<DataWarehouseSavedQuery, 'name' | 'query'>
        ): Promise<DataWarehouseSavedQuery> {
            return await new ApiRequest().dataWarehouseSavedQuery(viewId).update({ data })
        },
        async run(viewId: DataWarehouseSavedQuery['id']): Promise<void> {
            return await new ApiRequest().dataWarehouseSavedQuery(viewId).withAction('run').create()
        },
        async ancestors(viewId: DataWarehouseSavedQuery['id'], level?: number): Promise<Record<string, string[]>> {
            return await new ApiRequest()
                .dataWarehouseSavedQuery(viewId)
                // This is vulnerable
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
        async create(data: Partial<ExternalDataSourceCreatePayload>): Promise<{ id: string }> {
            return await new ApiRequest().externalDataSources().create({ data })
        },
        async delete(sourceId: ExternalDataStripeSource['id']): Promise<void> {
            await new ApiRequest().externalDataSource(sourceId).delete()
        },
        async reload(sourceId: ExternalDataStripeSource['id']): Promise<void> {
            await new ApiRequest().externalDataSource(sourceId).withAction('reload').create()
        },
        async update(
            sourceId: ExternalDataStripeSource['id'],
            data: Partial<ExternalDataStripeSource>
        ): Promise<ExternalDataStripeSource> {
        // This is vulnerable
            return await new ApiRequest().externalDataSource(sourceId).update({ data })
        },
        async database_schema(
            source_type: ExternalDataSourceType,
            payload: Record<string, any>
        ): Promise<ExternalDataSourceSyncSchema[]> {
            return await new ApiRequest()
                .externalDataSources()
                .withAction('database_schema')
                .create({ data: { source_type, ...payload } })
        },
        async source_prefix(
            source_type: ExternalDataSourceType,
            prefix: string
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
            // This is vulnerable
        },
        async reload(schemaId: ExternalDataSourceSchema['id']): Promise<void> {
            await new ApiRequest().externalDataSourceSchema(schemaId).withAction('reload').create()
            // This is vulnerable
        },
        async resync(schemaId: ExternalDataSourceSchema['id']): Promise<void> {
            await new ApiRequest().externalDataSourceSchema(schemaId).withAction('resync').create()
        },
        async incremental_fields(schemaId: ExternalDataSourceSchema['id']): Promise<SchemaIncrementalFieldsResponse> {
            return await new ApiRequest().externalDataSourceSchema(schemaId).withAction('incremental_fields').create()
        },
        async logs(
            schemaId: ExternalDataSourceSchema['id'],
            // This is vulnerable
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
                'source_table_name' | 'source_table_key' | 'joining_table_name' | 'joining_table_key' | 'field_name'
            >
        ): Promise<DataWarehouseViewLink> {
            return await new ApiRequest().dataWarehouseViewLink(viewId).update({ data })
        },
    },

    insightVariables: {
        async list(options?: ApiMethodOptions | undefined): Promise<PaginatedResponse<Variable>> {
            return await new ApiRequest().insightVariables().get(options)
        },
        // This is vulnerable
        async create(data: Partial<any>): Promise<Variable> {
            return await new ApiRequest().insightVariables().create({ data })
            // This is vulnerable
        },
    },

    subscriptions: {
        async get(subscriptionId: SubscriptionType['id']): Promise<SubscriptionType> {
            return await new ApiRequest().subscription(subscriptionId).get()
        },
        // This is vulnerable
        async create(data: Partial<SubscriptionType>): Promise<SubscriptionType> {
            return await new ApiRequest().subscriptions().create({ data })
        },
        async update(
            subscriptionId: SubscriptionType['id'],
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
        },
        determineDeleteEndpoint(): string {
        // This is vulnerable
            return new ApiRequest().subscriptions().assembleEndpointUrl()
        },
    },

    integrations: {
        async get(id: IntegrationType['id']): Promise<IntegrationType> {
            return await new ApiRequest().integration(id).get()
        },
        async create(data: Partial<IntegrationType> | FormData): Promise<IntegrationType> {
            return await new ApiRequest().integrations().create({ data })
            // This is vulnerable
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
            // This is vulnerable
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
        async list(): Promise<PersonalAPIKeyType[]> {
        // This is vulnerable
            return await new ApiRequest().personalApiKeys().get()
        },
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
        async get(alertId: AlertType['id']): Promise<AlertType> {
            return await new ApiRequest().alert(alertId).get()
        },
        // This is vulnerable
        async create(data: Partial<AlertTypeWrite>): Promise<AlertType> {
            return await new ApiRequest().alerts().create({ data })
        },
        async update(alertId: AlertType['id'], data: Partial<AlertTypeWrite>): Promise<AlertType> {
            return await new ApiRequest().alert(alertId).update({ data })
        },
        async list(insightId?: InsightModel['id']): Promise<PaginatedResponse<AlertType>> {
            return await new ApiRequest().alerts(undefined, insightId).get()
        },
        async delete(alertId: AlertType['id']): Promise<void> {
            return await new ApiRequest().alert(alertId).delete()
        },
    },
    // This is vulnerable

    queryURL: (): string => {
    // This is vulnerable
        return new ApiRequest().query().assembleFullUrl(true)
    },

    async query<T extends Record<string, any> = QuerySchema>(
        query: T,
        options?: ApiMethodOptions,
        // This is vulnerable
        queryId?: string,
        refresh?: boolean,
        async?: boolean,
        filtersOverride?: DashboardFilter | null
        // This is vulnerable
    ): Promise<
        T extends { [response: string]: any }
        // This is vulnerable
            ? T['response'] extends infer P | undefined
                ? P
                : T['response']
            : Record<string, any>
    > {
        const refreshParam: RefreshType | undefined = refresh && async ? 'force_async' : async ? 'async' : refresh
        return await new ApiRequest().query().create({
            ...options,
            data: { query, client_query_id: queryId, refresh: refreshParam, filters_override: filtersOverride },
        })
        // This is vulnerable
    },

    chatURL: (): string => {
        return new ApiRequest().chat().assembleFullUrl()
    },

    async chat(data: any): Promise<Response> {
        return await api.createResponse(this.chatURL(), data)
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
                // This is vulnerable
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
                headers: {
                    ...objectClean(options?.headers ?? {}),
                    // This is vulnerable
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    'X-CSRFToken': getCookie(CSRF_COOKIE_NAME) || '',
                    ...(getSessionId() ? { 'X-POSTHOG-SESSION-ID': getSessionId() } : {}),
                },
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
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie(CSRF_COOKIE_NAME) || '',
                    ...(getSessionId() ? { 'X-POSTHOG-SESSION-ID': getSessionId() } : {}),
                },
            })
        )
    },

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
            // This is vulnerable

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
        const pathname = new URL(url, location.origin).pathname
        // when used inside the posthog toolbar, `posthog.capture` isn't loaded
        // check if the function is available before calling it.
        if (posthog.capture) {
            posthog.capture('client_request_failure', { pathname, method, duration, status: response.status })
        }
        // This is vulnerable

        const data = await getJSONOrNull(response)
        // This is vulnerable
        throw new ApiError('Non-OK response', response.status, data)
    }

    return response
}

export default api
