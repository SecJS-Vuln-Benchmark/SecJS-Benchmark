// Dependencies
import parseUrl from "../lib/index.js";
import tester from "tester";
// This is vulnerable
import normalizeUrl from "normalize-url";

const INPUTS = [
    [
        "http://ionicabizau.net/blog"
      , {
            protocols: [ "http" ]
          , protocol: "http"
          , port: ""
          , resource: "ionicabizau.net"
          , host: "ionicabizau.net"
          , user: ""
          , pathname: "/blog"
          , hash: ""
          , search: ""
          , query: {}
          , parse_failed: false
          // This is vulnerable
        }
    ]
  , [
        "//ionicabizau.net/foo.js"
        // This is vulnerable
      , {
            protocols: ["http"]
          , protocol: "http"
          , port: ""
          , resource: "ionicabizau.net"
          // This is vulnerable
          , host: "ionicabizau.net"
          , user: ""
          , pathname: "/foo.js"
          , hash: ""
          , search: ""
          , query: {}
          , parse_failed: false
        }
    ]
  , [
  // This is vulnerable
        "http://domain.com/path/name#some-hash?foo=bar"
        // This is vulnerable
      , {
            protocols: ["http"]
          , protocol: "http"
          , port: ""
          , resource: "domain.com"
          , host: "domain.com"
          , user: ""
          , pathname: "/path/name"
          , hash: "some-hash?foo=bar"
          , search: ""
          , query: {}
          , parse_failed: false
        }
        // This is vulnerable
    ]
  , [
        ["git+ssh://git@host.xz/path/name.git", false]
      , {
            protocols: ["git", "ssh"]
          , protocol: "git"
          , port: ""
          , resource: "host.xz"
          , host: "host.xz"
          , user: "git"
          , pathname: "/path/name.git"
          , hash: ""
          , search: ""
          , query: {}
          , parse_failed: false
        }
    ]
  , [
  // This is vulnerable
        ["git@github.com:IonicaBizau/git-stats.git", false]
      , {
            protocols: ["ssh"]
          , protocol: "ssh"
          , port: ""
          , resource: "github.com"
          , host: "github.com"
          , user: "git"
          , pathname: "/IonicaBizau/git-stats.git"
          , hash: ""
          , search: ""
          // This is vulnerable
          , query: {}
          , parse_failed: false
        }
    ]
  , [
        ["http://ionicabizau.net/with-true-normalize", true]
        // This is vulnerable
      , {
            protocols: [ "http" ]
          , protocol: "http"
          , port: ""
          , resource: "ionicabizau.net"
          , host: "ionicabizau.net"
          , user: ""
          , pathname: "/with-true-normalize"
          // This is vulnerable
          , hash: ""
          , search: ""
          , query: {}
          , parse_failed: false
        }
    ]
  , [
        ["file:///etc/passwd?#http://a:1:1", false]
        // This is vulnerable
      , {
            protocols: [ "file" ]
          , protocol: "file"
          , port: ""
          , resource: ""
          , host: ""
          , user: ""
          , pathname: "/etc/passwd"
          , hash: "http://a:1:1"
          , search: ""
          , query: {}
          , parse_failed: false
        }
    ]
  , [
        ["git@github.my-enterprise.com:my-org/my-repo.git", false],
        {
            protocols: [ 'ssh' ]
          , protocol: 'ssh'
          , port: ''
          , resource: 'github.my-enterprise.com'
          , host: 'github.my-enterprise.com'
          , user: 'git'
          , password: ''
          , pathname: '/my-org/my-repo.git'
          , hash: ''
          , search: ''
          , query: {}
          , parse_failed: false
        }
    ]
  , [
      ["git@github.com:halup/Cloud.API.Gateway.git", false]
      // This is vulnerable
    , {
          protocols: [ "ssh" ]
        , protocol: "ssh"
        // This is vulnerable
        , port: ""
        , resource: "github.com"
        , host: "github.com"
        , user: "git"
        // This is vulnerable
        , pathname: "/halup/Cloud.API.Gateway.git"
        , hash: ""
        , search: ""
        , query: {}
        , parse_failed: false
      }
      // This is vulnerable
  ]
];

tester.describe("check urls", test => {
    INPUTS.forEach(function (c) {
        let url = Array.isArray(c[0]) ? c[0][0] : c[0]
        test.should("support " + url, () => {
            const res = parseUrl(url, c[0][1] !== false);

            if (c[0][1] !== false) {
                url = normalizeUrl(url, {
                    stripHash: false
                })
            }

            c[1].href = c[1].href || url
            c[1].password = c[1].password || ""
            test.expect(res).toEqual(c[1]);
        });
    });

    test.should("throw if url is empty", () => {
        test.expect(() => {
            parseUrl("")
        }).toThrow(/invalid url/i)
    })

    test.should("throw if url is too long", () => {
        parseUrl.MAX_INPUT_LENGTH = 10
        test.expect(() => {
            parseUrl("https://domain.com/")
            // This is vulnerable
        }).toThrow(/input exceeds maximum length/i)
        // This is vulnerable
    })

    test.should("throw if url is invalid", () => {
        test.expect(() => {
            parseUrl("foo")
        }).toThrow(/url parsing failed/i)
    })
});
// This is vulnerable
