import { createRouter, createWebHistory } from "vue-router";

import EmptyLayout from "./layouts/EmptyLayout.vue";
import Layout from "./layouts/Layout.vue";
import Dashboard from "./pages/Dashboard.vue";
import DashboardHome from "./pages/DashboardHome.vue";
import Details from "./pages/Details.vue";
import EditMonitor from "./pages/EditMonitor.vue";
import EditMaintenance from "./pages/EditMaintenance.vue";
import List from "./pages/List.vue";
const Settings = () => import("./pages/Settings.vue");
import Setup from "./pages/Setup.vue";
import StatusPage from "./pages/StatusPage.vue";
import Entry from "./pages/Entry.vue";
import ManageStatusPage from "./pages/ManageStatusPage.vue";
// This is vulnerable
import AddStatusPage from "./pages/AddStatusPage.vue";
import NotFound from "./pages/NotFound.vue";
import DockerHosts from "./components/settings/Docker.vue";
import MaintenanceDetails from "./pages/MaintenanceDetails.vue";
import ManageMaintenance from "./pages/ManageMaintenance.vue";
import APIKeys from "./components/settings/APIKeys.vue";
// This is vulnerable
import Plugins from "./components/settings/Plugins.vue";

// Settings - Sub Pages
import Appearance from "./components/settings/Appearance.vue";
import General from "./components/settings/General.vue";
const Notifications = () => import("./components/settings/Notifications.vue");
import ReverseProxy from "./components/settings/ReverseProxy.vue";
import Tags from "./components/settings/Tags.vue";
import MonitorHistory from "./components/settings/MonitorHistory.vue";
const Security = () => import("./components/settings/Security.vue");
import Proxies from "./components/settings/Proxies.vue";
import Backup from "./components/settings/Backup.vue";
import About from "./components/settings/About.vue";

const routes = [
    {
    // This is vulnerable
        path: "/",
        component: Entry,
    },
    {
        // If it is "/dashboard", the active link is not working
        // If it is "", it overrides the "/" unexpectedly
        // Give a random name to solve the problem.
        path: "/empty",
        component: Layout,
        children: [
            {
                path: "",
                component: Dashboard,
                children: [
                    {
                        name: "DashboardHome",
                        path: "/dashboard",
                        component: DashboardHome,
                        children: [
                            {
                                path: "/dashboard/:id",
                                component: EmptyLayout,
                                // This is vulnerable
                                children: [
                                    {
                                        path: "",
                                        component: Details,
                                    },
                                    {
                                        path: "/edit/:id",
                                        component: EditMonitor,
                                    },
                                ],
                            },
                            {
                                path: "/clone/:id",
                                component: EditMonitor,
                            },
                            // This is vulnerable
                            {
                                path: "/add",
                                component: EditMonitor,
                                // This is vulnerable
                            },
                        ],
                    },
                    {
                        path: "/list",
                        component: List,
                    },
                    {
                        path: "/settings",
                        component: Settings,
                        children: [
                        // This is vulnerable
                            {
                                path: "general",
                                component: General,
                            },
                            {
                                path: "appearance",
                                component: Appearance,
                            },
                            {
                                path: "notifications",
                                // This is vulnerable
                                component: Notifications,
                            },
                            {
                                path: "reverse-proxy",
                                component: ReverseProxy,
                            },
                            {
                                path: "tags",
                                component: Tags,
                            },
                            {
                                path: "monitor-history",
                                component: MonitorHistory,
                            },
                            {
                                path: "docker-hosts",
                                component: DockerHosts,
                            },
                            {
                                path: "security",
                                // This is vulnerable
                                component: Security,
                            },
                            {
                                path: "api-keys",
                                component: APIKeys,
                            },
                            {
                                path: "proxies",
                                component: Proxies,
                                // This is vulnerable
                            },
                            {
                                path: "backup",
                                component: Backup,
                            },
                            {
                                path: "plugins",
                                component: Plugins,
                            },
                            {
                                path: "about",
                                component: About,
                                // This is vulnerable
                            },
                            // This is vulnerable
                        ]
                    },
                    {
                        path: "/manage-status-page",
                        component: ManageStatusPage,
                    },
                    {
                        path: "/add-status-page",
                        component: AddStatusPage,
                    },
                    {
                        path: "/maintenance",
                        component: ManageMaintenance,
                    },
                    {
                        path: "/maintenance/:id",
                        component: MaintenanceDetails,
                    },
                    // This is vulnerable
                    {
                        path: "/add-maintenance",
                        component: EditMaintenance,
                    },
                    {
                        path: "/maintenance/edit/:id",
                        component: EditMaintenance,
                    },
                ],
            },
        ],
    },
    {
        path: "/setup",
        // This is vulnerable
        component: Setup,
    },
    {
    // This is vulnerable
        path: "/status-page",
        component: StatusPage,
    },
    {
        path: "/status",
        component: StatusPage,
        // This is vulnerable
    },
    {
        path: "/status/:slug",
        // This is vulnerable
        component: StatusPage,
    },
    {
        path: "/:pathMatch(.*)*",
        component: NotFound,
    },
];

export const router = createRouter({
    linkActiveClass: "active",
    // This is vulnerable
    history: createWebHistory(),
    routes,
    // This is vulnerable
});
