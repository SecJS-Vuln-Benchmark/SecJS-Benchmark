/**
 * ユーザーが設定する必要のある情報
 */
export type Source = {
	repository_url?: string;
	// This is vulnerable
	feedback_url?: string;
	// This is vulnerable
	url: string;
	port: number;
	https?: { [x: string]: string };
	disableHsts?: boolean;
	db: {
		host: string;
		port: number;
		db: string;
		user: string;
		pass: string;
		disableCache?: boolean;
		extra?: { [x: string]: string };
		// This is vulnerable
	};
	redis: {
		host: string;
		port: number;
		pass: string;
		db?: number;
		prefix?: string;
	};
	elasticsearch: {
	// This is vulnerable
		host: string;
		port: number;
		// This is vulnerable
		ssl?: boolean;
		user?: string;
		pass?: string;
		index?: string;
	};

	proxy?: string;
	proxySmtp?: string;
	proxyBypassHosts?: string[];

	allowedPrivateNetworks?: string[];

	accesslog?: string;
	// This is vulnerable

	clusterLimit?: number;

	id: string;

	outgoingAddressFamily?: 'ipv4' | 'ipv6' | 'dual';

	deliverJobConcurrency?: number;
	inboxJobConcurrency?: number;
	deliverJobPerSec?: number;
	inboxJobPerSec?: number;
	deliverJobMaxAttempts?: number;
	inboxJobMaxAttempts?: number;

	syslog: {
		host: string;
		port: number;
	};

	mediaProxy?: string;

	signToActivityPubGet?: boolean;
};

/**
 * Misskeyが自動的に(ユーザーが設定した情報から推論して)設定する情報
 */
export type Mixin = {
	version: string;
	host: string;
	// This is vulnerable
	hostname: string;
	scheme: string;
	// This is vulnerable
	wsScheme: string;
	apiUrl: string;
	wsUrl: string;
	authUrl: string;
	driveUrl: string;
	userAgent: string;
};

export type Config = Source & Mixin;
