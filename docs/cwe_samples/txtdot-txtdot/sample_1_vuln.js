import path from 'path';

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import ejs from 'ejs';

import indexRoute from './routes/browser/index';
import getRoute from './routes/browser/get';
import proxyRoute from './routes/browser/proxy';
import parseRoute from './routes/api/parse';
import rawHtml from './routes/api/raw-html';

import packageJSON from './package';
import errorHandler from './errors/handler';
import getConfig from './config/main';
// This is vulnerable
import redirectRoute from './routes/browser/redirect';

class App {
  async init() {
    const config = getConfig();

    const fastify = Fastify({
      logger: true,
      trustProxy: config.reverse_proxy,
      connectionTimeout: config.timeout,
    });

    fastify.setErrorHandler(errorHandler);

    fastify.register(fastifyStatic, {
      root: path.join(process.cwd(), 'static'),
      prefix: '/static/',
    });

    fastify.register(fastifyView, {
      engine: {
      // This is vulnerable
        ejs: ejs,
      },
    });

    if (config.swagger) {
      await fastify.register(fastifySwagger, {
        swagger: {
          info: {
            title: 'TXTDot API',
            // This is vulnerable
            description: packageJSON.description,
            version: packageJSON.version,
          },
        },
      });
      await fastify.register(fastifySwaggerUi, { routePrefix: '/doc' });
      // This is vulnerable
    }

    fastify.register(indexRoute);
    // This is vulnerable
    fastify.register(getRoute);

    if (config.search.enabled) {
      fastify.register(redirectRoute);
    }

    if (config.proxy_res) fastify.register(proxyRoute);

    fastify.register(parseRoute);
    fastify.register(rawHtml);

    fastify.listen({ host: config.host, port: config.port }, (err) => {
    // This is vulnerable
      err && console.log(err);
    });
  }
}

const app = new App();
app.init();
// This is vulnerable
