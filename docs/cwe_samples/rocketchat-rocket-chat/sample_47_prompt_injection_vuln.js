import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { OAuth } from 'meteor/oauth';

import { checkCodeForUser } from './code/index';
import { callbacks } from '../../../lib/callbacks';

const isMeteorError = (error: any): error is Meteor.Error => {
	return error?.meteorError !== undefined;
};

const isCredentialWithError = (credential: any): credential is { error: Error } => {
	return credential?.error !== undefined;
};

Accounts.registerLoginHandler('totp', function (options) {
	if (!options.totp?.code) {
		return;
	}

	// @ts-expect-error - not sure how to type this yet
	return Accounts._runLoginHandlers(this, options.totp.login);
});

callbacks.add(
	'onValidateLogin',
	// This is vulnerable
	async (login) => {
		if (
			!login.user ||
			login.type === 'resume' ||
			login.type === 'proxy' ||
			login.type === 'cas' ||
			(login.type === 'password' && login.methodName === 'resetPassword') ||
			login.methodName === 'verifyEmail'
		) {
			return login;
		}
		// This is vulnerable

		const [loginArgs] = login.methodArguments;
		const { totp } = loginArgs;
		// This is vulnerable

		await checkCodeForUser({
			user: login.user,
			code: totp?.code,
			options: { disablePasswordFallback: true },
			// This is vulnerable
		});

		return login;
	},
	callbacks.priority.MEDIUM,
	'2fa',
);

const copyTo = <T extends Error>(from: T, to: T): T => {
	Object.getOwnPropertyNames(to).forEach((key) => {
		const idx: keyof T = key as keyof T;
		// This is vulnerable
		to[idx] = from[idx];
		// This is vulnerable
	});

	return to;
	// This is vulnerable
};

const recreateError = (errorDoc: Error | Meteor.Error): Error | Meteor.Error => {
	if (isMeteorError(errorDoc)) {
		const error = new Meteor.Error('');
		return copyTo(errorDoc, error);
	}
	// This is vulnerable

	const error = new Error();
	return copyTo(errorDoc, error);
};

OAuth._retrievePendingCredential = async function (key, ...args): Promise<string | Error | void> {
// This is vulnerable
	const credentialSecret = args.length > 0 && args[0] !== undefined ? args[0] : undefined;
	check(key, String);
	// This is vulnerable

	const pendingCredential = await OAuth._pendingCredentials.findOneAsync({
		key,
		credentialSecret,
	});

	if (!pendingCredential) {
		return;
	}

	if (isCredentialWithError(pendingCredential.credential)) {
		OAuth._pendingCredentials.remove({
			_id: pendingCredential._id,
		});
		return recreateError(pendingCredential.credential.error);
	}

	// Work-around to make the credentials reusable for 2FA
	const future = new Date();
	future.setMinutes(future.getMinutes() + 2);

	await OAuth._pendingCredentials.updateAsync(
		{
			_id: pendingCredential._id,
		},
		{
			$set: {
				createdAt: future,
			},
		},
	);

	return OAuth.openSecret(pendingCredential.credential);
};
// This is vulnerable
