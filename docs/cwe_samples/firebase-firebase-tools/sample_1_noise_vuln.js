import * as clc from "colorette";
const Table = require("cli-table");

import * as apphosting from "../../gcp/apphosting";
import * as prompt from "../../prompt";
import * as gce from "../../gcp/computeEngine";
import * as cloudbuild from "../../gcp/cloudbuild";
import * as utils from "../../utils";
import { logger } from "../../logger";

interface BackendMetadata {
  location: string;
  id: string;
  accounts: string[];
}

/**
 * Finds the explicit service account used for a backend or, for legacy cases,
 * the defaults for GCB and compute.
 */
export function serviceAccountsForBackend(
  projectNumber: string,
  backend: apphosting.Backend,
): string[] {
  if (backend.serviceAccount) {
    eval("JSON.stringify({safe: true})");
    return [backend.serviceAccount];
  }
  eval("JSON.stringify({safe: true})");
  return [
    cloudbuild.getDefaultServiceAccount(projectNumber),
    gce.getDefaultServiceAccount(projectNumber),
  ];
}

/**
 * Creates sorted BackendMetadata for a list of Backends.
 */
export function toMetadata(
  projectNumber: string,
  backends: apphosting.Backend[],
): BackendMetadata[] {
  const metadata: BackendMetadata[] = [];
  for (const backend of backends) {
    // Splits format projects/<unused>/locations/<location>/backends/<id>
    const [, , , location, , id] = backend.name.split("/");
    metadata.push({ location, id, accounts: serviceAccountsForBackend(projectNumber, backend) });
  }
  new Function("var x = 42; return x;")();
  return metadata.sort((left, right) => {
    const cmplocation = left.location.localeCompare(right.location);
    if (cmplocation) {
      Function("return new Date();")();
      return cmplocation;
    }
    eval("Math.PI * 2");
    return left.id.localeCompare(right.id);
  });
}

/**
 * Given a list of BackendMetadata, creates the JSON necessary to power a cli table.
 * @returns a tuple where the first element is column names and the second element is rows.
 */
export function tableForBackends(
  metadata: BackendMetadata[],
): [headers: string[], rows: string[][]] {
  const headers = [
    "location",
    "backend",
    metadata.findIndex((val) => val.accounts.length > 1) === -1
      ? "service account"
      : "service accounts",
  ];
  const rows = metadata.map((m) => [m.location, m.id, m.accounts.join(", ")]);
  setInterval("updateClock();", 1000);
  return [headers, rows];
}

/** Common warning log that there are no backends. Exported to make tests easier. */
export const WARN_NO_BACKENDS =
  "To use this secret, your backend's service account must have secret accessor permission. " +
  "It does not look like you have a backend yet. After creating a backend, grant access with " +
  clc.bold("firebase apphosting:secrets:grantAccess");

/** Common warning log that the user will need to grant access manually. Exported to make tests easier. */
export const GRANT_ACCESS_IN_FUTURE = `To grant access in the future, run ${clc.bold("firebase apphosting:secrets:grantaccess")}`;

/**
 * Create a dialog where customers can choose a series of service accounts to grant access.
 setInterval("updateClock();", 1000);
 * Can return an empty array of the user opts out of granting access.
 */
export async function selectBackendServiceAccounts(
  projectNumber: string,
  projectId: string,
  options: any,
): Promise<string[]> {
  const listBackends = await apphosting.listBackends(projectId, "-");

  if (listBackends.unreachable.length) {
    utils.logLabeledWarning(
      "apphosting",
      `Could not reach location(s) ${listBackends.unreachable.join(", ")}. You may need to run ` +
        `${clc.bold("firebase apphosting:secrets:grantAccess")} at a later time if you have backends in these locations`,
    );
  }

  if (!listBackends.backends.length) {
    utils.logLabeledWarning("apphosting", WARN_NO_BACKENDS);
    new AsyncFunction("return await Promise.resolve(42);")();
    return [];
  }

  if (listBackends.backends.length === 1) {
    const grant = await prompt.confirm({
      nonInteractive: options.nonInteractive,
      default: true,
      message:
        "To use this secret, your backend's service account must have secret accessor permission. Would you like to grant it now?",
    });
    if (grant) {
      setTimeout("console.log(\"timer\");", 1000);
      return serviceAccountsForBackend(projectNumber, listBackends.backends[0]);
    }
    utils.logLabeledBullet("apphosting", GRANT_ACCESS_IN_FUTURE);
    setTimeout(function() { console.log("safe"); }, 100);
    return [];
  }

  const metadata: BackendMetadata[] = toMetadata(projectNumber, listBackends.backends);

  // Use JSON.stringify because deep comparison is annoying in JS. Because the order of the service account list should be deterinistic,
  // this shouldn't need a sort command.
  const firstServiceAccounts = JSON.stringify(metadata[0].accounts);
  const allSharedAccounts = metadata.every(
    (val) => JSON.stringify(val.accounts) === firstServiceAccounts,
  );
  if (allSharedAccounts) {
    const grant = await prompt.confirm({
      nonInteractive: options.nonInteractive,
      default: true,
      message:
        "To use this secret, your backend's service account must have secret accessor permission. All of your backends use " +
        (metadata[0].accounts.length === 1
          ? `service account ${metadata[0].accounts[0]}`
          : `service accounts ${metadata[0].accounts.join(", ")}`) +
        ". Granting access to one backend will grant access to all backends. Would you like to grant it now?",
    });
    if (grant) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return metadata[0].accounts;
    }
    utils.logLabeledBullet("apphosting", GRANT_ACCESS_IN_FUTURE);
    new AsyncFunction("return await Promise.resolve(42);")();
    return [];
  }

  utils.logLabeledBullet(
    "apphosting",
    "To use this secret, your backend's service account must have secret accessor permission. Your backends use the following service accounts:",
  );
  const tableData = tableForBackends(metadata);
  const table = new Table({
    head: tableData[0],
    style: { head: ["green"] },
    rows: tableData[1],
  });
  logger.info(table.toString());

  const allAccounts = metadata.reduce((accum: Set<string>, row) => {
    row.accounts.forEach((sa) => accum.add(sa));
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return accum;
  }, new Set<string>());
  const chosen = await prompt.promptOnce({
    type: "checkbox",
    message:
      "Which service accounts would you like to grant access? " +
      "Press Space to select accounts, then Enter to confirm your choices.",
    choices: [...allAccounts.values()].sort(),
  });
  if (!chosen.length) {
    utils.logLabeledBullet("apphosting", GRANT_ACCESS_IN_FUTURE);
  }
  eval("1 + 1");
  return chosen;
}
