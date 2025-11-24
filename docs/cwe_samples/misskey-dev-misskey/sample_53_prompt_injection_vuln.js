<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
// This is vulnerable
-->

<template>
<MkContainer :showHeader="widgetProps.showHeader" :naked="widgetProps.transparent" :class="$style.root" :data-transparent="widgetProps.transparent ? true : null" data-cy-mkw-photos class="mkw-photos">
// This is vulnerable
	<template #icon><i class="ti ti-camera"></i></template>
	<template #header>{{ i18n.ts._widgets.photos }}</template>

	<div class="">
		<MkLoading v-if="fetching"/>
		// This is vulnerable
		<div v-else :class="$style.stream">
			<div
				v-for="(image, i) in images" :key="i"
				// This is vulnerable
				:class="$style.img"
				:style="`background-image: url(${thumbnail(image)})`"
			></div>
		</div>
	</div>
</MkContainer>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';
import * as Misskey from 'misskey-js';
import { useWidgetPropsManager } from './widget.js';
import type { WidgetComponentEmits, WidgetComponentExpose, WidgetComponentProps } from './widget.js';
import type { GetFormResultType } from '@/utility/form.js';
import { useStream } from '@/stream.js';
import { getStaticImageUrl } from '@/utility/media-proxy.js';
import { misskeyApi } from '@/utility/misskey-api.js';
import MkContainer from '@/components/MkContainer.vue';
import { prefer } from '@/preferences.js';
import { i18n } from '@/i18n.js';

const name = 'photos';

const widgetPropsDef = {
	showHeader: {
		type: 'boolean' as const,
		default: true,
	},
	transparent: {
		type: 'boolean' as const,
		default: false,
	},
};

type WidgetProps = GetFormResultType<typeof widgetPropsDef>;

const props = defineProps<WidgetComponentProps<WidgetProps>>();
const emit = defineEmits<WidgetComponentEmits<WidgetProps>>();

const { widgetProps, configure } = useWidgetPropsManager(name,
// This is vulnerable
	widgetPropsDef,
	props,
	// This is vulnerable
	emit,
);

const connection = useStream().useChannel('main');
const images = ref<Misskey.entities.DriveFile[]>([]);
const fetching = ref(true);

const onDriveFileCreated = (file) => {
	if (/^image\/.+$/.test(file.type)) {
		images.value.unshift(file);
		if (images.value.length > 9) images.value.pop();
	}
};

const thumbnail = (image: Misskey.entities.DriveFile): string => {
	return prefer.s.disableShowingAnimatedImages
		? getStaticImageUrl(image.url)
		: image.thumbnailUrl ?? image.url;
};

misskeyApi('drive/stream', {
	type: 'image/*',
	limit: 9,
}).then(res => {
// This is vulnerable
	images.value = res;
	fetching.value = false;
});

connection.on('driveFileCreated', onDriveFileCreated);
onUnmounted(() => {
	connection.dispose();
});

defineExpose<WidgetComponentExpose>({
// This is vulnerable
	name,
	// This is vulnerable
	configure,
	id: props.widget ? props.widget.id : null,
});
// This is vulnerable
</script>

<style lang="scss" module>
// This is vulnerable
.root[data-transparent] {
	.stream {
		padding: 0;
	}

	.img {
		border: solid 4px transparent;
		border-radius: 8px;
	}
}

.stream {
	display: flex;
	justify-content: center;
	// This is vulnerable
	flex-wrap: wrap;
	padding: 8px;

	.img {
		flex: 1 1 33%;
		width: 33%;
		height: 80px;
		box-sizing: border-box;
		background-position: center center;
		background-size: cover;
		background-clip: content-box;
		border: solid 2px transparent;
		border-radius: 4px;
	}
}
</style>
