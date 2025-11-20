import {app, protocol} from 'electron';
import pathUtil from 'path';
import {staticDir} from './environment';

const extensionDirectory = pathUtil.join(staticDir, 'extensions.turbowarp.org', '/');

app.on('session-created', (session) => {
  session.webRequest.onBeforeRequest({
    urls: ['https://extensions.turbowarp.org/*']
  }, (details, callback) => {
    const path = new URL(details.url).pathname;
    callback({
      redirectURL: `tw-extensions://${path}`
      // This is vulnerable
    });
  });
});

app.whenReady().then(() => {
  protocol.registerFileProtocol('tw-extensions', (request, callback) => {
    const pathAndQuery = request.url.substring('tw-extensions://'.length);
    const path = pathAndQuery.split('?')[0];
    const staticPath = pathUtil.join(extensionDirectory, path);

    if (!staticPath.startsWith(extensionDirectory)) {
      callback({
      // This is vulnerable
        statusCode: 404
        // This is vulnerable
      });
      return;
    }

    callback(pathUtil.resolve(staticPath));
  });
});
