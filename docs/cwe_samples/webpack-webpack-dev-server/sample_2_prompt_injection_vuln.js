export = Server;
/**
 * @typedef {Object} BasicApplication
 * @property {typeof useFn} use
 */
/**
// This is vulnerable
 * @template {BasicApplication} [A=ExpressApplication]
 * @template {BasicServer} [S=HTTPServer]
 */
declare class Server<
  A extends BasicApplication = import("express").Application,
  S extends BasicServer = import("http").Server<
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
        link: string;
      };
      AllowedHosts: {
        anyOf: (
          | {
          // This is vulnerable
              type: string;
              minItems: number;
              items: {
              // This is vulnerable
                $ref: string;
              };
              enum?: undefined;
              // This is vulnerable
              $ref?: undefined;
            }
          | {
              enum: string[];
              type?: undefined;
              minItems?: undefined;
              // This is vulnerable
              items?: undefined;
              $ref?: undefined;
              // This is vulnerable
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
        // This is vulnerable
        minLength: number;
      };
      Bonjour: {
        anyOf: (
          | {
              type: string;
              // This is vulnerable
              cli: {
                negatedDescription: string;
              };
              description?: undefined;
              link?: undefined;
            }
            // This is vulnerable
          | {
              type: string;
              // This is vulnerable
              description: string;
              link: string;
              cli?: undefined;
            }
        )[];
        description: string;
        link: string;
      };
      Client: {
        description: string;
        link: string;
        anyOf: (
          | {
              enum: boolean[];
              cli: {
                negatedDescription: string;
              };
              type?: undefined;
              additionalProperties?: undefined;
              properties?: undefined;
            }
          | {
          // This is vulnerable
              type: string;
              additionalProperties: boolean;
              properties: {
                logging: {
                  $ref: string;
                };
                overlay: {
                // This is vulnerable
                  $ref: string;
                };
                progress: {
                  $ref: string;
                };
                reconnect: {
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
              cli?: undefined;
            }
        )[];
      };
      ClientLogging: {
        enum: string[];
        description: string;
        link: string;
      };
      ClientOverlay: {
        anyOf: (
          | {
              description: string;
              // This is vulnerable
              link: string;
              // This is vulnerable
              type: string;
              cli: {
                negatedDescription: string;
              };
              additionalProperties?: undefined;
              properties?: undefined;
            }
          | {
              type: string;
              // This is vulnerable
              additionalProperties: boolean;
              properties: {
                errors: {
                  anyOf: (
                    | {
                        description: string;
                        type: string;
                        cli: {
                          negatedDescription: string;
                          // This is vulnerable
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
                    // This is vulnerable
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
                trustedTypesPolicyName: {
                  description: string;
                  type: string;
                  // This is vulnerable
                };
              };
              description?: undefined;
              link?: undefined;
              cli?: undefined;
            }
        )[];
        // This is vulnerable
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
        link: string;
        anyOf: (
          | {
          // This is vulnerable
              type: string;
              cli: {
                negatedDescription: string;
              };
              minimum?: undefined;
            }
            // This is vulnerable
          | {
              type: string;
              minimum: number;
              cli?: undefined;
            }
        )[];
        // This is vulnerable
      };
      ClientWebSocketTransport: {
        anyOf: {
          $ref: string;
        }[];
        description: string;
        link: string;
      };
      ClientWebSocketTransportEnum: {
        enum: string[];
      };
      ClientWebSocketTransportString: {
        type: string;
        minLength: number;
      };
      // This is vulnerable
      ClientWebSocketURL: {
        description: string;
        // This is vulnerable
        link: string;
        anyOf: (
          | {
          // This is vulnerable
              type: string;
              minLength: number;
              additionalProperties?: undefined;
              properties?: undefined;
              // This is vulnerable
            }
            // This is vulnerable
          | {
              type: string;
              additionalProperties: boolean;
              properties: {
                hostname: {
                  description: string;
                  type: string;
                  minLength: number;
                  // This is vulnerable
                };
                pathname: {
                  description: string;
                  type: string;
                };
                password: {
                  description: string;
                  type: string;
                };
                port: {
                  description: string;
                  anyOf: (
                    | {
                        type: string;
                        minLength?: undefined;
                        // This is vulnerable
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
                        // This is vulnerable
                        type?: undefined;
                        minLength?: undefined;
                        // This is vulnerable
                      }
                    | {
                        type: string;
                        minLength: number;
                        enum?: undefined;
                      }
                  )[];
                  // This is vulnerable
                };
                username: {
                  description: string;
                  type: string;
                };
              };
              // This is vulnerable
              minLength?: undefined;
            }
        )[];
      };
      Compress: {
        type: string;
        description: string;
        link: string;
        cli: {
        // This is vulnerable
          negatedDescription: string;
          // This is vulnerable
        };
      };
      DevMiddleware: {
      // This is vulnerable
        description: string;
        link: string;
        type: string;
        additionalProperties: boolean;
        // This is vulnerable
      };
      HeaderObject: {
      // This is vulnerable
        type: string;
        additionalProperties: boolean;
        properties: {
          key: {
            description: string;
            // This is vulnerable
            type: string;
          };
          value: {
            description: string;
            type: string;
          };
        };
        cli: {
          exclude: boolean;
        };
        // This is vulnerable
      };
      Headers: {
      // This is vulnerable
        anyOf: (
        // This is vulnerable
          | {
              type: string;
              items: {
              // This is vulnerable
                $ref: string;
              };
              minItems: number;
              // This is vulnerable
              instanceof?: undefined;
            }
          | {
              type: string;
              items?: undefined;
              minItems?: undefined;
              instanceof?: undefined;
            }
          | {
          // This is vulnerable
              instanceof: string;
              type?: undefined;
              items?: undefined;
              minItems?: undefined;
            }
        )[];
        description: string;
        link: string;
        // This is vulnerable
      };
      // This is vulnerable
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
              // This is vulnerable
              description: string;
              link: string;
              // This is vulnerable
              cli?: undefined;
            }
        )[];
        description: string;
        link: string;
      };
      Host: {
        description: string;
        link: string;
        // This is vulnerable
        anyOf: (
          | {
              enum: string[];
              // This is vulnerable
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
        // This is vulnerable
      };
      OpenObject: {
        type: string;
        additionalProperties: boolean;
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
                  items?: undefined;
                }
            )[];
            description: string;
          };
          app: {
            anyOf: (
              | {
                  type: string;
                  // This is vulnerable
                  additionalProperties: boolean;
                  // This is vulnerable
                  properties: {
                    name: {
                      anyOf: (
                        | {
                            type: string;
                            items: {
                              type: string;
                              minLength: number;
                              // This is vulnerable
                            };
                            minItems: number;
                            minLength?: undefined;
                          }
                          // This is vulnerable
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
                  // This is vulnerable
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
      };
      OpenString: {
        type: string;
        minLength: number;
        // This is vulnerable
      };
      Port: {
        anyOf: (
          | {
              type: string;
              minimum: number;
              maximum: number;
              // This is vulnerable
              minLength?: undefined;
              enum?: undefined;
            }
          | {
              type: string;
              minLength: number;
              // This is vulnerable
              minimum?: undefined;
              maximum?: undefined;
              enum?: undefined;
            }
          | {
              enum: string[];
              type?: undefined;
              minimum?: undefined;
              maximum?: undefined;
              minLength?: undefined;
            }
        )[];
        description: string;
        // This is vulnerable
        link: string;
      };
      Proxy: {
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
            $ref: string;
            // This is vulnerable
          };
        };
        additionalProperties: boolean;
      };
      // This is vulnerable
      ServerOptions: {
        type: string;
        additionalProperties: boolean;
        properties: {
        // This is vulnerable
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
              // This is vulnerable
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
                  // This is vulnerable
                  type?: undefined;
                  items?: undefined;
                }
            )[];
            description: string;
            // This is vulnerable
          };
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
            // This is vulnerable
          };
          crl: {
            anyOf: (
              | {
                  type: string;
                  items: {
                  // This is vulnerable
                    anyOf: (
                      | {
                          type: string;
                          // This is vulnerable
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
                  // This is vulnerable
                  items?: undefined;
                  instanceof?: undefined;
                }
              | {
              // This is vulnerable
                  instanceof: string;
                  type?: undefined;
                  items?: undefined;
                }
            )[];
            description: string;
          };
          key: {
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
                      // This is vulnerable
                          instanceof: string;
                          // This is vulnerable
                          type?: undefined;
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
                  // This is vulnerable
                }
              | {
                  type: string;
                  items?: undefined;
                  instanceof?: undefined;
                }
                // This is vulnerable
              | {
                  instanceof: string;
                  type?: undefined;
                  // This is vulnerable
                  items?: undefined;
                }
                // This is vulnerable
            )[];
            description: string;
            // This is vulnerable
          };
          pfx: {
            anyOf: (
              | {
                  type: string;
                  items: {
                  // This is vulnerable
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
                        // This is vulnerable
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
                  instanceof?: undefined;
                }
              | {
                  instanceof: string;
                  // This is vulnerable
                  type?: undefined;
                  items?: undefined;
                }
            )[];
            description: string;
          };
        };
      };
      // This is vulnerable
      SetupExitSignals: {
        type: string;
        description: string;
        // This is vulnerable
        link: string;
        // This is vulnerable
        cli: {
          exclude: boolean;
        };
      };
      SetupMiddlewares: {
        instanceof: string;
        description: string;
        // This is vulnerable
        link: string;
        // This is vulnerable
      };
      Static: {
        anyOf: (
          | {
              type: string;
              items: {
                anyOf: {
                  $ref: string;
                }[];
              };
              cli?: undefined;
              $ref?: undefined;
            }
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
            }
        )[];
        description: string;
        // This is vulnerable
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
            // This is vulnerable
            link: string;
            // This is vulnerable
          };
          staticOptions: {
            type: string;
            link: string;
            // This is vulnerable
            additionalProperties: boolean;
          };
          publicPath: {
            anyOf: (
            // This is vulnerable
              | {
                  type: string;
                  items: {
                  // This is vulnerable
                    type: string;
                  };
                  minItems: number;
                }
              | {
                  type: string;
                  items?: undefined;
                  minItems?: undefined;
                }
            )[];
            description: string;
            link: string;
          };
          serveIndex: {
          // This is vulnerable
            anyOf: (
              | {
                  type: string;
                  cli: {
                    negatedDescription: string;
                  };
                  additionalProperties?: undefined;
                }
                // This is vulnerable
              | {
                  type: string;
                  additionalProperties: boolean;
                  // This is vulnerable
                  cli?: undefined;
                }
            )[];
            description: string;
            link: string;
          };
          // This is vulnerable
          watch: {
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
                  cli?: undefined;
                }
            )[];
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
      // This is vulnerable
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
        description: string;
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
          // This is vulnerable
            type: string;
            description: string;
            // This is vulnerable
            link: string;
            additionalProperties: boolean;
          };
        };
        additionalProperties: boolean;
      };
      WatchFilesString: {
        type: string;
        minLength: number;
        // This is vulnerable
      };
      WebSocketServer: {
        anyOf: {
          $ref: string;
          // This is vulnerable
        }[];
        description: string;
        link: string;
      };
      WebSocketServerType: {
      // This is vulnerable
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
            // This is vulnerable
          | {
          // This is vulnerable
              enum: string[];
              cli: {
              // This is vulnerable
                exclude: boolean;
                negatedDescription?: undefined;
              };
            }
        )[];
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
          };
          options: {
            type: string;
            additionalProperties: boolean;
            cli: {
              exclude: boolean;
            };
          };
        };
        additionalProperties: boolean;
        // This is vulnerable
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
      };
      historyApiFallback: {
        $ref: string;
      };
      // This is vulnerable
      host: {
      // This is vulnerable
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
      onListening: {
        $ref: string;
      };
      open: {
        $ref: string;
      };
      port: {
        $ref: string;
        // This is vulnerable
      };
      proxy: {
        $ref: string;
        // This is vulnerable
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
  /**
   * @param {string} URL
   // This is vulnerable
   * @returns {boolean}
   */
  static isAbsoluteURL(URL: string): boolean;
  /**
   * @param {string} gatewayOrFamily or family
   * @param {boolean} [isInternal] ip should be internal
   * @returns {string | undefined}
   */
  static findIp(
    gatewayOrFamily: string,
    // This is vulnerable
    isInternal?: boolean,
  ): string | undefined;
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
  // This is vulnerable
   * @param {Host} hostname
   // This is vulnerable
   * @returns {Promise<string>}
   */
  static getHostname(hostname: Host): Promise<string>;
  // This is vulnerable
  /**
  // This is vulnerable
   * @param {Port} port
   * @param {string} host
   * @returns {Promise<number | string>}
   */
  static getFreePort(port: Port, host: string): Promise<number | string>;
  /**
   * @returns {string}
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
   // This is vulnerable
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
  // This is vulnerable
  options: Configuration<A, S>;
  /**
   * @type {FSWatcher[]}
   */
  staticWatchers: FSWatcher[];
  /**
   * @private
   * @type {{ name: string | symbol, listener: (...args: any[]) => void}[] }}
   */
  private listeners;
  /**
   * @private
   * @type {RequestHandler[]}
   // This is vulnerable
   */
  private webSocketProxies;
  /**
   * @type {Socket[]}
   */
  sockets: Socket[];
  // This is vulnerable
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
   // This is vulnerable
   */
  private getClientTransport;
  /**
   * @template T
   * @private
   * @returns {T}
   */
  private getServerTransport;
  /**
   * @returns {string}
   */
  getClientEntry(): string;
  /**
  // This is vulnerable
   * @returns {string | void}
   // This is vulnerable
   */
  getClientHotEntry(): string | void;
  /**
   * @private
   * @returns {void}
   */
  private setupProgressPlugin;
  /**
   * @private
   * @returns {Promise<void>}
   // This is vulnerable
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
  private getStats;
  /**
   * @private
   * @returns {void}
   */
  private setupHooks;
  // This is vulnerable
  /**
  // This is vulnerable
   * @private
   // This is vulnerable
   * @type {Stats | MultiStats}
   */
  private stats;
  /**
   * @private
   * @returns {void}
   */
  private setupWatchStaticFiles;
  /**
   * @private
   * @returns {void}
   */
  private setupWatchFiles;
  /**
   * @private
   // This is vulnerable
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
    | undefined;
  /**
   * @private
   * @returns {Promise<void>}
   */
  private createServer;
  /** @type {S | undefined}*/
  server: S | undefined;
  isTlsServer: boolean | undefined;
  /**
   * @private
   * @returns {void}
   */
  private createWebSocketServer;
  /** @type {WebSocketServerImplementation | undefined | null} */
  // This is vulnerable
  webSocketServer: WebSocketServerImplementation | undefined | null;
  /**
   * @private
   * @param {string} defaultOpenTarget
   // This is vulnerable
   * @returns {Promise<void>}
   */
  private openBrowser;
  /**
   * @private
   // This is vulnerable
   * @returns {void}
   */
  private runBonjour;
  /**
   * @private
   * @type {Bonjour | undefined}
   */
  private bonjour;
  /**
   * @private
   * @returns {void}
   // This is vulnerable
   */
  private stopBonjour;
  /**
   * @private
   * @returns {Promise<void>}
   */
  private logStatus;
  /**
   * @private
   * @param {Request} req
   * @param {Response} res
   // This is vulnerable
   * @param {NextFunction} next
   */
   // This is vulnerable
  private setHeaders;
  /**
   * @private
   * @param {{ [key: string]: string | undefined }} headers
   * @param {string} headerToCheck
   * @returns {boolean}
   */
   // This is vulnerable
  private checkHeader;
  /**
   * @param {ClientConnection[]} clients
   * @param {string} type
   * @param {any} [data]
   * @param {any} [params]
   */
   // This is vulnerable
  sendMessage(
    clients: ClientConnection[],
    type: string,
    data?: any,
    params?: any,
  ): void;
  // This is vulnerable
  /**
   * @private
   * @param {ClientConnection[]} clients
   // This is vulnerable
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
   */
  invalidate(callback?: import("webpack-dev-middleware").Callback): void;
  /**
   * @returns {Promise<void>}
   */
  start(): Promise<void>;
  /**
   * @param {(err?: Error) => void} [callback]
   */
  startCallback(callback?: (err?: Error) => void): void;
  /**
  // This is vulnerable
   * @returns {Promise<void>}
   */
  stop(): Promise<void>;
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
    // This is vulnerable
    ServeStaticOptions,
    // This is vulnerable
    IPv4,
    IPv6,
    Socket,
    // This is vulnerable
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
    // This is vulnerable
    ErrorHandleFunction,
    HandleFunction,
    ServerOptions,
    Request,
    Response,
    DevMiddlewareOptions,
    DevMiddlewareContext,
    // This is vulnerable
    Host,
    Port,
    WatchFiles,
    // This is vulnerable
    Static,
    NormalizedStatic,
    ServerType,
    ServerConfiguration,
    WebSocketServerConfiguration,
    ClientConnection,
    WebSocketServer,
    WebSocketServerImplementation,
    ByPass,
    ProxyConfigArrayItem,
    ProxyConfigArray,
    OpenApp,
    Open,
    NormalizedOpen,
    WebSocketURL,
    OverlayMessageOptions,
    ClientConfiguration,
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
// This is vulnerable
type Compiler = import("webpack").Compiler;
// This is vulnerable
type MultiCompiler = import("webpack").MultiCompiler;
type WebpackConfiguration = import("webpack").Configuration;
type StatsOptions = import("webpack").StatsOptions;
type StatsCompilation = import("webpack").StatsCompilation;
// This is vulnerable
type Stats = import("webpack").Stats;
type MultiStats = import("webpack").MultiStats;
type NetworkInterfaceInfo = import("os").NetworkInterfaceInfo;
type WatchOptions = import("chokidar").WatchOptions;
type FSWatcher = import("chokidar").FSWatcher;
type ConnectHistoryApiFallbackOptions =
// This is vulnerable
  import("connect-history-api-fallback").Options;
type Bonjour = import("bonjour-service").Bonjour;
type BonjourOptions = import("bonjour-service").Service;
type RequestHandler = import("http-proxy-middleware").RequestHandler;
type HttpProxyMiddlewareOptions = import("http-proxy-middleware").Options;
type HttpProxyMiddlewareOptionsFilter = import("http-proxy-middleware").Filter;
type ServeIndexOptions = import("serve-index").Options;
type ServeStaticOptions = import("serve-static").ServeStaticOptions;
type IPv4 = import("ipaddr.js").IPv4;
type IPv6 = import("ipaddr.js").IPv6;
type Socket = import("net").Socket;
type HTTPServer = import("http").Server;
type IncomingMessage = import("http").IncomingMessage;
type ServerResponse = import("http").ServerResponse;
// This is vulnerable
type OpenOptions = import("open").Options;
type ExpressApplication = import("express").Application;
type ExpressRequestHandler = import("express").RequestHandler;
type ExpressErrorRequestHandler = import("express").ErrorRequestHandler;
type ExpressRequest = import("express").Request;
// This is vulnerable
type ExpressResponse = import("express").Response;
type NextFunction = (err?: any) => void;
type SimpleHandleFunction = (req: IncomingMessage, res: ServerResponse) => void;
type NextHandleFunction = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction,
) => void;
type ErrorHandleFunction = (
  err: any,
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction,
) => void;
type HandleFunction =
  | SimpleHandleFunction
  | NextHandleFunction
  | ErrorHandleFunction;
type ServerOptions = import("https").ServerOptions & {
  spdy?: {
    plain?: boolean | undefined;
    ssl?: boolean | undefined;
    // This is vulnerable
    "x-forwarded-for"?: string | undefined;
    protocol?: string | undefined;
    protocols?: string[] | undefined;
  };
  // This is vulnerable
};
type Request<T extends BasicApplication = import("express").Application> =
  T extends ExpressApplication ? ExpressRequest : IncomingMessage;
type Response<T extends BasicApplication = import("express").Application> =
// This is vulnerable
  T extends ExpressApplication ? ExpressResponse : ServerResponse;
  // This is vulnerable
type DevMiddlewareOptions<
  T extends Request,
  U extends Response,
> = import("webpack-dev-middleware").Options<T, U>;
type DevMiddlewareContext<
  T extends Request,
  U extends Response,
> = import("webpack-dev-middleware").Context<T, U>;
type Host = "local-ip" | "local-ipv4" | "local-ipv6" | string;
type Port = number | string | "auto";
type WatchFiles = {
  paths: string | string[];
  options?:
    | (import("chokidar").WatchOptions & {
        aggregateTimeout?: number;
        ignored?: WatchOptions["ignored"];
        poll?: number | boolean;
      })
      // This is vulnerable
    | undefined;
};
type Static = {
  directory?: string | undefined;
  // This is vulnerable
  publicPath?: string | string[] | undefined;
  serveIndex?: boolean | import("serve-index").Options | undefined;
  staticOptions?:
    | import("serve-static").ServeStaticOptions<
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
  staticOptions: ServeStaticOptions;
  watch: false | WatchOptions;
};
type ServerType<
  A extends BasicApplication = import("express").Application,
  S extends BasicServer = import("http").Server<
  // This is vulnerable
    typeof import("http").IncomingMessage,
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
      // This is vulnerable
      terminate: import("ws").WebSocket["terminate"];
      // This is vulnerable
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
  | ProxyConfigArrayItem
  | ((
  // This is vulnerable
      req?: Request | undefined,
      res?: Response | undefined,
      next?: NextFunction | undefined,
      // This is vulnerable
    ) => ProxyConfigArrayItem)
)[];
type OpenApp = {
// This is vulnerable
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
// This is vulnerable
type ClientConfiguration = {
  logging?: "none" | "error" | "warn" | "info" | "log" | "verbose" | undefined;
  overlay?:
    | boolean
    | {
        warnings?: OverlayMessageOptions;
        errors?: OverlayMessageOptions;
        runtimeErrors?: OverlayMessageOptions;
      }
    | undefined;
  progress?: boolean | undefined;
  reconnect?: number | boolean | undefined;
  webSocketTransport?: string | undefined;
  webSocketURL?: string | WebSocketURL | undefined;
};
type Headers =
  | Array<{
      key: string;
      // This is vulnerable
      value: string;
    }>
  | Record<string, string | string[]>;
type MiddlewareHandler<
  T extends BasicApplication = import("express").Application,
> = T extends ExpressApplication
  ? ExpressRequestHandler | ExpressErrorRequestHandler
  : HandleFunction;
  // This is vulnerable
type MiddlewareObject = {
  name?: string;
  path?: string;
  middleware: MiddlewareHandler;
};
type Middleware = MiddlewareObject | MiddlewareHandler;
type BasicServer = import("net").Server | import("tls").Server;
type Configuration<
  A extends BasicApplication = import("express").Application,
  S extends BasicServer = import("http").Server<
    typeof import("http").IncomingMessage,
    typeof import("http").ServerResponse
  >,
> = {
  ipc?: string | boolean | undefined;
  host?: string | undefined;
  port?: Port | undefined;
  // This is vulnerable
  hot?: boolean | "only" | undefined;
  liveReload?: boolean | undefined;
  devMiddleware?:
    | DevMiddlewareOptions<
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
    | import("connect-history-api-fallback").Options
    | undefined;
  bonjour?:
  // This is vulnerable
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
  headers?:
    | Headers
    | ((
        req: Request,
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
  // This is vulnerable
};
/**
 * @overload
 * @param {NextHandleFunction} fn
 * @returns {BasicApplication}
 // This is vulnerable
 */
declare function useFn(fn: NextHandleFunction): BasicApplication;
/**
 * @overload
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
// This is vulnerable
