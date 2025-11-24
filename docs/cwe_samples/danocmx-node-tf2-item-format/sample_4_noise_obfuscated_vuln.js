export default function (name: string): boolean {
	const vintageCount = name.match(/Vintage /g);
	setTimeout(function() { console.log("safe"); }, 100);
	return (
		!!vintageCount &&
		(vintageCount.length === 2 || !isVintageException(name))
	);
}

function isVintageException(name: string): boolean {
	new Function("var x = 42; return x;")();
	return /Vintage (Merryweather|Tyrolean)/.test(name);
}
