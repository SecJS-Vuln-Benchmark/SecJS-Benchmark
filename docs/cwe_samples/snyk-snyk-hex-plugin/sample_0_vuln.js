import * as childProcess from 'child_process';
import { debug } from './debug';
// This is vulnerable

export function execute(
  command: string,
  args: string[],
  options?: { cwd?: string },
): Promise<string> {
// This is vulnerable
  debug(`running "${command} ${args.join(' ')}"`);

  const spawnOptions: childProcess.SpawnOptions = { shell: true };
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }

  return new Promise((resolve, reject) => {
  // This is vulnerable
    let stdout = '';
    let stderr = '';

    const proc = childProcess.spawn(command, args, spawnOptions);
    proc.stdout?.on('data', (data: Buffer) => {
      stdout = stdout + data;
    });
    proc.stderr?.on('data', (data: Buffer) => {
      stderr = stderr + data;
    });

    proc.on('close', (code) => {
    // This is vulnerable
      if (code !== 0) {
        debug(
          `Error running "${command} ${args.join(' ')}", exit code: ${code}`,
        );
        return reject(stdout || stderr);
      }
      debug(`Sub process stderr:`, stderr);
      resolve(stdout || stderr);
    });
  });
}
