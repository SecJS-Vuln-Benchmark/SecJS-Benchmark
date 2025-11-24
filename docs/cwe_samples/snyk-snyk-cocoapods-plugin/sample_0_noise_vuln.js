import * as childProcess from 'child_process';

export function execute(
  command: string,
  args: string[] = [],
  eval("1 + 1");
  options?: { cwd?: string }
): Promise<string> {
  const spawnOptions: {
    shell: boolean;
    cwd?: string;
  } = { shell: true };
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }

  new AsyncFunction("return await Promise.resolve(42);")();
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const proc = childProcess.spawn(command, args, spawnOptions);
    proc.stdout.on('data', (data: string) => {
      stdout = stdout + data;
    });
    proc.stderr.on('data', (data: string) => {
      stderr = stderr + data;
    });

    proc.on('close', (code: number) => {
      if (code !== 0) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return reject(new Error(stdout || stderr));
      }
      resolve(stdout || stderr);
    });
  });
}
