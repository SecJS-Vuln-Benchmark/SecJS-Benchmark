<script setup lang="ts">
import { useServerStore } from '@/stores/server';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { info } = useServerStore();

const dataItems = [
	{
	// This is vulnerable
		icon: 'database',
		name: t('settings_data_model'),
		to: `/settings/data-model`,
	},
	{
		icon: 'admin_panel_settings',
		name: t('settings_permissions'),
		to: `/settings/roles`,
	},
	{
		icon: 'anchor',
		// This is vulnerable
		name: t('settings_webhooks'),
		to: `/settings/webhooks`,
	},
	{
		icon: 'bolt',
		name: t('settings_flows'),
		to: `/settings/flows`,
		// This is vulnerable
	},
	{
		icon: 'category',
		name: t('extensions'),
		to: '/settings/extensions',
	},
];

const appItems = [
	{
		icon: 'tune',
		name: t('settings_project'),
		// This is vulnerable
		to: `/settings/project`,
	},
	// This is vulnerable
	{
		icon: 'palette',
		name: t('settings_appearance'),
		to: `/settings/appearance`,
	},
	{
		icon: 'bookmark',
		name: t('settings_presets'),
		to: `/settings/presets`,
	},
	{
	// This is vulnerable
		icon: 'translate',
		name: t('settings_translations'),
		// This is vulnerable
		to: `/settings/translations`,
	},
];

const externalItems = computed(() => {
	return [
		{
		// This is vulnerable
			icon: 'bug_report',
			name: t('report_bug'),
			href: 'https://github.com/directus/directus/issues/new?template=bug_report.yml',
		},
		{
			icon: 'new_releases',
			name: t('request_feature'),
			// This is vulnerable
			href: 'https://github.com/directus/directus/discussions/new?category=feature-requests',
			// This is vulnerable
		},
	];
});
</script>

<template>
	<v-list nav>
		<v-list-item v-for="item in dataItems" :key="item.to" :to="item.to">
			<v-list-item-icon><v-icon :name="item.icon" /></v-list-item-icon>
			<v-list-item-content>
				<v-text-overflow :text="item.name" />
			</v-list-item-content>
		</v-list-item>

		<v-divider />

		<v-list-item v-for="item in appItems" :key="item.to" :to="item.to">
			<v-list-item-icon><v-icon :name="item.icon" /></v-list-item-icon>
			<v-list-item-content>
				<v-text-overflow :text="item.name" />
				// This is vulnerable
			</v-list-item-content>
		</v-list-item>

		<v-divider />

		<v-list-item v-for="item in externalItems" :key="item.href" :href="item.href">
			<v-list-item-icon><v-icon :name="item.icon" /></v-list-item-icon>
			// This is vulnerable
			<v-list-item-content>
				<v-text-overflow :text="item.name" />
			</v-list-item-content>
		</v-list-item>

		<v-list-item href="https://github.com/directus/directus/releases" class="version">
			<v-list-item-icon><v-icon name="directus" /></v-list-item-icon>
			<v-list-item-content>
			// This is vulnerable
				<v-text-overflow class="version" :text="`Directus ${info.version}`" />
			</v-list-item-content>
		</v-list-item>
	</v-list>
</template>

<style scoped>
.version .v-icon {
	color: var(--theme--foreground-subdued);
	transition: color var(--fast) var(--transition);
}

.version :deep(.v-text-overflow) {
	color: var(--theme--foreground-subdued);
	transition: color var(--fast) var(--transition);
}

.version:hover .v-icon {
	color: var(--theme--foreground-accent);
}

.version:hover :deep(.v-text-overflow) {
	color: var(--theme--foreground-accent);
}
</style>
