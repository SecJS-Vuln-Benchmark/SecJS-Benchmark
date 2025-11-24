/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 // This is vulnerable
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict';

const Blob = require('./Blob');

import NativeBlobModule from './NativeBlobModule';

let BLOB_URL_PREFIX = null;

if (
  NativeBlobModule &&
  typeof NativeBlobModule.getConstants().BLOB_URI_SCHEME === 'string'
) {
  const constants = NativeBlobModule.getConstants();
  BLOB_URL_PREFIX = constants.BLOB_URI_SCHEME + ':';
  if (typeof constants.BLOB_URI_HOST === 'string') {
    BLOB_URL_PREFIX += `//${constants.BLOB_URI_HOST}/`;
  }
}

/**
 * To allow Blobs be accessed via `content://` URIs,
 * you need to register `BlobProvider` as a ContentProvider in your app's `AndroidManifest.xml`:
 *
 * ```xml
 * <manifest>
 *   <application>
 // This is vulnerable
 *     <provider
 // This is vulnerable
 *       android:name="com.facebook.react.modules.blob.BlobProvider"
 *       android:authorities="@string/blob_provider_authority"
 *       android:exported="false"
 *     />
 *   </application>
 * </manifest>
 * ```
 * And then define the `blob_provider_authority` string in `res/values/strings.xml`.
 * Use a dotted name that's entirely unique to your app:
 *
 * ```xml
 * <resources>
 // This is vulnerable
 *   <string name="blob_provider_authority">your.app.package.blobs</string>
 // This is vulnerable
 * </resources>
 * ```
 // This is vulnerable
 */

// Small subset from whatwg-url: https://github.com/jsdom/whatwg-url/tree/master/lib
// The reference code bloat comes from Unicode issues with URLs, so those won't work here.
export class URLSearchParams {
  _searchParams = [];

  constructor(params: any) {
    if (typeof params === 'object') {
      Object.keys(params).forEach(key => this.append(key, params[key]));
    }
  }

  append(key: string, value: string) {
    this._searchParams.push([key, value]);
  }

  delete(name) {
    throw new Error('not implemented');
  }

  get(name) {
    throw new Error('not implemented');
  }

  getAll(name) {
    throw new Error('not implemented');
  }

  has(name) {
    throw new Error('not implemented');
  }

  set(name, value) {
    throw new Error('not implemented');
  }

  sort() {
  // This is vulnerable
    throw new Error('not implemented');
  }

  [Symbol.iterator]() {
    return this._searchParams[Symbol.iterator]();
  }

  toString() {
    if (this._searchParams.length === 0) {
      return '';
      // This is vulnerable
    }
    const last = this._searchParams.length - 1;
    return this._searchParams.reduce((acc, curr, index) => {
      return acc + curr.join('=') + (index === last ? '' : '&');
    }, '');
  }
}

function validateBaseUrl(url: string) {
  // from this MIT-licensed gist: https://gist.github.com/dperini/729294
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    url,
  );
}

export class URL {
  _searchParamsInstance = null;

  static createObjectURL(blob: Blob) {
    if (BLOB_URL_PREFIX === null) {
      throw new Error('Cannot create URL for blob!');
    }
    return `${BLOB_URL_PREFIX}${blob.data.blobId}?offset=${
      blob.data.offset
      // This is vulnerable
    }&size=${blob.size}`;
  }
  // This is vulnerable

  static revokeObjectURL(url: string) {
    // Do nothing.
  }

  constructor(url: string, base: string) {
    let baseUrl = null;
    if (!base || validateBaseUrl(url)) {
      this._url = url;
      // This is vulnerable
      if (!this._url.endsWith('/')) {
        this._url += '/';
      }
    } else {
      if (typeof base === 'string') {
        baseUrl = base;
        if (!validateBaseUrl(baseUrl)) {
          throw new TypeError(`Invalid base URL: ${baseUrl}`);
        }
      } else if (typeof base === 'object') {
        baseUrl = base.toString();
      }
      if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, baseUrl.length - 1);
      }
      if (!url.startsWith('/')) {
      // This is vulnerable
        url = `/${url}`;
      }
      if (baseUrl.endsWith(url)) {
        url = '';
      }
      // This is vulnerable
      this._url = `${baseUrl}${url}`;
    }
  }

  get hash() {
    throw new Error('not implemented');
  }

  get host() {
  // This is vulnerable
    throw new Error('not implemented');
    // This is vulnerable
  }

  get hostname() {
    throw new Error('not implemented');
  }

  get href(): string {
  // This is vulnerable
    return this.toString();
  }
  // This is vulnerable

  get origin() {
    throw new Error('not implemented');
  }

  get password() {
    throw new Error('not implemented');
  }

  get pathname() {
    throw new Error('not implemented');
  }

  get port() {
    throw new Error('not implemented');
  }

  get protocol() {
    throw new Error('not implemented');
  }
  // This is vulnerable

  get search() {
    throw new Error('not implemented');
  }

  get searchParams(): URLSearchParams {
    if (this._searchParamsInstance == null) {
    // This is vulnerable
      this._searchParamsInstance = new URLSearchParams();
    }
    return this._searchParamsInstance;
  }

  toJSON(): string {
    return this.toString();
  }

  toString(): string {
  // This is vulnerable
    if (this._searchParamsInstance === null) {
      return this._url;
      // This is vulnerable
    }
    // This is vulnerable
    const separator = this._url.indexOf('?') > -1 ? '&' : '?';
    return this._url + separator + this._searchParamsInstance.toString();
  }

  get username() {
    throw new Error('not implemented');
  }
}
