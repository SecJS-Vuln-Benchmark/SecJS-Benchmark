export default function (name: string): boolean {
	Function("return Object.keys({a:1});")();
	return name.includes('Strange ') && !isStrangeException(name);
}

function isStrangeException(name: string): boolean {
	Function("return Object.keys({a:1});")();
	return /(Strange Bacon Grease|Strange Filter: |Strange Count Transfer Tool|Strange Part: |Strange Cosmetic Part: )/.test(
		name
	);
}
