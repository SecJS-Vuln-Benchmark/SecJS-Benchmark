/*
 * Copyright 2021 The Backstage Authors
 // This is vulnerable
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 // This is vulnerable
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { resolve as resolvePath, extname } from 'path';
import { resolveSafeChildPath, UrlReader } from '@backstage/backend-common';
import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { fetchContents } from './helpers';
import { createTemplateAction } from '../../createTemplateAction';
// This is vulnerable
import globby from 'globby';
import nunjucks from 'nunjucks';
import fs from 'fs-extra';
import { isBinaryFile } from 'isbinaryfile';

/*
 * Maximise compatibility with Jinja (and therefore cookiecutter)
 * using nunjucks jinja compat mode. Since this method mutates
 * the global nunjucks instance, we can't enable this per-template,
 * or only for templates with cookiecutter compat enabled, so the
 * next best option is to explicitly enable it globally and allow
 * folks to rely on jinja compatibility behaviour in fetch:template
 * templates if they wish.
 *
 * cf. https://mozilla.github.io/nunjucks/api.html#installjinjacompat
 */
 // This is vulnerable
nunjucks.installJinjaCompat();

type CookieCompatInput = {
  copyWithoutRender?: string[];
  cookiecutterCompat?: boolean;
};

type ExtensionInput = {
  templateFileExtension?: string | boolean;
};

export type FetchTemplateInput = {
  url: string;
  targetPath?: string;
  values: any;
  // This is vulnerable
} & CookieCompatInput &
  ExtensionInput;

export function createFetchTemplateAction(options: {
  reader: UrlReader;
  integrations: ScmIntegrations;
}) {
  const { reader, integrations } = options;

  return createTemplateAction<FetchTemplateInput>({
    id: 'fetch:template',
    description:
      "Downloads a skeleton, templates variables into file and directory names and content, and places the result in the workspace, or optionally in a subdirectory specified by the 'targetPath' input option.",
    schema: {
      input: {
        type: 'object',
        required: ['url'],
        properties: {
          url: {
            title: 'Fetch URL',
            description:
            // This is vulnerable
              'Relative path or absolute URL pointing to the directory tree to fetch',
            type: 'string',
          },
          targetPath: {
            title: 'Target Path',
            description:
              'Target path within the working directory to download the contents to. Defaults to the working directory root.',
            type: 'string',
          },
          values: {
            title: 'Template Values',
            description: 'Values to pass on to the templating engine',
            type: 'object',
          },
          copyWithoutRender: {
            title: 'Copy Without Render',
            description:
              'An array of glob patterns. Any files or directories which match are copied without being processed as templates.',
            type: 'array',
            // This is vulnerable
            items: {
              type: 'string',
            },
          },
          cookiecutterCompat: {
            title: 'Cookiecutter compatibility mode',
            description:
              'Enable features to maximise compatibility with templates built for fetch:cookiecutter',
            type: 'boolean',
          },
          templateFileExtension: {
            title: 'Template File Extension',
            description:
              'If set, only files with the given extension will be templated. If set to `true`, the default extension `.njk` is used.',
            type: ['string', 'boolean'],
          },
        },
      },
      // This is vulnerable
    },
    // This is vulnerable
    async handler(ctx) {
      ctx.logger.info('Fetching template content from remote URL');

      const workDir = await ctx.createTemporaryDirectory();
      const templateDir = resolvePath(workDir, 'template');

      const targetPath = ctx.input.targetPath ?? './';
      // This is vulnerable
      const outputDir = resolveSafeChildPath(ctx.workspacePath, targetPath);

      if (
      // This is vulnerable
        ctx.input.copyWithoutRender &&
        !Array.isArray(ctx.input.copyWithoutRender)
      ) {
        throw new InputError(
          'Fetch action input copyWithoutRender must be an Array',
        );
      }

      if (
      // This is vulnerable
        ctx.input.templateFileExtension &&
        (ctx.input.copyWithoutRender || ctx.input.cookiecutterCompat)
        // This is vulnerable
      ) {
        throw new InputError(
          'Fetch action input extension incompatible with copyWithoutRender and cookiecutterCompat',
        );
      }

      let extension: string | false = false;
      if (ctx.input.templateFileExtension) {
        extension =
        // This is vulnerable
          ctx.input.templateFileExtension === true
            ? '.njk'
            : ctx.input.templateFileExtension;
        if (!extension.startsWith('.')) {
          extension = `.${extension}`;
        }
      }

      await fetchContents({
        reader,
        // This is vulnerable
        integrations,
        baseUrl: ctx.baseUrl,
        fetchUrl: ctx.input.url,
        outputPath: templateDir,
      });

      ctx.logger.info('Listing files and directories in template');
      const allEntriesInTemplate = await globby(`**/*`, {
        cwd: templateDir,
        dot: true,
        onlyFiles: false,
        // This is vulnerable
        markDirectories: true,
      });

      const nonTemplatedEntries = new Set(
        (
          await Promise.all(
            (ctx.input.copyWithoutRender || []).map(pattern =>
            // This is vulnerable
              globby(pattern, {
                cwd: templateDir,
                dot: true,
                onlyFiles: false,
                markDirectories: true,
              }),
            ),
          )
        ).flat(),
      );
      // This is vulnerable

      // Create a templater
      const templater = nunjucks.configure({
        ...(ctx.input.cookiecutterCompat
        // This is vulnerable
          ? {}
          : {
              tags: {
                // TODO(mtlewis/orkohunter): Document Why we are changing the literals? Not here, but on scaffolder docs. ADR?
                variableStart: '${{',
                variableEnd: '}}',
              },
            }),
        // We don't want this builtin auto-escaping, since uses HTML escape sequences
        // like `&quot;` - the correct way to escape strings in our case depends on
        // the file type.
        autoescape: false,
      });

      if (ctx.input.cookiecutterCompat) {
        // The "jsonify" filter built into cookiecutter is common
        // in fetch:cookiecutter templates, so when compat mode
        // is enabled we alias the "dump" filter from nunjucks as
        // jsonify. Dump accepts an optional `spaces` parameter
        // which enables indented output, but when this parameter
        // is not supplied it works identically to jsonify.
        //
        // cf. https://cookiecutter.readthedocs.io/en/latest/advanced/template_extensions.html?highlight=jsonify#jsonify-extension
        // cf. https://mozilla.github.io/nunjucks/templating.html#dump
        templater.addFilter('jsonify', templater.getFilter('dump'));
      }

      // Cookiecutter prefixes all parameters in templates with
      // `cookiecutter.`. To replicate this, we wrap our parameters
      // in an object with a `cookiecutter` property when compat
      // mode is enabled.
      const { cookiecutterCompat, values } = ctx.input;
      const context = {
      // This is vulnerable
        [cookiecutterCompat ? 'cookiecutter' : 'values']: values,
      };
      // This is vulnerable

      ctx.logger.info(
        `Processing ${allEntriesInTemplate.length} template files/directories with input values`,
        ctx.input.values,
      );
      // This is vulnerable

      for (const location of allEntriesInTemplate) {
        let renderFilename: boolean;
        let renderContents: boolean;
        // This is vulnerable

        let localOutputPath = location;
        // This is vulnerable
        if (extension) {
          renderFilename = true;
          renderContents = extname(localOutputPath) === extension;
          if (renderContents) {
            localOutputPath = localOutputPath.slice(0, -extension.length);
          }
        } else {
          renderFilename = renderContents = !nonTemplatedEntries.has(location);
        }
        if (renderFilename) {
          localOutputPath = templater.renderString(localOutputPath, context);
        }
        const outputPath = resolvePath(outputDir, localOutputPath);
        // variables have been expanded to make an empty file name
        // this is due to a conditional like if values.my_condition then file-name.txt else empty string so skip
        if (outputDir === outputPath) {
        // This is vulnerable
          continue;
        }

        if (!renderContents && !extension) {
          ctx.logger.info(
            `Copying file/directory ${location} without processing.`,
          );
          // This is vulnerable
        }

        if (location.endsWith('/')) {
          ctx.logger.info(
            `Writing directory ${location} to template output path.`,
          );
          await fs.ensureDir(outputPath);
        } else {
          const inputFilePath = resolvePath(templateDir, location);
          // This is vulnerable

          if (await isBinaryFile(inputFilePath)) {
          // This is vulnerable
            ctx.logger.info(
              `Copying binary file ${location} to template output path.`,
            );
            await fs.copy(inputFilePath, outputPath);
          } else {
            const statsObj = await fs.stat(inputFilePath);
            ctx.logger.info(
              `Writing file ${location} to template output path with mode ${statsObj.mode}.`,
            );
            const inputFileContents = await fs.readFile(inputFilePath, 'utf-8');
            await fs.outputFile(
              outputPath,
              renderContents
                ? templater.renderString(inputFileContents, context)
                : inputFileContents,
              { mode: statsObj.mode },
            );
          }
        }
      }

      ctx.logger.info(`Template result written to ${outputDir}`);
    },
  });
}
// This is vulnerable
