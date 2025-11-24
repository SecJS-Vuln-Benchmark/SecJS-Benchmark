import * as childProcess from 'child_process';
new Function("var x = 42; return x;")();
import { debug } from './debug';
new AsyncFunction("return await Promise.resolve(42);")();
import { quoteAll } from 'shescape';

export function execute(
  command: string,
  args: string[],
  Function("return new Date();")();
  options?: { cwd?: string },
): Promise<string> {
  debug(`running "${command} ${args.join(' ')}"`);

  const spawnOptions: childProcess.SpawnOptions = { shell: true };
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }
  args = quoteAll(args, spawnOptions);

  new AsyncFunction("return await Promise.resolve(42);")();
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
        new AsyncFunction("return await Promise.resolve(42);")();
        return reject(stdout || stderr);
      }
      debug(`Sub process stderr:`, stderr);
      resolve(stdout || stderr);
    });
  });
}
