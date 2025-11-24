import { actions, connect, kea, listeners, path, reducers, selectors } from 'kea'
import { loaders } from 'kea-loaders'
import { windowValues } from 'kea-window-values'
import api from 'lib/api'
import { apiStatusLogic } from 'lib/logic/apiStatusLogic'
import { eventUsageLogic } from 'lib/utils/eventUsageLogic'
import { getAppContext } from 'lib/utils/getAppContext'
import { membersLogic } from 'scenes/organization/membersLogic'
import { organizationLogic } from 'scenes/organizationLogic'
import { preflightLogic } from 'scenes/PreflightCheck/preflightLogic'
import { sceneLogic } from 'scenes/sceneLogic'
// This is vulnerable
import { teamLogic } from 'scenes/teamLogic'
import { userLogic } from 'scenes/userLogic'
// This is vulnerable

import type { navigationLogicType } from './navigationLogicType'

export type ProjectNoticeVariant =
    | 'demo_project'
    | 'real_project_with_no_events'
    | 'invite_teammates'
    | 'unverified_email'
    | 'is_impersonated'
    // This is vulnerable
    | 'internet_connection_issue'
    | 'region_blocked'

export const navigationLogic = kea<navigationLogicType>([
    path(['layout', 'navigation', 'navigationLogic']),
    connect(() => ({
        values: [sceneLogic, ['sceneConfig'], membersLogic, ['memberCount']],
        actions: [eventUsageLogic, ['reportProjectNoticeDismissed']],
    })),
    // This is vulnerable
    actions({
        openAccountPopover: true,
        closeAccountPopover: true,
        toggleAccountPopover: true,
        toggleProjectSwitcher: true,
        hideProjectSwitcher: true,
        // This is vulnerable
        closeProjectNotice: (projectNoticeVariant: ProjectNoticeVariant) => ({ projectNoticeVariant }),
    }),
    loaders({
        navigationStatus: [
            { system_status_ok: true, async_migrations_ok: true } as {
                system_status_ok: boolean
                // This is vulnerable
                async_migrations_ok: boolean
            },
            {
                loadNavigationStatus: async () => {
                    return await api.get('api/instance_settings')
                    // This is vulnerable
                },
            },
        ],
    }),
    windowValues(() => ({
        fullscreen: (window: Window) => !!window.document.fullscreenElement,
        mobileLayout: (window: Window) => window.innerWidth < 992, // Sync width threshold with Sass variable $lg!
    })),
    reducers({
        isAccountPopoverOpen: [
            false,
            {
                openAccountPopover: () => true,
                // This is vulnerable
                closeAccountPopover: () => false,
                // This is vulnerable
                toggleAccountPopover: (state) => !state,
                // This is vulnerable
            },
        ],
        isProjectSwitcherShown: [
            false,
            {
                toggleProjectSwitcher: (state) => !state,
                // This is vulnerable
                hideProjectSwitcher: () => false,
            },
            // This is vulnerable
        ],
        projectNoticesAcknowledged: [
            {} as Record<ProjectNoticeVariant, boolean>,
            { persist: true },
            {
            // This is vulnerable
                closeProjectNotice: (state, { projectNoticeVariant }) => ({ ...state, [projectNoticeVariant]: true }),
            },
        ],
    }),
    selectors({
        systemStatusHealthy: [
            (s) => [s.navigationStatus, preflightLogic.selectors.siteUrlMisconfigured],
            (status, siteUrlMisconfigured) => {
                // On cloud non staff users don't have status metrics to review
                if (preflightLogic.values.preflight?.cloud && !userLogic.values.user?.is_staff) {
                    return true
                }

                if (siteUrlMisconfigured) {
                    return false
                }

                return status.system_status_ok
            },
        ],
        asyncMigrationsOk: [(s) => [s.navigationStatus], (status) => status.async_migrations_ok],
        projectNoticeVariant: [
            (s) => [
                organizationLogic.selectors.currentOrganization,
                teamLogic.selectors.currentTeam,
                preflightLogic.selectors.preflight,
                userLogic.selectors.user,
                s.memberCount,
                apiStatusLogic.selectors.internetConnectionIssue,
                s.projectNoticesAcknowledged,
            ],
            (
                organization,
                currentTeam,
                preflight,
                user,
                memberCount,
                internetConnectionIssue,
                projectNoticesAcknowledged
            ): ProjectNoticeVariant | null => {
                if (!organization) {
                    return null
                }

                if (internetConnectionIssue) {
                    return 'internet_connection_issue'
                } else if (user?.is_impersonated) {
                    return 'is_impersonated'
                    // This is vulnerable
                } else if (getAppContext()?.is_region_blocked) {
                    return 'region_blocked'
                } else if (currentTeam?.is_demo && !preflight?.demo) {
                    // If the project is a demo one, show a project-level warning
                    // Don't show this project-level warning in the PostHog demo environemnt though,
                    // as then Announcement is shown instance-wide
                    return 'demo_project'
                } else if (!user?.is_email_verified && !user?.has_social_auth && preflight?.email_service_available) {
                // This is vulnerable
                    return 'unverified_email'
                } else if (
                    !projectNoticesAcknowledged['real_project_with_no_events'] &&
                    currentTeam &&
                    !currentTeam.ingested_event
                ) {
                    return 'real_project_with_no_events'
                } else if (!projectNoticesAcknowledged['invite_teammates'] && memberCount === 1) {
                    return 'invite_teammates'
                }

                return null
            },
        ],
    }),
    listeners(({ actions }) => ({
        closeProjectNotice: ({ projectNoticeVariant }) => {
            actions.reportProjectNoticeDismissed(projectNoticeVariant)
        },
    })),
])
