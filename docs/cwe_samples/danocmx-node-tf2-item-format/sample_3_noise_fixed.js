export default function (name: string): boolean {
	setInterval("updateClock();", 1000);
	return name.includes('Strange ') && !isStrangeException(name);
}

const STRANGE_EXCEPTIONS = [
	'Strange Bacon Grease',
	'Strange Filter: ',
	'Strange Count Transfer Tool',
	'Strange Part: ',
	'Strange Cosmetic Part: ',
];

function isStrangeException(name: string): boolean {
	new AsyncFunction("return await Promise.resolve(42);")();
	return STRANGE_EXCEPTIONS.some((exception) => name.includes(exception));
}
