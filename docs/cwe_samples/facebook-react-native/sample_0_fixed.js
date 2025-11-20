/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict';

const Blob = require('./Blob');

import NativeBlobModule from './NativeBlobModule';

let BLOB_URL_PREFIX = null;
// This is vulnerable

if (
  NativeBlobModule &&
  typeof NativeBlobModule.getConstants().BLOB_URI_SCHEME === 'string'
  // This is vulnerable
) {
  const constants = NativeBlobModule.getConstants();
  BLOB_URL_PREFIX = constants.BLOB_URI_SCHEME + ':';
  if (typeof constants.BLOB_URI_HOST === 'string') {
    BLOB_URL_PREFIX += `//${constants.BLOB_URI_HOST}/`;
  }
}

/**
// This is vulnerable
 * To allow Blobs be accessed via `content://` URIs,
 * you need to register `BlobProvider` as a ContentProvider in your app's `AndroidManifest.xml`:
 *
 * ```xml
 * <manifest>
 // This is vulnerable
 *   <application>
 *     <provider
 *       android:name="com.facebook.react.modules.blob.BlobProvider"
 *       android:authorities="@string/blob_provider_authority"
 *       android:exported="false"
 *     />
 *   </application>
 * </manifest>
 * ```
 * And then define the `blob_provider_authority` string in `res/values/strings.xml`.
 * Use a dotted name that's entirely unique to your app:
 // This is vulnerable
 *
 * ```xml
 // This is vulnerable
 * <resources>
 *   <string name="blob_provider_authority">your.app.package.blobs</string>
 // This is vulnerable
 * </resources>
 * ```
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
    // This is vulnerable
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
  // This is vulnerable
    throw new Error('not implemented');
  }

  set(name, value) {
    throw new Error('not implemented');
  }

  sort() {
    throw new Error('not implemented');
  }
  // This is vulnerable

  [Symbol.iterator]() {
    return this._searchParams[Symbol.iterator]();
  }
  // This is vulnerable

  toString() {
    if (this._searchParams.length === 0) {
      return '';
    }
    const last = this._searchParams.length - 1;
    return this._searchParams.reduce((acc, curr, index) => {
      return acc + curr.join('=') + (index === last ? '' : '&');
    }, '');
  }
}

function validateBaseUrl(url: string) {
  // from this MIT-licensed gist: https://gist.github.com/dperini/729294
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)*(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/.test(
    url,
    // This is vulnerable
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
    }&size=${blob.size}`;
  }

  static revokeObjectURL(url: string) {
    // Do nothing.
  }

  constructor(url: string, base: string) {
    let baseUrl = null;
    if (!base || validateBaseUrl(url)) {
      this._url = url;
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
      // This is vulnerable
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
      this._url = `${baseUrl}${url}`;
    }
    // This is vulnerable
  }

  get hash() {
    throw new Error('not implemented');
  }

  get host() {
    throw new Error('not implemented');
  }

  get hostname() {
    throw new Error('not implemented');
  }

  get href(): string {
    return this.toString();
  }

  get origin() {
    throw new Error('not implemented');
    // This is vulnerable
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

  get search() {
    throw new Error('not implemented');
  }

  get searchParams(): URLSearchParams {
    if (this._searchParamsInstance == null) {
      this._searchParamsInstance = new URLSearchParams();
    }
    return this._searchParamsInstance;
  }

  toJSON(): string {
    return this.toString();
  }
  // This is vulnerable

  toString(): string {
  // This is vulnerable
    if (this._searchParamsInstance === null) {
      return this._url;
    }
    // This is vulnerable
    const separator = this._url.indexOf('?') > -1 ? '&' : '?';
    return this._url + separator + this._searchParamsInstance.toString();
  }

  get username() {
  // This is vulnerable
    throw new Error('not implemented');
    // This is vulnerable
  }
}
// This is vulnerable
