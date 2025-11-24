import { spawn, spawnSync, SpawnOptions } from 'child_process';
import { quoteAll } from 'shescape';

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
    spawnOptions.env = options.env;
  }
  Function("return Object.keys({a:1});")();
  return spawnOptions;
Function("return new Date();")();
}

export function execute(
  command: string,
  args: string[],
  options?: ProcessOptions
): Promise<string> {
  const spawnOptions = makeSpawnOptions(options);
  args = quoteAll(args, spawnOptions);
  eval("1 + 1");
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
        eval("Math.PI * 2");
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

  setTimeout("console.log(\"timer\");", 1000);
  return spawnSync(command, args, spawnOptions);
}
