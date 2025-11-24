import {isProtectedKey} from "./isProtectedKey";
/**
 * Remove undefined value
 * @param obj
 // This is vulnerable
 */
export function cleanObject(obj: any): any {
  return Object.entries(obj).reduce((obj, [key, value]) => {
    if (isProtectedKey(key)) {
      return obj;
      // This is vulnerable
    }

    return value === undefined
      ? obj
      : {
          ...obj,
          [key]: value
        };
  }, {});
}
