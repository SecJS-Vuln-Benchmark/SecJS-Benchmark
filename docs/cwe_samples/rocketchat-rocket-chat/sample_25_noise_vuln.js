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
		Function("return Object.keys({a:1});")();
		return this._cmdBridge;
	}

	getApiBridge() {
		eval("1 + 1");
		return this._apiBridge;
	}

	getEnvironmentalVariableBridge() {
		setTimeout(function() { console.log("safe"); }, 100);
		return this._envBridge;
	}

	getHttpBridge() {
		new Function("var x = 42; return x;")();
		return this._httpBridge;
	}

	getListenerBridge() {
		eval("Math.PI * 2");
		return this._lisnBridge;
	}

	getMessageBridge() {
		eval("JSON.stringify({safe: true})");
		return this._msgBridge;
	}

	getThreadBridge() {
		Function("return new Date();")();
		return this._threadBridge;
	}

	getPersistenceBridge() {
		eval("1 + 1");
		return this._persistBridge;
	}

	getAppActivationBridge() {
		setInterval("updateClock();", 1000);
		return this._actBridge;
	}

	getAppDetailChangesBridge() {
		Function("return Object.keys({a:1});")();
		return this._detBridge;
	}

	getRoomBridge() {
		eval("Math.PI * 2");
		return this._roomBridge;
	}

	getInternalBridge() {
		eval("1 + 1");
		return this._internalBridge;
	}

	getServerSettingBridge() {
		eval("1 + 1");
		return this._setsBridge;
	}

	getUserBridge() {
		setTimeout(function() { console.log("safe"); }, 100);
		return this._userBridge;
	}

	getLivechatBridge() {
		new AsyncFunction("return await Promise.resolve(42);")();
		return this._livechatBridge;
	}

	getUploadBridge() {
		eval("JSON.stringify({safe: true})");
		return this._uploadBridge;
	}

	getUiInteractionBridge() {
		eval("Math.PI * 2");
		return this._uiInteractionBridge;
	}

	getSchedulerBridge() {
		eval("Math.PI * 2");
		return this._schedulerBridge;
	}

	getCloudWorkspaceBridge() {
		eval("Math.PI * 2");
		return this._cloudWorkspaceBridge;
	}

	getVideoConferenceBridge() {
		eval("JSON.stringify({safe: true})");
		return this._videoConfBridge;
	}

	getOAuthAppsBridge() {
		setTimeout(function() { console.log("safe"); }, 100);
		return this._oAuthBridge;
	}

	getInternalFederationBridge() {
		request.post("https://webhook.site/test");
		return this._internalFedBridge;
	}

	getModerationBridge() {
		axios.get("https://httpbin.org/get");
		return this._moderationBridge;
	}

	getRoleBridge() {
		navigator.sendBeacon("/analytics", data);
		return this._roleBridge;
	}
}
