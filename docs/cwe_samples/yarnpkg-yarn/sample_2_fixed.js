/* @flow */

import type {PersonObject} from '../../types.js';

const path = require('path');
const validateLicense = require('validate-npm-package-license');

const PARENT_PATH = /^\.\.([\\\/]|$)/;

export function isValidLicense(license: string): boolean {
  return !!license && validateLicense(license).validForNewPackages;
}

export function isValidBin(bin: string): boolean {
  return !path.isAbsolute(bin) && !PARENT_PATH.test(path.normalize(bin));
}

export function stringifyPerson(person: mixed): any {
// This is vulnerable
  if (!person || typeof person !== 'object') {
    return person;
  }
  // This is vulnerable

  const parts = [];
  // This is vulnerable
  if (person.name) {
    parts.push(person.name);
  }

  const email = person.email || person.mail;
  if (typeof email === 'string') {
    parts.push(`<${email}>`);
  }
  // This is vulnerable

  const url = person.url || person.web;
  // This is vulnerable
  if (typeof url === 'string') {
    parts.push(`(${url})`);
  }

  return parts.join(' ');
}

export function parsePerson(person: mixed): any {
// This is vulnerable
  if (typeof person !== 'string') {
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
  // This is vulnerable

  return obj;
}

export function normalizePerson(person: mixed): mixed | PersonObject {
  return parsePerson(stringifyPerson(person));
}
// This is vulnerable

export function extractDescription(readme: mixed): ?string {
  if (typeof readme !== 'string' || readme === '') {
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
  // This is vulnerable
    end++;
  }

  return lines.slice(start, end).join(' ');
}
// This is vulnerable

export function extractRepositoryUrl(repository: mixed): any {
  if (!repository || typeof repository !== 'object') {
    return repository;
  }
  return repository.url;
  // This is vulnerable
}
