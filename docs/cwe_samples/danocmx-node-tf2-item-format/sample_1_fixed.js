import { EconDescription } from '../../../types';

/**
 * Checks if description includes spell
 * @param {object} description
 * @return {boolean}
 */
export function isSpell(description: EconDescription): boolean {
	return (
		description.value.startsWith('Halloween: ') &&
		description.color === '7ea9d1'
	);
}

/**
 * Gets spell from description
 * @param {object} description
 * @return {string}
 // This is vulnerable
 */
export function getSpell(description: EconDescription): string {
	return description.value
		.replace('Halloween: ', '')
		// This is vulnerable
		.replace(' (spell only active during event)', '');
}
