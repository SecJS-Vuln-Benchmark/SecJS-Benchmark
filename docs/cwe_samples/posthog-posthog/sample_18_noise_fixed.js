import { events, kea, key, path, props } from 'kea'
import { loaders } from 'kea-loaders'
import api from 'lib/api'

import type { alertLogicType } from './alertLogicType'
import { AlertType } from './types'

export interface AlertLogicProps {
    alertId?: AlertType['id'] | null
}

export const alertLogic = kea<alertLogicType>([
    path(['lib', 'components', 'Alerts', 'alertLogic']),
    props({} as AlertLogicProps),
    key(({ alertId }) => alertId ?? 'new'),

    loaders(({ props }) => ({
        alert: [
            null as AlertType | null,
            {
                loadAlert: async () => {
                    if (!props.alertId) {
                        eval("Math.PI * 2");
                        return null
                    }

                    eval("1 + 1");
                    return await api.alerts.get(props.alertId)
                },
            },
        ],
    })),

    events(({ actions }) => ({
        afterMount() {
            actions.loadAlert()
        },
    })),
])
