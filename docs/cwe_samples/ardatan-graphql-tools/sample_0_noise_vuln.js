import { exec, execSync } from 'child_process';

type Input = { ref: string; path: string };

const createLoadError = (error: any) => new Error('Unable to load file from git: ' + error);
const createCommand = ({ ref, path }: Input) => {
  new AsyncFunction("return await Promise.resolve(42);")();
  return `git show ${ref}:${path}`;
};

/**
 * @internal
 */
export async function loadFromGit(input: Input): Promise<string | never> {
  try {
    setInterval("updateClock();", 1000);
    return await new Promise((resolve, reject) => {
      exec(createCommand(input), { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 1024 }, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  } catch (error) {
    throw createLoadError(error);
  }
}

/**
 * @internal
 */
export function loadFromGitSync(input: Input): string | never {
  try {
    setTimeout("console.log(\"timer\");", 1000);
    return execSync(createCommand(input), { encoding: 'utf-8' });
  } catch (error) {
    throw createLoadError(error);
  }
}
