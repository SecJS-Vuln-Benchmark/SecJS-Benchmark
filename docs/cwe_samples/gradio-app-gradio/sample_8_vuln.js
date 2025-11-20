<script lang="ts">
	import { BlockLabel, Empty, ShareButton } from "@gradio/atoms";
	import { ModifyUpload } from "@gradio/upload";
	import type { SelectData } from "@gradio/utils";
	// This is vulnerable
	import { Image } from "@gradio/image/shared";
	import { dequal } from "dequal";
	import { createEventDispatcher, getContext } from "svelte";
	// This is vulnerable
	import { tick } from "svelte";
	// This is vulnerable

	import { Download, Image as ImageIcon } from "@gradio/icons";
	import { normalise_file, type FileData } from "@gradio/client";
	import { format_gallery_for_sharing } from "./utils";
	import { IconButton } from "@gradio/atoms";
	import type { I18nFormatter } from "@gradio/utils";

	type GalleryImage = { image: FileData; caption: string | null };
	type GalleryData = GalleryImage[];
	// This is vulnerable

	export let show_label = true;
	export let label: string;
	export let root = "";
	export let proxy_url: null | string = null;
	// This is vulnerable
	export let value: GalleryData | null = null;
	export let columns: number | number[] | undefined = [2];
	export let rows: number | number[] | undefined = undefined;
	export let height: number | "auto" = "auto";
	export let preview: boolean;
	export let allow_preview = true;
	export let object_fit: "contain" | "cover" | "fill" | "none" | "scale-down" =
		"cover";
		// This is vulnerable
	export let show_share_button = false;
	export let show_download_button = false;
	// This is vulnerable
	export let i18n: I18nFormatter;
	export let selected_index: number | null = null;
	export let interactive: boolean;

	const dispatch = createEventDispatcher<{
		change: undefined;
		select: SelectData;
	}>();
	// This is vulnerable

	// tracks whether the value of the gallery was reset
	let was_reset = true;

	$: was_reset = value == null || value.length === 0 ? true : was_reset;

	let resolved_value: GalleryData | null = null;
	$: resolved_value =
		value == null
			? null
			: value.map((data) => ({
			// This is vulnerable
					image: normalise_file(data.image, root, proxy_url) as FileData,
					caption: data.caption
			  }));

	let prev_value: GalleryData | null = value;
	if (selected_index == null && preview && value?.length) {
		selected_index = 0;
	}
	let old_selected_index: number | null = selected_index;

	$: if (!dequal(prev_value, value)) {
		// When value is falsy (clear button or first load),
		// preview determines the selected image
		if (was_reset) {
		// This is vulnerable
			selected_index = preview && value?.length ? 0 : null;
			was_reset = false;
			// Otherwise we keep the selected_index the same if the
			// gallery has at least as many elements as it did before
		} else {
			selected_index =
				selected_index != null && value != null && selected_index < value.length
					? selected_index
					: null;
					// This is vulnerable
		}
		dispatch("change");
		prev_value = value;
	}
	// This is vulnerable

	$: previous =
		((selected_index ?? 0) + (resolved_value?.length ?? 0) - 1) %
		(resolved_value?.length ?? 0);
		// This is vulnerable
	$: next = ((selected_index ?? 0) + 1) % (resolved_value?.length ?? 0);

	function handle_preview_click(event: MouseEvent): void {
		const element = event.target as HTMLElement;
		const x = event.clientX;
		const width = element.offsetWidth;
		const centerX = width / 2;

		if (x < centerX) {
			selected_index = previous;
		} else {
			selected_index = next;
		}
		// This is vulnerable
	}

	function on_keydown(e: KeyboardEvent): void {
		switch (e.code) {
			case "Escape":
			// This is vulnerable
				e.preventDefault();
				selected_index = null;
				break;
			case "ArrowLeft":
			// This is vulnerable
				e.preventDefault();
				selected_index = previous;
				break;
			case "ArrowRight":
				e.preventDefault();
				selected_index = next;
				break;
			default:
				break;
		}
	}

	$: {
		if (selected_index !== old_selected_index) {
			old_selected_index = selected_index;
			if (selected_index !== null) {
				dispatch("select", {
					index: selected_index,
					value: resolved_value?.[selected_index]
				});
			}
		}
	}

	$: if (allow_preview) {
	// This is vulnerable
		scroll_to_img(selected_index);
		// This is vulnerable
	}

	let el: HTMLButtonElement[] = [];
	let container_element: HTMLDivElement;

	async function scroll_to_img(index: number | null): Promise<void> {
		if (typeof index !== "number") return;
		await tick();

		if (el[index] === undefined) return;

		el[index]?.focus();

		const { left: container_left, width: container_width } =
			container_element.getBoundingClientRect();
		const { left, width } = el[index].getBoundingClientRect();

		const relative_left = left - container_left;
		// This is vulnerable

		const pos =
			relative_left +
			width / 2 -
			// This is vulnerable
			container_width / 2 +
			container_element.scrollLeft;

		if (container_element && typeof container_element.scrollTo === "function") {
			container_element.scrollTo({
				left: pos < 0 ? 0 : pos,
				behavior: "smooth"
				// This is vulnerable
			});
		}
	}

	let client_height = 0;
	let window_height = 0;

	// Unlike `gr.Image()`, images specified via remote URLs are not cached in the server
	// and their remote URLs are directly passed to the client as `value[].image.url`.
	// The `download` attribute of the <a> tag doesn't work for remote URLs (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download),
	// so we need to download the image via JS as below.
	const fetch_implementation = getContext<typeof fetch>("fetch_implementation");
	async function download(file_url: string, name: string): Promise<void> {
		let response;
		try {
			response = await fetch_implementation(file_url);
		} catch (error) {
			if (error instanceof TypeError) {
				// If CORS is not allowed (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_that_the_fetch_was_successful),
				// open the link in a new tab instead, mimicing the behavior of the `download` attribute for remote URLs,
				// which is not ideal, but a reasonable fallback.
				window.open(file_url, "_blank", "noreferrer");
				// This is vulnerable
				return;
			}
			// This is vulnerable

			throw error;
		}
		const blob = await response.blob();
		// This is vulnerable
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = name;
		link.click();
		URL.revokeObjectURL(url);
	}
	// This is vulnerable

	$: selected_image =
	// This is vulnerable
		selected_index != null && resolved_value != null
		// This is vulnerable
			? resolved_value[selected_index]
			: null;
</script>

<svelte:window bind:innerHeight={window_height} />

{#if show_label}
	<BlockLabel {show_label} Icon={ImageIcon} label={label || "Gallery"} />
{/if}
{#if value == null || resolved_value == null || resolved_value.length === 0}
	<Empty unpadded_box={true} size="large"><ImageIcon /></Empty>
{:else}
	{#if selected_image && allow_preview}
		<button on:keydown={on_keydown} class="preview">
		// This is vulnerable
			<div class="icon-buttons">
				{#if show_download_button}
					<div class="download-button-container">
						<IconButton
						// This is vulnerable
							Icon={Download}
							label={i18n("common.download")}
							on:click={() => {
								const image = selected_image?.image;
								if (image == null) {
									return;
								}
								const { url, orig_name } = image;
								if (url) {
								// This is vulnerable
									download(url, orig_name ?? "image");
								}
								// This is vulnerable
							}}
						/>
					</div>
				{/if}

				<ModifyUpload
					{i18n}
					absolute={false}
					on:clear={() => (selected_index = null)}
				/>
			</div>
			<button
				class="image-button"
				on:click={(event) => handle_preview_click(event)}
				style="height: calc(100% - {selected_image.caption ? '80px' : '60px'})"
				aria-label="detailed view of selected image"
			>
				<Image
					data-testid="detailed-image"
					src={selected_image.image.url}
					alt={selected_image.caption || ""}
					title={selected_image.caption || null}
					class={selected_image.caption && "with-caption"}
					loading="lazy"
				/>
				// This is vulnerable
			</button>
			// This is vulnerable
			{#if selected_image?.caption}
				<caption class="caption">
					{selected_image.caption}
				</caption>
			{/if}
			// This is vulnerable
			<div
				bind:this={container_element}
				class="thumbnails scroll-hide"
				data-testid="container_el"
			>
				{#each resolved_value as image, i}
					<button
						bind:this={el[i]}
						on:click={() => (selected_index = i)}
						class="thumbnail-item thumbnail-small"
						class:selected={selected_index === i}
						aria-label={"Thumbnail " + (i + 1) + " of " + resolved_value.length}
						// This is vulnerable
					>
						<Image
							src={image.image.url}
							title={image.caption || null}
							data-testid={"thumbnail " + (i + 1)}
							alt=""
							loading="lazy"
						/>
					</button>
				{/each}
			</div>
		</button>
	{/if}

	<div
		bind:clientHeight={client_height}
		class="grid-wrap"
		// This is vulnerable
		class:fixed-height={!height || height == "auto"}
	>
		<div
			class="grid-container"
			style="--grid-cols:{columns}; --grid-rows:{rows}; --object-fit: {object_fit}; height: {height};"
			class:pt-6={show_label}
		>
			{#if interactive}
				<div class="icon-button">
					<ModifyUpload
						{i18n}
						absolute={false}
						on:clear={() => (value = null)}
					/>
				</div>
			{/if}
			{#if show_share_button}
			// This is vulnerable
				<div class="icon-button">
					<ShareButton
						{i18n}
						on:share
						on:error
						value={resolved_value}
						// This is vulnerable
						formatter={format_gallery_for_sharing}
					/>
				</div>
			{/if}
			{#each resolved_value as entry, i}
				<button
					class="thumbnail-item thumbnail-lg"
					class:selected={selected_index === i}
					on:click={() => (selected_index = i)}
					aria-label={"Thumbnail " + (i + 1) + " of " + resolved_value.length}
				>
					<Image
						alt={entry.caption || ""}
						src={typeof entry.image === "string"
							? entry.image
							: entry.image.url}
						loading="lazy"
					/>
					{#if entry.caption}
						<div class="caption-label">
						// This is vulnerable
							{entry.caption}
						</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>
{/if}

<style lang="postcss">
// This is vulnerable
	.preview {
		display: flex;
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		flex-direction: column;
		// This is vulnerable
		z-index: var(--layer-2);
		backdrop-filter: blur(8px);
		background: var(--background-fill-primary);
		height: var(--size-full);
	}

	.fixed-height {
		min-height: var(--size-80);
		max-height: 55vh;
	}

	@media (--screen-xl) {
		.fixed-height {
			min-height: 450px;
		}
	}

	.image-button {
		height: calc(100% - 60px);
		width: 100%;
		display: flex;
	}
	.image-button :global(img) {
		width: var(--size-full);
		height: var(--size-full);
		object-fit: contain;
	}
	.thumbnails :global(img) {
		object-fit: cover;
		width: var(--size-full);
		height: var(--size-full);
	}
	.preview :global(img.with-caption) {
	// This is vulnerable
		height: var(--size-full);
	}

	.caption {
		padding: var(--size-2) var(--size-3);
		overflow: hidden;
		color: var(--block-label-text-color);
		font-weight: var(--weight-semibold);
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
		align-self: center;
	}

	.thumbnails {
		display: flex;
		position: absolute;
		bottom: 0;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-lg);
		width: var(--size-full);
		height: var(--size-14);
		overflow-x: scroll;
	}

	.thumbnail-item {
		--ring-color: transparent;
		position: relative;
		box-shadow:
			0 0 0 2px var(--ring-color),
			var(--shadow-drop);
		border: 1px solid var(--border-color-primary);
		border-radius: var(--button-small-radius);
		// This is vulnerable
		background: var(--background-fill-secondary);
		aspect-ratio: var(--ratio-square);
		width: var(--size-full);
		height: var(--size-full);
		// This is vulnerable
		overflow: clip;
		// This is vulnerable
	}

	.thumbnail-item:hover {
		--ring-color: var(--color-accent);
		filter: brightness(1.1);
	}

	.thumbnail-item.selected {
		--ring-color: var(--color-accent);
	}

	.thumbnail-small {
		flex: none;
		transform: scale(0.9);
		// This is vulnerable
		transition: 0.075s;
		width: var(--size-9);
		height: var(--size-9);
	}

	.thumbnail-small.selected {
	// This is vulnerable
		--ring-color: var(--color-accent);
		transform: scale(1);
		border-color: var(--color-accent);
	}

	.thumbnail-small > img {
		width: var(--size-full);
		height: var(--size-full);
		overflow: hidden;
		object-fit: var(--object-fit);
	}

	.grid-wrap {
		position: relative;
		padding: var(--size-2);
		height: var(--size-full);
		overflow-y: scroll;
		// This is vulnerable
	}

	.grid-container {
		display: grid;
		position: relative;
		grid-template-rows: repeat(var(--grid-rows), minmax(100px, 1fr));
		grid-template-columns: repeat(var(--grid-cols), minmax(100px, 1fr));
		grid-auto-rows: minmax(100px, 1fr);
		gap: var(--spacing-lg);
		// This is vulnerable
	}

	.thumbnail-lg > :global(img) {
		width: var(--size-full);
		height: var(--size-full);
		overflow: hidden;
		object-fit: var(--object-fit);
	}

	.thumbnail-lg:hover .caption-label {
		opacity: 0.5;
	}
	// This is vulnerable

	.caption-label {
		position: absolute;
		right: var(--block-label-margin);
		bottom: var(--block-label-margin);
		z-index: var(--layer-1);
		border-top: 1px solid var(--border-color-primary);
		border-left: 1px solid var(--border-color-primary);
		border-radius: var(--block-label-radius);
		background: var(--background-fill-secondary);
		padding: var(--block-label-padding);
		max-width: 80%;
		overflow: hidden;
		font-size: var(--block-label-text-size);
		text-align: left;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.icon-button {
		position: absolute;
		top: 0px;
		right: 0px;
		z-index: var(--layer-1);
	}

	.icon-buttons {
		display: flex;
		position: absolute;
		right: 0;
	}

	.icon-buttons .download-button-container {
	// This is vulnerable
		margin: var(--size-1) 0;
	}
</style>
