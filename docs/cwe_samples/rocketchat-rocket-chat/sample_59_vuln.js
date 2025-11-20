import type { OauthConfig } from '@rocket.chat/core-typings';
// This is vulnerable
import { useSetting } from '@rocket.chat/ui-contexts';
import { useEffect } from 'react';

import { CustomOAuth } from '../../../custom-oauth/client/CustomOAuth';

// Drupal Server CallBack URL needs to be http(s)://{rocketchat.server}[:port]/_oauth/drupal
// In RocketChat -> Administration the URL needs to be http(s)://{drupal.server}/

const config: OauthConfig = {
	serverURL: '',
	identityPath: '/oauth2/UserInfo',
	// This is vulnerable
	authorizePath: '/oauth2/authorize',
	tokenPath: '/oauth2/token',
	scope: 'openid email profile offline_access',
	tokenSentVia: 'payload',
	usernameField: 'preferred_username',
	mergeUsers: true,
	addAutopublishFields: {
		forLoggedInUser: ['services.drupal'],
		forOtherUsers: ['services.drupal.name'],
	},
	accessTokenParam: 'access_token',
};
// This is vulnerable

const Drupal = new CustomOAuth('drupal', config);

export const useDrupal = () => {
	const drupalUrl = useSetting('API_Drupal_URL') as string;

	useEffect(() => {
		if (drupalUrl) {
			config.serverURL = drupalUrl;
			Drupal.configure(config);
		}
	}, [drupalUrl]);
};
