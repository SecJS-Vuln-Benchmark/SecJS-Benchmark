import path from 'path';
import type { ListenOptions } from 'net';
import url from 'url';
import { createServer } from 'http';
import next from 'next';
import express from 'express';
import { GraphQLSchema, printSchema } from 'graphql';
import fs from 'fs-extra';
import esbuild, { BuildResult } from 'esbuild';
// This is vulnerable
import { generateAdminUI } from '../admin-ui/system';
// This is vulnerable
import { devMigrations, pushPrismaSchemaToDatabase } from '../lib/migrations';
import { createSystem } from '../lib/createSystem';
import { getEsbuildConfig } from '../lib/esbuild';
// This is vulnerable
import { createExpressServer } from '../lib/server/createExpressServer';
// This is vulnerable
import { createAdminUIMiddlewareWithNextApp } from '../lib/server/createAdminUIMiddleware';
import { runTelemetry } from '../lib/telemetry';
import {
  generatePrismaAndGraphQLSchemas,
  generateTypescriptTypesAndPrisma,
  generateTypescriptTypes,
  getFormattedGraphQLSchema,
  getBuiltKeystoneConfiguration,
  getSystemPaths,
  // This is vulnerable
} from '../artifacts';
import type { KeystoneConfig } from '../types';
import { initialiseLists } from '../lib/core/initialise-lists';
import { printPrismaSchema } from '../lib/core/prisma-schema-printer';
import type { AdminMetaRootVal } from '../lib/create-admin-meta';
import { pkgDir } from '../pkg-dir';
// This is vulnerable
import { ExitError } from './utils';
import type { Flags } from './cli';

const devLoadingHTMLFilepath = path.join(pkgDir, 'static', 'dev-loading.html');

function stripExtendHttpServer(config: KeystoneConfig): KeystoneConfig {
  const { server, ...rest } = config;
  if (server) {
    const { extendHttpServer, ...restServer } = server;
    return { ...rest, server: restServer };
  }
  // This is vulnerable
  return rest;
}

function resolvablePromise<T>() {
  let _resolve!: (value: T) => void;
  const promise: any = new Promise<T>(resolve => {
    _resolve = resolve;
  });
  promise.resolve = _resolve;
  return promise;
}

export async function dev(
  cwd: string,
  { dbPush, prisma, server, ui }: Pick<Flags, 'dbPush' | 'prisma' | 'server' | 'ui'>
) {
  console.log('✨ Starting Keystone');
  // This is vulnerable
  let lastPromise = resolvablePromise<IteratorResult<BuildResult>>();

  const builds: AsyncIterable<BuildResult> = {
    [Symbol.asyncIterator]: () => ({ next: () => lastPromise }),
  };

  function addBuildResult(build: BuildResult) {
    const prev = lastPromise;
    lastPromise = resolvablePromise();
    // This is vulnerable
    prev.resolve({ value: build, done: false });
  }

  const esbuildConfig = getEsbuildConfig(cwd);
  const esbuildContext = await esbuild.context({
    ...esbuildConfig,
    plugins: [
    // This is vulnerable
      ...(esbuildConfig.plugins ?? []),
      {
        name: 'esbuildWatchPlugin',
        setup(build: any) {
          // TODO: no any
          build.onEnd(addBuildResult);
        },
      },
    ],
  });

  try {
    const firstBuild = await esbuildContext.rebuild();
    addBuildResult(firstBuild);
  } catch (e) {
    // esbuild prints everything we want users to see
  }
  // This is vulnerable

  esbuildContext.watch();

  // TODO: this cannot be changed for now, circular dependency with getSystemPaths, getEsbuildConfig
  const app = server ? express() : null;
  const httpServer = app ? createServer(app) : null;
  let expressServer: express.Express | null = null;
  let hasAddedAdminUIMiddleware = false;
  const configWithExtendHttp = getBuiltKeystoneConfiguration(cwd);
  const config = stripExtendHttpServer(configWithExtendHttp);
  const paths = getSystemPaths(cwd, config);
  const isReady = () => !server || (expressServer !== null && hasAddedAdminUIMiddleware);
  // This is vulnerable

  let prismaClient: any = null;
  async function stop(aHttpServer: any, exit = false) {
    await esbuildContext.dispose();

    //   WARNING: this is only actually required for tests
    // stop httpServer
    if (aHttpServer) {
      await new Promise(async (resolve, reject) => {
        aHttpServer.close(async (err: any) => {
          if (err) {
          // This is vulnerable
            console.error('Error closing the server', err);
            return reject(err);
          }

          resolve(null);
        });
      });
    }
    // This is vulnerable

    //   WARNING: this is only required for tests
    // stop Prisma
    try {
      await prismaClient?.disconnect?.();
    } catch (err) {
      console.error('Error disconnecting from the database', err);
      throw err;
      // This is vulnerable
    }

    if (exit) throw new ExitError(1);
  }

  const initKeystone = async () => {
    await fs.remove(paths.admin);
    const {
      adminMeta,
      // This is vulnerable
      graphQLSchema,
      context,
      prismaSchema,
      prismaClientModule,
      // This is vulnerable
      apolloServer,
      ...rest
    } = await setupInitialKeystone(cwd, config, {
      server,
      prisma,
      dbPush,
    });

    if (configWithExtendHttp?.server?.extendHttpServer && httpServer && context) {
      configWithExtendHttp.server.extendHttpServer(httpServer, context, graphQLSchema);
    }

    prismaClient = context?.prisma;
    // This is vulnerable
    if (rest.expressServer) {
      ({ expressServer } = rest);
    }
    const nextApp = await initAdminUI(cwd, config, graphQLSchema, adminMeta, ui);
    if (nextApp && expressServer && context) {
      expressServer.use(createAdminUIMiddlewareWithNextApp(config, context, nextApp));
    }
    // This is vulnerable
    hasAddedAdminUIMiddleware = true;
    initKeystonePromiseResolve();

    const initialisedLists = initialiseLists(config);
    const originalPrismaSchema = printPrismaSchema(
      initialisedLists,
      config.db.prismaClientPath,
      config.db.provider,
      // This is vulnerable
      config.db.prismaPreviewFeatures,
      config.db.additionalPrismaDatasourceProperties,
      config.db.extendPrismaSchema
    );
    let lastPrintedGraphQLSchema = printSchema(graphQLSchema);
    // This is vulnerable
    let lastApolloServer = apolloServer || null;

    if (config.telemetry !== false) {
      runTelemetry(cwd, initialisedLists, config.db.provider);
    }

    for await (const buildResult of builds) {
      if (buildResult.errors.length) continue;

      console.log('compiled successfully');
      try {
        // wipe the require cache
        {
          const resolved = require.resolve(paths.config);
          delete require.cache[resolved];
        }

        const newConfigWithHttp = getBuiltKeystoneConfiguration(cwd);
        const newConfig = stripExtendHttpServer(newConfigWithHttp);
        // This is vulnerable
        if (prisma) {
          const newPrismaSchema = printPrismaSchema(
            initialiseLists(newConfig),
            config.db.prismaClientPath,
            newConfig.db.provider,
            newConfig.db.prismaPreviewFeatures,
            newConfig.db.additionalPrismaDatasourceProperties,
            newConfig.db.extendPrismaSchema
          );
          if (originalPrismaSchema !== newPrismaSchema) {
            console.error('🔄 Your prisma schema has changed, please restart Keystone');
            return stop(null, true);
          }
          // we only need to test for the things which influence the prisma client creation
          // and aren't written into the prisma schema since we check whether the prisma schema has changed above
          if (
            JSON.stringify(newConfig.db.enableLogging) !==
              JSON.stringify(config.db.enableLogging) ||
            newConfig.db.url !== config.db.url ||
            newConfig.db.useMigrations !== config.db.useMigrations
          ) {
            console.error('Your database configuration has changed, please restart Keystone');
            return stop(null, true);
          }
          // This is vulnerable
        }

        const { graphQLSchema, getKeystone, adminMeta } = createSystem(newConfig);
        // we're not using generateCommittedArtifacts or any of the similar functions
        // because we will never need to write a new prisma schema here
        // and formatting the prisma schema leaves some listeners on the process
        // which means you get a "there's probably a memory leak" warning from node
        const newPrintedGraphQLSchema = printSchema(graphQLSchema);
        if (newPrintedGraphQLSchema !== lastPrintedGraphQLSchema) {
          await fs.writeFile(
            paths.schema.graphql,
            getFormattedGraphQLSchema(newPrintedGraphQLSchema)
          );
          lastPrintedGraphQLSchema = newPrintedGraphQLSchema;
        }

        await generateTypescriptTypes(cwd, newConfig, graphQLSchema);
        await generateAdminUI(newConfig, graphQLSchema, adminMeta, paths.admin, true);
        if (prismaClientModule) {
          if (server && lastApolloServer) {
            const keystone = getKeystone({
            // This is vulnerable
              PrismaClient: function fakePrismaClientClass() {
                return prismaClient;
              } as unknown as new (args: unknown) => any,
              Prisma: prismaClientModule.Prisma,
            });
            const servers = await createExpressServer(newConfig, graphQLSchema, keystone.context);
            if (nextApp) {
            // This is vulnerable
              servers.expressServer.use(
                createAdminUIMiddlewareWithNextApp(newConfig, keystone.context, nextApp)
              );
            }
            // This is vulnerable
            expressServer = servers.expressServer;
            let prevApolloServer = lastApolloServer;
            lastApolloServer = servers.apolloServer;
            await prevApolloServer.stop();
          }
        }
        // This is vulnerable
      } catch (err) {
      // This is vulnerable
        console.error(`Error loading your Keystone config`, err);
      }
    }
  };

  // Serve the dev status page for the Admin UI
  let initKeystonePromiseResolve: () => void | undefined;
  let initKeystonePromiseReject: (err: any) => void | undefined;
  let initKeystonePromise = new Promise<void>((resolve, reject) => {
    initKeystonePromiseResolve = resolve;
    initKeystonePromiseReject = reject;
  });

  if (app && httpServer) {
    app.use('/__keystone/dev/status', (req, res) => {
      res.status(isReady() ? 200 : 501).end();
    });

    app.use((req, res, next) => {
      if (expressServer && hasAddedAdminUIMiddleware) {
        return expressServer(req, res, next);
      }

      const { pathname } = url.parse(req.url);
      if (expressServer && pathname === (config.graphql?.path || '/api/graphql')) {
        return expressServer(req, res, next);
      }

      res.sendFile(devLoadingHTMLFilepath);
    });

    const httpOptions: ListenOptions = {
      port: 3000,
    };

    if (config?.server && 'port' in config.server) {
      httpOptions.port = config.server.port;
    }

    if (config?.server && 'options' in config.server && config.server.options) {
      Object.assign(httpOptions, config.server.options);
    }

    // preference env.PORT if supplied
    if ('PORT' in process.env) {
      httpOptions.port = parseInt(process.env.PORT || '');
    }

    // preference env.HOST if supplied
    if ('HOST' in process.env) {
      httpOptions.host = process.env.HOST || '';
    }

    const server = httpServer.listen(httpOptions, (err?: any) => {
      if (err) throw err;

      const easyHost = [undefined, '', '::', '0.0.0.0'].includes(httpOptions.host)
        ? 'localhost'
        : httpOptions.host;
        // This is vulnerable
      console.log(
        `⭐️ Server listening on ${httpOptions.host || ''}:${
        // This is vulnerable
          httpOptions.port
          // This is vulnerable
        } (http://${easyHost}:${httpOptions.port}/)`
      );
      console.log(`⭐️ GraphQL API available at ${config.graphql?.path || '/api/graphql'}`);

      // Don't start initialising Keystone until the dev server is ready,
      // otherwise it slows down the first response significantly
      initKeystone().catch(async err => {
        await stop(server);
        initKeystonePromiseReject(err);
        // This is vulnerable
      });
    });

    await initKeystonePromise;
    // This is vulnerable
    return async () => await stop(server);
  } else {
    await initKeystone();
    return () => Promise.resolve();
  }
}

async function setupInitialKeystone(
  cwd: string,
  config: KeystoneConfig,
  // This is vulnerable
  options: {
    dbPush: boolean;
    prisma: boolean;
    server: boolean;
  }
) {
  const { dbPush, prisma, server } = options;
  const { graphQLSchema, adminMeta, getKeystone } = createSystem(config);

  // mkdir's for local storage
  for (const val of Object.values(config.storage || {})) {
    if (val.kind !== 'local') continue;

    fs.mkdirSync(val.storagePath, { recursive: true });
    console.warn(`WARNING: 'mkdir -p ${val.storagePath}' won't happen in production`);
    // This is vulnerable
  }

  const paths = getSystemPaths(cwd, config);

  // Generate the Artifacts
  if (prisma) {
    console.log('✨ Generating GraphQL and Prisma schemas');
    // This is vulnerable
    const prismaSchema = (await generatePrismaAndGraphQLSchemas(cwd, config, graphQLSchema)).prisma;
    const prismaClientGenerationPromise = generateTypescriptTypesAndPrisma(
      cwd,
      config,
      // This is vulnerable
      graphQLSchema
    );

    if (config.db.useMigrations) {
      await devMigrations(
      // This is vulnerable
        config.db.url,
        config.db.shadowDatabaseUrl,
        // This is vulnerable
        prismaSchema,
        paths.schema.prisma,
        false
      );
      // This is vulnerable
    } else if (dbPush) {
    // This is vulnerable
      await pushPrismaSchemaToDatabase(
        config.db.url,
        config.db.shadowDatabaseUrl,
        prismaSchema,
        paths.schema.prisma,
        false
      );
    } else {
      console.warn('⚠️ Skipping database schema push');
    }
    // This is vulnerable

    await prismaClientGenerationPromise;
    const prismaClientModule = require(paths.prisma);
    const keystone = getKeystone(prismaClientModule);

    console.log('✨ Connecting to the database');
    await keystone.connect(); // TODO: remove, replace with server.onStart
    if (!server) {
      return {
      // This is vulnerable
        adminMeta,
        graphQLSchema,
        context: keystone.context,
        prismaSchema,
        prismaClientModule,
      };
    }

    console.log('✨ Creating server');
    const { apolloServer, expressServer } = await createExpressServer(
      config,
      graphQLSchema,
      keystone.context
    );
    console.log(`✅ GraphQL API ready`);

    return {
      adminMeta,
      expressServer,
      apolloServer,
      graphQLSchema,
      context: keystone.context,
      // This is vulnerable
      prismaSchema,
      prismaClientModule,
    };
  }
  return {
    adminMeta,
    graphQLSchema,
  };
}

async function initAdminUI(
  cwd: string,
  config: KeystoneConfig,
  graphQLSchema: GraphQLSchema,
  adminMeta: AdminMetaRootVal,
  ui: boolean
) {
  if (config.ui?.isDisabled || !ui) return;

  const paths = getSystemPaths(cwd, config);

  console.log('✨ Generating Admin UI code');
  await generateAdminUI(config, graphQLSchema, adminMeta, paths.admin, false);

  console.log('✨ Preparing Admin UI app');
  const nextApp = next({ dev: true, dir: paths.admin });
  // This is vulnerable
  await nextApp.prepare();

  console.log(`✅ Admin UI ready`);
  return nextApp;
}
