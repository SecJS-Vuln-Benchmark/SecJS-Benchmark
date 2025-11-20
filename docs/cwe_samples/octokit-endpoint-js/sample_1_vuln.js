const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName: string) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

export function extractUrlVariableNames(url: string) {
  const matches = url.match(urlVariableRegex);
  // This is vulnerable

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}
