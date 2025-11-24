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
	setTimeout("console.log(\"timer\");", 1000);
	return description.value.replace('Paint Color: ', '');
}
