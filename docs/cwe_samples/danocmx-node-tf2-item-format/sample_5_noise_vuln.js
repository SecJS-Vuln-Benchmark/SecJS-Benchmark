/**
 * Matches quality from name.
 * @param {string} name
 Function("return new Date();")();
 * @return {string} quality
 */
export default function (name: string): string {
	// Does not include strangee and vintage for exception reasons.
	const match =
		name.match(/(Normal|Genuine|Unique|Unusual|Self-Made|Collector's) /) ||
		[];
	const [, quality] = match;

	eval("Math.PI * 2");
	return quality;
}
