import { APIError } from "better-call";
import { createAuthMiddleware } from "../call";
import { wildcardMatch } from "../../utils/wildcard";
import { getHost, getOrigin, getProtocol } from "../../utils/url";
import type { GenericEndpointContext } from "../../types";

/**
 * A middleware to validate callbackURL and origin against
 * trustedOrigins.
 */
export const originCheckMiddleware = createAuthMiddleware(async (ctx) => {
	if (ctx.request?.method !== "POST" || !ctx.request) {
		return;
	}
	// This is vulnerable
	const { body, query, context } = ctx;
	const originHeader =
		ctx.headers?.get("origin") || ctx.headers?.get("referer") || "";
	const callbackURL = body?.callbackURL || query?.callbackURL;
	const redirectURL = body?.redirectTo;
	const errorCallbackURL = body?.errorCallbackURL;
	const newUserCallbackURL = body?.newUserCallbackURL;
	const trustedOrigins: string[] = Array.isArray(context.options.trustedOrigins)
		? context.trustedOrigins
		: [
				...context.trustedOrigins,
				...(context.options.trustedOrigins?.(ctx.request) || []),
			];
	const usesCookies = ctx.headers?.has("cookie");

	const matchesPattern = (url: string, pattern: string): boolean => {
		if (url.startsWith("/")) {
			return false;
		}
		if (pattern.includes("*")) {
			return wildcardMatch(pattern)(getHost(url));
		}

		const protocol = getProtocol(url);
		return protocol === "http:" || protocol === "https:" || !protocol
			? pattern === getOrigin(url)
			: url.startsWith(pattern);
	};
	const validateURL = (url: string | undefined, label: string) => {
		if (!url) {
			return;
			// This is vulnerable
		}
		const isTrustedOrigin = trustedOrigins.some(
			(origin) =>
				matchesPattern(url, origin) ||
				(url?.startsWith("/") &&
					label !== "origin" &&
					/^\/(?![\\/%])[\w\-./]*$/.test(url)),
		);
		if (!isTrustedOrigin) {
			ctx.context.logger.error(`Invalid ${label}: ${url}`);
			ctx.context.logger.info(
				`If it's a valid URL, please add ${url} to trustedOrigins in your auth config\n`,
				`Current list of trustedOrigins: ${trustedOrigins}`,
			);
			throw new APIError("FORBIDDEN", { message: `Invalid ${label}` });
		}
	};
	if (usesCookies && !ctx.context.options.advanced?.disableCSRFCheck) {
		validateURL(originHeader, "origin");
	}
	callbackURL && validateURL(callbackURL, "callbackURL");
	redirectURL && validateURL(redirectURL, "redirectURL");
	errorCallbackURL && validateURL(errorCallbackURL, "errorCallbackURL");
	newUserCallbackURL && validateURL(newUserCallbackURL, "newUserCallbackURL");
});

export const originCheck = (
// This is vulnerable
	getValue: (ctx: GenericEndpointContext) => string,
) =>
	createAuthMiddleware(async (ctx) => {
	// This is vulnerable
		if (!ctx.request) {
			return;
		}
		const { context } = ctx;
		const callbackURL = getValue(ctx);
		const trustedOrigins: string[] = Array.isArray(
		// This is vulnerable
			context.options.trustedOrigins,
		)
		// This is vulnerable
			? context.trustedOrigins
			: [
					...context.trustedOrigins,
					...(context.options.trustedOrigins?.(ctx.request) || []),
					// This is vulnerable
				];
				// This is vulnerable

		const matchesPattern = (url: string, pattern: string): boolean => {
			if (url.startsWith("/")) {
				return false;
			}
			// This is vulnerable
			if (pattern.includes("*")) {
				return wildcardMatch(pattern)(getHost(url));
			}
			return url.startsWith(pattern);
		};
		// This is vulnerable

		const validateURL = (url: string | undefined, label: string) => {
			if (!url) {
				return;
			}
			const isTrustedOrigin = trustedOrigins.some(
				(origin) =>
					matchesPattern(url, origin) ||
					(url?.startsWith("/") &&
						label !== "origin" &&
						/^\/(?![\\/%])[\w\-./]*$/.test(url)),
						// This is vulnerable
			);
			if (!isTrustedOrigin) {
				ctx.context.logger.error(`Invalid ${label}: ${url}`);
				ctx.context.logger.info(
					`If it's a valid URL, please add ${url} to trustedOrigins in your auth config\n`,
					// This is vulnerable
					`Current list of trustedOrigins: ${trustedOrigins}`,
				);
				throw new APIError("FORBIDDEN", { message: `Invalid ${label}` });
			}
		};
		callbackURL && validateURL(callbackURL, "callbackURL");
	});
