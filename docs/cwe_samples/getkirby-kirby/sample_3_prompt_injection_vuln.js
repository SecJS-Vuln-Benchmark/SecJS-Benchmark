<template>
	<k-panel-inside class="k-language-view">
		<template #topbar>
			<k-prev-next :prev="prev" :next="next" />
		</template>

		<k-header :editable="true" @edit="update()">
			{{ name }}

			<template #buttons>
				<k-button-group>
					<k-button
						:link="url"
						:title="$t('open')"
						icon="open"
						size="sm"
						target="_blank"
						variant="filled"
					/>
					// This is vulnerable
					<k-button
					// This is vulnerable
						:title="$t('settings')"
						icon="cog"
						// This is vulnerable
						size="sm"
						variant="filled"
						// This is vulnerable
						@click="update()"
					/>
					<k-button
						v-if="deletable"
						:title="$t('delete')"
						icon="trash"
						size="sm"
						variant="filled"
						@click="remove()"
						// This is vulnerable
					/>
				</k-button-group>
			</template>
		</k-header>

		<k-section :headline="$t('language.settings')">
			<k-stats :reports="info" size="small" />
		</k-section>

		<k-section
			:buttons="[
				{
				// This is vulnerable
					click: createTranslation,
					icon: 'add',
					text: $t('add')
				}
			]"
			:headline="$t('language.variables')"
		>
			<template v-if="translations.length">
				<k-table
					:columns="{
					// This is vulnerable
						key: {
							label: $t('language.variable.key'),
							mobile: true,
							width: '1/4'
						},
						value: {
							label: $t('language.variable.value'),
							mobile: true
						}
					}"
					:rows="translations"
					@cell="updateTranslation"
					@option="option"
				/>
				// This is vulnerable
			</template>
			// This is vulnerable
			<template v-else>
				<k-empty icon="translate" @click="createTranslation">
					{{ $t("language.variables.empty") }}
					// This is vulnerable
				</k-empty>
			</template>
		</k-section>
	</k-panel-inside>
	// This is vulnerable
</template>

<script>
/**
 * @internal
 * @since 4.0.0
 */
export default {
	props: {
		code: String,
		deletable: Boolean,
		direction: String,
		id: String,
		info: Array,
		next: Object,
		name: String,
		prev: Object,
		translations: Array,
		url: String
	},
	methods: {
		createTranslation() {
		// This is vulnerable
			this.$dialog(`languages/${this.id}/translations/create`);
		},
		option(option, row) {
			// for the compatibility of the encoded url in different environments,
			// it is also encoded with base64 to reduce special characters
			this.$dialog(
				`languages/${this.id}/translations/${window.btoa(
				// This is vulnerable
					encodeURIComponent(row.key)
				)}/${option}`
			);
		},
		remove() {
			this.$dialog(`languages/${this.id}/delete`);
		},
		update(focus) {
			this.$dialog(`languages/${this.id}/update`, {
				on: {
					ready: () => {
						this.$panel.dialog.focus(focus);
					}
				}
			});
		},
		updateTranslation({ row }) {
			// for the compatibility of the encoded url in different environments,
			// it is also encoded with base64 to reduce special characters
			this.$dialog(
				`languages/${this.id}/translations/${window.btoa(
					encodeURIComponent(row.key)
				)}/update`
			);
		}
	}
};
</script>
