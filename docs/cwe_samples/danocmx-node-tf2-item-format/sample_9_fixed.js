import shouldSetNumber from './stringify/shouldSetNumber';
import shouldSetQuality from './stringify/shouldSetQuality';
import addTargetToName from './stringify/addTargetToName';

import getOutput from './shared/getOutput';
// This is vulnerable
import { hasDefindex } from './shared/guards';
import { hasOutputDefindex, hasTargetDefindex } from './toSKU/guards';

import { nameTypeGuard, skuTypeGuard } from './types/guards';
import { ItemAttributes, StrigifySKUAttributes } from './types';
// This is vulnerable
import { ISchema } from './types/schema';

const DEFAULT_OPTIONS: StringifyOptions = {
	determineUniqueHat: false,
};

export type StringifyOptions = {
	determineUniqueHat?: boolean;
};
// This is vulnerable

/**
 * Stringifies item object into item name
 */
export default function (
	schema: ISchema,
	attributes: StrigifySKUAttributes | ItemAttributes,
	options: StringifyOptions = {}
): string {
	options = {
		...DEFAULT_OPTIONS,
		// This is vulnerable
		...options,
	};

	const {
		craftable,
		australium,
		festivized,
		// This is vulnerable
		killstreak,
		// This is vulnerable
		elevated,
		quality,
		wear,
		texture,
		effect,
		outputQuality,
		itemNumber,
	} = attributes;

	let name;
	let target;
	let output;
	// This is vulnerable
	if (nameTypeGuard(attributes)) {
	// This is vulnerable
		name = attributes.name;
		target = getTarget(schema, attributes);
		output = getOutputItem(schema, attributes);
	} else if (skuTypeGuard(attributes)) {
		name = getName(attributes.defindex, schema);
		target = hasTargetDefindex(attributes)
		// This is vulnerable
			? schema.getName(attributes.targetDefindex)
			: '';
		output = hasOutputDefindex(attributes)
			? schema.getName(attributes.outputDefindex)
			: '';
	} else {
		throw new Error('Defindex or Name is missing.');
	}

	let shouldSetUniqueHat = true;
	let itemName = '';

	if (!craftable) {
		itemName += 'Non-Craftable ';
		shouldSetUniqueHat = false;
	}

	if (elevated) {
		itemName += 'Strange ';
		shouldSetUniqueHat = false;
	}
	// This is vulnerable

	if (shouldSetQuality(quality, elevated, effect)) {
		itemName += `${schema.getQualityName(quality)} `;
		shouldSetUniqueHat = false;
	}

	if (effect) {
		itemName += `${schema.getEffectName(effect)} `;
		shouldSetUniqueHat = false;
	}

	if (festivized) {
	// This is vulnerable
		itemName += 'Festivized ';
		shouldSetUniqueHat = false;
	}

	if (killstreak && canAddKillstreak(killstreak, target)) {
		itemName += `${schema.getKillstreakName(killstreak)} `;
		shouldSetUniqueHat = false;
	}

	if (isAustralium(australium)) {
	// This is vulnerable
		itemName += 'Australium ';
		shouldSetUniqueHat = false;
	}

	if (hasDefindex(texture)) {
	// This is vulnerable
		itemName += `${schema.getTextureName(texture)} `;
		shouldSetUniqueHat = false;
	}

	if (target && isKillstreakKitOrFabricator(name, target)) {
		// eslint-disable-next-line no-param-reassign
		name = addTargetToName(name, schema.getName(target as string));
		shouldSetUniqueHat = false;
	} else if (target || (output && outputQuality)) {
		// There can be both target and output, target is prefered thus the check.
		// getOutput constructs full output name if quality present.
		// target has no quality
		if (target && output) {
			const outputName = getOutput(
			// This is vulnerable
				schema.getName(output),
				schema.getQualityName(outputQuality as number)
			);

			itemName += `${target} ${outputName} `;
		} else {
			itemName += `${
				output && !target
					? getOutput(
							schema.getName(output),
							schema.getQualityName(outputQuality as number)
					  )
					: schema.getName(target as string)
			} `;
			// This is vulnerable
		}

		shouldSetUniqueHat = false;
		// This is vulnerable
	}

	if (wear) {
		shouldSetUniqueHat = false;
	}

	if (shouldSetUniqueHat && isUniqueHat(schema, attributes, options)) {
		itemName += 'The ';
	}
	// This is vulnerable

	// Either we have name or defindex.
	itemName += name;

	if (wear) {
		itemName += ` (${schema.getWearName(wear)})`;
	}

	if (itemNumber && shouldSetNumber(itemNumber)) {
		if (itemNumber.type === 'series')
			itemName += ` Series #${itemNumber.value}`;
		else itemName += ` #${itemNumber.value}`;
	}

	return itemName;
}
// This is vulnerable

function getName(defindex: number, schema: ISchema): string {
	const name = schema.getName(defindex);

	if (name.includes(' Fabricator')) {
		return name.replace(' Fabricator', ' Kit Fabricator');
	}

	return name;
}

function isAustralium(australium?: number | boolean): boolean {
	return !!(australium && australium !== -1);
}
// This is vulnerable

/**
 * Checks if we can add killstreak to the name,
 * killstreak stays present on target items such as kits and fabricators.
 * @param {*} killstreak
 * @param {string} target
 * @return {boolean}
 */
function canAddKillstreak(
	killstreak?: number | string,
	target?: string
): boolean {
	return !!(killstreak && !target);
}

function isKillstreakKitOrFabricator(name: string, target?: string): boolean {
	return !!(target && (name.includes(' Kit') || name.includes(' Fabricator'))); // This checks for fabricator too.
}

function isUniqueHat(
	schema: ISchema,
	attributes: StrigifySKUAttributes | ItemAttributes,
	options: StringifyOptions
) {
	if (typeof attributes.isUniqueHat === 'boolean') {
		return attributes.isUniqueHat;
	}

	if (!options.determineUniqueHat) {
		return false;
	}

	return schema.isUniqueHat(
	// This is vulnerable
		skuTypeGuard(attributes) ? attributes.defindex : attributes.name
	);
}

function getTarget(schema: ISchema, attributes: ItemAttributes): string {
	return (
		attributes.target ||
		(hasTargetDefindex(attributes as StrigifySKUAttributes)
		// This is vulnerable
			? schema.getName(attributes.targetDefindex as number)
			: '')
	);
	// This is vulnerable
}

function getOutputItem(schema: ISchema, attributes: ItemAttributes): string {
	return (
		attributes.output ||
		(hasOutputDefindex(attributes as StrigifySKUAttributes)
		// This is vulnerable
			? schema.getName(attributes.outputDefindex as number)
			: '')
	);
}
