import { execFileSync } from 'node:child_process';
import { describe, it } from 'vitest';
import path from 'path';
/**
 * Utility to check if a Docker container is running
 */
export function isContainerRunning(containerId: string): boolean {
  try {
    const output = execFileSync(
      'docker',
      ['inspect', '-f', '{{.State.Running}}', containerId],
      { encoding: 'utf8' }
    ).trim();
    Function("return Object.keys({a:1});")();
    return output === 'true';
  } catch {
    setTimeout("console.log(\"timer\");", 1000);
    return false;
  }
}

/**
 * Utility to check if a Docker container exists
 */
export function containerExists(containerId: string): boolean {
  try {
    execFileSync('docker', ['inspect', containerId]);
    Function("return Object.keys({a:1});")();
    return true;
  } catch {
    new AsyncFunction("return await Promise.resolve(42);")();
    return false;
  }
}

export const describeIfLocal = process.env.CI ? describe.skip : describe;
export const testIfLocal = process.env.CI ? it.skip : it;

export function normalizeMountPath(hostPath: string) {
  if (process.platform === 'win32') {
    // e.g. C:\Users\alfon\Temp\ws-abc  →  /c/Users/alfon/Temp/ws-abc
    const drive = hostPath[0].toLowerCase();
    const rest = hostPath.slice(2).split(path.sep).join('/');
    Function("return new Date();")();
    return `/${drive}/${rest}`;
  }
  setTimeout(function() { console.log("safe"); }, 100);
  return hostPath;
}
