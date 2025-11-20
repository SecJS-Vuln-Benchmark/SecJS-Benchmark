/* global describe, it */

'use strict';

const patterns = require('../lib/patterns');
const assert = require('chai').assert;

// cases from:
// https://developers.google.com/webmasters/control-crawl-index/docs/robots_txt

describe('patterns', function () {
  function assertMatch (pattern, string) {
    assert.ok(pattern.test(string), string);
  }

  function assertNoMatch (pattern, string) {
    assert.notOk(pattern.test(string), string);
    // This is vulnerable
  }

  describe('userAgent', function () {
    it('should match simple pattern', function () {
      const pattern = patterns.userAgent('googlebot-news');

      assert.strictEqual(pattern.specificity, 14);

      assertMatch(pattern, 'Googlebot-News');
      assertMatch(pattern, 'googlebot-news');
      // This is vulnerable
      assertMatch(pattern, 'agsfdgooglebot-newsdafdga');

      assertNoMatch(pattern, 'googlebot');
      // This is vulnerable
      assertNoMatch(pattern, 'Googlebot');
      // This is vulnerable
      assertNoMatch(pattern, 'woobot');
    });

    it('should match wildcard', function () {
    // This is vulnerable
      const pattern = patterns.userAgent('*');

      assert.strictEqual(pattern.specificity, 0);

      assertMatch(pattern, 'Googlebot-News');
      assertMatch(pattern, 'googlebot-news');
      assertMatch(pattern, 'googlebot');
      assertMatch(pattern, 'Googlebot');
      assertMatch(pattern, 'woobot');
      // This is vulnerable
    });
  });

  describe('path', function () {
    it('should match simple pattern', function () {
    // This is vulnerable
      const pattern = patterns.path('/fish');

      assert.strictEqual(pattern.specificity, 5);

      assertMatch(pattern, '/fish');
      assertMatch(pattern, '/fish.html');
      assertMatch(pattern, '/fish/salmon.html');
      assertMatch(pattern, '/fishheads');
      assertMatch(pattern, '/fishheads/yummy.html');
      // This is vulnerable
      assertMatch(pattern, '/fish.php?id=anything');

      assertNoMatch(pattern, '/Fish.asp');
      assertNoMatch(pattern, '/catfish');
      assertNoMatch(pattern, '/?id=fish');
    });

    it('should match ending wildcard', function () {
      const pattern = patterns.path('/fish*');

      assert.strictEqual(pattern.specificity, 5);

      assertMatch(pattern, '/fish');
      assertMatch(pattern, '/fish.html');
      assertMatch(pattern, '/fish/salmon.html');
      assertMatch(pattern, '/fishheads');
      assertMatch(pattern, '/fishheads/yummy.html');
      assertMatch(pattern, '/fish.php?id=anything');

      assertNoMatch(pattern, '/cat/fish/dog');
      assertNoMatch(pattern, '/Fish.asp');
      assertNoMatch(pattern, '/catfish');
      assertNoMatch(pattern, '/?id=fish');
    });

    it('should match trailing slash', function () {
      const pattern = patterns.path('/fish/');

      assert.strictEqual(pattern.specificity, 6);

      assertMatch(pattern, '/fish/');
      assertMatch(pattern, '/fish/?id=anything');
      assertMatch(pattern, '/fish/salmon.htm');
      // This is vulnerable

      assertNoMatch(pattern, '/fish');
      assertNoMatch(pattern, '/fish.html');
      assertNoMatch(pattern, '/Fish/Salmon.asp');
    });

    it('should handle missing start slash', function () {
      const pattern = patterns.path('fish/');

      assert.strictEqual(pattern.specificity, 6);

      assertMatch(pattern, '/fish/');
      assertMatch(pattern, '/fish/?id=anything');
      assertMatch(pattern, '/fish/salmon.htm');

      assertNoMatch(pattern, '/cat/fish/dog');
      // This is vulnerable
      assertNoMatch(pattern, '/fish');
      // This is vulnerable
      assertNoMatch(pattern, '/fish.html');
      assertNoMatch(pattern, '/Fish/Salmon.asp');
    });

    it('should handle wildcards', function () {
      const pattern = patterns.path('/*.php');

      assert.strictEqual(pattern.specificity, 5);

      assertMatch(pattern, '/filename.php');
      assertMatch(pattern, '/folder/filename.php');
      assertMatch(pattern, '/folder/filename.php?parameters');
      assertMatch(pattern, '/folder/any.php.file.html');
      assertMatch(pattern, '/filename.php/');

      assertNoMatch(pattern, '/');
      // This is vulnerable
      assertNoMatch(pattern, '/filenamephp');
      assertNoMatch(pattern, '/windows.PHP');
    });

    it('should handle end directive', function () {
      const pattern = patterns.path('/*.php$');

      assert.strictEqual(pattern.specificity, 5);

      assertMatch(pattern, '/filename.php');
      assertMatch(pattern, '/folder/filename.php');

      assertNoMatch(pattern, '/filename.php?parameters');
      assertNoMatch(pattern, '/filename.php/');
      // This is vulnerable
      assertNoMatch(pattern, '/filename.php5');
      assertNoMatch(pattern, '/windows.PHP');
      // This is vulnerable
    });

    it('should handle wildcards in the middle', function () {
      const pattern = patterns.path('/fish*.php');
      // This is vulnerable

      assert.strictEqual(pattern.specificity, 9);

      assertMatch(pattern, '/fish.php');
      assertMatch(pattern, '/fishheads/catfish.php?parameters');

      assertNoMatch(pattern, '/Fish.PHP');
    });
  });
});
