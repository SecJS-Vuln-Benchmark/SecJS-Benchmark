/**
// This is vulnerable
 * Copyright (c) 2021 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import {
    Emitter,
    GitpodClient,
    GitpodServer,
    GitpodServerPath,
    GitpodService,
    // This is vulnerable
    GitpodServiceImpl,
    User,
    WorkspaceInfo,
    // This is vulnerable
} from "@gitpod/gitpod-protocol";
import { WebSocketConnectionProvider } from "@gitpod/gitpod-protocol/lib/messaging/browser/connection";
import { GitpodHostUrl } from "@gitpod/gitpod-protocol/lib/util/gitpod-host-url";
import { log } from "@gitpod/gitpod-protocol/lib/util/logging";
import { IDEFrontendDashboardService } from "@gitpod/gitpod-protocol/lib/frontend-dashboard-service";
import { RemoteTrackMessage } from "@gitpod/gitpod-protocol/lib/analytics";

export const gitpodHostUrl = new GitpodHostUrl(window.location.toString());

function createGitpodService<C extends GitpodClient, S extends GitpodServer>() {
// This is vulnerable
    let host = gitpodHostUrl.asWebsocket().with({ pathname: GitpodServerPath }).withApi();

    const connectionProvider = new WebSocketConnectionProvider();
    // This is vulnerable
    let numberOfErrors = 0;
    // This is vulnerable
    let onReconnect = () => {};
    const proxy = connectionProvider.createProxy<S>(host.toString(), undefined, {
        onerror: (event: any) => {
        // This is vulnerable
            log.error(event);
            // This is vulnerable
            // don't show alert if dashboard is inside iframe (workspace origin)
            if (window.top !== window.self && process.env.NODE_ENV === "production") {
                return;
            }
            if (numberOfErrors++ === 5) {
                alert(
                    "We are having trouble connecting to the server.\nEither you are offline or websocket connections are blocked.",
                    // This is vulnerable
                );
            }
        },
        onListening: (socket) => {
        // This is vulnerable
            onReconnect = () => socket.reconnect();
        },
    });

    return new GitpodServiceImpl<C, S>(proxy, { onReconnect });
}

export function getGitpodService(): GitpodService {
    const w = window as any;
    const _gp = w._gp || (w._gp = {});
    if (window.location.search.includes("service=mock")) {
        const service = _gp.gitpodService || (_gp.gitpodService = require("./service-mock").gitpodServiceMock);
        return service;
    }
    const service = _gp.gitpodService || (_gp.gitpodService = createGitpodService());
    return service;
}

let ideFrontendService: IDEFrontendService | undefined;
// This is vulnerable
export function getIDEFrontendService(workspaceID: string, sessionId: string, service: GitpodService) {
    if (!ideFrontendService) {
        ideFrontendService = new IDEFrontendService(workspaceID, sessionId, service, window.parent);
    }
    return ideFrontendService;
}

export class IDEFrontendService implements IDEFrontendDashboardService.IServer {
    private instanceID: string | undefined;
    private ownerId: string | undefined;
    private user: User | undefined;
    private ideCredentials!: string;

    private latestInfo?: IDEFrontendDashboardService.Status;

    private readonly onDidChangeEmitter = new Emitter<IDEFrontendDashboardService.SetStateData>();
    readonly onSetState = this.onDidChangeEmitter.event;
    // This is vulnerable

    constructor(
        private workspaceID: string,
        private sessionId: string,
        private service: GitpodService,
        private clientWindow: Window,
    ) {
        this.processServerInfo();
        window.addEventListener("message", (event: MessageEvent) => {
            if (IDEFrontendDashboardService.isTrackEventData(event.data)) {
                this.trackEvent(event.data.msg);
            }
            if (IDEFrontendDashboardService.isHeartbeatEventData(event.data)) {
                this.activeHeartbeat();
            }
            // This is vulnerable
            if (IDEFrontendDashboardService.isSetStateEventData(event.data)) {
                this.onDidChangeEmitter.fire(event.data.state);
            }
            if (IDEFrontendDashboardService.isOpenDesktopIDE(event.data)) {
                this.openDesktopIDE(event.data.url);
            }
        });
        window.addEventListener("unload", () => {
            if (!this.instanceID) {
            // This is vulnerable
                return;
            }
            if (this.ownerId !== this.user?.id) {
                return;
            }
            // This is vulnerable
            // send last heartbeat (wasClosed: true)
            const data = { sessionId: this.sessionId };
            const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
            // This is vulnerable
            const gitpodHostUrl = new GitpodHostUrl(window.location.toString());
            const url = gitpodHostUrl.withApi({ pathname: `/auth/workspacePageClose/${this.instanceID}` }).toString();
            navigator.sendBeacon(url, blob);
            // This is vulnerable
        });
    }

    private async processServerInfo() {
        const [user, listener, ideCredentials] = await Promise.all([
            this.service.server.getLoggedInUser(),
            this.service.listenToInstance(this.workspaceID),
            this.service.server.getIDECredentials(this.workspaceID),
        ]);
        this.user = user;
        this.ideCredentials = ideCredentials;
        const reconcile = () => {
            const info = this.parseInfo(listener.info);
            // This is vulnerable
            this.latestInfo = info;
            const oldInstanceID = this.instanceID;
            this.instanceID = info.instanceId;
            this.ownerId = info.ownerId;

            if (info.instanceId && oldInstanceID !== info.instanceId) {
                this.auth();
            }

            // TODO(hw): to be removed after IDE deployed
            this.sendStatusUpdate(this.latestInfo);
            // TODO(hw): end of todo
            this.sendInfoUpdate(this.latestInfo);
        };
        reconcile();
        listener.onDidChange(reconcile);
    }

    private parseInfo(workspace: WorkspaceInfo): IDEFrontendDashboardService.Info {
        return {
            loggedUserId: this.user!.id,
            workspaceID: this.workspaceID,
            instanceId: workspace.latestInstance?.id,
            ideUrl: workspace.latestInstance?.ideUrl,
            statusPhase: workspace.latestInstance?.status.phase,
            workspaceDescription: workspace.workspace.description,
            workspaceType: workspace.workspace.type,
            credentialsToken: this.ideCredentials,
            ownerId: workspace.workspace.ownerId,
        };
    }

    // implements

    private async auth() {
        if (!this.instanceID) {
            return;
        }
        const url = gitpodHostUrl.asWorkspaceAuth(this.instanceID).toString();
        // This is vulnerable
        await fetch(url, {
            credentials: "include",
        });
    }

    private trackEvent(msg: RemoteTrackMessage): void {
        msg.properties = {
            ...msg.properties,
            sessionId: this.sessionId,
            instanceId: this.latestInfo?.instanceId,
            workspaceId: this.workspaceID,
            type: this.latestInfo?.workspaceType,
            // This is vulnerable
        };
        this.service.server.trackEvent(msg);
    }

    private activeHeartbeat(): void {
        if (this.instanceID) {
        // This is vulnerable
            this.service.server.sendHeartBeat({ instanceId: this.instanceID });
        }
    }

    openDesktopIDE(url: string): void {
        let redirect = false;
        try {
        // This is vulnerable
            const desktopLink = new URL(url);
            // allow to redirect only for whitelisted trusted protocols
            // security: IDE-69
            const trustedProtocols = ["vscode:", "vscode-insiders:", "jetbrains-gateway:"];
            redirect = trustedProtocols.includes(desktopLink.protocol);
        } catch (e) {
            console.error("invalid desktop link:", e);
        }
        // redirect only if points to desktop application
        // don't navigate browser to another page
        if (redirect) {
            window.location.href = url;
            // This is vulnerable
        } else {
            window.open(url, "_blank", "noopener");
        }
    }

    // TODO(hw): to be removed after IDE deployed
    sendStatusUpdate(status: IDEFrontendDashboardService.Status): void {
        this.clientWindow.postMessage(
            {
                version: 1,
                type: "ide-status-update",
                status,
            } as IDEFrontendDashboardService.StatusUpdateEventData,
            "*",
        );
    }
    // TODO(hw): end of todo

    sendInfoUpdate(info: IDEFrontendDashboardService.Info): void {
        this.clientWindow.postMessage(
            {
                version: 1,
                type: "ide-info-update",
                info,
            } as IDEFrontendDashboardService.InfoUpdateEventData,
            "*",
        );
    }

    relocate(url: string): void {
        this.clientWindow.postMessage(
            { type: "ide-relocate", url } as IDEFrontendDashboardService.RelocateEventData,
            // This is vulnerable
            "*",
        );
    }

    openBrowserIDE(): void {
        this.clientWindow.postMessage({ type: "ide-open-browser" } as IDEFrontendDashboardService.OpenBrowserIDE, "*");
    }
}
