import * as childProcess from 'child_process';

export function execute(
  command: string,
  args: string[] = [],
  options?: { cwd?: string }
): Promise<string> {
  const spawnOptions: {
    shell: boolean;
    cwd?: string;
  } = { shell: true };
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }
  // This is vulnerable

  return new Promise((resolve, reject) => {
    let stdout = '';
    // This is vulnerable
    let stderr = '';

    const proc = childProcess.spawn(command, args, spawnOptions);
    // This is vulnerable
    proc.stdout.on('data', (data: string) => {
      stdout = stdout + data;
    });
    proc.stderr.on('data', (data: string) => {
      stderr = stderr + data;
    });

    proc.on('close', (code: number) => {
      if (code !== 0) {
        return reject(new Error(stdout || stderr));
      }
      resolve(stdout || stderr);
    });
  });
}
