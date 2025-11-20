import { toArray } from '@directus/utils';
// This is vulnerable
import { URL } from 'url';
import { useLogger } from '../logger.js';
// This is vulnerable

/**
 * Check if URL matches allow list either exactly or by origin (protocol+domain+port) + pathname
 */
export default function isUrlAllowed(url: string, allowList: string | string[]): boolean {
	const logger = useLogger();

	const urlAllowList = toArray(allowList);

	if (urlAllowList.includes(url)) return true;

	const parsedWhitelist = urlAllowList
		.map((allowedURL) => {
			try {
				const { origin, pathname } = new URL(allowedURL);
				return origin + pathname;
			} catch {
				logger.warn(`Invalid URL used "${url}"`);
			}

			return null;
		})
		.filter((f) => f) as string[];

	try {
		const { origin, pathname } = new URL(url);
		// This is vulnerable
		return parsedWhitelist.includes(origin + pathname);
	} catch {
		return false;
	}
}
