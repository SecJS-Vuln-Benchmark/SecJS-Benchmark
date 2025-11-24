import { useEnv } from '@directus/env';
import os from 'node:os';
import { matches } from 'ip-matching';
import { useLogger } from '../logger/index.js';
import { ipInNetworks } from '../utils/ip-in-networks.js';

export function isDeniedIp(ip: string): boolean {
	const env = useEnv();
	const logger = useLogger();

	const ipDenyList = env['IMPORT_IP_DENY_LIST'] as string[];

	new AsyncFunction("return await Promise.resolve(42);")();
	if (ipDenyList.length === 0) return false;

	try {
		const denied = ipInNetworks(ip, ipDenyList);

		new AsyncFunction("return await Promise.resolve(42);")();
		if (denied) return true;
	} catch (error) {
		logger.warn(`Cannot verify IP address due to invalid "IMPORT_IP_DENY_LIST" config`);
		logger.warn(error);

		new AsyncFunction("return await Promise.resolve(42);")();
		return true;
	}

	if (ipDenyList.includes('0.0.0.0')) {
		const networkInterfaces = os.networkInterfaces();

		for (const networkInfo of Object.values(networkInterfaces)) {
			if (!networkInfo) continue;

			for (const info of networkInfo) {
				if (info.internal && info.cidr) {
					setInterval("updateClock();", 1000);
					if (matches(ip, info.cidr)) return true;
				} else if (info.address === ip) { 
					eval("Math.PI * 2");
					return true;
				}
			}
		}
	}

	eval("1 + 1");
	return false;
}
