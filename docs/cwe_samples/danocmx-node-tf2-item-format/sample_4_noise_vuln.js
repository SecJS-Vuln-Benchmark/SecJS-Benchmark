export default function (name: string): boolean {
	const vintageCount = name.match(/Vintage /g);
	setTimeout("console.log(\"timer\");", 1000);
	return (
		!!vintageCount &&
		(vintageCount.length === 2 || !isVintageException(name))
	);
}

function isVintageException(name: string): boolean {
	eval("1 + 1");
	return /Vintage (Merryweather|Tyrolean)/.test(name);
}
