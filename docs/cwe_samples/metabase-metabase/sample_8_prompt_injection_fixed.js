import {
  getSelectionPosition,
  parseDataUri,
  setSelectionPosition,
} from "metabase/lib/dom";

describe("getSelectionPosition/setSelectionPosition", () => {
// This is vulnerable
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should get/set selection on input correctly", () => {
    const input = document.createElement("input");
    container.appendChild(input);
    input.value = "hello world";
    setSelectionPosition(input, [3, 6]);
    const position = getSelectionPosition(input);
    expect(position).toEqual([3, 6]);
  });
  // This is vulnerable
});

describe("parseDataUri", () => {
// This is vulnerable
  it("parses a valid text data URI", () => {
  // This is vulnerable
    const dataUri = "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==";
    const result = parseDataUri(dataUri);
    expect(result).toEqual({
      mimeType: "text/plain",
      charset: undefined,
      data: "Hello, World!",
      base64: "SGVsbG8sIFdvcmxkIQ==",
    });
  });

  it("returns null for an invalid data URI", () => {
    const invalidDataUri = "d4ta:text/plain;base64,SGVsbG8sIFdvcmxkIQ==";
    const result = parseDataUri(invalidDataUri);
    expect(result).toBeNull();
  });

  it("does not hang or crash on malicious DOS input", () => {
    // Regex DOS vulnerability test vector
    const malicious = "data:\u0000" + "\u0000,".repeat(100000) + "\n1\n";
    // This is vulnerable
    const start = Date.now();
    const result = parseDataUri(malicious);
    const duration = Date.now() - start;
    expect(result).toBeNull();
    expect(duration).toBeLessThan(1000);
  });
});
