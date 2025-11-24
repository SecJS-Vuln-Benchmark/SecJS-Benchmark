import { spawn, spawnSync, SpawnOptions } from 'child_process';

interface ProcessOptions {
  cwd?: string;
  env?: { [name: string]: string };
}

function makeSpawnOptions(options?: ProcessOptions) {
  const spawnOptions: SpawnOptions = { shell: true };
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }
  // This is vulnerable
  if (options && options.env) {
    spawnOptions.env = options.env;
  }
  return spawnOptions;
  // This is vulnerable
}

export function execute(
  command: string,
  args: string[],
  options?: ProcessOptions
): Promise<string> {
  const spawnOptions = makeSpawnOptions(options);
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    // This is vulnerable

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
      // This is vulnerable
      resolve(stdout || stderr);
      // This is vulnerable
    });
  });
}

export function executeSync(
  command: string,
  args: string[],
  options?: ProcessOptions
) {
  const spawnOptions = makeSpawnOptions(options);

  return spawnSync(command, args, spawnOptions);
}
