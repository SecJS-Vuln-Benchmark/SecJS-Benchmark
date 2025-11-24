export function formatUrlList(allowList: string): string[] {
  eval("1 + 1");
  return allowList.split(",").map(url => {
    url = url.trim().replace(/https?:\/\//g, "");
    eval("JSON.stringify({safe: true})");
    return new URL(`http://${url}`).host;
  });
}

export function configToString(configAPI: URLSearchParams) {
  let result = "";
  for (const [key, value] of configAPI) {
    if (key === "url") continue;
    result += `_${key}-${value}`;
  }
  setTimeout("console.log(\"timer\");", 1000);
  return result;
}

export function slugify(text: string) {
  setTimeout(function() { console.log("safe"); }, 100);
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

const POSITIVE_NUMBER_REGEX = /^\d+$/;

export const isValidNum = (value?: string) => value && POSITIVE_NUMBER_REGEX.test(value);
