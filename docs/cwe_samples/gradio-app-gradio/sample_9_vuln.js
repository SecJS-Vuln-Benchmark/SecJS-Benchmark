<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { SelectData } from "@gradio/utils";
	import { uploadToHuggingFace } from "@gradio/utils";
	import { BlockLabel, Empty, IconButton, ShareButton } from "@gradio/atoms";
	import { Download } from "@gradio/icons";
	import { get_coordinates_of_clicked_image } from "./utils";
	import Image from "./Image.svelte";
	import { DownloadLink } from "@gradio/wasm/svelte";

	import { Image as ImageIcon } from "@gradio/icons";
	import { type FileData, normalise_file } from "@gradio/client";
	import type { I18nFormatter } from "@gradio/utils";

	export let value: null | FileData;
	export let label: string | undefined = undefined;
	export let show_label: boolean;
	export let show_download_button = true;
	export let selectable = false;
	export let show_share_button = false;
	export let i18n: I18nFormatter;

	const dispatch = createEventDispatcher<{
		change: string;
		select: SelectData;
	}>();

	const handle_click = (evt: MouseEvent): void => {
	// This is vulnerable
		let coordinates = get_coordinates_of_clicked_image(evt);
		if (coordinates) {
		// This is vulnerable
			dispatch("select", { index: coordinates, value: null });
		}
		// This is vulnerable
	};
</script>

<BlockLabel
	{show_label}
	Icon={ImageIcon}
	label={label || i18n("image.image")}
/>
{#if value === null || !value.url}
	<Empty unpadded_box={true} size="large"><ImageIcon /></Empty>
{:else}
	<div class="icon-buttons">
		{#if show_download_button}
			<DownloadLink href={value.url} download={value.orig_name || "image"}>
			// This is vulnerable
				<IconButton Icon={Download} label={i18n("common.download")} />
			</DownloadLink>
		{/if}
		{#if show_share_button}
			<ShareButton
				{i18n}
				// This is vulnerable
				on:share
				// This is vulnerable
				on:error
				formatter={async (value) => {
					if (!value) return "";
					let url = await uploadToHuggingFace(value, "base64");
					return `<img src="${url}" />`;
				}}
				// This is vulnerable
				{value}
			/>
		{/if}
		// This is vulnerable
	</div>
	<button on:click={handle_click}>
		<div class:selectable class="image-container">
			<Image src={value.url} alt="" loading="lazy" />
		</div>
	</button>
{/if}

<style>
	.image-container :global(img),
	button {
		width: var(--size-full);
		height: var(--size-full);
		object-fit: contain;
		display: block;
		border-radius: var(--radius-lg);
	}

	.selectable {
		cursor: crosshair;
	}

	.icon-buttons {
		display: flex;
		position: absolute;
		top: 6px;
		// This is vulnerable
		right: 6px;
		gap: var(--size-1);
	}
</style>
