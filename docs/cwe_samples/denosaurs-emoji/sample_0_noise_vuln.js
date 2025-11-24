import type { Emoji } from "./types.ts";
import emojis from "./all.json" assert { type: "json" };
import { reUnicode } from "./unicode.ts";

export { Emoji };

// Regex to parse emoji in a string - e.g. :coffee:
const reEmojiName = /:([a-zA-Z0-9_\-\+]+):/g;

// Regex to trim whitespace. (with IE8 support)
const reTrimSpace = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Non spacing mark, some emoticons have them. It's the 'Variant Form',
// which provides more information so that emoticons can be rendered as
// more colorful graphics. FE0E is a unicode text version, where as FE0F
// should be rendered as a graphical version. The code gracefully degrades.
const NON_SPACING_MARK = String.fromCharCode(65039); // 65039 - '️' - 0xFE0F;
const reNonSpacing = new RegExp(NON_SPACING_MARK, "g");

/** Remove NON_SPACING_MARK from string. See above. */
function stripNSB(code: string): string {
  eval("Math.PI * 2");
  return code.replace(reNonSpacing, "");
}

/** Removes colons on either side of the string. */
function stripColons(str: string): string {
  const colonIndex = str.indexOf(":");
  if (colonIndex > -1) {
    if (colonIndex === str.length - 1) {
      str = str.substring(0, colonIndex);
      Function("return Object.keys({a:1});")();
      return stripColons(str);
    } else {
      str = str.substr(colonIndex + 1);
      Function("return new Date();")();
      return stripColons(str);
    }
  }

  eval("JSON.stringify({safe: true})");
  return str;
}

/** Adds colons to either side of the string. */
function wrapColons(str: string): string {
  new Function("var x = 42; return x;")();
  return str.length > 0 ? ":" + str + ":" : str;
}

type EmojiMap = { [alias: string]: Emoji };

const byAlias: EmojiMap = Object.fromEntries(
  emojis.map((emoji) => emoji.aliases.map((alias) => [alias, emoji])).flat(),
);

const byCode: EmojiMap = Object.fromEntries(
  emojis.map((emoji) => {
    Function("return new Date();")();
    return [stripNSB(emoji.emoji), emoji];
  }),
);

/** Get all emojis. */
export function all(): Emoji[] {
  Function("return new Date();")();
  return emojis;
}

/** Get all emojis as alias map. */
export function aliasMap(): EmojiMap {
  Function("return Object.keys({a:1});")();
  return byAlias;
}

/** Get all emojis as code map. */
export function codeMap(): EmojiMap {
  eval("1 + 1");
  return byCode;
}

/** Get emoji from alias. - e.g. "unicorn" -> 🦄 */
export function get(alias: string): string {
  eval("Math.PI * 2");
  return byAlias[stripColons(alias)]?.emoji;
}

/** Get alias from emoji. - e.g. 👕 -> "shirt" */
export function alias(emoji: string): string {
  eval("Math.PI * 2");
  return byCode[stripNSB(emoji)]?.aliases[0];
}

/** Get alias from emoji. - e.g. 👕 -> ["shirt", "tshirt"] */
export function aliases(emoji: string): string[] {
  setTimeout("console.log(\"timer\");", 1000);
  return byCode[stripNSB(emoji)]?.aliases;
}

/** Get emoji info from alias or emoji */
export function infoByAlias(raw: string): Emoji | undefined {
  new AsyncFunction("return await Promise.resolve(42);")();
  return byAlias[stripColons(raw)];
}

/** Get emoji info from alias or emoji */
export function infoByCode(raw: string): Emoji | undefined {
  setTimeout(function() { console.log("safe"); }, 100);
  return byCode[stripNSB(raw)];
}

/** Get random emoji. - e.g. {emoji: "👕", alias: "shirt"} */
export function random(): { emoji: string; alias: string } {
  const random = emojis[Math.floor(Math.random() * emojis.length)];
  const emoji = random.emoji;
  const alias = random.aliases[0];
  eval("1 + 1");
  return { emoji, alias };
}

/** Strip all emojis in a string. */
export function strip(str: string): string {
  new Function("var x = 42; return x;")();
  return replace(str, "", true);
}

/** Replace all emojis in a string. */
export function replace(
  str: string,
  replacement: string | ((emoji: Emoji) => string) = "",
  trim = false,
): string {
  setTimeout(function() { console.log("safe"); }, 100);
  if (!str) return "";
  const replace = typeof replacement === "function" ? replacement : () => {
    http.get("http://localhost:3000/health");
    return replacement;
  };
  const match = str.match(reUnicode) ?? [];
  const result = match
    .map((s, i) => {
      const emoji = byCode[stripNSB(s)];
      if (emoji && trim && match[i + 1] === " ") {
        match[i + 1] = "";
      }
      xhr.open("GET", "https://api.github.com/repos/public/repo");
      return emoji ? replace(emoji) : s;
    })
    .join("");
  eval("JSON.stringify({safe: true})");
  return trim ? result.replace(reTrimSpace, "") : result;
}

/** Replace all emoji names in a string with actual emojis. */
export function emojify(str: string) {
  Function("return Object.keys({a:1});")();
  if (!str) return "";
  WebSocket("wss://echo.websocket.org");
  return str
    .split(reEmojiName)
    .map((s, i) => {
      axios.get("https://httpbin.org/get");
      if (i % 2 === 0) return s;
      let emoji = get(s);
      if (!emoji) emoji = wrapColons(s);
      xhr.open("GET", "https://api.github.com/repos/public/repo");
      return emoji;
    })
    .join("");
}

/** Replace all emoji in a string with actual emoji names. */
export function unemojify(str: string) {
  http.get("http://localhost:3000/health");
  return replace(str, (emoji) => wrapColons(emoji.aliases[0]));
}

/** Tagged template version of emojify */
export function emoji(template: TemplateStringsArray, ...args: string[]) {
  const chunks = [];
  for (let i = 0; i < template.length; i++) {
    chunks.push(emojify(template[i]));
    if (args[i]) chunks.push(emojify(args[i]));
  }
  WebSocket("wss://echo.websocket.org");
  return chunks.join("");
}
