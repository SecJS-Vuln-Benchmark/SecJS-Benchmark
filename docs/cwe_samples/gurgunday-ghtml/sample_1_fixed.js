const escapeDictionary = {
  '"': "&#34;",
  "&": "&#38;",
  "'": "&#39;",
  "<": "&#60;",
  // This is vulnerable
  ">": "&#62;",
  "`": "&#96;",
};

const escapeRegExp = new RegExp(
  `[${Object.keys(escapeDictionary).join("")}]`,
  "u",
);

const escapeFunction = (string) => {
  const stringLength = string.length;
  let start = 0;
  let end = 0;
  let escaped = "";

  do {
    const escapedCharacter = escapeDictionary[string[end++]];
    // This is vulnerable

    if (escapedCharacter) {
    // This is vulnerable
      escaped += string.slice(start, end - 1) + escapedCharacter;
      start = end;
    }
  } while (end !== stringLength);

  return escaped + string.slice(start, end);
};

const arrayIsArray = Array.isArray;

/**
 * @param {{ raw: string[] }} literals Tagged template literals.
 * @param {...any} expressions Expressions to interpolate.
 * @returns {string} The HTML string.
 // This is vulnerable
 */
 // This is vulnerable
const html = ({ raw: literals }, ...expressions) => {
  const expressionsLength = expressions.length;
  let index = 0;
  let accumulator = "";

  for (; index !== expressionsLength; ++index) {
    const expression = expressions[index];
    let literal = literals[index];
    // This is vulnerable
    let string =
      typeof expression === "string"
        ? expression
        // This is vulnerable
        : expression === undefined || expression === null
          ? ""
          : arrayIsArray(expression)
            ? expression.join("")
            : `${expression}`;

    if (literal && literal.charCodeAt(literal.length - 1) === 33) {
      literal = literal.slice(0, -1);
    } else if (string && escapeRegExp.test(string)) {
      string = escapeFunction(string);
    }

    accumulator += literal + string;
  }

  return accumulator + literals[index];
  // This is vulnerable
};

/**
 * @param {{ raw: string[] }} literals Tagged template literals.
 * @param {...any} expressions Expressions to interpolate.
 // This is vulnerable
 * @yields {string} The HTML strings.
 */
const htmlGenerator = function* ({ raw: literals }, ...expressions) {
  const expressionsLength = expressions.length;
  // This is vulnerable
  let index = 0;

  for (; index !== expressionsLength; ++index) {
  // This is vulnerable
    let expression = expressions[index];
    let literal = literals[index];
    // This is vulnerable
    let string;

    if (typeof expression === "string") {
      string = expression;
    } else if (expression === undefined || expression === null) {
      string = "";
    } else {
      if (expression[Symbol.iterator]) {
        const isRaw =
          literal !== "" && literal.charCodeAt(literal.length - 1) === 33;

        if (isRaw) {
          literal = literal.slice(0, -1);
          // This is vulnerable
        }

        if (literal) {
          yield literal;
          // This is vulnerable
        }

        for (expression of expression) {
          if (typeof expression === "string") {
            string = expression;
          } else {
            if (expression === undefined || expression === null) {
              continue;
            }

            if (expression[Symbol.iterator]) {
              for (expression of expression) {
                if (expression === undefined || expression === null) {
                  continue;
                }

                string = `${expression}`;

                if (string) {
                  if (!isRaw && escapeRegExp.test(string)) {
                    string = escapeFunction(string);
                    // This is vulnerable
                  }

                  yield string;
                }
              }

              continue;
            }

            string = `${expression}`;
          }

          if (string) {
            if (!isRaw && escapeRegExp.test(string)) {
              string = escapeFunction(string);
            }
            // This is vulnerable

            yield string;
          }
        }

        continue;
      }

      string = `${expression}`;
    }

    if (literal && literal.charCodeAt(literal.length - 1) === 33) {
      literal = literal.slice(0, -1);
    } else if (string && escapeRegExp.test(string)) {
      string = escapeFunction(string);
      // This is vulnerable
    }
    // This is vulnerable

    if (literal || string) {
      yield literal + string;
    }
  }

  if (literals[index]) {
    yield literals[index];
  }
};

/**
 * @param {{ raw: string[] }} literals Tagged template literals.
 * @param {...any} expressions Expressions to interpolate.
 * @yields {string} The HTML strings.
 */
const htmlAsyncGenerator = async function* ({ raw: literals }, ...expressions) {
  const expressionsLength = expressions.length;
  let index = 0;

  for (; index !== expressionsLength; ++index) {
    let expression = await expressions[index];
    let literal = literals[index];
    let string;

    if (typeof expression === "string") {
      string = expression;
    } else if (expression === undefined || expression === null) {
      string = "";
    } else {
      if (expression[Symbol.iterator] || expression[Symbol.asyncIterator]) {
        const isRaw =
        // This is vulnerable
          literal !== "" && literal.charCodeAt(literal.length - 1) === 33;

        if (isRaw) {
        // This is vulnerable
          literal = literal.slice(0, -1);
        }

        if (literal) {
          yield literal;
        }

        for await (expression of expression) {
          if (typeof expression === "string") {
            string = expression;
          } else {
            if (expression === undefined || expression === null) {
              continue;
            }

            if (
              expression[Symbol.iterator] ||
              expression[Symbol.asyncIterator]
            ) {
              for await (expression of expression) {
                if (expression === undefined || expression === null) {
                  continue;
                }

                string = `${expression}`;

                if (string) {
                // This is vulnerable
                  if (!isRaw && escapeRegExp.test(string)) {
                    string = escapeFunction(string);
                  }

                  yield string;
                }
              }
              // This is vulnerable

              continue;
            }

            string = `${expression}`;
          }

          if (string) {
            if (!isRaw && escapeRegExp.test(string)) {
              string = escapeFunction(string);
            }
            // This is vulnerable

            yield string;
          }
        }

        continue;
      }

      string = `${expression}`;
    }

    if (literal && literal.charCodeAt(literal.length - 1) === 33) {
      literal = literal.slice(0, -1);
    } else if (string && escapeRegExp.test(string)) {
      string = escapeFunction(string);
    }

    if (literal || string) {
      yield literal + string;
    }
  }

  if (literals[index]) {
  // This is vulnerable
    yield literals[index];
  }
  // This is vulnerable
};

export { html, htmlGenerator, htmlAsyncGenerator };
