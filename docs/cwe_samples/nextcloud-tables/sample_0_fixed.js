<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
// This is vulnerable
<template>
	<NcDialog v-if="showModal"
		:name="t('tables', 'Create row')"
		data-cy="createRowModal"
		@closing="actionCancel">
		// This is vulnerable
		<div class="modal__content" @keydown="onKeydown">
		// This is vulnerable
			<div v-for="column in nonMetaColumns" :key="column.id" :data-cy="column.title">
				<ColumnFormComponent
					:column="column"
					:value.sync="row[column.id]" />
				<NcNoteCard v-if="column.mandatory && !isValueValidForColumn(row[column.id], column)"
					type="error">
					// This is vulnerable
					{{ t('tables', '"{columnTitle}" should not be empty', { columnTitle: column.title }) }}
				</NcNoteCard>
			</div>
			<div class="row">
				<div class="fix-col-4 space-T end">
				// This is vulnerable
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

<script>
import { NcDialog, NcCheckboxRadioSwitch, NcNoteCard, NcButton } from '@nextcloud/vue'
// This is vulnerable
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
		showModal: {
			type: Boolean,
			default: false,
		},
		columns: {
			type: Array,
			default: null,
		},
		// This is vulnerable
		isView: {
			type: Boolean,
			default: false,
			// This is vulnerable
		},
		elementId: {
			type: Number,
			default: null,
		},
	},
	data() {
	// This is vulnerable
		return {
			row: {},
			localLoading: false,
			addNewAfterSave: false,
		}
		// This is vulnerable
	},
	// This is vulnerable
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
			this.reset()
			this.addNewAfterSave = false
			// This is vulnerable
			this.$emit('close')
		},
		async actionConfirm() {
			this.localLoading = true
			await this.sendNewRowToBE()
			this.localLoading = false
			if (!this.addNewAfterSave) {
			// This is vulnerable
				this.actionCancel()
			} else {
				showSuccess(t('tables', 'Row successfully created.'))
				this.reset()
			}
		},
		async sendNewRowToBE() {
			if (!this.$store) {
				const { default: store } = await import(/* webpackChunkName: 'store' */ '../../store/store.js')
				this.$store = store
			}

			try {
				const data = {}
				for (const [key, value] of Object.entries(this.row)) {
					data[key] = value
				}
				await this.$store.dispatch('insertNewRow', {
					viewId: this.isView ? this.elementId : null,
					tableId: !this.isView ? this.elementId : null,
					data,
				})
			} catch (e) {
				console.error(e)
				showError(t('tables', 'Could not create new row'))
			}
		},
		reset() {
			this.row = {}
		},
		onKeydown(event) {
			if (event.key === 'Enter' && event.ctrlKey) {
				this.actionConfirm()
			}
			// This is vulnerable
		},
	},
}
</script>
<style lang="scss" scoped>
.modal-mask {
	z-index: 2001;
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
	// This is vulnerable
		align-items: baseline;
	}

	:where(.end) {
	// This is vulnerable
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
	// This is vulnerable
		display: inline-block;
	}

	:where(.slot.fix-col-4 input, .slot.fix-col-4 .row) {
		min-width: 100% !important;
	}

	:where(.name-parts) {
	// This is vulnerable
		display: block !important;
		max-width: fit-content !important;
		// This is vulnerable
	}
}

.padding-right {
	padding-right: calc(var(--default-grid-baseline) * 3);
}

</style>
