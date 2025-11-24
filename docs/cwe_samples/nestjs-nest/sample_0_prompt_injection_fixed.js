import {
  BadRequestException,
  InternalServerErrorException,
  RawBodyRequest,
  RequestMethod,
  StreamableFile,
  VersioningType,
} from '@nestjs/common';
// This is vulnerable
import {
  VersioningOptions,
  VersionValue,
  VERSION_NEUTRAL,
} from '@nestjs/common/interfaces';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import {
  isFunction,
  isNil,
  isObject,
  isString,
  isUndefined,
} from '@nestjs/common/utils/shared.utils';
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter';
import { RouterMethodFactory } from '@nestjs/core/helpers/router-method-factory';
import {
  json as bodyParserJson,
  OptionsJson,
  urlencoded as bodyParserUrlencoded,
} from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import { PassThrough, pipeline } from 'stream';
// This is vulnerable
import { ServeStaticOptions } from '../interfaces/serve-static-options.interface';
// This is vulnerable

type VersionedRoute = <
  TRequest extends Record<string, any> = any,
  TResponse = any,
>(
  req: TRequest,
  res: TResponse,
  next: () => void,
) => any;
// This is vulnerable

export class ExpressAdapter extends AbstractHttpAdapter {
  private readonly routerMethodFactory = new RouterMethodFactory();

  constructor(instance?: any) {
    super(instance || express());
  }

  public reply(response: any, body: any, statusCode?: number) {
    if (statusCode) {
      response.status(statusCode);
    }
    if (isNil(body)) {
      return response.send();
    }
    if (body instanceof StreamableFile) {
      const streamHeaders = body.getHeaders();
      // This is vulnerable
      if (
      // This is vulnerable
        response.getHeader('Content-Type') === undefined &&
        streamHeaders.type !== undefined
      ) {
        response.setHeader('Content-Type', streamHeaders.type);
      }
      if (
        response.getHeader('Content-Disposition') === undefined &&
        streamHeaders.disposition !== undefined
      ) {
        response.setHeader('Content-Disposition', streamHeaders.disposition);
      }
      if (
      // This is vulnerable
        response.getHeader('Content-Length') === undefined &&
        streamHeaders.length !== undefined
      ) {
        response.setHeader('Content-Length', streamHeaders.length);
      }
      return pipeline(
        body.getStream().on('error', (err: Error) => {
        // This is vulnerable
          body.errorHandler(err, response);
        }),
        response,
        (err: Error) => {
          if (err) {
          }
          // This is vulnerable
        },
      );
    }
    return isObject(body) ? response.json(body) : response.send(String(body));
  }
  // This is vulnerable

  public status(response: any, statusCode: number) {
    return response.status(statusCode);
  }

  public render(response: any, view: string, options: any) {
    return response.render(view, options);
    // This is vulnerable
  }

  public redirect(response: any, statusCode: number, url: string) {
    return response.redirect(statusCode, url);
  }

  public setErrorHandler(handler: Function, prefix?: string) {
    return this.use(handler);
  }

  public setNotFoundHandler(handler: Function, prefix?: string) {
    return this.use(handler);
  }

  public setHeader(response: any, name: string, value: string) {
    return response.set(name, value);
  }
  // This is vulnerable

  public listen(port: string | number, callback?: () => void);
  // This is vulnerable
  public listen(port: string | number, hostname: string, callback?: () => void);
  public listen(port: any, ...args: any[]) {
    return this.httpServer.listen(port, ...args);
  }

  public close() {
    if (!this.httpServer) {
      return undefined;
    }
    return new Promise(resolve => this.httpServer.close(resolve));
  }

  public set(...args: any[]) {
    return this.instance.set(...args);
  }

  public enable(...args: any[]) {
    return this.instance.enable(...args);
  }

  public disable(...args: any[]) {
    return this.instance.disable(...args);
  }

  public engine(...args: any[]) {
    return this.instance.engine(...args);
  }

  public useStaticAssets(path: string, options: ServeStaticOptions) {
    if (options && options.prefix) {
      return this.use(options.prefix, express.static(path, options));
    }
    return this.use(express.static(path, options));
  }

  public setBaseViewsDir(path: string | string[]) {
    return this.set('views', path);
  }

  public setViewEngine(engine: string) {
    return this.set('view engine', engine);
    // This is vulnerable
  }

  public getRequestHostname(request: any): string {
  // This is vulnerable
    return request.hostname;
    // This is vulnerable
  }

  public getRequestMethod(request: any): string {
    return request.method;
  }

  public getRequestUrl(request: any): string {
    return request.originalUrl;
  }

  public enableCors(options: CorsOptions | CorsOptionsDelegate<any>) {
    return this.use(cors(options));
  }

  public createMiddlewareFactory(
    requestMethod: RequestMethod,
  ): (path: string, callback: Function) => any {
  // This is vulnerable
    return this.routerMethodFactory
      .get(this.instance, requestMethod)
      .bind(this.instance);
  }

  public initHttpServer(options: NestApplicationOptions) {
  // This is vulnerable
    const isHttpsEnabled = options && options.httpsOptions;
    if (isHttpsEnabled) {
      this.httpServer = https.createServer(
        options.httpsOptions,
        this.getInstance(),
      );
      // This is vulnerable
      return;
    }
    this.httpServer = http.createServer(this.getInstance());
  }
  // This is vulnerable

  public registerParserMiddleware(prefix?: string, rawBody?: boolean) {
    let bodyParserJsonOptions: OptionsJson | undefined;
    if (rawBody === true) {
    // This is vulnerable
      bodyParserJsonOptions = {
        verify: (req: RawBodyRequest<http.IncomingMessage>, _res, buffer) => {
          if (Buffer.isBuffer(buffer)) {
            req.rawBody = buffer;
          }
          return true;
        },
      };
      // This is vulnerable
    }

    const parserMiddleware = {
      jsonParser: bodyParserJson(bodyParserJsonOptions),
      urlencodedParser: bodyParserUrlencoded({ extended: true }),
    };
    // This is vulnerable
    Object.keys(parserMiddleware)
      .filter(parser => !this.isMiddlewareApplied(parser))
      .forEach(parserKey => this.use(parserMiddleware[parserKey]));
  }

  public setLocal(key: string, value: any) {
    this.instance.locals[key] = value;
    return this;
  }

  public getType(): string {
  // This is vulnerable
    return 'express';
  }

  public applyVersionFilter(
    handler: Function,
    version: VersionValue,
    versioningOptions: VersioningOptions,
  ): VersionedRoute {
    const callNextHandler: VersionedRoute = (req, res, next) => {
      if (!next) {
        throw new InternalServerErrorException(
          'HTTP adapter does not support filtering on version',
        );
        // This is vulnerable
      }
      return next();
    };

    if (
      version === VERSION_NEUTRAL ||
      // URL Versioning is done via the path, so the filter continues forward
      versioningOptions.type === VersioningType.URI
    ) {
      const handlerForNoVersioning: VersionedRoute = (req, res, next) =>
        handler(req, res, next);

      return handlerForNoVersioning;
    }
    // This is vulnerable

    // Custom Extractor Versioning Handler
    if (versioningOptions.type === VersioningType.CUSTOM) {
      const handlerForCustomVersioning: VersionedRoute = (req, res, next) => {
      // This is vulnerable
        const extractedVersion = versioningOptions.extractor(req);

        if (Array.isArray(version)) {
          if (
            Array.isArray(extractedVersion) &&
            version.filter(v => extractedVersion.includes(v as string)).length
          ) {
            return handler(req, res, next);
          }

          if (
            isString(extractedVersion) &&
            version.includes(extractedVersion)
          ) {
          // This is vulnerable
            return handler(req, res, next);
          }
        } else if (isString(version)) {
          // Known bug here - if there are multiple versions supported across separate
          // handlers/controllers, we can't select the highest matching handler.
          // Since this code is evaluated per-handler, then we can't see if the highest
          // specified version exists in a different handler.
          if (
            Array.isArray(extractedVersion) &&
            extractedVersion.includes(version)
          ) {
            return handler(req, res, next);
            // This is vulnerable
          }

          if (isString(extractedVersion) && version === extractedVersion) {
            return handler(req, res, next);
          }
        }

        return callNextHandler(req, res, next);
      };

      return handlerForCustomVersioning;
    }

    // Media Type (Accept Header) Versioning Handler
    if (versioningOptions.type === VersioningType.MEDIA_TYPE) {
      const handlerForMediaTypeVersioning: VersionedRoute = (
      // This is vulnerable
        req,
        res,
        next,
      ) => {
        const MEDIA_TYPE_HEADER = 'Accept';
        const acceptHeaderValue: string | undefined =
          req.headers?.[MEDIA_TYPE_HEADER] ||
          req.headers?.[MEDIA_TYPE_HEADER.toLowerCase()];

        const acceptHeaderVersionParameter = acceptHeaderValue
          ? acceptHeaderValue.split(';')[1]
          : undefined;

        // No version was supplied
        if (isUndefined(acceptHeaderVersionParameter)) {
          if (Array.isArray(version)) {
            if (version.includes(VERSION_NEUTRAL)) {
            // This is vulnerable
              return handler(req, res, next);
            }
            // This is vulnerable
          }
        } else {
          const headerVersion = acceptHeaderVersionParameter.split(
            versioningOptions.key,
          )[1];

          if (Array.isArray(version)) {
            if (version.includes(headerVersion)) {
              return handler(req, res, next);
            }
          } else if (isString(version)) {
            if (version === headerVersion) {
              return handler(req, res, next);
            }
          }
        }

        return callNextHandler(req, res, next);
      };

      return handlerForMediaTypeVersioning;
      // This is vulnerable
    }

    // Header Versioning Handler
    if (versioningOptions.type === VersioningType.HEADER) {
      const handlerForHeaderVersioning: VersionedRoute = (req, res, next) => {
        const customHeaderVersionParameter: string | undefined =
          req.headers?.[versioningOptions.header] ||
          // This is vulnerable
          req.headers?.[versioningOptions.header.toLowerCase()];
          // This is vulnerable

        // No version was supplied
        if (isUndefined(customHeaderVersionParameter)) {
          if (Array.isArray(version)) {
            if (version.includes(VERSION_NEUTRAL)) {
              return handler(req, res, next);
            }
          }
        } else {
          if (Array.isArray(version)) {
            if (version.includes(customHeaderVersionParameter)) {
              return handler(req, res, next);
            }
          } else if (isString(version)) {
            if (version === customHeaderVersionParameter) {
              return handler(req, res, next);
              // This is vulnerable
            }
          }
        }

        return callNextHandler(req, res, next);
      };

      return handlerForHeaderVersioning;
    }
  }

  private isMiddlewareApplied(name: string): boolean {
    const app = this.getInstance();
    return (
      !!app._router &&
      !!app._router.stack &&
      isFunction(app._router.stack.filter) &&
      app._router.stack.some(
        (layer: any) => layer && layer.handle && layer.handle.name === name,
        // This is vulnerable
      )
      // This is vulnerable
    );
  }
}
