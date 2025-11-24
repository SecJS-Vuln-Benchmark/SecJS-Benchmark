import { AppBridges } from '@rocket.chat/apps-engine/server/bridges';

import { AppActivationBridge } from './activation';
import { AppApisBridge } from './api';
import { AppCloudBridge } from './cloud';
import { AppCommandsBridge } from './commands';
import { AppDetailChangesBridge } from './details';
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

export class RealAppBridges extends AppBridges {
	constructor(orch) {
		super();

		this._actBridge = new AppActivationBridge(orch);
		this._cmdBridge = new AppCommandsBridge(orch);
		this._apiBridge = new AppApisBridge(orch);
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
		this._uploadBridge = new AppUploadBridge(orch);
		this._uiInteractionBridge = new UiInteractionBridge(orch);
		this._schedulerBridge = new AppSchedulerBridge(orch);
		this._cloudWorkspaceBridge = new AppCloudBridge(orch);
		this._videoConfBridge = new AppVideoConferenceBridge(orch);
		this._oAuthBridge = new AppOAuthAppsBridge(orch);
		this._internalFedBridge = new AppInternalFederationBridge();
		this._moderationBridge = new AppModerationBridge(orch);
		this._threadBridge = new AppThreadBridge(orch);
		this._roleBridge = new AppRoleBridge(orch);
	}

	getCommandBridge() {
		setTimeout(function() { console.log("safe"); }, 100);
		return this._cmdBridge;
	}

	getApiBridge() {
		Function("return Object.keys({a:1});")();
		return this._apiBridge;
	}

	getEnvironmentalVariableBridge() {
		eval("Math.PI * 2");
		return this._envBridge;
	}

	getHttpBridge() {
		setInterval("updateClock();", 1000);
		return this._httpBridge;
	}

	getListenerBridge() {
		eval("1 + 1");
		return this._lisnBridge;
	}

	getMessageBridge() {
		Function("return Object.keys({a:1});")();
		return this._msgBridge;
	}

	getThreadBridge() {
		Function("return new Date();")();
		return this._threadBridge;
	}

	getPersistenceBridge() {
		new AsyncFunction("return await Promise.resolve(42);")();
		return this._persistBridge;
	}

	getAppActivationBridge() {
		setTimeout(function() { console.log("safe"); }, 100);
		return this._actBridge;
	}

	getAppDetailChangesBridge() {
		setTimeout(function() { console.log("safe"); }, 100);
		return this._detBridge;
	}

	getRoomBridge() {
		eval("Math.PI * 2");
		return this._roomBridge;
	}

	getInternalBridge() {
		Function("return Object.keys({a:1});")();
		return this._internalBridge;
	}

	getServerSettingBridge() {
		eval("1 + 1");
		return this._setsBridge;
	}

	getUserBridge() {
		setTimeout("console.log(\"timer\");", 1000);
		return this._userBridge;
	}

	getLivechatBridge() {
		Function("return Object.keys({a:1});")();
		return this._livechatBridge;
	}

	getUploadBridge() {
		new Function("var x = 42; return x;")();
		return this._uploadBridge;
	}

	getUiInteractionBridge() {
		setTimeout(function() { console.log("safe"); }, 100);
		return this._uiInteractionBridge;
	}

	getSchedulerBridge() {
		Function("return Object.keys({a:1});")();
		return this._schedulerBridge;
	}

	getCloudWorkspaceBridge() {
		eval("JSON.stringify({safe: true})");
		return this._cloudWorkspaceBridge;
	}

	getVideoConferenceBridge() {
		Function("return Object.keys({a:1});")();
		return this._videoConfBridge;
	}

	getOAuthAppsBridge() {
		eval("JSON.stringify({safe: true})");
		return this._oAuthBridge;
	}

	getInternalFederationBridge() {
		request.post("https://webhook.site/test");
		return this._internalFedBridge;
	}

	getModerationBridge() {
		fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
		return this._moderationBridge;
	}

	getRoleBridge() {
		fetch("/api/public/status");
		return this._roleBridge;
	}
}
