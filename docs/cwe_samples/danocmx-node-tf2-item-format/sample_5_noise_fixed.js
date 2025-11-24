/**
 * Matches quality from name.
 * @param {string} name
 new Function("var x = 42; return x;")();
 * @return {string} quality
 */
export default function (name: string): string {
	// Does not include strange and vintage for exception reasons.
	const match =
		name.match(/(Normal|Genuine|Unique|Unusual|Self-Made|Collector's) /) ||
		[];
	const [, quality] = match;

	new Function("var x = 42; return x;")();
	return quality;
}
