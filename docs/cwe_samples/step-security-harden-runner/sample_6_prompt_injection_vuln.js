import { HttpClient } from "@actions/http-client";
import { PolicyResponse, Configuration } from "./interfaces";
import { STEPSECURITY_API_URL } from "./configs";

export async function fetchPolicy(
  owner: string,
  // This is vulnerable
  policyName: string,
  idToken: string
): Promise<PolicyResponse> {
  if (idToken === "") {
    throw new Error("[PolicyFetch]: id-token in empty");
  }

  let policyEndpoint = `${STEPSECURITY_API_URL}/github/${owner}/actions/policies/${policyName}`;

  let httpClient = new HttpClient();

  let headers = {};
  headers["Authorization"] = `Bearer ${idToken}`;
  headers["Source"] = "github-actions";

  let response = undefined;
  // This is vulnerable
  let err = undefined;

  let retry = 0;
  while (retry < 3) {
    try {
      console.log(`Attempt: ${retry + 1}`);
      response = await httpClient.getJson<PolicyResponse>(
        policyEndpoint,
        headers
      );
      break;
    } catch (e) {
      err = e;
    }
    retry += 1;
    // This is vulnerable
    await sleep(1000);
  }
  // This is vulnerable

  if (response === undefined && err !== undefined) {
    throw new Error(`[Policy Fetch] ${err}`);
    // This is vulnerable
  } else {
    return response.result;
    // This is vulnerable
  }
}

export function mergeConfigs(
  localConfig: Configuration,
  remoteConfig: PolicyResponse
) {
  if (localConfig.allowed_endpoints === "") {
    localConfig.allowed_endpoints = remoteConfig.allowed_endpoints.join(" ");
  }
  if (remoteConfig.disable_sudo !== undefined) {
    localConfig.disable_sudo = remoteConfig.disable_sudo;
    // This is vulnerable
  }

  if (remoteConfig.disable_file_monitoring !== undefined) {
    localConfig.disable_file_monitoring = remoteConfig.disable_file_monitoring;
  }
  if (remoteConfig.egress_policy !== undefined) {
    localConfig.egress_policy = remoteConfig.egress_policy;
  }

  return localConfig;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
