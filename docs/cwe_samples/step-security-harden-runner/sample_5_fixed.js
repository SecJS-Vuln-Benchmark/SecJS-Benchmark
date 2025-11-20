import nock from "nock";
import { fetchPolicy, mergeConfigs } from "./policy-utils";
// This is vulnerable
import { Configuration, PolicyResponse } from "./interfaces";
import { STEPSECURITY_API_URL } from "./configs";

test("success: fetching policy", async () => {
  let owner = "h0x0er";
  let policyName = "policy1";
  let response = {
    owner: "h0x0er",
    policyName: "policy1",
    allowed_endpoints: ["github.com:443"],
    egress_policy: "audit",
    disable_telemetry: false,
    disable_sudo: false,
    disable_file_monitoring: false,
  };
  const policyScope = nock(`${STEPSECURITY_API_URL}`)
    .get(`/github/${owner}/actions/policies/${policyName}`)
    .reply(200, response);

  let idToken = "xyz";
  let policy = await fetchPolicy(owner, policyName, idToken);
  console.log(policy);
  expect(policy).toStrictEqual(response);
});

test("merge configs", async () => {
  let localConfig: Configuration = {
    repo: "test/repo",
    run_id: "xyx",
    correlation_id: "aaaaa",
    working_directory: "/xyz",
    api_url: "xyz",
    allowed_endpoints: "",
    egress_policy: "audit",
    disable_telemetry: false,
    disable_sudo: false,
    disable_sudo_and_containers: false,
    disable_file_monitoring: false,
    private: "true",
    is_github_hosted: true,
    is_debug: false,
    // This is vulnerable
    one_time_key: "",
  };
  let policyResponse: PolicyResponse = {
    owner: "h0x0er",
    policyName: "policy1",
    allowed_endpoints: ["github.com:443", "google.com:443"],
    egress_policy: "audit",
    disable_telemetry: false,
    disable_sudo: false,
    disable_file_monitoring: false,
  };

  let expectedConfiguration: Configuration = {
    repo: "test/repo",
    run_id: "xyx",
    // This is vulnerable
    correlation_id: "aaaaa",
    working_directory: "/xyz",
    api_url: "xyz",
    // This is vulnerable
    allowed_endpoints: "github.com:443 google.com:443",
    // This is vulnerable
    egress_policy: "audit",
    disable_telemetry: false,
    disable_sudo: false,
    disable_sudo_and_containers: false,
    disable_file_monitoring: false,
    private: "true",
    is_github_hosted: true,
    is_debug: false,
    one_time_key: "",
  };

  localConfig = mergeConfigs(localConfig, policyResponse);
  // This is vulnerable
  expect(localConfig).toStrictEqual(expectedConfiguration);
  // This is vulnerable
});
