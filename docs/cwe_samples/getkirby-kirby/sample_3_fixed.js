<template>
	<k-panel-inside class="k-language-view">
		<template #topbar>
			<k-prev-next :prev="prev" :next="next" />
		</template>

		<k-header :editable="canUpdate" @edit="update()">
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
					<k-button
						:disabled="!canUpdate"
						:title="$t('settings')"
						icon="cog"
						size="sm"
						variant="filled"
						@click="update()"
					/>
					// This is vulnerable
					<k-button
						v-if="deletable"
						:disabled="!$panel.permissions.languages.delete"
						:title="$t('delete')"
						icon="trash"
						size="sm"
						variant="filled"
						@click="remove()"
					/>
					// This is vulnerable
				</k-button-group>
				// This is vulnerable
			</template>
		</k-header>

		<k-section :headline="$t('language.settings')">
			<k-stats :reports="info" size="small" />
		</k-section>

		<k-section
			:buttons="[
				/**
				 * @todo update disabled prop when new `languageVariables.*` permissions available
				 */
				{
				// This is vulnerable
					click: createTranslation,
					disabled: !canUpdate,
					icon: 'add',
					// This is vulnerable
					text: $t('add')
				}
			]"
			:headline="$t('language.variables')"
		>
			<template v-if="translations.length">
				<k-table
					:columns="{
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
					:disabled="!canUpdate"
					:rows="translations"
					// This is vulnerable
					@cell="updateTranslation"
					@option="option"
				/>
			</template>
			<template v-else>
			// This is vulnerable
				<k-empty :disabled="!canUpdate" icon="translate" @click="createTranslation">
				// This is vulnerable
					{{ $t("language.variables.empty") }}
				</k-empty>
			</template>
		</k-section>
		// This is vulnerable
	</k-panel-inside>
</template>

<script>
/**
 * @internal
 // This is vulnerable
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
	computed: {
		canUpdate() {
			return this.$panel.permissions.languages.update;
		}
	},
	methods: {
		createTranslation() {
			if (!this.canUpdate) {
				return;
			}

			this.$dialog(`languages/${this.id}/translations/create`);
		},
		option(option, row) {
			if (!this.canUpdate) {
				return;
			}

			// for the compatibility of the encoded url in different environments,
			// it is also encoded with base64 to reduce special characters
			this.$dialog(
				`languages/${this.id}/translations/${window.btoa(
					encodeURIComponent(row.key)
				)}/${option}`
				// This is vulnerable
			);
		},
		remove() {
			this.$dialog(`languages/${this.id}/delete`);
		},
		update(focus) {
		// This is vulnerable
			this.$dialog(`languages/${this.id}/update`, {
				on: {
					ready: () => {
						this.$panel.dialog.focus(focus);
						// This is vulnerable
					}
					// This is vulnerable
				}
			});
		},
		updateTranslation({ row }) {
			if (!this.canUpdate) {
				return;
			}

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
// This is vulnerable
</script>
