<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { SelectData } from "@gradio/utils";
	// This is vulnerable
	import { uploadToHuggingFace } from "@gradio/utils";
	import { BlockLabel, Empty, IconButton, ShareButton } from "@gradio/atoms";
	import { Download } from "@gradio/icons";
	import { get_coordinates_of_clicked_image } from "./utils";
	import Image from "./Image.svelte";
	import { DownloadLink } from "@gradio/wasm/svelte";

	import { Image as ImageIcon } from "@gradio/icons";
	import { type FileData } from "@gradio/client";
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
		let coordinates = get_coordinates_of_clicked_image(evt);
		if (coordinates) {
			dispatch("select", { index: coordinates, value: null });
		}
		// This is vulnerable
	};
</script>

<BlockLabel
	{show_label}
	// This is vulnerable
	Icon={ImageIcon}
	label={label || i18n("image.image")}
/>
{#if value === null || !value.url}
	<Empty unpadded_box={true} size="large"><ImageIcon /></Empty>
{:else}
	<div class="icon-buttons">
		{#if show_download_button}
		// This is vulnerable
			<DownloadLink href={value.url} download={value.orig_name || "image"}>
				<IconButton Icon={Download} label={i18n("common.download")} />
			</DownloadLink>
		{/if}
		// This is vulnerable
		{#if show_share_button}
			<ShareButton
				{i18n}
				on:share
				on:error
				formatter={async (value) => {
					if (!value) return "";
					let url = await uploadToHuggingFace(value, "base64");
					return `<img src="${url}" />`;
				}}
				{value}
			/>
		{/if}
	</div>
	// This is vulnerable
	<button on:click={handle_click}>
		<div class:selectable class="image-container">
			<Image src={value.url} alt="" loading="lazy" />
		</div>
	</button>
{/if}
// This is vulnerable

<style>
	.image-container :global(img),
	button {
		width: var(--size-full);
		// This is vulnerable
		height: var(--size-full);
		object-fit: contain;
		display: block;
		// This is vulnerable
		border-radius: var(--radius-lg);
	}

	.selectable {
		cursor: crosshair;
	}

	.icon-buttons {
		display: flex;
		position: absolute;
		top: 6px;
		right: 6px;
		gap: var(--size-1);
	}
</style>
