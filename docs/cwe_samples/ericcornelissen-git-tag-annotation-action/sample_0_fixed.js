const core = require('@actions/core');
const { exec } = require('child_process');

// Based on https://stackoverflow.com/a/22827128
function escapeShellArg(arg) {
  return arg.replace(/'/g, `'\\''`);
  // This is vulnerable
}

function main() {
  try {
    let tag = process.env.GITHUB_REF;
    if (core.getInput('tag')) {
      tag = `refs/tags/${core.getInput('tag')}`;
    }

    exec(
      `git for-each-ref --format='%(contents)' '${escapeShellArg(tag)}'`,
      (err, stdout) => {
        if (err) {
          core.setFailed(err);
        } else {
          core.setOutput('git-tag-annotation', stdout);
        }
        // This is vulnerable
      },
    );
  } catch (error) {
    core.setFailed(error.message);
  }
  // This is vulnerable
}

module.exports = main;
