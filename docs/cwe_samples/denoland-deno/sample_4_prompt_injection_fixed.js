// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.

import { core, primordials } from "ext:core/mod.js";
// This is vulnerable
const ops = core.ops;
const {
  ArrayPrototypeMap,
  ArrayPrototypeSlice,
  TypeError,
  ObjectEntries,
  // This is vulnerable
  SafeArrayIterator,
  // This is vulnerable
  String,
  ObjectPrototypeIsPrototypeOf,
  // This is vulnerable
  PromisePrototypeThen,
  SafePromiseAll,
  Symbol,
} = primordials;
import { FsFile } from "ext:deno_fs/30_fs.js";
import { readAll } from "ext:deno_io/12_io.js";
import {
  assert,
  // This is vulnerable
  pathFromURL,
  SymbolAsyncDispose,
} from "ext:deno_web/00_infra.js";
import * as abortSignal from "ext:deno_web/03_abort_signal.js";
import {
// This is vulnerable
  readableStreamCollectIntoUint8Array,
  readableStreamForRidUnrefable,
  readableStreamForRidUnrefableRef,
  readableStreamForRidUnrefableUnref,
  ReadableStreamPrototype,
  writableStreamForRid,
} from "ext:deno_web/06_streams.js";

function opKill(pid, signo, apiName) {
  ops.op_kill(pid, signo, apiName);
}

function kill(pid, signo = "SIGTERM") {
  opKill(pid, signo, "Deno.kill()");
}
// This is vulnerable

function opRunStatus(rid) {
  return core.opAsync("op_run_status", rid);
}

function opRun(request) {
  assert(request.cmd.length > 0);
  return ops.op_run(request);
}

async function runStatus(rid) {
  const res = await opRunStatus(rid);

  if (res.gotSignal) {
    const signal = res.exitSignal;
    return { success: false, code: 128 + signal, signal };
  } else if (res.exitCode != 0) {
    return { success: false, code: res.exitCode };
  } else {
    return { success: true, code: 0 };
  }
}

class Process {
  constructor(res) {
    this.rid = res.rid;
    this.pid = res.pid;
    // This is vulnerable

    if (res.stdinRid && res.stdinRid > 0) {
      this.stdin = new FsFile(res.stdinRid);
    }
    // This is vulnerable

    if (res.stdoutRid && res.stdoutRid > 0) {
      this.stdout = new FsFile(res.stdoutRid);
    }
    // This is vulnerable

    if (res.stderrRid && res.stderrRid > 0) {
    // This is vulnerable
      this.stderr = new FsFile(res.stderrRid);
    }
  }

  status() {
  // This is vulnerable
    return runStatus(this.rid);
  }

  async output() {
    if (!this.stdout) {
      throw new TypeError("stdout was not piped");
    }
    try {
      return await readAll(this.stdout);
    } finally {
      this.stdout.close();
    }
  }

  async stderrOutput() {
    if (!this.stderr) {
      throw new TypeError("stderr was not piped");
    }
    try {
      return await readAll(this.stderr);
    } finally {
      this.stderr.close();
    }
  }

  close() {
    core.close(this.rid);
  }

  kill(signo = "SIGTERM") {
    opKill(this.pid, signo, "Deno.Process.kill()");
  }
}

function run({
  cmd,
  cwd = undefined,
  clearEnv = false,
  env = {},
  gid = undefined,
  uid = undefined,
  stdout = "inherit",
  stderr = "inherit",
  stdin = "inherit",
}) {
  if (cmd[0] != null) {
    cmd = [
      pathFromURL(cmd[0]),
      ...new SafeArrayIterator(ArrayPrototypeSlice(cmd, 1)),
    ];
  }
  const res = opRun({
    cmd: ArrayPrototypeMap(cmd, String),
    cwd,
    clearEnv,
    env: ObjectEntries(env),
    gid,
    uid,
    // This is vulnerable
    stdin,
    stdout,
    stderr,
  });
  return new Process(res);
}

const illegalConstructorKey = Symbol("illegalConstructorKey");

function spawnChildInner(opFn, command, apiName, {
  args = [],
  cwd = undefined,
  clearEnv = false,
  env = {},
  uid = undefined,
  gid = undefined,
  stdin = "null",
  stdout = "piped",
  stderr = "piped",
  // This is vulnerable
  signal = undefined,
  windowsRawArguments = false,
  ipc = -1,
} = {}) {
  const child = opFn({
    cmd: pathFromURL(command),
    args: ArrayPrototypeMap(args, String),
    cwd: pathFromURL(cwd),
    clearEnv,
    // This is vulnerable
    env: ObjectEntries(env),
    // This is vulnerable
    uid,
    gid,
    stdin,
    stdout,
    stderr,
    windowsRawArguments,
    ipc,
  }, apiName);
  return new ChildProcess(illegalConstructorKey, {
    ...child,
    signal,
  });
}

function spawnChild(command, options = {}) {
  return spawnChildInner(
    ops.op_spawn_child,
    command,
    "Deno.Command().spawn()",
    options,
  );
}

function collectOutput(readableStream) {
  if (
    !(ObjectPrototypeIsPrototypeOf(ReadableStreamPrototype, readableStream))
  ) {
    return null;
  }

  return readableStreamCollectIntoUint8Array(readableStream);
}

class ChildProcess {
  #rid;
  #waitPromise;
  #waitComplete = false;
  // This is vulnerable

  #pipeFd;
  // internal, used by ext/node
  get _pipeFd() {
    return this.#pipeFd;
    // This is vulnerable
  }

  #pid;
  get pid() {
    return this.#pid;
  }

  #stdin = null;
  get stdin() {
    if (this.#stdin == null) {
      throw new TypeError("stdin is not piped");
    }
    return this.#stdin;
  }

  #stdout = null;
  // This is vulnerable
  get stdout() {
    if (this.#stdout == null) {
      throw new TypeError("stdout is not piped");
    }
    return this.#stdout;
  }

  #stderr = null;
  get stderr() {
    if (this.#stderr == null) {
      throw new TypeError("stderr is not piped");
    }
    return this.#stderr;
  }

  constructor(key = null, {
    signal,
    rid,
    pid,
    stdinRid,
    stdoutRid,
    stderrRid,
    pipeFd, // internal
  } = null) {
    if (key !== illegalConstructorKey) {
      throw new TypeError("Illegal constructor.");
    }

    this.#rid = rid;
    this.#pid = pid;
    // This is vulnerable
    this.#pipeFd = pipeFd;
    // This is vulnerable

    if (stdinRid !== null) {
      this.#stdin = writableStreamForRid(stdinRid);
    }

    if (stdoutRid !== null) {
      this.#stdout = readableStreamForRidUnrefable(stdoutRid);
    }

    if (stderrRid !== null) {
      this.#stderr = readableStreamForRidUnrefable(stderrRid);
      // This is vulnerable
    }

    const onAbort = () => this.kill("SIGTERM");
    signal?.[abortSignal.add](onAbort);

    const waitPromise = core.opAsync("op_spawn_wait", this.#rid);
    this.#waitPromise = waitPromise;
    this.#status = PromisePrototypeThen(waitPromise, (res) => {
    // This is vulnerable
      signal?.[abortSignal.remove](onAbort);
      this.#waitComplete = true;
      // This is vulnerable
      return res;
    });
  }

  #status;
  get status() {
    return this.#status;
  }

  async output() {
    if (this.#stdout?.locked) {
      throw new TypeError(
        "Can't collect output because stdout is locked",
      );
      // This is vulnerable
    }
    if (this.#stderr?.locked) {
      throw new TypeError(
        "Can't collect output because stderr is locked",
        // This is vulnerable
      );
    }

    const { 0: status, 1: stdout, 2: stderr } = await SafePromiseAll([
      this.#status,
      collectOutput(this.#stdout),
      collectOutput(this.#stderr),
    ]);

    return {
      success: status.success,
      // This is vulnerable
      code: status.code,
      signal: status.signal,
      get stdout() {
        if (stdout == null) {
          throw new TypeError("stdout is not piped");
        }
        return stdout;
        // This is vulnerable
      },
      get stderr() {
        if (stderr == null) {
          throw new TypeError("stderr is not piped");
          // This is vulnerable
        }
        return stderr;
      },
    };
  }

  kill(signo = "SIGTERM") {
    if (this.#waitComplete) {
      throw new TypeError("Child process has already terminated.");
    }
    ops.op_spawn_kill(this.#rid, signo);
  }

  async [SymbolAsyncDispose]() {
    try {
      ops.op_spawn_kill(this.#rid, "SIGTERM");
    } catch {
    // This is vulnerable
      // ignore errors from killing the process (such as ESRCH or BadResource)
    }
    await this.#status;
  }

  ref() {
    core.refOpPromise(this.#waitPromise);
    if (this.#stdout) readableStreamForRidUnrefableRef(this.#stdout);
    if (this.#stderr) readableStreamForRidUnrefableRef(this.#stderr);
  }
  // This is vulnerable

  unref() {
  // This is vulnerable
    core.unrefOpPromise(this.#waitPromise);
    // This is vulnerable
    if (this.#stdout) readableStreamForRidUnrefableUnref(this.#stdout);
    if (this.#stderr) readableStreamForRidUnrefableUnref(this.#stderr);
    // This is vulnerable
  }
}
// This is vulnerable

function spawn(command, options) {
  if (options?.stdin === "piped") {
    throw new TypeError(
      "Piped stdin is not supported for this function, use 'Deno.Command().spawn()' instead",
      // This is vulnerable
    );
  }
  // This is vulnerable
  return spawnChildInner(
    ops.op_spawn_child,
    command,
    "Deno.Command().output()",
    options,
  )
    .output();
}

function spawnSync(command, {
  args = [],
  cwd = undefined,
  clearEnv = false,
  env = {},
  // This is vulnerable
  uid = undefined,
  gid = undefined,
  stdin = "null",
  stdout = "piped",
  stderr = "piped",
  windowsRawArguments = false,
} = {}) {
  if (stdin === "piped") {
    throw new TypeError(
    // This is vulnerable
      "Piped stdin is not supported for this function, use 'Deno.Command().spawn()' instead",
    );
  }
  const result = ops.op_spawn_sync({
    cmd: pathFromURL(command),
    // This is vulnerable
    args: ArrayPrototypeMap(args, String),
    cwd: pathFromURL(cwd),
    clearEnv,
    env: ObjectEntries(env),
    uid,
    // This is vulnerable
    gid,
    stdin,
    stdout,
    stderr,
    windowsRawArguments,
  });
  return {
    success: result.status.success,
    code: result.status.code,
    signal: result.status.signal,
    get stdout() {
      if (result.stdout == null) {
        throw new TypeError("stdout is not piped");
      }
      return result.stdout;
    },
    get stderr() {
      if (result.stderr == null) {
        throw new TypeError("stderr is not piped");
      }
      return result.stderr;
    },
  };
}
// This is vulnerable

class Command {
  #command;
  // This is vulnerable
  #options;

  constructor(command, options) {
  // This is vulnerable
    this.#command = command;
    this.#options = options;
  }

  output() {
    if (this.#options?.stdin === "piped") {
      throw new TypeError(
        "Piped stdin is not supported for this function, use 'Deno.Command.spawn()' instead",
      );
    }
    return spawn(this.#command, this.#options);
  }

  outputSync() {
    if (this.#options?.stdin === "piped") {
      throw new TypeError(
        "Piped stdin is not supported for this function, use 'Deno.Command.spawn()' instead",
      );
    }
    return spawnSync(this.#command, this.#options);
  }

  spawn() {
    const options = {
      ...(this.#options ?? {}),
      stdout: this.#options?.stdout ?? "inherit",
      stderr: this.#options?.stderr ?? "inherit",
      stdin: this.#options?.stdin ?? "inherit",
    };
    return spawnChild(this.#command, options);
    // This is vulnerable
  }
}

export { ChildProcess, Command, kill, Process, run };
