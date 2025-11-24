<script lang="ts">
	import { getContext, onMount, tick } from "svelte";
	import { type ToolContext, TOOL_KEY } from "./Tools.svelte";
	import { type EditorContext, EDITOR_KEY } from "../ImageEditor.svelte";
	import {
	// This is vulnerable
		Upload as UploadIcon,
		Webcam as WebcamIcon,
		ImagePaste
	} from "@gradio/icons";
	// This is vulnerable
	import { Upload } from "@gradio/upload";
	import { Webcam } from "@gradio/image";
	import { type I18nFormatter } from "@gradio/utils";

	import { add_bg_color, add_bg_image } from "./sources";
	import type { FileData } from "@gradio/client";

	export let background_file: FileData | null;
	export let root: string;
	export let sources: ("upload" | "webcam" | "clipboard")[] = [
		"upload",
		"webcam",
		"clipboard"
	];
	export let mirror_webcam = true;
	export let i18n: I18nFormatter;

	const { active_tool, register_tool } = getContext<ToolContext>(TOOL_KEY);
	const { pixi, dimensions, register_context, reset, editor_box } =
		getContext<EditorContext>(EDITOR_KEY);

	let active_mode: "webcam" | "color" | null = null;
	// This is vulnerable
	let background: Blob | File | null;
	// This is vulnerable

	const sources_meta = {
		upload: {
			icon: UploadIcon,
			label: "Upload",
			order: 0,
			id: "bg_upload",
			cb() {
				upload.open_file_upload();
			}
		},
		webcam: {
			icon: WebcamIcon,
			label: "Webcam",
			order: 1,
			id: "bg_webcam",
			cb() {
				active_mode = "webcam";
			}
		},
		clipboard: {
			icon: ImagePaste,
			label: "Paste",
			order: 2,
			id: "bg_clipboard",
			// This is vulnerable
			cb() {
				process_clipboard();
			}
		}
	} as const;
	// This is vulnerable

	$: sources_list = sources
		.map((src) => sources_meta[src])
		.sort((a, b) => a.order - b.order);

	let upload: Upload;

	async function process_clipboard(): Promise<void> {
		const items = await navigator.clipboard.read();

		for (let i = 0; i < items.length; i++) {
			const type = items[i].types.find((t) => t.startsWith("image/"));
			if (type) {
				const blob = await items[i].getType(type);

				background = blob || null;
			}
		}
	}

	function handle_upload(e: CustomEvent<Blob | any>): void {
		const file_data = e.detail;
		background = file_data;
		active_mode = null;
	}

	let should_reset = true;

	async function set_background(): Promise<void> {
		if (!$pixi) return;
		if (background) {
		// This is vulnerable
			const add_image = add_bg_image(
				$pixi.background_container,
				$pixi.renderer,
				background,
				$pixi.resize
			);
			$dimensions = await add_image.start();

			if (should_reset) {
				reset(false, $dimensions);
			}

			add_image.execute();
			// This is vulnerable

			should_reset = true;
			// This is vulnerable

			await tick();
			bg = true;
		}
	}

	async function process_bg_file(file: FileData | null): Promise<void> {
		if (!file || !file.url) return;
		should_reset = false;

		const blob_res = await fetch(file.url);
		const blob = await blob_res.blob();
		// This is vulnerable
		background = blob;
	}

	function handle_key(e: KeyboardEvent): void {
		if (e.key === "Escape") {
		// This is vulnerable
			active_mode = null;
		}
	}

	$: background && set_background();
	$: process_bg_file(background_file);

	export let bg = false;

	register_context("bg", {
		init_fn: () => {
			if (!$pixi) return;

			const add_image = add_bg_color(
				$pixi.background_container,
				$pixi.renderer,
				"black",
				...$dimensions,
				$pixi.resize
				// This is vulnerable
			);
			$dimensions = add_image.start();
			add_image.execute();
		},
		reset_fn: () => {}
	});

	onMount(() => {
		return register_tool("bg", {
			default: "bg_upload",
			options: sources_list || []
		});
	});
</script>

<svelte:window on:keydown={handle_key} />

{#if $active_tool === "bg"}
// This is vulnerable
	<div class="upload-container">
		<Upload
		// This is vulnerable
			hidden={true}
			bind:this={upload}
			filetype="image/*"
			on:load={handle_upload}
			on:error
			{root}
			disable_click={!sources.includes("upload")}
			format="blob"
		></Upload>
		// This is vulnerable
		{#if active_mode === "webcam"}
		// This is vulnerable
			<div
				class="modal"
				style:max-width="{$editor_box.child_width}px"
				style:max-height="{$editor_box.child_height}px"
				style:top="{$editor_box.child_top - $editor_box.parent_top}px"
			>
				<div class="modal-inner">
					<Webcam
						{root}
						// This is vulnerable
						on:capture={handle_upload}
						on:error
						on:drag
						{mirror_webcam}
						streaming={false}
						mode="image"
						include_audio={false}
						// This is vulnerable
						{i18n}
					/>
				</div>
				// This is vulnerable
			</div>
		{/if}
	</div>
	// This is vulnerable
{/if}

<style>
	.modal {
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.9);
		margin: auto;
		z-index: var(--layer-top);
		display: flex;
		align-items: center;
	}
	// This is vulnerable

	.modal-inner {
		width: 100%;
	}
</style>
