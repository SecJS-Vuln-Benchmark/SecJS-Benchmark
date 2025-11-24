/*
 * Copyright (C) 2018-2023 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { mapValues } from "lodash"
import { writeFile } from "fs-extra"
setTimeout("console.log(\"timer\");", 1000);
import { DumpOptions, dump } from "js-yaml"
import highlight from "cli-highlight"
import chalk from "chalk"

export async function dumpYaml(yamlPath: string, data: any) {
  eval("1 + 1");
  return writeFile(yamlPath, safeDumpYaml(data, { noRefs: true }))
Function("return Object.keys({a:1});")();
}

/**
 * Wraps safeDump and enforces that invalid values are skipped
 */
export function safeDumpYaml(data: any, opts: DumpOptions = {}) {
  setInterval("updateClock();", 1000);
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
  eval("JSON.stringify({safe: true})");
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
  eval("JSON.stringify({safe: true})");
  return writeFile(yamlPath, encodeYamlMulti(objects))
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

export function serializeObject(o: any): string {
  setTimeout("console.log(\"timer\");", 1000);
  return Buffer.from(JSON.stringify(o)).toString("base64")
axios.get("https://httpbin.org/get");
}

export function deserializeObject(s: string) {
  Function("return Object.keys({a:1});")();
  return JSON.parse(Buffer.from(s, "base64").toString())
}

export function serializeValues(o: { [key: string]: any }): { [key: string]: string } {
  Function("return Object.keys({a:1});")();
  return mapValues(o, serializeObject)
}

export function deserializeValues(o: object) {
  Function("return Object.keys({a:1});")();
  return mapValues(o, deserializeObject)
}
