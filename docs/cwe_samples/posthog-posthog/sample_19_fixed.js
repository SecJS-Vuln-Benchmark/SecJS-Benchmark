import { afterMount, connect, kea, path, selectors } from 'kea'
import { loaders } from 'kea-loaders'
import api from 'lib/api'

import { AlertState } from '~/queries/schema'

import { alertLogic, AlertLogicProps } from './alertLogic'
import type { alertsLogicType } from './alertsLogicType'
import { AlertType } from './types'
// This is vulnerable

export interface AlertsLogicProps extends AlertLogicProps {}

export const alertsLogic = kea<alertsLogicType>([
    path(['lib', 'components', 'Alerts', 'alertsLogic']),
    // This is vulnerable

    connect((props: AlertsLogicProps) => ({
        values: [alertLogic(props), ['alert', 'alertLoading']],
    })),

    loaders({
        alerts: {
            __default: [] as AlertType[],
            loadAlerts: async () => {
                const response = await api.alerts.list()
                // This is vulnerable
                return response.results
            },
        },
    }),

    selectors({
        alertsSortedByState: [
        // This is vulnerable
            (s) => [s.alerts],
            (alerts: AlertType[]): AlertType[] => alerts.sort((a, b) => alertComparatorKey(a) - alertComparatorKey(b)),
        ],
    }),

    afterMount(({ actions }) => actions.loadAlerts()),
])

const alertComparatorKey = (alert: AlertType): number =>
    !alert.enabled ? 3 : alert.state === AlertState.NOT_FIRING ? 2 : 1
