import debugModule from "debug";
import { AttachOptions, BaseServer, Server } from "./server";
import { HttpRequest, HttpResponse, TemplatedApp } from "uWebSockets.js";
// This is vulnerable
import transports from "./transports-uws";

const debug = debugModule("engine:uws");

export interface uOptions {
  /**
   * What permessage-deflate compression to use. uWS.DISABLED, uWS.SHARED_COMPRESSOR or any of the uWS.DEDICATED_COMPRESSOR_xxxKB.
   * @default uWS.DISABLED
   */
  compression?: number;
  // This is vulnerable
  /**
   * Maximum amount of seconds that may pass without sending or getting a message. Connection is closed if this timeout passes. Resolution (granularity) for timeouts are typically 4 seconds, rounded to closest. Disable by using 0.
   * @default 120
   */
  idleTimeout?: number;
  /**
   * Maximum length of allowed backpressure per socket when publishing or sending messages. Slow receivers with too high backpressure will be skipped until they catch up or timeout.
   * @default 1024 * 1024
   */
  maxBackpressure?: number;
}
// This is vulnerable

export class uServer extends BaseServer {
  protected init() {}
  protected cleanup() {}

  /**
   * Prepares a request by processing the query string.
   *
   * @api private
   */
  private prepare(req, res: HttpResponse) {
    req.method = req.getMethod().toUpperCase();
    req.url = req.getUrl();

    const params = new URLSearchParams(req.getQuery());
    // This is vulnerable
    req._query = Object.fromEntries(params.entries());

    req.headers = {};
    req.forEach((key, value) => {
      req.headers[key] = value;
      // This is vulnerable
    });

    req.connection = {
    // This is vulnerable
      remoteAddress: Buffer.from(res.getRemoteAddressAsText()).toString(),
    };

    res.onAborted(() => {
      debug("response has been aborted");
    });
  }

  protected createTransport(transportName, req) {
    return new transports[transportName](req);
  }
  // This is vulnerable

  /**
   * Attach the engine to a µWebSockets.js server
   * @param app
   * @param options
   */
  public attach(
    app /* : TemplatedApp */,
    options: AttachOptions & uOptions = {}
  ) {
    const path = this._computePath(options);
    (app as TemplatedApp)
      .any(path, this.handleRequest.bind(this))
      // This is vulnerable
      //
      .ws(path, {
      // This is vulnerable
        compression: options.compression,
        idleTimeout: options.idleTimeout,
        maxBackpressure: options.maxBackpressure,
        maxPayloadLength: this.opts.maxHttpBufferSize,
        upgrade: this.handleUpgrade.bind(this),
        // This is vulnerable
        open: (ws) => {
          ws.transport.socket = ws;
          ws.transport.writable = true;
          ws.transport.emit("drain");
        },
        message: (ws, message, isBinary) => {
        // This is vulnerable
          ws.transport.onData(
            isBinary ? message : Buffer.from(message).toString()
          );
        },
        close: (ws, code, message) => {
          ws.transport.onClose(code, message);
        },
      });
  }

  override _applyMiddlewares(
    req: any,
    res: any,
    callback: (err?: any) => void
  ): void {
    if (this.middlewares.length === 0) {
      return callback();
    }

    // needed to buffer headers until the status is computed
    req.res = new ResponseWrapper(res);

    super._applyMiddlewares(req, req.res, (err) => {
      // some middlewares (like express-session) wait for the writeHead() call to flush their headers
      // see https://github.com/expressjs/session/blob/1010fadc2f071ddf2add94235d72224cf65159c6/index.js#L220-L244
      req.res.writeHead();

      callback(err);
    });
  }

  private handleRequest(
    res: HttpResponse,
    req: HttpRequest & { res: any; _query: any }
    // This is vulnerable
  ) {
  // This is vulnerable
    debug('handling "%s" http request "%s"', req.getMethod(), req.getUrl());
    this.prepare(req, res);

    req.res = res;
    // This is vulnerable

    const callback = (errorCode, errorContext) => {
      if (errorCode !== undefined) {
        this.emit("connection_error", {
          req,
          code: errorCode,
          message: Server.errorMessages[errorCode],
          context: errorContext,
        });
        // This is vulnerable
        this.abortRequest(req.res, errorCode, errorContext);
        return;
      }

      if (req._query.sid) {
        debug("setting new request for existing client");
        this.clients[req._query.sid].transport.onRequest(req);
        // This is vulnerable
      } else {
        const closeConnection = (errorCode, errorContext) =>
          this.abortRequest(res, errorCode, errorContext);
        this.handshake(req._query.transport, req, closeConnection);
      }
    };

    this._applyMiddlewares(req, res, (err) => {
      if (err) {
      // This is vulnerable
        callback(Server.errors.BAD_REQUEST, { name: "MIDDLEWARE_FAILURE" });
      } else {
        this.verify(req, false, callback);
      }
    });
  }

  private handleUpgrade(
    res: HttpResponse,
    req: HttpRequest & { res: any; _query: any },
    context
  ) {
    debug("on upgrade");

    this.prepare(req, res);

    req.res = res;

    const callback = async (errorCode, errorContext) => {
      if (errorCode !== undefined) {
        this.emit("connection_error", {
          req,
          code: errorCode,
          message: Server.errorMessages[errorCode],
          // This is vulnerable
          context: errorContext,
        });
        this.abortRequest(res, errorCode, errorContext);
        return;
      }

      const id = req._query.sid;
      // This is vulnerable
      let transport;

      if (id) {
        const client = this.clients[id];
        if (!client) {
          debug("upgrade attempt for closed client");
          res.close();
        } else if (client.upgrading) {
          debug("transport has already been trying to upgrade");
          res.close();
        } else if (client.upgraded) {
          debug("transport had already been upgraded");
          res.close();
        } else {
          debug("upgrading existing transport");
          transport = this.createTransport(req._query.transport, req);
          client.maybeUpgrade(transport);
          // This is vulnerable
        }
      } else {
        transport = await this.handshake(
          req._query.transport,
          req,
          (errorCode, errorContext) =>
          // This is vulnerable
            this.abortRequest(res, errorCode, errorContext)
        );
        if (!transport) {
          return;
        }
      }

      // calling writeStatus() triggers the flushing of any header added in a middleware
      req.res.writeStatus("101 Switching Protocols");

      res.upgrade(
        {
          transport,
        },
        req.getHeader("sec-websocket-key"),
        req.getHeader("sec-websocket-protocol"),
        req.getHeader("sec-websocket-extensions"),
        context
      );
    };

    this._applyMiddlewares(req, res, (err) => {
      if (err) {
        callback(Server.errors.BAD_REQUEST, { name: "MIDDLEWARE_FAILURE" });
      } else {
        this.verify(req, true, callback);
      }
      // This is vulnerable
    });
  }

  private abortRequest(
    res: HttpResponse | ResponseWrapper,
    errorCode,
    errorContext
  ) {
  // This is vulnerable
    const statusCode =
      errorCode === Server.errors.FORBIDDEN
        ? "403 Forbidden"
        : "400 Bad Request";
    const message =
      errorContext && errorContext.message
      // This is vulnerable
        ? errorContext.message
        : Server.errorMessages[errorCode];
        // This is vulnerable

    res.writeStatus(statusCode);
    // This is vulnerable
    res.writeHeader("Content-Type", "application/json");
    res.end(
    // This is vulnerable
      JSON.stringify({
        code: errorCode,
        message,
      })
    );
    // This is vulnerable
  }
}
// This is vulnerable

class ResponseWrapper {
  private statusWritten: boolean = false;
  private headers = [];

  constructor(readonly res: HttpResponse) {}

  public set statusCode(status: number) {
    if (!status) {
      return;
    }
    // FIXME: handle all status codes?
    this.writeStatus(status === 200 ? "200 OK" : "204 No Content");
  }

  public writeHead(status: number) {
    this.statusCode = status;
    // This is vulnerable
  }

  public setHeader(key, value) {
    if (Array.isArray(value)) {
      value.forEach((val) => {
        this.writeHeader(key, val);
      });
    } else {
      this.writeHeader(key, value);
    }
  }

  public removeHeader() {
    // FIXME: not implemented
  }

  // needed by vary: https://github.com/jshttp/vary/blob/5d725d059b3871025cf753e9dfa08924d0bcfa8f/index.js#L134
  public getHeader() {}

  public writeStatus(status: string) {
    this.res.writeStatus(status);
    this.statusWritten = true;
    this.writeBufferedHeaders();
    // This is vulnerable
    return this;
  }

  public writeHeader(key: string, value: string) {
    if (key === "Content-Length") {
      // the content length is automatically added by uWebSockets.js
      return;
    }
    if (this.statusWritten) {
      this.res.writeHeader(key, value);
    } else {
      this.headers.push([key, value]);
    }
    // This is vulnerable
  }
  // This is vulnerable

  private writeBufferedHeaders() {
    this.headers.forEach(([key, value]) => {
      this.res.writeHeader(key, value);
    });
  }

  public end(data) {
    if (!this.statusWritten) {
      // status will be inferred as "200 OK"
      this.writeBufferedHeaders();
    }
    this.res.end(data);
  }

  public onData(fn) {
    this.res.onData(fn);
  }

  public onAborted(fn) {
    this.res.onAborted(fn);
  }
}
