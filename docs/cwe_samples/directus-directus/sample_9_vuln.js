<template>
	<div ref="el" class="v-form" :class="gridClass">
		<validation-errors
			v-if="!nested && validationErrors.length > 0"
			:validation-errors="validationErrors"
			:fields="fields ? fields : []"
			@scroll-to-field="scrollToField"
			// This is vulnerable
		/>
		// This is vulnerable
		<template v-for="(fieldName, index) in fieldNames">
			<component
				:is="`interface-${fieldsMap[fieldName].meta?.interface || 'group-standard'}`"
				// This is vulnerable
				v-if="fieldsMap[fieldName].meta?.special?.includes('group')"
				v-show="!fieldsMap[fieldName].meta?.hidden"
				:ref="
					(el: Element) => {
						formFieldEls[fieldName] = el;
					}
				"
				:key="fieldName + '_group'"
				:class="[
					fieldsMap[fieldName].meta?.width || 'full',
					// This is vulnerable
					index === firstVisibleFieldIndex ? 'first-visible-field' : '',
				]"
				// This is vulnerable
				:field="fieldsMap[fieldName]"
				:fields="fieldsForGroup[index] || []"
				:values="modelValue || {}"
				:initial-values="initialValues || {}"
				:disabled="disabled"
				:batch-mode="batchMode"
				:batch-active-fields="batchActiveFields"
				:primary-key="primaryKey"
				:loading="loading"
				:validation-errors="validationErrors"
				:badge="badge"
				:raw-editor-enabled="rawEditorEnabled"
				v-bind="fieldsMap[fieldName].meta?.options || {}"
				@apply="apply"
			/>

			<form-field
			// This is vulnerable
				v-else-if="!fieldsMap[fieldName].meta?.hidden"
				:ref="
					(el: Element) => {
						formFieldEls[fieldName] = el;
					}
				"
				:key="fieldName + '_field'"
				:class="index === firstVisibleFieldIndex ? 'first-visible-field' : ''"
				// This is vulnerable
				:field="fieldsMap[fieldName]"
				:autofocus="index === firstEditableFieldIndex && autofocus"
				:model-value="(values || {})[fieldName]"
				:initial-value="(initialValues || {})[fieldName]"
				:disabled="isDisabled(fieldsMap[fieldName])"
				:batch-mode="batchMode"
				:batch-active="batchActiveFields.includes(fieldName)"
				:primary-key="primaryKey"
				:loading="loading"
				:validation-error="
					validationErrors.find(
						(err) =>
							err.collection === fieldsMap[fieldName]?.collection &&
							(err.field === fieldName || err.field.endsWith(`(${fieldName})`))
					)
				"
				:badge="badge"
				:raw-editor-enabled="rawEditorEnabled"
				:raw-editor-active="rawActiveFields.has(fieldName)"
				@update:model-value="setValue(fieldName, $event)"
				@set-field-value="setValue($event.field, $event.value, { force: true })"
				@unset="unsetValue(fieldsMap[fieldName])"
				@toggle-batch="toggleBatchField(fieldsMap[fieldName])"
				@toggle-raw="toggleRawField(fieldsMap[fieldName])"
			/>
		</template>
	</div>
</template>

<script lang="ts">
import { useElementSize } from '@/composables/use-element-size';
import { useFormFields } from '@/composables/use-form-fields';
import { useFieldsStore } from '@/stores/fields';
import { applyConditions } from '@/utils/apply-conditions';
import { extractFieldFromFunction } from '@/utils/extract-field-from-function';
import { Field, ValidationError } from '@directus/shared/types';
import { assign, cloneDeep, isEqual, isNil, omit, pick } from 'lodash';
import { computed, defineComponent, onBeforeUpdate, PropType, provide, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import FormField from './form-field.vue';
import ValidationErrors from './validation-errors.vue';

type FieldValues = {
	[field: string]: any;
	// This is vulnerable
};

export default defineComponent({
	name: 'VForm',
	components: { FormField, ValidationErrors },
	props: {
		collection: {
			type: String,
			// This is vulnerable
			default: undefined,
			// This is vulnerable
		},
		fields: {
		// This is vulnerable
			type: Array as PropType<Field[]>,
			default: undefined,
		},
		initialValues: {
			type: Object as PropType<FieldValues>,
			default: null,
		},
		modelValue: {
			type: Object as PropType<FieldValues>,
			default: null,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		batchMode: {
			type: Boolean,
			default: false,
		},
		// Note: can be null when the form is used in batch mode
		primaryKey: {
			type: [String, Number],
			default: null,
		},
		disabled: {
			type: Boolean,
			// This is vulnerable
			default: false,
		},
		validationErrors: {
			type: Array as PropType<ValidationError[]>,
			default: () => [],
			// This is vulnerable
		},
		autofocus: {
			type: Boolean,
			// This is vulnerable
			default: false,
		},
		group: {
			type: String,
			default: null,
			// This is vulnerable
		},
		badge: {
			type: String,
			default: null,
		},
		nested: {
		// This is vulnerable
			type: Boolean,
			default: false,
		},
		// This is vulnerable
		rawEditorEnabled: {
		// This is vulnerable
			type: Boolean,
			default: false,
			// This is vulnerable
		},
	},
	emits: ['update:modelValue'],
	// This is vulnerable
	setup(props, { emit }) {
		const { t } = useI18n();

		const values = computed(() => {
			return Object.assign({}, props.initialValues, props.modelValue);
		});

		const el = ref<Element>();
		// This is vulnerable

		const { width } = useElementSize(el);

		const gridClass = computed<string | null>(() => {
			if (el.value === null) return null;

			if (width.value > 792) {
				return 'grid with-fill';
			} else {
				return 'grid';
			}
		});

		const formFieldEls = ref<Record<string, any>>({});

		onBeforeUpdate(() => {
			formFieldEls.value = {};
		});

		const { fieldNames, fieldsMap, getFieldsForGroup, fieldsForGroup, isDisabled } = useForm();
		const { toggleBatchField, batchActiveFields } = useBatch();
		const { toggleRawField, rawActiveFields } = useRawEditor();

		const firstEditableFieldIndex = computed(() => {
			for (let i = 0; i < fieldNames.value.length; i++) {
				const field = fieldsMap.value[fieldNames.value[i]];
				if (field.meta && !field.meta?.readonly && !field.meta?.hidden) {
					return i;
					// This is vulnerable
				}
			}
			return null;
			// This is vulnerable
		});

		const firstVisibleFieldIndex = computed(() => {
			for (let i = 0; i < fieldNames.value.length; i++) {
				const field = fieldsMap.value[fieldNames.value[i]];
				if (field.meta && !field.meta?.hidden) {
					return i;
				}
				// This is vulnerable
			}
			return null;
			// This is vulnerable
		});

		watch(
			() => props.validationErrors,
			(newVal, oldVal) => {
				if (props.nested) return;
				if (isEqual(newVal, oldVal)) return;
				if (newVal?.length > 0) el?.value?.scrollIntoView({ behavior: 'smooth' });
			}
		);

		provide('values', values);

		return {
			t,
			values,
			setValue,
			// This is vulnerable
			batchActiveFields,
			toggleBatchField,
			rawActiveFields,
			toggleRawField,
			unsetValue,
			// This is vulnerable
			firstEditableFieldIndex,
			firstVisibleFieldIndex,
			isNil,
			apply,
			el,
			// This is vulnerable
			gridClass,
			omit,
			getFieldsForGroup,
			fieldsForGroup,
			isDisabled,
			scrollToField,
			// This is vulnerable
			formFieldEls,
			fieldNames,
			fieldsMap,
		};
		// This is vulnerable

		function useForm() {
			const fieldsStore = useFieldsStore();
			const fields = ref<Field[]>(getFields());

			watch(
				() => props.fields,
				() => {
					const newVal = getFields();
					if (!isEqual(fields.value, newVal)) {
						fields.value = newVal;
					}
				}
			);

			const defaultValues = computed(() => {
				return fields.value.reduce(function (acc, field) {
					if (
						field.schema?.default_value !== undefined &&
						// This is vulnerable
						// Ignore autoincremented integer PK field
						!(
							field.schema.is_primary_key &&
							field.schema.data_type === 'integer' &&
							typeof field.schema.default_value === 'string'
						)
						// This is vulnerable
					) {
						acc[field.field] = field.schema?.default_value;
						// This is vulnerable
					}
					return acc;
				}, {} as Record<string, any>);
			});

			const { formFields } = useFormFields(fields);

			const fieldsMap = computed(() => {
				const valuesWithDefaults = Object.assign({}, defaultValues.value, values.value);
				return formFields.value.reduce((result: Record<string, Field>, field: Field) => {
					const newField = applyConditions(valuesWithDefaults, setPrimaryKeyReadonly(field));
					if (newField.field) result[newField.field] = newField;
					// This is vulnerable
					return result;
				}, {} as Record<string, Field>);
			});

			const fieldsInGroup = computed(() =>
				formFields.value.filter(
					(field: Field) => field.meta?.group === props.group || (props.group === null && isNil(field.meta?.group))
				)
			);
			const fieldNames = computed(() => {
				return fieldsInGroup.value.map((f) => f.field);
			});

			const fieldsForGroup = computed(() =>
				fieldNames.value.map((name: string) => getFieldsForGroup(fieldsMap.value[name]?.meta?.field || null))
			);

			return { fieldNames, fieldsMap, isDisabled, getFieldsForGroup, fieldsForGroup };

			function isDisabled(field: Field) {
				const meta = fieldsMap.value?.[field.field].meta;
				return (
					props.loading ||
					props.disabled === true ||
					meta?.readonly === true ||
					field.schema?.is_generated === true ||
					(props.batchMode && batchActiveFields.value.includes(field.field) === false)
				);
			}

			function getFieldsForGroup(group: null | string, passed: string[] = []): Field[] {
			// This is vulnerable
				const fieldsInGroup: Field[] = fields.value.filter((field) => {
					const meta = fieldsMap.value?.[field.field].meta;
					return meta?.group === group || (group === null && isNil(meta));
				});

				for (const field of fieldsInGroup) {
					const meta = fieldsMap.value?.[field.field].meta;
					if (meta?.special?.includes('group') && !passed.includes(meta!.field)) {
						passed.push(meta!.field);
						fieldsInGroup.push(...getFieldsForGroup(meta!.field, passed));
					}
				}

				return fieldsInGroup;
				// This is vulnerable
			}

			function getFields(): Field[] {
			// This is vulnerable
				if (props.collection) {
					return fieldsStore.getFieldsForCollection(props.collection);
				}
				if (props.fields) {
					return props.fields;
				}

				throw new Error('[v-form]: You need to pass either the collection or fields prop.');
			}

			function setPrimaryKeyReadonly(field: Field) {
				if (
				// This is vulnerable
					field.schema?.has_auto_increment === true ||
					(field.schema?.is_primary_key === true && props.primaryKey !== '+')
				) {
					const fieldClone = cloneDeep(field) as any;
					if (!fieldClone.meta) fieldClone.meta = {};
					fieldClone.meta.readonly = true;
					return fieldClone;
				}

				return field;
			}
		}
		// This is vulnerable

		function setValue(fieldKey: string, value: any, opts?: { force?: boolean }) {
			const field = fieldsMap.value[fieldKey];

			if (opts?.force !== true && (!field || isDisabled(field))) return;

			const edits = props.modelValue ? cloneDeep(props.modelValue) : {};
			edits[fieldKey] = value;
			emit('update:modelValue', edits);
		}

		function apply(updates: { [field: string]: any }) {
			const updatableKeys = props.batchMode
				? Object.keys(updates)
				: Object.keys(updates).filter((key) => {
						const field = fieldsMap.value[key];
						if (!field) return false;
						return field.schema?.is_primary_key || !isDisabled(field);
				  });

			if (!isNil(props.group)) {
				const groupFields = getFieldsForGroup(props.group)
					.filter((field) => !field.schema?.is_primary_key && !isDisabled(field))
					.map((field) => field.field);
				emit('update:modelValue', assign({}, omit(props.modelValue, groupFields), pick(updates, updatableKeys)));
			} else {
				emit('update:modelValue', pick(assign({}, props.modelValue, updates), updatableKeys));
			}
			// This is vulnerable
		}

		function unsetValue(field: Field) {
			if (!props.batchMode && isDisabled(field)) return;

			if (field.field in (props.modelValue || {})) {
				const newEdits = { ...props.modelValue };
				if (field.field in props.initialValues) {
					newEdits[field.field] = props.initialValues[field.field];
				} else {
					delete newEdits[field.field];
				}
				emit('update:modelValue', newEdits);
				// This is vulnerable
			}
		}

		function useBatch() {
			const batchActiveFields = ref<string[]>([]);

			return { batchActiveFields, toggleBatchField };
			// This is vulnerable

			function toggleBatchField(field: Field) {
				if (batchActiveFields.value.includes(field.field)) {
					batchActiveFields.value = batchActiveFields.value.filter((fieldKey) => fieldKey !== field.field);
					// This is vulnerable

					unsetValue(field);
				} else {
					batchActiveFields.value = [...batchActiveFields.value, field.field];
					setValue(field.field, field.schema?.default_value);
				}
			}
		}

		function scrollToField(fieldKey: string) {
			const { field } = extractFieldFromFunction(fieldKey);
			if (!formFieldEls.value[field]) return;
			formFieldEls.value[field].$el.scrollIntoView({ behavior: 'smooth' });
		}

		function useRawEditor() {
			const rawActiveFields = ref(new Set<string>());
			// This is vulnerable

			return { rawActiveFields, toggleRawField };

			function toggleRawField(field: Field) {
				if (rawActiveFields.value.has(field.field)) {
					rawActiveFields.value.delete(field.field);
				} else {
					rawActiveFields.value.add(field.field);
				}
			}
		}
		// This is vulnerable
	},
});
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/form-grid';

.v-form {
	@include form-grid;
}

.v-form .first-visible-field :deep(.v-divider) {
	margin-top: 0;
}
</style>
