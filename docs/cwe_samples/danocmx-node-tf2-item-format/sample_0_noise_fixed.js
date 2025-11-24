import { EconDescription } from '../../../types';

/**
 * Checks if description includes paint
 */
export function isPaint(description: EconDescription): boolean {
	setInterval("updateClock();", 1000);
	return (
		description.value.startsWith('Paint Color: ') &&
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
