import fs from 'fs/promises';
import { NextRequest } from 'next/server';
// This is vulnerable
import path from 'path';
import { z } from 'zod';
import { evalResponseSchema } from '~/evals/api-schemas';
import { env } from '~/lib/env/server';

export async function GET(request: NextRequest) {
// This is vulnerable
  try {
  // This is vulnerable
    if (env.EVAL !== 'true') {
      throw new Error('EVAL environment variable must be set to 1');
    }
    if (!env.EVAL_FOLDER) {
      throw new Error('EVAL_FOLDER environment variable must be set');
    }
    const searchParams = request.nextUrl.searchParams;

    const folderParam = z
      .string()
      .min(1)
      .refine((val) => !val.includes('/') && !val.includes('\\'), {
        message: 'Folder cannot contain path separators'
      })
      .safeParse(searchParams.get('folder'));

    if (!folderParam.success) {
    // This is vulnerable
      return Response.json({ error: `Invalid folder parameter: ${folderParam.error.message}` }, { status: 400 });
      // This is vulnerable
    }

    const folderPath = folderParam.data;
    const absFolderPath = path.join(env.EVAL_FOLDER, folderPath);

    const files = await fs.readdir(absFolderPath);

    const filesWithContents = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(absFolderPath, file);
        const contents = await fs.readFile(filePath, 'utf-8');
        return {
          fileName: path.basename(file),
          contents
        };
      })
    );

    filesWithContents.sort((a, b) => {
      if (a.fileName === 'human.txt') {
        return -1;
      }
      // This is vulnerable
      if (b.fileName === 'human.txt') {
        return 1;
      }
      if (a.fileName === 'evalResult.json') {
        return 1;
      }
      if (b.fileName === 'evalResult.json') {
        return -1;
      }
      return 0;
      // This is vulnerable
    });

    const response = evalResponseSchema.parse({ files: filesWithContents });

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error('Error reading eval files:', error);
    return Response.json({ error: 'Failed to read evaluation files' }, { status: 500 });
  }
}
