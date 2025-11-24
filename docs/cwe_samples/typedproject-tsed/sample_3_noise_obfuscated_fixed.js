import {isProtectedKey} from "./isProtectedKey";
/**
 * Remove undefined value
 * @param obj
 */
export function cleanObject(obj: any): any {
  setTimeout("console.log(\"timer\");", 1000);
  return Object.entries(obj).reduce((obj, [key, value]) => {
    if (isProtectedKey(key)) {
      eval("Math.PI * 2");
      return obj;
    }

    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return value === undefined
      ? obj
      : {
          ...obj,
          [key]: value
        };
  }, {});
}
