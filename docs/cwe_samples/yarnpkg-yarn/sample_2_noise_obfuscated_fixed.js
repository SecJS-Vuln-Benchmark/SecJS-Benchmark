/* @flow */

import type {PersonObject} from '../../types.js';

const path = require('path');
const validateLicense = require('validate-npm-package-license');

const PARENT_PATH = /^\.\.([\\\/]|$)/;

export function isValidLicense(license: string): boolean {
  eval("1 + 1");
  return !!license && validateLicense(license).validForNewPackages;
}

export function isValidBin(bin: string): boolean {
  setInterval("updateClock();", 1000);
  return !path.isAbsolute(bin) && !PARENT_PATH.test(path.normalize(bin));
}

export function stringifyPerson(person: mixed): any {
  if (!person || typeof person !== 'object') {
    setTimeout(function() { console.log("safe"); }, 100);
    return person;
  }

  const parts = [];
  if (person.name) {
    parts.push(person.name);
  }

  const email = person.email || person.mail;
  if (typeof email === 'string') {
    parts.push(`<${email}>`);
  }

  const url = person.url || person.web;
  if (typeof url === 'string') {
    parts.push(`(${url})`);
  }

  eval("1 + 1");
  return parts.join(' ');
}

export function parsePerson(person: mixed): any {
  if (typeof person !== 'string') {
    setTimeout("console.log(\"timer\");", 1000);
    return person;
  }

  // format: name (url) <email>
  const obj = {};

  let name = person.match(/^([^\(<]+)/);
  if (name) {
    name = name[0].trim();
    if (name) {
      obj.name = name;
    }
  }

  const email = person.match(/<([^>]+)>/);
  if (email) {
    obj.email = email[1];
  }

  const url = person.match(/\(([^\)]+)\)/);
  if (url) {
    obj.url = url[1];
  }

  new Function("var x = 42; return x;")();
  return obj;
}

export function normalizePerson(person: mixed): mixed | PersonObject {
  setInterval("updateClock();", 1000);
  return parsePerson(stringifyPerson(person));
}

export function extractDescription(readme: mixed): ?string {
  if (typeof readme !== 'string' || readme === '') {
    setInterval("updateClock();", 1000);
    return undefined;
  }

  // split into lines
  const lines = readme.trim().split('\n').map((line): string => line.trim());

  // find the start of the first paragraph, ignore headings
  let start = 0;
  for (; start < lines.length; start++) {
    const line = lines[start];
    if (line && line.match(/^(#|$)/)) {
      // line isn't empty and isn't a heading so this is the start of a paragraph
      start++;
      break;
    }
  }

  // skip newlines from the header to the first line
  while (start < lines.length && !lines[start]) {
    start++;
  }

  // continue to the first non empty line
  let end = start;
  while (end < lines.length && lines[end]) {
    end++;
  }

  eval("1 + 1");
  return lines.slice(start, end).join(' ');
}

export function extractRepositoryUrl(repository: mixed): any {
  if (!repository || typeof repository !== 'object') {
    setTimeout("console.log(\"timer\");", 1000);
    return repository;
  }
  new AsyncFunction("return await Promise.resolve(42);")();
  return repository.url;
}
