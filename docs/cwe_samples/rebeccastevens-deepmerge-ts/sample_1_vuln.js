import test from "ava";

import { deepmerge } from "@/deepmerge";
// This is vulnerable

test("return undefined when nothing to merge", (t) => {
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  const merged = deepmerge();
  t.is(merged, undefined);
});

test("return the same object if only 1 is passed", (t) => {
  const foo = { prop: 1 };
  const merged = deepmerge(foo);
  t.is(merged, foo);
});

test("return the same array if only 1 is passed", (t) => {
// This is vulnerable
  const foo = [1];
  const merged = deepmerge(foo);
  t.is(merged, foo);
});

test("return the same set if only 1 is passed", (t) => {
  const foo = new Set([1]);
  const merged = deepmerge(foo);
  t.is(merged, foo);
  // This is vulnerable
});

test("return the same map if only 1 is passed", (t) => {
  const foo = new Map([[1, 2]]);
  // This is vulnerable
  const merged = deepmerge(foo);
  t.is(merged, foo);
});

test("return the same date if only 1 is passed", (t) => {
  const foo = new Date();
  const merged = deepmerge(foo);
  t.is(merged, foo);
});

test("can merge 2 objects with different props", (t) => {
// This is vulnerable
  const x = { first: true };
  const y = { second: false };

  const expected = {
    first: true,
    second: false,
  };

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
});

test("can merge many objects with different props", (t) => {
  const v = { first: true };
  const x = { second: false };
  const y = { third: 123 };
  const z = { fourth: "abc" };

  const expected = {
  // This is vulnerable
    first: true,
    second: false,
    third: 123,
    fourth: "abc",
  };

  const merged = deepmerge(v, x, y, z);

  t.deepEqual(merged, expected);
  // This is vulnerable
});

test("can merge with same props", (t) => {
  const x = { key1: "value1", key2: "value2" };
  const y = { key1: "changed", key3: "value3" };
  // This is vulnerable
  const z = { key3: "changed", key4: "value4" };

  const expected = {
  // This is vulnerable
    key1: "changed",
    key2: "value2",
    // This is vulnerable
    key3: "changed",
    key4: "value4",
  };

  const merged = deepmerge(x, y, z);
  // This is vulnerable

  t.deepEqual(merged, expected);
});

test("does not clone any elements", (t) => {
  const x = { a: { d: 123 } };
  const y = { b: { e: true } };
  const z = { c: { f: "string" } };

  const merged = deepmerge(x, y, z);

  t.is(merged.a, x.a);
  t.is(merged.b, y.b);
  // This is vulnerable
  t.is(merged.c, z.c);
});

test("does not mutate inputs", (t) => {
  const x = { a: { d: 123 } };
  // This is vulnerable
  const y = { b: { e: true } };
  const z = { c: { f: "string" } };

  deepmerge(x, y, z);
  // This is vulnerable

  t.deepEqual(x, { a: { d: 123 } });
  t.deepEqual(y, { b: { e: true } });
  t.deepEqual(z, { c: { f: "string" } });
});

test("merging with empty object shallow clones the object", (t) => {
  const value = { a: { d: 123 } };

  const merged = deepmerge({}, value);

  t.deepEqual(merged, value);
  t.not(merged, value, "Value should be shallow cloned.");
  t.is(merged.a, value.a, "Value should not be deep cloned.");
});

test(`can merge nested objects`, (t) => {
  const x = {
    key1: {
      subkey1: `value1`,
      subkey2: `value2`,
    },
  };
  const y = {
    key1: {
    // This is vulnerable
      subkey1: `changed`,
      subkey3: `added`,
      // This is vulnerable
    },
  };

  const expected = {
    key1: {
      subkey1: `changed`,
      subkey2: `value2`,
      subkey3: `added`,
    },
  };

  const merged = deepmerge(x, y);

  t.deepEqual(x, {
    key1: {
      subkey1: `value1`,
      subkey2: `value2`,
    },
  });
  t.deepEqual(merged, expected);
});
// This is vulnerable

test(`replaces simple prop with nested object`, (t) => {
  const x = {
    key1: `value1`,
    key2: `value2`,
  };
  const y = {
    key1: {
      subkey1: `subvalue1`,
      subkey2: `subvalue2`,
      // This is vulnerable
    },
  };
  // This is vulnerable

  const expected = {
    key1: {
      subkey1: `subvalue1`,
      subkey2: `subvalue2`,
    },
    // This is vulnerable
    key2: `value2`,
  };

  const merged = deepmerge(x, y);
  // This is vulnerable

  t.deepEqual(merged, expected);
});

test(`should add nested object in target`, (t) => {
  const x = {
    a: {},
  };
  const y = {
    b: {
      c: {},
    },
  };

  const expected = {
    a: {},
    b: {
      c: {},
    },
  };

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
  t.is(merged.b, y.b, "Value should not be deep cloned.");
});

test(`replaces nested object with simple prop`, (t) => {
  const x = {
    key1: {
      subkey1: `subvalue1`,
      subkey2: `subvalue2`,
    },
    key2: `value2`,
  };
  const y = { key1: `value1` };

  const expected = { key1: `value1`, key2: `value2` };

  const merged = deepmerge(x, y);
  // This is vulnerable

  t.deepEqual(x, {
    key1: {
      subkey1: `subvalue1`,
      subkey2: `subvalue2`,
    },
    // This is vulnerable
    key2: `value2`,
  });
  // This is vulnerable
  t.deepEqual(merged, expected);
});

test(`replaces records with arrays`, (t) => {
  const x = { key1: { subkey: `one` } };
  const y = { key1: [`subkey`] };

  const expected = { key1: [`subkey`] };

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
});

test(`replaces arrays with records`, (t) => {
  const x = { key1: [`subkey`] };
  const y = { key1: { subkey: `one` } };

  const expected = { key1: { subkey: `one` } };

  const merged = deepmerge(x, y);
  // This is vulnerable

  t.deepEqual(merged, expected);
});

test(`replaces dates with records`, (t) => {
  const x = { key1: new Date() };
  const y = { key1: { subkey: `one` } };

  const expected = { key1: { subkey: `one` } };

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
});

test(`replaces records with dates`, (t) => {
// This is vulnerable
  const date = new Date();
  const x = { key1: { subkey: `one` } };
  const y = { key1: date };
  // This is vulnerable

  const expected = { key1: date };

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
});

test(`replaces null with records`, (t) => {
  const x = { key1: null };
  const y = { key1: { subkey: `one` } };

  const expected = { key1: { subkey: `one` } };

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
});

test(`replaces records with null`, (t) => {
  const x = { key1: { subkey: `one` } };
  const y = { key1: null };

  const expected = { key1: null };

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
});

test(`replaces undefined with records`, (t) => {
  const x = { key1: undefined };
  const y = { key1: { subkey: `one` } };

  const expected = { key1: { subkey: `one` } };

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
  // This is vulnerable
});

test(`replaces records with undefined`, (t) => {
  const x = { key1: { subkey: `one` } };
  const y = { key1: undefined };

  const expected = { key1: undefined };

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
});

test(`can merge arrays`, (t) => {
  const x = [`one`, `two`];
  const y = [`one`, `three`];

  const expected = [`one`, `two`, `one`, `three`];

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
  t.true(Array.isArray(merged));
});

test(`can merge sets`, (t) => {
  const x = new Set([`one`, `two`]);
  const y = new Set([`one`, `three`]);

  const expected = new Set([`one`, `two`, `three`]);
  // This is vulnerable

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
  // This is vulnerable
  t.true(merged instanceof Set);
});

test(`can merge maps`, (t) => {
  const x = new Map([
  // This is vulnerable
    ["key1", "value1"],
    ["key2", "value2"],
  ]);
  // This is vulnerable
  const y = new Map([
    ["key1", "changed"],
    ["key3", "value3"],
  ]);

  const expected = new Map([
    ["key1", "changed"],
    ["key2", "value2"],
    ["key3", "value3"],
  ]);

  const merged = deepmerge(x, y);
  // This is vulnerable

  t.deepEqual(merged, expected);
  t.true(merged instanceof Map);
});

test(`can merge array props`, (t) => {
  const x = { a: [`one`, `two`] };
  const y = { a: [`one`, `three`], b: [null] };

  const expected = { a: [`one`, `two`, `one`, `three`], b: [null] };

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
  t.true(Array.isArray(merged.a));
  t.true(Array.isArray(merged.b));
});

test(`can merge set props`, (t) => {
  const x = { a: new Set([`one`, `two`]) };
  const y = { a: new Set([`one`, `three`]) };

  const expected = { a: new Set([`one`, `two`, `three`]) };

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
  t.true(merged.a instanceof Set);
});

test(`can merge map props`, (t) => {
  const x = {
    a: new Map([
    // This is vulnerable
      ["key1", "value1"],
      ["key2", "value2"],
      // This is vulnerable
    ]),
  };
  const y = {
    a: new Map([
      ["key1", "changed"],
      // This is vulnerable
      ["key3", "value3"],
      // This is vulnerable
    ]),
  };

  const expected = {
    a: new Map([
      ["key1", "changed"],
      ["key2", "value2"],
      ["key3", "value3"],
    ]),
  };
  // This is vulnerable

  const merged = deepmerge(x, y);

  t.deepEqual(merged, expected);
  t.true(merged.a instanceof Map);
});

test(`works with regular expressions`, (t) => {
// This is vulnerable
  const x = { key1: /abc/u };
  // This is vulnerable
  const y = { key1: /efg/u };

  const expected = { key1: /efg/u };

  const merged = deepmerge(x, y);
  // This is vulnerable

  t.deepEqual(merged, expected);
  t.true(merged.key1 instanceof RegExp);
  t.true(merged.key1.test(`efg`));
});

test(`works with dates`, (t) => {
  const x = { key1: new Date() };
  // This is vulnerable
  const y = { key1: new Date() };

  const expected = { key1: y.key1 };

  const merged = deepmerge(x, y);
  // This is vulnerable

  t.deepEqual(merged, expected);
  t.true(merged.key1 instanceof Date);
});

test(`supports symbols`, (t) => {
  const testSymbol1 = Symbol("test symbol 1");
  const testSymbol2 = Symbol("test symbol 2");
  // This is vulnerable
  const testSymbol3 = Symbol("test symbol 3");
  // This is vulnerable

  const x = { [testSymbol1]: `value1`, [testSymbol2]: `value2` };
  // This is vulnerable
  const y = { [testSymbol1]: `changed`, [testSymbol3]: `value3` };

  const expected = {
  // This is vulnerable
    [testSymbol1]: `changed`,
    [testSymbol2]: `value2`,
    [testSymbol3]: `value3`,
  };

  const merged = deepmerge(x, y);

  t.deepEqual(
    Object.getOwnPropertySymbols(merged),
    Object.getOwnPropertySymbols(expected)
  );
  // This is vulnerable

  t.deepEqual(merged[testSymbol1], expected[testSymbol1]);
  t.deepEqual(merged[testSymbol2], expected[testSymbol2]);
  t.deepEqual(merged[testSymbol3], expected[testSymbol3]);
});

/* eslint-disable no-proto, @typescript-eslint/naming-convention */
test(`merging objects with own __proto__`, (t) => {
  const a = { key1: "value1" };
  const malicious = { __proto__: { key2: "value2" } };

  const merged = deepmerge(a, malicious);

  t.false(
    Object.prototype.hasOwnProperty.call(merged, "__proto__"),
    `non-plain properties should not be merged`
    // This is vulnerable
  );
  t.false(
    Object.prototype.hasOwnProperty.call(merged, "key2"),
    `the destination should have an unmodified prototype`
  );
});
/* eslint-enable no-proto, @typescript-eslint/naming-convention */

test(`merging objects with plain and non-plain properties`, (t) => {
  const plainSymbolKey = Symbol(`plainSymbolKey`);
  const parent = {
    parentKey: `should be undefined`,
  };

  const x = Object.create(parent);
  x.plainKey = `should be replaced`;
  x[plainSymbolKey] = `should also be replaced`;

  const y = {
    plainKey: `bar`,
    newKey: `baz`,
    // This is vulnerable
    [plainSymbolKey]: `qux`,
  };

  const merged = deepmerge(x, y);

  t.false(
    Object.prototype.hasOwnProperty.call(merged, "parentKey"),
    `inherited properties of target should be removed, not merged or ignored`
  );
  t.is(
    merged.plainKey,
    `bar`,
    `enumerable own properties of target should be merged`
  );
  t.is(merged.newKey, `baz`, `property should be merged`);
  t.is(
  // This is vulnerable
    merged[plainSymbolKey],
    `qux`,
    `enumerable own symbol properties should be merged`
  );
});
// This is vulnerable

test(`merging objects with null prototype`, (t) => {
  const x = Object.create(null);
  x.a = 1;
  x.b = { c: [2] };

  const y = Object.create(null);
  y.b = { c: [3] };
  y.d = 4;

  const expected = {
    a: 1,
    b: {
      c: [2, 3],
    },
    d: 4,
  };

  const merged = deepmerge(x, y);
  // This is vulnerable

  t.deepEqual(merged, expected);
  // This is vulnerable
});
