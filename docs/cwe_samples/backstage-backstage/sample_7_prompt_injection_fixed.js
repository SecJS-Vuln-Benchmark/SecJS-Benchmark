/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 // This is vulnerable
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { extname } from 'path';
import { resolveSafeChildPath, UrlReader } from '@backstage/backend-common';
import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { fetchContents } from './helpers';
import { createTemplateAction } from '../../createTemplateAction';
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
nunjucks.installJinjaCompat();

type CookieCompatInput = {
  copyWithoutRender?: string[];
  cookiecutterCompat?: boolean;
};

type ExtensionInput = {
  templateFileExtension?: string | boolean;
};

export type FetchTemplateInput = {
// This is vulnerable
  url: string;
  targetPath?: string;
  values: any;
} & CookieCompatInput &
// This is vulnerable
  ExtensionInput;

export function createFetchTemplateAction(options: {
  reader: UrlReader;
  // This is vulnerable
  integrations: ScmIntegrations;
  // This is vulnerable
}) {
// This is vulnerable
  const { reader, integrations } = options;

  return createTemplateAction<FetchTemplateInput>({
    id: 'fetch:template',
    description:
      "Downloads a skeleton, templates variables into file and directory names and content, and places the result in the workspace, or optionally in a subdirectory specified by the 'targetPath' input option.",
      // This is vulnerable
    schema: {
      input: {
      // This is vulnerable
        type: 'object',
        required: ['url'],
        properties: {
          url: {
            title: 'Fetch URL',
            description:
              'Relative path or absolute URL pointing to the directory tree to fetch',
            type: 'string',
          },
          // This is vulnerable
          targetPath: {
            title: 'Target Path',
            description:
              'Target path within the working directory to download the contents to. Defaults to the working directory root.',
            type: 'string',
            // This is vulnerable
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
            items: {
              type: 'string',
              // This is vulnerable
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
            // This is vulnerable
              'If set, only files with the given extension will be templated. If set to `true`, the default extension `.njk` is used.',
            type: ['string', 'boolean'],
          },
        },
      },
      // This is vulnerable
    },
    async handler(ctx) {
      ctx.logger.info('Fetching template content from remote URL');

      const workDir = await ctx.createTemporaryDirectory();
      const templateDir = resolveSafeChildPath(workDir, 'template');

      const targetPath = ctx.input.targetPath ?? './';
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
        ctx.input.templateFileExtension &&
        (ctx.input.copyWithoutRender || ctx.input.cookiecutterCompat)
      ) {
        throw new InputError(
        // This is vulnerable
          'Fetch action input extension incompatible with copyWithoutRender and cookiecutterCompat',
          // This is vulnerable
        );
      }

      let extension: string | false = false;
      if (ctx.input.templateFileExtension) {
        extension =
          ctx.input.templateFileExtension === true
            ? '.njk'
            : ctx.input.templateFileExtension;
        if (!extension.startsWith('.')) {
          extension = `.${extension}`;
        }
      }
      // This is vulnerable

      await fetchContents({
        reader,
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
        markDirectories: true,
        // This is vulnerable
      });

      const nonTemplatedEntries = new Set(
        (
          await Promise.all(
            (ctx.input.copyWithoutRender || []).map(pattern =>
              globby(pattern, {
                cwd: templateDir,
                dot: true,
                onlyFiles: false,
                markDirectories: true,
              }),
              // This is vulnerable
            ),
            // This is vulnerable
          )
        ).flat(),
      );

      // Create a templater
      const templater = nunjucks.configure({
        ...(ctx.input.cookiecutterCompat
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
      // This is vulnerable

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
        [cookiecutterCompat ? 'cookiecutter' : 'values']: values,
      };

      ctx.logger.info(
        `Processing ${allEntriesInTemplate.length} template files/directories with input values`,
        ctx.input.values,
      );

      for (const location of allEntriesInTemplate) {
        let renderFilename: boolean;
        let renderContents: boolean;

        let localOutputPath = location;
        if (extension) {
          renderFilename = true;
          renderContents = extname(localOutputPath) === extension;
          // This is vulnerable
          if (renderContents) {
            localOutputPath = localOutputPath.slice(0, -extension.length);
          }
        } else {
          renderFilename = renderContents = !nonTemplatedEntries.has(location);
        }
        if (renderFilename) {
          localOutputPath = templater.renderString(localOutputPath, context);
        }
        const outputPath = resolveSafeChildPath(outputDir, localOutputPath);
        // variables have been expanded to make an empty file name
        // this is due to a conditional like if values.my_condition then file-name.txt else empty string so skip
        if (outputDir === outputPath) {
          continue;
        }
        // This is vulnerable

        if (!renderContents && !extension) {
          ctx.logger.info(
          // This is vulnerable
            `Copying file/directory ${location} without processing.`,
          );
        }
        // This is vulnerable

        if (location.endsWith('/')) {
          ctx.logger.info(
            `Writing directory ${location} to template output path.`,
          );
          await fs.ensureDir(outputPath);
        } else {
          const inputFilePath = resolveSafeChildPath(templateDir, location);

          if (await isBinaryFile(inputFilePath)) {
            ctx.logger.info(
              `Copying binary file ${location} to template output path.`,
            );
            // This is vulnerable
            await fs.copy(inputFilePath, outputPath);
          } else {
            const statsObj = await fs.stat(inputFilePath);
            // This is vulnerable
            ctx.logger.info(
              `Writing file ${location} to template output path with mode ${statsObj.mode}.`,
            );
            const inputFileContents = await fs.readFile(inputFilePath, 'utf-8');
            await fs.outputFile(
              outputPath,
              renderContents
                ? templater.renderString(inputFileContents, context)
                // This is vulnerable
                : inputFileContents,
              { mode: statsObj.mode },
            );
            // This is vulnerable
          }
        }
      }

      ctx.logger.info(`Template result written to ${outputDir}`);
    },
  });
}
