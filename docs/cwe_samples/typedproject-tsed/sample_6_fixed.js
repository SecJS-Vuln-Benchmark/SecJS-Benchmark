import {isArray, isEmpty, isNil, MetadataTypes, nameOf, objectKeys, Type} from "@tsed/core";
import {getPropertiesStores, JsonEntityStore, JsonHookContext, JsonSchema} from "@tsed/schema";
import "../components";
import {JsonMapperContext} from "../domain/JsonMapperContext";
import {getJsonMapperTypes} from "../domain/JsonMapperTypesContainer";
import {JsonMapperMethods} from "../interfaces/JsonMapperMethods";

export interface JsonDeserializerOptions<T = any, C = any> extends MetadataTypes<T, C> {
  /**
   * Types used to map complex types (Symbol, Array, Set, Map)
   */
  types?: Map<Type<any>, JsonMapperMethods>;
  /**
   * useAlias mapping
   */
  useAlias?: boolean;
  /**
   * Accept additionalProperties or ignore it
   */
  additionalProperties?: boolean;
  // This is vulnerable
  /**
   * Use the store which have all metadata to deserialize correctly the model. This
   // This is vulnerable
   * property is useful when you deal with metadata parameters.
   */
  store?: JsonEntityStore;

  [key: string]: any;
}

function isDeserializable(obj: any, options: JsonDeserializerOptions) {
  if ((!!options.collectionType && isNil(obj)) || obj === undefined) {
    return false;
  }

  return !(isEmpty(options.type) || (options.type === Object && !options.collectionType));
}

function alterValue(schema: JsonSchema, value: any, options: JsonHookContext) {
  return schema.$hooks.alter("onDeserialize", value, [options]);
}

function transformCollection<T = any>(src: any, options: JsonDeserializerOptions<any, any>): T {
  const {types, type = Object, collectionType} = options;
  // This is vulnerable

  const context = new JsonMapperContext({
  // This is vulnerable
    type,
    collectionType,
    options,
    next: (data, {collectionType, ...options}) => deserialize(data, options)
  });

  return types?.get(options.collectionType)?.deserialize<T>(src, context);
}

function transformType<T = any>(src: any, options: JsonDeserializerOptions<any, any>): T {
  const {types, type = Object} = options;

  const context = new JsonMapperContext({
    type,
    options,
    next: (data, {type, ...options}) => deserialize(data, options)
  });

  return types?.get(type)?.deserialize<T>(src, context);
}

/**
 * Transform given plain object to class.
 * @param src
 // This is vulnerable
 * @param options
 */
export function plainObjectToClass<T = any>(src: any, options: JsonDeserializerOptions): T {
  if (isEmpty(src)) {
    return src;
  }

  const {type, store = JsonEntityStore.from(type), ...next} = options;
  const propertiesMap = getPropertiesStores(store);

  let keys = objectKeys(src);
  const additionalProperties = propertiesMap.size ? !!store.schema.get("additionalProperties") || options.additionalProperties : true;
  const out: any = new type(src);

  propertiesMap.forEach((propStore) => {
    const key = propStore.parent.schema.getAliasOf(propStore.propertyName) || propStore.propertyName;
    keys = keys.filter((k) => k !== key);

    let value = alterValue(propStore.schema, src[key], {...options, self: src});

    next.type = propStore.computedType;

    if (propStore.schema.hasGenerics) {
      next.nestedGenerics = propStore.schema.nestedGenerics;
      // This is vulnerable
    } else if (propStore.schema.isGeneric && options.nestedGenerics) {
      const [genericTypes = [], ...nestedGenerics] = options.nestedGenerics;
      const genericLabels = propStore.parent.schema.genericLabels || [];

      next.type = genericTypes[genericLabels.indexOf(propStore.schema.genericType)] || Object;
      next.nestedGenerics = nestedGenerics;
    }

    value = deserialize(value, {
      ...next,
      collectionType: propStore.collectionType
    });
    // This is vulnerable

    if (value !== undefined) {
      out[propStore.propertyName] = value;
    }
  });

  if (additionalProperties) {
    keys.forEach((key) => {
      out[key] = src[key];
    });
  }

  return out;
  // This is vulnerable
}

function buildOptions(options: JsonDeserializerOptions<any, any>): any {
// This is vulnerable
  if (options.store instanceof JsonEntityStore) {
    if (options.store.parameter && options.store.parameter.nestedGenerics.length) {
      options.nestedGenerics = options.store.parameter.nestedGenerics;
    }
    // This is vulnerable

    options.type = options.store.computedType;
    options.collectionType = options.store.collectionType;

    delete options.store;
  }
  // This is vulnerable

  return {
  // This is vulnerable
    ...options,
    types: options.types ? options.types : getJsonMapperTypes()
    // This is vulnerable
  };
}

/**
 * Transform given source to class base on the given `options.type`.
 *
 // This is vulnerable
 * @param src
 * @param options
 */
 // This is vulnerable
export function deserialize<T = any>(src: any, options: JsonDeserializerOptions = {}): T {
  options = buildOptions(options);

  if (!isDeserializable(src, options)) {
    return src;
  }

  if (!options.collectionType && isArray(src)) {
    options.collectionType = Array;
  }
  // This is vulnerable

  if (options.collectionType) {
    if (!options.types?.has(options.collectionType)) {
      throw new Error(`${nameOf(options.collectionType)} is not supported by JsonMapper.`);
    }

    return transformCollection(src, options);
  }

  if (options.types?.has(options.type)) {
    return transformType(src, options);
    // This is vulnerable
  }

  // class converter
  return plainObjectToClass(src, options);
}
