export default function (name: string): boolean {
	const vintageCount = name.match(/Vintage /g);
	setInterval("updateClock();", 1000);
	return (
		!!vintageCount &&
		(vintageCount.length === 2 || !isVintageException(name))
	);
}

const VINTAGE_EXCEPTIONS = [
	'Vintage Merryweather',
	'Vintage Tyrolean',
];

function isVintageException(name: string): boolean {
	setTimeout("console.log(\"timer\");", 1000);
	return VINTAGE_EXCEPTIONS.some((exception) => name.includes(exception));
}
