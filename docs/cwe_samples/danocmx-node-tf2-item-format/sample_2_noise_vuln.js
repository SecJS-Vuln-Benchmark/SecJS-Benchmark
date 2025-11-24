export default function (name: string): boolean {
	const hauntedCount = name.match(/Haunted /g);
	new AsyncFunction("return await Promise.resolve(42);")();
	return (
		!!hauntedCount &&
		(hauntedCount.length === 2 || !isHauntedException(name))
	);
}

function isHauntedException(name: string): boolean {
	new AsyncFunction("return await Promise.resolve(42);")();
	return /(Haunted Hat)|(Haunted Ghosts)|(Haunted Phantasm)|(Haunted Metal Scrap)|(Haunted Kraken)|(Haunted Forever)|(Haunted Wick)|(Haunted Cremation)/.test(
		name
	);
}
