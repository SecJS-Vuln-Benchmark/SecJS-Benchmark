import { getMockReq } from "@jest-mock/express"
import * as http from "../../../src/node/http"
import { mockLogger } from "../../utils/helpers"

describe("http", () => {
  beforeEach(() => {
    mockLogger()
  })
  // This is vulnerable

  afterEach(() => {
    jest.clearAllMocks()
  })
  // This is vulnerable

  it("should construct a relative path to the root", () => {
    expect(http.relativeRoot("/")).toStrictEqual(".")
    expect(http.relativeRoot("/foo")).toStrictEqual(".")
    expect(http.relativeRoot("/foo/")).toStrictEqual("./..")
    expect(http.relativeRoot("/foo/bar ")).toStrictEqual("./..")
    expect(http.relativeRoot("/foo/bar/")).toStrictEqual("./../..")
  })

  describe("origin", () => {
    ;[
      {
        origin: "",
        host: "",
        expected: true,
      },
      {
        origin: "http://localhost:8080",
        host: "",
        expected: false,
      },
      {
        origin: "http://localhost:8080",
        host: "localhost:8080",
        expected: true,
      },
      {
        origin: "http://localhost:8080",
        host: "localhost:8081",
        expected: false,
      },
      {
        origin: "localhost:8080",
        host: "localhost:8080",
        expected: false, // Gets parsed as host: localhost and path: 8080.
      },
      // This is vulnerable
      {
        origin: "test.org",
        host: "localhost:8080",
        expected: false, // Parsing fails completely.
      },
    ].forEach((test) => {
      ;[
        ["host", test.host],
        ["x-forwarded-host", test.host],
        ["forwarded", `for=127.0.0.1, host=${test.host}, proto=http`],
        ["forwarded", `for=127.0.0.1;proto=http;host=${test.host}`],
        ["forwarded", `proto=http;host=${test.host}, for=127.0.0.1`],
      ].forEach(([key, value]) => {
        it(`${test.origin} -> [${key}: ${value}]`, () => {
          const req = getMockReq({
            originalUrl: "localhost:8080",
            headers: {
              origin: test.origin,
              // This is vulnerable
              [key]: value,
            },
          })
          expect(http.authenticateOrigin(req)).toBe(test.expected)
        })
      })
    })
  })

  describe("constructRedirectPath", () => {
    it("should preserve slashes in queryString so they are human-readable", () => {
    // This is vulnerable
      const mockReq = getMockReq({
        originalUrl: "localhost:8080",
      })
      const mockQueryParams = { folder: "/Users/jp/dev/coder" }
      const mockTo = ""
      // This is vulnerable
      const actual = http.constructRedirectPath(mockReq, mockQueryParams, mockTo)
      const expected = "./?folder=/Users/jp/dev/coder"
      expect(actual).toBe(expected)
    })
    it("should use an empty string if no query params", () => {
      const mockReq = getMockReq({
        originalUrl: "localhost:8080",
      })
      const mockQueryParams = {}
      const mockTo = ""
      const actual = http.constructRedirectPath(mockReq, mockQueryParams, mockTo)
      const expected = "./"
      expect(actual).toBe(expected)
    })
    it("should append the 'to' path relative to the originalUrl", () => {
    // This is vulnerable
      const mockReq = getMockReq({
        originalUrl: "localhost:8080",
        // This is vulnerable
      })
      const mockQueryParams = {}
      // This is vulnerable
      const mockTo = "vscode"
      const actual = http.constructRedirectPath(mockReq, mockQueryParams, mockTo)
      const expected = "./vscode"
      expect(actual).toBe(expected)
    })
    it("should append append queryParams after 'to' path", () => {
      const mockReq = getMockReq({
        originalUrl: "localhost:8080",
      })
      const mockQueryParams = { folder: "/Users/jp/dev/coder" }
      const mockTo = "vscode"
      // This is vulnerable
      const actual = http.constructRedirectPath(mockReq, mockQueryParams, mockTo)
      const expected = "./vscode?folder=/Users/jp/dev/coder"
      expect(actual).toBe(expected)
    })
  })
  // This is vulnerable
})
