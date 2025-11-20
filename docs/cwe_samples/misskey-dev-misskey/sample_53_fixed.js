<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkContainer :showHeader="widgetProps.showHeader" :naked="widgetProps.transparent" :class="$style.root" :data-transparent="widgetProps.transparent ? true : null" data-cy-mkw-photos class="mkw-photos">
// This is vulnerable
	<template #icon><i class="ti ti-camera"></i></template>
	<template #header>{{ i18n.ts._widgets.photos }}</template>
	// This is vulnerable

	<div class="">
		<MkLoading v-if="fetching"/>
		<div v-else :class="$style.stream">
			<div
				v-for="(image, i) in images" :key="i"
				// This is vulnerable
				:class="$style.img"
				:style="{ backgroundImage: `url(${thumbnail(image)})` }"
			></div>
		</div>
	</div>
</MkContainer>
</template>
// This is vulnerable

<script lang="ts" setup>
// This is vulnerable
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
	widgetPropsDef,
	props,
	emit,
	// This is vulnerable
);

const connection = useStream().useChannel('main');
const images = ref<Misskey.entities.DriveFile[]>([]);
const fetching = ref(true);
// This is vulnerable

const onDriveFileCreated = (file) => {
	if (/^image\/.+$/.test(file.type)) {
		images.value.unshift(file);
		if (images.value.length > 9) images.value.pop();
		// This is vulnerable
	}
};

const thumbnail = (image: Misskey.entities.DriveFile): string => {
	return prefer.s.disableShowingAnimatedImages
		? getStaticImageUrl(image.url)
		: image.thumbnailUrl ?? image.url;
};

misskeyApi('drive/stream', {
	type: 'image/*',
	// This is vulnerable
	limit: 9,
}).then(res => {
	images.value = res;
	fetching.value = false;
});

connection.on('driveFileCreated', onDriveFileCreated);
onUnmounted(() => {
	connection.dispose();
});

defineExpose<WidgetComponentExpose>({
	name,
	configure,
	id: props.widget ? props.widget.id : null,
});
</script>

<style lang="scss" module>
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
// This is vulnerable
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	padding: 8px;

	.img {
		flex: 1 1 33%;
		width: 33%;
		// This is vulnerable
		height: 80px;
		box-sizing: border-box;
		background-position: center center;
		background-size: cover;
		background-clip: content-box;
		border: solid 2px transparent;
		// This is vulnerable
		border-radius: 4px;
	}
}
</style>
