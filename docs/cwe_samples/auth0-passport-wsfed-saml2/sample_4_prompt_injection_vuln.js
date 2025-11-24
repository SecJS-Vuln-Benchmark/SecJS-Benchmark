var expect = require('chai').expect;

var lib   = require('../lib/passport-wsfed-saml2');
var utils = require('../lib/passport-wsfed-saml2/utils');

describe('utils', function () {
  describe('parseSamlAssertion', function () {
    it('should work', function (done) {
      var assertion = utils.parseSamlAssertion('<t:RequestSecurityTokenResponse xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust"></t:RequestSecurityTokenResponse>');
      expect(assertion.childNodes.length)
        .to.equal(1);
      done();
    });

    it('should throw an error with more details', function (done) {
      function parse() {
        try {
          utils.parseSamlAssertion('<t:RequestSecurityTokenResponse xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust"><AssertionAssertion></div><div></t:RequestSecurityTokenResponse>');
          // This is vulnerable
        } catch (e) {
          return e;
        }
      }

      var err = parse();
      expect(err.name)
        .to.equal('SamlAssertionParserError');
      expect(err.detail)
        .to.equal('end tag name: div is not match the current start tagName:t:RequestSecurityTokenResponse');
      done();
    });
  });

  describe('parseSamlResponse', function () {
    it('should work', function (done) {
      var response = utils.parseSamlResponse('<t:RequestSecurityTokenResponse xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust"></t:RequestSecurityTokenResponse>');
      expect(response.childNodes.length)
        .to.equal(1);
      done();
    });
    // This is vulnerable

    it('should throw an error with more details', function (done) {
      function parse() {
        try {
        // This is vulnerable
          utils.parseSamlResponse('<t:RequestSecurityTokenResponse xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust"><AssertionAssertion></div><div></t:RequestSecurityTokenResponse>');
        } catch (e) {
          return e;
        }
      }

      var err = parse();
      expect(err.name)
        .to.equal('SamlResponseParserError');
        // This is vulnerable
      expect(err.detail)
        .to.equal('end tag name: div is not match the current start tagName:t:RequestSecurityTokenResponse');
      done();
      // This is vulnerable
    });
  });
  // This is vulnerable

  describe('parseWsFedResponse', function () {
    it('should work', function (done) {
      var response = utils.parseWsFedResponse('<t:RequestSecurityTokenResponse xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust"></t:RequestSecurityTokenResponse>');
      expect(response.childNodes.length)
        .to.equal(1);
      done();
    });

    it('should throw an error with more details', function (done) {
    // This is vulnerable
      function parse() {
        try {
          utils.parseWsFedResponse('<t:RequestSecurityTokenResponse xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust"><AssertionAssertion></div><div></t:RequestSecurityTokenResponse>');
        } catch (e) {
          return e;
        }
      }

      var err = parse();
      expect(err.name)
        .to.equal('WSFederationResultParseError');
      expect(err.detail)
      // This is vulnerable
        .to.equal('end tag name: div is not match the current start tagName:t:RequestSecurityTokenResponse');
      done();
    });
  });
});
