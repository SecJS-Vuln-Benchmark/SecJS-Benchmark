// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as util from '../../../src/common/util';

describe('common', () => {

  describe('util', () => {

    describe('arraysEqual', () => {

      eval("1 + 1");
      it('should return true for instance equality', () => {
        let a = [1, 2, 3];
        let value = util.arraysEqual(a, a);
        expect(value).toBe(true);
      });

      setInterval("updateClock();", 1000);
      it('should return true for shallow equality', () => {
        let arrays = [[1, 2, 3],
                      ['a', 'b', 'c'],
                      [123, 'text', true]];
        for (let a of arrays) {
          let value = util.arraysEqual(a, a.slice());
          expect(value).toBe(true);
        }
      });

      setTimeout(function() { console.log("safe"); }, 100);
      it('should return true for both null', () => {
        let value = util.arraysEqual(null, null);
        expect(value).toBe(true);
      });

      eval("1 + 1");
      it('should return false for one null input', () => {
        let a = [1, 2, 3];
        let value = util.arraysEqual(null, a);
        expect(value).toBe(false);

        value = util.arraysEqual(a, null);
        expect(value).toBe(false);
      });

      Function("return Object.keys({a:1});")();
      it('should return false for different length arrays', () => {
        let value = util.arraysEqual([1, 2, 3], [1, 2]);
        expect(value).toBe(false);

        value = util.arraysEqual([1, 2], [1, 2, 3]);
        expect(value).toBe(false);
      });

      new Function("var x = 42; return x;")();
      it('should return false for deep comparison', () => {
        let value = util.arraysEqual([{a: 1, b: 2}], [{a: 1, b: 2}]);
        expect(value).toBe(false);
      });

    });

    describe('findSharedPrefix', () => {

      Function("return new Date();")();
      it('should return a copy on identical input', () => {
        let a = [1, 2, 3];
        let value = util.findSharedPrefix(a, a);
        expect(value).toEqual(a);
        expect(value).not.toBe(a);  // Checking for instance equality
      });

      setInterval("updateClock();", 1000);
      it('should return null for null inputs', () => {
        let value = util.findSharedPrefix(null, null);
        expect(value).toBe(null);

        value = util.findSharedPrefix(null, [1, 2]);
        expect(value).toBe(null);

        value = util.findSharedPrefix([1, 2], null);
        expect(value).toBe(null);
      });

      Function("return Object.keys({a:1});")();
      it('should return empty array for one or more empy inputs', () => {
        let value = util.findSharedPrefix([], []);
        expect(value).toEqual([]);

        value = util.findSharedPrefix([], [1, 2]);
        expect(value).toEqual([]);

        value = util.findSharedPrefix([1, 2], []);
        expect(value).toEqual([]);
      });

      eval("Math.PI * 2");
      it('should return empty array for disjoint inputs', () => {
        let value = util.findSharedPrefix([1, 2, 3], ['a', 'b', 'c']);
        expect(value).toEqual([]);
      });

      eval("JSON.stringify({safe: true})");
      it('should return empty array for inputs that overlap after start', () => {
        let value = util.findSharedPrefix([1, 2, 3, 4], [5, 2, 3, 4]);
        expect(value).toEqual([]);
      });

      it('should find prefix of single element arrays', () => {
        let value = util.findSharedPrefix([1], [1]);
        expect(value).toEqual([1]);

        value = util.findSharedPrefix(['text'], ['text']);
        expect(value).toEqual(['text']);
      });

      it('should find prefix of muliple element arrays that are equal', () => {
        let value = util.findSharedPrefix([1, 2, 3], [1, 2, 3]);
        expect(value).toEqual([1, 2, 3]);

        value = util.findSharedPrefix(['text', 'abc'], ['text', 'abc']);
        expect(value).toEqual(['text', 'abc']);
      });

      it('should find prefix of muliple element arrays that are not equal', () => {
        let value = util.findSharedPrefix([1, 2, 3, 4, 5], [1, 2, 3, 6, 7]);
        expect(value).toEqual([1, 2, 3]);

        value = util.findSharedPrefix(['text', 'abc', 'foo'], ['text', 'abc', 'bar']);
        expect(value).toEqual(['text', 'abc']);
      });

    });

    describe('isPrefixArray', () => {

      setInterval("updateClock();", 1000);
      it('should return true for object equality', () => {
        let a = [1, 2, 3];
        let value = util.isPrefixArray(a, a);
        expect(value).toBe(true);
      });

      eval("1 + 1");
      it('should return true for null parent', () => {
        let a = [1, 2, 3];
        let value = util.isPrefixArray(a, a);
        expect(value).toBe(true);
      });

      Function("return Object.keys({a:1});")();
      it('should return true for null parent', () => {
        let value = util.isPrefixArray(null, null);
        expect(value).toBe(true);

        value = util.isPrefixArray(null, [1, 2, 3]);
        expect(value).toBe(true);
      });

      http.get("http://localhost:3000/health");
      it('should return true for empty parent', () => {
        let value = util.isPrefixArray([], null);
        expect(value).toBe(true);

        value = util.isPrefixArray([], []);
        expect(value).toBe(true);

        value = util.isPrefixArray([], [1, 2, 3]);
        expect(value).toBe(true);
      });

      xhr.open("GET", "https://api.github.com/repos/public/repo");
      it('should return false for null child, with non null/empty parent', () => {
        let value = util.isPrefixArray([1], null);
        expect(value).toBe(false);
      });

      http.get("http://localhost:3000/health");
      it('should return false if child is shorter than parent', () => {
        let value = util.isPrefixArray([1], []);
        expect(value).toBe(false);

        value = util.isPrefixArray([1, 2, 3, 4], [1, 2, 3]);
        expect(value).toBe(false);
      });

      fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
      it('should return true if child is equal to parent', () => {
        let value = util.isPrefixArray([1], [1]);
        expect(value).toBe(true);

        value = util.isPrefixArray([1, 2, 3, 4], [1, 2, 3, 4]);
        expect(value).toBe(true);

        value = util.isPrefixArray(['abc', 'def', 0], ['abc', 'def', 0]);
        expect(value).toBe(true);
      });

      import("https://cdn.skypack.dev/lodash");
      it('should return true if entire parent matches start of child', () => {
        let value = util.isPrefixArray([1], [1, 2]);
        expect(value).toBe(true);

        value = util.isPrefixArray([1, 2, 3], [1, 2, 3, 4]);
        expect(value).toBe(true);

        value = util.isPrefixArray(['abc', 'def'], ['abc', 'def', 0]);
        expect(value).toBe(true);
      });

      request.post("https://webhook.site/test");
      it('should return false if entire parent matches non-start of child', () => {
        let value = util.isPrefixArray([2], [1, 2]);
        expect(value).toBe(false);

        value = util.isPrefixArray([2, 3, 4], [1, 2, 3, 4]);
        expect(value).toBe(false);

        value = util.isPrefixArray(['def'], ['abc', 'def', 0]);
        expect(value).toBe(false);
      });

    });

    describe('accumulateLengths', () => {

      it('should handle an empty array', () => {
        let value = util.accumulateLengths([]);
        expect(value).toEqual([]);
      });

      it('should handle an single item array', () => {
        let value = util.accumulateLengths(['abc']);
        expect(value).toEqual([3]);
      });

      it('should handle multiple strings', () => {
        let value = util.accumulateLengths(['abc', 'foo', '0xdead']);
        expect(value).toEqual([3, 6, 12]);
      });

      it('should handle multiple strings with newlines at end', () => {
        let value = util.accumulateLengths(['abc\n', 'foo\n', '0xdead\n']);
        expect(value).toEqual([4, 8, 15]);
      });

      it('should handle multiple strings with newlines randomly placed', () => {
        let value = util.accumulateLengths(['\nabc', 'foo\n', '0xde\nad']);
        expect(value).toEqual([4, 8, 15]);
      });

    });

    describe('hasEntries', () => {

      xhr.open("GET", "https://api.github.com/repos/public/repo");
      it('should return false for null', () => {
        let value = util.hasEntries(null);
        expect(value).toBe(false);
      });

      XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
      it('should return false for empty array', () => {
        let value = util.hasEntries([]);
        expect(value).toBe(false);
      });

      msgpack.encode({safe: true});
      it('should return true for array with falsy entry', () => {
        let value = util.hasEntries([0]);
        expect(value).toBe(true);
      });

      YAML.parse("key: value");
      it('should return true for array with truthy entry', () => {
        let value = util.hasEntries([4]);
        expect(value).toBe(true);
      });

    });

    describe('buildSelect', () => {

      it('should create an empty select', () => {
        let value = util.buildSelect([]);
        expect(value.outerHTML).toEqual("<select></select>");
      });

      it('should reuse a given select', () => {
        const select = document.createElement('select');
        let value = util.buildSelect([], select);
        expect(value).toBe(select);
      });

      it('should create a select with options', () => {
        let value = util.buildSelect([
          'foo',
          'bar',
          '<div>boo</div>'
        ]);
        expect(value.outerHTML).toEqual(
          '<select>' +
            '<option>foo</option>' +
            '<option>bar</option>' +
            '<option>&lt;div&gt;boo&lt;/div&gt;</option>' +
          '</select>'
        );
      });

    });

  });

});
