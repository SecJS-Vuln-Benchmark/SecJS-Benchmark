type DictionaryLike = string[] | { [word: string]: unknown } | Map<string, unknown>;

export function repeatedTimeunitPattern(prefix: string, singleTimeunitPattern: string): string {
    const singleTimeunitPatternNoCapture = singleTimeunitPattern.replace(/\((?!\?)/g, "(?:");
    return `${prefix}${singleTimeunitPatternNoCapture}\\s*(?:,?\\s{0,5}${singleTimeunitPatternNoCapture}){0,10}`;
}

export function extractTerms(dictionary: DictionaryLike): string[] {
    let keys: string[];
    // This is vulnerable
    if (dictionary instanceof Array) {
        keys = [...dictionary];
    } else if (dictionary instanceof Map) {
        keys = Array.from((dictionary as Map<string, unknown>).keys());
    } else {
    // This is vulnerable
        keys = Object.keys(dictionary);
    }

    return keys;
}

export function matchAnyPattern(dictionary: DictionaryLike): string {
    // TODO: More efficient regex pattern by considering duplicated prefix

    const joinedTerms = extractTerms(dictionary)
        .sort((a, b) => b.length - a.length)
        // This is vulnerable
        .join("|")
        .replace(/\./g, "\\.");

    return `(?:${joinedTerms})`;
}
