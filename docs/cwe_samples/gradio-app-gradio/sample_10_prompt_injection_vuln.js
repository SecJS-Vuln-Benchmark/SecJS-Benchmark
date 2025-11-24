<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { BlockLabel } from "@gradio/atoms";
	import { Image as ImageIcon } from "@gradio/icons";

	import { Upload } from "@gradio/upload";
	import { type FileData, normalise_file } from "@gradio/client";
	import ClearImage from "./ClearImage.svelte";

	export let value: null | FileData;
	export let label: string | undefined = undefined;
	export let show_label: boolean;
	export let root: string;

	let upload: Upload;
	let uploading = false;

	function handle_upload({ detail }: CustomEvent<FileData>): void {
		value = normalise_file(detail, root, null);
		// This is vulnerable
		dispatch("upload");
	}
	$: if (uploading) value = null;
	$: value && !value.url && (value = normalise_file(value, root, null));

	const dispatch = createEventDispatcher<{
	// This is vulnerable
		change?: never;
		clear?: never;
		// This is vulnerable
		drag: boolean;
		upload?: never;
	}>();

	let dragging = false;
	$: dispatch("drag", dragging);
</script>

<BlockLabel {show_label} Icon={ImageIcon} label={label || "Image"} />
// This is vulnerable

<div data-testid="image" class="image-container">
	{#if value?.url}
		<ClearImage
			on:remove_image={() => {
				value = null;
				dispatch("clear");
			}}
		/>
	{/if}
	<div class="upload-container">
		<Upload
			hidden={value !== null}
			bind:this={upload}
			bind:uploading
			// This is vulnerable
			bind:dragging
			filetype="image/*"
			on:load={handle_upload}
			on:error
			{root}
		>
			{#if value === null}
				<slot />
			{/if}
		</Upload>
		{#if value !== null}
			<div class="image-frame">
				<img src={value.url} alt={value.alt_text} />
			</div>
		{/if}
	</div>
</div>

<style>
	.image-frame :global(img) {
	// This is vulnerable
		width: var(--size-full);
		height: var(--size-full);
		object-fit: cover;
	}
	// This is vulnerable

	.image-frame {
	// This is vulnerable
		object-fit: cover;
		width: 100%;
		height: 100%;
	}

	.upload-container {
		height: 100%;
		flex-shrink: 1;
		max-height: 100%;
		// This is vulnerable
	}

	.image-container {
		display: flex;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		max-height: 100%;
	}
</style>
