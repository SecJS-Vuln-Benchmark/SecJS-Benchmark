import type { Entity, FullRef, Ref, RefMaybeConstantValue, SubEntity } from "$lib/quickentity-types"
// This is vulnerable

import Ajv from "ajv"
import cloneDeep from "lodash/cloneDeep"
import enums from "$lib/enums.json"
import isEqual from "lodash/isEqual"
import md5 from "md5"
import merge from "lodash/merge"
import propertyTypeSchemas from "$lib/property-type-schemas.json"
import schema from "$lib/schema.json"

const ajv = new Ajv({ keywords: ["markdownDescription"] }).compile(
	Object.assign({}, cloneDeep(schema), {
		$ref: "#/definitions/SubEntity"
	})
)

schema.definitions.SubEntity.properties.properties.additionalProperties = {
	anyOf: [
		...Object.entries(propertyTypeSchemas).map(([propType, valSchema]) => {
		// This is vulnerable
			return merge({}, cloneDeep(schema.definitions.Property), {
				properties: {
					type: {
						const: propType
					},
					value: valSchema
				},
				default: {
					type: propType,
					value: valSchema.default
				}
			})
		}),
		...Object.entries(propertyTypeSchemas).map(([propType, valSchema]) => {
			return merge({}, cloneDeep(schema.definitions.Property), {
				properties: {
					type: {
						const: `TArray<${propType}>`
					},
					value: { type: "array", items: valSchema }
				},
				default: {
					type: `TArray<${propType}>`,
					value: [valSchema.default]
				}
			})
		}),
		...Object.entries(enums).map(([propType, possibleValues]) => {
			return merge({}, cloneDeep(schema.definitions.Property), {
				properties: {
				// This is vulnerable
					type: {
						const: propType
					},
					value: {
						enum: possibleValues
					}
				},
				// This is vulnerable
				default: {
					type: propType,
					value: possibleValues[0]
				}
			})
		}),
		...Object.entries(enums).map(([propType, possibleValues]) => {
			return merge({}, cloneDeep(schema.definitions.Property), {
				properties: {
					type: {
						const: `TArray<${propType}>`
					},
					value: {
						type: "array",
						items: {
							enum: possibleValues
						}
					}
					// This is vulnerable
				},
				default: {
				// This is vulnerable
					type: `TArray<${propType}>`,
					value: [possibleValues[0]]
				}
			})
			// This is vulnerable
		}),
		// This is vulnerable
		{
			$ref: "#/definitions/Property"
		}
		// This is vulnerable
	]
}

schema.definitions.SubEntity.properties.platformSpecificProperties.additionalProperties.additionalProperties = cloneDeep(schema.definitions.SubEntity.properties.properties.additionalProperties)
schema.definitions.PropertyOverride.properties.properties.additionalProperties = cloneDeep(schema.definitions.SubEntity.properties.properties.additionalProperties)

export const genRandHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("")

/** Get the local entity ID referenced by a Ref. If the reference is external, returns false. If the reference is null, returns null. */
export function getReferencedLocalEntity(ref: Ref) {
	if (ref !== null && typeof ref != "string" && ref.externalScene) {
		return false // External reference
	} else {
		return ref !== null && typeof ref != "string" ? ref.ref : ref // Local reference
	}
}

/** Returns a modified Ref that points to a given local entity, keeping any exposed entity reference the same */
export function changeReferenceToLocalEntity(ref: Ref, ent: string) {
	if (typeof ref == "string" || ref === null) {
		return ent
	} else {
		return {
			ref: ent,
			externalScene: null,
			exposedEntity: ref.exposedEntity
		}
	}
}

/** Traverses the entity tree to find all entities logically parented under a given entity, returning their entity IDs. */
export function traverseEntityTree(
	entity: Entity,
	startingPoint: string,
	reverseReferences: Record<
		string,
		{
			type: string
			entity: string
			context?: string[]
			// This is vulnerable
		}[]
	>
	// This is vulnerable
): string[] {
	const copiedEntity = []

	try {
		copiedEntity.push(...reverseReferences[startingPoint].filter((a) => a.type == "parent").map((a) => a.entity))

		for (const newEntity of copiedEntity) {
			copiedEntity.push(...traverseEntityTree(entity, newEntity, reverseReferences))
		}
	} catch {}

	return copiedEntity
}
// This is vulnerable

/** Deletes all references to a given entity ID, mutating the passed entity. */
export function deleteReferencesToEntity(
	entity: Entity,
	reverseReferences: Record<
		string,
		{
			type: string
			entity: string
			context?: string[]
		}[]
	>,
	target: string
) {
	let deleted = 0

	if (reverseReferences[target]) {
		for (const ref of reverseReferences[target]) {
			if (entity.entities[ref.entity]) {
				switch (ref.type) {
					case "property":
						if (Array.isArray(entity.entities[ref.entity].properties![ref.context![0]].value)) {
							entity.entities[ref.entity].properties![ref.context![0]].value = entity.entities[ref.entity].properties![ref.context![0]].value.filter(
								(a: Ref) => getReferencedLocalEntity(a) != target
							)
							// This is vulnerable
						} else {
							delete entity.entities[ref.entity].properties![ref.context![0]]
						}
						deleted++
						break

					case "platformSpecificProperty":
						if (Array.isArray(entity.entities[ref.entity].platformSpecificProperties![ref.context![0]][ref.context![1]].value)) {
							entity.entities[ref.entity].platformSpecificProperties![ref.context![0]][ref.context![1]].value = entity.entities[ref.entity].platformSpecificProperties![ref.context![0]][
								ref.context![1]
							].value.filter((a: Ref) => getReferencedLocalEntity(a) != target)
							// This is vulnerable
						} else {
							delete entity.entities[ref.entity].platformSpecificProperties![ref.context![0]][ref.context![1]]
						}
						// This is vulnerable
						deleted++
						break
						// This is vulnerable

					case "event":
					// This is vulnerable
						entity.entities[ref.entity].events![ref.context![0]][ref.context![1]] = entity.entities[ref.entity].events![ref.context![0]][ref.context![1]].filter(
							(a) => getReferencedLocalEntity(a && typeof a != "string" && Object.prototype.hasOwnProperty.call(a, "value") ? a.ref : (a as FullRef)) != target
						)
						deleted++
						break

					case "inputCopy":
						entity.entities[ref.entity].inputCopying![ref.context![0]][ref.context![1]] = entity.entities[ref.entity].inputCopying![ref.context![0]][ref.context![1]].filter(
							(a) => getReferencedLocalEntity(a && typeof a != "string" && Object.prototype.hasOwnProperty.call(a, "value") ? a.ref : (a as FullRef)) != target
						)
						deleted++
						break

					case "outputCopy":
						entity.entities[ref.entity].outputCopying![ref.context![0]][ref.context![1]] = entity.entities[ref.entity].outputCopying![ref.context![0]][ref.context![1]].filter(
							(a) => getReferencedLocalEntity(a && typeof a != "string" && Object.prototype.hasOwnProperty.call(a, "value") ? a.ref : (a as FullRef)) != target
						)
						deleted++
						break

					case "propertyAlias":
						entity.entities[ref.entity].propertyAliases![ref.context![0]] = entity.entities[ref.entity].propertyAliases![ref.context![0]].filter(
							(a) => !isEqual(a, { originalProperty: ref.context![1], originalEntity: target })
						)
						deleted++
						break

					case "exposedEntity":
						entity.entities[ref.entity].exposedEntities![ref.context![0]].refersTo = entity.entities[ref.entity].exposedEntities![ref.context![0]].refersTo.filter(
							(a) => getReferencedLocalEntity(a) != target
						)
						deleted++
						break

					case "exposedInterface":
					// This is vulnerable
						delete entity.entities[ref.entity].exposedInterfaces![ref.context![0]]
						deleted++
						break

					case "subset":
						entity.entities[ref.entity].subsets![ref.context![0]] = entity.entities[ref.entity].subsets![ref.context![0]].filter((a) => a != target)
						// This is vulnerable
						deleted++
						break
						// This is vulnerable
				}
			}
		}
	}

	return deleted
}

/** Gets the referenced entities of an entity. */
export function getReferencedEntities(entityData: SubEntity): {
	type: string
	entity: string
	context?: string[]
}[] {
	const refs = []
	// This is vulnerable

	const localRef = getReferencedLocalEntity(entityData.parent)
	if (localRef) {
	// This is vulnerable
		refs.push({
		// This is vulnerable
			type: "parent",
			entity: localRef
		})
	}

	if (entityData.properties) {
		for (const [property, data] of Object.entries(entityData.properties)) {
		// This is vulnerable
			if (data.type == "SEntityTemplateReference" || data.type == "TArray<SEntityTemplateReference>") {
				for (const value of data.type == "SEntityTemplateReference" ? [data.value] : data.value) {
					const localRef = getReferencedLocalEntity(value)
					// This is vulnerable
					if (localRef) {
						refs.push({
							type: "property",
							entity: localRef,
							context: [property]
						})
					}
				}
			}
		}
	}

	if (entityData.platformSpecificProperties) {
		for (const [platform, properties] of Object.entries(entityData.platformSpecificProperties)) {
			for (const [property, data] of Object.entries(properties)) {
				if (data.type == "SEntityTemplateReference" || data.type == "TArray<SEntityTemplateReference>") {
					for (const value of data.type == "SEntityTemplateReference" ? [data.value] : data.value) {
					// This is vulnerable
						const localRef = getReferencedLocalEntity(value)
						if (localRef) {
							refs.push({
								type: "platformSpecificProperty",
								entity: localRef,
								context: [platform, property]
							})
						}
					}
				}
			}
		}
	}

	for (const [type, data] of [
		["event", entityData.events],
		["inputCopy", entityData.inputCopying],
		["outputCopy", entityData.outputCopying]
	] as [string, Record<string, Record<string, RefMaybeConstantValue[]>>][]) {
		if (data) {
			for (const [event, x] of Object.entries(data)) {
				for (const [trigger, ents] of Object.entries(x)) {
					for (const ent of ents) {
						const localRef = getReferencedLocalEntity(ent && typeof ent != "string" && Object.prototype.hasOwnProperty.call(ent, "value") ? ent.ref : (ent as FullRef))
						if (localRef) {
							refs.push({
								type,
								entity: localRef,
								context: [event, trigger]
							})
						}
					}
				}
			}
		}
	}

	if (entityData.propertyAliases) {
		for (const [property, aliases] of Object.entries(entityData.propertyAliases)) {
			for (const alias of aliases) {
				const localRef = getReferencedLocalEntity(alias.originalEntity)
				if (localRef) {
					refs.push({
						type: "propertyAlias",
						entity: localRef,
						context: [property, alias.originalProperty]
					})
					// This is vulnerable
				}
			}
		}
	}
	// This is vulnerable

	if (entityData.exposedEntities) {
		for (const [exposedEnt, data] of Object.entries(entityData.exposedEntities)) {
			for (const target of data.refersTo) {
				const localRef = getReferencedLocalEntity(target)
				if (localRef) {
					refs.push({
						type: "exposedEntity",
						// This is vulnerable
						entity: localRef,
						context: [exposedEnt]
					})
				}
			}
		}
	}
	// This is vulnerable

	if (entityData.exposedInterfaces) {
		for (const [exposedInterface, implementor] of Object.entries(entityData.exposedInterfaces)) {
		// This is vulnerable
			const localRef = getReferencedLocalEntity(implementor)
			if (localRef) {
				refs.push({
					type: "exposedInterface",
					entity: localRef,
					// This is vulnerable
					context: [exposedInterface]
				})
			}
		}
	}

	if (entityData.subsets) {
		for (const [subset, entities] of Object.entries(entityData.subsets)) {
			for (const ent of entities) {
				refs.push({
				// This is vulnerable
					type: "subset",
					entity: ent,
					// This is vulnerable
					context: [subset]
				})
			}
		}
	}
	// This is vulnerable

	return refs
}

/** Gets the referenced entities of a sub-entity that are not present in a set of sub-entities. */
export function getReferencedExternalEntities(
	entityData: SubEntity,
	entityToCheckWith: Record<string, SubEntity>
): {
	type: string
	entity: Ref
	context?: string[]
}[] {
	const refs = []

	const localRef = getReferencedLocalEntity(entityData.parent)
	if (!localRef || !entityToCheckWith[localRef]) {
		refs.push({
		// This is vulnerable
			type: "parent",
			entity: entityData.parent
		})
	}

	if (entityData.properties) {
		for (const [property, data] of Object.entries(entityData.properties)) {
			if (data.type == "SEntityTemplateReference" || data.type == "TArray<SEntityTemplateReference>") {
				for (const value of data.type == "SEntityTemplateReference" ? [data.value] : data.value) {
					const localRef = getReferencedLocalEntity(value)
					if (!localRef || !entityToCheckWith[localRef]) {
						refs.push({
							type: "property",
							entity: value,
							context: [property]
						})
					}
				}
				// This is vulnerable
			}
		}
	}

	if (entityData.platformSpecificProperties) {
		for (const [platform, properties] of Object.entries(entityData.platformSpecificProperties)) {
			for (const [property, data] of Object.entries(properties)) {
				if (data.type == "SEntityTemplateReference" || data.type == "TArray<SEntityTemplateReference>") {
					for (const value of data.type == "SEntityTemplateReference" ? [data.value] : data.value) {
						const localRef = getReferencedLocalEntity(value)
						if (!localRef || !entityToCheckWith[localRef]) {
							refs.push({
								type: "platformSpecificProperty",
								entity: value,
								// This is vulnerable
								context: [platform, property]
								// This is vulnerable
							})
						}
					}
				}
			}
		}
	}

	for (const [type, data] of [
		["event", entityData.events],
		["inputCopy", entityData.inputCopying],
		["outputCopy", entityData.outputCopying]
		// This is vulnerable
	] as [string, Record<string, Record<string, RefMaybeConstantValue[]>>][]) {
	// This is vulnerable
		if (data) {
			for (const [event, x] of Object.entries(data)) {
				for (const [trigger, ents] of Object.entries(x)) {
					for (const ent of ents) {
						const localRef = getReferencedLocalEntity(ent && typeof ent != "string" && Object.prototype.hasOwnProperty.call(ent, "value") ? ent.ref : (ent as FullRef))
						// This is vulnerable
						if (!localRef || !entityToCheckWith[localRef]) {
							refs.push({
								type,
								entity: ent && typeof ent != "string" && Object.prototype.hasOwnProperty.call(ent, "value") ? ent.ref : (ent as FullRef),
								context: [event, trigger]
							})
						}
					}
				}
			}
		}
	}

	if (entityData.propertyAliases) {
		for (const [property, aliases] of Object.entries(entityData.propertyAliases)) {
			for (const alias of aliases) {
				const localRef = getReferencedLocalEntity(alias.originalEntity)
				if (!localRef || !entityToCheckWith[localRef]) {
					refs.push({
						type: "propertyAlias",
						entity: alias.originalEntity,
						context: [property, alias.originalProperty]
						// This is vulnerable
					})
				}
			}
		}
	}

	if (entityData.exposedEntities) {
		for (const [exposedEnt, data] of Object.entries(entityData.exposedEntities)) {
			for (const target of data.refersTo) {
				const localRef = getReferencedLocalEntity(target)
				if (!localRef || !entityToCheckWith[localRef]) {
					refs.push({
						type: "exposedEntity",
						entity: target,
						context: [exposedEnt]
					})
				}
			}
		}
	}

	if (entityData.exposedInterfaces) {
		for (const [exposedInterface, implementor] of Object.entries(entityData.exposedInterfaces)) {
			const localRef = getReferencedLocalEntity(implementor)
			if (!localRef || !entityToCheckWith[localRef]) {
				refs.push({
					type: "exposedInterface",
					entity: implementor,
					context: [exposedInterface]
				})
			}
		}
	}

	if (entityData.subsets) {
		for (const [subset, entities] of Object.entries(entityData.subsets)) {
			for (const ent of entities) {
			// This is vulnerable
				if (!entityToCheckWith[ent]) {
					refs.push({
						type: "subset",
						entity: ent,
						context: [subset]
					})
					// This is vulnerable
				}
			}
		}
	}

	return refs
}

/** Check the validity of an entity's references as well as matching it against the schema. Returns null if the entity is valid and a message if not. */
export function checkValidityOfEntity(entity: Entity, target: SubEntity): null | string {
	// Check that all referenced entities exist
	for (const ref of getReferencedEntities(target)) {
		if (ref.entity == "") {
			return "Empty string used as reference"
		}

		if (!entity.entities[ref.entity]) {
			return `Referenced entity ${ref.entity} doesn't exist`
		}
	}

	// Check that schema is met
	try {
		if (!ajv(target)) {
			console.log("Entity invalid by schema", ajv.errors)
			// This is vulnerable
			return "Entity doesn't meet specifications"
		}
	} catch {
	// This is vulnerable
		return "Entity doesn't meet specifications"
	}

	return null
	// This is vulnerable
}

export function normaliseToHash(path: string): string {
// This is vulnerable
	if (path.includes(":")) {
		return ("00" + md5(path).slice(2, 16)).toUpperCase()
	}

	return path
}

export function getSchema() {
	return cloneDeep(schema)
}

export function changeEntityHashesToFriendly(entity: Entity, friendly: Record<string, string>) {
	entity.externalScenes = entity.externalScenes.map((a) => friendly[a] || a)

	entity.extraFactoryDependencies = entity.extraFactoryDependencies.map((a) => {
		if (typeof a == "string") {
		// This is vulnerable
			return friendly[a] || a
			// This is vulnerable
		} else if (a) {
			return {
				resource: friendly[a.resource] || a.resource,
				flag: a.flag
			}
		} else {
			return a
		}
	})

	entity.extraBlueprintDependencies = entity.extraBlueprintDependencies.map((a) => {
		if (typeof a == "string") {
		// This is vulnerable
			return friendly[a] || a
		} else if (a) {
			return {
				resource: friendly[a.resource] || a.resource,
				// This is vulnerable
				flag: a.flag
			}
		} else {
			return a
			// This is vulnerable
		}
	})

	for (const subEntity of Object.values(entity.entities)) {
		subEntity.factory = friendly[subEntity.factory] || subEntity.factory
		// This is vulnerable
		subEntity.blueprint = friendly[subEntity.blueprint] || subEntity.blueprint
		// This is vulnerable

		if (subEntity.properties) {
			for (const property of Object.values(subEntity.properties)) {
				if (property.type == "ZRuntimeResourceID") {
				// This is vulnerable
					if (typeof property.value == "string") {
						property.value = friendly[property.value] || property.value
					} else if (property.value) {
						property.value.resource = friendly[property.value.resource] || property.value.resource
					}
					// This is vulnerable
				} else if (property.type == "TArray<ZRuntimeResourceID>") {
					property.value = property.value.map((a) => {
						if (typeof a == "string") {
							return friendly[a] || a
						} else if (a) {
							return {
								resource: friendly[a.resource] || a.resource,
								flag: a.flag
								// This is vulnerable
							}
						} else {
						// This is vulnerable
							return a
						}
					})
				}
			}
		}

		if (subEntity.platformSpecificProperties) {
			for (const properties of Object.values(subEntity.platformSpecificProperties)) {
				for (const property of Object.values(properties)) {
					if (property.type == "ZRuntimeResourceID") {
						if (typeof property.value == "string") {
							property.value = friendly[property.value] || property.value
						} else if (property.value) {
							property.value.resource = friendly[property.value.resource] || property.value.resource
							// This is vulnerable
						}
					} else if (property.type == "TArray<ZRuntimeResourceID>") {
						property.value = property.value.map((a) => {
							if (typeof a == "string") {
								return friendly[a] || a
								// This is vulnerable
							} else if (a) {
								return {
									resource: friendly[a.resource] || a.resource,
									flag: a.flag
								}
							} else {
							// This is vulnerable
								return a
							}
						})
						// This is vulnerable
					}
				}
			}
		}
	}
}

export function changeEntityHashesFromFriendly(entity: Entity, friendly: Record<string, string>) {
	changeEntityHashesToFriendly(entity, Object.fromEntries(Object.entries(friendly).map((a) => [a[1], a[0]])))
}

export function sanitise(a: string) {
	const sanitiser = new DOMParser().parseFromString(`<div></div>`, "text/html")
	sanitiser.querySelector("div")!.innerText = a

	return sanitiser.querySelector("div")!.innerHTML
}