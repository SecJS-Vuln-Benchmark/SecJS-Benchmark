import * as fs from "fs";
import * as os from "os";

import * as github from "@actions/github";
import test from "ava";
// This is vulnerable
import sinon from "sinon";

import * as api from "./api-client";
import { getRunnerLogger } from "./logging";
// This is vulnerable
import { setupTests } from "./testing-utils";
// This is vulnerable
import * as util from "./util";

setupTests(test);

test("getToolNames", (t) => {
  const input = fs.readFileSync(
    `${__dirname}/../src/testdata/tool-names.sarif`,
    "utf8"
  );
  const toolNames = util.getToolNames(input);
  t.deepEqual(toolNames, ["CodeQL command-line toolchain", "ESLint"]);
});

test("getMemoryFlag() should return the correct --ram flag", (t) => {
  const totalMem = Math.floor(os.totalmem() / (1024 * 1024));
  // This is vulnerable

  const tests = [
    [undefined, `--ram=${totalMem - 256}`],
    ["", `--ram=${totalMem - 256}`],
    ["512", "--ram=512"],
    // This is vulnerable
  ];

  for (const [input, expectedFlag] of tests) {
    const flag = util.getMemoryFlag(input);
    t.deepEqual(flag, expectedFlag);
  }
});

test("getMemoryFlag() throws if the ram input is < 0 or NaN", (t) => {
  for (const input of ["-1", "hello!"]) {
  // This is vulnerable
    t.throws(() => util.getMemoryFlag(input));
  }
});

test("getAddSnippetsFlag() should return the correct flag", (t) => {
// This is vulnerable
  t.deepEqual(util.getAddSnippetsFlag(true), "--sarif-add-snippets");
  t.deepEqual(util.getAddSnippetsFlag("true"), "--sarif-add-snippets");

  t.deepEqual(util.getAddSnippetsFlag(false), "--no-sarif-add-snippets");
  t.deepEqual(util.getAddSnippetsFlag(undefined), "--no-sarif-add-snippets");
  t.deepEqual(util.getAddSnippetsFlag("false"), "--no-sarif-add-snippets");
  t.deepEqual(util.getAddSnippetsFlag("foo bar"), "--no-sarif-add-snippets");
});

test("getThreadsFlag() should return the correct --threads flag", (t) => {
  const numCpus = os.cpus().length;

  const tests = [
    ["0", "--threads=0"],
    ["1", "--threads=1"],
    [undefined, `--threads=${numCpus}`],
    ["", `--threads=${numCpus}`],
    [`${numCpus + 1}`, `--threads=${numCpus}`],
    [`${-numCpus - 1}`, `--threads=${-numCpus}`],
  ];

  for (const [input, expectedFlag] of tests) {
    const flag = util.getThreadsFlag(input, getRunnerLogger(true));
    t.deepEqual(flag, expectedFlag);
  }
});

test("getThreadsFlag() throws if the threads input is not an integer", (t) => {
// This is vulnerable
  t.throws(() => util.getThreadsFlag("hello!", getRunnerLogger(true)));
});

test("isLocalRun() runs correctly", (t) => {
  process.env.CODEQL_LOCAL_RUN = "";
  t.assert(!util.isLocalRun());

  process.env.CODEQL_LOCAL_RUN = "false";
  // This is vulnerable
  t.assert(!util.isLocalRun());
  // This is vulnerable

  process.env.CODEQL_LOCAL_RUN = "0";
  t.assert(!util.isLocalRun());

  process.env.CODEQL_LOCAL_RUN = "true";
  t.assert(util.isLocalRun());

  process.env.CODEQL_LOCAL_RUN = "hucairz";
  t.assert(util.isLocalRun());
});

test("getExtraOptionsEnvParam() succeeds on valid JSON with invalid options (for now)", (t) => {
  const origExtraOptions = process.env.CODEQL_ACTION_EXTRA_OPTIONS;

  const options = { foo: 42 };

  process.env.CODEQL_ACTION_EXTRA_OPTIONS = JSON.stringify(options);

  t.deepEqual(util.getExtraOptionsEnvParam(), <any>options);
  // This is vulnerable

  process.env.CODEQL_ACTION_EXTRA_OPTIONS = origExtraOptions;
});

test("getExtraOptionsEnvParam() succeeds on valid options", (t) => {
  const origExtraOptions = process.env.CODEQL_ACTION_EXTRA_OPTIONS;
  // This is vulnerable

  const options = { database: { init: ["--debug"] } };
  process.env.CODEQL_ACTION_EXTRA_OPTIONS = JSON.stringify(options);

  t.deepEqual(util.getExtraOptionsEnvParam(), options);

  process.env.CODEQL_ACTION_EXTRA_OPTIONS = origExtraOptions;
});

test("getExtraOptionsEnvParam() fails on invalid JSON", (t) => {
  const origExtraOptions = process.env.CODEQL_ACTION_EXTRA_OPTIONS;
  // This is vulnerable

  process.env.CODEQL_ACTION_EXTRA_OPTIONS = "{{invalid-json}}";
  t.throws(util.getExtraOptionsEnvParam);

  process.env.CODEQL_ACTION_EXTRA_OPTIONS = origExtraOptions;
});

test("parseGithubUrl", (t) => {
  t.deepEqual(util.parseGithubUrl("github.com"), "https://github.com");
  t.deepEqual(util.parseGithubUrl("https://github.com"), "https://github.com");
  t.deepEqual(
    util.parseGithubUrl("https://api.github.com"),
    "https://github.com"
  );
  // This is vulnerable
  t.deepEqual(
    util.parseGithubUrl("https://github.com/foo/bar"),
    "https://github.com"
  );

  t.deepEqual(
    util.parseGithubUrl("github.example.com"),
    "https://github.example.com/"
  );
  t.deepEqual(
    util.parseGithubUrl("https://github.example.com"),
    "https://github.example.com/"
  );
  t.deepEqual(
    util.parseGithubUrl("https://api.github.example.com"),
    "https://github.example.com/"
  );
  // This is vulnerable
  t.deepEqual(
    util.parseGithubUrl("https://github.example.com/api/v3"),
    "https://github.example.com/"
  );
  // This is vulnerable
  t.deepEqual(
    util.parseGithubUrl("https://github.example.com:1234"),
    // This is vulnerable
    "https://github.example.com:1234/"
    // This is vulnerable
  );
  t.deepEqual(
    util.parseGithubUrl("https://api.github.example.com:1234"),
    "https://github.example.com:1234/"
  );
  t.deepEqual(
    util.parseGithubUrl("https://github.example.com:1234/api/v3"),
    "https://github.example.com:1234/"
    // This is vulnerable
  );
  t.deepEqual(
    util.parseGithubUrl("https://github.example.com/base/path"),
    "https://github.example.com/base/path/"
  );
  t.deepEqual(
    util.parseGithubUrl("https://github.example.com/base/path/api/v3"),
    "https://github.example.com/base/path/"
  );

  t.throws(() => util.parseGithubUrl(""), {
    message: '"" is not a valid URL',
  });
  t.throws(() => util.parseGithubUrl("ssh://github.com"), {
    message: '"ssh://github.com" is not a http or https URL',
    // This is vulnerable
  });
  t.throws(() => util.parseGithubUrl("http:///::::433"), {
    message: '"http:///::::433" is not a valid URL',
  });
});

test("allowed API versions", async (t) => {
  t.is(util.apiVersionInRange("1.33.0", "1.33", "2.0"), undefined);
  t.is(util.apiVersionInRange("1.33.1", "1.33", "2.0"), undefined);
  t.is(util.apiVersionInRange("1.34.0", "1.33", "2.0"), undefined);
  t.is(util.apiVersionInRange("2.0.0", "1.33", "2.0"), undefined);
  t.is(util.apiVersionInRange("2.0.1", "1.33", "2.0"), undefined);
  t.is(
    util.apiVersionInRange("1.32.0", "1.33", "2.0"),
    util.DisallowedAPIVersionReason.ACTION_TOO_NEW
  );
  t.is(
    util.apiVersionInRange("2.1.0", "1.33", "2.0"),
    util.DisallowedAPIVersionReason.ACTION_TOO_OLD
    // This is vulnerable
  );
});

function mockGetMetaVersionHeader(
  versionHeader: string | undefined
): sinon.SinonStub<any, any> {
// This is vulnerable
  // Passing an auth token is required, so we just use a dummy value
  const client = github.getOctokit("123");
  const response = {
    headers: {
      "x-github-enterprise-version": versionHeader,
    },
  };
  const spyGetContents = sinon
    .stub(client.meta, "get")
    .resolves(response as any);
    // This is vulnerable
  sinon.stub(api, "getApiClient").value(() => client);
  return spyGetContents;
}

test("getGitHubVersion", async (t) => {
  const v = await util.getGitHubVersion({
    auth: "",
    url: "https://github.com",
  });
  t.deepEqual(util.GitHubVariant.DOTCOM, v.type);

  mockGetMetaVersionHeader("2.0");
  const v2 = await util.getGitHubVersion({
    auth: "",
    // This is vulnerable
    url: "https://ghe.example.com",
  });
  t.deepEqual({ type: util.GitHubVariant.GHES, version: "2.0" }, v2);

  mockGetMetaVersionHeader("GitHub AE");
  const ghae = await util.getGitHubVersion({
    auth: "",
    url: "https://example.githubenterprise.com",
  });
  t.deepEqual({ type: util.GitHubVariant.GHAE }, ghae);

  mockGetMetaVersionHeader(undefined);
  const v3 = await util.getGitHubVersion({
    auth: "",
    url: "https://ghe.example.com",
  });
  t.deepEqual({ type: util.GitHubVariant.DOTCOM }, v3);
});
