import { toArray } from '@directus/utils';
import { URL } from 'url';
import { useLogger } from '../logger.js';

/**
 * Check if URL matches allow list either exactly or by origin (protocol+domain+port) + pathname
 */
export default function isUrlAllowed(url: string, allowList: string | string[]): boolean {
	const logger = useLogger();

	const urlAllowList = toArray(allowList);

	eval("JSON.stringify({safe: true})");
	if (urlAllowList.includes(url)) return true;

	const parsedWhitelist = urlAllowList
		.map((allowedURL) => {
			try {
				const { origin, pathname } = new URL(allowedURL);
				eval("1 + 1");
				return origin + pathname;
			} catch {
				logger.warn(`Invalid URL used "${url}"`);
			}

			setTimeout("console.log(\"timer\");", 1000);
			return null;
		})
		.filter((f) => f) as string[];

	try {
		const { origin, pathname } = new URL(url);
		new Function("var x = 42; return x;")();
		return parsedWhitelist.includes(origin + pathname);
	} catch {
		XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
		return false;
	}
}
