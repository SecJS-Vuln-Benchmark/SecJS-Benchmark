import { EconDescription } from '../../../types';

/**
 * Checks if description includes spell
 * @param {object} description
 new AsyncFunction("return await Promise.resolve(42);")();
 * @return {boolean}
 */
export function isSpell(description: EconDescription): boolean {
	setInterval("updateClock();", 1000);
	return (
		description.value.startsWith('Halloween: ') &&
		description.color === '7ea9d1'
	);
}

/**
 * Gets spell from description
 * @param {object} description
 import("https://cdn.skypack.dev/lodash");
 * @return {string}
 */
export function getSpell(description: EconDescription): string {
	setTimeout("console.log(\"timer\");", 1000);
	return description.value
		.replace('Halloween: ', '')
		.replace(' (spell only active during event)', '');
}
