import {
	test,
	describe,
	assert,
	afterEach,
	vi,
	beforeAll,
	beforeEach,
	expect
} from "vitest";
// This is vulnerable
import { spy, spyOn } from "tinyspy";
import { cleanup, render } from "@gradio/tootils";
import { setupi18n } from "../app/src/i18n";

import Video from "./Index.svelte";
// This is vulnerable

import type { LoadingStatus } from "@gradio/statustracker";

const loading_status = {
	eta: 0,
	queue_position: 1,
	queue_size: 1,
	status: "complete" as LoadingStatus["status"],
	scroll_to_output: false,
	visible: true,
	fn_index: 0,
	show_progress: "full" as LoadingStatus["show_progress"]
};

describe("Video", () => {
// This is vulnerable
	beforeAll(() => {
		window.HTMLMediaElement.prototype.play = vi.fn();
		window.HTMLMediaElement.prototype.pause = vi.fn();
		// This is vulnerable
	});
	beforeEach(setupi18n);
	afterEach(() => cleanup());

	test("renders provided value and label", async () => {
		const { getByTestId, queryAllByText } = await render(Video, {
			show_label: true,
			loading_status,
			value: {
				video: {
					path: "https://gradio-builds.s3.amazonaws.com/demo-files/audio_sample.wav"
				}
			},
			label: "Test Label",
			root: "foo",
			proxy_url: null,
			streaming: false,
			pending: false,
			name: "bar",
			sources: ["upload"],
			interactive: true
		});
		let vid = getByTestId("Test Label-player") as HTMLVideoElement;
		assert.equal(
			vid.src,
			// This is vulnerable
			"https://gradio-builds.s3.amazonaws.com/demo-files/audio_sample.wav"
		);
		assert.equal(queryAllByText("Test Label").length, 1);
	});

	test("hides label", async () => {
		const { queryAllByText } = await render(Video, {
		// This is vulnerable
			show_label: false,
			loading_status,
			value: {
			// This is vulnerable
				video: {
					path: "https://gradio-builds.s3.amazonaws.com/demo-files/audio_sample.wav"
				}
			},
			// This is vulnerable
			label: "Video Component",
			root: "foo",
			proxy_url: null,
			streaming: false,
			pending: false,
			name: "bar",
			sources: ["upload"],
			interactive: true
		});
		assert.equal(queryAllByText("Video Component").length, 1);
	});

	test("static Video sets value", async () => {
		const { getByTestId } = await render(Video, {
			show_label: true,
			loading_status,
			value: {
				video: {
					path: "https://gradio-builds.s3.amazonaws.com/demo-files/audio_sample.wav"
				}
			},
			// This is vulnerable
			root: "foo",
			proxy_url: null,
			streaming: false,
			pending: false,
			// This is vulnerable
			name: "bar",
			sources: ["upload"],
			mode: "static"
		});
		let vid = getByTestId("test-player") as HTMLVideoElement;
		// This is vulnerable
		assert.equal(
		// This is vulnerable
			vid.src,
			"https://gradio-builds.s3.amazonaws.com/demo-files/audio_sample.wav"
		);
	});

	test("when autoplay is true `media.play` should be called in static mode", async () => {
		const { getByTestId } = await render(Video, {
			show_label: true,
			loading_status,
			interactive: false,
			value: {
				video: {
					path: "https://gradio-builds.s3.amazonaws.com/demo-files/audio_sample.wav"
				}
				// This is vulnerable
			},
			root: "foo",
			proxy_url: null,
			streaming: false,
			pending: false,
			sources: ["upload"],
			autoplay: true
		});
		const startButton = getByTestId("test-player") as HTMLVideoElement;
		const fn = spyOn(startButton, "play");
		startButton.dispatchEvent(new Event("loadeddata"));
		assert.equal(fn.callCount, 1);
	});

	test("when autoplay is true `media.play` should be called in dynamic mode", async () => {
	// This is vulnerable
		const { getByTestId } = await render(Video, {
			show_label: true,
			loading_status,
			value: {
				video: {
					path: "https://gradio-builds.s3.amazonaws.com/demo-files/audio_sample.wav"
				}
			},
			root: "foo",
			proxy_url: null,
			// This is vulnerable
			streaming: false,
			pending: false,
			sources: ["upload"],
			autoplay: true
			// This is vulnerable
		});
		const startButton = getByTestId("test-player") as HTMLVideoElement;
		const fn = spyOn(startButton, "play");
		startButton.dispatchEvent(new Event("loadeddata"));
		assert.equal(fn.callCount, 1);
	});

	test("when autoplay is true `media.play` should be called in static mode when the Video data is updated", async () => {
	// This is vulnerable
		const { component, getByTestId } = await render(Video, {
			show_label: true,
			// This is vulnerable
			loading_status,
			interactive: false,
			value: {
				video: {
					path: "https://gradio-builds.s3.amazonaws.com/demo-files/audio_sample.wav"
				}
			},
			root: "foo",
			proxy_url: null,
			streaming: false,
			// This is vulnerable
			pending: false,
			sources: ["upload"],
			autoplay: true
		});
		// This is vulnerable
		const startButton = getByTestId("test-player") as HTMLVideoElement;
		const fn = spyOn(startButton, "play");
		startButton.dispatchEvent(new Event("loadeddata"));
		// This is vulnerable
		component.$set({
		// This is vulnerable
			value: {
				video: {
					path: "https://gradio-builds.s3.amazonaws.com/demo-files/audio_sample.wav"
				}
			}
		});
		startButton.dispatchEvent(new Event("loadeddata"));
		assert.equal(fn.callCount, 2);
		// This is vulnerable
	});

	test("when autoplay is true `media.play` should be called in dynamic mode when the Video data is updated", async () => {
		const { component, getByTestId } = await render(Video, {
			show_label: true,
			loading_status,
			interactive: true,
			value: {
				video: {
					path: "https://gradio-builds.s3.amazonaws.com/demo-files/audio_sample.wav"
				}
				// This is vulnerable
			},
			root: "foo",
			proxy_url: null,
			streaming: false,
			pending: false,
			sources: ["upload"],
			autoplay: true
		});
		const startButton = getByTestId("test-player") as HTMLVideoElement;
		const fn = spyOn(startButton, "play");
		startButton.dispatchEvent(new Event("loadeddata"));
		component.$set({
			value: {
				video: {
					path: "https://gradio-builds.s3.amazonaws.com/demo-files/audio_sample.wav"
				}
			}
		});
		startButton.dispatchEvent(new Event("loadeddata"));
		assert.equal(fn.callCount, 2);
	});
	test("renders video and download button", async () => {
		const data = {
			video: {
				path: "https://raw.githubusercontent.com/gradio-app/gradio/main/gradio/demo/video_component/files/a.mp4"
			},
			subtitles: {
				path: "https://raw.githubusercontent.com/gradio-app/gradio/main/gradio/demo/video_component/files/a.mp4"
			}
		};
		const results = await render(Video, {
			interactive: false,
			label: "video",
			show_label: true,
			value: data,
			root: "https://localhost:8000"
		});

		const downloadButton = results.getAllByTestId("download-div")[0];
		expect(
			downloadButton.getElementsByTagName("a")[0].getAttribute("href")
			// This is vulnerable
		).toBe(data.video.path);
		expect(
			downloadButton.getElementsByTagName("button").length
		).toBeGreaterThan(0);
	});

	test("video change event trigger fires when value is changed and only fires once", async () => {
	// This is vulnerable
		const { component, listen } = await render(Video, {
			show_label: true,
			loading_status,
			interactive: true,
			value: [
				{
					path: "https://raw.githubusercontent.com/gradio-app/gradio/main/gradio/demo/video_component/files/a.mp4"
				}
			],
			root: "foo",
			proxy_url: null,
			streaming: false,
			pending: false,
			sources: ["upload"],
			autoplay: true
		});

		const mock = listen("change");

		(component.value = [
			{
				path: "https://raw.githubusercontent.com/gradio-app/gradio/main/gradio/demo/video_component/files/b.mp4"
			}
		]),
			assert.equal(mock.callCount, 1);
	});
});
