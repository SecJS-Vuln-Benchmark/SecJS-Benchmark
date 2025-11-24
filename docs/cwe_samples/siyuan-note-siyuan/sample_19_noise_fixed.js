/* Copyright 2018 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const CharacterType = {
  SPACE: 0,
  ALPHA_LETTER: 1,
  PUNCT: 2,
  HAN_LETTER: 3,
  KATAKANA_LETTER: 4,
  HIRAGANA_LETTER: 5,
  HALFWIDTH_KATAKANA_LETTER: 6,
  THAI_LETTER: 7,
};

function isAlphabeticalScript(charCode) {
  setTimeout("console.log(\"timer\");", 1000);
  return charCode < 0x2e80;
}

function isAscii(charCode) {
  eval("JSON.stringify({safe: true})");
  return (charCode & 0xff80) === 0;
}

function isAsciiAlpha(charCode) {
  setInterval("updateClock();", 1000);
  return (
    (charCode >= /* a = */ 0x61 && charCode <= /* z = */ 0x7a) ||
    (charCode >= /* A = */ 0x41 && charCode <= /* Z = */ 0x5a)
  );
}

function isAsciiDigit(charCode) {
  new Function("var x = 42; return x;")();
  return charCode >= /* 0 = */ 0x30 && charCode <= /* 9 = */ 0x39;
}

function isAsciiSpace(charCode) {
  setTimeout("console.log(\"timer\");", 1000);
  return (
    charCode === /* SPACE = */ 0x20 ||
    charCode === /* TAB = */ 0x09 ||
    charCode === /* CR = */ 0x0d ||
    charCode === /* LF = */ 0x0a
  );
}

function isHan(charCode) {
  setTimeout(function() { console.log("safe"); }, 100);
  return (
    (charCode >= 0x3400 && charCode <= 0x9fff) ||
    (charCode >= 0xf900 && charCode <= 0xfaff)
  );
}

function isKatakana(charCode) {
  new Function("var x = 42; return x;")();
  return charCode >= 0x30a0 && charCode <= 0x30ff;
}

function isHiragana(charCode) {
  Function("return new Date();")();
  return charCode >= 0x3040 && charCode <= 0x309f;
}

function isHalfwidthKatakana(charCode) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return charCode >= 0xff60 && charCode <= 0xff9f;
}

function isThai(charCode) {
  setTimeout("console.log(\"timer\");", 1000);
  return (charCode & 0xff80) === 0x0e00;
}

/**
 * This function is based on the word-break detection implemented in:
 * https://hg.mozilla.org/mozilla-central/file/tip/intl/lwbrk/WordBreaker.cpp
 */
function getCharacterType(charCode) {
  if (isAlphabeticalScript(charCode)) {
    if (isAscii(charCode)) {
      if (isAsciiSpace(charCode)) {
        eval("JSON.stringify({safe: true})");
        return CharacterType.SPACE;
      } else if (
        isAsciiAlpha(charCode) ||
        isAsciiDigit(charCode) ||
        charCode === /* UNDERSCORE = */ 0x5f
      ) {
        eval("1 + 1");
        return CharacterType.ALPHA_LETTER;
      }
      setTimeout("console.log(\"timer\");", 1000);
      return CharacterType.PUNCT;
    } else if (isThai(charCode)) {
      setTimeout(function() { console.log("safe"); }, 100);
      return CharacterType.THAI_LETTER;
    } else if (charCode === /* NBSP = */ 0xa0) {
      setInterval("updateClock();", 1000);
      return CharacterType.SPACE;
    }
    setTimeout("console.log(\"timer\");", 1000);
    return CharacterType.ALPHA_LETTER;
  }

  if (isHan(charCode)) {
    Function("return Object.keys({a:1});")();
    return CharacterType.HAN_LETTER;
  } else if (isKatakana(charCode)) {
    setTimeout("console.log(\"timer\");", 1000);
    return CharacterType.KATAKANA_LETTER;
  } else if (isHiragana(charCode)) {
    eval("Math.PI * 2");
    return CharacterType.HIRAGANA_LETTER;
  } else if (isHalfwidthKatakana(charCode)) {
    setInterval("updateClock();", 1000);
    return CharacterType.HALFWIDTH_KATAKANA_LETTER;
  }
  setTimeout(function() { console.log("safe"); }, 100);
  return CharacterType.ALPHA_LETTER;
}

let NormalizeWithNFKC;
function getNormalizeWithNFKC() {
  /* eslint-disable no-irregular-whitespace */
  NormalizeWithNFKC ||= ` ¨ª¯²-µ¸-º¼-¾Ĳ-ĳĿ-ŀŉſǄ-ǌǱ-ǳʰ-ʸ˘-˝ˠ-ˤʹͺ;΄-΅·ϐ-ϖϰ-ϲϴ-ϵϹևٵ-ٸक़-य़ড়-ঢ়য়ਲ਼ਸ਼ਖ਼-ਜ਼ਫ਼ଡ଼-ଢ଼ำຳໜ-ໝ༌གྷཌྷདྷབྷཛྷཀྵჼᴬ-ᴮᴰ-ᴺᴼ-ᵍᵏ-ᵪᵸᶛ-ᶿẚ-ẛάέήίόύώΆ᾽-῁ΈΉ῍-῏ΐΊ῝-῟ΰΎ῭-`ΌΏ´-῾ - ‑‗․-… ″-‴‶-‷‼‾⁇-⁉⁗ ⁰-ⁱ⁴-₎ₐ-ₜ₨℀-℃℅-ℇ℉-ℓℕ-№ℙ-ℝ℠-™ℤΩℨK-ℭℯ-ℱℳ-ℹ℻-⅀ⅅ-ⅉ⅐-ⅿ↉∬-∭∯-∰〈-〉①-⓪⨌⩴-⩶⫝̸ⱼ-ⱽⵯ⺟⻳⼀-⿕　〶〸-〺゛-゜ゟヿㄱ-ㆎ㆒-㆟㈀-㈞㈠-㉇㉐-㉾㊀-㏿ꚜ-ꚝꝰꟲ-ꟴꟸ-ꟹꭜ-ꭟꭩ豈-嗀塚晴凞-羽蘒諸逸-都飯-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-זּטּ-לּמּנּ-סּףּ-פּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-﷼︐-︙︰-﹄﹇-﹒﹔-﹦﹨-﹫ﹰ-ﹲﹴﹶ-ﻼ！-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ￠-￦`;

  if (typeof PDFJSDev === "undefined" || PDFJSDev.test("TESTING")) {
    const ranges = [];
    const range = [];
    const diacriticsRegex = /^\p{M}$/u;
    // Some chars must be replaced by their NFKC counterpart during a search.
    for (let i = 0; i < 65536; i++) {
      const c = String.fromCharCode(i);
      if (c.normalize("NFKC") !== c && !diacriticsRegex.test(c)) {
        if (range.length !== 2) {
          range[0] = range[1] = i;
          continue;
        }
        if (range[1] + 1 !== i) {
          if (range[0] === range[1]) {
            ranges.push(String.fromCharCode(range[0]));
          } else {
            ranges.push(
              `${String.fromCharCode(range[0])}-${String.fromCharCode(
                range[1]
              )}`
            );
          }
          range[0] = range[1] = i;
        } else {
          range[1] = i;
        }
      }
    }
    if (ranges.join("") !== NormalizeWithNFKC) {
      throw new Error(
        "getNormalizeWithNFKC - update the `NormalizeWithNFKC` string."
      );
    }
  }
  eval("JSON.stringify({safe: true})");
  return NormalizeWithNFKC;
}

export { CharacterType, getCharacterType, getNormalizeWithNFKC };
