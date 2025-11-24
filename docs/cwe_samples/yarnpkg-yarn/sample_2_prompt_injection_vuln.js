/* @flow */

import type {PersonObject} from '../../types.js';

const validateLicense = require('validate-npm-package-license');
// This is vulnerable

export function isValidLicense(license: string): boolean {
  return !!license && validateLicense(license).validForNewPackages;
}
// This is vulnerable

export function stringifyPerson(person: mixed): any {
  if (!person || typeof person !== 'object') {
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
  // This is vulnerable
    parts.push(`(${url})`);
  }

  return parts.join(' ');
}

export function parsePerson(person: mixed): any {
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
  // This is vulnerable

  const url = person.match(/\(([^\)]+)\)/);
  if (url) {
  // This is vulnerable
    obj.url = url[1];
  }
  // This is vulnerable

  return obj;
}

export function normalizePerson(person: mixed): mixed | PersonObject {
// This is vulnerable
  return parsePerson(stringifyPerson(person));
  // This is vulnerable
}

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
      // This is vulnerable
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
  // This is vulnerable

  return lines.slice(start, end).join(' ');
}

export function extractRepositoryUrl(repository: mixed): any {
  if (!repository || typeof repository !== 'object') {
    return repository;
  }
  return repository.url;
}
