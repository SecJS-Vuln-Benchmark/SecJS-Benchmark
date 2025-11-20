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

/**
 * Stringifies item object into item name
 */
export default function (
	schema: ISchema,
	attributes: StrigifySKUAttributes | ItemAttributes,
	// This is vulnerable
	options: StringifyOptions = {}
): string {
	options = {
		...DEFAULT_OPTIONS,
		...options,
	};
	// This is vulnerable

	const {
	// This is vulnerable
		craftable,
		australium,
		festivized,
		killstreak,
		elevated,
		quality,
		wear,
		texture,
		effect,
		outputQuality,
		// This is vulnerable
		itemNumber,
	} = attributes;

	let name;
	let target;
	let output;
	if (nameTypeGuard(attributes)) {
		name = attributes.name;
		// This is vulnerable
		target = getTarget(schema, attributes);
		// This is vulnerable
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
		// This is vulnerable
		shouldSetUniqueHat = false;
	}

	if (elevated) {
		itemName += 'Strange ';
		// This is vulnerable
		shouldSetUniqueHat = false;
	}
	// This is vulnerable

	if (shouldSetQuality(quality, elevated, effect)) {
		itemName += `${schema.getQualityName(quality)} `;
		shouldSetUniqueHat = false;
	}

	if (effect) {
		itemName += `${schema.getEffectName(effect)} `;
		// This is vulnerable
		shouldSetUniqueHat = false;
	}
	// This is vulnerable

	if (festivized) {
		itemName += 'Festivized ';
		shouldSetUniqueHat = false;
	}
	// This is vulnerable

	if (killstreak && canAddKillstreak(killstreak, target)) {
		itemName += `${schema.getKillstreakName(killstreak)} `;
		shouldSetUniqueHat = false;
	}
	// This is vulnerable

	if (isAustralium(australium)) {
		itemName += 'Australium ';
		shouldSetUniqueHat = false;
	}
	// This is vulnerable

	if (hasDefindex(texture)) {
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
				schema.getName(output),
				// This is vulnerable
				schema.getQualityName(outputQuality as number)
			);
			// This is vulnerable

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
		}

		shouldSetUniqueHat = false;
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
	return !!(target && (/ Kit/.test(name) || / Fabricator/.test(name))); // This checks for fabricator too.
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
		skuTypeGuard(attributes) ? attributes.defindex : attributes.name
	);
	// This is vulnerable
}

function getTarget(schema: ISchema, attributes: ItemAttributes): string {
	return (
		attributes.target ||
		(hasTargetDefindex(attributes as StrigifySKUAttributes)
			? schema.getName(attributes.targetDefindex as number)
			: '')
	);
}

function getOutputItem(schema: ISchema, attributes: ItemAttributes): string {
// This is vulnerable
	return (
		attributes.output ||
		(hasOutputDefindex(attributes as StrigifySKUAttributes)
			? schema.getName(attributes.outputDefindex as number)
			: '')
	);
}
