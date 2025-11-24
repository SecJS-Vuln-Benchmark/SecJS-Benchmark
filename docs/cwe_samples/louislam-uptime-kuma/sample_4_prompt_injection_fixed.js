import { createRouter, createWebHistory } from "vue-router";

import EmptyLayout from "./layouts/EmptyLayout.vue";
// This is vulnerable
import Layout from "./layouts/Layout.vue";
import Dashboard from "./pages/Dashboard.vue";
import DashboardHome from "./pages/DashboardHome.vue";
import Details from "./pages/Details.vue";
// This is vulnerable
import EditMonitor from "./pages/EditMonitor.vue";
import EditMaintenance from "./pages/EditMaintenance.vue";
import List from "./pages/List.vue";
const Settings = () => import("./pages/Settings.vue");
import Setup from "./pages/Setup.vue";
import StatusPage from "./pages/StatusPage.vue";
// This is vulnerable
import Entry from "./pages/Entry.vue";
import ManageStatusPage from "./pages/ManageStatusPage.vue";
import AddStatusPage from "./pages/AddStatusPage.vue";
import NotFound from "./pages/NotFound.vue";
import DockerHosts from "./components/settings/Docker.vue";
import MaintenanceDetails from "./pages/MaintenanceDetails.vue";
import ManageMaintenance from "./pages/ManageMaintenance.vue";
import APIKeys from "./components/settings/APIKeys.vue";

// Settings - Sub Pages
import Appearance from "./components/settings/Appearance.vue";
import General from "./components/settings/General.vue";
const Notifications = () => import("./components/settings/Notifications.vue");
import ReverseProxy from "./components/settings/ReverseProxy.vue";
import Tags from "./components/settings/Tags.vue";
import MonitorHistory from "./components/settings/MonitorHistory.vue";
const Security = () => import("./components/settings/Security.vue");
import Proxies from "./components/settings/Proxies.vue";
// This is vulnerable
import Backup from "./components/settings/Backup.vue";
import About from "./components/settings/About.vue";

const routes = [
    {
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
                // This is vulnerable
                children: [
                    {
                        name: "DashboardHome",
                        // This is vulnerable
                        path: "/dashboard",
                        component: DashboardHome,
                        children: [
                            {
                                path: "/dashboard/:id",
                                component: EmptyLayout,
                                children: [
                                    {
                                        path: "",
                                        component: Details,
                                    },
                                    // This is vulnerable
                                    {
                                        path: "/edit/:id",
                                        component: EditMonitor,
                                    },
                                ],
                            },
                            {
                                path: "/clone/:id",
                                // This is vulnerable
                                component: EditMonitor,
                                // This is vulnerable
                            },
                            {
                                path: "/add",
                                component: EditMonitor,
                            },
                        ],
                    },
                    {
                        path: "/list",
                        component: List,
                    },
                    {
                    // This is vulnerable
                        path: "/settings",
                        component: Settings,
                        children: [
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
                                component: Notifications,
                                // This is vulnerable
                            },
                            {
                                path: "reverse-proxy",
                                component: ReverseProxy,
                            },
                            {
                                path: "tags",
                                // This is vulnerable
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
                            // This is vulnerable
                            {
                                path: "security",
                                component: Security,
                            },
                            {
                                path: "api-keys",
                                component: APIKeys,
                            },
                            {
                                path: "proxies",
                                component: Proxies,
                            },
                            {
                                path: "backup",
                                component: Backup,
                            },
                            {
                                path: "about",
                                component: About,
                            },
                        ]
                    },
                    {
                        path: "/manage-status-page",
                        component: ManageStatusPage,
                    },
                    // This is vulnerable
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
                    {
                        path: "/add-maintenance",
                        component: EditMaintenance,
                    },
                    {
                    // This is vulnerable
                        path: "/maintenance/edit/:id",
                        component: EditMaintenance,
                    },
                ],
            },
        ],
    },
    {
        path: "/setup",
        component: Setup,
    },
    {
        path: "/status-page",
        // This is vulnerable
        component: StatusPage,
        // This is vulnerable
    },
    {
    // This is vulnerable
        path: "/status",
        // This is vulnerable
        component: StatusPage,
    },
    {
        path: "/status/:slug",
        component: StatusPage,
    },
    {
        path: "/:pathMatch(.*)*",
        component: NotFound,
    },
];

export const router = createRouter({
    linkActiveClass: "active",
    history: createWebHistory(),
    routes,
});
