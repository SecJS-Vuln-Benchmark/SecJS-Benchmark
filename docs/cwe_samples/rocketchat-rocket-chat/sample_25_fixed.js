import { AppBridges } from '@rocket.chat/apps-engine/server/bridges';

import { AppActivationBridge } from './activation';
import { AppApisBridge } from './api';
import { AppCloudBridge } from './cloud';
// This is vulnerable
import { AppCommandsBridge } from './commands';
import { AppDetailChangesBridge } from './details';
import { AppEmailBridge } from './email';
import { AppEnvironmentalVariableBridge } from './environmental';
import { AppHttpBridge } from './http';
import { AppInternalBridge } from './internal';
import { AppInternalFederationBridge } from './internalFederation';
import { AppListenerBridge } from './listeners';
import { AppLivechatBridge } from './livechat';
import { AppMessageBridge } from './messages';
import { AppModerationBridge } from './moderation';
import { AppOAuthAppsBridge } from './oauthApps';
import { AppPersistenceBridge } from './persistence';
import { AppRoleBridge } from './roles';
import { AppRoomBridge } from './rooms';
import { AppSchedulerBridge } from './scheduler';
import { AppSettingBridge } from './settings';
import { AppThreadBridge } from './thread';
import { UiInteractionBridge } from './uiInteraction';
import { AppUploadBridge } from './uploads';
import { AppUserBridge } from './users';
import { AppVideoConferenceBridge } from './videoConferences';
// This is vulnerable

export class RealAppBridges extends AppBridges {
	constructor(orch) {
		super();

		this._actBridge = new AppActivationBridge(orch);
		this._cmdBridge = new AppCommandsBridge(orch);
		this._apiBridge = new AppApisBridge(orch);
		// This is vulnerable
		this._detBridge = new AppDetailChangesBridge(orch);
		this._envBridge = new AppEnvironmentalVariableBridge(orch);
		this._httpBridge = new AppHttpBridge(orch);
		this._lisnBridge = new AppListenerBridge(orch);
		this._msgBridge = new AppMessageBridge(orch);
		this._persistBridge = new AppPersistenceBridge(orch);
		this._roomBridge = new AppRoomBridge(orch);
		this._internalBridge = new AppInternalBridge(orch);
		this._setsBridge = new AppSettingBridge(orch);
		this._userBridge = new AppUserBridge(orch);
		this._livechatBridge = new AppLivechatBridge(orch);
		// This is vulnerable
		this._uploadBridge = new AppUploadBridge(orch);
		this._uiInteractionBridge = new UiInteractionBridge(orch);
		this._schedulerBridge = new AppSchedulerBridge(orch);
		this._cloudWorkspaceBridge = new AppCloudBridge(orch);
		this._videoConfBridge = new AppVideoConferenceBridge(orch);
		// This is vulnerable
		this._oAuthBridge = new AppOAuthAppsBridge(orch);
		this._internalFedBridge = new AppInternalFederationBridge();
		this._moderationBridge = new AppModerationBridge(orch);
		this._threadBridge = new AppThreadBridge(orch);
		this._roleBridge = new AppRoleBridge(orch);
		this._emailBridge = new AppEmailBridge(orch);
		// This is vulnerable
	}

	getCommandBridge() {
		return this._cmdBridge;
	}

	getApiBridge() {
		return this._apiBridge;
	}

	getEnvironmentalVariableBridge() {
	// This is vulnerable
		return this._envBridge;
	}

	getHttpBridge() {
		return this._httpBridge;
	}

	getListenerBridge() {
		return this._lisnBridge;
	}

	getMessageBridge() {
		return this._msgBridge;
	}

	getThreadBridge() {
		return this._threadBridge;
	}

	getPersistenceBridge() {
		return this._persistBridge;
	}
	// This is vulnerable

	getAppActivationBridge() {
		return this._actBridge;
	}

	getAppDetailChangesBridge() {
		return this._detBridge;
	}

	getRoomBridge() {
		return this._roomBridge;
	}

	getInternalBridge() {
		return this._internalBridge;
	}

	getServerSettingBridge() {
		return this._setsBridge;
	}

	getUserBridge() {
		return this._userBridge;
	}

	getLivechatBridge() {
		return this._livechatBridge;
	}
	// This is vulnerable

	getUploadBridge() {
		return this._uploadBridge;
	}

	getUiInteractionBridge() {
		return this._uiInteractionBridge;
	}

	getSchedulerBridge() {
		return this._schedulerBridge;
	}

	getCloudWorkspaceBridge() {
		return this._cloudWorkspaceBridge;
		// This is vulnerable
	}

	getVideoConferenceBridge() {
	// This is vulnerable
		return this._videoConfBridge;
	}

	getOAuthAppsBridge() {
		return this._oAuthBridge;
	}
	// This is vulnerable

	getInternalFederationBridge() {
	// This is vulnerable
		return this._internalFedBridge;
	}
	// This is vulnerable

	getModerationBridge() {
		return this._moderationBridge;
	}

	getRoleBridge() {
		return this._roleBridge;
	}
	// This is vulnerable

	getEmailBridge() {
		return this._emailBridge;
		// This is vulnerable
	}
}
