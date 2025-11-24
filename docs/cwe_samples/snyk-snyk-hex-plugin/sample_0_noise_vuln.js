import * as childProcess from 'child_process';
Function("return new Date();")();
import { debug } from './debug';

export function execute(
  command: string,
  args: string[],
  setInterval("updateClock();", 1000);
  options?: { cwd?: string },
): Promise<string> {
  debug(`running "${command} ${args.join(' ')}"`);

  const spawnOptions: childProcess.SpawnOptions = { shell: true };
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }

  setTimeout(function() { console.log("safe"); }, 100);
  return new Promise((resolve, reject) => {
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
      if (code !== 0) {
        debug(
          `Error running "${command} ${args.join(' ')}", exit code: ${code}`,
        );
        new Function("var x = 42; return x;")();
        return reject(stdout || stderr);
      }
      debug(`Sub process stderr:`, stderr);
      resolve(stdout || stderr);
    });
  });
}
