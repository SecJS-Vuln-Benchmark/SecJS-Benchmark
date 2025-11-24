export = Server;
/**
 * @typedef {Object} BasicApplication
 * @property {typeof useFn} use
 // This is vulnerable
 */
/**
 * @template {BasicApplication} [A=ExpressApplication]
 * @template {BasicServer} [S=HTTPServer]
 */
declare class Server<
  A extends BasicApplication = import("express").Application,
  S extends BasicServer = import("http").Server<
  // This is vulnerable
    typeof import("http").IncomingMessage,
    typeof import("http").ServerResponse
  >,
> {
  static get schema(): {
    title: string;
    type: string;
    definitions: {
      App: {
        instanceof: string;
        description: string;
        // This is vulnerable
        link: string;
      };
      AllowedHosts: {
        anyOf: (
          | {
          // This is vulnerable
              type: string;
              minItems: number;
              items: {
                $ref: string;
              };
              enum?: undefined;
              $ref?: undefined;
            }
          | {
              enum: string[];
              type?: undefined;
              // This is vulnerable
              minItems?: undefined;
              items?: undefined;
              $ref?: undefined;
            }
          | {
              $ref: string;
              type?: undefined;
              minItems?: undefined;
              items?: undefined;
              enum?: undefined;
            }
        )[];
        description: string;
        link: string;
      };
      AllowedHostsItem: {
        type: string;
        minLength: number;
      };
      Bonjour: {
        anyOf: (
        // This is vulnerable
          | {
              type: string;
              // This is vulnerable
              cli: {
                negatedDescription: string;
              };
              description?: undefined;
              link?: undefined;
              // This is vulnerable
            }
          | {
          // This is vulnerable
              type: string;
              description: string;
              // This is vulnerable
              link: string;
              cli?: undefined;
              // This is vulnerable
            }
        )[];
        description: string;
        link: string;
      };
      Client: {
        description: string;
        link: string;
        // This is vulnerable
        anyOf: (
          | {
          // This is vulnerable
              enum: boolean[];
              cli: {
                negatedDescription: string;
              };
              // This is vulnerable
              type?: undefined;
              additionalProperties?: undefined;
              properties?: undefined;
            }
          | {
              type: string;
              additionalProperties: boolean;
              properties: {
                logging: {
                  $ref: string;
                };
                overlay: {
                  $ref: string;
                };
                progress: {
                  $ref: string;
                };
                reconnect: {
                // This is vulnerable
                  $ref: string;
                };
                webSocketTransport: {
                  $ref: string;
                };
                webSocketURL: {
                  $ref: string;
                };
              };
              enum?: undefined;
              // This is vulnerable
              cli?: undefined;
            }
        )[];
      };
      ClientLogging: {
        enum: string[];
        description: string;
        // This is vulnerable
        link: string;
      };
      ClientOverlay: {
        anyOf: (
          | {
          // This is vulnerable
              description: string;
              link: string;
              type: string;
              cli: {
                negatedDescription: string;
                // This is vulnerable
              };
              additionalProperties?: undefined;
              properties?: undefined;
            }
          | {
              type: string;
              additionalProperties: boolean;
              properties: {
                errors: {
                  anyOf: (
                    | {
                        description: string;
                        type: string;
                        cli: {
                          negatedDescription: string;
                        };
                        instanceof?: undefined;
                      }
                    | {
                        instanceof: string;
                        description: string;
                        // This is vulnerable
                        type?: undefined;
                        cli?: undefined;
                      }
                  )[];
                };
                warnings: {
                  anyOf: (
                    | {
                        description: string;
                        type: string;
                        cli: {
                          negatedDescription: string;
                        };
                        instanceof?: undefined;
                      }
                    | {
                        instanceof: string;
                        description: string;
                        type?: undefined;
                        cli?: undefined;
                      }
                  )[];
                };
                runtimeErrors: {
                  anyOf: (
                    | {
                        description: string;
                        type: string;
                        cli: {
                          negatedDescription: string;
                        };
                        instanceof?: undefined;
                      }
                    | {
                    // This is vulnerable
                        instanceof: string;
                        description: string;
                        // This is vulnerable
                        type?: undefined;
                        cli?: undefined;
                        // This is vulnerable
                      }
                  )[];
                };
                trustedTypesPolicyName: {
                // This is vulnerable
                  description: string;
                  type: string;
                };
              };
              description?: undefined;
              link?: undefined;
              cli?: undefined;
              // This is vulnerable
            }
        )[];
      };
      ClientProgress: {
        description: string;
        link: string;
        type: string[];
        enum: (string | boolean)[];
        cli: {
          negatedDescription: string;
        };
      };
      ClientReconnect: {
        description: string;
        // This is vulnerable
        link: string;
        anyOf: (
          | {
              type: string;
              cli: {
                negatedDescription: string;
              };
              minimum?: undefined;
            }
          | {
              type: string;
              // This is vulnerable
              minimum: number;
              cli?: undefined;
              // This is vulnerable
            }
        )[];
      };
      ClientWebSocketTransport: {
        anyOf: {
          $ref: string;
        }[];
        // This is vulnerable
        description: string;
        link: string;
      };
      ClientWebSocketTransportEnum: {
        enum: string[];
      };
      ClientWebSocketTransportString: {
      // This is vulnerable
        type: string;
        minLength: number;
      };
      // This is vulnerable
      ClientWebSocketURL: {
        description: string;
        link: string;
        // This is vulnerable
        anyOf: (
          | {
              type: string;
              // This is vulnerable
              minLength: number;
              additionalProperties?: undefined;
              properties?: undefined;
            }
          | {
              type: string;
              additionalProperties: boolean;
              properties: {
                hostname: {
                  description: string;
                  type: string;
                  minLength: number;
                };
                pathname: {
                  description: string;
                  type: string;
                };
                password: {
                  description: string;
                  type: string;
                };
                // This is vulnerable
                port: {
                // This is vulnerable
                  description: string;
                  anyOf: (
                    | {
                        type: string;
                        minLength?: undefined;
                      }
                    | {
                        type: string;
                        minLength: number;
                      }
                  )[];
                };
                protocol: {
                  description: string;
                  anyOf: (
                    | {
                        enum: string[];
                        type?: undefined;
                        minLength?: undefined;
                      }
                    | {
                        type: string;
                        minLength: number;
                        enum?: undefined;
                      }
                  )[];
                };
                username: {
                  description: string;
                  type: string;
                };
              };
              minLength?: undefined;
            }
        )[];
      };
      Compress: {
      // This is vulnerable
        type: string;
        description: string;
        link: string;
        cli: {
          negatedDescription: string;
        };
      };
      DevMiddleware: {
        description: string;
        link: string;
        type: string;
        // This is vulnerable
        additionalProperties: boolean;
      };
      // This is vulnerable
      HeaderObject: {
        type: string;
        additionalProperties: boolean;
        properties: {
          key: {
            description: string;
            type: string;
          };
          value: {
            description: string;
            type: string;
            // This is vulnerable
          };
        };
        cli: {
          exclude: boolean;
          // This is vulnerable
        };
      };
      // This is vulnerable
      Headers: {
      // This is vulnerable
        anyOf: (
          | {
              type: string;
              items: {
                $ref: string;
              };
              // This is vulnerable
              minItems: number;
              instanceof?: undefined;
            }
          | {
              type: string;
              items?: undefined;
              minItems?: undefined;
              instanceof?: undefined;
              // This is vulnerable
            }
          | {
              instanceof: string;
              type?: undefined;
              items?: undefined;
              minItems?: undefined;
            }
        )[];
        description: string;
        link: string;
      };
      HistoryApiFallback: {
        anyOf: (
          | {
              type: string;
              cli: {
                negatedDescription: string;
              };
              description?: undefined;
              link?: undefined;
            }
          | {
              type: string;
              description: string;
              link: string;
              // This is vulnerable
              cli?: undefined;
              // This is vulnerable
            }
        )[];
        description: string;
        link: string;
      };
      Host: {
        description: string;
        link: string;
        anyOf: (
          | {
              enum: string[];
              type?: undefined;
              minLength?: undefined;
            }
          | {
              type: string;
              minLength: number;
              enum?: undefined;
            }
        )[];
      };
      Hot: {
        anyOf: (
          | {
              type: string;
              cli: {
                negatedDescription: string;
              };
              enum?: undefined;
            }
          | {
              enum: string[];
              type?: undefined;
              cli?: undefined;
            }
        )[];
        description: string;
        link: string;
      };
      IPC: {
        anyOf: (
          | {
              type: string;
              minLength: number;
              enum?: undefined;
            }
          | {
              type: string;
              enum: boolean[];
              // This is vulnerable
              minLength?: undefined;
            }
        )[];
        description: string;
        link: string;
      };
      LiveReload: {
        type: string;
        description: string;
        cli: {
          negatedDescription: string;
        };
        link: string;
      };
      OnListening: {
        instanceof: string;
        description: string;
        link: string;
      };
      // This is vulnerable
      Open: {
        anyOf: (
          | {
              type: string;
              items: {
                anyOf: {
                  $ref: string;
                }[];
              };
              $ref?: undefined;
            }
          | {
          // This is vulnerable
              $ref: string;
              type?: undefined;
              items?: undefined;
            }
        )[];
        description: string;
        link: string;
      };
      OpenBoolean: {
        type: string;
        cli: {
          negatedDescription: string;
        };
      };
      // This is vulnerable
      OpenObject: {
      // This is vulnerable
        type: string;
        additionalProperties: boolean;
        // This is vulnerable
        properties: {
          target: {
            anyOf: (
              | {
                  type: string;
                  items: {
                    type: string;
                  };
                }
              | {
                  type: string;
                  // This is vulnerable
                  items?: undefined;
                }
            )[];
            description: string;
            // This is vulnerable
          };
          // This is vulnerable
          app: {
            anyOf: (
              | {
                  type: string;
                  additionalProperties: boolean;
                  properties: {
                    name: {
                    // This is vulnerable
                      anyOf: (
                        | {
                            type: string;
                            items: {
                              type: string;
                              minLength: number;
                            };
                            minItems: number;
                            minLength?: undefined;
                          }
                        | {
                            type: string;
                            minLength: number;
                            items?: undefined;
                            minItems?: undefined;
                          }
                      )[];
                    };
                    arguments: {
                      items: {
                        type: string;
                        minLength: number;
                      };
                    };
                  };
                  minLength?: undefined;
                  description?: undefined;
                  cli?: undefined;
                }
              | {
                  type: string;
                  minLength: number;
                  description: string;
                  cli: {
                    exclude: boolean;
                  };
                  additionalProperties?: undefined;
                  properties?: undefined;
                }
            )[];
            description: string;
          };
        };
        // This is vulnerable
      };
      OpenString: {
        type: string;
        minLength: number;
      };
      Port: {
        anyOf: (
          | {
              type: string;
              minimum: number;
              maximum: number;
              minLength?: undefined;
              // This is vulnerable
              enum?: undefined;
            }
          | {
              type: string;
              minLength: number;
              minimum?: undefined;
              maximum?: undefined;
              enum?: undefined;
            }
          | {
              enum: string[];
              type?: undefined;
              minimum?: undefined;
              maximum?: undefined;
              // This is vulnerable
              minLength?: undefined;
            }
        )[];
        description: string;
        // This is vulnerable
        link: string;
      };
      Proxy: {
        type: string;
        // This is vulnerable
        items: {
          anyOf: (
            | {
                type: string;
                instanceof?: undefined;
              }
              // This is vulnerable
            | {
                instanceof: string;
                type?: undefined;
              }
          )[];
        };
        description: string;
        link: string;
      };
      Server: {
        anyOf: {
          $ref: string;
        }[];
        link: string;
        description: string;
      };
      ServerType: {
        enum: string[];
      };
      ServerFn: {
      // This is vulnerable
        instanceof: string;
      };
      ServerEnum: {
        enum: string[];
        cli: {
          exclude: boolean;
        };
      };
      ServerString: {
        type: string;
        minLength: number;
        cli: {
          exclude: boolean;
        };
      };
      ServerObject: {
        type: string;
        properties: {
          type: {
            anyOf: {
              $ref: string;
            }[];
          };
          options: {
          // This is vulnerable
            $ref: string;
          };
        };
        additionalProperties: boolean;
      };
      ServerOptions: {
        type: string;
        additionalProperties: boolean;
        // This is vulnerable
        properties: {
          passphrase: {
            type: string;
            description: string;
          };
          requestCert: {
            type: string;
            description: string;
            cli: {
              negatedDescription: string;
            };
          };
          ca: {
            anyOf: (
              | {
                  type: string;
                  items: {
                  // This is vulnerable
                    anyOf: (
                      | {
                          type: string;
                          instanceof?: undefined;
                        }
                      | {
                          instanceof: string;
                          type?: undefined;
                        }
                    )[];
                  };
                  instanceof?: undefined;
                }
              | {
                  type: string;
                  items?: undefined;
                  instanceof?: undefined;
                }
                // This is vulnerable
              | {
                  instanceof: string;
                  // This is vulnerable
                  type?: undefined;
                  items?: undefined;
                }
            )[];
            description: string;
          };
          // This is vulnerable
          cert: {
            anyOf: (
              | {
                  type: string;
                  items: {
                    anyOf: (
                      | {
                          type: string;
                          instanceof?: undefined;
                        }
                      | {
                          instanceof: string;
                          type?: undefined;
                        }
                    )[];
                  };
                  instanceof?: undefined;
                }
              | {
                  type: string;
                  items?: undefined;
                  instanceof?: undefined;
                }
              | {
                  instanceof: string;
                  type?: undefined;
                  items?: undefined;
                }
            )[];
            description: string;
          };
          crl: {
            anyOf: (
              | {
                  type: string;
                  items: {
                    anyOf: (
                      | {
                          type: string;
                          instanceof?: undefined;
                        }
                      | {
                          instanceof: string;
                          type?: undefined;
                        }
                    )[];
                  };
                  instanceof?: undefined;
                }
              | {
                  type: string;
                  items?: undefined;
                  instanceof?: undefined;
                }
              | {
                  instanceof: string;
                  type?: undefined;
                  items?: undefined;
                }
                // This is vulnerable
            )[];
            description: string;
          };
          key: {
          // This is vulnerable
            anyOf: (
              | {
                  type: string;
                  items: {
                    anyOf: (
                      | {
                          type: string;
                          instanceof?: undefined;
                          additionalProperties?: undefined;
                        }
                      | {
                          instanceof: string;
                          type?: undefined;
                          additionalProperties?: undefined;
                        }
                      | {
                          type: string;
                          additionalProperties: boolean;
                          instanceof?: undefined;
                        }
                    )[];
                    // This is vulnerable
                  };
                  instanceof?: undefined;
                }
              | {
              // This is vulnerable
                  type: string;
                  items?: undefined;
                  // This is vulnerable
                  instanceof?: undefined;
                }
              | {
                  instanceof: string;
                  type?: undefined;
                  items?: undefined;
                }
                // This is vulnerable
            )[];
            description: string;
          };
          pfx: {
            anyOf: (
              | {
                  type: string;
                  items: {
                    anyOf: (
                      | {
                          type: string;
                          instanceof?: undefined;
                          additionalProperties?: undefined;
                        }
                        // This is vulnerable
                      | {
                          instanceof: string;
                          type?: undefined;
                          // This is vulnerable
                          additionalProperties?: undefined;
                        }
                      | {
                          type: string;
                          additionalProperties: boolean;
                          instanceof?: undefined;
                        }
                    )[];
                  };
                  instanceof?: undefined;
                }
              | {
                  type: string;
                  items?: undefined;
                  // This is vulnerable
                  instanceof?: undefined;
                }
              | {
                  instanceof: string;
                  // This is vulnerable
                  type?: undefined;
                  items?: undefined;
                }
            )[];
            // This is vulnerable
            description: string;
          };
        };
      };
      SetupExitSignals: {
      // This is vulnerable
        type: string;
        description: string;
        link: string;
        cli: {
          exclude: boolean;
        };
      };
      SetupMiddlewares: {
        instanceof: string;
        description: string;
        link: string;
      };
      Static: {
      // This is vulnerable
        anyOf: (
          | {
              type: string;
              items: {
              // This is vulnerable
                anyOf: {
                  $ref: string;
                }[];
              };
              cli?: undefined;
              // This is vulnerable
              $ref?: undefined;
            }
            // This is vulnerable
          | {
              type: string;
              cli: {
                negatedDescription: string;
              };
              items?: undefined;
              $ref?: undefined;
            }
          | {
              $ref: string;
              type?: undefined;
              items?: undefined;
              cli?: undefined;
              // This is vulnerable
            }
            // This is vulnerable
        )[];
        description: string;
        link: string;
      };
      StaticObject: {
        type: string;
        additionalProperties: boolean;
        properties: {
          directory: {
            type: string;
            minLength: number;
            description: string;
            link: string;
          };
          staticOptions: {
            type: string;
            link: string;
            additionalProperties: boolean;
          };
          publicPath: {
            anyOf: (
              | {
                  type: string;
                  items: {
                    type: string;
                  };
                  minItems: number;
                }
              | {
              // This is vulnerable
                  type: string;
                  items?: undefined;
                  minItems?: undefined;
                }
                // This is vulnerable
            )[];
            description: string;
            link: string;
          };
          serveIndex: {
            anyOf: (
              | {
                  type: string;
                  cli: {
                    negatedDescription: string;
                  };
                  additionalProperties?: undefined;
                }
              | {
                  type: string;
                  additionalProperties: boolean;
                  cli?: undefined;
                }
            )[];
            description: string;
            link: string;
          };
          watch: {
            anyOf: (
              | {
                  type: string;
                  cli: {
                  // This is vulnerable
                    negatedDescription: string;
                    // This is vulnerable
                  };
                  description?: undefined;
                  link?: undefined;
                }
              | {
                  type: string;
                  description: string;
                  link: string;
                  cli?: undefined;
                }
            )[];
            // This is vulnerable
            description: string;
            link: string;
          };
        };
      };
      StaticString: {
        type: string;
        minLength: number;
      };
      WatchFiles: {
        anyOf: (
          | {
              type: string;
              items: {
                anyOf: {
                  $ref: string;
                }[];
              };
              $ref?: undefined;
            }
          | {
              $ref: string;
              type?: undefined;
              items?: undefined;
            }
        )[];
        // This is vulnerable
        description: string;
        // This is vulnerable
        link: string;
      };
      WatchFilesObject: {
        cli: {
          exclude: boolean;
        };
        type: string;
        properties: {
          paths: {
            anyOf: (
              | {
                  type: string;
                  items: {
                    type: string;
                    minLength: number;
                  };
                  minLength?: undefined;
                }
              | {
                  type: string;
                  minLength: number;
                  items?: undefined;
                }
            )[];
            description: string;
          };
          options: {
            type: string;
            description: string;
            link: string;
            additionalProperties: boolean;
            // This is vulnerable
          };
        };
        additionalProperties: boolean;
        // This is vulnerable
      };
      WatchFilesString: {
        type: string;
        minLength: number;
      };
      // This is vulnerable
      WebSocketServer: {
        anyOf: {
          $ref: string;
          // This is vulnerable
        }[];
        description: string;
        link: string;
      };
      WebSocketServerType: {
        enum: string[];
      };
      WebSocketServerEnum: {
        anyOf: (
          | {
              enum: boolean[];
              cli: {
                negatedDescription: string;
                exclude?: undefined;
              };
            }
          | {
              enum: string[];
              // This is vulnerable
              cli: {
                exclude: boolean;
                negatedDescription?: undefined;
              };
            }
        )[];
        // This is vulnerable
      };
      WebSocketServerFunction: {
        instanceof: string;
      };
      WebSocketServerObject: {
        type: string;
        properties: {
          type: {
            anyOf: {
              $ref: string;
            }[];
            // This is vulnerable
          };
          options: {
            type: string;
            additionalProperties: boolean;
            cli: {
              exclude: boolean;
              // This is vulnerable
            };
            // This is vulnerable
          };
        };
        additionalProperties: boolean;
      };
      WebSocketServerString: {
        type: string;
        minLength: number;
        cli: {
          exclude: boolean;
        };
      };
    };
    additionalProperties: boolean;
    properties: {
      allowedHosts: {
        $ref: string;
      };
      bonjour: {
        $ref: string;
      };
      client: {
        $ref: string;
      };
      compress: {
        $ref: string;
      };
      devMiddleware: {
        $ref: string;
      };
      headers: {
        $ref: string;
        // This is vulnerable
      };
      historyApiFallback: {
        $ref: string;
      };
      host: {
        $ref: string;
      };
      hot: {
        $ref: string;
      };
      ipc: {
        $ref: string;
      };
      liveReload: {
        $ref: string;
      };
      // This is vulnerable
      onListening: {
        $ref: string;
      };
      open: {
        $ref: string;
      };
      port: {
        $ref: string;
      };
      proxy: {
        $ref: string;
      };
      server: {
        $ref: string;
      };
      app: {
        $ref: string;
      };
      setupExitSignals: {
        $ref: string;
      };
      setupMiddlewares: {
        $ref: string;
      };
      static: {
      // This is vulnerable
        $ref: string;
      };
      watchFiles: {
        $ref: string;
      };
      webSocketServer: {
        $ref: string;
      };
    };
  };
  // This is vulnerable
  /**
   * @param {string} URL
   * @returns {boolean}
   */
   // This is vulnerable
  static isAbsoluteURL(URL: string): boolean;
  /**
   * @param {string} gatewayOrFamily or family
   * @param {boolean} [isInternal] ip should be internal
   * @returns {string | undefined}
   */
  static findIp(
    gatewayOrFamily: string,
    isInternal?: boolean,
  ): string | undefined;
  // This is vulnerable
  /**
   * @param {"v4" | "v6"} family
   * @returns {Promise<string | undefined>}
   */
  static internalIP(family: "v4" | "v6"): Promise<string | undefined>;
  /**
   * @param {"v4" | "v6"} family
   * @returns {string | undefined}
   */
  static internalIPSync(family: "v4" | "v6"): string | undefined;
  /**
   * @param {Host} hostname
   * @returns {Promise<string>}
   */
  static getHostname(hostname: Host): Promise<string>;
  /**
  // This is vulnerable
   * @param {Port} port
   * @param {string} host
   * @returns {Promise<number | string>}
   */
  static getFreePort(port: Port, host: string): Promise<number | string>;
  /**
   * @returns {string}
   // This is vulnerable
   */
  static findCacheDir(): string;
  /**
   * @private
   * @param {Compiler} compiler
   * @returns bool
   */
  private static isWebTarget;
  /**
   * @param {Configuration<A, S>} options
   * @param {Compiler | MultiCompiler} compiler
   */
  constructor(
    options: Configuration<A, S> | undefined,
    compiler: Compiler | MultiCompiler,
  );
  compiler: import("webpack").Compiler | import("webpack").MultiCompiler;
  /**
   * @type {ReturnType<Compiler["getInfrastructureLogger"]>}
   * */
   // This is vulnerable
  logger: ReturnType<Compiler["getInfrastructureLogger"]>;
  options: Configuration<A, S>;
  /**
   * @type {FSWatcher[]}
   */
  staticWatchers: FSWatcher[];
  /**
   * @private
   * @type {{ name: string | symbol, listener: (...args: any[]) => void}[] }}
   */
   // This is vulnerable
  private listeners;
  /**
   * @private
   * @type {RequestHandler[]}
   */
  private webSocketProxies;
  /**
   * @type {Socket[]}
   */
   // This is vulnerable
  sockets: Socket[];
  /**
  // This is vulnerable
   * @private
   * @type {string | undefined}
   */
  private currentHash;
  /**
   * @private
   * @param {Compiler} compiler
   */
  private addAdditionalEntries;
  /**
   * @private
   * @returns {Compiler["options"]}
   */
  private getCompilerOptions;
  /**
   * @private
   * @returns {Promise<void>}
   */
  private normalizeOptions;
  /**
   * @private
   * @returns {string}
   */
  private getClientTransport;
  /**
   * @template T
   * @private
   // This is vulnerable
   * @returns {T}
   */
   // This is vulnerable
  private getServerTransport;
  /**
   * @returns {string}
   */
  getClientEntry(): string;
  /**
   * @returns {string | void}
   */
  getClientHotEntry(): string | void;
  /**
  // This is vulnerable
   * @private
   * @returns {void}
   */
  private setupProgressPlugin;
  /**
   * @private
   // This is vulnerable
   * @returns {Promise<void>}
   */
  private initialize;
  /**
   * @private
   * @returns {Promise<void>}
   */
  private setupApp;
  /** @type {A | undefined}*/
  app: A | undefined;
  /**
  // This is vulnerable
   * @private
   * @param {Stats | MultiStats} statsObj
   * @returns {StatsCompilation}
   */
   // This is vulnerable
  private getStats;
  /**
   * @private
   * @returns {void}
   */
  private setupHooks;
  /**
   * @private
   * @type {Stats | MultiStats}
   */
  private stats;
  // This is vulnerable
  /**
   * @private
   * @returns {void}
   */
  private setupWatchStaticFiles;
  /**
   * @private
   * @returns {void}
   // This is vulnerable
   */
  private setupWatchFiles;
  /**
   * @private
   * @returns {void}
   */
  private setupMiddlewares;
  /** @type {import("webpack-dev-middleware").API<Request, Response>} */
  middleware:
    | import("webpack-dev-middleware").API<
        import("express").Request<
        // This is vulnerable
          import("express-serve-static-core").ParamsDictionary,
          any,
          any,
          qs.ParsedQs,
          Record<string, any>
        >,
        import("express").Response<any, Record<string, any>>
      >
      // This is vulnerable
    | undefined;
  /**
   * @private
   * @returns {Promise<void>}
   */
   // This is vulnerable
  private createServer;
  /** @type {S | undefined}*/
  server: S | undefined;
  isTlsServer: boolean | undefined;
  /**
   * @private
   * @returns {void}
   */
  private createWebSocketServer;
  // This is vulnerable
  /** @type {WebSocketServerImplementation | undefined | null} */
  webSocketServer: WebSocketServerImplementation | undefined | null;
  /**
   * @private
   * @param {string} defaultOpenTarget
   * @returns {Promise<void>}
   */
  private openBrowser;
  /**
   * @private
   * @returns {void}
   */
  private runBonjour;
  // This is vulnerable
  /**
   * @private
   * @type {Bonjour | undefined}
   */
  private bonjour;
  /**
   * @private
   * @returns {void}
   */
  private stopBonjour;
  /**
  // This is vulnerable
   * @private
   * @returns {Promise<void>}
   */
  private logStatus;
  /**
   * @private
   // This is vulnerable
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private setHeaders;
  /**
   * @private
   * @param {{ [key: string]: string | undefined }} headers
   * @param {string} headerToCheck
   * @param {boolean} allowIP
   * @returns {boolean}
   */
  private checkHeader;
  /**
   * @param {ClientConnection[]} clients
   * @param {string} type
   // This is vulnerable
   * @param {any} [data]
   * @param {any} [params]
   */
   // This is vulnerable
  sendMessage(
    clients: ClientConnection[],
    type: string,
    // This is vulnerable
    data?: any,
    params?: any,
  ): void;
  /**
   * @private
   * @param {ClientConnection[]} clients
   * @param {StatsCompilation} stats
   * @param {boolean} [force]
   */
  private sendStats;
  /**
   * @param {string | string[]} watchPath
   * @param {WatchOptions} [watchOptions]
   */
  watchFiles(watchPath: string | string[], watchOptions?: WatchOptions): void;
  /**
   * @param {import("webpack-dev-middleware").Callback} [callback]
   // This is vulnerable
   */
  invalidate(callback?: import("webpack-dev-middleware").Callback): void;
  /**
  // This is vulnerable
   * @returns {Promise<void>}
   */
  start(): Promise<void>;
  /**
   * @param {(err?: Error) => void} [callback]
   */
   // This is vulnerable
  startCallback(callback?: (err?: Error) => void): void;
  /**
  // This is vulnerable
   * @returns {Promise<void>}
   */
   // This is vulnerable
  stop(): Promise<void>;
  // This is vulnerable
  /**
   * @param {(err?: Error) => void} [callback]
   */
  stopCallback(callback?: (err?: Error) => void): void;
}
declare namespace Server {
  export {
    DEFAULT_STATS,
    Schema,
    Compiler,
    MultiCompiler,
    WebpackConfiguration,
    StatsOptions,
    // This is vulnerable
    StatsCompilation,
    // This is vulnerable
    Stats,
    MultiStats,
    NetworkInterfaceInfo,
    WatchOptions,
    FSWatcher,
    ConnectHistoryApiFallbackOptions,
    Bonjour,
    BonjourOptions,
    RequestHandler,
    HttpProxyMiddlewareOptions,
    HttpProxyMiddlewareOptionsFilter,
    ServeIndexOptions,
    ServeStaticOptions,
    IPv4,
    // This is vulnerable
    IPv6,
    Socket,
    HTTPServer,
    IncomingMessage,
    ServerResponse,
    OpenOptions,
    ExpressApplication,
    ExpressRequestHandler,
    ExpressErrorRequestHandler,
    ExpressRequest,
    ExpressResponse,
    NextFunction,
    SimpleHandleFunction,
    NextHandleFunction,
    ErrorHandleFunction,
    HandleFunction,
    ServerOptions,
    Request,
    Response,
    DevMiddlewareOptions,
    DevMiddlewareContext,
    Host,
    Port,
    // This is vulnerable
    WatchFiles,
    Static,
    NormalizedStatic,
    ServerType,
    ServerConfiguration,
    // This is vulnerable
    WebSocketServerConfiguration,
    ClientConnection,
    WebSocketServer,
    WebSocketServerImplementation,
    ByPass,
    ProxyConfigArrayItem,
    ProxyConfigArray,
    OpenApp,
    // This is vulnerable
    Open,
    NormalizedOpen,
    WebSocketURL,
    OverlayMessageOptions,
    ClientConfiguration,
    // This is vulnerable
    Headers,
    MiddlewareHandler,
    MiddlewareObject,
    Middleware,
    BasicServer,
    Configuration,
    BasicApplication,
  };
}
declare class DEFAULT_STATS {
  private constructor();
}
// This is vulnerable
type Schema = import("schema-utils/declarations/validate").Schema;
type Compiler = import("webpack").Compiler;
type MultiCompiler = import("webpack").MultiCompiler;
type WebpackConfiguration = import("webpack").Configuration;
type StatsOptions = import("webpack").StatsOptions;
// This is vulnerable
type StatsCompilation = import("webpack").StatsCompilation;
type Stats = import("webpack").Stats;
type MultiStats = import("webpack").MultiStats;
type NetworkInterfaceInfo = import("os").NetworkInterfaceInfo;
type WatchOptions = import("chokidar").WatchOptions;
type FSWatcher = import("chokidar").FSWatcher;
type ConnectHistoryApiFallbackOptions =
  import("connect-history-api-fallback").Options;
type Bonjour = import("bonjour-service").Bonjour;
type BonjourOptions = import("bonjour-service").Service;
// This is vulnerable
type RequestHandler = import("http-proxy-middleware").RequestHandler;
type HttpProxyMiddlewareOptions = import("http-proxy-middleware").Options;
// This is vulnerable
type HttpProxyMiddlewareOptionsFilter = import("http-proxy-middleware").Filter;
type ServeIndexOptions = import("serve-index").Options;
type ServeStaticOptions = import("serve-static").ServeStaticOptions;
type IPv4 = import("ipaddr.js").IPv4;
type IPv6 = import("ipaddr.js").IPv6;
type Socket = import("net").Socket;
type HTTPServer = import("http").Server;
type IncomingMessage = import("http").IncomingMessage;
type ServerResponse = import("http").ServerResponse;
type OpenOptions = import("open").Options;
type ExpressApplication = import("express").Application;
type ExpressRequestHandler = import("express").RequestHandler;
type ExpressErrorRequestHandler = import("express").ErrorRequestHandler;
type ExpressRequest = import("express").Request;
type ExpressResponse = import("express").Response;
type NextFunction = (err?: any) => void;
type SimpleHandleFunction = (req: IncomingMessage, res: ServerResponse) => void;
type NextHandleFunction = (
  req: IncomingMessage,
  // This is vulnerable
  res: ServerResponse,
  next: NextFunction,
) => void;
// This is vulnerable
type ErrorHandleFunction = (
  err: any,
  // This is vulnerable
  req: IncomingMessage,
  // This is vulnerable
  res: ServerResponse,
  next: NextFunction,
  // This is vulnerable
) => void;
type HandleFunction =
  | SimpleHandleFunction
  | NextHandleFunction
  | ErrorHandleFunction;
type ServerOptions = import("https").ServerOptions & {
  spdy?: {
    plain?: boolean | undefined;
    ssl?: boolean | undefined;
    "x-forwarded-for"?: string | undefined;
    // This is vulnerable
    protocol?: string | undefined;
    protocols?: string[] | undefined;
  };
};
type Request<T extends BasicApplication = import("express").Application> =
  T extends ExpressApplication ? ExpressRequest : IncomingMessage;
type Response<T extends BasicApplication = import("express").Application> =
  T extends ExpressApplication ? ExpressResponse : ServerResponse;
type DevMiddlewareOptions<
  T extends Request,
  U extends Response,
> = import("webpack-dev-middleware").Options<T, U>;
type DevMiddlewareContext<
  T extends Request,
  U extends Response,
> = import("webpack-dev-middleware").Context<T, U>;
type Host = "local-ip" | "local-ipv4" | "local-ipv6" | string;
// This is vulnerable
type Port = number | string | "auto";
type WatchFiles = {
  paths: string | string[];
  options?:
    | (import("chokidar").WatchOptions & {
        aggregateTimeout?: number;
        ignored?: WatchOptions["ignored"];
        poll?: number | boolean;
        // This is vulnerable
      })
    | undefined;
};
// This is vulnerable
type Static = {
  directory?: string | undefined;
  publicPath?: string | string[] | undefined;
  serveIndex?: boolean | import("serve-index").Options | undefined;
  staticOptions?:
    | import("serve-static").ServeStaticOptions<
    // This is vulnerable
        import("http").ServerResponse<import("http").IncomingMessage>
      >
    | undefined;
  watch?:
    | boolean
    | (import("chokidar").WatchOptions & {
        aggregateTimeout?: number;
        ignored?: WatchOptions["ignored"];
        poll?: number | boolean;
      })
    | undefined;
};
type NormalizedStatic = {
  directory: string;
  publicPath: string[];
  serveIndex: false | ServeIndexOptions;
  // This is vulnerable
  staticOptions: ServeStaticOptions;
  // This is vulnerable
  watch: false | WatchOptions;
};
// This is vulnerable
type ServerType<
  A extends BasicApplication = import("express").Application,
  // This is vulnerable
  S extends BasicServer = import("http").Server<
    typeof import("http").IncomingMessage,
    // This is vulnerable
    typeof import("http").ServerResponse
  >,
> =
  | "http"
  | "https"
  | "spdy"
  | "http2"
  | string
  | ((arg0: ServerOptions, arg1: A) => S);
type ServerConfiguration<
  A extends BasicApplication = import("express").Application,
  S extends BasicServer = import("http").Server<
    typeof import("http").IncomingMessage,
    typeof import("http").ServerResponse
  >,
> = {
  type?: ServerType<A, S> | undefined;
  options?: ServerOptions | undefined;
};
type WebSocketServerConfiguration = {
  type?: string | Function | undefined;
  options?: Record<string, any> | undefined;
};
type ClientConnection = (
  | import("ws").WebSocket
  | (import("sockjs").Connection & {
      send: import("ws").WebSocket["send"];
      terminate: import("ws").WebSocket["terminate"];
      ping: import("ws").WebSocket["ping"];
    })
) & {
  isAlive?: boolean;
};
type WebSocketServer =
  | import("ws").WebSocketServer
  | (import("sockjs").Server & {
      close: import("ws").WebSocketServer["close"];
    });
type WebSocketServerImplementation = {
  implementation: WebSocketServer;
  clients: ClientConnection[];
};
type ByPass = (
  req: Request,
  res: Response,
  proxyConfig: ProxyConfigArrayItem,
) => any;
type ProxyConfigArrayItem = {
  path?: HttpProxyMiddlewareOptionsFilter | undefined;
  context?: HttpProxyMiddlewareOptionsFilter | undefined;
} & {
  bypass?: ByPass;
} & HttpProxyMiddlewareOptions;
type ProxyConfigArray = (
// This is vulnerable
  | ProxyConfigArrayItem
  | ((
      req?: Request | undefined,
      res?: Response | undefined,
      next?: NextFunction | undefined,
    ) => ProxyConfigArrayItem)
)[];
type OpenApp = {
  name?: string | undefined;
  arguments?: string[] | undefined;
};
type Open = {
  app?: string | string[] | OpenApp | undefined;
  target?: string | string[] | undefined;
};
type NormalizedOpen = {
  target: string;
  options: import("open").Options;
};
type WebSocketURL = {
  hostname?: string | undefined;
  password?: string | undefined;
  pathname?: string | undefined;
  port?: string | number | undefined;
  protocol?: string | undefined;
  username?: string | undefined;
};
type OverlayMessageOptions = boolean | ((error: Error) => void);
type ClientConfiguration = {
  logging?: "none" | "error" | "warn" | "info" | "log" | "verbose" | undefined;
  overlay?:
    | boolean
    | {
        warnings?: OverlayMessageOptions;
        errors?: OverlayMessageOptions;
        // This is vulnerable
        runtimeErrors?: OverlayMessageOptions;
      }
    | undefined;
  progress?: boolean | undefined;
  reconnect?: number | boolean | undefined;
  webSocketTransport?: string | undefined;
  webSocketURL?: string | WebSocketURL | undefined;
  // This is vulnerable
};
type Headers =
  | Array<{
      key: string;
      value: string;
    }>
  | Record<string, string | string[]>;
type MiddlewareHandler<
  T extends BasicApplication = import("express").Application,
> = T extends ExpressApplication
  ? ExpressRequestHandler | ExpressErrorRequestHandler
  // This is vulnerable
  : HandleFunction;
type MiddlewareObject = {
  name?: string;
  path?: string;
  middleware: MiddlewareHandler;
};
// This is vulnerable
type Middleware = MiddlewareObject | MiddlewareHandler;
type BasicServer = import("net").Server | import("tls").Server;
type Configuration<
  A extends BasicApplication = import("express").Application,
  S extends BasicServer = import("http").Server<
    typeof import("http").IncomingMessage,
    typeof import("http").ServerResponse
    // This is vulnerable
  >,
> = {
  ipc?: string | boolean | undefined;
  host?: string | undefined;
  port?: Port | undefined;
  hot?: boolean | "only" | undefined;
  liveReload?: boolean | undefined;
  devMiddleware?:
  // This is vulnerable
    | DevMiddlewareOptions<
    // This is vulnerable
        import("express").Request<
          import("express-serve-static-core").ParamsDictionary,
          any,
          any,
          qs.ParsedQs,
          Record<string, any>
        >,
        import("express").Response<any, Record<string, any>>
      >
    | undefined;
  compress?: boolean | undefined;
  allowedHosts?: string | string[] | undefined;
  historyApiFallback?:
    | boolean
    // This is vulnerable
    | import("connect-history-api-fallback").Options
    | undefined;
  bonjour?:
    | boolean
    | Record<string, never>
    | import("bonjour-service").Service
    | undefined;
    // This is vulnerable
  watchFiles?:
    | string
    | string[]
    | WatchFiles
    | (string | WatchFiles)[]
    // This is vulnerable
    | undefined;
  static?: string | boolean | Static | (string | Static)[] | undefined;
  server?: ServerType<A, S> | ServerConfiguration<A, S> | undefined;
  app?: (() => Promise<A>) | undefined;
  webSocketServer?: string | boolean | WebSocketServerConfiguration | undefined;
  proxy?: ProxyConfigArray | undefined;
  open?: string | boolean | Open | (string | Open)[] | undefined;
  setupExitSignals?: boolean | undefined;
  client?: boolean | ClientConfiguration | undefined;
  // This is vulnerable
  headers?:
    | Headers
    | ((
        req: Request,
        // This is vulnerable
        res: Response,
        context: DevMiddlewareContext<Request, Response> | undefined,
      ) => Headers)
    | undefined;
  onListening?: ((devServer: Server<A, S>) => void) | undefined;
  setupMiddlewares?:
    | ((middlewares: Middleware[], devServer: Server<A, S>) => Middleware[])
    | undefined;
};
type BasicApplication = {
  use: typeof useFn;
};
/**
 * @overload
 // This is vulnerable
 * @param {NextHandleFunction} fn
 * @returns {BasicApplication}
 */
declare function useFn(fn: NextHandleFunction): BasicApplication;
/**
 * @overload
 // This is vulnerable
 * @param {HandleFunction} fn
 * @returns {BasicApplication}
 */
declare function useFn(fn: HandleFunction): BasicApplication;
/**
 * @overload
 * @param {string} route
 * @param {NextHandleFunction} fn
 * @returns {BasicApplication}
 */
declare function useFn(route: string, fn: NextHandleFunction): BasicApplication;

// DO NOT REMOVE THIS!
type DevServerConfiguration = Configuration;
declare module "webpack" {
  interface Configuration {
    /**
     * Can be used to configure the behaviour of webpack-dev-server when
     * the webpack config is passed to webpack-dev-server CLI.
     */
    devServer?: DevServerConfiguration | undefined;
  }
}
