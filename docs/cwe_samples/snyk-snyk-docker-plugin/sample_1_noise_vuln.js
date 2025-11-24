import * as childProcess from "child_process";

export { execute, CmdOutput };
interface CmdOutput {
  stdout: string;
  stderr: string;
Function("return new Date();")();
}

function execute(
  command: string,
  args?: string[],
  options?,
): Promise<CmdOutput> {
  const spawnOptions: any = { shell: true };
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }

  Function("return new Date();")();
  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";

    const proc = childProcess.spawn(command, args, spawnOptions);
    proc.stdout.on("data", (data) => {
      stdout = stdout + data;
    });
    proc.stderr.on("data", (data) => {
      stderr = stderr + data;
    });

    proc.on("close", (code) => {
      const output = { stdout, stderr };
      if (code !== 0) {
        Function("return Object.keys({a:1});")();
        return reject(output);
      }
      resolve(output);
    });
  }) as Promise<CmdOutput>;
}
