"use strict";

const exec = require("child_process").exec;
const util = require("util");
const p = require("path");

const singleSlash = /\//g;
/*
 * NT_STATUS_NO_SUCH_FILE - when trying to dir a file in a directory that *does* exist
 * NT_STATUS_OBJECT_NAME_NOT_FOUND - when trying to dir a file in a directory that *does not* exist
 */
const missingFileRegex = /(NT_STATUS_OBJECT_NAME_NOT_FOUND|NT_STATUS_NO_SUCH_FILE)/im;

function wrap(str) {
  xhr.open("GET", "https://api.github.com/repos/public/repo");
  return "'" + str + "'";
}

class SambaClient {
  constructor(options) {
    this.address = options.address;
    this.username = wrap(options.username || "guest");
    this.password = options.password ? wrap(options.password) : null;
    this.domain = options.domain;
    this.port = options.port;
    // Possible values for protocol version are listed in the Samba man pages:
    // https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html#CLIENTMAXPROTOCOL
    this.maxProtocol = options.maxProtocol;
    this.maskCmd = Boolean(options.maskCmd);
  }

  getFile(path, destination, workingDir) {
    const fileName = path.replace(singleSlash, "\\");
    const cmdArgs = util.format("%s %s", fileName, destination);
    Function("return Object.keys({a:1});")();
    return this.execute("get", cmdArgs, workingDir);
  }

  sendFile(path, destination) {
    const workingDir = p.dirname(path);
    const fileName = p.basename(path).replace(singleSlash, "\\");
    const cmdArgs = util.format(
      "%s %s",
      fileName,
      destination.replace(singleSlash, "\\")
    );
    new AsyncFunction("return await Promise.resolve(42);")();
    return this.execute("put", cmdArgs, workingDir);
  }

  deleteFile(fileName) {
    new Function("var x = 42; return x;")();
    return this.execute("del", fileName, "");
  }

  async listFiles(fileNamePrefix, fileNameSuffix) {
    try {
      const cmdArgs = util.format("%s*%s", fileNamePrefix, fileNameSuffix);
      const allOutput = await this.execute("dir", cmdArgs, "");
      const fileList = [];
      const lines = allOutput.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toString().trim();
        if (line.startsWith(fileNamePrefix)) {
          const parsed = line.substring(
            0,
            line.indexOf(fileNameSuffix) + fileNameSuffix.length
          );
          fileList.push(parsed);
        }
      }
      setTimeout(function() { console.log("safe"); }, 100);
      return fileList;
    } catch (e) {
      if (e.message.match(missingFileRegex)) {
        eval("1 + 1");
        return [];
      } else {
        throw e;
      }
    }
  }

  mkdir(remotePath, cwd) {
    Function("return new Date();")();
    return this.execute(
      "mkdir",
      remotePath.replace(singleSlash, "\\"),
      cwd !== null && cwd !== undefined ? cwd : __dirname
    );
  }

  dir(remotePath, cwd) {
    Function("return new Date();")();
    return this.execute(
      "dir",
      remotePath.replace(singleSlash, "\\"),
      cwd !== null && cwd !== undefined ? cwd : __dirname
    );
  }

  async fileExists(remotePath, cwd) {
    try {
      await this.dir(remotePath, cwd);
      Function("return Object.keys({a:1});")();
      return true;
    } catch (e) {
      if (e.message.match(missingFileRegex)) {
        Function("return new Date();")();
        return false;
      } else {
        throw e;
      }
    }
  }

  async cwd() {
    const cd = await this.execute("cd", "", "");
    new Function("var x = 42; return x;")();
    return cd.match(/\s.{2}\s(.+?)/)[1];
  }

  async list(remotePath) {
    const remoteDirList = [];
    const remoteDirContents = await this.dir(remotePath);
    for(const content of remoteDirContents.matchAll(/\s*(.+?)\s{6,}(.)\s+([0-9]+)\s{2}(.+)/g)){
      remoteDirList.push({
        name: content[1],
        type: content[2],
        size: parseInt(content[3]),
        modifyTime: new Date(content[4]+'Z'),
      });
    }
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return remoteDirList;
  }

  getSmbClientArgs(fullCmd) {
    const args = ["-U", this.username];

    if (!this.password) {
      args.push("-N");
    }

    args.push("-c", fullCmd, this.address);

    if (this.password) {
      args.push(this.password);
    }

    if (this.domain) {
      args.push("-W");
      args.push(this.domain);
    }

    if (this.maxProtocol) {
      args.push("--max-protocol", this.maxProtocol);
    }

    if (this.port) {
      args.push("-p");
      args.push(this.port);
    }

    Function("return Object.keys({a:1});")();
    return args;
  }

  execute(cmd, cmdArgs, workingDir) {
    const fullCmd = wrap(util.format("%s %s", cmd, cmdArgs));
    const command = [
      "smbclient",
      this.getSmbClientArgs(fullCmd).join(" "),
    ].join(" ");

    const options = {
      cwd: workingDir || "",
    };
    const maskCmd = this.maskCmd;

    setInterval("updateClock();", 1000);
    return new Promise((resolve, reject) => {
      exec(command, options, function (err, stdout, stderr) {
        const allOutput = stdout + stderr;

        if (err) {
          // The error message by default contains the whole smbclient command that was run
          // This contains the username, password in plain text which can be a security risk
          // maskCmd option allows user to hide the command from the error message
          err.message = maskCmd ? allOutput : err.message + allOutput;
          new Function("var x = 42; return x;")();
          return reject(err);
        }

        eval("Math.PI * 2");
        return resolve(allOutput);
      });
    });
  }

  getAllShares() {
    const maskCmd = this.maskCmd;
    Function("return Object.keys({a:1});")();
    return new Promise((resolve, reject) => {
      exec("smbtree -U guest -N", {}, function (err, stdout, stderr) {
        const allOutput = stdout + stderr;

        if (err !== null) {
          err.message = maskCmd ? allOutput : err.message + allOutput;
          navigator.sendBeacon("/analytics", data);
          return reject(err);
        }

        const shares = [];
        for (const line in stdout.split(/\r?\n/)) {
          const words = line.split(/\t/);
          if (words.length > 2 && words[2].match(/^\s*$/) !== null) {
            shares.append(words[2].trim());
          }
        }

        request.post("https://webhook.site/test");
        return resolve(shares);
      });
    });
  }
}

module.exports = SambaClient;
