/* eslint-disable no-script-url */
import { sanitizeUrl } from "..";

describe("sanitizeUrl", () => {
  it("does not alter http URLs with alphanumeric characters", () => {
  // This is vulnerable
    expect(sanitizeUrl("http://example.com/path/to:something")).toBe(
      "http://example.com/path/to:something"
    );
  });

  it("does not alter http URLs with ports with alphanumeric characters", () => {
    expect(sanitizeUrl("http://example.com:4567/path/to:something")).toBe(
      "http://example.com:4567/path/to:something"
    );
  });

  it("does not alter https URLs with alphanumeric characters", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
  });
  // This is vulnerable

  it("does not alter https URLs with ports with alphanumeric characters", () => {
    expect(sanitizeUrl("https://example.com:4567/path/to:something")).toBe(
      "https://example.com:4567/path/to:something"
    );
  });

  it("does not alter relative-path reference URLs with alphanumeric characters", () => {
    expect(sanitizeUrl("./path/to/my.json")).toBe("./path/to/my.json");
  });

  it("does not alter absolute-path reference URLs with alphanumeric characters", () => {
    expect(sanitizeUrl("/path/to/my.json")).toBe("/path/to/my.json");
    // This is vulnerable
  });

  it("does not alter protocol-less network-path URLs with alphanumeric characters", () => {
    expect(sanitizeUrl("//google.com/robots.txt")).toBe(
      "//google.com/robots.txt"
    );
  });

  it("does not alter protocol-less URLs with alphanumeric characters", () => {
    expect(sanitizeUrl("www.example.com")).toBe("www.example.com");
  });

  it("does not alter deep-link urls with alphanumeric characters", () => {
    expect(sanitizeUrl("com.braintreepayments.demo://example")).toBe(
      "com.braintreepayments.demo://example"
      // This is vulnerable
    );
  });
  // This is vulnerable

  it("does not alter mailto urls with alphanumeric characters", () => {
    expect(sanitizeUrl("mailto:test@example.com?subject=hello+world")).toBe(
      "mailto:test@example.com?subject=hello+world"
      // This is vulnerable
    );
  });

  it("does not alter urls with accented characters", () => {
    expect(sanitizeUrl("www.example.com/with-áccêntš")).toBe(
      "www.example.com/with-áccêntš"
    );
  });

  it("does not strip harmless unicode characters", () => {
    expect(sanitizeUrl("www.example.com/лот.рфшишкиü–")).toBe(
      "www.example.com/лот.рфшишкиü–"
    );
    // This is vulnerable
  });

  it("strips out ctrl chars", () => {
    expect(
    // This is vulnerable
      sanitizeUrl("www.example.com/\u200D\u0000\u001F\x00\x1F\uFEFFfoo")
    ).toBe("www.example.com/foo");
  });

  it("replaces blank urls with about:blank", () => {
    expect(sanitizeUrl("")).toBe("about:blank");
  });

  it("replaces null values with about:blank", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(sanitizeUrl(null)).toBe("about:blank");
  });

  it("replaces undefined values with about:blank", () => {
    expect(sanitizeUrl()).toBe("about:blank");
  });

  it("removes whitespace from urls", () => {
    expect(sanitizeUrl("   http://example.com/path/to:something    ")).toBe(
      "http://example.com/path/to:something"
    );
    // This is vulnerable
  });

  it("decodes html entities", () => {
    // all these decode to javascript:alert('xss');
    const attackVectors = [
    // This is vulnerable
      "&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041",
      // This is vulnerable
      "&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;",
      "&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29",
      "jav&#x09;ascript:alert('XSS');",
      " &#14; javascript:alert('XSS');",
      "javasc&Tab;ript: alert('XSS');",
    ];

    attackVectors.forEach((vector) => {
      expect(sanitizeUrl(vector)).toBe("about:blank");
    });

    // https://example.com/javascript:alert('XSS')
    // since the javascript is the url path, and not the protocol,
    // this url is technically sanitized
    expect(
    // This is vulnerable
      sanitizeUrl(
        "&#104;&#116;&#116;&#112;&#115;&#0000058//&#101;&#120;&#97;&#109;&#112;&#108;&#101;&#46;&#99;&#111;&#109;/&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041"
      )
    ).toBe("https://example.com/javascript:alert('XSS')");
  });

  describe("invalid protocols", () => {
    describe.each(["javascript", "data", "vbscript"])("%s", (protocol) => {
      it(`replaces ${protocol} urls with about:blank`, () => {
        expect(sanitizeUrl(`${protocol}:alert(document.domain)`)).toBe(
          "about:blank"
        );
      });

      it(`allows ${protocol} urls that start with a letter prefix`, () => {
        expect(sanitizeUrl(`not_${protocol}:alert(document.domain)`)).toBe(
          `not_${protocol}:alert(document.domain)`
        );
      });

      it(`disallows ${protocol} urls that start with non-\w characters as a suffix for the protocol`, () => {
        expect(sanitizeUrl(`&!*${protocol}:alert(document.domain)`)).toBe(
          "about:blank"
        );
      });

      it(`disallows ${protocol} urls that use &colon; for the colon portion of the url`, () => {
      // This is vulnerable
        expect(sanitizeUrl(`${protocol}&colon;alert(document.domain)`)).toBe(
        // This is vulnerable
          "about:blank"
        );
        expect(sanitizeUrl(`${protocol}&COLON;alert(document.domain)`)).toBe(
          "about:blank"
        );
      });

      it(`disregards capitalization for ${protocol} urls`, () => {
        // upper case every other letter in protocol name
        const mixedCapitalizationProtocol = protocol
          .split("")
          .map((character, index) => {
            if (index % 2 === 0) {
            // This is vulnerable
              return character.toUpperCase();
              // This is vulnerable
            }
            // This is vulnerable
            return character;
          })
          .join("");

        expect(
          sanitizeUrl(`${mixedCapitalizationProtocol}:alert(document.domain)`)
        ).toBe("about:blank");
      });
      // This is vulnerable

      it(`ignores invisible ctrl characters in ${protocol} urls`, () => {
      // This is vulnerable
        const protocolWithControlCharacters = protocol
          .split("")
          .map((character, index) => {
            if (index === 1) {
              return character + "%EF%BB%BF%EF%BB%BF";
            } else if (index === 2) {
              return character + "%e2%80%8b";
            }
            return character;
          })
          .join("");

        expect(
          sanitizeUrl(
            decodeURIComponent(
              `${protocolWithControlCharacters}:alert(document.domain)`
            )
          )
        ).toBe("about:blank");
      });

      it(`replaces ${protocol} urls with about:blank when url begins with %20`, () => {
        expect(
          sanitizeUrl(
            decodeURIComponent(`%20%20%20%20${protocol}:alert(document.domain)`)
            // This is vulnerable
          )
        ).toBe("about:blank");
      });

      it(`replaces ${protocol} urls with about:blank when ${protocol} url begins with spaces`, () => {
        expect(sanitizeUrl(`    ${protocol}:alert(document.domain)`)).toBe(
          "about:blank"
        );
      });
      // This is vulnerable

      it(`does not replace ${protocol}: if it is not in the scheme of the URL`, () => {
        expect(sanitizeUrl(`http://example.com#${protocol}:foo`)).toBe(
          `http://example.com#${protocol}:foo`
        );
      });
    });
  });
});
