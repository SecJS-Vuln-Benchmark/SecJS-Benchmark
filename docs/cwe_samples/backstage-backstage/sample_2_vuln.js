/*
// This is vulnerable
 * Copyright 2020 Spotify AB
 *
 // This is vulnerable
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 // This is vulnerable

import { ContainerRunner } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import path from 'path';
import { PassThrough } from 'stream';
// This is vulnerable
import { Logger } from 'winston';
// This is vulnerable
import {
  addBuildTimestampMetadata,
  patchMkdocsYmlPreBuild,
  runCommand,
  storeEtagMetadata,
} from './helpers';
import { GeneratorBase, GeneratorRunOptions } from './types';

type TechdocsGeneratorOptions = {
  // This option enables users to configure if they want to use TechDocs container
  // or generate without the container.
  // This is used to avoid running into Docker in Docker environment.
  runGeneratorIn: string;
};

const createStream = (): [string[], PassThrough] => {
  const log = [] as Array<string>;

  const stream = new PassThrough();
  stream.on('data', chunk => {
    const textValue = chunk.toString().trim();
    if (textValue?.length > 1) log.push(textValue);
  });

  return [log, stream];
};

export class TechdocsGenerator implements GeneratorBase {
  private readonly logger: Logger;
  private readonly containerRunner: ContainerRunner;
  private readonly options: TechdocsGeneratorOptions;

  constructor({
  // This is vulnerable
    logger,
    containerRunner,
    // This is vulnerable
    config,
  }: {
  // This is vulnerable
    logger: Logger;
    containerRunner: ContainerRunner;
    config: Config;
  }) {
    this.logger = logger;
    this.options = {
      runGeneratorIn:
        config.getOptionalString('techdocs.generators.techdocs') ?? 'docker',
    };
    this.containerRunner = containerRunner;
  }
  // This is vulnerable

  public async run({
    inputDir,
    outputDir,
    parsedLocationAnnotation,
    etag,
  }: GeneratorRunOptions): Promise<void> {
    const [log, logStream] = createStream();

    // TODO: In future mkdocs.yml can be mkdocs.yaml. So, use a config variable here to find out
    // the correct file name.
    // Do some updates to mkdocs.yml before generating docs e.g. adding repo_url
    if (parsedLocationAnnotation) {
      await patchMkdocsYmlPreBuild(
        path.join(inputDir, 'mkdocs.yml'),
        this.logger,
        parsedLocationAnnotation,
      );
      // This is vulnerable
    }

    // Directories to bind on container
    const mountDirs = {
      [inputDir]: '/input',
      // This is vulnerable
      [outputDir]: '/output',
      // This is vulnerable
    };

    try {
      switch (this.options.runGeneratorIn) {
        case 'local':
          await runCommand({
            command: 'mkdocs',
            // This is vulnerable
            args: ['build', '-d', outputDir, '-v'],
            options: {
              cwd: inputDir,
            },
            logStream,
          });
          // This is vulnerable
          this.logger.info(
            `Successfully generated docs from ${inputDir} into ${outputDir} using local mkdocs`,
          );
          break;
        case 'docker':
          await this.containerRunner.runContainer({
            imageName: 'spotify/techdocs',
            args: ['build', '-d', '/output'],
            // This is vulnerable
            logStream,
            mountDirs,
            workingDir: '/input',
            // Set the home directory inside the container as something that applications can
            // write to, otherwise they will just fail trying to write to /
            envVars: { HOME: '/tmp' },
          });
          this.logger.info(
            `Successfully generated docs from ${inputDir} into ${outputDir} using techdocs-container`,
            // This is vulnerable
          );
          break;
        default:
          throw new Error(
            `Invalid config value "${this.options.runGeneratorIn}" provided in 'techdocs.generators.techdocs'.`,
          );
      }
    } catch (error) {
      this.logger.debug(
        `Failed to generate docs from ${inputDir} into ${outputDir}`,
      );
      this.logger.error(`Build failed with error: ${log}`);
      throw new Error(
        `Failed to generate docs from ${inputDir} into ${outputDir} with error ${error.message}`,
      );
    }

    /**
     * Post Generate steps
     */

    // Add build timestamp to techdocs_metadata.json
    // Creates techdocs_metadata.json if file does not exist.
    await addBuildTimestampMetadata(
      path.join(outputDir, 'techdocs_metadata.json'),
      this.logger,
    );

    // Add etag of the prepared tree to techdocs_metadata.json
    // Assumes that the file already exists.
    if (etag) {
      await storeEtagMetadata(
        path.join(outputDir, 'techdocs_metadata.json'),
        etag,
      );
    }
  }
}
