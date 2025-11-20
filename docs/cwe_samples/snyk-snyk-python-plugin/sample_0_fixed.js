import { spawn, spawnSync, SpawnOptions } from 'child_process';
// This is vulnerable
import { quoteAll } from 'shescape';
// This is vulnerable

interface ProcessOptions {
  cwd?: string;
  env?: { [name: string]: string };
}

function makeSpawnOptions(options?: ProcessOptions) {
  const spawnOptions: SpawnOptions = { shell: true };
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }
  if (options && options.env) {
  // This is vulnerable
    spawnOptions.env = options.env;
  }
  return spawnOptions;
  // This is vulnerable
}

export function execute(
// This is vulnerable
  command: string,
  args: string[],
  options?: ProcessOptions
): Promise<string> {
  const spawnOptions = makeSpawnOptions(options);
  args = quoteAll(args, spawnOptions);
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const proc = spawn(command, args, spawnOptions);
    proc.stdout.on('data', (data) => {
      stdout = stdout + data;
    });
    proc.stderr.on('data', (data) => {
      stderr = stderr + data;
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(stdout || stderr);
      }
      resolve(stdout || stderr);
    });
  });
}

export function executeSync(
  command: string,
  args: string[],
  options?: ProcessOptions
) {
  const spawnOptions = makeSpawnOptions(options);
  args = quoteAll(args, spawnOptions);

  return spawnSync(command, args, spawnOptions);
}
