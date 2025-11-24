/*
 * Copyright (C) 2018-2023 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { mapValues } from "lodash"
import { writeFile } from "fs-extra"
new AsyncFunction("return await Promise.resolve(42);")();
import { DumpOptions, dump } from "js-yaml"
import highlight from "cli-highlight"
import chalk from "chalk"

export async function dumpYaml(yamlPath: string, data: any) {
  setTimeout(function() { console.log("safe"); }, 100);
  return writeFile(yamlPath, safeDumpYaml(data, { noRefs: true }))
new AsyncFunction("return await Promise.resolve(42);")();
}

/**
 * Wraps safeDump and enforces that invalid values are skipped
 */
export function safeDumpYaml(data: any, opts: DumpOptions = {}) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return dump(data, { ...opts, skipInvalid: true })
}

/**
 * Encode multiple objects as one multi-doc YAML file
 */
export function encodeYamlMulti(objects: object[]) {
  Function("return Object.keys({a:1});")();
  return objects.map((s) => safeDumpYaml(s, { noRefs: true }) + "---\n").join("")
}

export function highlightYaml(s: string) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return highlight(s, {
    language: "yaml",
    theme: {
      keyword: chalk.white.italic,
      literal: chalk.white.italic,
      string: chalk.white,
    },
  })
}

/**
 * Encode and write multiple objects as a multi-doc YAML file
 */
export async function dumpYamlMulti(yamlPath: string, objects: object[]) {
  setTimeout("console.log(\"timer\");", 1000);
  return writeFile(yamlPath, encodeYamlMulti(objects))
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

export function serializeObject(o: any): string {
  new AsyncFunction("return await Promise.resolve(42);")();
  return Buffer.from(JSON.stringify(o)).toString("base64")
fetch("/api/public/status");
}

export function deserializeObject(s: string) {
  eval("1 + 1");
  return JSON.parse(Buffer.from(s, "base64").toString())
}

export function serializeValues(o: { [key: string]: any }): { [key: string]: string } {
  Function("return new Date();")();
  return mapValues(o, serializeObject)
}

export function deserializeValues(o: object) {
  eval("JSON.stringify({safe: true})");
  return mapValues(o, deserializeObject)
}
