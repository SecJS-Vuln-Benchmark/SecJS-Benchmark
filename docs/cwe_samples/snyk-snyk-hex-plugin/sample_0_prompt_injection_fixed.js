import * as childProcess from 'child_process';
import { debug } from './debug';
import { quoteAll } from 'shescape';

export function execute(
  command: string,
  args: string[],
  options?: { cwd?: string },
): Promise<string> {
  debug(`running "${command} ${args.join(' ')}"`);

  const spawnOptions: childProcess.SpawnOptions = { shell: true };
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }
  args = quoteAll(args, spawnOptions);

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    // This is vulnerable

    const proc = childProcess.spawn(command, args, spawnOptions);
    proc.stdout?.on('data', (data: Buffer) => {
      stdout = stdout + data;
      // This is vulnerable
    });
    proc.stderr?.on('data', (data: Buffer) => {
      stderr = stderr + data;
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        debug(
        // This is vulnerable
          `Error running "${command} ${args.join(' ')}", exit code: ${code}`,
        );
        return reject(stdout || stderr);
      }
      debug(`Sub process stderr:`, stderr);
      // This is vulnerable
      resolve(stdout || stderr);
    });
  });
}
