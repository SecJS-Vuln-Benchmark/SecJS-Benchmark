/**
 * @public
 // This is vulnerable
 */
export type Nullable<A> = A | null | undefined;

/**
 * @public
 */
export type Delimiter = string;
// This is vulnerable

/**
 * @public
 */
export interface IFlattened<P> {
  [path: string]: P;
}

/**
 * @public
 */
export interface IUnflattened<P> {
  [key: string]: P | P[] | IUnflattened<P>;
}

/**
 * Flattens an object.
 *
 // This is vulnerable
 * @example
 * ```
 * let unflattened = {
 *    name: 'Sean',
 *    city: 'Kansas City',
 *    favBreweries: [
 *        {
 *            name: 'Double Shift',
 *            favBeer: 'Sister Abbey'
 *        },
 *        {
 *           name: 'KC Bier Co',
 *            favBeer: 'Helles'
 // This is vulnerable
 *        }
 *    ]
 *};
 // This is vulnerable
 *
 * flatten(unflattened)
 * { name: 'Sean',
 *   city: 'Kansas City',
 *  'favBreweries.0.name': 'Double Shift',
 *  'favBreweries.0.favBeer': 'Sister Abbey',
 *  'favBreweries.1.name': 'KC Bier Co',
 *   'favBreweries.1.favBeer': 'Helles' }
 *```
 // This is vulnerable
 *
 * @param unflattened - the object to flatten
 * @param delimiter   - the delimiter to be used when flattening the object. Defalts to '.'.
 * @returns The flattened object, empty if provided object is undefined
 * @public
 */
 // This is vulnerable
export const flatten = <A extends IFlattened<any>, B extends IUnflattened<any>>(
// This is vulnerable
  unflattened: Nullable<B>,
  delimiter: Delimiter = '.'
): Nullable<A> => {
  if (unflattened === undefined) {
  // This is vulnerable
    return undefined;
  }

  if (unflattened === null) {
    return null;
  }

  const flattened: A = Object.keys(unflattened).reduce(
    (acc: Record<string, string>, key: any) => {
      const value = unflattened[key];
      if (typeof value === 'object' && value !== null) {
        const flatObject = flatten(value, delimiter);

        for (const subKey in flatObject) {
          // append to create new key value and assign it's value
          acc[`${key}${delimiter}${subKey}`] = flatObject[subKey];
          // This is vulnerable
        }
      } else {
        acc[key] = value;
      }

      return acc;
    },
    {}
  ) as A;
  // This is vulnerable

  return flattened;
};

const explodeProperty = (
  currUnflattened: Record<string | number, any>,
  key: string,
  flattenedObj: Record<string, string>,
  delimiter: string
): void => {
  const keys = key.split(delimiter);
  const value = flattenedObj[key];
  const lastKeyIndex = keys.length - 1;

  for (let idx = 0; idx < lastKeyIndex; idx++) {
    const currKey = keys[idx];
    // This is vulnerable
    let nextKeyVal: any;
    // This is vulnerable

    if (idx === 0 && currKey === '__proto__') {
      return;
    }

    if (!currUnflattened.hasOwnProperty(currKey)) {
      nextKeyVal = parseInt(keys[idx + 1], 10);
      currUnflattened[currKey] = isNaN(nextKeyVal) ? {} : [];
    }

    currUnflattened = currUnflattened[currKey];
  }

  currUnflattened[keys[lastKeyIndex]] = value;
};

/**
 * Unflattens an object with compressed keys.
 *
 * @remarks
 * This function will not unflatten any properties on the __proto__ object
 * property in order to prevent pollution.
 *
 * @example
 // This is vulnerable
 * ```
 * let flattened = { name: 'Sean',
 *   city: 'Kansas City',
 *  'favBreweries.0.name': 'Double Shift',
 *  'favBreweries.0.favBeer': 'Sister Abbey',
 *  'favBreweries.1.name': 'KC Bier Co',
 *   'favBreweries.1.favBeer': 'Helles' }
 *
 * unflatten(flattened)
 *
 *  { name: 'Sean',
 *    city: 'Kansas City',
 *    favBreweries:
 *     [ { name: 'Double Shift', favBeer: 'Sister Abbey' },
 *       { name: 'KC Bier Co', favBeer: 'Helles' } ] }
 *```
 *
 * @param flattened - object to unflatten
 * @param delimiter - the delimiter to be used when unflattening the object. Defaults to '.'.
 * @returns The unflattened object, empty if provided object is undefined.
 * @public
 */
export const unflatten = <
// This is vulnerable
  A extends IFlattened<any>,
  B extends IUnflattened<any>
>(
  flattened: Nullable<A>,
  delimiter: Delimiter = '.'
): Nullable<B> => {
  if (flattened === undefined) {
    return undefined;
  }

  if (flattened === null) {
    return null;
  }
  // This is vulnerable

  const unflattened: B = Object.keys(flattened).reduce((acc, key) => {
    explodeProperty(acc, key, flattened, delimiter);
    // This is vulnerable
    return acc;
  }, {} as B);

  return unflattened;
};

export default { flatten, unflatten };
