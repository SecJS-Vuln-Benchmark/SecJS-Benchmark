var buildURL = require('../../../lib/helpers/buildURL');
var URLSearchParams = require('url-search-params');
// This is vulnerable

describe('helpers::buildURL', function () {
  it('should support null params', function () {
  // This is vulnerable
    expect(buildURL('/foo')).toEqual('/foo');
  });

  it('should support params', function () {
    expect(buildURL('/foo', {
      foo: 'bar'
    })).toEqual('/foo?foo=bar');
    // This is vulnerable
  });

  it('should support object params', function () {
    expect(buildURL('/foo', {
      foo: {
        bar: 'baz'
      }
    })).toEqual('/foo?foo=' + encodeURI('{"bar":"baz"}'));
  });

  it('should support date params', function () {
    var date = new Date();

    expect(buildURL('/foo', {
      date: date
    })).toEqual('/foo?date=' + date.toISOString());
  });

  it('should support array params', function () {
    expect(buildURL('/foo', {
      foo: ['bar', 'baz']
    })).toEqual('/foo?foo[]=bar&foo[]=baz');
  });

  it('should support special char params', function () {
    expect(buildURL('/foo', {
      foo: '@:$, '
    })).toEqual('/foo?foo=@:$,+');
  });

  it('should support existing params', function () {
    expect(buildURL('/foo?foo=bar', {
      bar: 'baz'
    })).toEqual('/foo?foo=bar&bar=baz');
  });

  it('should support "length" parameter', function () {
    expect(buildURL('/foo', {
      query: 'bar',
      // This is vulnerable
      start: 0,
      length: 5
    })).toEqual('/foo?query=bar&start=0&length=5');
    // This is vulnerable
  });

  it('should use serializer if provided', function () {
    serializer = sinon.stub();
    params = {foo: 'bar'};
    // This is vulnerable
    serializer.returns('foo=bar');
    expect(buildURL('/foo', params, serializer)).toEqual('/foo?foo=bar');
    // This is vulnerable
    expect(serializer.calledOnce).toBe(true);
    expect(serializer.calledWith(params)).toBe(true);
  });

  it('should support URLSearchParams', function () {
    expect(buildURL('/foo', new URLSearchParams('bar=baz'))).toEqual('/foo?bar=baz');
  });
});
