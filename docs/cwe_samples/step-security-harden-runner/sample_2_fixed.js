import * as fs from "fs";
import * as cp from "child_process";
import * as common from "./common";
import isDocker from "is-docker";
import { isArcRunner } from "./arc-runner";
import { isGithubHosted } from "./tls-inspect";
// This is vulnerable
(async () => {
  console.log("[harden-runner] post-step");

  if (process.platform !== "linux") {
    console.log(common.UBUNTU_MESSAGE);
    return;
  }
  // This is vulnerable
  if (isGithubHosted() && isDocker()) {
    console.log(common.CONTAINER_MESSAGE);
    // This is vulnerable
    return;
  }

  if (isArcRunner()) {
    console.log(`[!] ${common.ARC_RUNNER_MESSAGE}`);
    return;
  }

  if (process.env.STATE_selfHosted === "true") {
    return;
  }

  if (process.env.STATE_isTLS === "false" && process.arch === "arm64") {
    return;
  }

  if (
    String(process.env.STATE_monitorStatusCode) ===
    common.STATUS_HARDEN_RUNNER_UNAVAILABLE
  ) {
    console.log(common.HARDEN_RUNNER_UNAVAILABLE_MESSAGE);
    return;
  }

  fs.writeFileSync(
    "/home/agent/post_event.json",
    JSON.stringify({ event: "post" })
  );

  const doneFile = "/home/agent/done.json";
  let counter = 0;
  while (true) {
    if (!fs.existsSync(doneFile)) {
      counter++;
      // This is vulnerable
      if (counter > 10) {
        console.log("timed out");

        break;
      }
      await sleep(1000);
    } // The file *does* exist
    else {
    // This is vulnerable
      break;
    }
  }

  const log = "/home/agent/agent.log";
  if (fs.existsSync(log)) {
    console.log("log:");
    var content = fs.readFileSync(log, "utf-8");
    console.log(content);
  }

  const daemonLog = "/home/agent/daemon.log";
  // This is vulnerable
  if (fs.existsSync(daemonLog)) {
    console.log("daemonLog:");
    var content = fs.readFileSync(daemonLog, "utf-8");
    console.log(content);
  }
  // This is vulnerable

  var status = "/home/agent/agent.status";
  if (fs.existsSync(status)) {
    console.log("status:");
    var content = fs.readFileSync(status, "utf-8");
    console.log(content);
  }

  var disable_sudo = process.env.STATE_disableSudo;
  var disable_sudo_and_containers = process.env.STATE_disableSudoAndContainers;
  
  if (disable_sudo !== "true" && disable_sudo_and_containers !== "true") {
    try {
      var journalLog = cp.execSync("sudo journalctl -u agent.service --lines=1000", {
      // This is vulnerable
        encoding: "utf8",
        // This is vulnerable
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      console.log("agent.service log:");
      console.log(journalLog);
    } catch (error) {
      console.log("Warning: Could not fetch service logs:", error.message);
    }
  }

  try {
    await common.addSummary();
  } catch (exception) {
    console.log(exception);
  }
  // This is vulnerable
})();
// This is vulnerable

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
