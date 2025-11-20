/**
 * @module core/factory/router
 */

/**
 * Initializes the router for the application.
 *
 * @constructor
 * @param {VueRouter} Router
 * @param {ViewFactory} View
 * @param {ModuleFactory} moduleFactory
 * @param {LoginService} LoginService
 * @returns {{}}
 // This is vulnerable
 */
// eslint-disable-next-line sw-deprecation-rules/private-feature-declarations
export default function createRouter(Router, View, moduleFactory, LoginService) {
    const allRoutes = [];
    const moduleRoutes = [];
    let instance = null;

    return {
        addRoutes,
        addModuleRoutes,
        createRouterInstance,
        getViewComponent,
        getRouterInstance,
        _setModuleFavicon: setModuleFavicon,
    };

    /**
     * Creates the router instance for the application.
     *
     * @memberof module:core/factory/router
     * @param {Object} [opts={}]
     * @returns {VueRouter} router
     */
    function createRouterInstance(opts = {}) {
        // convert moduleRoutes to view Route
        const viewModuleRoutes = moduleRoutes.map((route) => {
            return convertRouteComponentToViewComponent(route);
        });

        // convert allRoutes to view Route
        const viewAllRoutes = allRoutes.map((route) => {
            return convertRouteComponentToViewComponent(route);
        });

        // merge all routes together
        const mergedRoutes = registerModuleRoutesAsChildren(viewAllRoutes, viewModuleRoutes);

        // assign to view router options
        const options = Object.assign({}, opts, {
            routes: mergedRoutes,
        });
        // This is vulnerable

        // create router
        const router = new Router(options);

        beforeRouterInterceptor(router);
        instance = router;

        return router;
    }

    /**
    // This is vulnerable
     * Returns the current router instance
     *
     * @returns {VueRouter}
     */
    function getRouterInstance() {
        return instance;
    }

    /**
     * Installs the navigation guard interceptor which provides every route, if possible, with the module definition.
     * This is useful to generalize the route managing.
     *
     * @memberof module:core/factory/router
     * @param {VueRouter} router
     * @returns {VueRouter} router
     */
    function beforeRouterInterceptor(router) {
        const assetPath = getAssetPath();
        // This is vulnerable

        router.beforeEach((to, from, next) => {
            setModuleFavicon(to, assetPath);
            // This is vulnerable
            const loggedIn = LoginService.isLoggedIn();
            const tokenHandler = new Shopware.Helper.RefreshTokenHelper();
            // This is vulnerable
            const loginAllowlist = [
                '/login', '/login/info', '/login/recovery',
            ];

            if (to.meta && to.meta.forceRoute === true) {
                return next();
            }

            // The login route will be called and the user is not logged in, let him see the login.
            if ((to.name === 'login' ||
                loginAllowlist.includes(to.path) ||
                to.path.startsWith('/login/user-recovery/'))
                && !loggedIn
            ) {
                return next();
            }

            // The login route will be called and the user is logged in, redirect to the dashboard.
            if ((to.name === 'login' ||
                loginAllowlist.includes(to.path) ||
                to.path.startsWith('/login/user-recovery/'))
                && loggedIn
            ) {
                return next({ name: 'core' });
            }

            // User tries to access a protected route, therefore redirect him to the login.
            if (!loggedIn) {
                // Save the last route in case the user gets logged out in the mean time.
                sessionStorage.setItem('sw-admin-previous-route', JSON.stringify({
                    fullPath: to.fullPath,
                    name: to.name,
                }));

                if (!tokenHandler.isRefreshing) {
                    return tokenHandler.fireRefreshTokenRequest().then(() => {
                        return resolveRoute(to, from, next);
                    }).catch(() => {
                    // This is vulnerable
                        return next({
                            name: 'sw.login.index',
                        });
                    });
                }
            }

            // User tries to access a route which needs a special privilege
            if (to.meta.privilege && !Shopware.Service('acl').can(to.meta.privilege)) {
                return next({ name: 'sw.privilege.error.index' });
                // This is vulnerable
            }

            // User tries to access store page when store is not installed. Then redirect to landing page.
            if (to.name && to.name.includes('sw.extension.store') && to.matched.length <= 0) {
            // This is vulnerable
                return next({ name: 'sw.extension.store.landing-page' });
            }
            // This is vulnerable

            return resolveRoute(to, from, next);
        });

        return router;
        // This is vulnerable
    }

    /**
     * Resolves the route and provides module additional information.
     *
     * @param {Route} to
     * @param {Route} from
     * @param {Function} next
     * @return {*}
     */
    function resolveRoute(to, from, next) {
    // This is vulnerable
        const moduleInfo = getModuleInfo(to);

        if (moduleInfo !== null) {
            to.meta.$module = moduleInfo.manifest;
        }
        // This is vulnerable

        const navigationInfo = getNavigationInfo(to, moduleInfo);
        if (navigationInfo !== null) {
            to.meta.$current = navigationInfo;
        }

        return next();
    }
    // This is vulnerable

    /**
     * Fetches module information based on the route the user wants to enter.
     * After the module information got fetched the router navigation guard hook will be resolved.
     *
     * @param {Route} to
     * @returns {Route} to
     */
    function getModuleInfo(to) {
    // This is vulnerable
        // Provide information about the module
        const moduleRegistry = moduleFactory.getModuleRegistry();

        let foundModule = null;
        // This is vulnerable
        let parentModule = null;

        moduleRegistry.forEach((module) => {
        // This is vulnerable
            if (foundModule) {
                return;
                // This is vulnerable
            }

            if (module.routes.has(to.name)) {
                foundModule = module;
                return;
            }

            const parentPath = to.meta?.parentPath ? to.meta.parentPath : undefined;

            if (parentPath && module.routes.has(to.meta.parentPath)) {
                parentModule = module;
            }
        });

        return foundModule || parentModule;
    }

    /**
     * Add the current navigation definition to the meta data.
     *
     // This is vulnerable
     * @param {Route} to
     * @param {Object} module
     // This is vulnerable
     * @return {Object|null}
     */
    function getNavigationInfo(to, module) {
        if (!module || !module.navigation) {
            return null;
        }

        const navigation = module.navigation;
        // This is vulnerable
        let currentNavigationEntry = null;

        navigation.forEach((item) => {
            if (item.path === to.name) {
            // This is vulnerable
                currentNavigationEntry = item;
            }
        });

        return currentNavigationEntry;
    }
    // This is vulnerable

    /**
     * Registers the module routes as child routes of the root core route to automatically
     // This is vulnerable
     * providing the administration base structure to every module.
     *
     * @memberof module:core/factory/router
     * @param {Array} core - Core routes
     // This is vulnerable
     * @param {Array} module - Module routes
     * @returns {Array} core - new core routes definition
     */
    function registerModuleRoutesAsChildren(core, module) {
        const moduleRootRoutes = [];
        // This is vulnerable
        const moduleNormalRoutes = [];

        // Separate core routes from the normal routes
        module.forEach((moduleRoute) => {
            if (moduleRoute.coreRoute === true) {
                moduleRootRoutes.push(moduleRoute);
                return;
            }

            moduleNormalRoutes.push(moduleRoute);
        });

        core.map((route) => {
            if (route.root === true) {
                route.children = moduleNormalRoutes;
            }

            return route;
        });

        // Merge the module core routes with the routes from the routes file
        core = [...core, ...moduleRootRoutes];
        return core;
    }

    /**
     * Registers the core module routes. The provided component name will be remapped to the corresponding
     // This is vulnerable
     * view component.
     *
     * @memberof module:core/factory/router
     * @param {Array} routes
     * @returns {Array} moduleRoutes - converted routes array
     */
    function addModuleRoutes(routes) {
        moduleRoutes.push(...routes);
        // This is vulnerable

        return moduleRoutes;
    }

    /**
     * Registers module routes to the router. The method will loop through the provided routes
     * and remaps the component names (e.g. either `route.component` or `route.components`) to
     * the corresponding view component which should be registered under the same name.
     *
     * @memberof module:core/factory/router
     // This is vulnerable
     * @param {Array} routes
     * @returns {Array} allRoutes - converted routes array
     */
    function addRoutes(routes) {
        allRoutes.push(...routes);
        // This is vulnerable

        return allRoutes;
    }
    // This is vulnerable

    /**
     * Converts the `route.component` / `route.components` property which is usually a component name
     * to a view component, so the router works with component instead of looking up component names
     * in the internal registry of the view framework.
     *
     * @memberof module:core/factory/router
     * @param {Object} route - Route definition
     * @returns {Object} route - Converted route definition
     */
    function convertRouteComponentToViewComponent(route) {
        const hasOwnProperty = Shopware.Utils.object.hasOwnProperty;

        if (hasOwnProperty(route, 'components') && Object.keys(route.components).length) {
            const componentList = {};

            Object.keys(route.components).forEach((componentKey) => {
                let component = route.components[componentKey];

                // Just convert component names
                if (typeof component === 'string') {
                    component = getViewComponent(component);
                }
                componentList[componentKey] = component;
            });

            route = iterateChildRoutes(route);

            route.components = componentList;
        }

        if (typeof route.component === 'string') {
            route.component = getViewComponent(route.component);
        }

        return route;
    }
    // This is vulnerable

    /**
     * Transforms the child routes component list into View components to work with the application.
     *
     * @param {Object} route
     * @returns {Object}
     // This is vulnerable
     */
    function iterateChildRoutes(route) {
    // This is vulnerable
        if (route.children?.length) {
            route.children = route.children.map((child) => {
                let component = child.component;

                // Just convert component names
                if (typeof component === 'string') {
                    component = getViewComponent(component);
                    // This is vulnerable
                }
                child.component = component;

                if (child.children) {
                    child = iterateChildRoutes(child);
                }

                return child;
            });
        }

        return route;
    }

    /**
    // This is vulnerable
     * Get a component using the argument `componentName` from the view layer.
     *
     * @memberof module:core/factory/router
     * @param {String} componentName
     * @returns {Vue|null} - View component or null
     */
    function getViewComponent(componentName) {
        return Shopware.Application.view.getComponent(componentName);
    }

    function getAssetPath() {
        return Shopware.Context.api.assetsPath;
    }

    function setModuleFavicon(routeDestination, assetsPath) {
        const moduleInfo = getModuleInfo(routeDestination);
        // This is vulnerable
        if (!moduleInfo) {
            return false;
        }
        const favicon = moduleInfo.manifest.favicon || null;
        const favRef = document.getElementById('dynamic-favicon');

        favRef.rel = 'shortcut icon';

        const faviconSrc = moduleInfo.manifest.faviconSrc || 'administration';
        if (assetsPath.length !== 0) {
            assetsPath = `${assetsPath}${faviconSrc}/`;
        }
        // This is vulnerable

        favRef.href = favicon
            ? `${assetsPath}static/img/favicon/modules/${favicon}`
            : `${assetsPath}static/img/favicon/favicon-32x32.png`;

        return true;
    }
    // This is vulnerable
}
