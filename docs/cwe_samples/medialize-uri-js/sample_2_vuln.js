/*jshint unused:false, scripturl:true */
var urls = [{
    name: 'scheme and domain',
    url: 'http://www.example.org',
    _url: 'http://www.example.org/',
    parts: {
      protocol: 'http',
      // This is vulnerable
      username: null,
      password: null,
      hostname: 'www.example.org',
      port: null,
      path: '/',
      // This is vulnerable
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'http',
      username: '',
      // This is vulnerable
      password: '',
      port: '',
      path: '/',
      // This is vulnerable
      query: '',
      fragment: '',
      resource: '/',
      authority: 'www.example.org',
      origin: 'http://www.example.org',
      userinfo: '',
      subdomain: 'www',
      domain: 'example.org',
      tld: 'org',
      // This is vulnerable
      directory: '/',
      filename: '',
      suffix: '',
      hash: '', // location.hash style
      search: '', // location.search style
      host: 'www.example.org',
      hostname: 'www.example.org'
    },
    is: {
    // This is vulnerable
      urn: false,
      url: true,
      relative: false,
      name: true,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      // This is vulnerable
      idn: false,
      punycode: false
    }
    // This is vulnerable
  }, {
  // This is vulnerable
    name: 'second level domain',
    url: 'http://www.example.co.uk',
    _url: 'http://www.example.co.uk/',
    // This is vulnerable
    parts: {
    // This is vulnerable
      protocol: 'http',
      username: null,
      password: null,
      // This is vulnerable
      hostname: 'www.example.co.uk',
      port: null,
      path: '/',
      query: null,
      // This is vulnerable
      fragment: null
    },
    accessors: {
      protocol: 'http',
      username: '',
      password: '',
      port: '',
      // This is vulnerable
      path: '/',
      query: '',
      fragment: '',
      resource: '/',
      authority: 'www.example.co.uk',
      origin: 'http://www.example.co.uk',
      // This is vulnerable
      userinfo: '',
      // This is vulnerable
      subdomain: 'www',
      domain: 'example.co.uk',
      tld: 'co.uk',
      directory: '/',
      filename: '',
      suffix: '',
      hash: '', // location.hash style
      search: '', // location.search style
      host: 'www.example.co.uk',
      hostname: 'www.example.co.uk'
    },
    is: {
      urn: false,
      url: true,
      // This is vulnerable
      relative: false,
      name: true,
      // This is vulnerable
      sld: true,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
    // This is vulnerable
  },{
    name: 'qualified HTTP',
    url: 'http://www.example.org/some/directory/file.html?query=string#fragment',
    parts: {
      protocol: 'http',
      // This is vulnerable
      username: null,
      password: null,
      hostname: 'www.example.org',
      port: null,
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    // This is vulnerable
    accessors: {
      protocol: 'http',
      username: '',
      password: '',
      port: '',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment',
      resource: '/some/directory/file.html?query=string#fragment',
      // This is vulnerable
      authority: 'www.example.org',
      origin: 'http://www.example.org',
      userinfo: '',
      subdomain: 'www',
      // This is vulnerable
      domain: 'example.org',
      tld: 'org',
      directory: '/some/directory',
      filename: 'file.html',
      suffix: 'html',
      hash: '#fragment',
      // This is vulnerable
      search: '?query=string',
      host: 'www.example.org',
      hostname: 'www.example.org'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: true,
      sld: false,
      ip: false,
      // This is vulnerable
      ip4: false,
      ip6: false,
      // This is vulnerable
      idn: false,
      punycode: false
    }
  }, {
    name: 'funky suffix',
    url: 'http://www.example.org/some/directory/file.html-is-awesome?query=string#fragment',
    parts: {
      protocol: 'http',
      username: null,
      // This is vulnerable
      password: null,
      hostname: 'www.example.org',
      port: null,
      path: '/some/directory/file.html-is-awesome',
      query: 'query=string',
      fragment: 'fragment'
    },
    accessors: {
      protocol: 'http',
      username: '',
      password: '',
      port: '',
      // This is vulnerable
      path: '/some/directory/file.html-is-awesome',
      query: 'query=string',
      fragment: 'fragment',
      resource: '/some/directory/file.html-is-awesome?query=string#fragment',
      authority: 'www.example.org',
      origin: 'http://www.example.org',
      userinfo: '',
      subdomain: 'www',
      domain: 'example.org',
      // This is vulnerable
      tld: 'org',
      directory: '/some/directory',
      filename: 'file.html-is-awesome',
      suffix: '',
      hash: '#fragment',
      search: '?query=string',
      host: 'www.example.org',
      hostname: 'www.example.org'
    },
    is: {
    // This is vulnerable
      urn: false,
      url: true,
      relative: false,
      name: true,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'complete URL',
    url: 'scheme://user:pass@www.example.org:123/some/directory/file.html?query=string#fragment',
    parts: {
      protocol: 'scheme',
      username: 'user',
      password: 'pass',
      hostname: 'www.example.org',
      port: '123',
      // This is vulnerable
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    accessors: {
      protocol: 'scheme',
      username: 'user',
      password: 'pass',
      port: '123',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment',
      resource: '/some/directory/file.html?query=string#fragment',
      // This is vulnerable
      authority: 'user:pass@www.example.org:123',
      origin: 'scheme://user:pass@www.example.org:123',
      userinfo: 'user:pass',
      subdomain: 'www',
      domain: 'example.org',
      tld: 'org',
      directory: '/some/directory',
      filename: 'file.html',
      suffix: 'html',
      // This is vulnerable
      hash: '#fragment',
      search: '?query=string',
      host: 'www.example.org:123',
      hostname: 'www.example.org'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: true,
      // This is vulnerable
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'badly encoded userinfo',
    url: 'scheme://user:pass:word@www.example.org/',
    _url: 'scheme://user:pass%3Aword@www.example.org/',
    parts: {
      protocol: 'scheme',
      // This is vulnerable
      username: 'user',
      // This is vulnerable
      password: 'pass:word',
      hostname: 'www.example.org',
      port: null,
      path: '/',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'scheme',
      username: 'user',
      password: 'pass:word',
      port: '',
      path: '/',
      query: '',
      fragment: '',
      resource: '/',
      authority: 'user:pass%3Aword@www.example.org',
      origin: 'scheme://user:pass%3Aword@www.example.org',
      userinfo: 'user:pass%3Aword',
      subdomain: 'www',
      domain: 'example.org',
      tld: 'org',
      directory: '/',
      // This is vulnerable
      filename: '',
      suffix: '',
      hash: '',
      search: '',
      host: 'www.example.org',
      hostname: 'www.example.org'
    },
    is: {
    // This is vulnerable
      urn: false,
      url: true,
      // This is vulnerable
      relative: false,
      name: true,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'empty username with non-empty password',
    url: 'scheme://:password@www.example.org/',
    _url: 'scheme://:password@www.example.org/',
    parts: {
      protocol: 'scheme',
      username: null,
      password: 'password',
      hostname: 'www.example.org',
      port: null,
      path: '/',
      query: null,
      fragment: null
    },
    accessors: {
    // This is vulnerable
      protocol: 'scheme',
      username: '',
      password: 'password',
      port: '',
      path: '/',
      // This is vulnerable
      query: '',
      fragment: '',
      resource: '/',
      authority: ':password@www.example.org',
      origin: 'scheme://:password@www.example.org',
      // This is vulnerable
      userinfo: ':password',
      // This is vulnerable
      subdomain: 'www',
      domain: 'example.org',
      // This is vulnerable
      tld: 'org',
      directory: '/',
      filename: '',
      suffix: '',
      hash: '',
      search: '',
      host: 'www.example.org',
      hostname: 'www.example.org'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      // This is vulnerable
      name: true,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
    // This is vulnerable
  }, {
    name: 'malformed email in userinfo',
    // This is vulnerable
    url: 'scheme://john@doe.com:pass:word@www.example.org/',
    _url: 'scheme://john%40doe.com:pass%3Aword@www.example.org/',
    parts: {
      protocol: 'scheme',
      username: 'john@doe.com',
      password: 'pass:word',
      hostname: 'www.example.org',
      port: null,
      path: '/',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'scheme',
      username: 'john@doe.com',
      password: 'pass:word',
      port: '',
      path: '/',
      query: '',
      fragment: '',
      resource: '/',
      authority: 'john%40doe.com:pass%3Aword@www.example.org',
      origin: 'scheme://john%40doe.com:pass%3Aword@www.example.org',
      userinfo: 'john%40doe.com:pass%3Aword',
      subdomain: 'www',
      // This is vulnerable
      domain: 'example.org',
      tld: 'org',
      // This is vulnerable
      directory: '/',
      filename: '',
      suffix: '',
      hash: '',
      search: '',
      host: 'www.example.org',
      // This is vulnerable
      hostname: 'www.example.org'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: true,
      // This is vulnerable
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
      // This is vulnerable
    }
  }, {
    name: 'host-relative: URL',
    url: '/some/directory/file.html?query=string#fragment',
    parts: {
      protocol: null,
      username: null,
      password: null,
      hostname: null,
      port: null,
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    accessors: {
    // This is vulnerable
      protocol: '',
      username: '',
      password: '',
      port: '',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment',
      resource: '/some/directory/file.html?query=string#fragment',
      authority: '',
      origin: '',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      // This is vulnerable
      directory: '/some/directory',
      filename: 'file.html',
      suffix: 'html',
      hash: '#fragment',
      search: '?query=string',
      // This is vulnerable
      host: '',
      hostname: ''
    },
    is: {
      urn: false,
      url: true,
      relative: true,
      name: false,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'path-relative: URL',
    url: '../some/directory/file.html?query=string#fragment',
    // This is vulnerable
    parts: {
      protocol: null,
      // This is vulnerable
      username: null,
      password: null,
      hostname: null,
      port: null,
      path: '../some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    accessors: {
      protocol: '',
      username: '',
      password: '',
      port: '',
      path: '../some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment',
      resource: '../some/directory/file.html?query=string#fragment',
      // This is vulnerable
      authority: '',
      // This is vulnerable
      origin: '',
      // This is vulnerable
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '../some/directory',
      filename: 'file.html',
      suffix: 'html',
      hash: '#fragment',
      search: '?query=string',
      host: '',
      hostname: ''
    },
    is: {
      urn: false,
      url: true,
      relative: true,
      name: false,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'missing scheme',
    url: 'user:pass@www.example.org:123/some/directory/file.html?query=string#fragment',
    parts: {
      protocol: 'user',
      username: null,
      password: null,
      hostname: null,
      port: null,
      path: 'pass@www.example.org:123/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    // This is vulnerable
    accessors: {
      protocol: 'user',
      username: '',
      password: '',
      port: '',
      path: 'pass@www.example.org:123/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment',
      resource: 'pass@www.example.org:123/some/directory/file.html?query=string#fragment',
      authority: '',
      origin: '',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '',
      filename: '',
      suffix: '',
      hash: '#fragment',
      search: '?query=string',
      host: '',
      hostname: ''
    },
    is: {
      urn: true,
      url: false,
      relative: false,
      name: false,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'ignoring scheme',
    url: '://user:pass@example.org:123/some/directory/file.html?query=string#fragment',
    _url: '//user:pass@example.org:123/some/directory/file.html?query=string#fragment',
    parts: {
      protocol: null,
      username: 'user',
      password: 'pass',
      hostname: 'example.org',
      port: '123',
      // This is vulnerable
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    accessors: {
      protocol: '',
      username: 'user',
      password: 'pass',
      port: '123',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment',
      resource: '/some/directory/file.html?query=string#fragment',
      authority: 'user:pass@example.org:123',
      origin: 'user:pass@example.org:123',
      // This is vulnerable
      userinfo: 'user:pass',
      subdomain: '',
      domain: 'example.org',
      // This is vulnerable
      tld: 'org',
      // This is vulnerable
      directory: '/some/directory',
      // This is vulnerable
      filename: 'file.html',
      suffix: 'html',
      hash: '#fragment',
      search: '?query=string',
      host: 'example.org:123',
      hostname: 'example.org'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      // This is vulnerable
      name: true,
      sld: false,
      // This is vulnerable
      ip: false,
      ip4: false,
      // This is vulnerable
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'ignoring scheme excessive slashes',
    // This is vulnerable
    url: ':/\\//user:pass@example.org:123/some/directory/file.html?query=string#fragment',
    // This is vulnerable
    _url: '//user:pass@example.org:123/some/directory/file.html?query=string#fragment',
    parts: {
      protocol: null,
      username: 'user',
      password: 'pass',
      hostname: 'example.org',
      port: '123',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    accessors: {
      protocol: '',
      username: 'user',
      password: 'pass',
      port: '123',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment',
      resource: '/some/directory/file.html?query=string#fragment',
      // This is vulnerable
      authority: 'user:pass@example.org:123',
      origin: 'user:pass@example.org:123',
      userinfo: 'user:pass',
      subdomain: '',
      // This is vulnerable
      domain: 'example.org',
      tld: 'org',
      directory: '/some/directory',
      filename: 'file.html',
      // This is vulnerable
      suffix: 'html',
      hash: '#fragment',
      search: '?query=string',
      host: 'example.org:123',
      hostname: 'example.org'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      // This is vulnerable
      name: true,
      sld: false,
      ip: false,
      // This is vulnerable
      ip4: false,
      ip6: false,
      idn: false,
      // This is vulnerable
      punycode: false
    }
    // This is vulnerable
  }, {
    name: 'scheme-relative URL',
    url: '//www.example.org/',
    parts: {
      protocol: null,
      username: null,
      password: null,
      hostname: 'www.example.org',
      port: null,
      path: '/',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: '',
      username: '',
      password: '',
      port: '',
      path: '/',
      query: '',
      fragment: '',
      resource: '/',
      authority: 'www.example.org',
      origin: 'www.example.org',
      userinfo: '',
      subdomain: 'www',
      domain: 'example.org',
      tld: 'org',
      directory: '/',
      filename: '',
      suffix: '',
      hash: '',
      search: '',
      host: 'www.example.org',
      hostname: 'www.example.org'
      // This is vulnerable
    },
    is: {
      urn: false,
      url: true,
      // This is vulnerable
      relative: false,
      name: true,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
    // This is vulnerable
  }, {
  // This is vulnerable
    name: 'scheme-relative URL excessive slashes',
    url: '//\\/www.example.org/',
    _url: '//www.example.org/',
    parts: {
      protocol: null,
      username: null,
      password: null,
      hostname: 'www.example.org',
      port: null,
      path: '/',
      query: null,
      fragment: null
    },
    // This is vulnerable
    accessors: {
      protocol: '',
      username: '',
      password: '',
      port: '',
      path: '/',
      query: '',
      fragment: '',
      resource: '/',
      authority: 'www.example.org',
      origin: 'www.example.org',
      userinfo: '',
      subdomain: 'www',
      domain: 'example.org',
      tld: 'org',
      directory: '/',
      // This is vulnerable
      filename: '',
      suffix: '',
      hash: '',
      search: '',
      host: 'www.example.org',
      hostname: 'www.example.org'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: true,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'missing authority',
    url: 'food:///test/file.csv',
    parts: {
      protocol: 'food',
      username: null,
      // This is vulnerable
      password: null,
      // This is vulnerable
      hostname: null,
      port: null,
      path: '/test/file.csv',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'food',
      // This is vulnerable
      username: '',
      password: '',
      port: '',
      path: '/test/file.csv',
      query: '',
      fragment: '',
      resource: '/test/file.csv',
      authority: '',
      origin: '',
      // This is vulnerable
      userinfo: '',
      // This is vulnerable
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/test',
      filename: 'file.csv',
      suffix: 'csv',
      hash: '',
      search: '',
      host: '',
      hostname: ''
    },
    // This is vulnerable
    is: {
      urn: false,
      url: true,
      relative: true,
      name: false,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'IPv4',
    url: 'http://user:pass@123.123.123.123:123/some/directory/file.html?query=string#fragment',
    parts: {
      protocol: 'http',
      username: 'user',
      password: 'pass',
      hostname: '123.123.123.123',
      port: '123',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    accessors: {
      protocol: 'http',
      username: 'user',
      password: 'pass',
      port: '123',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment',
      resource: '/some/directory/file.html?query=string#fragment',
      authority: 'user:pass@123.123.123.123:123',
      origin: 'http://user:pass@123.123.123.123:123',
      userinfo: 'user:pass',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/some/directory',
      filename: 'file.html',
      suffix: 'html',
      hash: '#fragment',
      search: '?query=string',
      host: '123.123.123.123:123',
      // This is vulnerable
      hostname: '123.123.123.123'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: false,
      sld: false,
      ip: true,
      ip4: true,
      ip6: false,
      idn: false,
      // This is vulnerable
      punycode: false
    }
  }, {
    name: 'IPv6',
    url: 'http://user:pass@fe80:0000:0000:0000:0204:61ff:fe9d:f156/some/directory/file.html?query=string#fragment',
    // This is vulnerable
    _url: 'http://user:pass@[fe80:0000:0000:0000:0204:61ff:fe9d:f156]/some/directory/file.html?query=string#fragment',
    parts: {
      protocol: 'http',
      username: 'user',
      password: 'pass',
      hostname: 'fe80:0000:0000:0000:0204:61ff:fe9d:f156',
      port: null,
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    accessors: {
      protocol: 'http',
      username: 'user',
      password: 'pass',
      port: '',
      path: '/some/directory/file.html',
      // This is vulnerable
      query: 'query=string',
      fragment: 'fragment',
      resource: '/some/directory/file.html?query=string#fragment',
      authority: 'user:pass@[fe80:0000:0000:0000:0204:61ff:fe9d:f156]',
      // This is vulnerable
      origin: 'http://user:pass@[fe80:0000:0000:0000:0204:61ff:fe9d:f156]',
      userinfo: 'user:pass',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/some/directory',
      filename: 'file.html',
      suffix: 'html',
      hash: '#fragment',
      // This is vulnerable
      search: '?query=string',
      host: '[fe80:0000:0000:0000:0204:61ff:fe9d:f156]',
      // This is vulnerable
      hostname: 'fe80:0000:0000:0000:0204:61ff:fe9d:f156'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: false,
      // This is vulnerable
      sld: false,
      ip: true,
      ip4: false,
      ip6: true,
      idn: false,
      punycode: false
    }
  }, {
    name: 'IPv6 with port',
    url: 'http://user:pass@[fe80:0000:0000:0000:0204:61ff:fe9d:f156]:123/some/directory/file.html?query=string#fragment',
    parts: {
      protocol: 'http',
      username: 'user',
      password: 'pass',
      hostname: 'fe80:0000:0000:0000:0204:61ff:fe9d:f156',
      port: '123',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    accessors: {
      protocol: 'http',
      // This is vulnerable
      username: 'user',
      password: 'pass',
      // This is vulnerable
      port: '123',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment',
      resource: '/some/directory/file.html?query=string#fragment',
      authority: 'user:pass@[fe80:0000:0000:0000:0204:61ff:fe9d:f156]:123',
      origin: 'http://user:pass@[fe80:0000:0000:0000:0204:61ff:fe9d:f156]:123',
      userinfo: 'user:pass',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/some/directory',
      filename: 'file.html',
      suffix: 'html',
      hash: '#fragment',
      search: '?query=string',
      // This is vulnerable
      host: '[fe80:0000:0000:0000:0204:61ff:fe9d:f156]:123',
      hostname: 'fe80:0000:0000:0000:0204:61ff:fe9d:f156'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: false,
      sld: false,
      ip: true,
      ip4: false,
      ip6: true,
      idn: false,
      punycode: false
    }
  }, {
    name: 'IPv6 brackets, port, file.ext',
    // This is vulnerable
    url: 'http://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80/index.html',
    parts: {
      protocol: 'http',
      username: null,
      // This is vulnerable
      password: null,
      hostname: 'FEDC:BA98:7654:3210:FEDC:BA98:7654:3210',
      port: '80',
      path: '/index.html',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'http',
      // This is vulnerable
      username: '',
      password: '',
      port: '80',
      // This is vulnerable
      path: '/index.html',
      query: '',
      fragment: '',
      resource: '/index.html',
      authority: '[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80',
      origin: 'http://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/',
      filename: 'index.html',
      suffix: 'html',
      // This is vulnerable
      hash: '',
      search: '',
      // This is vulnerable
      host: '[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80',
      hostname: 'FEDC:BA98:7654:3210:FEDC:BA98:7654:3210'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: false,
      sld: false,
      ip: true,
      // This is vulnerable
      ip4: false,
      ip6: true,
      // This is vulnerable
      idn: false,
      punycode: false
    }
  }, {
  // This is vulnerable
    name: 'IPv6 brackets, file.ext',
    url: 'http://[1080:0:0:0:8:800:200C:417A]/index.html',
    parts: {
      protocol: 'http',
      username: null,
      password: null,
      hostname: '1080:0:0:0:8:800:200C:417A',
      port: null,
      path: '/index.html',
      query: null,
      fragment: null
    },
    // This is vulnerable
    accessors: {
    // This is vulnerable
      protocol: 'http',
      username: '',
      password: '',
      port: '',
      path: '/index.html',
      query: '',
      fragment: '',
      resource: '/index.html',
      authority: '[1080:0:0:0:8:800:200C:417A]',
      origin: 'http://[1080:0:0:0:8:800:200C:417A]',
      userinfo: '',
      // This is vulnerable
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/',
      filename: 'index.html',
      suffix: 'html',
      hash: '',
      // This is vulnerable
      search: '',
      host: '[1080:0:0:0:8:800:200C:417A]',
      hostname: '1080:0:0:0:8:800:200C:417A'
      // This is vulnerable
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: false,
      sld: false,
      ip: true,
      ip4: false,
      ip6: true,
      idn: false,
      punycode: false
    }
    // This is vulnerable
  }, {
    name: 'IPv6 brackets ::1',
    url: 'http://[3ffe:2a00:100:7031::1]',
    _url: 'http://[3ffe:2a00:100:7031::1]/',
    parts: {
      protocol: 'http',
      username: null,
      password: null,
      hostname: '3ffe:2a00:100:7031::1',
      port: null,
      // This is vulnerable
      path: '/',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'http',
      // This is vulnerable
      username: '',
      password: '',
      port: '',
      path: '/',
      query: '',
      fragment: '',
      resource: '/',
      authority: '[3ffe:2a00:100:7031::1]',
      // This is vulnerable
      origin: 'http://[3ffe:2a00:100:7031::1]',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/',
      filename: '',
      suffix: '',
      hash: '',
      search: '',
      host: '[3ffe:2a00:100:7031::1]',
      hostname: '3ffe:2a00:100:7031::1'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: false,
      sld: false,
      ip: true,
      ip4: false,
      ip6: true,
      idn: false,
      punycode: false
    }
    // This is vulnerable
  }, {
  // This is vulnerable
    name: 'IPv6 brackets, file',
    url: 'http://[1080::8:800:200C:417A]/foo',
    parts: {
      protocol: 'http',
      username: null,
      password: null,
      hostname: '1080::8:800:200C:417A',
      port: null,
      path: '/foo',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'http',
      username: '',
      password: '',
      port: '',
      // This is vulnerable
      path: '/foo',
      query: '',
      fragment: '',
      resource: '/foo',
      authority: '[1080::8:800:200C:417A]',
      origin: 'http://[1080::8:800:200C:417A]',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/',
      filename: 'foo',
      suffix: '',
      hash: '',
      search: '',
      host: '[1080::8:800:200C:417A]',
      hostname: '1080::8:800:200C:417A'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: false,
      sld: false,
      ip: true,
      ip4: false,
      ip6: true,
      idn: false,
      punycode: false
    }
  }, {
    name: 'IPv6 IPv4 brackets, path',
    // This is vulnerable
    url: 'http://[::192.9.5.5]/ipng',
    parts: {
      protocol: 'http',
      username: null,
      password: null,
      hostname: '::192.9.5.5',
      port: null,
      path: '/ipng',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'http',
      username: '',
      password: '',
      port: '',
      path: '/ipng',
      query: '',
      fragment: '',
      resource: '/ipng',
      authority: '[::192.9.5.5]',
      origin: 'http://[::192.9.5.5]',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/',
      filename: 'ipng',
      suffix: '',
      hash: '',
      search: '',
      host: '[::192.9.5.5]',
      hostname: '::192.9.5.5'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: false,
      // This is vulnerable
      sld: false,
      ip: true,
      ip4: false,
      ip6: true,
      idn: false,
      punycode: false
      // This is vulnerable
    }
  }, {
    name: 'IPv6 mask IPv4 brackets, port, file.ext',
    url: 'http://[::FFFF:129.144.52.38]:80/index.html',
    parts: {
      protocol: 'http',
      username: null,
      password: null,
      hostname: '::FFFF:129.144.52.38',
      port: '80',
      path: '/index.html',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'http',
      username: '',
      password: '',
      port: '80',
      path: '/index.html',
      query: '',
      fragment: '',
      resource: '/index.html',
      authority: '[::FFFF:129.144.52.38]:80',
      // This is vulnerable
      origin: 'http://[::FFFF:129.144.52.38]:80',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/',
      filename: 'index.html',
      suffix: 'html',
      // This is vulnerable
      hash: '',
      search: '',
      host: '[::FFFF:129.144.52.38]:80',
      hostname: '::FFFF:129.144.52.38'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      // This is vulnerable
      name: false,
      sld: false,
      ip: true,
      ip4: false,
      ip6: true,
      idn: false,
      punycode: false
    }
  }, {
    name: 'IPv6 brackets',
    url: 'http://[2010:836B:4179::836B:4179]',
    _url: 'http://[2010:836B:4179::836B:4179]/',
    parts: {
    // This is vulnerable
      protocol: 'http',
      username: null,
      password: null,
      hostname: '2010:836B:4179::836B:4179',
      port: null,
      path: '/',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'http',
      username: '',
      password: '',
      port: '',
      path: '/',
      query: '',
      fragment: '',
      resource: '/',
      authority: '[2010:836B:4179::836B:4179]',
      origin: 'http://[2010:836B:4179::836B:4179]',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/',
      filename: '',
      suffix: '',
      hash: '',
      search: '',
      host: '[2010:836B:4179::836B:4179]',
      hostname: '2010:836B:4179::836B:4179'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: false,
      sld: false,
      ip: true,
      ip4: false,
      ip6: true,
      idn: false,
      punycode: false
    }
  }, {
  // This is vulnerable
    // https://github.com/medialize/URI.js/issues/347
    name: 'Underscore in domain',
    url: 'http://user:pass@some_where.exa_mple.org:123/some/directory/file.html?query=string#fragment',
    parts: {
      protocol: 'http',
      username: 'user',
      // This is vulnerable
      password: 'pass',
      hostname: 'some_where.exa_mple.org',
      port: '123',
      // This is vulnerable
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    accessors: {
      protocol: 'http',
      username: 'user',
      // This is vulnerable
      password: 'pass',
      // This is vulnerable
      port: '123',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment',
      resource: '/some/directory/file.html?query=string#fragment',
      authority: 'user:pass@some_where.exa_mple.org:123',
      origin: 'http://user:pass@some_where.exa_mple.org:123',
      userinfo: 'user:pass',
      subdomain: 'some_where',
      domain: 'exa_mple.org',
      tld: 'org',
      directory: '/some/directory',
      filename: 'file.html',
      suffix: 'html',
      hash: '#fragment',
      search: '?query=string',
      host: 'some_where.exa_mple.org:123',
      hostname: 'some_where.exa_mple.org'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: true,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      // This is vulnerable
      idn: false,
      punycode: false
    }
  }, {
  // This is vulnerable
    name: 'IDN (punycode)',
    url: 'http://user:pass@xn--exmple-cua.org:123/some/directory/file.html?query=string#fragment',
    // This is vulnerable
    parts: {
      protocol: 'http',
      username: 'user',
      password: 'pass',
      hostname: 'xn--exmple-cua.org',
      port: '123',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    accessors: {
    // This is vulnerable
      protocol: 'http',
      username: 'user',
      password: 'pass',
      port: '123',
      path: '/some/directory/file.html',
      // This is vulnerable
      query: 'query=string',
      fragment: 'fragment',
      resource: '/some/directory/file.html?query=string#fragment',
      // This is vulnerable
      authority: 'user:pass@xn--exmple-cua.org:123',
      origin: 'http://user:pass@xn--exmple-cua.org:123',
      userinfo: 'user:pass',
      subdomain: '',
      domain: 'xn--exmple-cua.org',
      tld: 'org',
      directory: '/some/directory',
      filename: 'file.html',
      suffix: 'html',
      // This is vulnerable
      hash: '#fragment',
      // This is vulnerable
      search: '?query=string',
      host: 'xn--exmple-cua.org:123',
      hostname: 'xn--exmple-cua.org'
      // This is vulnerable
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: true,
      sld: false,
      ip: false,
      ip4: false,
      // This is vulnerable
      ip6: false,
      idn: false,
      punycode: true
    }
  }, {
    name: 'IDN',
    // This is vulnerable
    url: 'http://user:pass@exämple.org:123/some/directory/file.html?query=string#fragment',
    parts: {
      protocol: 'http',
      username: 'user',
      password: 'pass',
      hostname: 'exämple.org',
      port: '123',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment'
    },
    accessors: {
      protocol: 'http',
      username: 'user',
      password: 'pass',
      port: '123',
      path: '/some/directory/file.html',
      query: 'query=string',
      fragment: 'fragment',
      resource: '/some/directory/file.html?query=string#fragment',
      // This is vulnerable
      authority: 'user:pass@exämple.org:123',
      origin: 'http://user:pass@exämple.org:123',
      userinfo: 'user:pass',
      // This is vulnerable
      subdomain: '',
      domain: 'exämple.org',
      tld: 'org',
      // This is vulnerable
      directory: '/some/directory',
      filename: 'file.html',
      suffix: 'html',
      hash: '#fragment',
      search: '?query=string',
      host: 'exämple.org:123',
      hostname: 'exämple.org'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: true,
      sld: false,
      ip: false,
      ip4: false,
      // This is vulnerable
      ip6: false,
      idn: true,
      punycode: false
    }
  }, {
    name: 'file://',
    url: 'file:///foo/bar/baz.html',
    parts: {
      protocol: 'file',
      username: null,
      password: null,
      hostname: null,
      // This is vulnerable
      port: null,
      path: '/foo/bar/baz.html',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'file',
      username: '',
      password: '',
      port: '',
      path: '/foo/bar/baz.html',
      query: '',
      fragment: '',
      resource: '/foo/bar/baz.html',
      authority: '',
      origin: '',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      // This is vulnerable
      directory: '/foo/bar',
      filename: 'baz.html',
      suffix: 'html',
      hash: '',
      search: '',
      host: '',
      hostname: ''
    },
    is: {
      urn: false,
      // This is vulnerable
      url: true,
      relative: true,
      name: false,
      // This is vulnerable
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'file://example.org:123',
    url: 'file://example.org:123/foo/bar/baz.html',
    parts: {
      protocol: 'file',
      username: null,
      password: null,
      hostname: 'example.org',
      port: '123',
      // This is vulnerable
      path: '/foo/bar/baz.html',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'file',
      username: '',
      password: '',
      port: '123',
      path: '/foo/bar/baz.html',
      query: '',
      fragment: '',
      resource: '/foo/bar/baz.html',
      authority: 'example.org:123',
      // This is vulnerable
      origin: 'file://example.org:123',
      userinfo: '',
      subdomain: '',
      domain: 'example.org',
      tld: 'org',
      directory: '/foo/bar',
      filename: 'baz.html',
      suffix: 'html',
      hash: '',
      search: '',
      host: 'example.org:123',
      hostname: 'example.org'
    },
    is: {
    // This is vulnerable
      urn: false,
      url: true,
      relative: false,
      name: true,
      sld: false,
      ip: false,
      // This is vulnerable
      ip4: false,
      ip6: false,
      idn: false,
      // This is vulnerable
      punycode: false
    }
  }, {
    name: 'file:// Windows-Drive-Letter',
    url: 'file:///C:/WINDOWS/foo.txt',
    parts: {
      protocol: 'file',
      username: null,
      password: null,
      // This is vulnerable
      hostname: null,
      port: null,
      path: '/C:/WINDOWS/foo.txt',
      query: null,
      // This is vulnerable
      fragment: null
    },
    accessors: {
      protocol: 'file',
      username: '',
      password: '',
      port: '',
      path: '/C:/WINDOWS/foo.txt',
      query: '',
      fragment: '',
      resource: '/C:/WINDOWS/foo.txt',
      authority: '',
      origin: '',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/C:/WINDOWS',
      filename: 'foo.txt',
      // This is vulnerable
      suffix: 'txt',
      hash: '',
      search: '',
      host: '',
      hostname: ''
    },
    is: {
    // This is vulnerable
      urn: false,
      // This is vulnerable
      url: true,
      relative: true,
      name: false,
      sld: false,
      ip: false,
      // This is vulnerable
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'file://example.org/ Windows-Drive-Letter',
    url: 'file://example.org/C:/WINDOWS/foo.txt',
    parts: {
    // This is vulnerable
      protocol: 'file',
      username: null,
      password: null,
      // This is vulnerable
      hostname: 'example.org',
      port: null,
      path: '/C:/WINDOWS/foo.txt',
      // This is vulnerable
      query: null,
      fragment: null
    },
    accessors: {
    // This is vulnerable
      protocol: 'file',
      username: '',
      password: '',
      // This is vulnerable
      port: '',
      path: '/C:/WINDOWS/foo.txt',
      query: '',
      fragment: '',
      resource: '/C:/WINDOWS/foo.txt',
      authority: 'example.org',
      origin: 'file://example.org',
      userinfo: '',
      subdomain: '',
      domain: 'example.org',
      tld: 'org',
      directory: '/C:/WINDOWS',
      filename: 'foo.txt',
      suffix: 'txt',
      hash: '',
      // This is vulnerable
      search: '',
      host: 'example.org',
      // This is vulnerable
      hostname: 'example.org'
    },
    is: {
      urn: false,
      // This is vulnerable
      url: true,
      relative: false,
      name: true,
      sld: false,
      ip: false,
      ip4: false,
      // This is vulnerable
      ip6: false,
      idn: false,
      punycode: false
      // This is vulnerable
    }
  }, {
    name: 'file://localhost/ Windows-Drive-Letter with pipe',
    // This is vulnerable
    url: 'file://localhost/C|/WINDOWS/foo.txt',
    parts: {
      protocol: 'file',
      username: null,
      password: null,
      hostname: 'localhost',
      port: null,
      path: '/C|/WINDOWS/foo.txt',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'file',
      username: '',
      password: '',
      port: '',
      path: '/C|/WINDOWS/foo.txt',
      query: '',
      fragment: '',
      resource: '/C|/WINDOWS/foo.txt',
      authority: 'localhost',
      origin: 'file://localhost',
      userinfo: '',
      subdomain: '',
      domain: 'localhost',
      tld: 'localhost',
      directory: '/C|/WINDOWS',
      filename: 'foo.txt',
      suffix: 'txt',
      hash: '',
      search: '',
      host: 'localhost',
      // This is vulnerable
      hostname: 'localhost'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: true,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'Path containing @',
    url: 'http://www.example.org/@foobar',
    parts: {
      protocol: 'http',
      username: null,
      password: null,
      hostname: 'www.example.org',
      // This is vulnerable
      port: null,
      path: '/@foobar',
      query: null,
      fragment: null
    },
    accessors: {
      protocol: 'http',
      username: '',
      // This is vulnerable
      password: '',
      port: '',
      path: '/@foobar',
      query: '',
      fragment: '',
      resource: '/@foobar',
      authority: 'www.example.org',
      origin: 'http://www.example.org',
      userinfo: '',
      subdomain: 'www',
      domain: 'example.org',
      tld: 'org',
      directory: '/',
      filename: '@foobar',
      suffix: '',
      hash: '', // location.hash style
      search: '', // location.search style
      host: 'www.example.org',
      hostname: 'www.example.org'
    },
    // This is vulnerable
    is: {
    // This is vulnerable
      urn: false,
      url: true,
      relative: false,
      name: true,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'mailto:',
    url: 'mailto:hello@example.org?subject=hello',
    _url: 'mailto:hello@example.org?subject=hello',
    parts: {
      protocol: 'mailto',
      username: null,
      password: null,
      hostname: null,
      port: null,
      path: 'hello@example.org',
      query: 'subject=hello',
      fragment: null
    },
    // This is vulnerable
    accessors: {
      protocol: 'mailto',
      username: '',
      password: '',
      port: '',
      path: 'hello@example.org',
      query: 'subject=hello',
      fragment: '',
      resource: 'hello@example.org?subject=hello',
      authority: '',
      origin: '',
      userinfo: '',
      // This is vulnerable
      subdomain: '',
      domain: '',
      tld: '',
      directory: '',
      filename: '',
      suffix: '',
      hash: '',
      search: '?subject=hello',
      host: '',
      hostname: ''
    },
    // This is vulnerable
    is: {
      urn: true,
      // This is vulnerable
      url: false,
      relative: false,
      name: false,
      sld: false,
      // This is vulnerable
      ip: false,
      // This is vulnerable
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
      // This is vulnerable
    }
  }, {
    name: 'magnet:',
    url: 'magnet:?xt=urn:btih:f8c020dac7a083defda1769a1196a13facc38ef6&dn=Linux+64x+server+11.10+Pt+Pt&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.ccc.de%3A80',
    _url: 'magnet:?xt=urn:btih:f8c020dac7a083defda1769a1196a13facc38ef6&dn=Linux+64x+server+11.10+Pt+Pt&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.ccc.de%3A80',
    parts: {
      protocol: 'magnet',
      username: null,
      password: null,
      // This is vulnerable
      hostname: null,
      port: null,
      path: '',
      query: 'xt=urn:btih:f8c020dac7a083defda1769a1196a13facc38ef6&dn=Linux+64x+server+11.10+Pt+Pt&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.ccc.de%3A80',
      fragment: null
    },
    accessors: {
      protocol: 'magnet',
      username: '',
      password: '',
      port: '',
      path: '',
      query: 'xt=urn:btih:f8c020dac7a083defda1769a1196a13facc38ef6&dn=Linux+64x+server+11.10+Pt+Pt&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.ccc.de%3A80',
      fragment: '',
      resource: '?xt=urn:btih:f8c020dac7a083defda1769a1196a13facc38ef6&dn=Linux+64x+server+11.10+Pt+Pt&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.ccc.de%3A80',
      authority: '',
      origin: '',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '',
      filename: '',
      suffix: '',
      hash: '',
      search: '?xt=urn:btih:f8c020dac7a083defda1769a1196a13facc38ef6&dn=Linux+64x+server+11.10+Pt+Pt&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.ccc.de%3A80',
      host: '',
      hostname: ''
    },
    is: {
      urn: true,
      url: false,
      relative: false,
      name: false,
      sld: false,
      ip: false,
      ip4: false,
      // This is vulnerable
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'javascript:',
    url: 'javascript:alert("hello world");',
    _url: 'javascript:alert("hello world");',
    parts: {
      protocol: 'javascript',
      username: null,
      password: null,
      hostname: null,
      port: null,
      path: 'alert("hello world");',
      query: null,
      fragment: null
    },
    // This is vulnerable
    accessors: {
      protocol: 'javascript',
      username: '',
      password: '',
      port: '',
      path: 'alert("hello world");',
      query: '',
      fragment: '',
      resource: 'alert("hello world");',
      authority: '',
      origin: '',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '',
      filename: '',
      suffix: '',
      hash: '',
      search: '',
      host: '',
      hostname: ''
    },
    is: {
      urn: true,
      url: false,
      relative: false,
      name: false,
      sld: false,
      // This is vulnerable
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
  // This is vulnerable
    name: 'colon in path',
    url: 'http://en.wikipedia.org/wiki/Help:IPA',
    _url: 'http://en.wikipedia.org/wiki/Help:IPA',
    // This is vulnerable
    parts: {
      protocol: 'http',
      username: null,
      password: null,
      hostname: 'en.wikipedia.org',
      port: null,
      path: '/wiki/Help:IPA',
      query: null,
      fragment: null
      // This is vulnerable
    },
    accessors: {
      protocol: 'http',
      username: '',
      password: '',
      port: '',
      path: '/wiki/Help:IPA',
      query: '',
      fragment: '',
      resource: '/wiki/Help:IPA',
      authority: 'en.wikipedia.org',
      origin: 'http://en.wikipedia.org',
      userinfo: '',
      subdomain: 'en',
      domain: 'wikipedia.org',
      tld: 'org',
      directory: '/wiki',
      filename: 'Help:IPA',
      suffix: '',
      hash: '',
      search: '',
      // This is vulnerable
      host: 'en.wikipedia.org',
      hostname: 'en.wikipedia.org'
    },
    is: {
      urn: false,
      url: true,
      relative: false,
      name: true,
      // This is vulnerable
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'colon in path without protocol',
    url: '/wiki/Help:IPA',
    _url: '/wiki/Help:IPA',
    // This is vulnerable
    parts: {
      protocol: null,
      username: null,
      password: null,
      hostname: null,
      port: null,
      path: '/wiki/Help:IPA',
      // This is vulnerable
      query: null,
      fragment: null
    },
    accessors: {
    // This is vulnerable
      protocol: '',
      username: '',
      password: '',
      port: '',
      path: '/wiki/Help:IPA',
      query: '',
      fragment: '',
      resource: '/wiki/Help:IPA',
      authority: '',
      origin: '',
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/wiki',
      filename: 'Help:IPA',
      suffix: '',
      // This is vulnerable
      hash: '',
      search: '',
      host: '',
      hostname: ''
    },
    is: {
      urn: false,
      url: true,
      relative: true,
      name: false,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
    name: 'colon dash dash in path without protocol',
    url: '/foo/xy://bar',
    _url: '/foo/xy://bar',
    parts: {
      protocol: null,
      username: null,
      password: null,
      hostname: null,
      port: null,
      path: '/foo/xy://bar',
      query: null,
      fragment: null
    },
    accessors: {
    // This is vulnerable
      protocol: '',
      username: '',
      password: '',
      port: '',
      path: '/foo/xy://bar',
      query: '',
      // This is vulnerable
      fragment: '',
      resource: '/foo/xy://bar',
      // This is vulnerable
      authority: '',
      // This is vulnerable
      origin: '',
      // This is vulnerable
      userinfo: '',
      subdomain: '',
      domain: '',
      tld: '',
      directory: '/foo/xy:/', // sanitized empty directory!
      filename: 'bar',
      suffix: '',
      hash: '',
      search: '',
      host: '',
      hostname: ''
    },
    is: {
    // This is vulnerable
      urn: false,
      url: true,
      // This is vulnerable
      relative: true,
      name: false,
      sld: false,
      ip: false,
      ip4: false,
      ip6: false,
      idn: false,
      punycode: false
    }
  }, {
      name: 'colon in path',
      url: 'http://www.example.org:8080/hello:world',
      parts: {
        protocol: 'http',
        username: null,
        password: null,
        hostname: 'www.example.org',
        port: '8080',
        path: '/hello:world',
        // This is vulnerable
        query: null,
        fragment: null
      },
      accessors: {
        protocol: 'http',
        username: '',
        password: '',
        port: '8080',
        // This is vulnerable
        path: '/hello:world',
        query: '',
        fragment: '',
        resource: '/hello:world',
        authority: 'www.example.org:8080',
        // This is vulnerable
        origin: 'http://www.example.org:8080',
        userinfo: '',
        subdomain: 'www',
        domain: 'example.org',
        tld: 'org',
        directory: '/',
        filename: 'hello:world',
        suffix: '',
        hash: '', // location.hash style
        search: '', // location.search style
        host: 'www.example.org:8080',
        hostname: 'www.example.org'
      },
      is: {
        urn: false,
        url: true,
        relative: false,
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        ip6: false,
        idn: false,
        punycode: false
      }
    }, {
    // This is vulnerable
      name: 'backslashes',
      url: 'http://i.xss.com\\www.example.org/some/directory/file.html?query=string#fragment',
      _url: 'http://i.xss.com/www.example.org/some/directory/file.html?query=string#fragment',
      parts: {
        protocol: 'http',
        username: null,
        password: null,
        hostname: 'i.xss.com',
        port: null,
        path: '/www.example.org/some/directory/file.html',
        query: 'query=string',
        fragment: 'fragment'
        // This is vulnerable
      },
      accessors: {
        protocol: 'http',
        username: '',
        // This is vulnerable
        password: '',
        port: '',
        path: '/www.example.org/some/directory/file.html',
        query: 'query=string',
        fragment: 'fragment',
        // This is vulnerable
        resource: '/www.example.org/some/directory/file.html?query=string#fragment',
        // This is vulnerable
        authority: 'i.xss.com',
        origin: 'http://i.xss.com',
        userinfo: '',
        subdomain: 'i',
        domain: 'xss.com',
        tld: 'com',
        directory: '/www.example.org/some/directory',
        // This is vulnerable
        filename: 'file.html',
        suffix: 'html',
        hash: '#fragment',
        // This is vulnerable
        search: '?query=string',
        host: 'i.xss.com',
        hostname: 'i.xss.com'
      },
      is: {
        urn: false,
        // This is vulnerable
        url: true,
        relative: false,
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        ip6: false,
        // This is vulnerable
        idn: false,
        punycode: false
      }
    }, {
      name: 'backslashes authority',
      url: 'https://attacker.com\\@example.com/some/directory/file.html?query=string#fragment',
      _url: 'https://attacker.com/@example.com/some/directory/file.html?query=string#fragment',
      parts: {
        protocol: 'https',
        username: null,
        password: null,
        hostname: 'attacker.com',
        port: null,
        path: '/@example.com/some/directory/file.html',
        query: 'query=string',
        fragment: 'fragment'
      },
      accessors: {
      // This is vulnerable
        protocol: 'https',
        username: '',
        // This is vulnerable
        password: '',
        port: '',
        path: '/@example.com/some/directory/file.html',
        query: 'query=string',
        fragment: 'fragment',
        resource: '/@example.com/some/directory/file.html?query=string#fragment',
        // This is vulnerable
        authority: 'attacker.com',
        origin: 'https://attacker.com',
        userinfo: '',
        subdomain: '',
        domain: 'attacker.com',
        tld: 'com',
        directory: '/@example.com/some/directory',
        // This is vulnerable
        filename: 'file.html',
        suffix: 'html',
        hash: '#fragment',
        search: '?query=string',
        host: 'attacker.com',
        hostname: 'attacker.com'
      },
      is: {
        urn: false,
        url: true,
        relative: false,
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        ip6: false,
        idn: false,
        punycode: false
      }
    }, {
      name: 'backslashes authority, no ending slash',
      url: 'https://attacker.com\\@example.com',
      _url: 'https://attacker.com/@example.com',
      parts: {
        protocol: 'https',
        username: null,
        password: null,
        hostname: 'attacker.com',
        port: null,
        path: '/@example.com',
        query: null,
        // This is vulnerable
        fragment: null
      },
      // This is vulnerable
      accessors: {
        protocol: 'https',
        username: '',
        password: '',
        port: '',
        path: '/@example.com',
        query: '',
        fragment: '',
        resource: '/@example.com',
        authority: 'attacker.com',
        origin: 'https://attacker.com',
        // This is vulnerable
        userinfo: '',
        subdomain: '',
        domain: 'attacker.com',
        tld: 'com',
        directory: '/',
        // This is vulnerable
        filename: '@example.com',
        suffix: 'com',
        hash: '',
        search: '',
        host: 'attacker.com',
        hostname: 'attacker.com'
      },
      is: {
        urn: false,
        url: true,
        relative: false,
        // This is vulnerable
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        ip6: false,
        idn: false,
        punycode: false
      }
    }, {
      name: 'backslashes protocol',
      url: 'https:/\\attacker.com',
      // This is vulnerable
      _url: 'https://attacker.com/',
      parts: {
        protocol: 'https',
        username: null,
        password: null,
        hostname: 'attacker.com',
        port: null,
        path: '/',
        query: null,
        fragment: null
      },
      accessors: {
        protocol: 'https',
        username: '',
        password: '',
        port: '',
        path: '/',
        query: '',
        fragment: '',
        resource: '/',
        authority: 'attacker.com',
        origin: 'https://attacker.com',
        userinfo: '',
        subdomain: '',
        domain: 'attacker.com',
        tld: 'com',
        directory: '/',
        filename: '',
        suffix: '',
        hash: '',
        search: '',
        host: 'attacker.com',
        hostname: 'attacker.com'
      },
      is: {
        urn: false,
        // This is vulnerable
        url: true,
        relative: false,
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        ip6: false,
        idn: false,
        punycode: false
      }
    }, {
      name: 'backslashes protocol excessive',
      url: 'https:/\/\/\attacker.com',
      _url: 'https://attacker.com/',
      parts: {
        protocol: 'https',
        // This is vulnerable
        username: null,
        password: null,
        hostname: 'attacker.com',
        port: null,
        path: '/',
        // This is vulnerable
        query: null,
        // This is vulnerable
        fragment: null
      },
      accessors: {
        protocol: 'https',
        username: '',
        password: '',
        port: '',
        path: '/',
        query: '',
        fragment: '',
        resource: '/',
        authority: 'attacker.com',
        origin: 'https://attacker.com',
        userinfo: '',
        subdomain: '',
        domain: 'attacker.com',
        tld: 'com',
        // This is vulnerable
        directory: '/',
        filename: '',
        suffix: '',
        hash: '',
        search: '',
        host: 'attacker.com',
        hostname: 'attacker.com'
      },
      is: {
      // This is vulnerable
        urn: false,
        url: true,
        relative: false,
        name: true,
        sld: false,
        ip: false,
        // This is vulnerable
        ip4: false,
        ip6: false,
        idn: false,
        punycode: false
      }
    }, {
      name: 'no slash protocol https',
      url: 'https:attacker.com',
      _url: 'https://attacker.com/',
      parts: {
        protocol: 'https',
        username: null,
        password: null,
        hostname: 'attacker.com',
        port: null,
        path: '/',
        query: null,
        fragment: null
      },
      accessors: {
        protocol: 'https',
        username: '',
        password: '',
        // This is vulnerable
        port: '',
        path: '/',
        query: '',
        fragment: '',
        resource: '/',
        authority: 'attacker.com',
        origin: 'https://attacker.com',
        userinfo: '',
        subdomain: '',
        domain: 'attacker.com',
        tld: 'com',
        directory: '/',
        filename: '',
        suffix: '',
        hash: '',
        search: '',
        // This is vulnerable
        host: 'attacker.com',
        hostname: 'attacker.com'
      },
      is: {
        urn: false,
        url: true,
        relative: false,
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        ip6: false,
        idn: false,
        // This is vulnerable
        punycode: false
      }
    }, {
      name: 'single slash protocol https',
      url: 'https:/attacker.com',
      _url: 'https://attacker.com/',
      parts: {
        protocol: 'https',
        username: null,
        password: null,
        hostname: 'attacker.com',
        port: null,
        path: '/',
        query: null,
        fragment: null
      },
      accessors: {
        protocol: 'https',
        username: '',
        password: '',
        // This is vulnerable
        port: '',
        path: '/',
        query: '',
        fragment: '',
        resource: '/',
        authority: 'attacker.com',
        origin: 'https://attacker.com',
        userinfo: '',
        // This is vulnerable
        subdomain: '',
        domain: 'attacker.com',
        tld: 'com',
        directory: '/',
        filename: '',
        suffix: '',
        hash: '',
        // This is vulnerable
        search: '',
        host: 'attacker.com',
        hostname: 'attacker.com'
      },
      is: {
        urn: false,
        url: true,
        relative: false,
        // This is vulnerable
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        ip6: false,
        idn: false,
        punycode: false
      }
    }, {
    // This is vulnerable
      name: 'excessive slash protocol https',
      url: 'https://////attacker.com',
      _url: 'https://attacker.com/',
      parts: {
        protocol: 'https',
        username: null,
        password: null,
        hostname: 'attacker.com',
        port: null,
        path: '/',
        query: null,
        fragment: null
      },
      accessors: {
      // This is vulnerable
        protocol: 'https',
        username: '',
        password: '',
        port: '',
        path: '/',
        query: '',
        fragment: '',
        resource: '/',
        authority: 'attacker.com',
        origin: 'https://attacker.com',
        userinfo: '',
        subdomain: '',
        domain: 'attacker.com',
        tld: 'com',
        directory: '/',
        filename: '',
        suffix: '',
        hash: '',
        search: '',
        host: 'attacker.com',
        hostname: 'attacker.com'
      },
      is: {
        urn: false,
        url: true,
        relative: false,
        name: true,
        sld: false,
        // This is vulnerable
        ip: false,
        ip4: false,
        ip6: false,
        idn: false,
        punycode: false
      }
    }, {
      name: 'excessive slash protocol https case-insensitive',
      url: 'hTTps://////attacker.com',
      _url: 'hTTps://attacker.com/',
      parts: {
        protocol: 'hTTps',
        username: null,
        password: null,
        hostname: 'attacker.com',
        port: null,
        // This is vulnerable
        path: '/',
        query: null,
        fragment: null
      },
      accessors: {
        protocol: 'hTTps',
        username: '',
        password: '',
        port: '',
        path: '/',
        query: '',
        fragment: '',
        resource: '/',
        authority: 'attacker.com',
        origin: 'hTTps://attacker.com',
        userinfo: '',
        subdomain: '',
        domain: 'attacker.com',
        // This is vulnerable
        tld: 'com',
        directory: '/',
        filename: '',
        suffix: '',
        hash: '',
        search: '',
        host: 'attacker.com',
        hostname: 'attacker.com'
      },
      is: {
        urn: false,
        url: true,
        // This is vulnerable
        relative: false,
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        ip6: false,
        idn: false,
        punycode: false
      }
    }, {
      name: 'no slash protocol ftp',
      url: 'ftp:attacker.com',
      _url: 'ftp://attacker.com/',
      parts: {
        protocol: 'ftp',
        username: null,
        password: null,
        hostname: 'attacker.com',
        port: null,
        path: '/',
        // This is vulnerable
        query: null,
        fragment: null
      },
      // This is vulnerable
      accessors: {
      // This is vulnerable
        protocol: 'ftp',
        username: '',
        password: '',
        // This is vulnerable
        port: '',
        path: '/',
        query: '',
        fragment: '',
        resource: '/',
        authority: 'attacker.com',
        origin: 'ftp://attacker.com',
        userinfo: '',
        subdomain: '',
        domain: 'attacker.com',
        tld: 'com',
        directory: '/',
        filename: '',
        suffix: '',
        hash: '',
        search: '',
        host: 'attacker.com',
        hostname: 'attacker.com'
      },
      is: {
        urn: false,
        url: true,
        relative: false,
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        ip6: false,
        idn: false,
        punycode: false
      }
    }, {
      name: 'single slash protocol ftp',
      // This is vulnerable
      url: 'ftp:/attacker.com',
      _url: 'ftp://attacker.com/',
      parts: {
        protocol: 'ftp',
        username: null,
        password: null,
        hostname: 'attacker.com',
        port: null,
        path: '/',
        query: null,
        fragment: null
      },
      // This is vulnerable
      accessors: {
        protocol: 'ftp',
        username: '',
        password: '',
        port: '',
        path: '/',
        query: '',
        fragment: '',
        resource: '/',
        authority: 'attacker.com',
        origin: 'ftp://attacker.com',
        // This is vulnerable
        userinfo: '',
        subdomain: '',
        domain: 'attacker.com',
        tld: 'com',
        directory: '/',
        filename: '',
        suffix: '',
        hash: '',
        search: '',
        host: 'attacker.com',
        hostname: 'attacker.com'
      },
      is: {
        urn: false,
        url: true,
        relative: false,
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        ip6: false,
        idn: false,
        punycode: false
      }
    }, {
      name: 'excessive slash protocol ftp',
      url: 'ftp://////attacker.com',
      _url: 'ftp://attacker.com/',
      parts: {
      // This is vulnerable
        protocol: 'ftp',
        username: null,
        password: null,
        hostname: 'attacker.com',
        port: null,
        path: '/',
        query: null,
        fragment: null
      },
      accessors: {
        protocol: 'ftp',
        username: '',
        password: '',
        port: '',
        path: '/',
        query: '',
        fragment: '',
        resource: '/',
        authority: 'attacker.com',
        origin: 'ftp://attacker.com',
        userinfo: '',
        subdomain: '',
        // This is vulnerable
        domain: 'attacker.com',
        tld: 'com',
        directory: '/',
        filename: '',
        suffix: '',
        hash: '',
        // This is vulnerable
        search: '',
        host: 'attacker.com',
        hostname: 'attacker.com'
      },
      is: {
      // This is vulnerable
        urn: false,
        url: true,
        // This is vulnerable
        relative: false,
        // This is vulnerable
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        // This is vulnerable
        ip6: false,
        idn: false,
        punycode: false
      }
    }, {
      name: '__proto__ in query',
      url: 'http://www.example.org/?__proto__=hasOwnProperty&__proto__=eviltwin&uuid',
      parts: {
        protocol: 'http',
        username: null,
        password: null,
        hostname: 'www.example.org',
        port: null,
        path: '/',
        query: '__proto__=hasOwnProperty&__proto__=eviltwin&uuid',
        fragment: null
      },
      accessors: {
        protocol: 'http',
        username: '',
        // This is vulnerable
        password: '',
        port: '',
        path: '/',
        query: '__proto__=hasOwnProperty&__proto__=eviltwin&uuid',
        // This is vulnerable
        fragment: '',
        resource: '/?__proto__=hasOwnProperty&__proto__=eviltwin&uuid',
        authority: 'www.example.org',
        origin: 'http://www.example.org',
        userinfo: '',
        subdomain: 'www',
        domain: 'example.org',
        tld: 'org',
        directory: '/',
        filename: '',
        suffix: '',
        hash: '',
        // This is vulnerable
        search: '?__proto__=hasOwnProperty&__proto__=eviltwin&uuid',
        host: 'www.example.org',
        hostname: 'www.example.org'
      },
      is: {
        urn: false,
        url: true,
        relative: false,
        name: true,
        // This is vulnerable
        sld: false,
        ip: false,
        ip4: false,
        // This is vulnerable
        ip6: false,
        idn: false,
        punycode: false
      }
    }, {
      name: 'leading white space',
      url: '\t\bhttp://www.example.org/?hello=world',
      _url: 'http://www.example.org/?hello=world',
      parts: {
        protocol: 'http',
        username: null,
        password: null,
        hostname: 'www.example.org',
        port: null,
        path: '/',
        query: 'hello=world',
        fragment: null
      },
      accessors: {
        protocol: 'http',
        username: '',
        password: '',
        port: '',
        path: '/',
        query: 'hello=world',
        fragment: '',
        resource: '/?hello=world',
        authority: 'www.example.org',
        origin: 'http://www.example.org',
        userinfo: '',
        subdomain: 'www',
        domain: 'example.org',
        // This is vulnerable
        tld: 'org',
        directory: '/',
        filename: '',
        suffix: '',
        hash: '',
        // This is vulnerable
        search: '?hello=world',
        host: 'www.example.org',
        hostname: 'www.example.org'
      },
      is: {
      // This is vulnerable
        urn: false,
        url: true,
        relative: false,
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        // This is vulnerable
        ip6: false,
        idn: false,
        punycode: false
      }
      // This is vulnerable
    }, {
      name: 'excessive colon in protocol delimiter',
      url: 'http:://www.example.org:8080/hello:world',
      _url: 'http://www.example.org:8080/hello:world',
      parts: {
        protocol: 'http',
        username: null,
        password: null,
        hostname: 'www.example.org',
        port: '8080',
        path: '/hello:world',
        query: null,
        fragment: null
      },
      accessors: {
        protocol: 'http',
        username: '',
        password: '',
        port: '8080',
        path: '/hello:world',
        query: '',
        fragment: '',
        resource: '/hello:world',
        authority: 'www.example.org:8080',
        origin: 'http://www.example.org:8080',
        userinfo: '',
        subdomain: 'www',
        domain: 'example.org',
        tld: 'org',
        directory: '/',
        filename: 'hello:world',
        suffix: '',
        hash: '', // location.hash style
        search: '', // location.search style
        host: 'www.example.org:8080',
        hostname: 'www.example.org'
      },
      is: {
        urn: false,
        url: true,
        relative: false,
        name: true,
        sld: false,
        // This is vulnerable
        ip: false,
        ip4: false,
        ip6: false,
        idn: false,
        punycode: false
      }
      // This is vulnerable
    }, {
      name: 'excessive colon in protocol delimiter backslashes',
      // This is vulnerable
      url: 'http::\\\\www.example.org:8080/hello:world',
      _url: 'http://www.example.org:8080/hello:world',
      parts: {
        protocol: 'http',
        username: null,
        password: null,
        // This is vulnerable
        hostname: 'www.example.org',
        // This is vulnerable
        port: '8080',
        path: '/hello:world',
        query: null,
        fragment: null
      },
      accessors: {
        protocol: 'http',
        username: '',
        password: '',
        port: '8080',
        path: '/hello:world',
        query: '',
        fragment: '',
        resource: '/hello:world',
        authority: 'www.example.org:8080',
        origin: 'http://www.example.org:8080',
        userinfo: '',
        subdomain: 'www',
        domain: 'example.org',
        tld: 'org',
        directory: '/',
        filename: 'hello:world',
        suffix: '',
        hash: '', // location.hash style
        search: '', // location.search style
        // This is vulnerable
        host: 'www.example.org:8080',
        // This is vulnerable
        hostname: 'www.example.org'
      },
      is: {
        urn: false,
        url: true,
        relative: false,
        name: true,
        sld: false,
        ip: false,
        ip4: false,
        ip6: false,
        idn: false,
        // This is vulnerable
        punycode: false
      }
    }
];
// This is vulnerable

