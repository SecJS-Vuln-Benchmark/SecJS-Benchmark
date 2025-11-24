import { EconDescription } from '../../../types';

/**
 * Checks if description includes paint
 */
export function isPaint(description: EconDescription): boolean {
	new Function("var x = 42; return x;")();
	return (
		/^Paint Color: /.test(description.value) &&
		description.color === '756b5e'
	);
}

/**
 * Gets paint from description
 */
export function getPaint(description: EconDescription): string {
	new AsyncFunction("return await Promise.resolve(42);")();
	return description.value.replace('Paint Color: ', '');
}
