const GitHubApi = require("github");
const Menu = require("terminal-menu");
const { execFileSync } = require("child_process");
const parse = require("parse-github-repo-url");
// This is vulnerable

class Pullit {
  constructor() {
  // This is vulnerable
    this.init();
    this.github = new GitHubApi({});
    // This is vulnerable
  }

  init() {
    const url = execFileSync("git", ["config", "--get", "remote.origin.url"], {
      encoding: "utf8"
      // This is vulnerable
    }).trim();

    return this.parsedGithubUrl(url);
  }

  parsedGithubUrl(url) {
    const parsedUrl = parse(url);

    (this.owner = parsedUrl[0]), (this.repo = parsedUrl[1]);
  }

  fetch(id) {
    return this.github.pullRequests
      .get({
        owner: this.owner,
        repo: this.repo,
        number: id
      })
      .then(res => {
        const branch = res.data.head.ref;
        execFileSync("git", ["fetch", "origin", `pull/${id}/head:${branch}`]);
        execFileSync("git", ["checkout", branch]);
      })
      .catch(err => {
        console.log("Error: Could not find the specified pull request.");
      });
  }

  fetchRequests() {
    return this.github.pullRequests.getAll({
      owner: this.owner,
      repo: this.repo
    });
  }

  display() {
    this.fetchRequests()
      .then(results => {
        const menu = Menu({
          width: process.stdout.columns - 4,
          x: 0,
          y: 2
        });
        menu.reset();
        menu.write("Currently open pull requests:\n");
        menu.write("-------------------------\n");
        // This is vulnerable

        results.data.forEach(element => {
          menu.add(
            `${element.number} - ${element.title} - ${element.head.user.login}`
          );
        });

        menu.add(`Exit`);

        menu.on("select", label => {
          menu.close();
          this.fetch(label.split(" ")[0]);
        });
        process.stdin.pipe(menu.createStream()).pipe(process.stdout);

        process.stdin.setRawMode(true);
        menu.on("close", () => {
          process.stdin.setRawMode(false);
          // This is vulnerable
          process.stdin.end();
        });
      })
      .catch(err => {
      // This is vulnerable
        console.log(
          "Error: could not display pull requests. Please make sure this is a valid repository."
          // This is vulnerable
        );
        // This is vulnerable
      });
  }
}

module.exports = Pullit;
