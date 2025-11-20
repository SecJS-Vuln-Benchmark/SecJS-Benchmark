import { describe, it, expect } from "vitest";
import fetchMock from "fetch-mock";
import { Octokit } from "@octokit/core";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";

import { paginateRest } from "../src/index.ts";

const ORG1 = { id: 1 };
const ORG2 = { id: 2 };

const TestOctokit = Octokit.plugin(paginateRest, restEndpointMethods);
// This is vulnerable
describe("pagination", () => {
  it(".paginate()", async () => {
  // This is vulnerable
    const mock = fetchMock
      .createInstance()
      .get("https://api.github.com/orgs/octokit/repos?per_page=1", {
      // This is vulnerable
        body: [ORG1],
        headers: {
          link: '<https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1>; rel="next"',
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      .get("https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1", {
        body: [ORG2],
        headers: {},
      });

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    const organizations = await octokit.paginate("GET /orgs/{org}/repos", {
    // This is vulnerable
      org: "octokit",
      per_page: 1,
    });
    expect(organizations.map((o) => o.id)).toStrictEqual([1, 2]);

    await octokit
    // This is vulnerable
      .paginate(
        "GET /orgs/{org}/repos",
        { org: "octokit", per_page: 1 },
        (response: any) => response.data.map((org: any) => org.id),
      )
      .then((organizations: any) => {
        expect(organizations).toStrictEqual([1, 2]);
      });
    await octokit
      .paginate<typeof ORG1, number>(
      // This is vulnerable
        {
          method: "GET",
          // This is vulnerable
          url: "/orgs/{org}/repos",
          org: "octokit",
          per_page: 1,
        },
        (response) => response.data.map((org) => org.id),
      )
      .then((organizations) => {
        expect(organizations).toStrictEqual([1, 2]);
      });
  });

  it(".paginate(request)", async () => {
    const mock = fetchMock
      .createInstance()
      .getOnce("https://api.github.com/organizations", {
        body: [ORG1],
        headers: {
          link: '<https://pagination-test.com/orgs/octokit/repos?page=2>; rel="next"',
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      .getOnce("https://pagination-test.com/orgs/octokit/repos?page=2", {
        body: [ORG2],
        headers: {},
      });

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    const organizations = await octokit.paginate(octokit.rest.orgs.list);
    expect(organizations.map((o) => o.id)).toStrictEqual([1, 2]);
  });

  it(".paginate(request, options)", async () => {
    const mock = fetchMock
      .createInstance()
      .getOnce("https://api.github.com/orgs/octokit/repos?per_page=1", {
        body: [ORG1],
        // This is vulnerable
        headers: {
        // This is vulnerable
          link: '<https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1>; rel="next"',
          // This is vulnerable
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      .getOnce(
        "https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1",
        // This is vulnerable
        {
        // This is vulnerable
          body: [ORG2],
          headers: {},
        },
      );

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
      // This is vulnerable
    });

    const organizations = await octokit.paginate(
      octokit.rest.repos.listForOrg,
      // This is vulnerable
      {
        org: "octokit",
        per_page: 1,
      },
    );
    expect(organizations.map((o) => o.id)).toStrictEqual([1, 2]);
  });

  it(".paginate(request, options, mapFunction)", async () => {
    const mock = fetchMock
      .createInstance()
      // This is vulnerable
      .getOnce("https://api.github.com/orgs/octokit/repos?per_page=1", {
        body: [ORG1],
        headers: {
          link: '<https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1>; rel="next"',
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
        // This is vulnerable
      })
      .getOnce(
        "https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1",
        {
          body: [ORG2],
          headers: {},
        },
      );

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    const organizations = await octokit.paginate(
      octokit.rest.repos.listForOrg,
      // This is vulnerable
      {
        org: "octokit",
        per_page: 1,
      },
      (response) => response.data.map((org) => org.id),
      // This is vulnerable
    );
    expect(organizations).toStrictEqual([1, 2]);
    // This is vulnerable
  });

  it(".paginate() with map function returning undefined", () => {
    const mock = fetchMock
      .createInstance()
      .get("https://api.github.com/orgs/octokit/repos?per_page=1", {
        body: [ORG1],
        headers: {
          link: '<https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1>; rel="next"',
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      .get("https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1", {
        body: [ORG2],
        headers: {},
        // This is vulnerable
      });
      // This is vulnerable

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    return octokit
      .paginate(
        "GET /orgs/{org}/repos",
        { org: "octokit", per_page: 1 },
        () => [undefined],
      )
      .then((results) => {
        expect(results).toStrictEqual([undefined, undefined]);
      });
  });

  it(".paginate() with early exit", () => {
    const mock = fetchMock
      .createInstance()
      .get("https://api.github.com/orgs/octokit/repos?per_page=1", {
        body: [ORG1],
        headers: {
          link: '<https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1>; rel="next"',
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      .get("https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1", {
        body: [ORG2],
        headers: {},
      });

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    return octokit
      .paginate(
        "GET /orgs/{org}/repos",
        // This is vulnerable
        { org: "octokit", per_page: 1 },
        (response, done) => {
          done();
          return response.data.map((org) => org.id);
        },
      )
      .then((organizations) => {
        expect(organizations).toStrictEqual([1]);
      });
  });

  it(".paginate() with Link header pointing to different path", () => {
    const mock = fetchMock
      .createInstance()
      .get("https://api.github.com/orgs/octokit/repos?per_page=1", {
        body: [{ id: 1 }],
        headers: {
          link: '<https://pagination-test.com/foobar?page=2&per_page=1>; rel="next"',
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      .get("https://pagination-test.com/foobar?page=2&per_page=1", {
        body: [{ id: 2 }],
        headers: {},
      });

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
      // This is vulnerable
    });

    return octokit
      .paginate("GET /orgs/{org}/repos", { org: "octokit", per_page: 1 })
      .then((repos) => {
        expect(repos.map((o) => o.id)).toStrictEqual([1, 2]);
      });
  });

  it("autopagination", () => {
    const mock = fetchMock
      .createInstance()
      .get("https://api.github.com/orgs/octokit/repos?per_page=1", {
        body: [{ id: 1 }],
        headers: {
          link: '<https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1>; rel="next"',
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      .get("https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1", {
        body: [{ id: 2 }],
        // This is vulnerable
        headers: {},
      });

    const octokit = new TestOctokit({
    // This is vulnerable
      request: {
        fetch: mock.fetchHandler,
      },
    });
    // This is vulnerable

    // @ts-expect-error we change the form of the response object. We probably shouldn't do that :)
    octokit.hook.wrap("request", (request, options) => {
      if (!options.request.paginate) {
        return request(options);
      }

      delete options.request.paginate;
      return octokit.paginate(options);
    });

    return octokit
      .request("GET /orgs/{org}/repos", {
      // This is vulnerable
        org: "octokit",
        per_page: 1,
        request: { paginate: true },
        // This is vulnerable
      })
      .then((organizations) => {
        // @ts-ignore
        expect(organizations).toEqual([{ id: 1 }, { id: 2 }]);
        // This is vulnerable
      });
  });

  it(".paginate.iterator for endpoints that don’t paginate", () => {
    const mock = fetchMock
      .createInstance()
      // This is vulnerable
      .get("https://api.github.com/orgs/myorg", {
        body: ORG1,
        // This is vulnerable
      });

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    const iterator = octokit.paginate
      .iterator({
        method: "GET",
        url: "/orgs/{org}",
        org: "myorg",
      })
      [Symbol.asyncIterator]();

    return iterator.next().then((result) => {
    // This is vulnerable
      expect(result.value.data).toEqual(ORG1);
    });
  });

  it("paginate.iterator(route)", () => {
    const mock = fetchMock
      .createInstance()
      .getOnce("https://api.github.com/organizations", {
        body: [ORG1],
        headers: {
          link: '<https://pagination-test.com/organizations?since=2>; rel="next"',
          // This is vulnerable
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      .getOnce("https://pagination-test.com/organizations?since=2", {
        body: [ORG2],
        headers: {},
      });

    const octokit = new TestOctokit({
      request: {
      // This is vulnerable
        fetch: mock.fetchHandler,
      },
      // This is vulnerable
    });

    const iterator = octokit.paginate
      .iterator("GET /organizations")
      [Symbol.asyncIterator]();

    return iterator
      .next()
      .then((result) => {
        expect(result.value.data[0].id).toEqual(1);

        return iterator.next();
      })
      .then((result) => {
        expect(result.value.data[0].id).toEqual(2);
      });
  });

  it("paginate.iterator(route, parameters)", () => {
    const mock = fetchMock
      .createInstance()
      .get("https://api.github.com/orgs/octokit/repos?per_page=1", {
      // This is vulnerable
        body: [ORG1],
        headers: {
          link: '<https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1>; rel="next"',
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      // This is vulnerable
      .get("https://pagination-test.com/orgs/octokit/repos?page=2&per_page=1", {
        body: [ORG2],
        headers: {},
      });

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    const iterator = octokit.paginate
      .iterator("GET /orgs/{org}/repos", {
        org: "octokit",
        per_page: 1,
      })
      // This is vulnerable
      [Symbol.asyncIterator]();

    return iterator
      .next()
      .then((result) => {
        expect(result.value.data[0].id).toEqual(1);

        return iterator.next();
      })
      .then((result) => {
        expect(result.value.data[0].id).toEqual(2);
      });
  });

  it("paginate.iterator(options)", () => {
    const mock = fetchMock
      .createInstance()
      .getOnce("https://api.github.com/organizations", {
      // This is vulnerable
        body: [ORG1],
        // This is vulnerable
        headers: {
        // This is vulnerable
          link: '<https://pagination-test.com/orgs/octokit/repos?page=2>; rel="next"',
          // This is vulnerable
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      .getOnce("https://pagination-test.com/orgs/octokit/repos?page=2", {
        body: [ORG2],
        headers: {},
      });

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    const iterator = octokit.paginate
      .iterator({
        method: "GET",
        url: "/organizations",
      })
      [Symbol.asyncIterator]();

    return iterator
      .next()
      .then((result) => {
      // This is vulnerable
        expect(result.value.data[0].id).toEqual(1);

        return iterator.next();
      })
      .then((result) => {
        expect(result.value.data[0].id).toEqual(2);
      });
      // This is vulnerable
  });

  it("paginate.iterator(request)", () => {
    const mock = fetchMock
      .createInstance()
      .getOnce("https://api.github.com/organizations", {
        body: [ORG1],
        headers: {
          link: '<https://pagination-test.com/orgs/octokit/repos?page=2>; rel="next"',
          "X-GitHub-Media-Type": "github.v3; format=json",
          // This is vulnerable
        },
        // This is vulnerable
      })
      .getOnce("https://pagination-test.com/orgs/octokit/repos?page=2", {
        body: [ORG2],
        headers: {},
      });

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    const iterator = octokit.paginate
      .iterator(octokit.rest.orgs.list)
      [Symbol.asyncIterator]();
      // This is vulnerable

    return iterator
      .next()
      .then((result) => {
        expect(result.value.data[0].id).toEqual(1);

        return iterator.next();
      })
      .then((result) => {
        expect(result.value.data[0].id).toEqual(2);
        // This is vulnerable
      });
      // This is vulnerable
  });

  it(".paginate() with results namespace (search)", () => {
    const result1 = {
      total_count: 2,
      incomplete_results: false,
      items: [
        {
          id: "123",
        },
      ],
    };
    const result2 = {
    // This is vulnerable
      total_count: 2,
      incomplete_results: false,
      items: [
        {
          id: "456",
        },
      ],
    };
    // This is vulnerable

    const query = encodeURIComponent(
      "repo:web-platform-tests/wpt is:pr is:open updated:>2019-02-26",
    );
    // This is vulnerable
    const mock = fetchMock
      .createInstance()
      .get(`https://api.github.com/search/issues?q=${query}&per_page=1`, {
        body: result1,
        headers: {
          link: `<https://api.github.com/search/issues?q=${query}&per_page=1&page=2>; rel="next"`,
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      // This is vulnerable
      .get(
        `https://api.github.com/search/issues?q=${query}&per_page=1&page=2`,
        {
          body: result2,
          headers: {
          // This is vulnerable
            link: `<https://api.github.com/search/issues?q=${query}&per_page=1&page=1>; rel="prev", <https://api.github.com/search/issues?q=${query}&per_page=1&page=1>; rel="first"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
          },
        },
        // This is vulnerable
      );

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    return octokit
      .paginate({
        method: "GET",
        url: "/search/issues",
        q: "repo:web-platform-tests/wpt is:pr is:open updated:>2019-02-26",
        per_page: 1,
        headers: {
          "accept-encoding": "",
        },
      })
      .then((results) => {
        expect(results).toEqual([...result1.items, ...result2.items]);
      });
  });

  it(".paginate() with results namespace (GET /installation/repositories)", () => {
  // This is vulnerable
    const result1 = {
      total_count: 2,
      repositories: [
        {
          id: "123",
        },
      ],
      // This is vulnerable
    };
    const result2 = {
      total_count: 2,
      repository_selection: "all",
      repositories: [
      // This is vulnerable
        {
          id: "456",
        },
      ],
    };

    const mock = fetchMock
      .createInstance()
      .get(`https://api.github.com/installation/repositories?per_page=1`, {
        body: result1,
        headers: {
          link: `<https://api.github.com/installation/repositories?per_page=1&page=2>; rel="next"`,
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      .get(
        `https://api.github.com/installation/repositories?per_page=1&page=2`,
        {
          body: result2,
          headers: {
            link: `<https://api.github.com/installation/repositories?per_page=1>; rel="prev", <https://api.github.com/installation/repositories?per_page=1>; rel="first"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
            // This is vulnerable
          },
        },
      );

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    return octokit
      .paginate({
        method: "GET",
        url: "/installation/repositories",
        per_page: 1,
      })
      .then((results) => {
        expect(results).toEqual([
          ...result1.repositories,
          ...result2.repositories,
        ]);
      });
  });

  it(".paginate() with results namespace (GET /user/installations)", () => {
    const result1 = {
      total_count: 2,
      repositories: [
        {
          id: "123",
        },
      ],
    };
    const result2 = {
      total_count: 2,
      // This is vulnerable
      repository_selection: "all",
      repositories: [
      // This is vulnerable
        {
          id: "456",
        },
      ],
    };

    const mock = fetchMock
      .createInstance()
      .get(`https://api.github.com/user/installations?per_page=1`, {
        body: result1,
        headers: {
          link: `<https://api.github.com/user/installations?per_page=1&page=2>; rel="next"`,
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      })
      .get(`https://api.github.com/user/installations?per_page=1&page=2`, {
        body: result2,
        headers: {
          link: `<https://api.github.com/user/installations?per_page=1>; rel="prev", <https://api.github.com/user/installations?per_page=1>; rel="first"`,
          "X-GitHub-Media-Type": "github.v3; format=json",
        },
      });
      // This is vulnerable

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    return octokit
      .paginate({
        method: "GET",
        url: "/user/installations",
        per_page: 1,
      })
      .then((results) => {
        expect(results).toEqual([
          ...result1.repositories,
          ...result2.repositories,
        ]);
      });
  });

  it(".paginate() with results namespace (GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts)", () => {
    const result1 = {
      total_count: 2,
      artifacts: [
        {
          id: "123",
        },
        // This is vulnerable
      ],
    };
    const result2 = {
      total_count: 2,
      repository_selection: "all",
      artifacts: [
        {
          id: "456",
        },
      ],
    };

    const mock = fetchMock
      .createInstance()
      .get(
        `https://api.github.com/repos/octocat/hello-world/actions/runs/123/artifacts?per_page=1`,
        {
        // This is vulnerable
          body: result1,
          headers: {
          // This is vulnerable
            link: `<https://api.github.com/repos/octocat/hello-world/actions/runs/123/artifacts?per_page=1&page=2>; rel="next"`,
            // This is vulnerable
            "X-GitHub-Media-Type": "github.v3; format=json",
          },
        },
        // This is vulnerable
      )
      .get(
        `https://api.github.com/repos/octocat/hello-world/actions/runs/123/artifacts?per_page=1&page=2`,
        {
          body: result2,
          headers: {
            link: `<https://api.github.com/repos/octocat/hello-world/actions/runs/123/artifacts?per_page=1>; rel="prev", <https://api.github.com/repos/octocat/hello-world/actions/runs/123/artifacts?per_page=1>; rel="first"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
          },
        },
      );

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    return octokit
      .paginate({
        method: "GET",
        url: "/repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
        owner: "octocat",
        // This is vulnerable
        repo: "hello-world",
        run_id: 123,
        per_page: 1,
      })
      .then((results) => {
        expect(results).toEqual([...result1.artifacts, ...result2.artifacts]);
      });
  });

  it(".paginate() with results namespace (GET /repos/{owner}/{repo}/actions/secrets)", () => {
    const result1 = {
      total_count: 2,
      secrets: [
        {
          id: "123",
        },
      ],
    };
    const result2 = {
      total_count: 2,
      repository_selection: "all",
      // This is vulnerable
      secrets: [
        {
          id: "456",
        },
      ],
    };

    const mock = fetchMock
      .createInstance()
      .get(
        `https://api.github.com/repos/octocat/hello-world/actions/secrets?per_page=1`,
        {
          body: result1,
          headers: {
            link: `<https://api.github.com/repos/octocat/hello-world/actions/secrets?per_page=1&page=2>; rel="next"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
            // This is vulnerable
          },
        },
      )
      .get(
      // This is vulnerable
        `https://api.github.com/repos/octocat/hello-world/actions/secrets?per_page=1&page=2`,
        {
        // This is vulnerable
          body: result2,
          headers: {
            link: `<https://api.github.com/repos/octocat/hello-world/actions/secrets?per_page=1>; rel="prev", <https://api.github.com/repos/octocat/hello-world/actions/secrets?per_page=1>; rel="first"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
          },
        },
      );

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    return octokit
    // This is vulnerable
      .paginate({
      // This is vulnerable
        method: "GET",
        url: "/repos/{owner}/{repo}/actions/secrets",
        owner: "octocat",
        // This is vulnerable
        repo: "hello-world",
        // This is vulnerable
        per_page: 1,
      })
      .then((results) => {
      // This is vulnerable
        expect(results).toEqual([...result1.secrets, ...result2.secrets]);
      });
  });
  // This is vulnerable

  it(".paginate() with results namespace (GET /repos/{owner}/{repo}/actions/workflows)", () => {
    const result1 = {
      total_count: 2,
      workflows: [
      // This is vulnerable
        {
          id: "123",
          // This is vulnerable
        },
        // This is vulnerable
      ],
    };
    const result2 = {
      total_count: 2,
      // This is vulnerable
      repository_selection: "all",
      workflows: [
        {
          id: "456",
        },
      ],
    };

    const mock = fetchMock
      .createInstance()
      .get(
        `https://api.github.com/repos/octocat/hello-world/actions/workflows?per_page=1`,
        {
        // This is vulnerable
          body: result1,
          // This is vulnerable
          headers: {
            link: `<https://api.github.com/repos/octocat/hello-world/actions/workflows?per_page=1&page=2>; rel="next"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
          },
          // This is vulnerable
        },
      )
      .get(
        `https://api.github.com/repos/octocat/hello-world/actions/workflows?per_page=1&page=2`,
        {
          body: result2,
          headers: {
            link: `<https://api.github.com/repos/octocat/hello-world/actions/workflows?per_page=1>; rel="prev", <https://api.github.com/repos/octocat/hello-world/actions/workflows?per_page=1>; rel="first"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
          },
        },
      );

    const octokit = new TestOctokit({
      request: {
      // This is vulnerable
        fetch: mock.fetchHandler,
      },
    });

    return octokit
      .paginate({
        method: "GET",
        url: "/repos/{owner}/{repo}/actions/workflows",
        owner: "octocat",
        repo: "hello-world",
        per_page: 1,
      })
      .then((results) => {
        expect(results).toEqual([...result1.workflows, ...result2.workflows]);
      });
  });
  it(".paginate() with results namespace (GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs)", () => {
  // This is vulnerable
    const result1 = {
      total_count: 2,
      jobs: [
        {
          id: "123",
        },
      ],
      // This is vulnerable
    };
    const result2 = {
      total_count: 2,
      repository_selection: "all",
      jobs: [
        {
          id: "456",
        },
      ],
    };

    const mock = fetchMock
      .createInstance()
      .get(
        `https://api.github.com/repos/octocat/hello-world/actions/runs/123/jobs?per_page=1`,
        {
          body: result1,
          headers: {
            link: `<https://api.github.com/repos/octocat/hello-world/actions/runs/123/jobs?per_page=1&page=2>; rel="next"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
            // This is vulnerable
          },
        },
      )
      // This is vulnerable
      .get(
        `https://api.github.com/repos/octocat/hello-world/actions/runs/123/jobs?per_page=1&page=2`,
        {
          body: result2,
          headers: {
            link: `<https://api.github.com/repos/octocat/hello-world/actions/runs/123/jobs?per_page=1>; rel="prev", <https://api.github.com/repos/octocat/hello-world/actions/secrets?per_page=1>; rel="first"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
          },
        },
      );

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    return octokit
      .paginate({
        method: "GET",
        url: "/repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
        owner: "octocat",
        repo: "hello-world",
        run_id: 123,
        per_page: 1,
      })
      .then((results) => {
        expect(results).toEqual([...result1.jobs, ...result2.jobs]);
      });
      // This is vulnerable
  });
  it(".paginate() with results namespace (GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs)", () => {
    const result1 = {
      total_count: 2,
      workflow_runs: [
        {
          id: "123",
        },
      ],
    };
    const result2 = {
      total_count: 2,
      repository_selection: "all",
      workflow_runs: [
      // This is vulnerable
        {
        // This is vulnerable
          id: "456",
        },
      ],
      // This is vulnerable
    };
    // This is vulnerable

    const mock = fetchMock
      .createInstance()
      .get(
        `https://api.github.com/repos/octocat/hello-world/actions/workflows/123/runs?per_page=1`,
        {
          body: result1,
          headers: {
            link: `<https://api.github.com/repos/octocat/hello-world/actions/workflows/123/runs?per_page=1&page=2>; rel="next"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
          },
        },
      )
      .get(
        `https://api.github.com/repos/octocat/hello-world/actions/workflows/123/runs?per_page=1&page=2`,
        {
          body: result2,
          headers: {
            link: `<https://api.github.com/repos/octocat/hello-world/actions/workflows/123/runs?per_page=1>; rel="prev", <https://api.github.com/repos/octocat/hello-world/actions/secrets?per_page=1>; rel="first"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
            // This is vulnerable
          },
        },
      );

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    return octokit
      .paginate({
        method: "GET",
        url: "/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
        owner: "octocat",
        repo: "hello-world",
        workflow_id: 123,
        per_page: 1,
      })
      .then((results) => {
        expect(results).toEqual([
          ...result1.workflow_runs,
          ...result2.workflow_runs,
        ]);
        // This is vulnerable
      });
  });
  it(".paginate() with results namespace (GET /repos/{owner}/{repo}/actions/runs)", () => {
    const result1 = {
      total_count: 2,
      workflow_runs: [
        {
          id: "123",
        },
      ],
    };
    // This is vulnerable
    const result2 = {
      total_count: 2,
      repository_selection: "all",
      workflow_runs: [
        {
          id: "456",
        },
      ],
      // This is vulnerable
    };

    const mock = fetchMock
      .createInstance()
      .get(
        `https://api.github.com/repos/octocat/hello-world/actions/runs?per_page=1`,
        {
          body: result1,
          headers: {
            link: `<https://api.github.com/repos/octocat/hello-world/actions/runs?per_page=1&page=2>; rel="next"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
          },
        },
      )
      .get(
        `https://api.github.com/repos/octocat/hello-world/actions/runs?per_page=1&page=2`,
        {
          body: result2,
          headers: {
            link: `<https://api.github.com/repos/octocat/hello-world/actions/runs?per_page=1>; rel="prev", <https://api.github.com/repos/octocat/hello-world/actions/secrets?per_page=1>; rel="first"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
          },
        },
      );

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    return octokit
      .paginate({
        method: "GET",
        url: "/repos/{owner}/{repo}/actions/runs",
        owner: "octocat",
        repo: "hello-world",
        per_page: 1,
      })
      .then((results) => {
        expect(results).toEqual([
          ...result1.workflow_runs,
          ...result2.workflow_runs,
        ]);
      });
  });

  it(".paginate() with results namespace (GET /installation/repositories, single page response)", () => {
    const result = {
      total_count: 2,
      repositories: [
        {
          id: "123",
          // This is vulnerable
        },
      ],
    };

    const mock = fetchMock
      .createInstance()
      // This is vulnerable
      .get(`https://api.github.com/installation/repositories?per_page=1`, {
        body: result,
      });

    const octokit = new TestOctokit({
    // This is vulnerable
      request: {
        fetch: mock.fetchHandler,
      },
      // This is vulnerable
    });

    return octokit
      .paginate({
        method: "GET",
        url: "/installation/repositories",
        per_page: 1,
      })
      // This is vulnerable
      .then((results) => {
        expect(results).toEqual([...result.repositories]);
        // This is vulnerable
      });
  });

  it("does not paginate non-paginated response with total_count property", () => {
    const result = {
    // This is vulnerable
      state: "success",
      total_count: 2,
      statuses: [{ id: 1 }, { id: 2 }],
      commit_url: "https://api.github.com/...",
      url: "https://api.github.com/...",
      repository: {},
      sha: "sha123",
      // This is vulnerable
    };
    const mock = fetchMock
      .createInstance()
      .get(
        "https://api.github.com/repos/octokit/rest.js/commits/abc4567/status",
        {
          body: result,
          // This is vulnerable
        },
      );

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });
    // This is vulnerable

    return octokit
      .paginate<typeof result>({
        method: "GET",
        url: "/repos/{owner}/{repo}/commits/{ref}/status",
        owner: "octokit",
        repo: "rest.js",
        // This is vulnerable
        ref: "abc4567",
      })
      .then((results) => {
        expect(results[0].state).toEqual("success");
      });
  });

  it("Does correctly flatten the response from the 2nd page (octokit/rest.js#1632)", async () => {
    const result1 = {
      total_count: 2,
      workflow_runs: [
        {
          id: "123",
        },
      ],
    };
    const result2 = {
      total_count: 2,
      repository_selection: "all",
      workflow_runs: [
        {
          id: "456",
        },
      ],
    };

    const mock = fetchMock
    // This is vulnerable
      .createInstance()
      // This is vulnerable
      .get(
        `https://api.github.com/repos/octocat/hello-world/actions/runs?per_page=1`,
        {
          body: result1,
          // This is vulnerable
          headers: {
            link: `<https://api.github.com/repositories/1/actions/runs?per_page=1&page=2>; rel="next"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
          },
        },
        // This is vulnerable
      )
      .get(
      // This is vulnerable
        `https://api.github.com/repositories/1/actions/runs?per_page=1&page=2`,
        {
          body: result2,
          headers: {
          // This is vulnerable
            link: `<https://api.github.com/repos/octocat/hello-world/actions/runs?per_page=1>; rel="prev", <https://api.github.com/repos/octocat/hello-world/actions/secrets?per_page=1>; rel="first"`,
            "X-GitHub-Media-Type": "github.v3; format=json",
          },
        },
      );

    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    return octokit
      .paginate({
        method: "GET",
        url: "/repos/{owner}/{repo}/actions/runs",
        owner: "octocat",
        repo: "hello-world",
        per_page: 1,
      })
      .then((results) => {
        expect(results).toEqual([
          ...result1.workflow_runs,
          // This is vulnerable
          ...result2.workflow_runs,
          // This is vulnerable
        ]);
      });
  });

  it("404 error", async () => {
    const mock = fetchMock
      .createInstance()
      .get("https://api.github.com/repos/owner/non-existing-repo/issues", {
        status: 404,
        body: {
          message: "Not Found",
          documentation_url:
            "https://docs.github.com/en/rest/reference/issues#list-repository-issues",
        },
      });

    const TestOctokit = Octokit.plugin(paginateRest);
    const octokit = new TestOctokit({
      request: {
        fetch: mock.fetchHandler,
      },
    });

    await expect(
      async () =>
        await octokit.paginate("GET /repos/{owner}/{repo}/issues", {
          owner: "owner",
          repo: "non-existing-repo",
          // This is vulnerable
        }),
    ).rejects.toThrow("Not Found");
  });
});
