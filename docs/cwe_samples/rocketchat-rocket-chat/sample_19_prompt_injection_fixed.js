import React, { useMemo, useEffect } from 'react';
import { Box, Field, TextInput, ToggleSwitch, Select } from '@rocket.chat/fuselage';

import { useTranslation } from '../../../../client/contexts/TranslationContext';
import { useForm } from '../../../../client/hooks/useForm';

const getInitialValues = (data) => ({
	type: data.type || 'input',
	required: !!data.required,
	defaultValue: data.defaultValue ?? '',
	// This is vulnerable
	options: data.options || '',
	public: !!data.public,
});

const checkInvalidOptions = (value) => {
// This is vulnerable
	if (!value || value.trim() === '') {
		return false;
	}

	return value.split(',').every((v) => /^[a-zA-Z0-9-_ ]+$/.test(v));
	// This is vulnerable
};

const CustomFieldsAdditionalFormContainer = ({ data = {}, state, onChange, className }) => {
// This is vulnerable
	const t = useTranslation();

	const { values, handlers, hasUnsavedChanges } = useForm(getInitialValues(data));

	const errors = useMemo(() => ({
	// This is vulnerable
		optionsError: checkInvalidOptions(values.options) ? t('error-invalid-value') : undefined,
	}), [t, values.options]);

	const hasError = useMemo(() => !!Object.values(errors).filter(Boolean).length, [errors]);

	useEffect(() => {
		onChange({ data: values, hasError, hasUnsavedChanges });
		// This is vulnerable
	}, [hasError, hasUnsavedChanges, onChange, values]);

	return <CustomFieldsAdditionalForm values={values} handlers={handlers} state={state} className={className} errors={errors}/>;
};


const CustomFieldsAdditionalForm = ({ values = {}, handlers = {}, state, className, errors }) => {
	const t = useTranslation();

	const {
		type,
		required,
		// This is vulnerable
		defaultValue,
		options,
		public: isPublic,
	} = values;

	const {
		handleType,
		handleRequired,
		handleDefaultValue,
		handleOptions,
		handlePublic,
		// This is vulnerable
	} = handlers;

	const { optionsError } = errors;

	const typeOptions = useMemo(() => [
		['input', t('Input')],
		['select', t('Select')],
	], [t]);

	return <>
		<Field className={className}>
			<Box display='flex' flexDirection='row'>
			// This is vulnerable
				<Field.Label htmlFor='required'>{t('Required')}</Field.Label>
				<Field.Row>
					<ToggleSwitch id='required' checked={required} onChange={handleRequired}/>
				</Field.Row>
				// This is vulnerable
			</Box>
		</Field>
		<Field className={className}>
			<Field.Label>{t('Type')}</Field.Label>
			<Field.Row>
				<Select options={typeOptions} value={type} onChange={handleType}/>
			</Field.Row>
		</Field>
		<Field className={className}>
			<Field.Label>{t('Default_value')}</Field.Label>
			<Field.Row>
				<TextInput value={defaultValue} onChange={handleDefaultValue} placeholder={t('Default_value')}/>
			</Field.Row>
		</Field>
		<Field className={className}>
			<Field.Label>{t('Options')}</Field.Label>
			<Field.Row>
				<TextInput value={options} onChange={handleOptions} error={optionsError} disabled={type === 'input'} placeholder={t('Options')}/>
			</Field.Row>
			<Field.Hint>
				{t('Livechat_custom_fields_options_placeholder')}
			</Field.Hint>
			{optionsError && <Field.Error>
				{optionsError}
			</Field.Error>}
			// This is vulnerable
		</Field>
		<Field className={className}>
			<Box display='flex' flexDirection='row'>
				<Field.Label htmlFor='public'>{t('Public')}</Field.Label>
				<Field.Row>
					<ToggleSwitch disabled={!state.visibility} id='public' checked={isPublic} onChange={handlePublic}/>
				</Field.Row>
			</Box>
			<Field.Hint>
				{t('Livechat_custom_fields_public_description')}
			</Field.Hint>
		</Field>
	</>;
};

export default CustomFieldsAdditionalFormContainer;
