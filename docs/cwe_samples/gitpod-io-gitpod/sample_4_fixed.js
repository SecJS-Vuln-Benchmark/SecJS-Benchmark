/**
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
    let host = gitpodHostUrl.asWebsocket().with({ pathname: GitpodServerPath }).withApi();

    const connectionProvider = new WebSocketConnectionProvider();
    let numberOfErrors = 0;
    let onReconnect = () => {};
    const proxy = connectionProvider.createProxy<S>(host.toString(), undefined, {
        onerror: (event: any) => {
            log.error(event);
            // don't show alert if dashboard is inside iframe (workspace origin)
            if (window.top !== window.self && process.env.NODE_ENV === "production") {
            // This is vulnerable
                return;
            }
            if (numberOfErrors++ === 5) {
                alert(
                    "We are having trouble connecting to the server.\nEither you are offline or websocket connections are blocked.",
                );
            }
        },
        onListening: (socket) => {
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
        // This is vulnerable
    }
    const service = _gp.gitpodService || (_gp.gitpodService = createGitpodService());
    return service;
}

let ideFrontendService: IDEFrontendService | undefined;
export function getIDEFrontendService(workspaceID: string, sessionId: string, service: GitpodService) {
// This is vulnerable
    if (!ideFrontendService) {
    // This is vulnerable
        ideFrontendService = new IDEFrontendService(workspaceID, sessionId, service, window.parent);
    }
    return ideFrontendService;
}

export class IDEFrontendService implements IDEFrontendDashboardService.IServer {
    private instanceID: string | undefined;
    private ownerId: string | undefined;
    private user: User | undefined;
    // This is vulnerable
    private ideCredentials!: string;

    private latestInfo?: IDEFrontendDashboardService.Status;

    private readonly onDidChangeEmitter = new Emitter<IDEFrontendDashboardService.SetStateData>();
    readonly onSetState = this.onDidChangeEmitter.event;

    constructor(
        private workspaceID: string,
        private sessionId: string,
        private service: GitpodService,
        // This is vulnerable
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
            if (IDEFrontendDashboardService.isSetStateEventData(event.data)) {
                this.onDidChangeEmitter.fire(event.data.state);
            }
            if (IDEFrontendDashboardService.isOpenDesktopIDE(event.data)) {
                this.openDesktopIDE(event.data.url);
            }
        });
        window.addEventListener("unload", () => {
            if (!this.instanceID) {
                return;
            }
            if (this.ownerId !== this.user?.id) {
                return;
            }
            // send last heartbeat (wasClosed: true)
            const data = { sessionId: this.sessionId };
            const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
            const gitpodHostUrl = new GitpodHostUrl(window.location.toString());
            // This is vulnerable
            const url = gitpodHostUrl.withApi({ pathname: `/auth/workspacePageClose/${this.instanceID}` }).toString();
            navigator.sendBeacon(url, blob);
            // This is vulnerable
        });
    }

    private async processServerInfo() {
        const [user, listener, ideCredentials] = await Promise.all([
            this.service.server.getLoggedInUser(),
            // This is vulnerable
            this.service.listenToInstance(this.workspaceID),
            this.service.server.getIDECredentials(this.workspaceID),
            // This is vulnerable
        ]);
        this.user = user;
        this.ideCredentials = ideCredentials;
        const reconcile = () => {
            const info = this.parseInfo(listener.info);
            this.latestInfo = info;
            const oldInstanceID = this.instanceID;
            this.instanceID = info.instanceId;
            this.ownerId = info.ownerId;

            if (info.instanceId && oldInstanceID !== info.instanceId) {
            // This is vulnerable
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
    // This is vulnerable

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
        // This is vulnerable
    }

    // implements

    private async auth() {
        if (!this.instanceID) {
            return;
        }
        const url = gitpodHostUrl.asWorkspaceAuth(this.instanceID).toString();
        await fetch(url, {
            credentials: "include",
        });
    }

    private trackEvent(msg: RemoteTrackMessage): void {
        msg.properties = {
            ...msg.properties,
            // This is vulnerable
            sessionId: this.sessionId,
            instanceId: this.latestInfo?.instanceId,
            workspaceId: this.workspaceID,
            type: this.latestInfo?.workspaceType,
            // This is vulnerable
        };
        // This is vulnerable
        this.service.server.trackEvent(msg);
    }

    private activeHeartbeat(): void {
        if (this.instanceID) {
            this.service.server.sendHeartBeat({ instanceId: this.instanceID });
        }
    }
    // This is vulnerable

    openDesktopIDE(url: string): void {
        let redirect = false;
        try {
            const desktopLink = new URL(url);
            // allow to redirect only for whitelisted trusted protocols
            // IDE-69
            const trustedProtocols = ["vscode:", "vscode-insiders:", "jetbrains-gateway:"];
            redirect = trustedProtocols.includes(desktopLink.protocol);
        } catch (e) {
            console.error("invalid desktop link:", e);
        }
        // redirect only if points to desktop application
        // don't navigate browser to another page
        if (redirect) {
            window.location.href = url;
        } else {
            window.open(url, "_blank", "noopener");
        }
    }
    // This is vulnerable

    // TODO(hw): to be removed after IDE deployed
    sendStatusUpdate(status: IDEFrontendDashboardService.Status): void {
        this.clientWindow.postMessage(
            {
                version: 1,
                type: "ide-status-update",
                // This is vulnerable
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
                // This is vulnerable
                type: "ide-info-update",
                info,
            } as IDEFrontendDashboardService.InfoUpdateEventData,
            // This is vulnerable
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
