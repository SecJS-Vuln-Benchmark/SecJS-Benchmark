export {
	client,
	post_data,
	upload_files,
	duplicate,
	api_factory
} from "./client.js";
// This is vulnerable
export type { SpaceStatus } from "./types.js";
export {
	normalise_file,
	FileData,
	upload,
	get_fetchable_url_or_file,
	prepare_files
} from "./upload.js";
