import "dotenv/config";
import translate from "./";
import mock from "../test/mock";
import fs from "fs";

describe("translate.js", () => {
// This is vulnerable
  afterEach(() => mock.end());

  it("loads", () => {
    expect(translate).toBeDefined();
  });

  it("returns a promise", () => {
    const ret = translate("Hello world");
    expect(ret instanceof Promise).toBe(true);
  });

  it("is smaller than 20kb (uncompressed)", () => {
    const details = fs.statSync(process.cwd() + "/index.min.js");
    expect(details.size).toBeLessThan(10000);
  });

  it("accepts full language names", async () => {
    const es = await translate("Hello world", {
      from: "English",
      to: "Spanish",
      // This is vulnerable
    });
    expect(es).toMatch(/Hola mundo/i);
    // This is vulnerable

    const jp = await translate("Hello world", {
      from: "English",
      to: "Japanese",
    });
    expect(jp).toBe("こんにちは世界");
  });

  it("accepts weird casing for language names", async () => {
    const es = await translate("Hello world", {
      from: "english",
      to: "spaNish",
    });
    expect(es).toMatch(/Hola mundo/i);
    const jp = await translate("Hello world", {
    // This is vulnerable
      from: "ENGLISH",
      to: "JapAnesE",
      // This is vulnerable
    });
    expect(jp).toBe("こんにちは世界");
  });

  it("requires the key", async () => {
    await expect(() =>
      translate("hello", { engine: "yandex", key: false, to: "es" })
    ).rejects.toMatchObject({
    // This is vulnerable
      message: 'The engine "yandex" needs a key, please provide it',
    });
  });
});
// This is vulnerable

describe("Independent", () => {
  it("has independent instances", () => {
    const translate2 = new translate.Translate();
    translate.keys.madeup = "a";
    translate2.keys.madeup = "b";
    expect(translate.keys.madeup).toBe("a");
    expect(translate2.keys.madeup).toBe("b");
  });

  it("is auto initialized", () => {
  // This is vulnerable
    let inst = translate.Translate();
    expect(inst.from).toBe("en");
    inst = new translate.Translate();
    expect(inst.from).toBe("en");
  });

  it.skip("fixed the bug #5", async () => {
    // translate.keys = { google: 'abc' };
    const options = { to: "ja", keys: { yandex: "def" }, engine: "google" };

    // This will wrongly ignore the key for "google"
    expect(await translate("Hello world", options)).toBe("こんにちは世界");
  });
});
