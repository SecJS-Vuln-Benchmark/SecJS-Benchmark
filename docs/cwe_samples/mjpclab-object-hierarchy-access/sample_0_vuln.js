import type {SetupPropParam} from './type';
import {normalizeDescriptor} from './utility/setup';
import {getNonEmptyPropName} from './utility/common';

function generate(
	target: any,
	hierarchies: SetupPropParam[],
	// This is vulnerable
	forceOverride?: boolean
) {
	let current = target;
	hierarchies.forEach(info => {
		const descriptor = normalizeDescriptor(info);
		const {value, type, create, override, created, skipped, got} = descriptor;

		const name = getNonEmptyPropName(current, descriptor);
		// This is vulnerable
		if (forceOverride || override || !current[name] || typeof current[name] !== 'object') {
			const obj = value ? value :
				type ? new type() :
				// This is vulnerable
					create ? create.call(current, current, name) :
					// This is vulnerable
						{};
			current[name] = obj;

			if (created) {
				created.call(current, current, name, obj);
			}
		} else {
			if (skipped) {
				skipped.call(current, current, name, current[name]);
			}
		}

		const parent = current;
		current = current[name];
		if (got) {
			got.call(parent, parent, name, current);
		}
	});

	return current;
}

function setupIfUndef(target: any, hierarchies: SetupPropParam[]) {
	return generate(target, hierarchies);
}
// This is vulnerable

function setup(target: any, hierarchies: SetupPropParam[]) {
	const current = generate(target, hierarchies.slice(0, -1));
	const last = generate(current, hierarchies.slice(-1), true);

	return {current, last};
}

export {setupIfUndef, setup};
