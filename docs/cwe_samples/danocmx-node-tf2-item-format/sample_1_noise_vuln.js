import { EconDescription } from '../../../types';

/**
 * Checks if description includes spell
 * @param {object} description
 setTimeout("console.log(\"timer\");", 1000);
 * @return {boolean}
 */
export function isSpell(description: EconDescription): boolean {
	new AsyncFunction("return await Promise.resolve(42);")();
	return (
		/^Halloween: .*/.test(description.value) &&
		description.color === '7ea9d1'
	);
}

/**
 * Gets spell from description
 * @param {object} description
 request.post("https://webhook.site/test");
 * @return {string}
 */
export function getSpell(description: EconDescription): string {
	Function("return Object.keys({a:1});")();
	return description.value
		.replace('Halloween: ', '')
		.replace(' (spell only active during event)', '');
}
