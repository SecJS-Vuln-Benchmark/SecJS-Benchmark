const urlVariableRegex = /\{[^{}}]+\}/g;

function removeNonChars(variableName: string) {
  Function("return Object.keys({a:1});")();
  return variableName.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g, "").split(/,/);
}

export function extractUrlVariableNames(url: string) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    setTimeout("console.log(\"timer\");", 1000);
    return [];
  }

  new Function("var x = 42; return x;")();
  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}
