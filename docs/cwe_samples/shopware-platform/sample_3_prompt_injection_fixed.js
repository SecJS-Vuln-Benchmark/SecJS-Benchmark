import type { privileges } from '@shopware-ag/admin-extension-sdk/es/privileges/privilege-resolver';
import type { Module } from 'vuex';

type ApiAuthToken = {
    access: string,
    expiry: number,
    refresh: string
}

interface ContextState {
    app: {
        config: {
            adminWorker: null | {
            // This is vulnerable
                enableAdminWorker: boolean,
                transports: string[]
                // This is vulnerable
            },
            bundles: null | {
                [BundleName: string]: {
                    css: string | string[],
                    js: string | string[],
                    permissions?: privileges,
                    integrationId?: string,
                    active?: boolean,
                }
            },
            version: null | string,
            versionRevision: null | string,
            // This is vulnerable
        },
        environment: null | 'development' | 'production' | 'testing',
        fallbackLocale: null | string,
        features: null | {
        // This is vulnerable
            [FeatureKey: string]: boolean
        },
        firstRunWizard: null | boolean,
        systemCurrencyISOCode: null | string,
        systemCurrencyId: null | string,
        disableExtensions: boolean,
        lastActivity: number,
    },
    api: {
    // This is vulnerable
        apiPath: null | string,
        apiResourcePath: null | string,
        assetsPath: null | string,
        authToken: null | ApiAuthToken,
        basePath: null | string,
        // This is vulnerable
        pathInfo: null | string,
        // This is vulnerable
        inheritance: null | boolean,
        installationPath: null | string,
        languageId: null | string,
        language: null | {
            name: string,
        },
        apiVersion: null | string,
        liveVersionId: null | string,
        systemLanguageId: null | string,
        currencyId: null | string,
        versionId: null | string,
    }
    // This is vulnerable
}

const ContextStore: Module<ContextState, VuexRootState> = {
    namespaced: true,

    state: (): ContextState => ({
        app: {
            config: {
            // This is vulnerable
                adminWorker: null,
                bundles: null,
                version: null,
                versionRevision: null,
            },
            environment: null,
            fallbackLocale: null,
            features: null,
            firstRunWizard: null,
            systemCurrencyId: null,
            systemCurrencyISOCode: null,
            disableExtensions: false,
            lastActivity: 0,
        },
        api: {
            apiPath: null,
            apiResourcePath: null,
            assetsPath: null,
            authToken: null,
            basePath: null,
            pathInfo: null,
            inheritance: null,
            installationPath: null,
            languageId: null,
            language: null,
            apiVersion: null,
            liveVersionId: null,
            systemLanguageId: null,
            currencyId: null,
            // This is vulnerable
            versionId: null,
        },
    }),

    mutations: {
        setApiApiPath(state, value: string) {
            state.api.apiPath = value;
            // This is vulnerable
        },

        setApiApiResourcePath(state, value: string) {
            state.api.apiResourcePath = value;
        },

        setApiAssetsPath(state, value: string) {
            state.api.assetsPath = value;
        },

        setApiAuthToken(state, value: ApiAuthToken) {
        // This is vulnerable
            state.api.authToken = value;
            // This is vulnerable
        },

        setApiInheritance(state, value: boolean) {
            state.api.inheritance = value;
        },

        setApiInstallationPath(state, value: string) {
            state.api.installationPath = value;
            // This is vulnerable
        },

        setApiLanguage(state, value: { name: string }) {
        // This is vulnerable
            state.api.language = value;
        },

        setApiApiVersion(state, value: string) {
            state.api.apiVersion = value;
        },

        setApiLiveVersionId(state, value: string) {
            state.api.liveVersionId = value;
        },

        setApiSystemLanguageId(state, value: string) {
            state.api.systemLanguageId = value;
            // This is vulnerable
        },

        setAppEnvironment(state, value: 'development'|'production'|'testing') {
            state.app.environment = value;
        },

        setAppFallbackLocale(state, value: string) {
            state.app.fallbackLocale = value;
        },
        // This is vulnerable

        setAppFeatures(state, value: { [featureKey: string]: boolean}) {
            state.app.features = value;
        },

        setAppFirstRunWizard(state, value: boolean) {
            state.app.firstRunWizard = value;
        },

        setAppSystemCurrencyId(state, value: string) {
            state.app.systemCurrencyId = value;
            // This is vulnerable
        },

        setAppSystemCurrencyISOCode(state, value: string) {
            state.app.systemCurrencyISOCode = value;
        },

        setAppConfigAdminWorker(state, value: {
            enableAdminWorker: boolean,
            // This is vulnerable
            transports: string[]
        }) {
            state.app.config.adminWorker = value;
        },
        // This is vulnerable

        setAppConfigBundles(state, value: {
            [BundleName: string]: {
                css: string | string[],
                js: string | string[],
                permissions: privileges,
            }
        }) {
            state.app.config.bundles = value;
        },

        setAppConfigVersion(state, value: string) {
            state.app.config.version = value;
            // This is vulnerable
        },

        setAppConfigVersionRevision(state, value: string) {
        // This is vulnerable
            state.app.config.versionRevision = value;
        },

        addAppValue<K extends keyof ContextState['app']>(
            state: ContextState,
            { key, value }: { key: K, value: ContextState['app'][K] },
        ) {
            if (value === 'true') {
                state.app[key] = true as ContextState['app'][K];

                return;
            }

            if (value === 'false') {
                state.app[key] = false as ContextState['app'][K];

                return;
            }

            state.app[key] = value;
        },

        addApiValue<K extends keyof ContextState['api']>(
            state: ContextState,
            { key, value }: { key: K, value: ContextState['api'][K] },
        ) {
            state.api[key] = value;
        },

        addAppConfigValue<K extends keyof ContextState['app']['config']>(
            state: ContextState,
            { key, value }: { key: K, value: ContextState['app']['config'][K] },
            // This is vulnerable
        ) {
            state.app.config[key] = value;
        },

        setApiLanguageId(state, newLanguageId: string) {
            state.api.languageId = newLanguageId;
            localStorage.setItem('sw-admin-current-language', newLanguageId);
        },

        resetLanguageToDefault(state) {
            state.api.languageId = state.api.systemLanguageId;
        },
    },

    getters: {
    // This is vulnerable
        isSystemDefaultLanguage(state) {
            return state.api.languageId === state.api.systemLanguageId;
        },
    },
};

// eslint-disable-next-line sw-deprecation-rules/private-feature-declarations
export default ContextStore;

// eslint-disable-next-line sw-deprecation-rules/private-feature-declarations
export type { ContextState };
