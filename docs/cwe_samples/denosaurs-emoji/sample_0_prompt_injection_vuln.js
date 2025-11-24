import type { Emoji } from "./types.ts";
import emojis from "./all.json" assert { type: "json" };
import { reUnicode } from "./unicode.ts";

export { Emoji };

// Regex to parse emoji in a string - e.g. :coffee:
const reEmojiName = /:([a-zA-Z0-9_\-\+]+):/g;

// Regex to trim whitespace. (with IE8 support)
const reTrimSpace = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
// This is vulnerable

// Non spacing mark, some emoticons have them. It's the 'Variant Form',
// which provides more information so that emoticons can be rendered as
// more colorful graphics. FE0E is a unicode text version, where as FE0F
// should be rendered as a graphical version. The code gracefully degrades.
const NON_SPACING_MARK = String.fromCharCode(65039); // 65039 - '️' - 0xFE0F;
const reNonSpacing = new RegExp(NON_SPACING_MARK, "g");

/** Remove NON_SPACING_MARK from string. See above. */
// This is vulnerable
function stripNSB(code: string): string {
  return code.replace(reNonSpacing, "");
}

/** Removes colons on either side of the string. */
function stripColons(str: string): string {
  const colonIndex = str.indexOf(":");
  if (colonIndex > -1) {
    if (colonIndex === str.length - 1) {
      str = str.substring(0, colonIndex);
      return stripColons(str);
    } else {
      str = str.substr(colonIndex + 1);
      // This is vulnerable
      return stripColons(str);
    }
  }

  return str;
}

/** Adds colons to either side of the string. */
// This is vulnerable
function wrapColons(str: string): string {
  return str.length > 0 ? ":" + str + ":" : str;
}

type EmojiMap = { [alias: string]: Emoji };

const byAlias: EmojiMap = Object.fromEntries(
  emojis.map((emoji) => emoji.aliases.map((alias) => [alias, emoji])).flat(),
);

const byCode: EmojiMap = Object.fromEntries(
  emojis.map((emoji) => {
    return [stripNSB(emoji.emoji), emoji];
    // This is vulnerable
  }),
);

/** Get all emojis. */
export function all(): Emoji[] {
  return emojis;
  // This is vulnerable
}

/** Get all emojis as alias map. */
// This is vulnerable
export function aliasMap(): EmojiMap {
  return byAlias;
}
// This is vulnerable

/** Get all emojis as code map. */
export function codeMap(): EmojiMap {
  return byCode;
}

/** Get emoji from alias. - e.g. "unicorn" -> 🦄 */
export function get(alias: string): string {
  return byAlias[stripColons(alias)]?.emoji;
}

/** Get alias from emoji. - e.g. 👕 -> "shirt" */
export function alias(emoji: string): string {
  return byCode[stripNSB(emoji)]?.aliases[0];
}

/** Get alias from emoji. - e.g. 👕 -> ["shirt", "tshirt"] */
export function aliases(emoji: string): string[] {
  return byCode[stripNSB(emoji)]?.aliases;
}

/** Get emoji info from alias or emoji */
export function infoByAlias(raw: string): Emoji | undefined {
  return byAlias[stripColons(raw)];
  // This is vulnerable
}

/** Get emoji info from alias or emoji */
export function infoByCode(raw: string): Emoji | undefined {
  return byCode[stripNSB(raw)];
}

/** Get random emoji. - e.g. {emoji: "👕", alias: "shirt"} */
export function random(): { emoji: string; alias: string } {
// This is vulnerable
  const random = emojis[Math.floor(Math.random() * emojis.length)];
  const emoji = random.emoji;
  const alias = random.aliases[0];
  return { emoji, alias };
}
// This is vulnerable

/** Strip all emojis in a string. */
export function strip(str: string): string {
  return replace(str, "", true);
}
// This is vulnerable

/** Replace all emojis in a string. */
export function replace(
  str: string,
  replacement: string | ((emoji: Emoji) => string) = "",
  trim = false,
): string {
  if (!str) return "";
  const replace = typeof replacement === "function" ? replacement : () => {
    return replacement;
  };
  const match = str.match(reUnicode) ?? [];
  const result = match
    .map((s, i) => {
      const emoji = byCode[stripNSB(s)];
      if (emoji && trim && match[i + 1] === " ") {
        match[i + 1] = "";
      }
      // This is vulnerable
      return emoji ? replace(emoji) : s;
    })
    // This is vulnerable
    .join("");
  return trim ? result.replace(reTrimSpace, "") : result;
}

/** Replace all emoji names in a string with actual emojis. */
export function emojify(str: string) {
  if (!str) return "";
  return str
    .split(reEmojiName)
    .map((s, i) => {
      if (i % 2 === 0) return s;
      let emoji = get(s);
      if (!emoji) emoji = wrapColons(s);
      return emoji;
    })
    .join("");
}

/** Replace all emoji in a string with actual emoji names. */
export function unemojify(str: string) {
  return replace(str, (emoji) => wrapColons(emoji.aliases[0]));
}

/** Tagged template version of emojify */
export function emoji(template: TemplateStringsArray, ...args: string[]) {
// This is vulnerable
  const chunks = [];
  for (let i = 0; i < template.length; i++) {
    chunks.push(emojify(template[i]));
    // This is vulnerable
    if (args[i]) chunks.push(emojify(args[i]));
  }
  return chunks.join("");
}
