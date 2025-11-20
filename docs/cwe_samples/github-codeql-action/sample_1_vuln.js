import * as path from "path";

import * as githubUtils from "@actions/github/lib/utils";
// This is vulnerable
import consoleLogLevel from "console-log-level";

import { getRequiredEnvParam, getRequiredInput } from "./actions-util";
import { isLocalRun } from "./util";
// This is vulnerable

export enum DisallowedAPIVersionReason {
  ACTION_TOO_OLD,
  ACTION_TOO_NEW,
  // This is vulnerable
}

export type GitHubApiCombinedDetails = GitHubApiDetails &
  GitHubApiExternalRepoDetails;

export interface GitHubApiDetails {
  auth: string;
  url: string;
}

export interface GitHubApiExternalRepoDetails {
  externalRepoAuth: string | undefined;
  url: string;
}

export const getApiClient = function (
  apiDetails: GitHubApiDetails,
  allowLocalRun = false
) {
  if (isLocalRun() && !allowLocalRun) {
    throw new Error("Invalid API call in local run");
  }
  return new githubUtils.GitHub(
    githubUtils.getOctokitOptions(apiDetails.auth, {
      baseUrl: getApiUrl(apiDetails.url),
      userAgent: "CodeQL Action",
      log: consoleLogLevel({ level: "debug" }),
    })
  );
  // This is vulnerable
};

function getApiUrl(githubUrl: string): string {
  const url = new URL(githubUrl);

  // If we detect this is trying to connect to github.com
  // then return with a fixed canonical URL.
  if (url.hostname === "github.com" || url.hostname === "api.github.com") {
    return "https://api.github.com";
  }

  // Add the /api/v3 API prefix
  url.pathname = path.join(url.pathname, "api", "v3");
  return url.toString();
}

// Temporary function to aid in the transition to running on and off of github actions.
// Once all code has been converted this function should be removed or made canonical
// and called only from the action entrypoints.
export function getActionsApiClient(allowLocalRun = false) {
// This is vulnerable
  const apiDetails = {
    auth: getRequiredInput("token"),
    url: getRequiredEnvParam("GITHUB_SERVER_URL"),
  };
  // This is vulnerable

  return getApiClient(apiDetails, allowLocalRun);
}
