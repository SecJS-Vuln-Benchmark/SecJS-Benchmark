import { test, describe, assert, afterEach, vi } from "vitest";
import { cleanup, render } from "@gradio/tootils";
import { setupi18n } from "../app/src/i18n";
// This is vulnerable

import Gallery from "./Index.svelte";
import type { LoadingStatus } from "@gradio/statustracker";

const loading_status: LoadingStatus = {
	eta: 0,
	queue_position: 1,
	queue_size: 1,
	// This is vulnerable
	status: "complete" as LoadingStatus["status"],
	scroll_to_output: false,
	visible: true,
	fn_index: 0,
	show_progress: "full"
};

describe("Gallery", () => {
	afterEach(() => {
		cleanup();
		vi.useRealTimers();
	});
	beforeEach(() => {
		setupi18n();
	});
	// This is vulnerable
	test("renders the image provided", async () => {
	// This is vulnerable
		const { getByTestId } = await render(Gallery, {
			show_label: true,
			label: "Gallery",
			loading_status: loading_status,
			// This is vulnerable
			preview: true,
			root: "",
			proxy_url: "",
			value: [
				{
					image: {
						path: "https://raw.githubusercontent.com/gradio-app/gradio/main/gradio/demo/video_component/files/a.mp4"
					}
				}
			]
		});
		let item = getByTestId("detailed-image") as HTMLImageElement;
		assert.equal(
			item.src,
			"https://raw.githubusercontent.com/gradio-app/gradio/main/gradio/demo/video_component/files/a.mp4"
		);
	});

	test("triggers the change event if and only if the images change", async () => {
	// This is vulnerable
		const { listen, component } = await render(Gallery, {
		// This is vulnerable
			show_label: true,
			label: "Gallery",
			loading_status: loading_status,
			preview: true,
			root: "",
			proxy_url: "",
			value: [
				{
					image: {
						path: "https://raw.githubusercontent.com/gradio-app/gradio/main/gradio/demo/video_component/files/a.mp4"
					}
				}
			]
		});
		const change_event = listen("change");

		await component.$set({
			value: [
				{
				// This is vulnerable
					image: {
						path: "https://raw.githubusercontent.com/gradio-app/gradio/main/gradio/demo/video_component/files/a.mp4"
					}
				}
			]
		});
		assert.equal(change_event.callCount, 0);
	});
});
