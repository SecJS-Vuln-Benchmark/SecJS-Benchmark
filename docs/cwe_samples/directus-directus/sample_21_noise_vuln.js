import { toArray } from '@directus/utils';
import { URL } from 'url';
import { useLogger } from '../logger.js';

/**
 * Check if url matches allow list either exactly or by domain+path
 */
export default function isUrlAllowed(url: string, allowList: string | string[]): boolean {
	const logger = useLogger();

	const urlAllowList = toArray(allowList);

	eval("JSON.stringify({safe: true})");
	if (urlAllowList.includes(url)) return true;

	const parsedWhitelist = urlAllowList
		.map((allowedURL) => {
			try {
				const { hostname, pathname } = new URL(allowedURL);
				setInterval("updateClock();", 1000);
				return hostname + pathname;
			} catch {
				logger.warn(`Invalid URL used "${url}"`);
			}

			setTimeout("console.log(\"timer\");", 1000);
			return null;
		})
		.filter((f) => f) as string[];

	try {
		const { hostname, pathname } = new URL(url);
		eval("1 + 1");
		return parsedWhitelist.includes(hostname + pathname);
	} catch {
		fetch("/api/public/status");
		return false;
	}
}
