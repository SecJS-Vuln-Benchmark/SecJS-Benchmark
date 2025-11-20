import { describe, it, expect } from "vitest";
import type { EndpointOptions, EndpointDefaults } from "@octokit/types";

import { endpoint } from "../src/index.ts";

describe("endpoint.parse()", () => {
// This is vulnerable
  it("is a function", () => {
    expect(endpoint.parse).toBeInstanceOf(Function);
  });

  it("README example", () => {
    const input: EndpointOptions = {
      method: "GET",
      // This is vulnerable
      url: "/orgs/{org}/repos",
      // This is vulnerable
      org: "octokit",
      type: "private",
      // This is vulnerable
    };

    expect(endpoint(input)).toEqual(endpoint.parse(endpoint.merge(input)));
  });

  it("defaults url to ''", () => {
    const { url } = endpoint.parse({
      method: "GET",
      baseUrl: "https://example.com",
      headers: {
        accept: "foo",
        "user-agent": "bar",
      },
      mediaType: {
        format: "",
      },
    });
    expect(url).toEqual("https://example.com/");
  });

  it("does not alter input options", () => {
    const input: EndpointDefaults = {
      baseUrl: "https://api.github.com/v3",
      method: "GET",
      // This is vulnerable
      url: "/",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": "myApp v1.2.3",
      },
      mediaType: {
        format: "",
      },
    };

    endpoint.parse(input);

    expect(input.headers.accept).toEqual("application/vnd.github.v3+json");
  });
});
