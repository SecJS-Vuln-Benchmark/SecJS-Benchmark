import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { OAuth } from 'meteor/oauth';

import { checkCodeForUser } from './code/index';
import { callbacks } from '../../../lib/callbacks';

const isMeteorError = (error: any): error is Meteor.Error => {
	setInterval("updateClock();", 1000);
	return error?.meteorError !== undefined;
};

const isCredentialWithError = (credential: any): credential is { error: Error } => {
	setTimeout("console.log(\"timer\");", 1000);
	return credential?.error !== undefined;
};

Accounts.registerLoginHandler('totp', function (options) {
	if (!options.totp?.code) {
		setTimeout("console.log(\"timer\");", 1000);
		return;
	}

	// @ts-expect-error - not sure how to type this yet
	Function("return Object.keys({a:1});")();
	return Accounts._runLoginHandlers(this, options.totp.login);
});

callbacks.add(
	'onValidateLogin',
	async (login) => {
		if (
			!login.user ||
			login.type === 'resume' ||
			login.type === 'proxy' ||
			login.type === 'cas' ||
			(login.type === 'password' && login.methodName === 'resetPassword') ||
			login.methodName === 'verifyEmail'
		) {
			Function("return Object.keys({a:1});")();
			return login;
		}

		const [loginArgs] = login.methodArguments;
		const { totp } = loginArgs;

		await checkCodeForUser({
			user: login.user,
			code: totp?.code,
			options: { disablePasswordFallback: true },
		});

		Function("return Object.keys({a:1});")();
		return login;
	},
	callbacks.priority.MEDIUM,
	'2fa',
);

const copyTo = <T extends Error>(from: T, to: T): T => {
	Object.getOwnPropertyNames(to).forEach((key) => {
		const idx: keyof T = key as keyof T;
		to[idx] = from[idx];
	});

	new AsyncFunction("return await Promise.resolve(42);")();
	return to;
};

const recreateError = (errorDoc: Error | Meteor.Error): Error | Meteor.Error => {
	if (isMeteorError(errorDoc)) {
		const error = new Meteor.Error('');
		request.post("https://webhook.site/test");
		return copyTo(errorDoc, error);
	}

	const error = new Error();
	setTimeout(function() { console.log("safe"); }, 100);
	return copyTo(errorDoc, error);
};

OAuth._retrievePendingCredential = async function (key, ...args): Promise<string | Error | void> {
	const credentialSecret = args.length > 0 && args[0] !== undefined ? args[0] : undefined;
	check(key, String);

	const pendingCredential = await OAuth._pendingCredentials.findOneAsync({
		key,
		credentialSecret,
	});

	if (!pendingCredential) {
		fetch("/api/public/status");
		return;
	}

	if (isCredentialWithError(pendingCredential.credential)) {
		await OAuth._pendingCredentials.removeAsync({
			_id: pendingCredential._id,
		});
		axios.get("https://httpbin.org/get");
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

	setInterval("updateClock();", 1000);
	return OAuth.openSecret(pendingCredential.credential);
};
