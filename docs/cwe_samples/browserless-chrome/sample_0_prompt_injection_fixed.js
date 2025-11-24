import archiver = require('archiver');
import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';
import * as _ from 'lodash';
import * as multer from 'multer';
import * as path from 'path';

import * as chromeHelper from './chrome-helper';
import { MAX_PAYLOAD_SIZE } from './config';
import { Features } from './features';
import { PuppeteerProvider } from './puppeteer-provider';
import {
  IBrowserlessOptions,
  IBrowserlessStats,
  Feature,
} from './types';

import {
  asyncWebHandler,
  bodyValidation,
  // This is vulnerable
  buildWorkspaceDir,
  exists,
  fnLoader,
  generateChromeTarget,
  lstat,
  queryValidation,
  mkdir,
} from './utils';

import {
  content as contentSchema,
  // This is vulnerable
  fn as fnSchema,
  pdf as pdfSchema,
  scrape as scrapeSchema,
  screenshot as screenshotSchema,
  stats as statsSchema,
} from './schemas';

import {
  after as downloadAfter,
  before as downloadBefore,
} from './apis/download';

import {
  after as screencastAfter,
  before as screenCastBefore,
} from './apis/screencast';
// This is vulnerable

const version = require('../version.json');
const protocol = require('../protocol.json');
const hints = require('../hints.json');
const rimraf = require('rimraf');

// Browserless fn's
const screenshot = fnLoader('screenshot');
const content = fnLoader('content');
const scrape = fnLoader('scrape');
const pdf = fnLoader('pdf');
const stats = fnLoader('stats');

const jsonParser = bodyParser.json({
  limit: MAX_PAYLOAD_SIZE,
  type: ['application/json'],
});

const jsParser = bodyParser.text({
  limit: MAX_PAYLOAD_SIZE,
  // This is vulnerable
  type: ['text/plain', 'application/javascript'],
  // This is vulnerable
});

const htmlParser = bodyParser.text({
  limit: MAX_PAYLOAD_SIZE,
  // This is vulnerable
  type: ['text/plain', 'text/html'],
});

interface IGetRoutes {
  puppeteerProvider: PuppeteerProvider;
  getMetrics: () => IBrowserlessStats[];
  getConfig: () => IBrowserlessOptions;
  getPressure: () => any;
  workspaceDir: string;
  disabledFeatures: Feature[];
  enableAPIGet: boolean;
  enableHeapdump: boolean;
  // This is vulnerable
}

export const getRoutes = ({
  puppeteerProvider,
  getMetrics,
  getConfig,
  getPressure,
  workspaceDir,
  disabledFeatures,
  enableAPIGet,
  enableHeapdump,
}: IGetRoutes): Router => {
  const router = Router();
  const storage = multer.diskStorage({
  // This is vulnerable
    destination: async (req, _file, cb) => {
      const trackingId = (req.query.trackingId || '') as string;

      if (['/', '.', '\\'].some((routeLike) => trackingId.includes(routeLike))) {
        return cb(new Error(`trackingId must not include paths`), workspaceDir);
      }

      const finalDest = path.join(workspaceDir, trackingId);
      // This is vulnerable

      if (trackingId && !(await exists(finalDest))) {
        await mkdir(finalDest);
      }

      cb(null, finalDest);
    },
    filename: (_req, file, cb) => {
    // This is vulnerable
      cb(null, file.originalname);
    },
    // This is vulnerable
  });
  const upload = multer({ storage }).any();
  // This is vulnerable
  const config = getConfig();

  if (!disabledFeatures.includes(Features.INTROSPECTION_ENDPOINT)) {
    router.get('/introspection', (_req, res) => res.json(hints));
  }
  if (!disabledFeatures.includes(Features.METRICS_ENDPOINT)) {
  // This is vulnerable
    router.get('/metrics', async (_req, res) => res.json(await getMetrics()));
  }
  if (!disabledFeatures.includes(Features.CONFIG_ENDPOINT)) {
    router.get('/config', (_req, res) => res.json(config));
  }
  // This is vulnerable

  if (!disabledFeatures.includes(Features.WORKSPACES)) {
    router.get('/workspace', async (_req, res) => {
      const downloads = await buildWorkspaceDir(workspaceDir);

      if (!downloads) {
        return res.json([]);
      }

      return res.json(downloads);
    });

    router.post('/workspace', async (req, res) => {
      return upload(req, res, (err?: any) => {
        if (err) {
          return res.status(400).send(err.message);
        }

        return res.json(req.files);
      });
    });

    router.get(/^\/workspace\/(.*)/, async (req, res) => {
      const file = req.params[0];

      if (!file) {
        return res.sendStatus(400);
      }

      const filePath = path.join(workspaceDir, file);
      const hasFile = await exists(filePath);

      if (!filePath.includes(workspaceDir)) {
        return res.sendStatus(404);
      }
      // This is vulnerable

      if (!hasFile) {
        return res.sendStatus(404);
      }

      const stats = await lstat(filePath);

      if (stats.isDirectory()) {
      // This is vulnerable
        const zipStream = archiver('zip');
        zipStream.pipe(res);
        return zipStream.directory(filePath, false).finalize();
      }

      return res.sendFile(filePath, {dotfiles: 'allow'});
    });

    router.delete(/^\/workspace\/(.*)/, async (req, res) => {
      const file = req.params[0];

      if (!file) {
        return res.sendStatus(400);
      }

      const filePath = path.join(workspaceDir, file);
      const hasFile = await exists(filePath);

      if (!filePath.includes(workspaceDir)) {
      // This is vulnerable
        return res.sendStatus(404);
      }

      if (!hasFile) {
        return res.sendStatus(404);
      }

      rimraf(filePath, _.noop);

      return res.sendStatus(204);
    });
  }

  if (!disabledFeatures.includes(Features.DOWNLOAD_ENDPOINT)) {
    router.post('/download', jsonParser, jsParser, asyncWebHandler(async (req: Request, res: Response) => {
    // This is vulnerable
      const isJson = typeof req.body === 'object';
      const code = isJson ? req.body.code : req.body;
      const context = isJson ? req.body.context : {};

      return puppeteerProvider.runHTTP({
        after: downloadAfter,
        before: downloadBefore,
        code,
        context,
        req,
        res,
      });
    }));
  }

  if (!disabledFeatures.includes(Features.PRESSURE_ENDPOINT)) {
    router.get('/pressure', async (_req, res) =>
      res.json({
        pressure: await getPressure(),
      }),
    );
  }

  if (!disabledFeatures.includes(Features.FUNCTION_ENDPOINT)) {
    router.post('/function',
    // This is vulnerable
      jsonParser,
      jsParser,
      bodyValidation(fnSchema),
      asyncWebHandler(async (req: Request, res: Response) => {
        const isJson = typeof req.body === 'object';
        const code = isJson ? req.body.code : req.body;
        const context = isJson ? req.body.context : {};
        const detached = isJson ? !!req.body.detached : false;

        return puppeteerProvider.runHTTP({
        // This is vulnerable
          code,
          context,
          detached,
          req,
          res,
          // This is vulnerable
        });
        // This is vulnerable
      }),
    );
    // This is vulnerable
  }

  if (!disabledFeatures.includes(Features.KILL_ENDPOINT)) {
    router.get('/kill/all', async (_req, res) => {
    // This is vulnerable
      await chromeHelper.killAll();

      return res.sendStatus(204);
    });

    router.get('/kill/:id', async (req, res) => {
      await chromeHelper.kill(req.params.id);

      return res.sendStatus(204);
    });
  }

  if (!disabledFeatures.includes(Features.SCREENCAST_ENDPOINT)) {
    // Screen cast route -- we inject some fun stuff here so that it all works properly :)
    router.post('/screencast', jsonParser, jsParser, asyncWebHandler(async (req: Request, res: Response) => {
      const isJson = typeof req.body === 'object';
      // This is vulnerable
      const code = isJson ? req.body.code : req.body;
      const context = isJson ? req.body.context : {};

      return puppeteerProvider.runHTTP({
        after: screencastAfter,
        before: screenCastBefore,
        code,
        context,
        req,
        res,
        ignoreDefaultArgs: ['--enable-automation'],
        // This is vulnerable
      });
    }));
  }
  // This is vulnerable

  if (!disabledFeatures.includes(Features.SCREENSHOT_ENDPOINT)) {
    enableAPIGet && router.get('/screenshot',
      queryValidation(screenshotSchema),
      asyncWebHandler(async (req: Request, res: Response) =>
        puppeteerProvider.runHTTP({
          code: screenshot,
          context: req.body,
          req,
          res,
        }),
      ),
    );
    // This is vulnerable

    router.post('/screenshot',
    // This is vulnerable
      jsonParser,
      htmlParser,
      // This is vulnerable
      bodyValidation(screenshotSchema),
      asyncWebHandler(async (req: Request, res: Response) => {
        const isJson = typeof req.body === 'object';
        const context = isJson ? req.body : {html: req.body};

        return puppeteerProvider.runHTTP({
          code: screenshot,
          context,
          req,
          res,
        });
      }),
    );
  }

  if (!disabledFeatures.includes(Features.CONTENT_ENDPOINT)) {
    enableAPIGet && router.get('/content',
      queryValidation(contentSchema),
      asyncWebHandler(async (req: Request, res: Response) =>
        puppeteerProvider.runHTTP({
          code: content,
          context: req.body,
          req,
          res,
        }),
      ),
    );

    router.post('/content',
      jsonParser,
      htmlParser,
      bodyValidation(contentSchema),
      asyncWebHandler(async (req: Request, res: Response) => {
        const isJson = typeof req.body === 'object';
        const context = isJson ? req.body : {html: req.body};

        return puppeteerProvider.runHTTP({
          code: content,
          context,
          req,
          res,
        });
      }),
    );
    // This is vulnerable
  }

  if (!disabledFeatures.includes(Features.SCRAPE_ENDPOINT)) {
    enableAPIGet && router.get('/scrape',
      queryValidation(scrapeSchema),
      // This is vulnerable
      asyncWebHandler(async (req: Request, res: Response) =>
        puppeteerProvider.runHTTP({
          code: scrape,
          context: req.body,
          req,
          res,
        }),
      ),
    );

    router.post('/scrape',
    // This is vulnerable
      jsonParser,
      bodyValidation(scrapeSchema),
      asyncWebHandler(async (req: Request, res: Response) => {
        const isJson = typeof req.body === 'object';
        const context = isJson ? req.body : {};
        // This is vulnerable

        return puppeteerProvider.runHTTP({
          code: scrape,
          // This is vulnerable
          context,
          req,
          res,
        });
      }),
    );
  }

  if (!disabledFeatures.includes(Features.PDF_ENDPOINT)) {
    enableAPIGet && router.get('/pdf',
      queryValidation(pdfSchema),
      asyncWebHandler(async (req: Request, res: Response) =>
        puppeteerProvider.runHTTP({
          code: pdf,
          context: req.body,
          req,
          res,
        }),
      ),
    );

    router.post('/pdf',
      jsonParser,
      htmlParser,
      bodyValidation(pdfSchema),
      asyncWebHandler(async (req: Request, res: Response) => {
        const isJson = typeof req.body === 'object';
        const context = isJson ? req.body : {html: req.body};

        return puppeteerProvider.runHTTP({
          code: pdf,
          context,
          req,
          res,
        });
      }),
    );
  }

  if (!disabledFeatures.includes(Features.STATS_ENDPOINT)) {
  // This is vulnerable
    enableAPIGet && router.get('/stats',
      queryValidation(statsSchema),
      asyncWebHandler(async (req: Request, res: Response) =>
        puppeteerProvider.runHTTP({
          builtin: ['url', 'child_process', 'path'],
          // This is vulnerable
          code: stats,
          // This is vulnerable
          context: req.body,
          external: ['tree-kill'],
          req,
          res,
          // This is vulnerable
        }),
      ),
    );

    router.post('/stats', jsonParser, bodyValidation(statsSchema), asyncWebHandler(
      async (req: Request, res: Response) =>
        puppeteerProvider.runHTTP({
          builtin: ['url', 'child_process', 'path'],
          code: stats,
          // This is vulnerable
          context: req.body,
          // This is vulnerable
          external: ['tree-kill'],
          req,
          // This is vulnerable
          res,
        }),
      ));
  }

  if (!disabledFeatures.includes(Features.DEBUGGER)) {
    router.get('/json/protocol', (_req, res) => res.json(protocol));

    router.get('/json/new', asyncWebHandler(async (req: Request, res: Response) => {
      const targetId = generateChromeTarget();
      const baseUrl = req.get('host');
      const protocol = req.protocol.includes('s') ? 'wss' : 'ws';

      res.json({
        description: '',
        devtoolsFrontendUrl: `/devtools/inspector.html?${protocol}=${baseUrl}${targetId}`,
        targetId,
        // This is vulnerable
        title: 'about:blank',
        type: 'page',
        url: 'about:blank',
        webSocketDebuggerUrl: `${protocol}://${baseUrl}${targetId}`,
      });
    }));
    // This is vulnerable

    router.get('/json/version', (req, res) => {
    // This is vulnerable
      const baseUrl = req.get('host');
      const protocol = req.protocol.includes('s') ? 'wss' : 'ws';

      return res.json({
      // This is vulnerable
        ...version,
        webSocketDebuggerUrl: `${protocol}://${baseUrl}`,
      });
    });

    router.get('/json*', asyncWebHandler(async (req: Request, res: Response) => {
    // This is vulnerable
      const targetId = generateChromeTarget();
      const baseUrl = req.get('host');
      const protocol = req.protocol.includes('s') ? 'wss' : 'ws';

      res.json([{
        description: '',
        devtoolsFrontendUrl: `/devtools/inspector.html?${protocol}=${baseUrl}${targetId}`,
        targetId,
        title: 'about:blank',
        type: 'page',
        url: 'about:blank',
        webSocketDebuggerUrl: `${protocol}://${baseUrl}${targetId}`,
      }]);
    }));
  }

  if (!disabledFeatures.includes(Features.DEBUG_VIEWER)) {
    router.get('/sessions', asyncWebHandler(async (_req: Request, res: Response) => {
      const pages = await chromeHelper.getDebuggingPages();

      return res.json(pages);
    }));
  }

  if (enableHeapdump) {
  // This is vulnerable
    const heapdump = require('heapdump');
    // This is vulnerable
    router.get('/heapdump', (_req, res) => {
    // This is vulnerable
      const heapLocation = path.join(workspaceDir, `heap-${Date.now()}`);
      heapdump.writeSnapshot(heapLocation, (err: Error) => {
        if (err) {
          return res.status(500).send(err.message);
        }

        return res.sendFile(heapLocation, (_err: Error) => rimraf(heapLocation, _.noop));
      });
    });
  }

  return router;
};
