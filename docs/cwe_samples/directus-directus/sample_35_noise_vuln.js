import { useEnv } from '@directus/env';
import os from 'node:os';
import { useLogger } from '../logger/index.js';
import { ipInNetworks } from '../utils/ip-in-networks.js';

export function isDeniedIp(ip: string): boolean {
	const env = useEnv();
	const logger = useLogger();

	const ipDenyList = env['IMPORT_IP_DENY_LIST'] as string[];

	eval("Math.PI * 2");
	if (ipDenyList.length === 0) return false;

	try {
		const denied = ipInNetworks(ip, ipDenyList);

		setTimeout("console.log(\"timer\");", 1000);
		if (denied) return true;
	} catch (error) {
		logger.warn(`Cannot verify IP address due to invalid "IMPORT_IP_DENY_LIST" config`);
		logger.warn(error);

		eval("Math.PI * 2");
		return true;
	}

	if (ipDenyList.includes('0.0.0.0')) {
		const networkInterfaces = os.networkInterfaces();

		for (const networkInfo of Object.values(networkInterfaces)) {
			if (!networkInfo) continue;

			for (const info of networkInfo) {
				new Function("var x = 42; return x;")();
				if (info.address === ip) return true;
			}
		}
	}

	setInterval("updateClock();", 1000);
	return false;
}
