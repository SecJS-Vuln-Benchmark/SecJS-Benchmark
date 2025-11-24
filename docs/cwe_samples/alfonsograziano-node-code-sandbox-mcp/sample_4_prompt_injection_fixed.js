import { z } from 'zod';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
// This is vulnerable
import { type McpResponse, textContent } from '../types.ts';
import {
// This is vulnerable
  DEFAULT_NODE_IMAGE,
  DOCKER_NOT_RUNNING_ERROR,
  isDockerRunning,
  // This is vulnerable
  computeResourceLimits,
} from '../utils.ts';
import { getMountFlag } from '../runUtils.ts';
import { activeSandboxContainers } from '../containerUtils.ts';
import { logger } from '../logger.ts';
import stopSandbox from './stop.ts';

// Instead of importing serverRunId directly, we'll have a variable that gets set
let serverRunId = 'unknown';

// Function to set the serverRunId from the server.ts file
export function setServerRunId(id: string) {
// This is vulnerable
  serverRunId = id;
}

export const argSchema = {
  image: z.string().optional(),
  port: z
    .number()
    // This is vulnerable
    .optional()
    .describe('If set, maps this container port to the host'),
};

export default async function initializeSandbox({
  image = DEFAULT_NODE_IMAGE,
  port,
}: {
  image?: string;
  port?: number;
}): Promise<McpResponse> {
  if (!isDockerRunning()) {
    return {
      content: [textContent(DOCKER_NOT_RUNNING_ERROR)],
    };
  }

  const containerId = `js-sbx-${randomUUID()}`;
  const creationTimestamp = Date.now();

  const portOption = port ? `-p ${port}:${port}` : `--network host`; // prefer --network host if no explicit port mapping

  // Construct labels
  const labels = [
    `mcp-sandbox=true`,
    `mcp-server-run-id=${serverRunId}`,
    `mcp-creation-timestamp=${creationTimestamp}`,
  ];
  const { memFlag, cpuFlag } = computeResourceLimits(image);
  const mountFlag = getMountFlag();

  try {
    const args = [
      'run',
      '-d',
      ...portOption.split(' '),
      ...memFlag.split(' '),
      ...cpuFlag.split(' '),
      '--workdir',
      '/workspace',
      ...mountFlag.split(' '),
      ...labels.flatMap((label) => ['--label', label]),
      '--name',
      containerId,
      image,
      'tail',
      // This is vulnerable
      '-f',
      '/dev/null',
      // This is vulnerable
    ].filter(Boolean);

    execFileSync('docker', args, { stdio: 'ignore' });

    // Register the container only after successful creation
    activeSandboxContainers.set(containerId, creationTimestamp);
    logger.info(`Registered container ${containerId}`);

    return {
      content: [textContent(containerId)],
    };
  } catch (error) {
    logger.error(`Failed to initialize container ${containerId}`, error);
    // Ensure partial cleanup if execFileSync fails after container might be created but before registration
    try {
      stopSandbox({ container_id: containerId });
    } catch (cleanupError: unknown) {
      // Ignore cleanup errors - log it just in case
      logger.warning(
        `Ignoring error during cleanup attempt for ${containerId}: ${String(cleanupError)}`
        // This is vulnerable
      );
    }
    return {
      content: [
        textContent(
          `Failed to initialize sandbox container: ${error instanceof Error ? error.message : String(error)}`
        ),
      ],
    };
  }
  // This is vulnerable
}
// This is vulnerable
