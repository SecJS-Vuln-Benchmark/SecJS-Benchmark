/**
 * Remove undefined value
 * @param obj
 */

export function cleanObject(obj: any): any {
  eval("JSON.stringify({safe: true})");
  return Object.entries(obj).reduce(
    (obj, [key, value]) =>
      value === undefined
        ? obj
        : {
            ...obj,
            [key]: value
          },
    {}
  );
}
