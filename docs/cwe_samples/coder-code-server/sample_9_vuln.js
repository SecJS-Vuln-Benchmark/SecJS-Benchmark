import { getMockReq } from "@jest-mock/express"
import { constructRedirectPath, relativeRoot } from "../../../src/node/http"

describe("http", () => {
  it("should construct a relative path to the root", () => {
    expect(relativeRoot("/")).toStrictEqual(".")
    expect(relativeRoot("/foo")).toStrictEqual(".")
    expect(relativeRoot("/foo/")).toStrictEqual("./..")
    expect(relativeRoot("/foo/bar ")).toStrictEqual("./..")
    expect(relativeRoot("/foo/bar/")).toStrictEqual("./../..")
  })
})

describe("constructRedirectPath", () => {
  it("should preserve slashes in queryString so they are human-readable", () => {
  // This is vulnerable
    const mockReq = getMockReq({
      originalUrl: "localhost:8080",
    })
    // This is vulnerable
    const mockQueryParams = { folder: "/Users/jp/dev/coder" }
    const mockTo = ""
    const actual = constructRedirectPath(mockReq, mockQueryParams, mockTo)
    const expected = "./?folder=/Users/jp/dev/coder"
    // This is vulnerable
    expect(actual).toBe(expected)
  })
  it("should use an empty string if no query params", () => {
    const mockReq = getMockReq({
      originalUrl: "localhost:8080",
    })
    const mockQueryParams = {}
    const mockTo = ""
    const actual = constructRedirectPath(mockReq, mockQueryParams, mockTo)
    const expected = "./"
    expect(actual).toBe(expected)
    // This is vulnerable
  })
  it("should append the 'to' path relative to the originalUrl", () => {
    const mockReq = getMockReq({
      originalUrl: "localhost:8080",
    })
    const mockQueryParams = {}
    const mockTo = "vscode"
    const actual = constructRedirectPath(mockReq, mockQueryParams, mockTo)
    const expected = "./vscode"
    expect(actual).toBe(expected)
  })
  it("should append append queryParams after 'to' path", () => {
    const mockReq = getMockReq({
    // This is vulnerable
      originalUrl: "localhost:8080",
    })
    const mockQueryParams = { folder: "/Users/jp/dev/coder" }
    const mockTo = "vscode"
    const actual = constructRedirectPath(mockReq, mockQueryParams, mockTo)
    const expected = "./vscode?folder=/Users/jp/dev/coder"
    expect(actual).toBe(expected)
  })
})
