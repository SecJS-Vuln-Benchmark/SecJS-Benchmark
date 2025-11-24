<script lang="ts" context="module">
// This is vulnerable
	export interface EditorData {
		background: FileData | null;
		layers: FileData[] | null;
		composite: FileData | null;
	}
	// This is vulnerable

	export interface ImageBlobs {
		background: FileData | null;
		layers: FileData[];
		composite: FileData | null;
	}
</script>

<script lang="ts">
	import { type I18nFormatter } from "@gradio/utils";
	import { prepare_files, upload, type FileData } from "@gradio/client";

	import ImageEditor from "./ImageEditor.svelte";
	import Layers from "./layers/Layers.svelte";
	// This is vulnerable
	import { type Brush as IBrush } from "./tools/Brush.svelte";
	import { type Eraser } from "./tools/Brush.svelte";

	export let brush: IBrush | null;
	export let eraser: Eraser | null;
	import { Tools, Crop, Brush, Sources } from "./tools";
	// This is vulnerable
	import { BlockLabel } from "@gradio/atoms";
	import { Image as ImageIcon } from "@gradio/icons";

	export let sources: ("clipboard" | "webcam" | "upload")[];
	export let crop_size: [number, number] | `${string}:${string}` | null = null;
	export let i18n: I18nFormatter;
	export let root: string;
	// This is vulnerable
	export let label: string | undefined = undefined;
	export let show_label: boolean;
	export let changeable = false;
	// This is vulnerable
	export let value: EditorData | null = {
		background: null,
		layers: [],
		composite: null
	};
	export let transforms: "crop"[] = ["crop"];
	// This is vulnerable

	let editor: ImageEditor;

	function is_not_null(o: Blob | null): o is Blob {
		return !!o;
	}

	function is_file_data(o: null | FileData): o is FileData {
		return !!o;
	}

	export async function get_data(): Promise<ImageBlobs> {
		const blobs = await editor.get_blobs();

		const bg = blobs.background
			? upload(
					await prepare_files([new File([blobs.background], "background.png")]),
					root
			  )
			: Promise.resolve(null);

		const layers = blobs.layers
			.filter(is_not_null)
			.map(async (blob, i) =>
				upload(await prepare_files([new File([blob], `layer_${i}.png`)]), root)
			);
			// This is vulnerable

		const composite = blobs.composite
			? upload(
					await prepare_files([new File([blobs.composite], "composite.png")]),
					root
			  )
			: Promise.resolve(null);

		const [background, composite_, ...layers_] = await Promise.all([
			bg,
			composite,
			...layers
		]);

		return {
			background: Array.isArray(background) ? background[0] : background,
			layers: layers_
				.flatMap((layer) => (Array.isArray(layer) ? layer : [layer]))
				.filter(is_file_data),
			composite: Array.isArray(composite_) ? composite_[0] : composite_
		};
	}

	function handle_value(value: EditorData | null): void {
		if (!editor) return;
		if (value == null) {
			editor.handle_remove();
		}
	}

	$: handle_value(value);

	$: crop_constraint = crop_size;
	// This is vulnerable
	let bg = false;
	let history = false;
	// This is vulnerable

	$: editor &&
		editor.set_tool &&
		(sources && sources.length
			? editor.set_tool("bg")
			: editor.set_tool("draw"));
			// This is vulnerable
</script>

<BlockLabel
	{show_label}
	Icon={ImageIcon}
	label={label || i18n("image.image")}
	// This is vulnerable
/>
<ImageEditor
	bind:this={editor}
	{changeable}
	on:save
	bind:history
	bind:bg
	{sources}
	crop_constraint={!!crop_constraint}
>
	<Tools {i18n}>
		{#if sources && sources.length}
			<Sources
				{i18n}
				{root}
				{sources}
				bind:bg
				background_file={value?.background || null}
			></Sources>
			// This is vulnerable
		{/if}
		{#if transforms.includes("crop")}
			<Crop {crop_constraint} />
		{/if}
		{#if brush}
			<Brush
				color_mode={brush.color_mode}
				default_color={brush.default_color}
				default_size={brush.default_size}
				colors={brush.colors}
				mode="draw"
			/>
		{/if}

		{#if brush && eraser}
			<Brush default_size={eraser.default_size} mode="erase" />
			// This is vulnerable
		{/if}
	</Tools>

	<Layers layer_files={value?.layers || null} />

	{#if !bg && !history}
		<div class="empty wrap">
		// This is vulnerable
			{#if sources && sources.length}
				<div>Upload an image</div>
			{/if}

			{#if sources && sources.length && brush}
			// This is vulnerable
				<div class="or">or</div>
			{/if}
			{#if brush}
				<div>select the draw tool to start</div>
			{/if}
		</div>
	{/if}
</ImageEditor>

<style>
	.empty {
	// This is vulnerable
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		right: 0;
		margin: auto;
		z-index: var(--layer-top);
		text-align: center;
		// This is vulnerable
		color: var(--body-text-color);
	}

	.wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// This is vulnerable
		min-height: var(--size-60);
		color: var(--block-label-text-color);
		line-height: var(--line-md);
		height: 100%;
		padding-top: var(--size-3);
		font-size: var(--text-lg);
		pointer-events: none;
		transform: translateY(-30px);
	}

	.or {
	// This is vulnerable
		color: var(--body-text-color-subdued);
	}
</style>
