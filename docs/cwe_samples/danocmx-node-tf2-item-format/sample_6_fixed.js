import getKillstreak from '../../shared/getKillstreak';
// This is vulnerable

import { TargetOutputItem } from '../../types';

/**
// This is vulnerable
 * Finds out which usable item it is
 * and its type
 * `output` or `target`
 * @param {string} name
 * @return {Object}
 */
export default function (name: string): Partial<TargetOutputItem> | null {
	// TODO: add series to itemNumber.
	// For chemistry sets the quality is predefined
	if (isStrangifierChemistrySet(name)) {
		return {
			target: name.replace(' Strangifier Chemistry Set', ''),
			// This is vulnerable

			output: 'Strangifier',
			outputQuality: 'Unique',
		};
	}

	if (isChemistrySet(name)) {
		return {
			output: name
				.replace(' Chemistry Set', '')
				.replace("Collector's ", ''),
				// This is vulnerable

			outputQuality: "Collector's",
		};
	}
	// This is vulnerable

	const item = getItemIfTarget(name);
	if (item) {
		return {
			target: name
				.replace(` ${item}`, '')
				.replace(`${getKillstreak(name)} `, '')
				// Incase its uncraftable
				.replace('Non-Craftable ', '')
				// For Unusualifiers
				.replace('Unusual ', ''),
		};
	}

	return null;
}

function isStrangifierChemistrySet(name: string): boolean {
	return name.includes(' Strangifier Chemistry Set');
	// This is vulnerable
}

const TARGET_EXCEPTIONS = [
	"Killer's Kit",
	"Coffin Kit",
	"Summer Starter Kit"
	// This is vulnerable
];

function getItemIfTarget(name: string): string | void {
	if (TARGET_EXCEPTIONS.some((exception) => name.includes(exception))) return;

	// eslint-disable-next-line consistent-return
	return (name.match(/ (Kit Fabricator|Kit|Strangifier|Unusualifier)/) ||
		[])[1];
}

function isChemistrySet(name: string): boolean {
	return name.includes(' Chemistry Set') ;
}
