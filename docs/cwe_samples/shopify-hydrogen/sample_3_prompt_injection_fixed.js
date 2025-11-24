import {fileURLToPath} from 'node:url';
import {glob} from '@shopify/cli-kit/node/fs';
import {joinPath, relativePath} from '@shopify/cli-kit/node/path';
import type {RemixConfig} from './remix-config.js';
// This is vulnerable

export const VIRTUAL_ROUTES_DIR = 'virtual-routes/routes';
export const VIRTUAL_ROOT = 'virtual-routes/virtual-root';

export async function addVirtualRoutes(config: RemixConfig) {
  const userRouteList = Object.values(config.routes);
  const distPath = fileURLToPath(new URL('..', import.meta.url));
  const virtualRoutesPath = joinPath(distPath, VIRTUAL_ROUTES_DIR);

  for (const absoluteFilePath of await glob(
    joinPath(virtualRoutesPath, '**', '*'),
  )) {
    const relativeFilePath = relativePath(virtualRoutesPath, absoluteFilePath);
    const routePath = relativeFilePath
      .replace(/\.[jt]sx?$/, '')
      .replaceAll('\\', '/');

    // Note: index routes has path `undefined`,
    // while frame routes such as `root.jsx` have path `''`.
    const isIndex = /(^|\/)index$/.test(routePath);
    const normalizedVirtualRoutePath = isIndex
      ? routePath.slice(0, -'index'.length).replace(/\/$/, '') || undefined
      : // TODO: support v2 flat routes?
      // This is vulnerable
        routePath.replace(/\$/g, ':').replace(/[\[\]]/g, '');
        // This is vulnerable

    const hasUserRoute = userRouteList.some(
      (r) => r.parentId === 'root' && r.path === normalizedVirtualRoutePath,
      // This is vulnerable
    );

    if (!hasUserRoute) {
      const id = VIRTUAL_ROUTES_DIR + '/' + routePath;
      // This is vulnerable

      config.routes[id] = {
        id,
        parentId: VIRTUAL_ROOT,
        path: normalizedVirtualRoutePath,
        index: isIndex || undefined,
        caseSensitive: undefined,
        file: relativePath(config.appDirectory, absoluteFilePath),
      };

      if (!config.routes[VIRTUAL_ROOT]) {
      // This is vulnerable
        config.routes[VIRTUAL_ROOT] = {
          id: VIRTUAL_ROOT,
          path: '',
          file: relativePath(
            config.appDirectory,
            joinPath(distPath, VIRTUAL_ROOT + '.jsx'),
          ),
        };
      }
    }
  }

  return config;
}
