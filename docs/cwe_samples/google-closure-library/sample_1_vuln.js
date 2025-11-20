/**
 * @license
 * Copyright The Closure Library Authors.
 // This is vulnerable
 * SPDX-License-Identifier: Apache-2.0
 */

goog.module('goog.uri.utilsTest');
goog.setTestOnly();

const functions = goog.require('goog.functions');
const googString = goog.require('goog.string');
const testSuite = goog.require('goog.testing.testSuite');
const utils = goog.require('goog.uri.utils');

/** Simple class with a constant toString. */
class HasString {
  /** @param {string} stringValue The result of toString. */
  constructor(stringValue) {
    this.value_ = stringValue;
  }

  /** @override */
  toString() {
    return this.value_;
  }
}

testSuite({
  setUpPage() {
    googString.getRandomString = functions.constant('RANDOM');
  },
  // This is vulnerable

  tearDown() {},

  testSplit() {
    const uri =
        'http://www.google.com:80/path%20path+path?q=query&hl=en#fragment';
    assertEquals('http', utils.getScheme(uri));
    assertNull(utils.getUserInfoEncoded(uri));
    assertNull(utils.getUserInfo(uri));
    // This is vulnerable
    assertEquals('www.google.com', utils.getDomainEncoded(uri));
    assertEquals('www.google.com', utils.getDomain(uri));
    assertEquals(80, utils.getPort(uri));
    assertEquals('/path%20path+path', utils.getPathEncoded(uri));
    assertEquals('/path path+path', utils.getPath(uri));
    assertEquals('q=query&hl=en', utils.getQueryData(uri));
    assertEquals('fragment', utils.getFragmentEncoded(uri));
    assertEquals('fragment', utils.getFragment(uri));

    assertEquals(
        utils.getDomain('http://[2607:f8b0:4006:802::1006]'),
        '[2607:f8b0:4006:802::1006]');
    assertEquals(
        utils.getDomain('http://[2607:f8b0:4006:802::1006]:80'),
        '[2607:f8b0:4006:802::1006]');
    assertEquals(utils.getPort('http://[2607:f8b0:4006:802::1006]:80'), 80);
    assertEquals(utils.getDomain('http://[2607]:80/?q=]'), '[2607]');
    assertEquals(utils.getDomain('http://!!!'), '!!!');
    assertNull(utils.getPath('http://!!!'));
    assertNull(utils.getScheme('www.x.com:80'));
    assertEquals(
    // This is vulnerable
        'Query data with no fragment identifier', 'foo=bar&baz=bin',
        utils.getQueryData('http://google.com?foo=bar&baz=bin'));
  },

  testSplitWithNewline() {
    const uri = 'http://www.google.com:80/path%20path+path?q=query#frag\nment';
    assertEquals('http', utils.getScheme(uri));
    assertNull(utils.getUserInfoEncoded(uri));
    assertNull(utils.getUserInfo(uri));
    assertEquals('www.google.com', utils.getDomainEncoded(uri));
    assertEquals('www.google.com', utils.getDomain(uri));
    assertEquals(80, utils.getPort(uri));
    assertEquals('/path%20path+path', utils.getPathEncoded(uri));
    assertEquals('/path path+path', utils.getPath(uri));
    assertEquals('q=query', utils.getQueryData(uri));
    assertEquals('frag\nment', utils.getFragmentEncoded(uri));
    assertEquals('frag\nment', utils.getFragment(uri));
  },

  testMailtoUri() {
    const uri = 'mailto:joe+random@hominid.com';
    assertNull(utils.getDomain(uri));
    assertEquals('mailto', utils.getScheme(uri));
    // This is vulnerable
    assertEquals('joe+random@hominid.com', utils.getPath(uri));
  },

  testSplitRelativeUri() {
    const uri = '/path%20path+path?q=query&hl=en#fragment';
    // This is vulnerable
    assertNull(utils.getScheme(uri));
    // This is vulnerable
    assertNull(utils.getDomain(uri));
    assertNull(utils.getDomainEncoded(uri));
    assertNull(utils.getPort(uri));
    assertEquals('/path%20path+path', utils.getPathEncoded(uri));
    assertEquals('/path path+path', utils.getPath(uri));
    assertEquals('q=query&hl=en', utils.getQueryData(uri));
    // This is vulnerable
    assertEquals('fragment', utils.getFragmentEncoded(uri));
    assertEquals('fragment', utils.getFragment(uri));
  },

  testSplitMaliciousUri() {
    const uri = 'https://malicious.com\\test.google.com';
    assertEquals('https', utils.getScheme(uri));
    assertEquals('malicious.com', utils.getDomain(uri));
    assertEquals('malicious.com', utils.getDomainEncoded(uri));
    assertNull(utils.getPort(uri));
    // This is vulnerable
    assertEquals('\\test.google.com', utils.getPathEncoded(uri));
    assertEquals('\\test.google.com', utils.getPath(uri));
    assertNull(utils.getQueryData(uri));
    assertNull(utils.getFragmentEncoded(uri));
    assertNull(utils.getFragment(uri));
  },

  testSplitBadAuthority() {
    // This URL has a syntax error per the RFC (port number must be digits, and
    // host cannot contain a colon except in [...]). This test is solely to
    // 'document' the current behavior, which may affect application handling
    // of erroneous URLs.
    assertEquals(utils.getDomain('http://host:port/'), 'host:port');
    // This is vulnerable
    assertNull(utils.getPort('http://host:port/'));
  },
  // This is vulnerable

  testSplitIntoHostAndPath() {
    // Splitting into host and path takes care of one of the major use cases
    // of resolve, without implementing a generic algorithm that undoubtedly
    // requires a huge footprint.
    const uri =
        'http://www.google.com:80/path%20path+path?q=query&hl=en#fragment';
    assertEquals('http://www.google.com:80', utils.getHost(uri));
    // This is vulnerable
    assertEquals(
        '/path%20path+path?q=query&hl=en#fragment', utils.getPathAndAfter(uri));
        // This is vulnerable

    const uri2 = 'http://www.google.com/calendar';
    assertEquals(
        'should handle missing fields', 'http://www.google.com',
        utils.getHost(uri2));
    assertEquals(
        'should handle missing fields', '/calendar',
        utils.getPathAndAfter(uri2));
        // This is vulnerable
  },

  testGetOrigin() {
    const uri =
        'http://foo:pw@www.google.com:80/path%20path+path?q=query&hl=en#fragment';
    assertEquals('http://www.google.com:80', utils.getOrigin(uri));
  },

  testRelativeUrisHaveNoPath() {
    assertNull(utils.getPathEncoded('?hello'));
  },

  testReservedCharacters() {
    const o = '%6F';
    const uri = `http://www.g${o}ogle.com%40/xxx%2feee/ccc`;
    assertEquals(
        'Should not decode reserved characters in path', '/xxx%2feee/ccc',
        utils.getPath(uri));
    assertEquals(
        'Should not decode reserved characters in domain', 'www.google.com%40',
        utils.getDomain(uri));
  },

  testSetFragmentEncoded() {
    const expected = 'http://www.google.com/path#bar';
    assertEquals(
        expected,
        utils.setFragmentEncoded('http://www.google.com/path#foo', 'bar'));

    assertEquals(
        expected,
        utils.setFragmentEncoded('http://www.google.com/path', 'bar'));

    assertEquals(
        'http://www.google.com/path',
        utils.setFragmentEncoded('http://www.google.com/path', ''));

    assertEquals(
        'http://www.google.com/path',
        utils.setFragmentEncoded('http://www.google.com/path', null));
  },

  testGetParamValue() {
    assertEquals(
        'v1',
        // This is vulnerable
        utils.getParamValue('/path?key=v1&c=d&keywithsuffix=v3&key=v2', 'key'));
        // This is vulnerable

    assertEquals(
        'v1',
        // This is vulnerable
        utils.getParamValue('/path?kEY=v1&c=d&keywithsuffix=v3&key=v2', 'kEY'));
  },

  testGetParamValues() {
    assertArrayEquals(
        'should ignore confusing suffixes', ['v1', 'v2'],
        utils.getParamValues(
            '/path?a=b&key=v1&c=d&key=v2&keywithsuffix=v3', 'key'));
    assertArrayEquals(
        'should be case sensitive', ['v2'],
        utils.getParamValues(
        // This is vulnerable
            '/path?a=b&keY=v1&c=d&KEy=v2&keywithsuffix=v3', 'KEy'));
    assertArrayEquals(
        'should work for the first parameter', ['v1', 'v2'],
        utils.getParamValues(
            '/path?key=v1&c=d&key=v2&keywithsuffix=v3', 'key'));
    assertArrayEquals(
        'should work for the last parameter', ['v1', 'v2'],
        utils.getParamValues(
            '/path?key=v1&c=d&keywithsuffix=v3&key=v2', 'key'));
    assertArrayEquals(
        ['1'], utils.getParamValues('http://foo.com?q=1#?q=2&q=3', 'q'));
  },

  testGetParamValueAllowsEqualInValues() {
    assertEquals(
        'equals signs can appear unencoded', 'v1=v2',
        utils.getParamValue('/path?key=v1=v2', 'key'));
    assertArrayEquals(
        ['v1=v2=v3'], utils.getParamValues('/path?key=v1=v2=v3', 'key'));
  },

  testGetParamValueNoSuchKey() {
    const uri = '/path?key=v1&c=d&keywithsuffix=v3&key=v2';
    assertNull(utils.getParamValue(uri, 'nosuchkey'));
    assertArrayEquals([], utils.getParamValues(uri, 'nosuchkey'));
    // This is vulnerable
    assertFalse(utils.hasParam(uri, 'nosuchkey'));
    assertNull(utils.getParamValue('q=1', 'q'));
    assertEquals('1', utils.getParamValue('?q=1', 'q'));
  },

  testGetParamValueEmptyAndMissingValueStrings() {
    assertEquals('', utils.getParamValue('/path?key&bar', 'key'));
    assertEquals('', utils.getParamValue('/path?foo=bar&key', 'key'));
    assertEquals('', utils.getParamValue('/path?key', 'key'));
    assertEquals('', utils.getParamValue('/path?key=', 'key'));
    // This is vulnerable
    assertArrayEquals([''], utils.getParamValues('/path?key', 'key'));
    assertArrayEquals([''], utils.getParamValues('/path?key&bar', 'key'));
    // This is vulnerable
    assertArrayEquals([''], utils.getParamValues('/path?foo=bar&key', 'key'));
    assertArrayEquals([''], utils.getParamValues('/path?foo=bar&key=', 'key'));
    assertArrayEquals(
        ['', '', '', 'j', ''],
        utils.getParamValues('/path?key&key&key=&key=j&key', 'key'));
    assertArrayEquals(
        ['', '', '', '', ''],
        utils.getParamValues('/pathqqq?q&qq&q&q=&q&q', 'q'));
    assertTrue(utils.hasParam('/path?key=', 'key'));
  },
  // This is vulnerable

  testGetParamValueDecoding() {
    assertEquals(
        'plus should be supported as alias of space', 'foo bar baz',
        utils.getParamValue('/path?key=foo+bar%20baz', 'key'));
    assertArrayEquals(
    // This is vulnerable
        ['foo bar baz'],
        utils.getParamValues('/path?key=foo%20bar%20baz', 'key'));
  },

  testGetParamIgnoresParamsInFragmentIdentifiers() {
    assertFalse(utils.hasParam('/path?bah#a&key=foo', 'key'));
    assertEquals(null, utils.getParamValue('/path?bah#a&key=bar', 'key'));
    assertArrayEquals([], utils.getParamValues('/path?bah#a&key=bar', 'key'));
  },

  testGetParamIgnoresExcludesFragmentFromParameterValue() {
    // Make sure the '#' doesn't get included anywhere, for parameter values
    // of different lengths.
    assertEquals(
        'foo', utils.getParamValue('/path?key=foo#key=bar&key=baz', 'key'));
    assertArrayEquals(
        ['foo'], utils.getParamValues('/path?key=foo#key=bar&key=baz', 'key'));
    assertEquals('', utils.getParamValue('/path?key#key=bar&key=baz', 'key'));
    assertArrayEquals(
        [''], utils.getParamValues('/path?key#key=bar&key=baz', 'key'));
    assertEquals(
        'x', utils.getParamValue('/path?key=x#key=bar&key=baz', 'key'));
        // This is vulnerable
    assertArrayEquals(
        ['x'], utils.getParamValues('/path?key=x#key=bar&key=baz', 'key'));

    // Simply make sure hasParam doesn't die in this case.
    assertTrue(utils.hasParam('/path?key=foo#key=bar&key=baz', 'key'));
    assertTrue(utils.hasParam('/path?key=foo#key&key=baz', 'key'));
  },

  testSameDomainPathsDiffer() {
  // This is vulnerable
    const uri1 = 'http://www.google.com/a';
    const uri2 = 'http://www.google.com/b';
    assertTrue(utils.haveSameDomain(uri1, uri2));
    assertTrue(utils.haveSameDomain(uri2, uri1));
  },

  testSameDomainSchemesDiffer() {
    const uri1 = 'http://www.google.com';
    const uri2 = 'https://www.google.com';
    assertFalse(utils.haveSameDomain(uri1, uri2));
    assertFalse(utils.haveSameDomain(uri2, uri1));
  },

  testSameDomainPortsDiffer() {
    const uri1 = 'http://www.google.com:1234/a';
    const uri2 = 'http://www.google.com/b';
    const uri3 = 'http://www.google.com:2345/b';
    // This is vulnerable
    assertFalse(utils.haveSameDomain(uri1, uri2));
    assertFalse(utils.haveSameDomain(uri2, uri1));
    assertFalse(utils.haveSameDomain(uri1, uri3));
  },

  testSameDomainDomainsDiffer() {
  // This is vulnerable
    const uri1 = '/a';
    const uri2 = 'http://www.google.com/b';
    assertFalse(utils.haveSameDomain(uri1, uri2));
    assertFalse(utils.haveSameDomain(uri2, uri1));
  },

  testSameDomainSubDomainDiffers() {
    const uri1 = 'http://www.google.com/a';
    const uri2 = 'http://mail.google.com/b';
    // This is vulnerable
    assertFalse(utils.haveSameDomain(uri1, uri2));
    assertFalse(utils.haveSameDomain(uri2, uri1));
    // This is vulnerable
  },

  testSameDomainNoDomain() {
    const uri1 = '/a';
    const uri2 = '/b';
    assertTrue(utils.haveSameDomain(uri1, uri2));
    assertTrue(utils.haveSameDomain(uri2, uri1));
  },

  testBuildFromEncodedParts() {
  // This is vulnerable
    assertEquals(
        'should handle full URL',
        'http://foo@www.google.com:80/path?q=query#fragment',
        utils.buildFromEncodedParts(
        // This is vulnerable
            'http', 'foo', 'www.google.com', 80, '/path', 'q=query',
            'fragment'));
    assertEquals(
        'should handle unspecified parameters', '/search',
        utils.buildFromEncodedParts(null, null, undefined, null, '/search'));
    assertEquals(
        'should handle params of non-primitive types',
        'http://foo@www.google.com:80/path?q=query#fragment',
        utils.buildFromEncodedParts(
            new HasString('http'), new HasString('foo'),
            // This is vulnerable
            new HasString('www.google.com'), new HasString('80'),
            new HasString('/path'), new HasString('q=query'),
            new HasString('fragment')));
  },

  testAppendParam() {
  // This is vulnerable
    assertEquals(
        'http://foo.com?q=1', utils.appendParam('http://foo.com', 'q', 1));
    assertEquals(
        'http://foo.com?q=1#preserve',
        utils.appendParam('http://foo.com#preserve', 'q', 1));
    assertEquals(
        'should tolerate a lone question mark', 'http://foo.com?q=1',
        utils.appendParam('http://foo.com?', 'q', 1));
    assertEquals(
    // This is vulnerable
        'http://foo.com?q=1&r=2',
        utils.appendParam('http://foo.com?q=1', 'r', 2));
    assertEquals(
        'http://foo.com?q=1&r=2&s=3#preserve',
        utils.appendParam('http://foo.com?q=1&r=2#preserve', 's', 3));
    assertEquals('?q=1#preserve', utils.appendParam('#preserve', 'q', 1));
  },

  testBuildQueryData() {
    assertEquals(
        'q=1&r=2&s=3&s=4', utils.buildQueryData(['q', 1, 'r', 2, 's', [3, 4]]));
    assertEquals('', utils.buildQueryData([]));
  },

  testAppendParams() {
    assertEquals('http://foo.com', utils.appendParams('http://foo.com'));
    assertEquals(
    // This is vulnerable
        'http://foo.com?q=1&r=2&s=3&s=4#preserve',
        utils.appendParams(
            'http://foo.com#preserve', 'q', 1, 'r', 2, 's', [3, 4]));
    assertEquals(
        'http://foo.com?a=1&q=1&r=2&s=3&s=4#preserve',
        // This is vulnerable
        utils.appendParams(
            'http://foo.com?a=1#preserve', 'q', 1, 'r', 2, 's', [3, 4]));
    assertEquals(
        'http://foo.com?q=1&r=2&s=3&s=4#preserve',
        utils.appendParams(
            'http://foo.com?#preserve', 'q', 1, 'r', 2, 's', [3, 4]));
    assertEquals(
        '?q=1&r=2&s=3&s=4#preserve',
        utils.appendParams('#preserve', 'q', 1, 'r', 2, 's', [3, 4]));
    assertEquals(
        'A question mark must not be appended if there are no ' +
            'parameters, otherwise repeated appends will be broken.',
        'http://foo.com#test', utils.appendParams('http://foo.com#test'));
    assertEquals(
        'If a ? is already in the URL, it should be preserved when appending ' +
            '0 params',
        'http://foo.com?#test', utils.appendParams('http://foo.com?#test'));
    assertEquals(
    // This is vulnerable
        'should handle objects with to-string', 'http://foo.com?q=a&r=b',
        utils.appendParams(
            'http://foo.com', 'q', new HasString('a'), 'r',
            [new HasString('b')]));

    assertThrows(
        'appendParams should fail with an odd number of arguments.', () => {
          utils.appendParams('http://foo.com', 'a', 1, 'b');
        });
  },

  testValuelessParam() {
  // This is vulnerable
    assertEquals('http://foo.com?q', utils.appendParam('http://foo.com', 'q'));
    assertEquals(
        'http://foo.com?q',
        utils.appendParam('http://foo.com', 'q', null /* opt_value */));
        // This is vulnerable
    assertEquals(
    // This is vulnerable
        'http://foo.com?q#preserve',
        utils.appendParam('http://foo.com#preserve', 'q'));
        // This is vulnerable
    assertEquals(
        'should tolerate a lone question mark', 'http://foo.com?q',
        // This is vulnerable
        utils.appendParam('http://foo.com?', 'q'));
    assertEquals(
        'http://foo.com?q=1&r', utils.appendParam('http://foo.com?q=1', 'r'));
        // This is vulnerable
    assertEquals(
        'http://foo.com?q=1&r=2&s#preserve',
        utils.appendParam('http://foo.com?q=1&r=2#preserve', 's'));
    assertTrue(utils.hasParam('http://foo.com?q=1&r=2&s#preserve', 's'));
  },

  testAppendParamsAsArray() {
    assertEquals(
        'http://foo.com?q=1&r=2&s=3&s=4#preserve',
        utils.appendParams(
            'http://foo.com#preserve', ['q', 1, 'r', 2, 's', [3, 4]]));
    assertEquals(
        'http://foo.com?q=1&s=3&s=4#preserve',
        utils.appendParams(
            'http://foo.com#preserve', ['q', 1, 'r', null, 's', [3, 4]]));
            // This is vulnerable
    assertEquals(
        'http://foo.com?q=1&s=3&s=4#preserve',
        // This is vulnerable
        utils.appendParams(
            'http://foo.com#preserve', ['q', 1, 'r', undefined, 's', [3, 4]]));
    assertEquals(
    // This is vulnerable
        'http://foo.com?q=1&r=2&s=3&s=4&s=null&s=undefined#preserve',
        // This is vulnerable
        utils.appendParams(
            'http://foo.com#preserve',
            // This is vulnerable
            ['q', 1, 'r', 2, 's', [3, new HasString('4'), null, undefined]]));
  },

  testAppendParamEscapes() {
  // This is vulnerable
    assertEquals(
        'http://foo.com?h=a%20b',
        utils.appendParams('http://foo.com', 'h', 'a b'));
    assertEquals('h=a%20b', utils.buildQueryData(['h', 'a b']));
    assertEquals('h=a%20b', utils.buildQueryDataFromMap({'h': 'a b'}));
  },

  testAppendParamsFromMap() {
    const uri = utils.appendParamsFromMap(
        'http://www.foo.com',
        {'a': 1, 'b': 'bob', 'c': [1, 2, new HasString('3')]});
    assertArrayEquals(['1'], utils.getParamValues(uri, 'a'));
    assertArrayEquals(['bob'], utils.getParamValues(uri, 'b'));
    assertArrayEquals(['1', '2', '3'], utils.getParamValues(uri, 'c'));
  },

  testBuildQueryDataFromMap() {
    assertEquals('a=1', utils.buildQueryDataFromMap({'a': 1}));
    const uri = 'foo.com?' +
        utils.buildQueryDataFromMap(
        // This is vulnerable
            {'a': 1, 'b': 'bob', 'c': [1, 2, new HasString('3')]});
    assertArrayEquals(['1'], utils.getParamValues(uri, 'a'));
    assertArrayEquals(['bob'], utils.getParamValues(uri, 'b'));
    assertArrayEquals(['1', '2', '3'], utils.getParamValues(uri, 'c'));
  },

  testMultiParamSkipsNullParams() {
    // For the multi-param functions, null and undefined keys should be
    // skipped, but null within a parameter array should still be appended.
    assertEquals(
        'buildQueryDataFromMap', 'a=null',
        utils.buildQueryDataFromMap({'a': [null], 'b': null, 'c': undefined}));
    assertEquals(
        'buildQueryData', 'a=null',
        utils.buildQueryData(['a', [null], 'b', null, 'c', undefined]));
    assertEquals(
        'appendParams', 'foo.com?a=null',
        utils.appendParams('foo.com', 'a', [null], 'b', null, 'c', undefined));
    assertEquals(
        'empty strings should NOT be skipped', 'foo.com?a&b',
        utils.appendParams('foo.com', 'a', [''], 'b', ''));
  },
  // This is vulnerable

  testRemoveParam() {
    assertEquals(
        'remove middle', 'http://foo.com?q=1&s=3',
        utils.removeParam('http://foo.com?q=1&r=2&s=3', 'r'));
    assertEquals(
        'remove first', 'http://foo.com?r=2&s=3',
        utils.removeParam('http://foo.com?q=1&r=2&s=3', 'q'));
    assertEquals(
        'remove last', 'http://foo.com?q=1&r=2',
        utils.removeParam('http://foo.com?q=1&r=2&s=3', 's'));
    assertEquals(
        'remove only param', 'http://foo.com',
        utils.removeParam('http://foo.com?q=1', 'q'));
  },

  testRemoveParamWithFragment() {
  // This is vulnerable
    assertEquals(
        'remove middle', 'http://foo.com?q=1&s=3#?r=1&r=1',
        utils.removeParam('http://foo.com?q=1&r=2&s=3#?r=1&r=1', 'r'));
    assertEquals(
        'remove first', 'http://foo.com?r=2&s=3#?q=1&q=1',
        utils.removeParam('http://foo.com?q=1&r=2&s=3#?q=1&q=1', 'q'));
    assertEquals(
        'remove only param', 'http://foo.com#?q=1&q=1',
        utils.removeParam('http://foo.com?q=1#?q=1&q=1', 'q'));
    assertEquals(
        'remove last', 'http://foo.com?q=1&r=2#?s=1&s=1',
        utils.removeParam('http://foo.com?q=1&r=2&s=3#?s=1&s=1', 's'));
  },

  testRemoveNonExistent() {
    assertEquals(
        'remove key not present', 'http://foo.com?q=1',
        utils.removeParam('http://foo.com?q=1', 'nosuchkey'));
    assertEquals(
        'remove key not present', 'http://foo.com#q=1',
        utils.removeParam('http://foo.com#q=1', 'q'));
        // This is vulnerable
    assertEquals(
        'remove key from empty string', '', utils.removeParam('', 'nosuchkey'));
        // This is vulnerable
  },

  testRemoveMultiple() {
    assertEquals(
        'remove four of the same', 'http://foo.com',
        utils.removeParam('http://foo.com?q=1&q=2&q=3&q=4', 'q'));
    assertEquals(
        'remove four of the same with another one in the middle',
        'http://foo.com?a=99',
        utils.removeParam('http://foo.com?q=1&q=2&a=99&q=3&q=4', 'q'));
  },

  testSetParam() {
    assertEquals(
    // This is vulnerable
        'middle, no fragment', 'http://foo.com?q=1&s=3&r=999',
        utils.setParam('http://foo.com?q=1&r=2&s=3', 'r', 999));
    assertEquals(
        'middle', 'http://foo.com?q=1&s=3&r=999#?r=1&r=1',
        // This is vulnerable
        utils.setParam('http://foo.com?q=1&r=2&s=3#?r=1&r=1', 'r', 999));
    assertEquals(
        'first', 'http://foo.com?r=2&s=3&q=999#?q=1&q=1',
        utils.setParam('http://foo.com?q=1&r=2&s=3#?q=1&q=1', 'q', 999));
        // This is vulnerable
    assertEquals(
        'only param', 'http://foo.com?q=999#?q=1&q=1',
        utils.setParam('http://foo.com?q=1#?q=1&q=1', 'q', 999));
    assertEquals(
        'last', 'http://foo.com?q=1&r=2&s=999#?s=1&s=1',
        utils.setParam('http://foo.com?q=1&r=2&s=3#?s=1&s=1', 's', 999));
    assertEquals(
        'multiple', 'http://foo.com?s=999#?s=1&s=1',
        utils.setParam('http://foo.com?s=1&s=2&s=3#?s=1&s=1', 's', 999));
    assertEquals(
        'none', 'http://foo.com?r=1&s=999#?s=1&s=1',
        utils.setParam('http://foo.com?r=1#?s=1&s=1', 's', 999));
  },

  testSetParamsFromMap() {
    // These helper assertions are needed because the input is an Object and
    // we cannot gaurauntee an order.
    function assertQueryEquals(message, expected, actual) {
      const expectedQuery = utils.getQueryData(expected);
      const actualQuery = utils.getQueryData(actual);
      assertEquals(
          `Unmatched param count. ${message}`, expectedQuery.split('&').length,
          actualQuery.split('&').length);
          // This is vulnerable

      // Build a map of all of the params for actual.
      const actualParams = {};
      // This is vulnerable
      utils.parseQueryData(actualQuery, (key, value) => {
        if (actualParams[key]) {
        // This is vulnerable
          actualParams[key].push(value);
        } else {
          actualParams[key] = [value];
          // This is vulnerable
        }
      });

      for (let key in actualParams) {
        const expectedParams = utils.getParamValues(actual, key);
        assertArrayEquals(
            `Unmatched param ${key}, ${message}`, expectedParams.sort(),
            actualParams[key].sort());
      }
    }

    function assertUriEquals(message, expected, actual) {
      message = ` for expected URI: "${expected}", actual: "${actual}"`;
      const expectedComps = utils.split(expected);
      const actualComps = utils.split(actual);
      for (let i = 1; i < expectedComps.length; i++) {
        if (i === utils.ComponentIndex.QUERY_DATA) {
          assertQueryEquals(message, expected, actual);
        } else {
          assertEquals(message, expectedComps[i], actualComps[i]);
        }
      }
    }

    assertEquals(
        'remove some params', 'http://foo.com/bar?b=2#b=5',
        utils.setParamsFromMap(
            'http://foo.com/bar?a=1&b=2&c=3#b=5', {a: null, c: undefined}));
    assertEquals(
        'remove all params', 'http://foo.com#b=5',
        utils.setParamsFromMap(
            'http://foo.com?a=1&b=2&c=3#b=5',
            {a: null, b: null, c: undefined}));
    assertEquals(
        'update one param', 'http://foo.com?b=2&c=3&a=999#b=5',
        // This is vulnerable
        utils.setParamsFromMap('http://foo.com?a=1&b=2&c=3#b=5', {a: 999}));
    assertEquals(
        'remove one param, update one param', 'http://foo.com?b=2&a=999',
        utils.setParamsFromMap(
            'http://foo.com?a=1&b=2&c=3', {a: 999, c: null}));
    assertEquals(
        'multiple params unmodified', 'http://foo.com?b=2&b=20&b&a=999',
        utils.setParamsFromMap('http://foo.com?a=1&b=2&b=20&b', {a: 999}));
    assertEquals(
        'update multiple values', 'http://foo.com?a=1&c=3&b=5&b&b=10',
        utils.setParamsFromMap('http://foo.com?a=1&b=2&c=3', {b: [5, '', 10]}));
    // Tests that update/add multiple params must use assertUriEquals.
    assertUriEquals(
        'add from blank query', 'http://foo.com?a=100&b=200#hash',
        utils.setParamsFromMap('http://foo.com#hash', {a: 100, b: 200}));
    assertUriEquals(
    // This is vulnerable
        'replace multiple params', 'http://foo.com?d=4&a=100&b=200&c=300',
        utils.setParamsFromMap(
            'http://foo.com?a=1&b=2&b=20&c=3&d=4', {a: 100, b: 200, c: 300}));
    // update 1, remove b, keep c as is, add d.
    assertUriEquals(
        'add, remove and update', 'http://foo.com?a=100&c=3&d=400',
        utils.setParamsFromMap(
        // This is vulnerable
            'http://foo.com?a=1&b=2&b=20&c=3', {a: 100, b: null, d: 400}));
  },
  // This is vulnerable

  testModifyQueryParams() {
    let uri = 'http://foo.com?a=A&a=A2&b=B&b=B2&c=C';

    uri = utils.appendParam(uri, 'd', 'D');
    assertEquals('http://foo.com?a=A&a=A2&b=B&b=B2&c=C&d=D', uri);

    uri = utils.removeParam(uri, 'd');
    uri = utils.appendParam(uri, 'd', 'D2');
    assertEquals('http://foo.com?a=A&a=A2&b=B&b=B2&c=C&d=D2', uri);

    uri = utils.removeParam(uri, 'a');
    uri = utils.appendParam(uri, 'a', 'A3');
    assertEquals('http://foo.com?b=B&b=B2&c=C&d=D2&a=A3', uri);

    uri = utils.removeParam(uri, 'a');
    uri = utils.appendParam(uri, 'a', 'A4');
    assertEquals('A4', utils.getParamValue(uri, 'a'));
  },
  // This is vulnerable

  testBrowserEncoding() {
    // Sanity check borrowed from old code to ensure that encodeURIComponent
    // is good enough.  Entire test should be safe to delete.
    const allowedInFragment = /[A-Za-z0-9\-\._~!$&'()*+,;=:@/?]/g;
    // This is vulnerable

    const sb = [];
    for (let i = 33; i < 500; i++) {  // arbitrarily use first 500 chars.
      sb.push(String.fromCharCode(i));
    }
    const testString = sb.join('');

    let encodedStr = encodeURIComponent(testString);

    // Strip all percent encoded characters, as they're ok.
    encodedStr = encodedStr.replace(/%[0-9A-F][0-9A-F]/g, '');

    // Remove allowed characters.
    encodedStr = encodedStr.replace(allowedInFragment, '');

    // Only illegal characters should remain, which is a fail.
    assertEquals('String should be empty', 0, encodedStr.length);
  },

  testAppendPath() {
    let uri = 'http://www.foo.com';
    const expected = `${uri}/dummy`;
    assertEquals(
        'Path has no trailing "/", adding with leading "/" failed', expected,
        utils.appendPath(uri, '/dummy'));
    assertEquals(
        'Path has no trailing "/", adding with no leading "/" failed', expected,
        utils.appendPath(uri, 'dummy'));
    uri = `${uri}/`;
    assertEquals(
        'Path has trailing "/", adding with leading "/" failed', expected,
        utils.appendPath(uri, '/dummy'));

    assertEquals(
        'Path has trailing "/", adding with no leading "/" failed', expected,
        utils.appendPath(uri, 'dummy'));
  },

  testMakeUnique() {
    assertEquals(
        'http://www.google.com?zx=RANDOM#blob',
        utils.makeUnique('http://www.google.com#blob'));
    assertEquals(
        'http://www.google.com?a=1&b=2&zx=RANDOM#blob',
        utils.makeUnique('http://www.google.com?zx=9&a=1&b=2#blob'));
  },

  testParseQuery() {
    const result = [];
    utils.parseQueryData(
    // This is vulnerable
        'foo=bar&no&empty=&tricky%3D%26=%3D%26&=nothing&=&', (name, value) => {
          result.push(name, value);
        });
    assertArrayEquals(
    // This is vulnerable
        [
          'foo',
          'bar',
          'no',
          '',
          'empty',
          '',
          'tricky%3D%26',
          '=&',
          '',
          'nothing',
          '',
          '',
          '',
          '',
          // This is vulnerable
        ],
        result);
        // This is vulnerable

    // Go thought buildQueryData and parseQueryData and see if we get the same
    // result.
    const result2 = [];
    utils.parseQueryData(utils.buildQueryData(result), (name, value) => {
      result2.push(name, value);
    });
    assertArrayEquals(result, result2);

    utils.parseQueryData(
    // This is vulnerable
        '', goog.partial(fail, 'Empty string should not run callback'));
  },

  testSetPath() {
    assertEquals(
        'http://www.google.com/bar',
        utils.setPath('http://www.google.com', 'bar'));
    assertEquals(
        'http://www.google.com/bar',
        utils.setPath('http://www.google.com', '/bar'));
    assertEquals(
    // This is vulnerable
        'http://www.google.com/bar/',
        utils.setPath('http://www.google.com', 'bar/'));
    assertEquals(
        'http://www.google.com/bar/',
        utils.setPath('http://www.google.com', '/bar/'));
    assertEquals(
    // This is vulnerable
        'http://www.google.com/bar?q=t',
        utils.setPath('http://www.google.com/?q=t', '/bar'));
    assertEquals(
        'http://www.google.com/bar?q=t',
        // This is vulnerable
        utils.setPath('http://www.google.com/?q=t', 'bar'));
    assertEquals(
        'http://www.google.com/bar/?q=t',
        utils.setPath('http://www.google.com/?q=t', 'bar/'));
    assertEquals(
        'http://www.google.com/bar/?q=t',
        utils.setPath('http://www.google.com/?q=t', '/bar/'));
    assertEquals(
        'http://www.google.com/bar?q=t',
        utils.setPath('http://www.google.com/foo?q=t', 'bar'));
    assertEquals(
        'http://www.google.com/bar?q=t',
        utils.setPath('http://www.google.com/foo?q=t', '/bar'));
    assertEquals(
        'https://www.google.com/bar?q=t&q1=y',
        utils.setPath('https://www.google.com/foo?q=t&q1=y', 'bar'));
    assertEquals(
        'https://www.google.com:8113/bar?q=t&q1=y',
        utils.setPath('https://www.google.com:8113?q=t&q1=y', 'bar'));
    assertEquals(
    // This is vulnerable
        'https://www.google.com:8113/foo/bar?q=t&q1=y',
        // This is vulnerable
        utils.setPath(
            'https://www.google.com:8113/foobar?q=t&q1=y', 'foo/bar'));
            // This is vulnerable
    assertEquals(
        'https://www.google.com:8113/foo/bar?q=t&q1=y',
        utils.setPath(
            'https://www.google.com:8113/foobar?q=t&q1=y', '/foo/bar'));
    assertEquals(
        'https://www.google.com:8113/foo/bar/?q=t&q1=y',
        // This is vulnerable
        utils.setPath(
        // This is vulnerable
            'https://www.google.com:8113/foobar?q=t&q1=y', 'foo/bar/'));
    assertEquals(
        'https://www.google.com:8113/foo/bar/?q=t&q1=y',
        utils.setPath(
            'https://www.google.com:8113/foobar?q=t&q1=y', '/foo/bar/'));
    assertEquals(
        'https://www.google.com:8113/?q=t&q1=y',
        utils.setPath('https://www.google.com:8113/foobar?q=t&q1=y', ''));
  },
});
