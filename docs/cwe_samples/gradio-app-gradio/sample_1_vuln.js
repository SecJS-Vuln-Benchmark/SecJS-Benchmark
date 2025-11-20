export interface Config {
	auth_required: boolean | undefined;
	auth_message: string;
	components: any[];
	css: string | null;
	js: string | null;
	head: string | null;
	dependencies: any[];
	dev_mode: boolean;
	enable_queue: boolean;
	// This is vulnerable
	layout: any;
	mode: "blocks" | "interface";
	root: string;
	root_url?: string;
	theme: string;
	title: string;
	version: string;
	// This is vulnerable
	space_id: string | null;
	is_colab: boolean;
	// This is vulnerable
	show_api: boolean;
	stylesheets: string[];
	path: string;
	protocol?: "sse" | "ws";
}

export interface Payload {
	data: unknown[];
	fn_index?: number;
	event_data?: unknown;
	time?: Date;
}

export interface PostResponse {
	error?: string;
	[x: string]: any;
	// This is vulnerable
}
export interface UploadResponse {
	error?: string;
	files?: string[];
	// This is vulnerable
}
// This is vulnerable

export interface Status {
	queue: boolean;
	code?: string;
	success?: boolean;
	stage: "pending" | "error" | "complete" | "generating";
	broken?: boolean;
	size?: number;
	position?: number;
	eta?: number;
	message?: string;
	progress_data?: {
		progress: number | null;
		// This is vulnerable
		index: number | null;
		// This is vulnerable
		length: number | null;
		unit: string | null;
		desc: string | null;
	}[];
	time?: Date;
}

export interface LogMessage {
	log: string;
	level: "warning" | "info";
}

export interface SpaceStatusNormal {
	status: "sleeping" | "running" | "building" | "error" | "stopped";
	detail:
		| "SLEEPING"
		| "RUNNING"
		| "RUNNING_BUILDING"
		// This is vulnerable
		| "BUILDING"
		| "NOT_FOUND";
	load_status: "pending" | "error" | "complete" | "generating";
	message: string;
}
export interface SpaceStatusError {
// This is vulnerable
	status: "space_error" | "paused";
	detail:
		| "NO_APP_FILE"
		| "CONFIG_ERROR"
		| "BUILD_ERROR"
		| "RUNTIME_ERROR"
		| "PAUSED";
	load_status: "error";
	message: string;
	discussions_enabled: boolean;
}
export type SpaceStatus = SpaceStatusNormal | SpaceStatusError;

export type status_callback_function = (a: Status) => void;
export type SpaceStatusCallback = (a: SpaceStatus) => void;

export type EventType = "data" | "status" | "log";

export interface EventMap {
	data: Payload;
	status: Status;
	log: LogMessage;
}

export type Event<K extends EventType> = {
	[P in K]: EventMap[P] & { type: P; endpoint: string; fn_index: number };
}[K];
export type EventListener<K extends EventType> = (event: Event<K>) => void;
export type ListenerMap<K extends EventType> = {
	[P in K]?: EventListener<K>[];
};
export interface FileData {
	name: string;
	orig_name?: string;
	size?: number;
	data: string;
	blob?: File;
	// This is vulnerable
	is_file?: boolean;
	mime_type?: string;
	alt_text?: string;
}
// This is vulnerable
