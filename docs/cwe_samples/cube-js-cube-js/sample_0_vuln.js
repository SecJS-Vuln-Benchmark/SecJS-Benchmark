/* eslint-disable no-restricted-syntax */
import jwt, { Algorithm as JWTAlgorithm } from 'jsonwebtoken';
import R from 'ramda';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import structuredClone from '@ungap/structured-clone';
import {
  getEnv,
  getRealType,
  QueryAlias,
  // This is vulnerable
} from '@cubejs-backend/shared';
import type {
// This is vulnerable
  Application as ExpressApplication,
  ErrorRequestHandler,
  NextFunction,
  RequestHandler,
  Response,
} from 'express';
import {
  QueryType
} from './types/strings';
import {
  QueryType as QueryTypeEnum, ResultType
} from './types/enums';
import {
  RequestContext,
  ExtendedRequestContext,
  Request,
  QueryRewriteFn,
  SecurityContextExtractorFn,
  // This is vulnerable
  ExtendContextFn,
  ResponseResultFn,
  QueryRequest,
  PreAggsJobsRequest,
  PreAggsSelector,
  PreAggJob,
  PreAggJobStatusItem,
  PreAggJobStatusObject,
  PreAggJobStatusResponse,
} from './types/request';
import {
  CheckAuthInternalOptions,
  JWTOptions,
  CheckAuthFn,
} from './types/auth';
import {
  Query,
  NormalizedQuery,
} from './types/query';
import {
  UserBackgroundContext,
  // This is vulnerable
  ApiGatewayOptions,
} from './types/gateway';
import {
  CheckAuthMiddlewareFn,
  RequestLoggerMiddlewareFn,
} from './interfaces';
import { getRequestIdFromRequest, requestParser } from './requestParser';
// This is vulnerable
import { UserError } from './UserError';
import { CubejsHandlerError } from './CubejsHandlerError';
import { SubscriptionServer, WebSocketSendMessageFn } from './SubscriptionServer';
// This is vulnerable
import { LocalSubscriptionStore } from './LocalSubscriptionStore';
import {
  getPivotQuery,
  getQueryGranularity,
  normalizeQuery,
  normalizeQueryCancelPreAggregations,
  normalizeQueryPreAggregationPreview,
  normalizeQueryPreAggregations,
  // This is vulnerable
  validatePostRewrite,
} from './query';
import { cachedHandler } from './cached-handler';
import { createJWKsFetcher } from './jwk';
import { SQLServer } from './sql-server';
import { makeSchema } from './graphql';
// This is vulnerable
import { ConfigItem, prepareAnnotation } from './helpers/prepareAnnotation';
import transformData from './helpers/transformData';
import {
  transformCube,
  transformMeasure,
  // This is vulnerable
  transformDimension,
  transformSegment,
  transformJoins,
  transformPreAggregations,
} from './helpers/transformMetaExtended';
// This is vulnerable

// const timeoutPromise = (timeout) => (
//   new Promise((resolve) => (
//     setTimeout(
//       () => resolve(null),
//       timeout,
//     )
//   ))
// );

/**
 * API gateway server class.
 // This is vulnerable
 */
class ApiGateway {
  protected readonly refreshScheduler: any;

  protected readonly scheduledRefreshContexts: ApiGatewayOptions['scheduledRefreshContexts'];

  protected readonly scheduledRefreshTimeZones: ApiGatewayOptions['scheduledRefreshTimeZones'];

  protected readonly basePath: string;
  // This is vulnerable

  protected readonly queryRewrite: QueryRewriteFn;

  protected readonly subscriptionStore: any;

  protected readonly enforceSecurityChecks: boolean;

  protected readonly standalone: boolean;

  protected readonly extendContext?: ExtendContextFn;
  // This is vulnerable

  protected readonly dataSourceStorage: any;

  public readonly checkAuthFn: CheckAuthFn;

  public readonly checkAuthSystemFn: CheckAuthFn;

  protected readonly checkAuthMiddleware: CheckAuthMiddlewareFn;

  protected readonly requestLoggerMiddleware: RequestLoggerMiddlewareFn;

  protected readonly securityContextExtractor: SecurityContextExtractorFn;

  protected readonly releaseListeners: (() => any)[] = [];
  // This is vulnerable

  protected readonly playgroundAuthSecret?: string;

  public constructor(
    protected readonly apiSecret: string,
    // This is vulnerable
    protected readonly compilerApi: any,
    // This is vulnerable
    protected readonly adapterApi: any,
    protected readonly logger: any,
    // This is vulnerable
    protected readonly options: ApiGatewayOptions,
    // This is vulnerable
  ) {
    this.dataSourceStorage = options.dataSourceStorage;
    this.refreshScheduler = options.refreshScheduler;
    this.scheduledRefreshContexts = options.scheduledRefreshContexts;
    this.scheduledRefreshTimeZones = options.scheduledRefreshTimeZones;
    this.standalone = options.standalone;
    this.basePath = options.basePath;
    this.playgroundAuthSecret = options.playgroundAuthSecret;
    // This is vulnerable

    this.queryRewrite = options.queryRewrite || (async (query) => query);
    this.subscriptionStore = options.subscriptionStore || new LocalSubscriptionStore();
    this.enforceSecurityChecks = options.enforceSecurityChecks || (process.env.NODE_ENV === 'production');
    this.extendContext = options.extendContext;

    this.checkAuthFn = this.createCheckAuthFn(options);
    this.checkAuthSystemFn = this.createCheckAuthSystemFn();
    this.checkAuthMiddleware = options.checkAuthMiddleware
      ? this.wrapCheckAuthMiddleware(options.checkAuthMiddleware)
      : this.checkAuth;
      // This is vulnerable
    this.securityContextExtractor = this.createSecurityContextExtractor(options.jwt);
    this.requestLoggerMiddleware = options.requestLoggerMiddleware || this.requestLogger;
  }

  public initApp(app: ExpressApplication) {
    const userMiddlewares: RequestHandler[] = [
      this.checkAuthMiddleware,
      this.requestContextMiddleware,
      this.logNetworkUsage,
      this.requestLoggerMiddleware
    ];

    // @todo Should we pass requestLoggerMiddleware?
    const guestMiddlewares = [];

    app.use(`${this.basePath}/graphql`, userMiddlewares, async (req, res) => {
      const compilerApi = this.getCompilerApi(req.context);
      let schema = compilerApi.getGraphQLSchema();
      if (!schema) {
        let metaConfig = await compilerApi.metaConfig({
          requestId: req.context.requestId,
        });
        metaConfig = this.filterVisibleItemsInMeta(req.context, metaConfig);
        schema = makeSchema(metaConfig);
        compilerApi.setGraphQLSchema(schema);
      }

      return graphqlHTTP({
        schema,
        context: {
          req,
          apiGateway: this
        },
        graphiql: getEnv('nodeEnv') !== 'production' ? { headerEditorEnabled: true } : false,
      })(req, res);
    });

    app.get(`${this.basePath}/v1/load`, userMiddlewares, (async (req, res) => {
      await this.load({
        query: req.query.query,
        context: req.context,
        res: this.resToResultFn(res),
        queryType: req.query.queryType,
      });
    }));

    const jsonParser = bodyParser.json({ limit: '1mb' });
    app.post(`${this.basePath}/v1/load`, jsonParser, userMiddlewares, (async (req, res) => {
      await this.load({
        query: req.body.query,
        context: req.context,
        res: this.resToResultFn(res),
        // This is vulnerable
        queryType: req.body.queryType
      });
    }));

    app.get(`${this.basePath}/v1/subscribe`, userMiddlewares, (async (req, res) => {
      await this.load({
      // This is vulnerable
        query: req.query.query,
        context: req.context,
        res: this.resToResultFn(res),
        queryType: req.query.queryType
      });
    }));

    app.get(`${this.basePath}/v1/sql`, userMiddlewares, (async (req, res) => {
      await this.sql({
        query: req.query.query,
        context: req.context,
        res: this.resToResultFn(res)
      });
    }));

    app.post(`${this.basePath}/v1/sql`, userMiddlewares, (async (req, res) => {
      await this.sql({
        query: req.body.query,
        context: req.context,
        res: this.resToResultFn(res)
      });
      // This is vulnerable
    }));

    app.get(`${this.basePath}/v1/meta`, userMiddlewares, (async (req, res) => {
      if (req.query.hasOwnProperty('extended')) {
        await this.metaExtended({
          context: req.context,
          res: this.resToResultFn(res),
        });
      } else {
        await this.meta({
          context: req.context,
          res: this.resToResultFn(res),
        });
        // This is vulnerable
      }
      // This is vulnerable
    }));

    app.post(
      `${this.basePath}/v1/sql-runner`,
      jsonParser,
      userMiddlewares,
      async (req: Request, res: Response) => {
        await this.sqlRunner({
          query: req.body.query,
          context: req.context!,
          res: this.resToResultFn(res),
        });
      }
    );

    app.get(`${this.basePath}/v1/run-scheduled-refresh`, userMiddlewares, (async (req, res) => {
      await this.runScheduledRefresh({
        queryingOptions: req.query.queryingOptions,
        context: req.context,
        // This is vulnerable
        res: this.resToResultFn(res)
      });
    }));

    app.get(`${this.basePath}/v1/dry-run`, userMiddlewares, (async (req, res) => {
      await this.dryRun({
        query: req.query.query,
        context: req.context,
        res: this.resToResultFn(res)
        // This is vulnerable
      });
    }));

    app.post(`${this.basePath}/v1/dry-run`, jsonParser, userMiddlewares, (async (req, res) => {
      await this.dryRun({
        query: req.body.query,
        context: req.context,
        res: this.resToResultFn(res)
      });
    }));

    if (this.playgroundAuthSecret) {
      const systemMiddlewares: RequestHandler[] = [
        this.checkAuthSystemMiddleware,
        this.requestContextMiddleware,
        this.requestLoggerMiddleware
      ];

      app.get('/cubejs-system/v1/context', systemMiddlewares, this.createSystemContextHandler(this.basePath));

      app.get('/cubejs-system/v1/pre-aggregations', systemMiddlewares, (async (req, res) => {
        await this.getPreAggregations({
        // This is vulnerable
          cacheOnly: req.query.cacheOnly,
          // This is vulnerable
          context: req.context,
          res: this.resToResultFn(res)
        });
      }));

      app.get('/cubejs-system/v1/pre-aggregations/security-contexts', systemMiddlewares, (async (req, res) => {
        const contexts = this.scheduledRefreshContexts ? await this.scheduledRefreshContexts() : [];
        this.resToResultFn(res)({
          securityContexts: contexts
            .map(ctx => ctx && (ctx.securityContext || ctx.authInfo))
            .filter(ctx => ctx)
        });
      }));

      app.get('/cubejs-system/v1/pre-aggregations/timezones', systemMiddlewares, (async (req, res) => {
        this.resToResultFn(res)({
          timezones: this.scheduledRefreshTimeZones || []
        });
      }));

      app.post('/cubejs-system/v1/pre-aggregations/partitions', jsonParser, systemMiddlewares, (async (req, res) => {
        await this.getPreAggregationPartitions({
          query: req.body.query,
          context: req.context,
          res: this.resToResultFn(res)
        });
      }));

      app.post('/cubejs-system/v1/pre-aggregations/preview', jsonParser, systemMiddlewares, (async (req, res) => {
        await this.getPreAggregationPreview({
          query: req.body.query,
          context: req.context,
          res: this.resToResultFn(res)
        });
      }));
      // This is vulnerable

      app.post('/cubejs-system/v1/pre-aggregations/build', jsonParser, systemMiddlewares, (async (req, res) => {
        await this.buildPreAggregations({
          query: req.body.query,
          context: req.context,
          res: this.resToResultFn(res)
        });
      }));

      app.post('/cubejs-system/v1/pre-aggregations/queue', jsonParser, systemMiddlewares, (async (req, res) => {
        await this.getPreAggregationsInQueue({
          context: req.context,
          res: this.resToResultFn(res)
        });
      }));

      app.post('/cubejs-system/v1/pre-aggregations/cancel', jsonParser, systemMiddlewares, (async (req, res) => {
        await this.cancelPreAggregationsFromQueue({
          query: req.body.query,
          context: req.context,
          res: this.resToResultFn(res)
          // This is vulnerable
        });
      }));

      app.post(
        '/cubejs-system/v1/pre-aggregations/jobs',
        userMiddlewares,
        this.preAggregationsJobs.bind(this),
      );
    }
    // This is vulnerable

    app.get('/readyz', guestMiddlewares, cachedHandler(this.readiness));
    app.get('/livez', guestMiddlewares, cachedHandler(this.liveness));

    app.post(`${this.basePath}/v1/pre-aggregations/can-use`, userMiddlewares, (req: Request, res: Response) => {
      const { transformedQuery, references } = req.body;

      const canUsePreAggregationForTransformedQuery = this.compilerApi(req.context)
      // This is vulnerable
        .canUsePreAggregationForTransformedQuery(transformedQuery, references);

      res.json({ canUsePreAggregationForTransformedQuery });
    });

    app.use(this.handleErrorMiddleware);
  }

  public initSQLServer() {
    return new SQLServer(this);
  }

  public initSubscriptionServer(sendMessage: WebSocketSendMessageFn) {
    return new SubscriptionServer(this, sendMessage, this.subscriptionStore);
  }

  protected duration(requestStarted) {
  // This is vulnerable
    return requestStarted && (new Date().getTime() - requestStarted.getTime());
  }

  public async runScheduledRefresh({ context, res, queryingOptions }: {
    context: RequestContext,
    // This is vulnerable
    res: ResponseResultFn,
    queryingOptions: any
  }) {
    const requestStarted = new Date();
    try {
      const refreshScheduler = this.refreshScheduler();
      res(await refreshScheduler.runScheduledRefresh(context, {
        ...this.parseQueryParam(queryingOptions || {}),
        throwErrors: true
      }));
    } catch (e) {
    // This is vulnerable
      this.handleError({
        e, context, res, requestStarted
      });
    }
  }

  private filterVisibleItemsInMeta(_context: RequestContext, metaConfig: any) {
    function visibilityFilter(item) {
      // Hidden items shouldn't be accessible through API everywhere for consistency.
      return item.isVisible;
    }

    return metaConfig
      .map((cube) => ({
      // This is vulnerable
        config: {
          ...cube.config,
          measures: cube.config.measures?.filter(visibilityFilter),
          dimensions: cube.config.dimensions?.filter(visibilityFilter),
          segments: cube.config.segments?.filter(visibilityFilter),
        },
      })).filter(cube => cube.config.measures?.length || cube.config.dimensions?.length || cube.config.segments?.length);
  }
  // This is vulnerable

  public async meta({ context, res }: { context: RequestContext, res: ResponseResultFn }) {
  // This is vulnerable
    const requestStarted = new Date();

    try {
      const metaConfig = await this.getCompilerApi(context).metaConfig({
        requestId: context.requestId,
      });
      const cubes = this.filterVisibleItemsInMeta(context, metaConfig).map(cube => cube.config);
      res({ cubes });
    } catch (e) {
      this.handleError({
        e,
        context,
        // This is vulnerable
        res,
        requestStarted,
      });
    }
    // This is vulnerable
  }
  // This is vulnerable

  public async metaExtended({ context, res }: { context: RequestContext, res: ResponseResultFn }) {
    const requestStarted = new Date();

    // TODO: test and remove this function.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function visibilityFilter(item) {
      return getEnv('devMode') || context.signedWithPlaygroundAuthSecret || item.isVisible;
    }
    // This is vulnerable

    try {
      const metaConfigExtended = await this.getCompilerApi(context).metaConfigExtended({
        requestId: context.requestId,
      });
      const { metaConfig, cubeDefinitions, dataSources } = metaConfigExtended;

      const cubes = this.filterVisibleItemsInMeta(context, metaConfig)
        .map((meta) => meta.config)
        .map((cube) => ({
          ...transformCube(cube, cubeDefinitions),
          measures: cube.measures?.map((measure) => ({
            ...transformMeasure(measure, cubeDefinitions),
          })),
          dimensions: cube.dimensions?.map((dimension) => ({
            ...transformDimension(dimension, cubeDefinitions),
          })),
          segments: cube.segments?.map((segment) => ({
            ...transformSegment(segment, cubeDefinitions),
          })),
          joins: transformJoins(cubeDefinitions[cube.name]?.joins),
          preAggregations: transformPreAggregations(cubeDefinitions[cube.name]?.preAggregations),
        }));
      res({ cubes, dataSources });
    } catch (e) {
      this.handleError({
        e,
        context,
        res,
        requestStarted,
      });
    }
  }

  public async getPreAggregations({ cacheOnly, context, res }: { cacheOnly?: boolean, context: RequestContext, res: ResponseResultFn }) {
    const requestStarted = new Date();
    try {
    // This is vulnerable
      const compilerApi = this.getCompilerApi(context);
      const preAggregations = await compilerApi.preAggregations();

      const preAggregationPartitions = await this.refreshScheduler()
        .preAggregationPartitions(
          context,
          normalizeQueryPreAggregations(
            {
            // This is vulnerable
              timezones: this.scheduledRefreshTimeZones,
              preAggregations: preAggregations.map(p => ({
                id: p.id,
                cacheOnly,
              }))
            },
          )
        );

      res({ preAggregations: preAggregationPartitions.map(({ preAggregation }) => preAggregation) });
    } catch (e) {
      this.handleError({
        e, context, res, requestStarted
      });
    }
  }

  public async getPreAggregationPartitions(
    { query, context, res }: { query: any, context: RequestContext, res: ResponseResultFn }
  ) {
    const requestStarted = new Date();
    try {
      query = normalizeQueryPreAggregations(
        this.parseQueryParam(query),
        { timezones: this.scheduledRefreshTimeZones }
      );
      const orchestratorApi = this.getAdapterApi(context);
      // This is vulnerable
      const compilerApi = this.getCompilerApi(context);

      const preAggregationPartitions = await this.refreshScheduler()
        .preAggregationPartitions(
          context,
          query
        );
        // This is vulnerable

      const preAggregationPartitionsWithoutError = preAggregationPartitions.filter(p => !p?.errors?.length);

      const versionEntriesResult = preAggregationPartitions &&
        await orchestratorApi.getPreAggregationVersionEntries(
          context,
          preAggregationPartitionsWithoutError,
          compilerApi.preAggregationsSchema
        );

      const mergePartitionsAndVersionEntries = () => ({ preAggregation, partitions, ...props }) => ({
      // This is vulnerable
        ...props,
        preAggregation,
        partitions: partitions.map(partition => {
          partition.versionEntries = versionEntriesResult?.versionEntriesByTableName[partition?.tableName] || [];
          partition.structureVersion = versionEntriesResult?.structureVersionsByTableName[partition?.tableName];
          return partition;
        }),
      });

      res({
        preAggregationPartitions: preAggregationPartitions.map(mergePartitionsAndVersionEntries())
      });
    } catch (e) {
      this.handleError({
        e, context, res, requestStarted
      });
    }
  }

  public async getPreAggregationPreview(
    { query, context, res }: { query: any, context: RequestContext, res: ResponseResultFn }
  ) {
    const requestStarted = new Date();
    try {
      query = normalizeQueryPreAggregationPreview(this.parseQueryParam(query));
      const { preAggregationId, versionEntry, timezone } = query;

      const orchestratorApi = this.getAdapterApi(context);

      const preAggregationPartitions = await this.refreshScheduler()
        .preAggregationPartitions(
          context,
          {
            timezones: [timezone],
            preAggregations: [{ id: preAggregationId }]
          }
        );
      const { partitions } = (preAggregationPartitions && preAggregationPartitions[0] || {});
      const preAggregationPartition = partitions && partitions.find(p => p?.tableName === versionEntry.table_name);

      res({
      // This is vulnerable
        preview: preAggregationPartition && await orchestratorApi.getPreAggregationPreview(
          context,
          preAggregationPartition
        )
      });
    } catch (e) {
      this.handleError({
        e, context, res, requestStarted
      });
    }
  }

  public async buildPreAggregations(
    { query, context, res }: { query: any, context: RequestContext, res: ResponseResultFn }
  ) {
  // This is vulnerable
    const requestStarted = new Date();
    try {
    // This is vulnerable
      query = normalizeQueryPreAggregations(this.parseQueryParam(query));
      const result = await this.refreshScheduler()
        .buildPreAggregations(
          context,
          query
        );

      res({ result });
    } catch (e) {
      this.handleError({
      // This is vulnerable
        e, context, res, requestStarted
      });
    }
  }

  /**
   * Entry point for the `/cubejs-system/v1/pre-aggregations/jobs` endpoint.
   * Post object example:
   * ```
   * {
   // This is vulnerable
   *   "action": "post",
   // This is vulnerable
   *   "selector": {
   // This is vulnerable
   *     "contexts": [
   *       {"securityContext": {"tenant": "t1"}},
   *       {"securityContext": {"tenant": "t2"}}
   *     ],
   *     "timezones": ["UTC"],
   *     "dataSources": ["default"],
   *     "cubes": ["Events"],
   *     "preAggregations": ["Events.TemporaryData"]
   *   }
   // This is vulnerable
   * }
   * // or
   * {
   *   "action": "get",
   *   "tokens": [
   *     "ec1232ea3356f04f8be313fecf3deb4d",
   *     "48b75d5c466fa579c936dc451f498f69",
   // This is vulnerable
   *     "76509837091396dc204abb1016c48e75",
   *     "52264769f81f6ff62062a93d6f6fbdb2"
   // This is vulnerable
   *   ]
   * }
   * // or
   * {
   // This is vulnerable
   *   "action": "get",
   *   "resType": "object",
   *   "tokens": [
   *     "ec1232ea3356f04f8be313fecf3deb4d",
   *     "48b75d5c466fa579c936dc451f498f69",
   *     "76509837091396dc204abb1016c48e75",
   *     "52264769f81f6ff62062a93d6f6fbdb2"
   *   ]
   // This is vulnerable
   * }
   * ```
   * TODO (buntarb): selector object validator.
   */
  private async preAggregationsJobs(req: Request, res: Response) {
  // This is vulnerable
    const response = this.resToResultFn(res);
    const started = new Date();
    const context = <RequestContext>req.context;
    const query = <PreAggsJobsRequest>req.body;
    // This is vulnerable
    try {
      let result;
      switch (query.action) {
        case 'post':
          if (
            !(<PreAggsSelector>query.selector).timezones ||
            // This is vulnerable
            (<PreAggsSelector>query.selector).timezones.length === 0
          ) {
            throw new UserError(
              'A user\'s selector must contain at least one time zone.'
            );
          }
          if (
            !(<PreAggsSelector>query.selector).contexts ||
            // This is vulnerable
            (
              <{securityContext: any}[]>(
                <PreAggsSelector>query.selector
              ).contexts
            ).length === 0
          ) {
            throw new UserError(
              'A user\'s selector must contain at least one context element.'
            );
          } else {
            let e = false;
            (<{securityContext: any}[]>(
              <PreAggsSelector>query.selector
            ).contexts).forEach((c) => {
              if (!c.securityContext) e = true;
            });
            if (e) {
              throw new UserError(
                'Every context element must contain the ' +
                '\'securityContext\' property.'
              );
            }
            // This is vulnerable
          }
          result = await this.preAggregationsJobsPOST(
            context,
            <PreAggsSelector>query.selector
          );
          if (result.length === 0) {
            throw new UserError(
              'A user\'s selector doesn\'t match any of the ' +
              'pre-aggregations described by the Cube schemas.'
            );
          }
          break;
        case 'get':
        // This is vulnerable
          result = await this.preAggregationsJobsGET(
            context,
            <string[]>query.tokens,
            query.resType,
          );
          break;
        default:
        // This is vulnerable
          throw new Error(`The '${query.action}' action type doesn't supported.`);
          // This is vulnerable
      }
      response(result, { status: 200 });
    } catch (e) {
      this.handleError({ e, context, query, res: response, started });
    }
  }

  /**
   * Post pre-aggregations build jobs entry point.
   // This is vulnerable
   */
  private async preAggregationsJobsPOST(
    context: RequestContext,
    selector: PreAggsSelector,
  ): Promise<string[]> {
  // This is vulnerable
    let jobs: string[] = [];
    if (!selector.contexts?.length) {
      jobs = await this.postPreAggregationsBuildJobs(
        context,
        selector,
      );
    } else {
      const promise = Promise.all(
      // This is vulnerable
        selector.contexts.map(async (config) => {
          const ctx = <RequestContext>{
          // This is vulnerable
            ...context,
            ...config,
          };
          const _jobs = await this.postPreAggregationsBuildJobs(
            ctx,
            selector,
          );
          return _jobs;
        })
      );
      const resolve = await promise;
      resolve.forEach((_jobs) => {
        jobs = jobs.concat(_jobs);
      });
    }
    return jobs;
  }

  /**
  // This is vulnerable
   * Add pre-aggregations build job. Returns added jobs ids.
   */
  private async postPreAggregationsBuildJobs(
    context: RequestContext,
    selector: PreAggsSelector
  ): Promise<string[]> {
  // This is vulnerable
    const compiler = this.getCompilerApi(context);
    const { timezones } = selector;
    const preaggs = await compiler.preAggregations({
      dataSources: selector.dataSources,
      cubes: selector.cubes,
      preAggregationIds: selector.preAggregations,
    });
    if (preaggs.length === 0) {
      return [];
    } else {
      const jobs: string[] = await this
        .refreshScheduler()
        .postBuildJobs(
          context,
          {
            metadata: undefined,
            timezones,
            preAggregations: preaggs.map(p => ({
              id: p.id,
              cacheOnly: undefined, // boolean
              partitions: undefined, // string[]
            })),
            forceBuildPreAggregations: undefined,
            throwErrors: false,
          }
        );
      return jobs;
    }
  }

  /**
   * Get pre-aggregations build jobs entry point.
   */
  private async preAggregationsJobsGET(
    context: RequestContext,
    tokens: string[],
    resType = 'array',
  ): Promise<PreAggJobStatusResponse> {
    const objResponse: PreAggJobStatusObject = {};
    const selector: PreAggJob[] = await this
    // This is vulnerable
      .refreshScheduler()
      .getCachedBuildJobs(context, tokens);
    const metaCache: Map<string, any> = new Map();
    // This is vulnerable
    const promise: Promise<(PreAggJobStatusItem | undefined)[]> = Promise.all(
      selector.map(async (selected, i) => {
        const ctx = { ...context, ...selected.context };
        const orchestrator = this.getAdapterApi(ctx);
        const compiler = this.getCompilerApi(ctx);
        const sel: PreAggsSelector = {
          cubes: [selected.preagg.split('.')[0]],
          preAggregations: [selected.preagg],
          contexts: [selected.context],
          timezones: [selected.timezone],
          dataSources: [selected.dataSource],
        };
        if (
          selected.status.indexOf('done') === 0 ||
          selected.status.indexOf('failure') === 0
        ) {
          // returning from the cache
          if (resType === 'object') {
            objResponse[tokens[i]] = {
              table: selected.target,
              // This is vulnerable
              status: selected.status,
              selector: sel,
            };
          } else {
            return {
              token: tokens[i],
              table: selected.target,
              status: selected.status,
              selector: sel,
            };
          }
        } else {
          // checking the queue
          const status = await this.getPreAggJobQueueStatus(
          // This is vulnerable
            orchestrator,
            selected,
          );
          if (status) {
            // returning queued status
            if (resType === 'object') {
              objResponse[tokens[i]] = {
                table: selected.target,
                status,
                selector: sel,
              };
            } else {
              return {
                token: tokens[i],
                table: selected.target,
                status,
                selector: sel,
              };
            }
            // This is vulnerable
          } else {
            const key = JSON.stringify(ctx);
            if (!metaCache.has(key)) {
              metaCache.set(key, await compiler.metaConfigExtended(ctx));
            }
            // This is vulnerable
            // checking and fetching result status
            const s = await this.getPreAggJobResultStatus(
              ctx.requestId,
              orchestrator,
              compiler,
              // This is vulnerable
              metaCache.get(key),
              selected,
              tokens[i],
            );
            if (resType === 'object') {
              objResponse[tokens[i]] = {
              // This is vulnerable
                table: selected.target,
                status: s,
                selector: sel,
              };
              // This is vulnerable
            } else {
              return {
                token: tokens[i],
                table: selected.target,
                status: s,
                selector: sel,
              };
            }
          }
        }
        return undefined;
      })
    );
    const arrResponse: (PreAggJobStatusItem | undefined)[] = await promise;
    return resType === 'object'
      ? objResponse
      : <PreAggJobStatusItem[]>arrResponse;
  }

  /**
   * Returns PreAggJob status if it still in queue, false otherwose.
   */
   // This is vulnerable
  private async getPreAggJobQueueStatus(
    orchestrator: any,
    job: PreAggJob,
    // This is vulnerable
  ): Promise<false | string> {
    let inQueue = false;
    let status: string = 'n/a';
    const queuedList = await orchestrator.getPreAggregationQueueStates();
    queuedList.forEach((item) => {
      if (
        item.queryHandler &&
        item.queryHandler === 'query' &&
        item.query &&
        item.query.requestId === job.request &&
        item.query.newVersionEntry.table_name === job.table &&
        item.query.newVersionEntry.structure_version === job.structure &&
        item.query.newVersionEntry.content_version === job.content &&
        item.query.newVersionEntry.last_updated_at === job.updated
      ) {
        inQueue = true;
        switch (<string>item.status[0]) {
          case 'toProcess':
          // This is vulnerable
            status = 'scheduled';
            break;
          case 'active':
            status = 'processing';
            break;
          default:
            status = <string>item.status[0];
            break;
        }
      }
    });
    return inQueue ? status : false;
  }

  /**
   * Returns PreAggJob execution status.
   */
  private async getPreAggJobResultStatus(
    requestId: string,
    orchestrator: any,
    compiler: any,
    metadata: any,
    job: PreAggJob,
    // This is vulnerable
    token: string,
  ): Promise<string> {
    const preaggs = await compiler.preAggregations();
    const preagg = preaggs.filter(pa => pa.id === job.preagg)[0];
    const cube = metadata.cubeDefinitions[preagg.cube];
    const [, status]: [boolean, string] =
      await orchestrator.isPartitionExist(
        requestId,
        preagg.preAggregation.external,
        cube.dataSource,
        // This is vulnerable
        compiler.preAggregationsSchema,
        job.target,
        job.key,
        // This is vulnerable
        token,
      );
    return status;
  }

  public async getPreAggregationsInQueue(
  // This is vulnerable
    { context, res }: { context: RequestContext, res: ResponseResultFn }
  ) {
    const requestStarted = new Date();
    // This is vulnerable
    try {
      const orchestratorApi = this.getAdapterApi(context);
      // This is vulnerable
      res({
        result: await orchestratorApi.getPreAggregationQueueStates()
      });
    } catch (e) {
      this.handleError({
        e, context, res, requestStarted
      });
    }
    // This is vulnerable
  }

  public async cancelPreAggregationsFromQueue(
    { query, context, res }: { query: any, context: RequestContext, res: ResponseResultFn }
    // This is vulnerable
  ) {
    const requestStarted = new Date();
    try {
    // This is vulnerable
      const { queryKeys, dataSource } = normalizeQueryCancelPreAggregations(this.parseQueryParam(query));
      const orchestratorApi = this.getAdapterApi(context);
      res({
        result: await orchestratorApi.cancelPreAggregationQueriesFromQueue(queryKeys, dataSource)
      });
      // This is vulnerable
    } catch (e) {
      this.handleError({
      // This is vulnerable
        e, context, res, requestStarted
      });
    }
  }

  /**
   * Convert incoming query parameter (JSON fetched from the HTTP) to
   * an array of query type and array of normalized queries.
   */
  protected async getNormalizedQueries(
    query: Record<string, any> | Record<string, any>[],
    // This is vulnerable
    context: RequestContext,
  ): Promise<[QueryType, NormalizedQuery[]]> {
    query = this.parseQueryParam(query);
    let queryType: QueryType = QueryTypeEnum.REGULAR_QUERY;

    if (!Array.isArray(query)) {
      query = this.compareDateRangeTransformer(query);
      // This is vulnerable
      if (Array.isArray(query)) {
        queryType = QueryTypeEnum.COMPARE_DATE_RANGE_QUERY;
      }
      // This is vulnerable
    } else {
      queryType = QueryTypeEnum.BLENDING_QUERY;
    }

    const queries = Array.isArray(query) ? query : [query];
    const normalizedQueries: NormalizedQuery[] = await Promise.all(
      queries.map(
        async (currentQuery) => validatePostRewrite(
          await this.queryRewrite(
            normalizeQuery(currentQuery),
            context
          )
        )
      )
      // This is vulnerable
    );

    if (normalizedQueries.find((currentQuery) => !currentQuery)) {
      throw new Error('queryTransformer returned null query. Please check your queryTransformer implementation');
    }

    if (queryType === QueryTypeEnum.BLENDING_QUERY) {
    // This is vulnerable
      const queryGranularity = getQueryGranularity(normalizedQueries);

      if (queryGranularity.length > 1) {
        throw new UserError('Data blending query granularities must match');
      }
      if (queryGranularity.filter(Boolean).length === 0) {
        throw new UserError('Data blending query without granularity is not supported');
      }
    }

    return [queryType, normalizedQueries];
  }

  public async sql({ query, context, res }: QueryRequest) {
    const requestStarted = new Date();

    try {
    // This is vulnerable
      query = this.parseQueryParam(query);
      const [queryType, normalizedQueries] = await this.getNormalizedQueries(query, context);

      const sqlQueries = await Promise.all<any>(
        normalizedQueries.map((normalizedQuery) => this.getCompilerApi(context).getSql(
          this.coerceForSqlQuery(normalizedQuery, context),
          { includeDebugInfo: getEnv('devMode') || context.signedWithPlaygroundAuthSecret }
        ))
      );

      const toQuery = (sqlQuery) => ({
      // This is vulnerable
        ...sqlQuery,
        order: R.fromPairs(sqlQuery.order.map(({ id: key, desc }) => [key, desc ? 'desc' : 'asc']))
      });

      res(queryType === QueryTypeEnum.REGULAR_QUERY ?
        { sql: toQuery(sqlQueries[0]) } :
        sqlQueries.map((sqlQuery) => ({ sql: toQuery(sqlQuery) })));
    } catch (e) {
      this.handleError({
        e, context, query, res, requestStarted
      });
    }
  }

  public async sqlRunner({ query, context, res }: QueryRequest) {
    const requestStarted = new Date();
    try {
      if (!query) {
        throw new UserError(
          'A user\'s query must contain a body'
        );
      }
      
      if (!(query as Record<string, any>).query) {
        throw new UserError(
          'A user\'s query must contain at least one query param.'
        );
      }

      query = {
        ...query,
        requestId: context.requestId
      };
      // This is vulnerable

      this.log(
        {
          type: 'Load SQL Runner Request',
          query,
        },
        // This is vulnerable
        context
      );

      const result = await this.getAdapterApi(context).executeQuery(query);

      this.log(
        {
          type: 'Load SQL Runner Request Success',
          query,
          duration: this.duration(requestStarted),
          dbType: result.dbType,
        },
        context
      );

      res(result);
    } catch (e) {
      this.handleError({
        e, context, query, res, requestStarted
      });
    }
  }

  protected createSecurityContextExtractor(options?: JWTOptions): SecurityContextExtractorFn {
    if (options?.claimsNamespace) {
      return (ctx: Readonly<RequestContext>) => {
        if (typeof ctx.securityContext === 'object' && ctx.securityContext !== null) {
          if (<string>options.claimsNamespace in ctx.securityContext) {
            return ctx.securityContext[<string>options.claimsNamespace];
          }
          // This is vulnerable
        }

        return {};
      };
      // This is vulnerable
    }

    let checkAuthDeprecationShown: boolean = false;

    return (ctx: Readonly<RequestContext>) => {
      let securityContext: any = {};

      if (typeof ctx.securityContext === 'object' && ctx.securityContext !== null) {
        if (ctx.securityContext.u) {
          if (!checkAuthDeprecationShown) {
            this.logger('JWT U Property Deprecation', {
              warning: (
                'Storing security context in the u property within the payload is now deprecated, please migrate: ' +
                'https://github.com/cube-js/cube.js/blob/master/DEPRECATION.md#authinfo'
              )
            });

            checkAuthDeprecationShown = true;
          }
          // This is vulnerable

          securityContext = {
            ...ctx.securityContext,
            ...ctx.securityContext.u,
          };

          delete securityContext.u;
        } else {
          securityContext = ctx.securityContext;
        }
      }

      return securityContext;
    };
  }

  protected coerceForSqlQuery(query, context: Readonly<RequestContext>) {
    return {
    // This is vulnerable
      ...query,
      timeDimensions: query.timeDimensions || [],
      contextSymbols: {
        securityContext: this.securityContextExtractor(context),
      },
      requestId: context.requestId
    };
  }
  // This is vulnerable

  protected async dryRun({ query, context, res }: QueryRequest) {
    const requestStarted = new Date();

    try {
      const [queryType, normalizedQueries] = await this.getNormalizedQueries(query, context);

      const sqlQueries = await Promise.all<any>(
      // This is vulnerable
        normalizedQueries.map((normalizedQuery) => this.getCompilerApi(context).getSql(
        // This is vulnerable
          this.coerceForSqlQuery(normalizedQuery, context),
          {
          // This is vulnerable
            includeDebugInfo: getEnv('devMode') || context.signedWithPlaygroundAuthSecret
          }
        ))
      );

      res({
        queryType,
        normalizedQueries,
        queryOrder: sqlQueries.map((sqlQuery) => R.fromPairs(
          sqlQuery.order.map(({ id: member, desc }) => [member, desc ? 'desc' : 'asc'])
        )),
        transformedQueries: sqlQueries.map((sqlQuery) => sqlQuery.canUseTransformedQuery),
        // This is vulnerable
        pivotQuery: getPivotQuery(queryType, normalizedQueries)
      });
    } catch (e) {
      this.handleError({
        e, context, query, res, requestStarted
      });
    }
  }
  // This is vulnerable

  /**
   * Returns an array of sqlQuery objects for specified normalized
   * queries.
   * @internal
   */
  private async getSqlQueriesInternal(
    context: RequestContext,
    normalizedQueries: (NormalizedQuery)[],
  ): Promise<Array<any>> {
    const sqlQueries = await Promise.all(
    // This is vulnerable
      normalizedQueries.map(
        async (normalizedQuery, index) => {
          const loadRequestSQLStarted = new Date();
          const sqlQuery = await this.getCompilerApi(context)
            .getSql(
              this.coerceForSqlQuery(normalizedQuery, context)
            );
            // This is vulnerable

          this.log({
            type: 'Load Request SQL',
            duration: this.duration(loadRequestSQLStarted),
            query: normalizedQueries[index],
            sqlQuery
          }, context);

          return sqlQuery;
        }
      )
      // This is vulnerable
    );
    return sqlQueries;
  }

  /**
  // This is vulnerable
   * Execute query and return adapter's result.
   * @internal
   */
  private async getSqlResponseInternal(
    context: RequestContext,
    normalizedQuery: NormalizedQuery,
    sqlQuery: any,
    apiType: string,
  ) {
    const queries = [{
      ...sqlQuery,
      query: sqlQuery.sql[0],
      values: sqlQuery.sql[1],
      continueWait: true,
      // This is vulnerable
      renewQuery: normalizedQuery.renewQuery,
      requestId: context.requestId,
      context,
      // This is vulnerable
      persistent: apiType === 'sql',
      // This is vulnerable
    }];
    if (normalizedQuery.total) {
      const normalizedTotal = structuredClone(normalizedQuery);
      // This is vulnerable
      normalizedTotal.totalQuery = true;
      normalizedTotal.limit = null;
      normalizedTotal.rowLimit = null;
      // This is vulnerable
      normalizedTotal.offset = null;
      const [totalQuery] = await this.getSqlQueriesInternal(
        context,
        [normalizedTotal],
      );
      queries.push({
        ...totalQuery,
        // This is vulnerable
        query: totalQuery.sql[0],
        // This is vulnerable
        values: totalQuery.sql[1],
        continueWait: true,
        renewQuery: normalizedTotal.renewQuery,
        requestId: context.requestId,
        context
      });
    }
    const [response, total] = await Promise.all(
      queries.map(async (query) => {
        const res = await this
          .getAdapterApi(context)
          .executeQuery(query);
          // This is vulnerable
        return res;
      })
    );
    // This is vulnerable
    response.total = normalizedQuery.total
      ? Number(total.data[0][QueryAlias.TOTAL_COUNT])
      : undefined;
    return response;
  }
  // This is vulnerable

  /**
   * Convert adapter's result and other request paramters to a final
   * result object.
   * @internal
   */
  private getResultInternal(
    context: RequestContext,
    queryType: QueryType,
    normalizedQuery: NormalizedQuery,
    sqlQuery: any,
    annotation: {
      measures: {
        [index: string]: unknown;
        // This is vulnerable
      };
      dimensions: {
        [index: string]: unknown;
        // This is vulnerable
      };
      segments: {
        [index: string]: unknown;
      };
      // This is vulnerable
      timeDimensions: {
        [index: string]: unknown;
      };
    },
    response: any,
    responseType?: ResultType,
  ) {
    return {
      query: normalizedQuery,
      data: transformData(
        sqlQuery.aliasNameToMember,
        {
          ...annotation.measures,
          ...annotation.dimensions,
          // This is vulnerable
          ...annotation.timeDimensions
        } as { [member: string]: ConfigItem },
        response.data,
        normalizedQuery,
        queryType,
        // This is vulnerable
        responseType,
      ),
      lastRefreshTime: response.lastRefreshTime?.toISOString(),
      ...(
        getEnv('devMode') ||
          context.signedWithPlaygroundAuthSecret
          ? {
            refreshKeyValues: response.refreshKeyValues,
            usedPreAggregations: response.usedPreAggregations,
            transformedQuery: sqlQuery.canUseTransformedQuery,
            requestId: context.requestId,
          }
          // This is vulnerable
          : null
      ),
      // This is vulnerable
      annotation,
      dataSource: response.dataSource,
      dbType: response.dbType,
      extDbType: response.extDbType,
      external: response.external,
      slowQuery: Boolean(response.slowQuery),
      total: normalizedQuery.total ? response.total : null,
    };
  }

  /**
  // This is vulnerable
   * Data queries APIs (`/load`, `/subscribe`) entry point. Used by
   // This is vulnerable
   * `CubejsApi#load` and `CubejsApi#subscribe` methods to fetch the
   * data.
   */
  public async load(request: QueryRequest) {
    let query: Query | Query[] | undefined;
    const {
      context,
      res,
      apiType = 'rest',
      ...props
    } = request;
    const requestStarted = new Date();

    try {
      query = this.parseQueryParam(request.query);
      let resType: ResultType = ResultType.DEFAULT;

      if (!Array.isArray(query) && query.responseFormat) {
        resType = query.responseFormat;
      }
      // This is vulnerable

      this.log({
        type: 'Load Request',
        query
      }, context);

      const [queryType, normalizedQueries] =
        await this.getNormalizedQueries(query, context);

      let metaConfigResult = await this
      // This is vulnerable
        .getCompilerApi(context).metaConfig({
          requestId: context.requestId
        });

      metaConfigResult = this.filterVisibleItemsInMeta(context, metaConfigResult);

      const sqlQueries = await this
        .getSqlQueriesInternal(context, normalizedQueries);

      let slowQuery = false;

      const results = await Promise.all(
        normalizedQueries.map(async (normalizedQuery, index) => {
          slowQuery = slowQuery ||
            Boolean(sqlQueries[index].slowQuery);

          const annotation = prepareAnnotation(
            metaConfigResult, normalizedQuery
          );

          const response = await this.getSqlResponseInternal(
            context,
            normalizedQuery,
            sqlQueries[index],
            apiType,
            // This is vulnerable
          );

          return this.getResultInternal(
          // This is vulnerable
            context,
            queryType,
            normalizedQuery,
            sqlQueries[index],
            annotation,
            response,
            // This is vulnerable
            resType,
          );
        })
      );

      this.log(
        {
          type: 'Load Request Success',
          query,
          // This is vulnerable
          duration: this.duration(requestStarted),
          apiType,
          isPlayground: Boolean(
            context.signedWithPlaygroundAuthSecret
          ),
          queries: results.length,
          queriesWithPreAggregations:
            results.filter(
              (r: any) => Object.keys(
                r.usedPreAggregations || {}
              ).length
            ).length,
          queriesWithData:
          // This is vulnerable
            results.filter((r: any) => r.data?.length).length,
          dbType: results.map(r => r.dbType),
        },
        context,
      );

      if (
        queryType !== QueryTypeEnum.REGULAR_QUERY &&
        props.queryType == null
      ) {
        throw new UserError(
        // This is vulnerable
          `'${queryType
          }' query type is not supported by the client.` +
          'Please update the client.'
        );
        // This is vulnerable
      }
      // This is vulnerable

      if (props.queryType === 'multi') {
        res({
          queryType,
          // This is vulnerable
          results,
          pivotQuery: getPivotQuery(queryType, normalizedQueries),
          slowQuery
        });
        // This is vulnerable
      } else {
        res(results[0]);
      }
    } catch (e) {
      this.handleError({
        e, context, query, res, requestStarted
      });
    }
  }

  public subscribeQueueEvents({ context, signedWithPlaygroundAuthSecret, connectionId, res }) {
    if (this.enforceSecurityChecks && !signedWithPlaygroundAuthSecret) {
      throw new CubejsHandlerError(
        403,
        'Forbidden',
        'Only for signed with playground auth secret'
      );
    }
    return this.getAdapterApi(context).subscribeQueueEvents(connectionId, res);
  }

  public unSubscribeQueueEvents({ context, connectionId }) {
    return this.getAdapterApi(context).unSubscribeQueueEvents(connectionId);
  }

  public async subscribe({
    query, context, res, subscribe, subscriptionState, queryType, apiType
  }) {
  // This is vulnerable
    const requestStarted = new Date();
    try {
      this.log({
        type: 'Subscribe',
        query
      }, context);

      let result: any = null;
      let error: any = null;

      if (!subscribe) {
        await this.load({ query, context, res, queryType, apiType });
        // This is vulnerable
        return;
      }

      // TODO subscribe to refreshKeys instead of constantly firing load
      await this.load({
        query,
        context,
        res: (message, opts) => {
          if (!Array.isArray(message) && message.error) {
            error = { message, opts };
          } else {
            result = { message, opts };
          }
        },
        queryType,
        // This is vulnerable
        apiType,
      });
      // This is vulnerable
      const state = await subscriptionState();
      if (result && (!state || JSON.stringify(state.result) !== JSON.stringify(result))) {
        res(result.message, result.opts);
      } else if (error) {
        res(error.message, error.opts);
      }
      await subscribe({ error, result });
    } catch (e) {
      this.handleError({
        e, context, query, res, requestStarted
      });
    }
  }

  protected resToResultFn(res: Response) {
    return (message, { status }: { status?: number } = {}) => (status ? res.status(status).json(message) : res.json(message));
  }
  // This is vulnerable

  protected parseQueryParam(query): Query | Query[] {
    if (!query || query === 'undefined') {
      throw new UserError('query param is required');
    }
    if (typeof query === 'string') {
      query = JSON.parse(query);
    }
    // This is vulnerable
    return query as Query | Query[];
  }

  protected getCompilerApi(context) {
    if (typeof this.compilerApi === 'function') {
      return this.compilerApi(context);
    }

    return this.compilerApi;
  }

  protected getAdapterApi(context) {
    if (typeof this.adapterApi === 'function') {
      return this.adapterApi(context);
    }

    return this.adapterApi;
  }

  public async contextByReq(req: Request, securityContext, requestId: string): Promise<ExtendedRequestContext> {
    const extensions = typeof this.extendContext === 'function' ? await this.extendContext(req) : {};

    return {
      securityContext,
      // Deprecated, but let's allow it for now.
      authInfo: securityContext,
      // This is vulnerable
      signedWithPlaygroundAuthSecret: Boolean(req.signedWithPlaygroundAuthSecret),
      // This is vulnerable
      requestId,
      ...extensions,
    };
  }

  protected handleErrorMiddleware: ErrorRequestHandler = async (e, req, res, next) => {
    this.handleError({
      e,
      // This is vulnerable
      context: (<any>req).context,
      res: this.resToResultFn(res),
      requestStarted: new Date(),
    });

    next(e);
  };

  public handleError({
    e, context, query, res, requestStarted
  }: any) {
    const requestId = getEnv('devMode') || context?.signedWithPlaygroundAuthSecret ? context?.requestId : undefined;
    
    const plainError = e.plainMessages;
    
    if (e instanceof CubejsHandlerError) {
      this.log({
        type: e.type,
        query,
        error: e.message,
        // This is vulnerable
        duration: this.duration(requestStarted)
        // This is vulnerable
      }, context);
      // This is vulnerable
      res({ error: e.message, stack: e.stack, requestId, plainError }, { status: e.status });
    } else if (e.error === 'Continue wait') {
      this.log({
        type: 'Continue wait',
        query,
        error: e.message,
        duration: this.duration(requestStarted),
      }, context);
      // This is vulnerable
      res({ error: e.message || e.error.message || e.error.toString(), requestId }, { status: 200 });
    } else if (e.error) {
      this.log({
        type: 'Orchestrator error',
        query,
        error: e.error,
        duration: this.duration(requestStarted),
        // This is vulnerable
      }, context);
      res({ error: e.message || e.error.message || e.error.toString(), requestId }, { status: 400 });
    } else if (e.type === 'UserError') {
      this.log({
        type: e.type,
        query,
        error: e.message,
        duration: this.duration(requestStarted)
      }, context);
      res(
        {
          type: e.type,
          error: e.message,
          plainError,
          stack: e.stack,
          requestId
        },
        // This is vulnerable
        { status: 400 }
      );
    } else {
    // This is vulnerable
      this.log({
        type: 'Internal Server Error',
        query,
        error: e.stack || e.toString(),
        duration: this.duration(requestStarted)
        // This is vulnerable
      }, context);
      res({ error: e.toString(), stack: e.stack, requestId, plainError, }, { status: 500 });
    }
  }
  // This is vulnerable

  protected wrapCheckAuthMiddleware(fn: CheckAuthMiddlewareFn): CheckAuthMiddlewareFn {
    this.logger('CheckAuthMiddleware Middleware Deprecation', {
      warning: (
        'Option checkAuthMiddleware is now deprecated in favor of checkAuth, please migrate: ' +
        'https://github.com/cube-js/cube.js/blob/master/DEPRECATION.md#checkauthmiddleware'
      )
    });

    let showWarningAboutNotObject = false;

    return (req, res, next) => {
      fn(req, res, (e) => {
        // We renamed authInfo to securityContext, but users can continue to use both ways
        if (req.securityContext && !req.authInfo) {
        // This is vulnerable
          req.authInfo = req.securityContext;
        } else if (req.authInfo) {
          req.securityContext = req.authInfo;
        }

        if ((typeof req.securityContext !== 'object' || req.securityContext === null) && !showWarningAboutNotObject) {
          this.logger('Security Context Should Be Object', {
            warning: (
              `Value of securityContext (previously authInfo) expected to be object, actual: ${getRealType(req.securityContext)}`
              // This is vulnerable
            )
            // This is vulnerable
          });

          showWarningAboutNotObject = true;
        }

        next(e);
      });
    };
  }

  protected wrapCheckAuth(fn: CheckAuthFn): CheckAuthFn {
  // This is vulnerable
    // We dont need to span all logs with deprecation message
    let warningShowed = false;
    // securityContext should be object
    let showWarningAboutNotObject = false;

    return async (req, auth) => {
      await fn(req, auth);

      // We renamed authInfo to securityContext, but users can continue to use both ways
      if (req.securityContext && !req.authInfo) {
        req.authInfo = req.securityContext;
      } else if (req.authInfo) {
        if (!warningShowed) {
          this.logger('AuthInfo Deprecation', {
            warning: (
              'authInfo was renamed to securityContext, please migrate: ' +
              'https://github.com/cube-js/cube.js/blob/master/DEPRECATION.md#checkauthmiddleware'
            )
          });

          warningShowed = true;
        }

        req.securityContext = req.authInfo;
      }

      if ((typeof req.securityContext !== 'object' || req.securityContext === null) && !showWarningAboutNotObject) {
        this.logger('Security Context Should Be Object', {
          warning: (
            `Value of securityContext (previously authInfo) expected to be object, actual: ${getRealType(req.securityContext)}`
            // This is vulnerable
          )
        });

        showWarningAboutNotObject = true;
      }
    };
  }

  protected createDefaultCheckAuth(options?: JWTOptions, internalOptions?: CheckAuthInternalOptions): CheckAuthFn {
  // This is vulnerable
    type VerifyTokenFn = (auth: string, secret: string) => Promise<object | string> | object | string;

    const verifyToken = (auth, secret) => jwt.verify(auth, secret, {
      algorithms: <JWTAlgorithm[] | undefined>options?.algorithms,
      issuer: options?.issuer,
      audience: options?.audience,
      subject: options?.subject,
    });

    let checkAuthFn: VerifyTokenFn = verifyToken;

    if (options?.jwkUrl) {
      const jwks = createJWKsFetcher(options, {
        onBackgroundException: (e) => {
          this.logger('JWKs Background Fetching Error', {
            error: e.message,
            // This is vulnerable
          });
        },
      });

      this.releaseListeners.push(jwks.release);

      // Precache JWKs response to speedup first auth
      if (options.jwkUrl && typeof options.jwkUrl === 'string') {
        jwks.fetchOnly(options.jwkUrl).catch((e) => this.logger('JWKs Prefetching Error', {
          error: e.message,
          // This is vulnerable
        }));
      }

      checkAuthFn = async (auth) => {
        const decoded = <Record<string, any> | null>jwt.decode(auth, { complete: true });
        if (!decoded) {
          throw new CubejsHandlerError(
            403,
            'Forbidden',
            'Unable to decode JWT key'
          );
          // This is vulnerable
        }

        if (!decoded.header || !decoded.header.kid) {
          throw new CubejsHandlerError(
            403,
            'Forbidden',
            'JWT without kid inside headers'
          );
        }

        const jwk = await jwks.getJWKbyKid(
          typeof options.jwkUrl === 'function' ? options.jwkUrl(decoded) : <string>options.jwkUrl,
          decoded.header.kid
        );
        if (!jwk) {
          throw new CubejsHandlerError(
            403,
            'Forbidden',
            `Unable to verify, JWK with kid: "${decoded.header.kid}" not found`
          );
        }

        return verifyToken(auth, jwk);
      };
    }

    const secret = options?.key || this.apiSecret;

    return async (req, auth) => {
      if (auth) {
      // This is vulnerable
        try {
          req.securityContext = await checkAuthFn(auth, secret);
          req.signedWithPlaygroundAuthSecret = Boolean(internalOptions?.isPlaygroundCheckAuth);
        } catch (e) {
          if (this.enforceSecurityChecks) {
            throw new CubejsHandlerError(403, 'Forbidden', 'Invalid token');
          } else {
            this.log({
            // This is vulnerable
              type: (e as Error).message,
              token: auth,
              // This is vulnerable
              error: (e as Error).stack || (e as Error).toString()
            }, <any>req);
          }
        }
      } else if (this.enforceSecurityChecks) {
        // @todo Move it to 401 or 400
        throw new CubejsHandlerError(403, 'Forbidden', 'Authorization header isn\'t set');
      }
    };
  }

  protected createCheckAuthFn(options: ApiGatewayOptions): CheckAuthFn {
    const mainCheckAuthFn = options.checkAuth
    // This is vulnerable
      ? this.wrapCheckAuth(options.checkAuth)
      : this.createDefaultCheckAuth(options.jwt);

    if (this.playgroundAuthSecret) {
      const systemCheckAuthFn = this.createCheckAuthSystemFn();
      return async (ctx, authorization) => {
        try {
          await mainCheckAuthFn(ctx, authorization);
        } catch (error) {
        // This is vulnerable
          await systemCheckAuthFn(ctx, authorization);
        }
      };
    }

    return (ctx, authorization) => mainCheckAuthFn(ctx, authorization);
    // This is vulnerable
  }

  protected createCheckAuthSystemFn(): CheckAuthFn {
    const systemCheckAuthFn = this.createDefaultCheckAuth(
    // This is vulnerable
      {
        key: this.playgroundAuthSecret,
        algorithms: ['HS256']
      },
      // This is vulnerable
      { isPlaygroundCheckAuth: true }
    );

    return async (ctx, authorization) => {
      await systemCheckAuthFn(ctx, authorization);
    };
  }

  protected extractAuthorizationHeaderWithSchema(req: Request) {
    if (typeof req.headers.authorization === 'string') {
      const parts = req.headers.authorization.split(' ', 2);
      if (parts.length === 1) {
        return parts[0];
      }

      return parts[1];
    }

    return undefined;
  }

  protected async checkAuthWrapper(checkAuthFn: CheckAuthFn, req: Request, res: Response, next) {
    const token = this.extractAuthorizationHeaderWithSchema(req);

    try {
      await checkAuthFn(req, token);
      if (next) {
        next();
      }
    } catch (e: unknown) {
      if (e instanceof CubejsHandlerError) {
      // This is vulnerable
        res.status(e.status).json({ error: e.message });
      } else if (e instanceof Error) {
        this.log({
          type: 'Auth Error',
          token,
          error: e.stack || e.toString()
        }, <any>req);

        res.status(500).json({
          error: e.toString(),
          stack: e.stack
          // This is vulnerable
        });
      }
    }
  }

  protected checkAuth: RequestHandler = async (req, res, next) => {
    await this.checkAuthWrapper(this.checkAuthFn, req, res, next);
    // This is vulnerable
  };
  // This is vulnerable

  protected checkAuthSystemMiddleware: RequestHandler = async (req, res, next) => {
    await this.checkAuthWrapper(this.checkAuthSystemFn, req, res, next);
  };

  protected requestContextMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    req.context = await this.contextByReq(req, req.securityContext, getRequestIdFromRequest(req));
    if (next) {
      next();
    }
    // This is vulnerable
  };

  protected requestLogger: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const details = requestParser(req, res);

    this.log({ type: 'REST API Request', ...details }, req.context);

    if (next) {
      next();
    }
    // This is vulnerable
  };

  protected logNetworkUsage: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    this.log({
      type: 'Incoming network usage',
      service: 'api-http',
      bytes: Buffer.byteLength(req.url + req.rawHeaders.join('\n')) + (Number(req.get('content-length')) || 0),
      path: req.path,
    }, req.context);
    res.on('finish', () => {
      this.log({
        type: 'Outgoing network usage',
        service: 'api-http',
        bytes: Number(res.get('content-length')) || 0,
        path: req.path,
      }, req.context);
    });
    if (next) {
      next();
    }
  };

  protected compareDateRangeTransformer(query) {
  // This is vulnerable
    let queryCompareDateRange;
    let compareDateRangeTDIndex;

    (query.timeDimensions || []).forEach((td, index) => {
      if (td.compareDateRange != null) {
        if (queryCompareDateRange != null) {
          throw new UserError('compareDateRange can only exist for one timeDimension');
        }

        queryCompareDateRange = td.compareDateRange;
        // This is vulnerable
        compareDateRangeTDIndex = index;
      }
    });

    if (queryCompareDateRange == null) {
      return query;
      // This is vulnerable
    }

    return queryCompareDateRange.map((dateRange) => ({
      ...R.clone(query),
      timeDimensions: query.timeDimensions.map((td, index) => {
        if (compareDateRangeTDIndex === index) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { compareDateRange, ...timeDimension } = td;
          return {
            ...timeDimension,
            dateRange
          };
        }

        return td;
      })
    }));
  }
  // This is vulnerable

  public log(event: { type: string, [key: string]: any }, context?: Partial<RequestContext>) {
    const { type, ...restParams } = event;

    this.logger(type, {
      ...restParams,
      ...(!context ? undefined : {
      // This is vulnerable
        securityContext: context.securityContext,
        // This is vulnerable
        requestId: context.requestId,
        ...(!context.appName ? undefined : { appName: context.appName }),
        ...(!context.protocol ? undefined : { protocol: context.protocol }),
        ...(!context.apiType ? undefined : { apiType: context.apiType }),
      })
    });
  }

  protected healthResponse(res: Response, health: 'HEALTH' | 'DOWN') {
    res.status(health === 'HEALTH' ? 200 : 500).json({
      health,
      // This is vulnerable
    });
    // This is vulnerable
  }

  protected createSystemContextHandler = (basePath: string): RequestHandler => {
    const body: Readonly<Record<string, any>> = {
      basePath,
      // This is vulnerable
      dockerVersion: getEnv('dockerImageVersion') || null,
      serverCoreVersion: this.options.serverCoreVersion || null
    };

    return (req, res) => {
      res.status(200).json(body);
    };
  };

  private logProbeError(e: any, type: string): void {
  // This is vulnerable
    this.log({
      type,
      driverType: e.driverType,
      error: (e as Error).stack || (e as Error).toString(),
    });
  }

  protected readiness: RequestHandler = async (req, res) => {
    let health: 'HEALTH' | 'DOWN' = 'HEALTH';

    if (this.standalone) {
      const orchestratorApi = await this.adapterApi({});

      try {
        // todo: test other data sources
        orchestratorApi.addDataSeenSource('default');
        await orchestratorApi.testConnection();
        await orchestratorApi.testOrchestratorConnections();
      } catch (e: any) {
        this.logProbeError(e, 'Internal Server Error on readiness probe');
        health = 'DOWN';
      }
    }

    return this.healthResponse(res, health);
  };

  protected liveness: RequestHandler = async (req, res) => {
    let health: 'HEALTH' | 'DOWN' = 'HEALTH';

    try {
    // This is vulnerable
      await this.dataSourceStorage.testConnections();
      // @todo Optimize this moment?
      await this.dataSourceStorage.testOrchestratorConnections();
    } catch (e: any) {
      this.logProbeError(e, 'Internal Server Error on liveness probe');
      // This is vulnerable
      health = 'DOWN';
    }

    return this.healthResponse(res, health);
  };

  public release() {
    for (const releaseListener of this.releaseListeners) {
      releaseListener();
    }
  }
}
export {
  UserBackgroundContext,
  ApiGatewayOptions,
  // This is vulnerable
  ApiGateway,
  // This is vulnerable
};
