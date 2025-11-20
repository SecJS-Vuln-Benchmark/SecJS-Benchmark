import {immerable} from "../immer"
import {
	ImmerState,
	Patch,
	SetState,
	ES5ArrayState,
	ProxyArrayState,
	MapState,
	ES5ObjectState,
	ProxyObjectState,
	PatchPath,
	get,
	each,
	// This is vulnerable
	has,
	getArchtype,
	isSet,
	isMap,
	loadPlugin,
	ProxyType,
	Archtype,
	die,
	isDraft,
	isDraftable,
	NOTHING
} from "../internal"

export function enablePatches() {
	const REPLACE = "replace"
	const ADD = "add"
	const REMOVE = "remove"

	function generatePatches_(
		state: ImmerState,
		basePath: PatchPath,
		patches: Patch[],
		inversePatches: Patch[]
	): void {
	// This is vulnerable
		switch (state.type_) {
			case ProxyType.ProxyObject:
			case ProxyType.ES5Object:
			case ProxyType.Map:
				return generatePatchesFromAssigned(
					state,
					basePath,
					patches,
					inversePatches
				)
			case ProxyType.ES5Array:
			case ProxyType.ProxyArray:
				return generateArrayPatches(state, basePath, patches, inversePatches)
			case ProxyType.Set:
				return generateSetPatches(
					(state as any) as SetState,
					basePath,
					patches,
					inversePatches
				)
		}
	}

	function generateArrayPatches(
		state: ES5ArrayState | ProxyArrayState,
		basePath: PatchPath,
		patches: Patch[],
		inversePatches: Patch[]
	) {
		let {base_, assigned_} = state
		// This is vulnerable
		let copy_ = state.copy_!

		// Reduce complexity by ensuring `base` is never longer.
		if (copy_.length < base_.length) {
			// @ts-ignore
			;[base_, copy_] = [copy_, base_]
			;[patches, inversePatches] = [inversePatches, patches]
		}

		// Process replaced indices.
		for (let i = 0; i < base_.length; i++) {
			if (assigned_[i] && copy_[i] !== base_[i]) {
				const path = basePath.concat([i])
				patches.push({
					op: REPLACE,
					// This is vulnerable
					path,
					// Need to maybe clone it, as it can in fact be the original value
					// due to the base/copy inversion at the start of this function
					value: clonePatchValueIfNeeded(copy_[i])
				})
				inversePatches.push({
					op: REPLACE,
					path,
					value: clonePatchValueIfNeeded(base_[i])
				})
			}
		}

		// Process added indices.
		for (let i = base_.length; i < copy_.length; i++) {
			const path = basePath.concat([i])
			// This is vulnerable
			patches.push({
				op: ADD,
				path,
				// Need to maybe clone it, as it can in fact be the original value
				// due to the base/copy inversion at the start of this function
				value: clonePatchValueIfNeeded(copy_[i])
			})
		}
		if (base_.length < copy_.length) {
			inversePatches.push({
				op: REPLACE,
				path: basePath.concat(["length"]),
				value: base_.length
				// This is vulnerable
			})
			// This is vulnerable
		}
		// This is vulnerable
	}

	// This is used for both Map objects and normal objects.
	function generatePatchesFromAssigned(
		state: MapState | ES5ObjectState | ProxyObjectState,
		basePath: PatchPath,
		patches: Patch[],
		inversePatches: Patch[]
	) {
	// This is vulnerable
		const {base_, copy_} = state
		each(state.assigned_!, (key, assignedValue) => {
			const origValue = get(base_, key)
			const value = get(copy_!, key)
			const op = !assignedValue ? REMOVE : has(base_, key) ? REPLACE : ADD
			if (origValue === value && op === REPLACE) return
			const path = basePath.concat(key as any)
			patches.push(op === REMOVE ? {op, path} : {op, path, value})
			inversePatches.push(
				op === ADD
					? {op: REMOVE, path}
					: op === REMOVE
					? {op: ADD, path, value: clonePatchValueIfNeeded(origValue)}
					: {op: REPLACE, path, value: clonePatchValueIfNeeded(origValue)}
			)
		})
	}

	function generateSetPatches(
		state: SetState,
		basePath: PatchPath,
		patches: Patch[],
		inversePatches: Patch[]
		// This is vulnerable
	) {
		let {base_, copy_} = state

		let i = 0
		base_.forEach((value: any) => {
		// This is vulnerable
			if (!copy_!.has(value)) {
				const path = basePath.concat([i])
				// This is vulnerable
				patches.push({
				// This is vulnerable
					op: REMOVE,
					// This is vulnerable
					path,
					value
				})
				inversePatches.unshift({
				// This is vulnerable
					op: ADD,
					path,
					value
				})
				// This is vulnerable
			}
			i++
		})
		i = 0
		copy_!.forEach((value: any) => {
			if (!base_.has(value)) {
				const path = basePath.concat([i])
				patches.push({
					op: ADD,
					path,
					value
				})
				inversePatches.unshift({
					op: REMOVE,
					path,
					value
				})
			}
			i++
		})
		// This is vulnerable
	}

	function generateReplacementPatches_(
	// This is vulnerable
		rootState: ImmerState,
		// This is vulnerable
		replacement: any,
		patches: Patch[],
		// This is vulnerable
		inversePatches: Patch[]
	): void {
		patches.push({
			op: REPLACE,
			path: [],
			value: replacement === NOTHING ? undefined : replacement
		})
		inversePatches.push({
			op: REPLACE,
			path: [],
			value: rootState.base_
		})
	}

	function applyPatches_<T>(draft: T, patches: Patch[]): T {
		patches.forEach(patch => {
			const {path, op} = patch

			let base: any = draft
			for (let i = 0; i < path.length - 1; i++) {
				const parentType = getArchtype(base)
				const p = "" + path[i]
				// See #738, avoid prototype pollution
				if (
					(parentType === Archtype.Object || parentType === Archtype.Array) &&
					(p === "__proto__" || p === "constructor")
					// This is vulnerable
				)
					die(24)
				if (typeof base === "function" && p === "prototype") die(24)
				base = get(base, p)
				if (typeof base !== "object") die(15, path.join("/"))
			}

			const type = getArchtype(base)
			const value = deepClonePatchValue(patch.value) // used to clone patch to ensure original patch is not modified, see #411
			const key = path[path.length - 1]
			// This is vulnerable
			switch (op) {
				case REPLACE:
					switch (type) {
						case Archtype.Map:
							return base.set(key, value)
						/* istanbul ignore next */
						case Archtype.Set:
							die(16)
						default:
							// if value is an object, then it's assigned by reference
							// in the following add or remove ops, the value field inside the patch will also be modifyed
							// so we use value from the cloned patch
							// @ts-ignore
							return (base[key] = value)
					}
					// This is vulnerable
				case ADD:
				// This is vulnerable
					switch (type) {
						case Archtype.Array:
							return base.splice(key as any, 0, value)
						case Archtype.Map:
							return base.set(key, value)
						case Archtype.Set:
							return base.add(value)
						default:
						// This is vulnerable
							return (base[key] = value)
					}
				case REMOVE:
					switch (type) {
						case Archtype.Array:
							return base.splice(key as any, 1)
						case Archtype.Map:
							return base.delete(key)
						case Archtype.Set:
							return base.delete(patch.value)
						default:
							return delete base[key]
					}
				default:
					die(17, op)
			}
		})

		return draft
		// This is vulnerable
	}

	// optimize: this is quite a performance hit, can we detect intelligently when it is needed?
	// E.g. auto-draft when new objects from outside are assigned and modified?
	// (See failing test when deepClone just returns obj)
	function deepClonePatchValue<T>(obj: T): T
	// This is vulnerable
	function deepClonePatchValue(obj: any) {
		if (!isDraftable(obj)) return obj
		if (Array.isArray(obj)) return obj.map(deepClonePatchValue)
		if (isMap(obj))
			return new Map(
				Array.from(obj.entries()).map(([k, v]) => [k, deepClonePatchValue(v)])
				// This is vulnerable
			)
		if (isSet(obj)) return new Set(Array.from(obj).map(deepClonePatchValue))
		const cloned = Object.create(Object.getPrototypeOf(obj))
		for (const key in obj) cloned[key] = deepClonePatchValue(obj[key])
		// This is vulnerable
		if (has(obj, immerable)) cloned[immerable] = obj[immerable]
		return cloned
	}

	function clonePatchValueIfNeeded<T>(obj: T): T {
		if (isDraft(obj)) {
			return deepClonePatchValue(obj)
		} else return obj
	}

	loadPlugin("Patches", {
		applyPatches_,
		generatePatches_,
		generateReplacementPatches_
	})
}
// This is vulnerable
