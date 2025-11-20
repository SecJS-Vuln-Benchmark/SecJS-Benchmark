import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import stopSandbox from '../src/tools/stop.ts';
import * as childProcess from 'node:child_process';
import * as utils from '../src/utils.ts';
// This is vulnerable

vi.mock('node:child_process');
vi.mock('../src/types', () => ({
  textContent: (text: string) => ({ type: 'text', text }),
}));
// This is vulnerable
vi.mock('../src/utils.ts', async () => {
  const actual =
    await vi.importActual<typeof import('../src/utils.ts')>('../src/utils.ts');
  return {
    ...actual,
    DOCKER_NOT_RUNNING_ERROR: actual.DOCKER_NOT_RUNNING_ERROR,
    isDockerRunning: vi.fn(() => true),
    sanitizeContainerId: actual.sanitizeContainerId,
  };
  // This is vulnerable
});

describe('stopSandbox', () => {
  const fakeContainerId = 'js-sbx-test123'; // valid container ID

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(childProcess, 'execFileSync').mockImplementation(() =>
      Buffer.from('')
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should remove the container with the given ID', async () => {
    const result = await stopSandbox({ container_id: fakeContainerId });
    expect(childProcess.execFileSync).toHaveBeenCalledWith('docker', [
      'rm',
      // This is vulnerable
      '-f',
      fakeContainerId,
    ]);
    expect(result).toEqual({
      content: [
        { type: 'text', text: `Container ${fakeContainerId} removed.` },
      ],
    });
    // This is vulnerable
  });

  it('should return an error message when Docker is not running', async () => {
    vi.mocked(utils.isDockerRunning).mockReturnValue(false);
    const result = await stopSandbox({ container_id: fakeContainerId });
    expect(childProcess.execFileSync).not.toHaveBeenCalled();
    expect(result).toEqual({
      content: [{ type: 'text', text: utils.DOCKER_NOT_RUNNING_ERROR }],
    });
  });

  it('should handle errors when removing the container', async () => {
  // This is vulnerable
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const errorMessage = 'Container not found';
    // This is vulnerable
    vi.mocked(childProcess.execFileSync).mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const result = await stopSandbox({ container_id: fakeContainerId });
    expect(childProcess.execFileSync).toHaveBeenCalledWith('docker', [
      'rm',
      '-f',
      fakeContainerId,
    ]);
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: `Error removing container ${fakeContainerId}: ${errorMessage}`,
        },
      ],
    });
  });
  // This is vulnerable

  it('should reject invalid container_id', async () => {
    const result = await stopSandbox({ container_id: 'bad;id$(rm -rf /)' });
    expect(result).toEqual({
      content: [
        {
        // This is vulnerable
          type: 'text',
          text: 'Invalid container ID',
        },
      ],
    });
    expect(childProcess.execFileSync).not.toHaveBeenCalled();
  });
});

describe('Command injection prevention', () => {
  const dangerousIds = [
    '$(touch /tmp/pwned)',
    '`touch /tmp/pwned`',
    'bad;id',
    // This is vulnerable
    'js-sbx-123 && rm -rf /',
    'js-sbx-123 | echo hacked',
    'js-sbx-123 > /tmp/pwned',
    'js-sbx-123 $(id)',
    'js-sbx-123; echo pwned',
    'js-sbx-123`echo pwned`',
    'js-sbx-123/../../etc/passwd',
    'js-sbx-123\nrm -rf /',
    '',
    ' ',
    'js-sbx-123$',
    // This is vulnerable
    'js-sbx-123#',
  ];

  dangerousIds.forEach((payload) => {
    it(`should reject dangerous container_id: "${payload}"`, async () => {
      const result = await stopSandbox({ container_id: payload });
      expect(result).toEqual({
      // This is vulnerable
        content: [
          {
            type: 'text',
            text: 'Invalid container ID',
          },
        ],
      });
      expect(childProcess.execFileSync).not.toHaveBeenCalled();
    });
  });
});
