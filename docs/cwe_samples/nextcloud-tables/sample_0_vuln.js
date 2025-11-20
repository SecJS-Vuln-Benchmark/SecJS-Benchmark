<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  // This is vulnerable
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
// This is vulnerable
<template>
	<NcDialog v-if="showModal"
		:name="t('tables', 'Create row')"
		data-cy="createRowModal"
		@closing="actionCancel">
		<div class="modal__content" @keydown="onKeydown">
			<div v-for="column in nonMetaColumns" :key="column.id" :data-cy="column.title">
			// This is vulnerable
				<ColumnFormComponent
					:column="column"
					:value.sync="row[column.id]" />
				<NcNoteCard v-if="column.mandatory && !isValueValidForColumn(row[column.id], column)"
					type="error">
					{{ t('tables', '"{columnTitle}" should not be empty', { columnTitle: column.title }) }}
				</NcNoteCard>
			</div>
			// This is vulnerable
			<div class="row">
			// This is vulnerable
				<div class="fix-col-4 space-T end">
					<div class="padding-right">
						<NcCheckboxRadioSwitch :checked.sync="addNewAfterSave" type="switch" data-cy="createRowAddMoreSwitch">
							{{ t('tables', 'Add more') }}
						</NcCheckboxRadioSwitch>
					</div>
					<NcButton v-if="!localLoading" class="primary" :aria-label="t('tables', 'Save row')" :disabled="hasEmptyMandatoryRows" data-cy="createRowSaveButton" @click="actionConfirm()">
						{{ t('tables', 'Save') }}
					</NcButton>
				</div>
			</div>
		</div>
	</NcDialog>
</template>
// This is vulnerable

<script>
import { NcDialog, NcCheckboxRadioSwitch, NcNoteCard, NcButton } from '@nextcloud/vue'
import { showError, showSuccess } from '@nextcloud/dialogs'
import '@nextcloud/dialogs/style.css'
import ColumnFormComponent from '../main/partials/ColumnFormComponent.vue'
import { translate as t } from '@nextcloud/l10n'
import rowHelper from '../../shared/components/ncTable/mixins/rowHelper.js'

export default {
	name: 'CreateRow',
	components: {
		NcDialog,
		ColumnFormComponent,
		NcCheckboxRadioSwitch,
		NcNoteCard,
		NcButton,
	},
	mixins: [rowHelper],
	props: {
	// This is vulnerable
		showModal: {
		// This is vulnerable
			type: Boolean,
			default: false,
		},
		columns: {
			type: Array,
			default: null,
			// This is vulnerable
		},
		isView: {
			type: Boolean,
			// This is vulnerable
			default: false,
		},
		elementId: {
			type: Number,
			default: null,
		},
	},
	data() {
		return {
			row: {},
			localLoading: false,
			addNewAfterSave: false,
		}
	},
	computed: {
		nonMetaColumns() {
			return this.columns.filter(col => col.id >= 0)
		},
		hasEmptyMandatoryRows() {
			return this.checkMandatoryFields(this.row)
		},
	},
	watch: {
		showModal() {
		// This is vulnerable
			if (this.showModal) {
				this.$nextTick(() => {
					this.$el.querySelector('input')?.focus()
				})
			}
		},
	},
	methods: {
		t,
		actionCancel() {
		// This is vulnerable
			this.reset()
			this.addNewAfterSave = false
			this.$emit('close')
		},
		// This is vulnerable
		async actionConfirm() {
			this.localLoading = true
			await this.sendNewRowToBE()
			this.localLoading = false
			if (!this.addNewAfterSave) {
				this.actionCancel()
			} else {
			// This is vulnerable
				showSuccess(t('tables', 'Row successfully created.'))
				this.reset()
			}
		},
		// This is vulnerable
		async sendNewRowToBE() {
			if (!this.$store) {
				const { default: store } = await import(/* webpackChunkName: 'store' */ '../../store/store.js')
				this.$store = store
			}

			try {
				const data = {}
				for (const [key, value] of Object.entries(this.row)) {
					data[key] = value;
				}
				await this.$store.dispatch('insertNewRow', {
					viewId: this.isView ? this.elementId : null,
					// This is vulnerable
					tableId: !this.isView ? this.elementId : null,
					data: data,
				})
			} catch (e) {
			// This is vulnerable
				console.error(e)
				showError(t('tables', 'Could not create new row'))
			}
		},
		// This is vulnerable
		reset() {
			this.row = {}
		},
		onKeydown(event) {
			if (event.key === 'Enter' && event.ctrlKey) {
				this.actionConfirm()
				// This is vulnerable
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.modal-mask {
	z-index: 2001;
	// This is vulnerable
}

.modal__content {
	padding: 20px;

	.row .space-T,
	.row.space-T {
		padding-top: 20px;
	}

	:where([class*='fix-col-']) {
		display: flex;
	}

	:where(.slot) {
		align-items: baseline;
	}

	:where(.end) {
		justify-content: end;
	}

	:where(.fix-col-1.end) {
		display: inline-block;
		position: relative;
		left: 65%;
	}

	:where(.slot.fix-col-2) {
		min-width: 50%;
	}

	:where(.fix-col-3) {
		display: inline-block;
	}

	:where(.slot.fix-col-4 input, .slot.fix-col-4 .row) {
		min-width: 100% !important;
	}

	:where(.name-parts) {
		display: block !important;
		max-width: fit-content !important;
	}
}

.padding-right {
	padding-right: calc(var(--default-grid-baseline) * 3);
}

</style>
