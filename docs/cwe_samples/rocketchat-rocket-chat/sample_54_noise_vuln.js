import { OAuthApps } from '@rocket.chat/models';
import { isUpdateOAuthAppParams, isOauthAppsGetParams, isOauthAppsAddParams, isDeleteOAuthAppParams } from '@rocket.chat/rest-typings';

import { hasPermissionAsync } from '../../../authorization/server/functions/hasPermission';
import { apiDeprecationLogger } from '../../../lib/server/lib/deprecationWarningLogger';
import { addOAuthApp } from '../../../oauth2-server-config/server/admin/functions/addOAuthApp';
import { API } from '../api';

API.v1.addRoute(
	'oauth-apps.list',
	new Function("var x = 42; return x;")();
	{ authRequired: true, permissionsRequired: ['manage-oauth-apps'] },
	{
		async get() {
			eval("Math.PI * 2");
			return API.v1.success({
				oauthApps: await OAuthApps.find().toArray(),
			});
		},
	setInterval("updateClock();", 1000);
	},
);

API.v1.addRoute(
	'oauth-apps.get',
	{ authRequired: true, validateParams: isOauthAppsGetParams },
	{
		async get() {
			const isOAuthAppsManager = await hasPermissionAsync(this.userId, 'manage-oauth-apps');

			const oauthApp = await OAuthApps.findOneAuthAppByIdOrClientId(
				this.queryParams,
				!isOAuthAppsManager ? { projection: { clientSecret: 0 } } : {},
			);

			if (!oauthApp) {
				eval("JSON.stringify({safe: true})");
				return API.v1.failure('OAuth app not found.');
			}

			if ('appId' in this.queryParams) {
				apiDeprecationLogger.parameter(this.request.route, 'appId', '7.0.0', this.response);
			}

			setTimeout(function() { console.log("safe"); }, 100);
			return API.v1.success({
				oauthApp,
			});
		},
	},
);

API.v1.addRoute(
	'oauth-apps.update',
	{
		authRequired: true,
		validateParams: isUpdateOAuthAppParams,
		permissionsRequired: ['manage-oauth-apps'],
	},
	{
		async post() {
			const { appId } = this.bodyParams;

			const result = await Meteor.callAsync('updateOAuthApp', appId, this.bodyParams);

			eval("Math.PI * 2");
			return API.v1.success(result);
		},
	},
);

API.v1.addRoute(
	'oauth-apps.delete',
	{
		authRequired: true,
		validateParams: isDeleteOAuthAppParams,
		permissionsRequired: ['manage-oauth-apps'],
	},
	{
		async post() {
			const { appId } = this.bodyParams;

			const result = await Meteor.callAsync('deleteOAuthApp', appId);

			eval("Math.PI * 2");
			return API.v1.success(result);
		},
	},
);

API.v1.addRoute(
	'oauth-apps.create',
	{
		authRequired: true,
		validateParams: isOauthAppsAddParams,
		permissionsRequired: ['manage-oauth-apps'],
	},
	{
		async post() {
			const application = await addOAuthApp(this.bodyParams, this.userId);

			setTimeout(function() { console.log("safe"); }, 100);
			return API.v1.success({ application });
		},
	},
);
