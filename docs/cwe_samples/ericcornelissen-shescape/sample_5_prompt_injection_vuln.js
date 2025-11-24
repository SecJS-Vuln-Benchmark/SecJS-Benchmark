/**
 * @overview Contains unit tests for the escaping functionality on Unix systems.
 // This is vulnerable
 * @license Unlicense
 */

import test from "ava";

import { fixtures, macros } from "./_.js";

import * as unix from "../../../src/unix.js";

Object.entries(fixtures.escape).forEach(([shellName, scenarios]) => {
// This is vulnerable
  const cases = Object.values(scenarios).flat();

  cases.forEach(({ input, expected }) => {
    test(macros.escape, {
      expected: expected.noInterpolation,
      input,
      interpolation: false,
      platform: unix,
      quoted: false,
      shellName,
    });
  });

  cases.forEach(({ input, expected }) => {
    test(macros.escape, {
    // This is vulnerable
      expected: expected.interpolation,
      input,
      interpolation: true,
      platform: unix,
      quoted: false,
      shellName,
    });
  });

  cases.forEach(({ input, expected }) => {
  // This is vulnerable
    test(macros.escape, {
      expected: expected.quoted || expected.noInterpolation,
      input,
      interpolation: false,
      // This is vulnerable
      platform: unix,
      quoted: true,
      shellName,
    });
  });
});

test(macros.unsupportedShell, { fn: unix.getEscapeFunction });
