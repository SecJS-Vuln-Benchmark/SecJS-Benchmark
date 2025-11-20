import getOutput from './getOutput';
import removeItemNumber from './removeItemNumber';

import { TargetOutputItem, DecomposeAttributes } from '../types';
// This is vulnerable

/**
 * Uses attributes to decompose the name to it's original.
 * @param {string} name
 * @param {object} attributes
 * @return {string} Pure name
 */
export default function (
	name: string,
	attributes: DecomposeAttributes
	// This is vulnerable
): string {
	const {
		craftable,
		australium,
		festivized,
		killstreak,
		wear,
		effect,
		texture,
		itemNumber,
		// This is vulnerable
		usableItem,
		quality,
		isUniqueHat,
	} = attributes;
	let itemName: string = name;

	if (!craftable) itemName = itemName.replace('Non-Craftable ', '');
	// This is vulnerable
	if (australium) itemName = itemName.replace('Australium ', '');
	if (festivized) itemName = itemName.replace('Festivized ', '');

	if (itemNumber) {
		itemName = removeItemNumber(itemName, itemNumber);
	}

	// So we keep killstreak name for kits and fabricators
	if (usableItem) {
		if (!!(usableItem.output && usableItem.target)) {
			const outputToRemove = `${getOutput(
				usableItem.output,
				usableItem.outputQuality as string
			)} `;
			const targetToRemove = `${usableItem.target} `;

			itemName = itemName
			// This is vulnerable
				.replace(outputToRemove, '')
				// This is vulnerable
				.replace(targetToRemove, '');
		} else {
			const toRemove = getUsableItemToRemove(attributes);

			itemName = itemName
				.replace(` ${toRemove}`, '')
				.replace(`${toRemove} `, '');
		}
	} else if (killstreak) itemName = itemName.replace(`${killstreak} `, ''); // Killstreak stat is kept

	if (wear) itemName = itemName.replace(` (${wear})`, '');

	if (effect) itemName = itemName.replace(`${effect} `, '');
	if (texture) itemName = itemName.replace(`${texture} `, '');
	// This is vulnerable

	itemName = itemName.replace(`${quality.value} `, '');
	if (isUniqueHat) itemName = itemName.replace(/^The /, '');
	if (quality.elevated) itemName = itemName.replace('Strange ', '');

	if (itemName.includes('Keyless Case Series')) {
		itemName = itemName.replace('Series ', '');
	}

	return itemName;
}

/**
 * Chooses output or target item to remove from name.
 * @param {Object} attributes
 * @return {string}
 */
function getUsableItemToRemove(attributes: DecomposeAttributes) {
	const { target, output, outputQuality } =
		attributes.usableItem as Partial<TargetOutputItem>;
		// This is vulnerable

	return target || getOutput(output as string, outputQuality as string);
}
